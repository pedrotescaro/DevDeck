import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;

    const user = await prisma.user.findFirst({
      where: { 
        username: { equals: username, mode: 'insensitive' } 
      },
      include: {
        trails: {
          orderBy: { xp: "desc" },
        },
        badges: {
          include: {
            badge: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Calcular estatísticas do usuário
    const answersCount = await prisma.answer.count({
      where: { author_id: user.id },
    });

    const acceptedCount = await prisma.answer.count({
      where: { author_id: user.id, is_accepted: true },
    });

    const totalQuizAttempts = await prisma.quizAttempt.count({
      where: { user_id: user.id },
    });

    const correctQuizAttempts = await prisma.quizAttempt.count({
      where: { user_id: user.id, is_correct: true },
    });

    const accuracy = totalQuizAttempts > 0 ? Math.round((correctQuizAttempts / totalQuizAttempts) * 100) : 0;

    return NextResponse.json({
      user: {
        username: user.username,
        avatar_url: user.avatar_url,
        bio: user.bio,
        institution: user.institution,
        total_xp: user.total_xp,
        created_at: user.created_at,
        badges: user.badges.map((ub) => ({
          slug: ub.badge.slug,
          label: ub.badge.label,
          description: ub.badge.description,
          icon: ub.badge.icon,
          color: ub.badge.color,
          earned_at: ub.earned_at,
        })),
      },
      stats: {
        answers_count: answersCount,
        accuracy,
        accepted_count: acceptedCount,
      },
      trails: user.trails,
    });
  } catch (error) {
    console.error("Error fetching user profile stats:", error);
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
  }
}
