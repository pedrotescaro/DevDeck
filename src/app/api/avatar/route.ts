import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { avatarConfigSchema } from '@/lib/avatar';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const result = avatarConfigSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ error: 'Configuração de personagem inválida' }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { avatar_config: result.data },
    select: { id: true, username: true, avatar_config: true },
  });

  return NextResponse.json(updatedUser);
}
