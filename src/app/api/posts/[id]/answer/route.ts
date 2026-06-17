import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { createAnswerSchema } from "@/lib/validators";
import { awardXP } from "@/lib/xp";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: postId } = await params;

    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const result = createAnswerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { body: answerBody, code_snippet } = result.data;

    // Criar a resposta
    const answer = await prisma.answer.create({
      data: {
        post_id: postId,
        author_id: user.id,
        body: answerBody,
        code_snippet,
      },
      include: {
        author: {
          select: {
            username: true,
            avatar_url: true,
          },
        },
      },
    });

    // Enviar notificação para o autor do post (se não for o próprio autor)
    if (post.author_id !== user.id) {
      try {
        await prisma.notification.create({
          data: {
            user_id: post.author_id,
            type: "ANSWER",
            title: "Nova Resposta",
            content: `@${user.username} respondeu à sua dúvida: "${post.title.substring(0, 30)}${post.title.length > 30 ? '...' : ''}"`,
            link: `/post/${postId}`,
          },
        });
      } catch (err) {
        console.error("Error creating notification for answer:", err);
      }
    }

    // Conceder XP (+15 XP por responder)
    const xpResult = await awardXP(user.id, post.language, 15);

    return NextResponse.json({ answer, xpResult });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json({ error: "Erro ao postar resposta" }, { status: 500 });
  }
}
