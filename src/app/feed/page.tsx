import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { PostService } from '@/services/post.service';
import { FeedContent } from './FeedContent';

export const revalidate = 0;

export default async function FeedPage() {
  const user = await getAuthUser();

  if (!user) {
    // Permite que o middleware abra o login mesmo quando existe um cookie expirado.
    redirect('/login?reason=session_expired');
  }

  // Só o conteúdo essencial bloqueia o primeiro paint. Duelos e atividade semanal
  // são carregados no cliente depois que o feed já está utilizável.
  const feed = await PostService.getFeed(user.id, { limit: 10 });
  const bookmarksMap: Record<string, boolean> = {};

  feed.items.forEach((post) => {
    if (post.bookmarks.length > 0) bookmarksMap[post.id] = true;
  });

  const serializedPosts = feed.items.map((post) => ({
    ...post,
    created_at: post.created_at.toISOString(),
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
          user.trails.reduce(
            (max: number, trail: { streak: number }) => Math.max(max, trail.streak),
            0
          )
        ),
        trails: [...user.trails].sort((a, b) => b.xp - a.xp),
        badges: user.badges.map((userBadge: any) => userBadge.badge),
      }}
      initialPosts={serializedPosts}
      initialNextCursor={feed.nextCursor}
      initialBookmarks={bookmarksMap}
    />
  );
}
