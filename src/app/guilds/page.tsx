import { prisma } from '@/lib/prisma';
import { GuildsClient } from './GuildsClient';

export const dynamic = 'force-dynamic';

export default async function GuildsPage() {
  const guilds = await prisma.guild.findMany({
    where: { is_public: true },
    include: {
      _count: { select: { members: true } },
      owner: { select: { username: true, avatar_url: true } },
    },
    orderBy: { created_at: 'desc' },
    take: 50,
  });

  const serialized = guilds.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    description: g.description,
    icon: g.icon,
    language: g.language,
    memberCount: g._count.members,
    owner: g.owner,
    createdAt: g.created_at.toISOString(),
  }));

  return <GuildsClient initialGuilds={serialized} />;
}
