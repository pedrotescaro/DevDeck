import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: postId } = await params;
    const body = await request.json();
    const { value } = body; // 1 (upvote), -1 (downvote), ou 0 (remover voto)

    if (value !== 1 && value !== -1 && value !== 0) {
      return NextResponse.json({ error: "Valor de voto inválido" }, { status: 400 });
    }

    // 1. Atualizar ou deletar o PostVote
    if (value === 0) {
      await prisma.postVote.delete({
        where: {
          post_id_user_id: {
            post_id: postId,
            user_id: user.id,
          },
        },
      }).catch(() => {
        // Silenciar erro se o voto não existir
      });
    } else {
      await prisma.postVote.upsert({
        where: {
          post_id_user_id: {
            post_id: postId,
            user_id: user.id,
          },
        },
        update: { value },
        create: {
          post_id: postId,
          user_id: user.id,
          value,
        },
      });
    }

    // 2. Calcular o novo saldo de votos
    const aggregate = await prisma.postVote.aggregate({
      where: { post_id: postId },
      _sum: { value: true },
    });

    const newUpvotes = aggregate._sum.value ?? 0;

    // 3. Atualizar a contagem total no modelo Post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { upvotes: newUpvotes },
      select: { author_id: true, title: true }
    });

    // 4. Se for Upvote e não for o próprio autor, cria uma notificação
    if (value === 1 && updatedPost.author_id !== user.id) {
      try {
        const existing = await prisma.notification.findFirst({
          where: {
            user_id: updatedPost.author_id,
            type: "LIKE",
            link: `/post/${postId}`,
            content: { contains: `@${user.username}` }
          }
        });
        if (!existing) {
          await prisma.notification.create({
            data: {
              user_id: updatedPost.author_id,
              type: "LIKE",
              title: "Seu post recebeu um Up! 🔺",
              content: `@${user.username} deu um up no seu post: "${updatedPost.title.substring(0, 30)}${updatedPost.title.length > 30 ? '...' : ''}"`,
              link: `/post/${postId}`,
            }
          });
        }
      } catch (err) {
        console.error("Failed to create upvote notification:", err);
      }
    }

    return NextResponse.json({ success: true, upvotes: newUpvotes });
  } catch (error: any) {
    console.error("Error casting post vote:", error);
    return NextResponse.json({ error: error.message || "Erro ao votar" }, { status: 500 });
  }
}
