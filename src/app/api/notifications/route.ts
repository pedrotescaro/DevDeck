import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const useCursor = searchParams.get('useCursor') === 'true' || !!cursor;

    const whereClause: any = { user_id: user.id };
    if (cursor) {
      const parts = cursor.split('_');
      if (parts.length === 2) {
        const cursorTime = new Date(parseInt(parts[0], 10));
        const cursorId = parts[1];
        whereClause.OR = [
          { created_at: { lt: cursorTime } },
          { created_at: cursorTime, id: { lt: cursorId } },
        ];
      }
    }

    const takeVal = useCursor ? limit + 1 : undefined;

    let notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      take: takeVal,
    });

    if (notifications.length === 0 && !cursor) {
      // Seed default notifications for this user
      await prisma.notification.createMany({
        data: [
          {
            user_id: user.id,
            type: 'SYSTEM',
            title: 'Bem-vindo ao DevDeck! 🚀',
            content:
              'Explore o feed, tire dúvidas com outros programadores e suba no ranking global!',
            link: '/feed',
            is_read: false,
          },
          {
            user_id: user.id,
            type: 'XP',
            title: 'Bônus de Cadastro Concedido ⚡',
            content: 'Você ganhou +100 XP extras por completar seu perfil na plataforma DevDeck.',
            link: `/profile/${user.username}`,
            is_read: false,
          },
          {
            user_id: user.id,
            type: 'DUEL',
            title: 'Duelos Disponíveis ⚔️',
            content:
              'Vários desenvolvedores criaram duelos na aba Classificação. Aceite um desafio para testar suas habilidades!',
            link: '/duels',
            is_read: false,
          },
        ],
      });

      notifications = await prisma.notification.findMany({
        where: { user_id: user.id },
        orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
        take: takeVal,
      });
    }

    const enhancedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        if (notif.type === 'LIKE' && notif.link && notif.link.startsWith('/post/')) {
          const postId = notif.link.split('/').pop();
          if (postId) {
            try {
              const post = await prisma.post.findUnique({
                where: { id: postId },
                select: {
                  title: true,
                  body: true,
                  votes: {
                    where: { value: 1 },
                    include: {
                      user: {
                        select: {
                          username: true,
                          avatar_url: true,
                        },
                      },
                    },
                    orderBy: { created_at: 'desc' },
                  },
                },
              });

              if (post) {
                const upvoters = post.votes.map((v) => v.user);
                return {
                  ...notif,
                  postTitle: post.title,
                  postBody: post.body,
                  upvoters,
                };
              }
            } catch (err) {
              console.error('Error enhancing like notification:', err);
            }
          }
        }
        return notif;
      })
    );

    if (useCursor) {
      const hasNext = enhancedNotifications.length > limit;
      const items = hasNext ? enhancedNotifications.slice(0, limit) : enhancedNotifications;

      let nextCursor = null;
      if (hasNext && items.length > 0) {
        const lastItem = items[items.length - 1];
        const lastTime = new Date(lastItem.created_at).getTime();
        nextCursor = `${lastTime}_${lastItem.id}`;
      }

      return NextResponse.json({ items, nextCursor });
    }

    return NextResponse.json(enhancedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/notifications - Mark all as read
export async function POST() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        user_id: user.id,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
