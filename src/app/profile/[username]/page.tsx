import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { ProfileContent } from './ProfileContent';

export const revalidate = 0; // Desabilitar cache para dados dinâmicos do perfil

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const [user, { username }] = await Promise.all([getAuthUser(), params]);

  if (!user) {
    redirect('/login');
  }

  // Buscar usuário dono do perfil
  const profileUser = await prisma.user.findFirst({
    where: {
      username: { equals: username, mode: 'insensitive' },
    },
    include: {
      trails: {
        orderBy: { xp: 'desc' },
      },
      badges: {
        include: {
          badge: true,
        },
      },
    },
  });

  if (!profileUser) {
    notFound();
  }

  // Buscar todos os badges cadastrados no sistema
  const profileId = profileUser.id;

  // Calcular estatísticas
  const [
    allBadges,
    answersCount,
    acceptedCount,
    totalAttempts,
    correctAttempts,
    follow,
    followersCount,
    followingCount,
  ] = await Promise.all([
    prisma.badge.findMany({ orderBy: { slug: 'asc' } }),
    prisma.answer.count({ where: { author_id: profileId } }),
    prisma.answer.count({ where: { author_id: profileId, is_accepted: true } }),
    prisma.quizAttempt.count({ where: { user_id: profileId } }),
    prisma.quizAttempt.count({ where: { user_id: profileId, is_correct: true } }),
    prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: profileId,
        },
      },
    }),
    prisma.follow.count({ where: { followingId: profileId } }),
    prisma.follow.count({ where: { followerId: profileId } }),
  ]);

  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  // Serializar
  const serializedProfileUser = {
    id: profileUser.id,
    username: profileUser.username,
    avatar_url: profileUser.avatar_url,
    bio: profileUser.bio,
    institution: profileUser.institution,
    github_username: profileUser.github_username,
    discord_username: profileUser.discord_username,
    banner_url: profileUser.banner_url,
    pronouns: profileUser.pronouns,
    birthday: profileUser.birthday ? profileUser.birthday.toISOString() : null,
    created_at: profileUser.created_at.toISOString(),
    total_xp: profileUser.total_xp,
    badges: profileUser.badges.map((ub) => ({
      slug: ub.badge.slug,
      earned_at: ub.earned_at.toISOString(),
    })),
  };

  const serializedTrails = profileUser.trails.map((t) => ({
    language: t.language,
    xp: t.xp,
    level: t.level,
  }));

  const serializedAllBadges = allBadges.map((b) => ({
    slug: b.slug,
    label: b.label,
    description: b.description,
    icon: b.icon,
    color: b.color,
  }));

  // Verificar se o usuário atual segue este perfil
  const isFollowing = follow !== null;

  return (
    <ProfileContent
      user={{
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        total_xp: user.total_xp,
      }}
      profileUser={serializedProfileUser}
      stats={{
        answers_count: answersCount,
        accuracy,
        accepted_count: acceptedCount,
      }}
      trails={serializedTrails}
      allBadges={serializedAllBadges}
      isFollowing={isFollowing}
      followersCount={followersCount}
      followingCount={followingCount}
    />
  );
}
