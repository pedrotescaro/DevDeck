import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { generateChatAI, STACKLYST_TUTOR_PROMPT } from '@/lib/ai';
import { z } from 'zod';

const historyMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(12_000),
});

const learnContextSchema = z.object({
  title: z.string().max(300),
  concept: z.string().max(8_000),
  code: z.string().max(12_000).optional(),
  tip: z.string().max(2_000).optional(),
});

const exerciseContextSchema = z.object({
  question: z.string().max(2_000),
  options: z.array(z.string().max(1_000)).min(2).max(10),
  correctIndex: z.number().int().nonnegative(),
});

const checkpointReviewContextSchema = learnContextSchema.extend({
  checkpointUnit: z.number().int().positive(),
});

const checkpointChallengeContextSchema = z.object({
  challengeTitle: z.string().max(300),
  challengeDescription: z.string().max(5_000),
  userCode: z.string().max(12_000),
  checkpointUnit: z.number().int().positive(),
});

const checkpointSummaryContextSchema = z.object({
  checkpointUnit: z.number().int().positive(),
});

const trailsChatSchema = z.discriminatedUnion('stage', [
  z.object({
    language: z.string().min(1).max(50),
    levelTitle: z.string().min(1).max(100),
    stage: z.literal('learn'),
    currentContext: learnContextSchema,
    history: z.array(historyMessageSchema).min(1).max(30),
  }),
  z.object({
    language: z.string().min(1).max(50),
    levelTitle: z.string().min(1).max(100),
    stage: z.enum(['practice', 'challenge']),
    currentContext: exerciseContextSchema,
    history: z.array(historyMessageSchema).min(1).max(30),
  }),
  z.object({
    language: z.string().min(1).max(50),
    levelTitle: z.string().min(1).max(100),
    stage: z.literal('checkpoint-review'),
    currentContext: checkpointReviewContextSchema,
    history: z.array(historyMessageSchema).min(1).max(30),
  }),
  z.object({
    language: z.string().min(1).max(50),
    levelTitle: z.string().min(1).max(100),
    stage: z.literal('checkpoint-challenge'),
    currentContext: checkpointChallengeContextSchema,
    history: z.array(historyMessageSchema).min(1).max(30),
  }),
  z.object({
    language: z.string().min(1).max(50),
    levelTitle: z.string().min(1).max(100),
    stage: z.literal('checkpoint-summary'),
    currentContext: checkpointSummaryContextSchema,
    history: z.array(historyMessageSchema).min(1).max(30),
  }),
]);

export const POST = apiHandler(async (req) => {
  const body: unknown = await req.json();
  const { language, levelTitle, stage, currentContext, history } = trailsChatSchema.parse(body);

  let systemPrompt = `${STACKLYST_TUTOR_PROMPT}

Você é a ASYNC, uma tutora de programação integrada ao Stacklyst.
Seu objetivo é ajudar o desenvolvedor a aprender e fixar conceitos da trilha de ${language} (Fase: ${levelTitle}).

Diretrizes importantes:
1. Responda de forma concisa, amigável e puramente técnica em português do Brasil.
2. Formate as saídas usando markdown limpo. Se escrever código de exemplo, use blocos de código markdown com syntax highlighting.
3. Mantenha um tom encorajador de tutora parceira, focado em aprendizado individualizado e depuração ativa.
4. NUNCA diga que é um modelo de linguagem genérico; aja sempre como a ASYNC, copiloto oficial da arena Stacklyst.`;

  if (stage === 'learn') {
    systemPrompt += `\n\nContexto Atual:
O usuário está na etapa "Aprender" estudando o slide: "${currentContext.title}".
Conceito explicado no slide: "${currentContext.concept}"
Código fornecido no slide:
\`\`\`
${currentContext.code || '// Nenhum'}
\`\`\`
Dica do slide: "${currentContext.tip || 'Nenhuma'}"

Ajude-o a entender melhor esse conceito específico, responda dúvidas, dê explicações adicionais ou outros exemplos de código se solicitado pelo desenvolvedor.`;
  } else if (stage === 'practice' || stage === 'challenge') {
    const { question, options, correctIndex } = currentContext;
    const correctAnswer = options[correctIndex];
    systemPrompt += `\n\nContexto Atual:
O usuário está na etapa de exercícios ("${stage === 'challenge' ? 'Desafio Final' : 'Prática'}").
Questão: "${question}"
Opções disponíveis: ${JSON.stringify(options)}

REGRA CRÍTICA DE APRENDIZADO: NUNCA dê a resposta diretamente ao desenvolvedor (que é a opção de índice ${correctIndex}: "${correctAnswer}").
Dê apenas dicas sutis, faça perguntas reflexivas, use analogias ou explique os conceitos fundamentais para ajudá-lo a deduzir a resposta correta por conta própria.`;
  } else if (stage === 'checkpoint-review') {
    systemPrompt += `\n\nContexto Atual:
O usuário está revisando o checkpoint da unidade ${currentContext.checkpointUnit}.
Tópico: "${currentContext.title}".
Conceito: "${currentContext.concept}".
Código de referência:
\`\`\`
${currentContext.code || '// Nenhum'}
\`\`\`
Dica: "${currentContext.tip || 'Nenhuma'}".

Ajude na revisão com explicações e perguntas orientadoras.`;
  } else if (stage === 'checkpoint-challenge') {
    systemPrompt += `\n\nContexto Atual:
O usuário está no desafio do checkpoint da unidade ${currentContext.checkpointUnit}.
Desafio: "${currentContext.challengeTitle}".
Descrição: "${currentContext.challengeDescription}".
Código atual do usuário:
\`\`\`
${currentContext.userCode || '// Ainda não iniciado'}
\`\`\`

Não entregue a solução completa imediatamente. Analise o raciocínio e o código atual, explique conceitos e ofereça dicas progressivas. Não afirme que executou o código.`;
  } else if (stage === 'checkpoint-summary') {
    systemPrompt += `\n\nContexto Atual:
O usuário está no resumo do checkpoint da unidade ${currentContext.checkpointUnit}. Ajude a consolidar o aprendizado, revisar conceitos e planejar os próximos passos.`;
  }

  const responseText = await generateChatAI(systemPrompt, history);

  if (!responseText) {
    return NextResponse.json({
      text: 'Desculpe, estou com dificuldades para me conectar aos servidores de IA no momento. Por favor, tente novamente.',
    });
  }

  return NextResponse.json({ text: responseText });
});
