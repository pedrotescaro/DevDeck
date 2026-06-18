import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { PostService } from '@/services/post.service';
import { createPostSchema } from '@/lib/validators';
import { rateLimit } from '@/lib/ratelimit';
import { requireAuth } from '@/lib/auth';

export const GET = apiHandler(async (req, { session }) => {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language') || undefined;
  const search = searchParams.get('search') || undefined;
  const author = searchParams.get('author') || undefined;
  const filter = searchParams.get('filter') || undefined;
  const cursor = searchParams.get('cursor') || undefined;
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const feed = await PostService.getFeed(session?.id || null, {
    language,
    search,
    author,
    filter,
    cursor,
    limit,
  });

  return NextResponse.json(feed);
});

export const POST = apiHandler(async (req) => {
  const user = await requireAuth();

  // Execute Upstash rate limit
  await rateLimit(`posts:${user.id}`, {
    limit: 10,
    window: '1 h',
    endpoint: '/api/posts',
  });

  const body = await req.json();
  const parsed = await createPostSchema.parseAsync(body);

  const result = await PostService.create(user.id, parsed);

  return NextResponse.json(result, { status: 201 });
});
