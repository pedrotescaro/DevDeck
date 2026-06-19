import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { bio, institution, github_username, discord_username, banner_url, pronouns, birthday } =
      await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        bio: bio !== undefined ? bio : undefined,
        institution: institution !== undefined ? institution : undefined,
        github_username: github_username !== undefined ? github_username : undefined,
        discord_username: discord_username !== undefined ? discord_username : undefined,
        banner_url: banner_url !== undefined ? banner_url : undefined,
        pronouns: pronouns !== undefined ? pronouns : undefined,
        birthday: birthday !== undefined ? (birthday ? new Date(birthday) : null) : undefined,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile settings:', error);
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
