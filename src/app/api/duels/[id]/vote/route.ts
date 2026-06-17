import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { duelVoteSchema } from "@/lib/validators";

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

    // Participantes não podem votar no próprio duelo
    if (duel.challenger_id === user.id || duel.opponent_id === user.id) {
      return NextResponse.json({ error: "Você não pode votar no seu próprio duelo" }, { status: 400 });
    }

    const body = await request.json();
    const result = duelVoteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { solution_id } = result.data;

    // Verificar se a solução existe e pertence a este duelo
    const solution = await prisma.duelSolution.findFirst({
      where: { id: solution_id, duel_id: duelId },
    });

    if (!solution) {
      return NextResponse.json({ error: "Solução não encontrada neste duelo" }, { status: 404 });
    }

    // Verificar se o usuário já votou neste duelo
    const existingVote = await prisma.duelVote.findUnique({
      where: {
        duel_id_user_id: {
          duel_id: duelId,
          user_id: user.id,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json({ error: "Você já votou neste duelo" }, { status: 400 });
    }

    // Registrar o voto e incrementar o contador da solução
    const voteResult = await prisma.$transaction(async (tx) => {
      const vote = await tx.duelVote.create({
        data: {
          duel_id: duelId,
          user_id: user.id,
          solution_id,
        },
      });

      const updatedSolution = await tx.duelSolution.update({
        where: { id: solution_id },
        data: {
          vote_count: {
            increment: 1,
          },
        },
      });

      return { vote, solution: updatedSolution };
    });

    return NextResponse.json(voteResult);
  } catch (error) {
    console.error("Error voting on duel solution:", error);
    return NextResponse.json({ error: "Erro ao votar" }, { status: 500 });
  }
}
