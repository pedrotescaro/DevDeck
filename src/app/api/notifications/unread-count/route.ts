import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ count: 0 });
    }

    // Check if user has any notifications at all
    const totalCount = await prisma.notification.count({
      where: { user_id: user.id },
    });

    if (totalCount === 0) {
      // Seed default notifications
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
    }

    const count = await prisma.notification.count({
      where: {
        user_id: user.id,
        is_read: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    return NextResponse.json({ count: 0 });
  }
}
