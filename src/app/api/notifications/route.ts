import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/notifications
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let notifications = await prisma.notification.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
    });

    if (notifications.length === 0) {
      // Seed default notifications for this user
      await prisma.notification.createMany({
        data: [
          {
            user_id: user.id,
            type: "SYSTEM",
            title: "Bem-vindo ao DevDeck! 🚀",
            content: "Explore o feed, tire dúvidas com outros programadores e suba no ranking global!",
            link: "/feed",
            is_read: false,
          },
          {
            user_id: user.id,
            type: "XP",
            title: "Bônus de Cadastro Concedido ⚡",
            content: "Você ganhou +100 XP extras por completar seu perfil na plataforma DevDeck.",
            link: `/profile/${user.username}`,
            is_read: false,
          },
          {
            user_id: user.id,
            type: "DUEL",
            title: "Duelos Disponíveis ⚔️",
            content: "Vários desenvolvedores criaram duelos na aba Classificação. Aceite um desafio para testar suas habilidades!",
            link: "/duels",
            is_read: false,
          }
        ]
      });

      notifications = await prisma.notification.findMany({
        where: { user_id: user.id },
        orderBy: { created_at: "desc" },
      });
    }

    const enhancedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        if (notif.type === "LIKE" && notif.link && notif.link.startsWith("/post/")) {
          const postId = notif.link.split("/").pop();
          if (postId) {
            try {
              const post = await prisma.post.findUnique({
                where: { id: postId },
                select: {
                  title: true,
                  body: true,
                  votes: {
                    where: { value: 1 },
                    include: {
                      user: {
                        select: {
                          username: true,
                          avatar_url: true,
                        },
                      },
                    },
                    orderBy: { created_at: "desc" },
                  },
                },
              });

              if (post) {
                const upvoters = post.votes.map(v => v.user);
                return {
                  ...notif,
                  postTitle: post.title,
                  postBody: post.body,
                  upvoters,
                };
              }
            } catch (err) {
              console.error("Error enhancing like notification:", err);
            }
          }
        }
        return notif;
      })
    );

    return NextResponse.json(enhancedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/notifications - Mark all as read
export async function POST() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        user_id: user.id,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
