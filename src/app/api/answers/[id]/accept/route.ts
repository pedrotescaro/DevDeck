import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { awardXP } from "@/lib/xp";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: answerId } = await params;

    // Buscar resposta e post relacionado
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: {
        post: true,
      },
    });

    if (!answer) {
      return NextResponse.json({ error: "Resposta não encontrada" }, { status: 404 });
    }

    // Verificar se o usuário autenticado é o autor do post
    if (answer.post.author_id !== user.id) {
      return NextResponse.json({ error: "Não autorizado a aceitar esta resposta" }, { status: 403 });
    }

    // Se já foi aceita, não fazer nada
    if (answer.is_accepted) {
      return NextResponse.json({ error: "Resposta já foi aceita" }, { status: 400 });
    }

    // Atualizar status de aceita da resposta
    const updatedAnswer = await prisma.answer.update({
      where: { id: answerId },
      data: { is_accepted: true },
    });

    // Conceder XP (+50 XP por ter resposta aceita)
    const xpResult = await awardXP(answer.author_id, answer.post.language, 50);

    return NextResponse.json({ answer: updatedAnswer, xpResult });
  } catch (error) {
    console.error("Error accepting answer:", error);
    return NextResponse.json({ error: "Erro ao aceitar resposta" }, { status: 500 });
  }
}
