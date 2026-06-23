import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth';

export const POST = apiHandler(async (req, { params }) => {
  const user = await requireAuth();
  const { id: postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
  }

  const existingBookmark = await prisma.bookmark.findFirst({
    where: {
      user_id: user.id,
      post_id: postId,
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: { id: existingBookmark.id },
    });
    return NextResponse.json({ success: true, bookmarked: false });
  } else {
    await prisma.bookmark.create({
      data: {
        user_id: user.id,
        post_id: postId,
      },
    });
    return NextResponse.json({ success: true, bookmarked: true });
  }
});
