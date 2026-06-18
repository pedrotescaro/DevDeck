import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';
import { encodeCursor, buildCursorWhere } from '@/lib/pagination';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  actorId?: string | null;
  resourceId?: string | null;
  resourceType?: string | null;
  read?: boolean;
  title?: string;
  content?: string;
  link?: string;
}

export const NotificationService = {
  async create(data: CreateNotificationInput) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        actorId: data.actorId || null,
        resourceId: data.resourceId || null,
        resourceType: data.resourceType || null,
        read: data.read ?? false,
        title: data.title,
        content: data.content,
        link: data.link,
      },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
            total_xp: true,
          },
        },
      },
    });
  },

  async getUserNotifications(userId: string, cursor?: string, limit = 10, useCursor = true) {
    const where = {
      userId,
      ...buildCursorWhere(cursor, 'createdAt'),
    };

    const takeVal = useCursor ? limit + 1 : undefined;

    let notifications = await prisma.notification.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: takeVal,
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
            total_xp: true,
          },
        },
      },
    });

    // Seed default notifications if user has none and it's the first page
    if (notifications.length === 0 && !cursor) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await prisma.notification.createMany({
          data: [
            {
              userId: userId,
              type: 'XP_MILESTONE',
              title: 'Bem-vindo ao DevDeck! 🚀',
              content:
                'Explore o feed, tire dúvidas com outros programadores e suba no ranking global!',
              link: '/feed',
              read: false,
            },
            {
              userId: userId,
              type: 'XP_MILESTONE',
              title: 'Bônus de Cadastro Concedido ⚡',
              content: 'Você ganhou +100 XP extras por completar seu perfil na plataforma DevDeck.',
              link: `/profile/${user.username}`,
              read: false,
            },
            {
              userId: userId,
              type: 'DUEL_CHALLENGE',
              title: 'Duelos Disponíveis ⚔️',
              content:
                'Vários desenvolvedores criaram duelos na aba Classificação. Aceite um desafio para testar suas habilidades!',
              link: '/duels',
              read: false,
            },
          ],
        });

        notifications = await prisma.notification.findMany({
          where: { userId },
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          take: takeVal,
          include: {
            actor: {
              select: {
                id: true,
                username: true,
                avatar_url: true,
                total_xp: true,
              },
            },
          },
        });
      }
    }

    const enhancedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        let postTitle: string | undefined = undefined;
        let postBody: string | undefined = undefined;
        let upvoters: any[] = [];

        // Check if there is a linked post (e.g. for LIKE or REACTION)
        const postId =
          notif.resourceId ||
          (notif.link && notif.link.startsWith('/post/') ? notif.link.split('/').pop() : null);

        if ((notif.type === 'LIKE' || notif.type === 'REACTION') && postId) {
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
              postTitle = post.title;
              postBody = post.body;
              upvoters = post.votes.map((v) => v.user);
            }
          } catch (err) {
            console.error('Error enhancing notification:', err);
          }
        }

        // Map database fields to the API contract response format
        let apiType: string = notif.type;
        if (notif.type === 'COMMENT') apiType = 'ANSWER';
        else if (notif.type === 'XP_MILESTONE' || notif.type === 'LEVEL_UP') apiType = 'XP';
        else if (notif.type === 'DUEL_CHALLENGE' || notif.type === 'DUEL_RESULT') apiType = 'DUEL';
        else if (notif.type === 'FOLLOW') apiType = 'SYSTEM';

        // Provide fallback texts if title/content are not set
        const title =
          notif.title ||
          (notif.type === 'FOLLOW'
            ? 'Novo Seguidor! 👥'
            : notif.type === 'LIKE'
              ? 'Novo Upvote ⚡'
              : notif.type === 'REACTION'
                ? 'Nova Reação 🔥'
                : notif.type === 'COMMENT'
                  ? 'Nova Resposta no seu Post 💬'
                  : notif.type === 'LEVEL_UP'
                    ? 'Subiu de Nível! 🎉'
                    : notif.type === 'XP_MILESTONE'
                      ? 'Conquista de XP! ⚡'
                      : 'Notificação DevDeck');

        const actorName = notif.actor ? `@${notif.actor.username}` : 'Alguém';
        const content =
          notif.content ||
          (notif.type === 'FOLLOW'
            ? `${actorName} começou a seguir você no DevDeck.`
            : notif.type === 'LIKE'
              ? `${actorName} deu um upvote no seu post.`
              : notif.type === 'REACTION'
                ? `${actorName} reagiu ao seu post.`
                : notif.type === 'COMMENT'
                  ? `${actorName} respondeu à sua pergunta.`
                  : notif.type === 'LEVEL_UP'
                    ? 'Parabéns, você subiu de nível!'
                    : 'Você recebeu uma notificação.');

        const link = notif.link || (postId ? `/post/${postId}` : null);

        return {
          id: notif.id,
          user_id: notif.userId,
          type: apiType,
          title,
          content,
          link,
          is_read: notif.read,
          created_at: notif.createdAt.toISOString(),
          actor: notif.actor,
          postTitle,
          postBody,
          upvoters,
        };
      })
    );

    if (useCursor) {
      const hasNext = enhancedNotifications.length > limit;
      const items = hasNext ? enhancedNotifications.slice(0, limit) : enhancedNotifications;

      let nextCursor: string | null = null;
      if (hasNext && items.length > 0) {
        const lastItem = items[items.length - 1];
        // Re-encode cursor based on original db date
        const originalLastNotif = notifications[items.length - 1];
        nextCursor = encodeCursor(originalLastNotif.createdAt, originalLastNotif.id);
      }

      return { items, nextCursor };
    }

    return { items: enhancedNotifications, nextCursor: null };
  },

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  },

  async getUnreadCount(userId: string): Promise<number> {
    const totalCount = await prisma.notification.count({
      where: { userId },
    });

    if (totalCount === 0) {
      await NotificationService.getUserNotifications(userId, undefined, 10, false);
    }

    return await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  },
};
