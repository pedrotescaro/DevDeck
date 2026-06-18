import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    // Incrementar visualizações do post
    await prisma.post.update({
      where: { id },
      data: {
        view_count: {
          increment: 1,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            avatar_url: true,
            total_xp: true,
          },
        },
        answers: {
          orderBy: { created_at: 'asc' },
          include: {
            author: {
              select: {
                username: true,
                avatar_url: true,
              },
            },
            votes: user ? { where: { user_id: user.id } } : { where: { id: 'none' } },
          },
        },
        quizzes: {
          include: {
            attempts: user ? { where: { user_id: user.id } } : { where: { id: 'none' } },
          },
        },
        votes: user ? { where: { user_id: user.id } } : { where: { id: 'none' } },
        bookmarks: user ? { where: { user_id: user.id } } : { where: { id: 'none' } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post details:', error);
    return NextResponse.json({ error: 'Erro ao buscar detalhes do post' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: { author_id: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    if (post.author_id !== user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Erro ao deletar post' }, { status: 500 });
  }
}
