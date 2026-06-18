import { prisma } from '@/lib/prisma';
import { Language } from '@prisma/client';
import { CreatePostInput } from '@/lib/validators';
import { encodeCursor, buildCursorWhere } from '@/lib/pagination';
import { XpService } from './xp.service';
import { NotificationService } from './notification.service';
import { logger } from '@/lib/logger';
import { QuizService } from './quiz.service';

export const PostService = {
  async create(userId: string, data: CreatePostInput) {
    const { title, body, language, code, image_url, type } = data;

    // Use transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
      // 1. Create Post
      const post = await tx.post.create({
        data: {
          author_id: userId,
          title,
          body,
          language: language || null,
          code_snippet: code || null,
          image_url: image_url || null,
        },
      });

      // 2. Award XP
      const xpAmount = language ? 10 : 5;
      const xpResult = await XpService.awardXP(userId, language, xpAmount);

      // 3. Mentions Parsing & Notifications
      const usernames = Array.from(
        new Set((body.match(/@([\w-]+)/g) || []).map((m) => m.substring(1)))
      );

      if (usernames.length > 0) {
        const usersToNotify = await tx.user.findMany({
          where: { username: { in: usernames } },
          select: { id: true, username: true },
        });

        // Trigger mentions notifications (idempotent: unique target users)
        for (const targetUser of usersToNotify) {
          if (targetUser.id !== userId) {
            await tx.notification.create({
              data: {
                userId: targetUser.id,
                type: 'MENTION',
                actorId: userId,
                resourceId: post.id,
                resourceType: 'POST',
                read: false,
              },
            });
            logger.info('Mention notification created', {
              postId: post.id,
              actorId: userId,
              targetId: targetUser.id,
            });
          }
        }
      }

      // 4. Generate Quiz (non-blocking or run inside transaction)
      // We will trigger a quiz generation. In Next.js, we can do it via a service call.
      if (language) {
        try {
          await QuizService.generateForPost(post.id, language, title, body, code || undefined);
        } catch (err) {
          logger.error('Failed to generate quiz for post', { postId: post.id, error: String(err) });
        }
      }

      logger.info('Post created successfully', {
        userId,
        postId: post.id,
        type,
        language,
        hasImage: !!image_url,
        xpAwarded: xpAmount,
      });

      return { post, xpResult };
    });
  },

  async getFeed(
    userId: string | null,
    params: {
      language?: string;
      search?: string;
      author?: string;
      filter?: string;
      cursor?: string;
      limit?: number;
    }
  ) {
    const { language, search, author, filter, cursor, limit = 10 } = params;

    const whereClause: any = {};

    if (filter === 'following' && userId) {
      const followingRelations = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = followingRelations.map((r) => r.followingId);
      whereClause.author_id = { in: followingIds };
    }

    if (language) {
      whereClause.language = language as Language;
    }
    if (author) {
      whereClause.author = { username: author };
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
        { author: { username: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const cursorWhere = buildCursorWhere(cursor, 'created_at');
    const finalWhere = { ...whereClause, ...cursorWhere };

    const posts = await prisma.post.findMany({
      where: finalWhere,
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
            total_xp: true,
          },
        },
        _count: {
          select: { answers: true },
        },
        quizzes: {
          include: {
            attempts: userId ? { where: { user_id: userId } } : { where: { id: 'none' } },
          },
        },
        votes: userId ? { where: { user_id: userId } } : { where: { id: 'none' } },
        bookmarks: userId ? { where: { user_id: userId } } : { where: { id: 'none' } },
        reactions: userId ? { where: { user_id: userId } } : { where: { id: 'none' } },
      },
    });

    const hasNext = posts.length > limit;
    const items = hasNext ? posts.slice(0, limit) : posts;

    let nextCursor: string | null = null;
    if (hasNext && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = encodeCursor(lastItem.created_at, lastItem.id);
    }

    return {
      items,
      nextCursor,
    };
  },
};
