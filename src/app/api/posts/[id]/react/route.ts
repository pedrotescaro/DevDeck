import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { awardXP } from '@/lib/xp';
import { Language } from '@prisma/client';

const VALID_REACTIONS = ['FIRE', 'HEART', 'LAUGH', 'CLAP', 'BULB'];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: postId } = await params;
    const body = await request.json();
    const { type } = body; // 'FIRE' | 'HEART' | 'LAUGH' | 'CLAP' | 'BULB' | null

    if (type !== null && !VALID_REACTIONS.includes(type)) {
      return NextResponse.json({ error: 'Tipo de reação inválido' }, { status: 400 });
    }

    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
    }

    // Verificar se já existe uma reação deste usuário para este post
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: user.id,
        },
      },
    });

    if (type === null) {
      if (existingReaction) {
        // Remover reação
        await prisma.reaction.delete({
          where: {
            post_id_user_id: {
              post_id: postId,
              user_id: user.id,
            },
          },
        });

        // Deduzir 2 XP
        await awardXP(user.id, post.language as Language | null, -2);
        return NextResponse.json({ success: true, reaction: null });
      }
      return NextResponse.json({ success: true, reaction: null });
    }

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Sem alteração
        return NextResponse.json({ success: true, reaction: type });
      }

      // Atualizar tipo de reação (sem alteração de XP)
      const updated = await prisma.reaction.update({
        where: {
          post_id_user_id: {
            post_id: postId,
            user_id: user.id,
          },
        },
        data: { type },
      });
      return NextResponse.json({ success: true, reaction: updated.type });
    } else {
      // Criar nova reação
      const created = await prisma.reaction.create({
        data: {
          post_id: postId,
          user_id: user.id,
          type,
        },
      });

      // Conceder 2 XP
      await awardXP(user.id, post.language as Language | null, 2);
      return NextResponse.json({ success: true, reaction: created.type });
    }
  } catch (error: any) {
    console.error('Error managing reaction:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar reação' },
      { status: 500 }
    );
  }
}
