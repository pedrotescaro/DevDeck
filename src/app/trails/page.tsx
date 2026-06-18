import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { TrailsContent } from './TrailsContent';

export const revalidate = 0; // Desabilitar cache para refletir XP ganho instantaneamente

export default async function TrailsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar todas as trilhas do usuário atual
  const dbTrails = await prisma.languageTrail.findMany({
    where: { user_id: user.id },
  });

  // Buscar todas as tentativas de quiz feitas pelo usuário
  const dbAttempts = await prisma.quizAttempt.findMany({
    where: { user_id: user.id },
    select: {
      quiz_id: true,
      is_correct: true,
    },
  });

  // Mapear tentativas para serialização fácil no cliente
  const attemptsMap: Record<string, boolean> = {};
  dbAttempts.forEach((att) => {
    attemptsMap[att.quiz_id] = att.is_correct;
  });

  // Serializar usuário
  const serializedUser = {
    id: user.id,
    username: user.username,
    avatar_url: user.avatar_url,
    total_xp: user.total_xp,
  };

  // Mapear trilhas
  const serializedTrails = dbTrails.map((t) => ({
    language: t.language,
    xp: t.xp,
    level: t.level,
  }));

  return (
    <TrailsContent
      user={serializedUser}
      initialTrails={serializedTrails}
      initialAttempts={attemptsMap}
    />
  );
}
