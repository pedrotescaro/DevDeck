import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// POST /api/messages/[id]/react - Toggle reaction on a message
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: messageId } = await params;
    const body = await request.json();
    const { emoji } = body;

    if (!emoji || typeof emoji !== 'string' || emoji.trim() === '') {
      return NextResponse.json({ error: 'Emoji é obrigatório' }, { status: 400 });
    }

    const trimmedEmoji = emoji.trim();

    // Find the message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json({ error: 'Mensagem não encontrada' }, { status: 404 });
    }

    // Verify user is sender or receiver of the message
    if (message.sender_id !== user.id && message.receiver_id !== user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para reagir a esta mensagem' },
        { status: 403 }
      );
    }

    // Check if user already reacted with this emoji on this message
    const existing = await prisma.messageReaction.findUnique({
      where: {
        message_id_user_id_emoji: {
          message_id: messageId,
          user_id: user.id,
          emoji: trimmedEmoji,
        },
      },
    });

    if (existing) {
      // Remove reaction (toggle off)
      await prisma.messageReaction.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({
        action: 'removed',
        messageId,
        emoji: trimmedEmoji,
        userId: user.id,
      });
    } else {
      // Add reaction
      const created = await prisma.messageReaction.create({
        data: {
          message_id: messageId,
          user_id: user.id,
          emoji: trimmedEmoji,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      return NextResponse.json({
        action: 'added',
        messageId,
        reaction: created,
        userId: user.id,
      });
    }
  } catch (error) {
    console.error('Error reacting to message:', error);
    return NextResponse.json({ error: 'Erro ao reagir à mensagem' }, { status: 500 });
  }
}
