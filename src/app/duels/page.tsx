import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { DuelsContent } from './DuelsContent';

export const revalidate = 0; // Desabilitar cache para dados dinâmicos de duelos

export default async function DuelsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar todos os duelos
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

  const serializedDuels = duels.map((duel) => ({
    ...duel,
    created_at: duel.created_at.toISOString(),
  }));

  return (
    <DuelsContent
      user={{
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        total_xp: user.total_xp,
      }}
      initialDuels={serializedDuels}
    />
  );
}
