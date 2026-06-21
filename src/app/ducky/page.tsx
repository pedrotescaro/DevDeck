import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DuckyContent } from './DuckyContent';

export const revalidate = 0; // Desabilitar cache para verificar sessão ativa

export default async function DuckyPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar a trilha principal do usuário (com maior XP) para contextualizar a IA
  const dbTrails = await prisma.languageTrail.findMany({
    where: { user_id: user.id },
    orderBy: { xp: 'desc' },
  });
  const activeLanguage = dbTrails[0]?.language || 'JS';

  // Serializar usuário
  const serializedUser = {
    id: user.id,
    username: user.username,
    avatar_url: user.avatar_url,
    total_xp: user.total_xp,
  };

  return <DuckyContent user={serializedUser} activeLanguage={activeLanguage} />;
}
