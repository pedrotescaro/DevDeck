import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/messages?receiver_id=[userId]
export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get("receiver_id");

    if (!receiverId) {
      return NextResponse.json({ error: "ID do destinatário é obrigatório" }, { status: 400 });
    }

    // Fetch conversation history
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: user.id, receiver_id: receiverId },
          { sender_id: receiverId, receiver_id: user.id },
        ],
      },
      orderBy: { created_at: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 });
  }
}

// POST /api/messages
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { receiver_id, content } = body;

    if (!receiver_id || !content || content.trim() === "") {
      return NextResponse.json({ error: "Destinatário e conteúdo são obrigatórios" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        sender_id: user.id,
        receiver_id,
        content: content.trim(),
      },
    });

    // Notify receiver
    try {
      await prisma.notification.create({
        data: {
          user_id: receiver_id,
          type: "SYSTEM",
          title: "Mensagem Recebida 💬",
          content: `@${user.username} enviou uma mensagem para você no Bate-papo.`,
          link: "/messages",
          is_read: false,
        },
      });
    } catch (err) {
      console.error("Error creating chat notification:", err);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 });
  }
}
