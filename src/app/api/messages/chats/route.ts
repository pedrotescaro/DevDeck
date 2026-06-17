import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Check if the user has any messages
    const messageCount = await prisma.message.count({
      where: {
        OR: [
          { sender_id: user.id },
          { receiver_id: user.id },
        ],
      },
    });

    if (messageCount === 0) {
      // Find other users in the platform to start a conversation with
      const otherUsers = await prisma.user.findMany({
        where: {
          NOT: { id: user.id },
        },
        take: 3,
      });

      if (otherUsers.length > 0) {
        // Seed some initial friendly chat messages
        const initialMessages = [];
        
        if (otherUsers[0]) {
          initialMessages.push({
            sender_id: otherUsers[0].id,
            receiver_id: user.id,
            content: "E aí! Curti muito o seu post sobre desenvolvimento. Bora marcar um pareamento qualquer dia?",
          });
        }
        if (otherUsers[1]) {
          initialMessages.push({
            sender_id: otherUsers[1].id,
            receiver_id: user.id,
            content: "Oi! Vi que você está resolvendo a trilha de Python. Teve alguma dificuldade com o borrow checker no Rust?",
          });
        }
        if (otherUsers[2]) {
          initialMessages.push({
            sender_id: user.id, // sent by current user
            receiver_id: otherUsers[2].id,
            content: "Ei, achei massa seu perfil! Depois dá uma olhada nos meus duelos de código.",
          });
        }

        await prisma.message.createMany({
          data: initialMessages,
        });
      }
    }

    // Fetch all messages involving the user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: user.id },
          { receiver_id: user.id },
        ],
      },
      orderBy: { created_at: "desc" },
    });

    // Group by conversation partner
    const chatsMap = new Map<string, any>();

    for (const msg of messages) {
      const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!chatsMap.has(partnerId)) {
        chatsMap.set(partnerId, {
          lastMessage: msg.content,
          lastMessageTime: msg.created_at,
          lastSenderId: msg.sender_id,
          partnerId: partnerId,
        });
      }
    }

    const chatsList = Array.from(chatsMap.values());

    // Fetch partner details
    const partners = await prisma.user.findMany({
      where: {
        id: { in: chatsList.map(c => c.partnerId) },
      },
      select: {
        id: true,
        username: true,
        avatar_url: true,
      },
    });

    const result = chatsList
      .map(c => {
        const partner = partners.find(p => p.id === c.partnerId);
        return {
          ...c,
          partner,
        };
      })
      .filter(c => c.partner !== undefined)
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Erro ao buscar conversas" }, { status: 500 });
  }
}
