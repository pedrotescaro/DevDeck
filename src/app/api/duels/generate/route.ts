import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { logger } from '@/lib/logger';
import type { DuelProblem } from '@/lib/duel-problems';
import { parseProblemFromJson } from '@/lib/duel-problems';
import { generateProceduralDuelProblem } from '@/lib/duel-challenge-generator';
import {
  ai,
  STACKLYST_CHALLENGE_PROMPT,
  STACKLYST_DUEL_PROMPT,
  withStacklystBasePrompt,
} from '@/lib/ai';
import { z } from 'zod';

const SUPPORTED_LANGUAGES = ['TS', 'JS', 'PYTHON'] as const;
type SupportedLang = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_LABELS: Record<SupportedLang, string> = {
  TS: 'TypeScript',
  JS: 'JavaScript',
  PYTHON: 'Python',
};

const DIFFICULTY_MAP: Record<string, 'Fácil' | 'Médio' | 'Difícil'> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
};

const generatedDuelProblemSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(3).max(200),
    difficulty: z.enum(['Fácil', 'Médio', 'Difícil']),
    description: z.string().min(20).max(5_000),
    functionName: z.string().min(1).max(100),
    starters: z
      .object({
        TS: z.string().min(1).max(10_000),
        JS: z.string().min(1).max(10_000),
        PYTHON: z.string().min(1).max(10_000),
      })
      .strict(),
    testCases: z
      .array(
        z
          .object({
            id: z.string().min(1).max(50),
            description: z.string().min(1).max(500),
            inputDisplay: z.string().max(1_000),
            expectedDisplay: z.string().max(1_000),
            testExpression: z
              .object({
                TS: z.string().min(1).max(2_000),
                JS: z.string().min(1).max(2_000),
                PYTHON: z.string().min(1).max(2_000),
              })
              .strict(),
          })
          .strict()
      )
      .min(3)
      .max(5),
  })
  .strict();

function buildSystemPrompt(language: SupportedLang, difficulty: string, topic?: string): string {
  const langLabel = LANGUAGE_LABELS[language];
  const diffLabel = DIFFICULTY_MAP[difficulty] || 'Médio';

  const topicInstruction = topic
    ? `O tema do problema DEVE ser sobre: "${topic}". `
    : 'Escolha um tema interessante de algoritmos ou estrutura de dados. ';

  // For Python, function names use snake_case
  const namingNote =
    language === 'PYTHON'
      ? 'Em Python, use snake_case para nomes de função (ex: find_max_sum).'
      : 'Use camelCase para nomes de função (ex: findMaxSum).';

  return `Você é um gerador de problemas de programação para duelos de código.

REGRAS OBRIGATÓRIAS:
1. Gere EXATAMENTE um problema no formato JSON especificado abaixo.
2. O problema deve ser de dificuldade "${diffLabel}".
3. ${topicInstruction}
4. A linguagem principal é ${langLabel}, mas forneça starters para TS, JS e PYTHON.
5. ${namingNote}
6. Gere entre 3 e 5 casos de teste.
7. Cada testExpression deve ser uma expressão booleana que avalia para true quando a solução está correta.
8. Para comparações de arrays/objetos em JS/TS, use JSON.stringify().
9. Para Python, use == para comparações, e sorted() quando a ordem não importa.
10. O starter code deve ter a assinatura correta mas retornar um valor padrão (string vazia, 0, [], false, etc).
11. A description deve ser em português do Brasil.
12. NÃO inclua markdown, backticks, ou texto fora do JSON.

FORMATO JSON EXATO (sem campos extras):
{
  "id": "slug-do-problema",
  "title": "Título em Português",
  "difficulty": "${diffLabel}",
  "description": "Descrição clara do problema em português...",
  "functionName": "nomeDaFuncao",
  "starters": {
    "TS": "function nomeDaFuncao(param: Tipo): TipoRetorno {\\n  // Seu código aqui\\n  return valorPadrao;\\n}",
    "JS": "function nomeDaFuncao(param) {\\n  // Seu código aqui\\n  return valorPadrao;\\n}",
    "PYTHON": "def nome_da_funcao(param: tipo) -> tipo_retorno:\\n    # Seu código aqui\\n    return valor_padrao\\n"
  },
  "testCases": [
    {
      "id": "t1",
      "description": "Descrição do teste em português",
      "inputDisplay": "entrada legível",
      "expectedDisplay": "saída esperada legível",
      "testExpression": {
        "TS": "nomeDaFuncao(entrada) === saidaEsperada",
        "JS": "nomeDaFuncao(entrada) === saidaEsperada",
        "PYTHON": "nome_da_funcao(entrada) == saida_esperada"
      }
    }
  ]
}`;
}

function buildUserPrompt(language: SupportedLang, difficulty: string, topic?: string): string {
  const langLabel = LANGUAGE_LABELS[language];
  const diffLabel = DIFFICULTY_MAP[difficulty] || 'Médio';

  if (topic) {
    return `Gere um problema de programação de dificuldade "${diffLabel}" em ${langLabel} sobre o tema "${topic}". Retorne APENAS o JSON, nenhum texto adicional.`;
  }

  return `Gere um problema de programação de dificuldade "${diffLabel}" em ${langLabel}. Escolha um tema criativo e interessante. Retorne APENAS o JSON, nenhum texto adicional.`;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { language, difficulty, topic } = body;

    // Validate language
    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      return NextResponse.json(
        { error: 'Linguagem inválida. Use TS, JS ou PYTHON.' },
        { status: 400 }
      );
    }

    // Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    const diff = difficulty && validDifficulties.includes(difficulty) ? difficulty : 'medium';
    const diffLabel = DIFFICULTY_MAP[diff] || 'Médio';

    // Validate optional topic
    const sanitizedTopic =
      topic && typeof topic === 'string' && topic.trim().length > 0
        ? topic.trim().slice(0, 100)
        : undefined;

    const systemPrompt = buildSystemPrompt(language as SupportedLang, diff, sanitizedTopic);
    const userPrompt = buildUserPrompt(language as SupportedLang, diff, sanitizedTopic);

    logger.info('Generating AI duel problem', {
      userId: user.id,
      language,
      difficulty: diff,
      topic: sanitizedTopic,
    });

    let problem: DuelProblem | null = null;

    // 1. Try generating with AI provider if configured
    try {
      const rawResult = await generateAIDuelProblem(systemPrompt, userPrompt);
      if (rawResult) {
        const jsonString = typeof rawResult === 'string' ? rawResult : JSON.stringify(rawResult);
        problem = parseProblemFromJson(jsonString);
      }
    } catch (aiErr) {
      logger.warn('AI generation encountered error, falling back to procedural engine', {
        error: String(aiErr),
      });
    }

    // 2. If AI is not configured or failed, generate via procedural generator engine
    if (!problem) {
      logger.info('Using procedural challenge generator engine', {
        language,
        difficulty: diffLabel,
        topic: sanitizedTopic,
      });
      problem = generateProceduralDuelProblem(language, diffLabel, sanitizedTopic);
    }

    logger.info('Duel problem generated successfully', {
      problemId: problem.id,
      title: problem.title,
      testCases: problem.testCases.length,
    });

    return NextResponse.json({ problem });
  } catch (error) {
    logger.error('Error generating duel problem', { error: String(error) });
    return NextResponse.json({ error: 'Erro interno ao gerar desafio.' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// AI call through the provider-agnostic service. The generated object is
// validated before it can reach the duel engine.
// ---------------------------------------------------------------------------
async function generateAIDuelProblem(
  systemPrompt: string,
  userPrompt: string
): Promise<z.infer<typeof generatedDuelProblemSchema> | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await ai.chatStructured(
        {
          messages: [
            {
              role: 'system',
              content: withStacklystBasePrompt(
                `${STACKLYST_CHALLENGE_PROMPT}\n\n${STACKLYST_DUEL_PROMPT}\n\n${systemPrompt}`
              ),
            },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
        },
        generatedDuelProblemSchema
      );
    } catch (err) {
      logger.warn(`AI duel problem generation attempt ${attempt} failed`, {
        error: String(err),
      });
    }
  }

  return null;
}
