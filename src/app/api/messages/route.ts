import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';
import { NotificationService } from '@/services/notification.service';
import { rateLimit } from '@/lib/ratelimit';

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();

  // Execute Upstash rate limit
  await rateLimit(`messages:${user.id}`, {
    limit: 30,
    window: '1 m',
    endpoint: '/api/messages',
  });

  const body = await req.json();
  const { receiver_id, content, image_url } = body;

  if (!receiver_id) {
    return NextResponse.json({ error: 'Destinatário não informado' }, { status: 400 });
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      sender_id: user.id,
      receiver_id,
      content: content ? content.trim() : '',
      image_url: image_url || null,
    },
  });

  // Notify receiver using NotificationService
  try {
    await NotificationService.create({
      userId: receiver_id,
      type: 'COMMENT', // COMMENT maps to ANSWER icon (MessageSquare)
      actorId: user.id,
      resourceId: message.id,
      resourceType: 'MESSAGE',
      title: 'Mensagem Recebida 💬',
      content: `@${user.username} enviou uma mensagem para você no Bate-papo.`,
      link: '/messages',
    });
  } catch (err) {
    console.error('Error creating chat notification:', err);
  }

  return NextResponse.json(message);
});

export const GET = apiHandler(async (req) => {
  const user = await requireAuth();

  const { searchParams } = new URL(req.url);
  const receiverId = searchParams.get('receiver_id');

  if (!receiverId) {
    return NextResponse.json({ error: 'receiver_id é obrigatório' }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { sender_id: user.id, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: user.id },
      ],
    },
    orderBy: { created_at: 'asc' },
    take: 100, // Safe limit for performance
  });

  return NextResponse.json(messages);
});
