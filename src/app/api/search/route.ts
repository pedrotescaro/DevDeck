import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'posts';
    const cursor = searchParams.get('cursor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (q.trim().length < 2) {
      return NextResponse.json({ items: [], nextCursor: null });
    }

    if (type === 'users') {
      const users = await prisma.user.findMany({
        where: {
          username: {
            contains: q,
            mode: 'insensitive',
          },
          id: cursor ? { gt: cursor } : undefined,
        },
        select: {
          id: true,
          username: true,
          avatar_url: true,
          total_xp: true,
        },
        orderBy: { id: 'asc' },
        take: limit + 1,
      });

      const hasNext = users.length > limit;
      const items = hasNext ? users.slice(0, limit) : users;
      const nextCursor = hasNext ? items[items.length - 1].id : null;

      return NextResponse.json({ items, nextCursor });
    } else {
      let cursorTime: Date | null = null;
      let cursorId: string | null = null;
      if (cursor) {
        const parts = cursor.split('_');
        if (parts.length === 2) {
          cursorTime = new Date(parseInt(parts[0], 10));
          cursorId = parts[1];
        }
      }

      const limitVal = limit + 1;
      let posts: any[] = [];

      if (cursorTime && cursorId) {
        posts = await prisma.$queryRaw`
          SELECT p.*, 
                 u.username as "author_username", 
                 u.avatar_url as "author_avatar_url",
                 u.total_xp as "author_total_xp",
                 (SELECT COUNT(*)::int FROM "Answer" WHERE post_id = p.id) as "answers_count"
          FROM "Post" p
          JOIN "User" u ON p.author_id = u.id
          WHERE to_tsvector('portuguese', p.title || ' ' || p.body) @@ plainto_tsquery('portuguese', ${q})
            AND (p.created_at < ${cursorTime} OR (p.created_at = ${cursorTime} AND p.id < ${cursorId}))
          ORDER BY p.created_at DESC, p.id DESC
          LIMIT ${limitVal}
        `;
      } else {
        posts = await prisma.$queryRaw`
          SELECT p.*, 
                 u.username as "author_username", 
                 u.avatar_url as "author_avatar_url",
                 u.total_xp as "author_total_xp",
                 (SELECT COUNT(*)::int FROM "Answer" WHERE post_id = p.id) as "answers_count"
          FROM "Post" p
          JOIN "User" u ON p.author_id = u.id
          WHERE to_tsvector('portuguese', p.title || ' ' || p.body) @@ plainto_tsquery('portuguese', ${q})
          ORDER BY p.created_at DESC, p.id DESC
          LIMIT ${limitVal}
        `;
      }

      const hasNext = posts.length > limit;
      const items = hasNext ? posts.slice(0, limit) : posts;

      const formattedItems = items.map((p) => ({
        id: p.id,
        author_id: p.author_id,
        title: p.title,
        body: p.body,
        language: p.language,
        code_snippet: p.code_snippet,
        image_url: p.image_url,
        is_pinned: p.is_pinned,
        created_at: p.created_at,
        view_count: p.view_count,
        upvotes: p.upvotes,
        author: {
          username: p.author_username,
          avatar_url: p.author_avatar_url,
          total_xp: p.author_total_xp,
        },
        _count: {
          answers: p.answers_count,
        },
      }));

      let nextCursor = null;
      if (hasNext && formattedItems.length > 0) {
        const lastPost = formattedItems[formattedItems.length - 1];
        const lastTime = new Date(lastPost.created_at).getTime();
        nextCursor = `${lastTime}_${lastPost.id}`;
      }

      return NextResponse.json({ items: formattedItems, nextCursor });
    }
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Erro interno de busca' }, { status: 500 });
  }
}
