import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { randomUUID } from 'crypto';

let ensuredTable = false;
async function ensureMessageReactionTable() {
  if (ensuredTable) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MessageReaction" (
        "id" TEXT NOT NULL,
        "message_id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "emoji" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "MessageReaction_message_id_user_id_emoji_key" ON "MessageReaction"("message_id", "user_id", "emoji");
      CREATE INDEX IF NOT EXISTS "MessageReaction_message_id_idx" ON "MessageReaction"("message_id");
      CREATE INDEX IF NOT EXISTS "MessageReaction_user_id_idx" ON "MessageReaction"("user_id");
    `);
    ensuredTable = true;
  } catch (err) {
    console.warn('Could not auto-create MessageReaction table:', err);
  }
}

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

    await ensureMessageReactionTable();

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
          id: randomUUID(),
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
  } catch (error: any) {
    console.error('Error reacting to message:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao reagir à mensagem' },
      { status: 500 }
    );
  }
}
