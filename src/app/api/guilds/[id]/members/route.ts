import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';

export const POST = apiHandler(async (req, { params }) => {
  const user = await requireAuth();
  const { id } = await params;
  const guildId: string = String(id);

  const guild = await prisma.guild.findUnique({ where: { id: guildId } });
  if (!guild) throw new AppError('GUILD_NOT_FOUND', 'Guilda não encontrada', 404);
  if (!guild.is_public) throw new AppError('GUILD_PRIVATE', 'Esta guilda é privada', 403);

  const existing = await prisma.guildMember.findUnique({
    where: { guild_id_user_id: { guild_id: guildId, user_id: user.id } },
  });

  if (existing) throw new AppError('ALREADY_MEMBER', 'Você já é membro desta guilda', 409);

  const membership = await prisma.guildMember.create({
    data: {
      guild_id: guildId,
      user_id: user.id,
    },
    include: {
      user: { select: { id: true, username: true, avatar_url: true } },
    },
  });

  return NextResponse.json({ membership });
});

export const DELETE = apiHandler(async (req, { params }) => {
  const user = await requireAuth();
  const { id } = await params;
  const guildId: string = String(id);

  const guild = await prisma.guild.findUnique({
    where: { id: guildId },
    include: { members: { where: { user_id: user.id } } },
  });

  if (!guild) throw new AppError('GUILD_NOT_FOUND', 'Guilda não encontrada', 404);

  const membership = guild.members[0];
  if (!membership) throw new AppError('NOT_MEMBER', 'Você não é membro desta guilda', 404);
  if (membership.role === 'OWNER') {
    throw new AppError(
      'OWNER_CANT_LEAVE',
      'O owner não pode sair da guilda. Transfira a ownership ou exclua a guilda.',
      403
    );
  }

  await prisma.guildMember.delete({
    where: { guild_id_user_id: { guild_id: guildId, user_id: user.id } },
  });

  return NextResponse.json({ success: true });
});
