import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: targetUserId } = await params;

    if (user.id === targetUserId) {
      return NextResponse.json({ error: 'Você não pode seguir a si mesmo' }, { status: 400 });
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: user.id,
          following_id: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          follower_id_following_id: {
            follower_id: user.id,
            following_id: targetUserId,
          },
        },
      });
      return NextResponse.json({ following: false });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          follower_id: user.id,
          following_id: targetUserId,
        },
      });

      // Create a follow notification
      try {
        await prisma.notification.create({
          data: {
            user_id: targetUserId,
            type: 'SYSTEM',
            title: 'Novo Seguidor! 👋',
            content: `@${user.username} começou a seguir você no DevDeck.`,
            link: `/profile/${user.username}`,
            is_read: false,
          },
        });
      } catch (err) {
        console.error('Error creating follow notification:', err);
      }

      return NextResponse.json({ following: true });
    }
  } catch (error: any) {
    console.error('Error toggling follow:', error);
    return NextResponse.json({ error: 'Erro ao seguir usuário' }, { status: 500 });
  }
}
