import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { LeaderboardClient } from './LeaderboardClient';

export const revalidate = 0; // Desabilitar cache para ranking dinâmico

export default async function LeaderboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar ranking global inicial (Top 10)
  const leaders = await prisma.user.findMany({
    orderBy: { total_xp: 'desc' },
    take: 10,
    select: {
      username: true,
      avatar_url: true,
      total_xp: true,
    },
  });

  const formattedLeaders = leaders.map((leader, index) => ({
    rank: index + 1,
    username: leader.username,
    avatar_url: leader.avatar_url,
    xp: leader.total_xp,
    level: Math.max(1, Math.floor(leader.total_xp / 1000) + 1), // Nível global dinâmico
  }));

  const trails = await prisma.languageTrail.findMany({
    where: { user_id: user.id },
  });

  return (
    <LeaderboardClient
      initialUser={{
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        total_xp: user.total_xp,
        streak: trails.reduce((max, t) => Math.max(max, t.streak), 0),
      }}
      initialLeaderboard={formattedLeaders}
    />
  );
}
