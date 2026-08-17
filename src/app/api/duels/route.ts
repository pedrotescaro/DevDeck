import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { createDuelSchema } from '@/lib/validators';
import { DuelStatus, Language } from '@prisma/client';

// GET /api/duels
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const duels = await prisma.duel.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        challenger: {
          select: { username: true, avatar_url: true },
        },
        opponent: {
          select: { username: true, avatar_url: true },
        },
        solutions: {
          select: {
            user_id: true,
            vote_count: true,
          },
        },
      },
    });

    return NextResponse.json(duels);
  } catch (error) {
    console.error('Error fetching duels:', error);
    return NextResponse.json({ error: 'Erro ao buscar duelos' }, { status: 500 });
  }
}

import { getRandomDuelProblem } from '@/lib/duel-problems';

// POST /api/duels (Cria ou entra em um duelo pendente / Matchmaking)
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();

    // Matchmaking rápido sem formulário prévio
    if (body.isQuickMatch) {
      const language = (body.language as Language) || 'TS';

      // Buscar se já existe um duelo pendente no mesmo idioma feito por OUTRO usuário
      const pendingDuel = await prisma.duel.findFirst({
        where: {
          language,
          status: DuelStatus.PENDING,
          challenger_id: { not: user.id },
        },
      });

      if (pendingDuel) {
        const updatedDuel = await prisma.duel.update({
          where: { id: pendingDuel.id },
          data: {
            opponent_id: user.id,
            status: DuelStatus.ACTIVE,
          },
          include: {
            challenger: { select: { username: true, avatar_url: true } },
            opponent: { select: { username: true, avatar_url: true } },
          },
        });

        return NextResponse.json({
          message: 'Oponente encontrado! Duelo iniciado.',
          duel: updatedDuel,
        });
      }

      // Criar novo desafio randômico com problema do preset
      const problem = getRandomDuelProblem();
      const newDuel = await prisma.duel.create({
        data: {
          challenger_id: user.id,
          problem_title: problem.title,
          problem_body: problem.description,
          language,
          status: DuelStatus.PENDING,
        },
        include: {
          challenger: { select: { username: true, avatar_url: true } },
        },
      });

      return NextResponse.json({
        message: 'Buscando oponente na arena...',
        duel: newDuel,
      });
    }

    const result = createDuelSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { problem_title, problem_body, language } = result.data;

    // Buscar se já existe um duelo pendente no mesmo idioma feito por OUTRO usuário
    const pendingDuel = await prisma.duel.findFirst({
      where: {
        language,
        status: DuelStatus.PENDING,
        challenger_id: { not: user.id },
      },
    });

    if (pendingDuel) {
      // Entrar no duelo existente como oponente
      const updatedDuel = await prisma.duel.update({
        where: { id: pendingDuel.id },
        data: {
          opponent_id: user.id,
          status: DuelStatus.ACTIVE,
        },
        include: {
          challenger: { select: { username: true, avatar_url: true } },
          opponent: { select: { username: true, avatar_url: true } },
        },
      });

      return NextResponse.json({
        message: 'Você entrou no duelo!',
        duel: updatedDuel,
      });
    }

    // Caso contrário, criar um novo duelo pendente
    const newDuel = await prisma.duel.create({
      data: {
        challenger_id: user.id,
        problem_title,
        problem_body,
        language,
        status: DuelStatus.PENDING,
      },
      include: {
        challenger: { select: { username: true, avatar_url: true } },
      },
    });

    return NextResponse.json({
      message: 'Duelo criado, aguardando oponente!',
      duel: newDuel,
    });
  } catch (error) {
    console.error('Error matching or creating duel:', error);
    return NextResponse.json({ error: 'Erro ao processar duelo' }, { status: 500 });
  }
}
