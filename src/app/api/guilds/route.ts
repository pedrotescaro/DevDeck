import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';

export const GET = apiHandler(async () => {
  const user = await requireAuth();

  const guilds = await prisma.guild.findMany({
    where: { is_public: true },
    include: {
      _count: { select: { members: true } },
      owner: { select: { username: true, avatar_url: true } },
      members: {
        where: { user_id: user.id },
        take: 1,
      },
    },
    orderBy: { created_at: 'desc' },
  });

  const guildsWithJoinStatus = guilds.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    description: g.description,
    icon: g.icon,
    language: g.language,
    is_public: g.is_public,
    created_at: g.created_at,
    memberCount: g._count.members,
    owner: g.owner,
    isMember: g.members.length > 0,
    ownerId: g.owner_id,
  }));

  // Also fetch user's own guilds
  const myGuilds = await prisma.guild.findMany({
    where: {
      members: { some: { user_id: user.id } },
    },
    include: {
      _count: { select: { members: true } },
      owner: { select: { username: true, avatar_url: true } },
    },
  });

  return NextResponse.json({ guilds: guildsWithJoinStatus, myGuilds });
});

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();
  const body = await req.json();
  const { name, description, language } = body;

  if (!name || name.trim().length < 3) {
    throw new AppError('INVALID_NAME', 'O nome da guilda deve ter pelo menos 3 caracteres', 400);
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const existing = await prisma.guild.findUnique({ where: { slug } });
  if (existing) {
    throw new AppError('SLUG_TAKEN', 'Já existe uma guilda com esse nome', 409);
  }

  const ownerId: string = String(user.id);

  const guild = await prisma.guild.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      language: language || null,
      owner_id: ownerId,
      members: {
        create: {
          user_id: ownerId,
          role: 'OWNER',
        },
      },
    },
    include: {
      _count: { select: { members: true } },
      owner: { select: { username: true, avatar_url: true } },
    },
  });

  return NextResponse.json({
    id: guild.id,
    name: guild.name,
    slug: guild.slug,
    description: guild.description,
    language: guild.language,
    memberCount: guild._count.members,
    owner: guild.owner,
    isMember: true,
  });
});
