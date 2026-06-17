import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;

    const user = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
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

    const accuracy =
      totalQuizAttempts > 0 ? Math.round((correctQuizAttempts / totalQuizAttempts) * 100) : 0;

    // Fetch author posts with cursor-based pagination (10 per page)
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limit = 10;

    let cursorTime: Date | null = null;
    let cursorId: string | null = null;
    if (cursor) {
      const parts = cursor.split("_");
      if (parts.length === 2) {
        cursorTime = new Date(parseInt(parts[0], 10));
        cursorId = parts[1];
      }
    }

    const postWhereClause: any = { author_id: user.id };
    if (cursorTime && cursorId) {
      postWhereClause.OR = [
        { created_at: { lt: cursorTime } },
        { created_at: cursorTime, id: { lt: cursorId } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: postWhereClause,
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      take: limit + 1,
      include: {
        author: {
          select: {
            username: true,
            avatar_url: true,
            total_xp: true,
          },
        },
        _count: {
          select: { answers: true },
        },
        votes: { where: { user_id: user.id } },
        bookmarks: { where: { user_id: user.id } },
      },
    });

    const hasNext = posts.length > limit;
    const items = hasNext ? posts.slice(0, limit) : posts;

    let nextCursor = null;
    if (hasNext && items.length > 0) {
      const lastPost = items[items.length - 1];
      const lastTime = new Date(lastPost.created_at).getTime();
      nextCursor = `${lastTime}_${lastPost.id}`;
    }

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
      posts: {
        items,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile stats:", error);
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
  }
}
