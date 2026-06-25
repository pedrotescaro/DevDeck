import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { FeedContent } from './FeedContent';

export const revalidate = 0; // Desabilitar cache para feed dinâmico

export default async function FeedPage() {
  const user = await getAuthUser();

  if (!user) {
    // Use query param to tell middleware to allow access to /login
    // even if a JWT cookie exists (avoids infinite redirect loop
    // when the database is unreachable).
    redirect('/login?reason=session_expired');
  }

  // 1. Buscar posts iniciais do feed com contagens de respostas e quizzes inclusos
  const posts = await prisma.post.findMany({
    orderBy: { created_at: 'desc' },
    take: 10,
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
      quizzes: {
        include: {
          attempts: {
            where: { user_id: user.id },
          },
        },
      },
      votes: {
        where: { user_id: user.id },
      },
    },
  });

  // 2. Buscar duelos de código iniciais
  const duels = await prisma.duel.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      challenger: {
        select: { username: true, avatar_url: true },
      },
      opponent: {
        select: { username: true, avatar_url: true },
      },
      solutions: {
        select: {
          user_id: true,
          vote_count: true,
        },
      },
    },
  });

  // Fetch bookmarks
  const dbBookmarks = await prisma.bookmark.findMany({
    where: { user_id: user.id },
    select: { post_id: true },
  });
  const bookmarksMap: Record<string, boolean> = {};
  dbBookmarks.forEach((b) => {
    bookmarksMap[b.post_id] = true;
  });

  // Fetch trails and badges
  const trails = await prisma.languageTrail.findMany({
    where: { user_id: user.id },
    orderBy: { xp: 'desc' },
  });

  const serializedPosts = posts.map((post) => ({
    ...post,
    created_at: post.created_at.toISOString(),
  }));

  const serializedDuels = duels.map((duel) => ({
    ...duel,
    created_at: duel.created_at.toISOString(),
  }));

  return (
    <FeedContent
      initialUser={{
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        total_xp: user.total_xp,
        streak: Math.max(
          user.streak_days,
          trails.reduce((max, t) => Math.max(max, t.streak), 0)
        ),
        trails: trails,
        badges: user.badges.map((b: any) => b.badge),
      }}
      initialPosts={serializedPosts}
      initialDuels={serializedDuels}
      initialBookmarks={bookmarksMap}
    />
  );
}
