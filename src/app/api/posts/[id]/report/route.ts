import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: postId } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason || reason.trim() === '') {
      return NextResponse.json({ error: 'Motivo é obrigatório' }, { status: 400 });
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    // Create report (upsert or create)
    const report = await prisma.report.upsert({
      where: {
        user_id_post_id: {
          user_id: user.id,
          post_id: postId,
        },
      },
      update: {
        reason: reason.trim(),
      },
      create: {
        user_id: user.id,
        post_id: postId,
        reason: reason.trim(),
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Error reporting post:', error);
    return NextResponse.json({ error: 'Erro ao denunciar postagem' }, { status: 500 });
  }
}
