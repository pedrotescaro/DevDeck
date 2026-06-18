import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/ratelimit';

// GET /api/messages?receiver_id=[userId]
export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get('receiver_id');

    if (!receiverId) {
      return NextResponse.json({ error: 'ID do destinatário é obrigatório' }, { status: 400 });
    }

    // Fetch conversation history
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: user.id, receiver_id: receiverId },
          { sender_id: receiverId, receiver_id: user.id },
        ],
      },
      orderBy: { created_at: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Erro ao buscar mensagens' }, { status: 500 });
  }
}

// POST /api/messages
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { receiver_id, content, image_url } = body;

    const hasContent = content && content.trim() !== '';
    const hasImage = image_url && image_url.trim() !== '';

    if (!receiver_id || (!hasContent && !hasImage)) {
      return NextResponse.json(
        { error: 'Destinatário e conteúdo ou imagem são obrigatórios' },
        { status: 400 }
      );
    }

    const convoKey = [user.id, receiver_id].sort().join(':');
    const rateLimitResult = await rateLimit(`messages:${convoKey}`, 50, '1 h');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Limite de 50 mensagens por hora para esta conversa excedido.' },
        { status: 429 }
      );
    }

    const message = await prisma.message.create({
      data: {
        sender_id: user.id,
        receiver_id,
        content: content ? content.trim() : '',
        image_url: image_url || null,
      },
    });

    // Notify receiver
    try {
      await prisma.notification.create({
        data: {
          user_id: receiver_id,
          type: 'SYSTEM',
          title: 'Mensagem Recebida 💬',
          content: `@${user.username} enviou uma mensagem para você no Bate-papo.`,
          link: '/messages',
          is_read: false,
        },
      });
    } catch (err) {
      console.error('Error creating chat notification:', err);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 });
  }
}
