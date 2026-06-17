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

    const { id: duelId } = await params;

    // Buscar o duelo
    const duel = await prisma.duel.findUnique({
      where: { id: duelId },
    });

    if (!duel) {
      return NextResponse.json({ error: "Duelo não encontrado" }, { status: 404 });
    }

    // Verificar se o usuário faz parte do duelo
    if (duel.challenger_id !== user.id && duel.opponent_id !== user.id) {
      return NextResponse.json({ error: "Você não é participante deste duelo" }, { status: 403 });
    }

    const { code } = await request.json();
    if (!code || code.trim() === "") {
      return NextResponse.json({ error: "O código não pode ser vazio" }, { status: 400 });
    }

    // Criar ou atualizar a solução
    const solution = await prisma.duelSolution.upsert({
      where: {
        duel_id_user_id: {
          duel_id: duelId,
          user_id: user.id,
        },
      },
      update: { code },
      create: {
        duel_id: duelId,
        user_id: user.id,
        code,
      },
    });

    // Conceder XP (+25 XP por enviar solução ao duelo)
    const xpResult = await awardXP(user.id, duel.language, 25);

    return NextResponse.json({ solution, xpResult });
  } catch (error) {
    console.error("Error submitting duel solution:", error);
    return NextResponse.json({ error: "Erro ao enviar solução" }, { status: 500 });
  }
}
