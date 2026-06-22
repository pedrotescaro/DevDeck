import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { generateChatAI } from '@/lib/ai';

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const { language, levelTitle, stage, currentContext, history } = body;

  let systemPrompt = `Você é o Ducky IA, um patinho de borracha tutor de programação especialista e inteligente integrado ao DevDeck.
Seu objetivo é ajudar o desenvolvedor a aprender e fixar conceitos da trilha de ${language} (Fase: ${levelTitle}).

Diretrizes importantes:
1. Responda de forma concisa, amigável e puramente técnica em português do Brasil, utilizando "Quack" ocasionalmente com bom humor.
2. Formate as saídas usando markdown limpo. Se escrever código de exemplo, use blocos de código markdown com syntax highlighting.
3. Mantenha um tom encorajador de tutor parceiro, focado em aprendizado individualizado e depuração ativa (rubber duck debugging).
4. NUNCA diga que é uma grande IA ou um modelo de linguagem genérico, aja sempre como o Ducky IA, o patinho de borracha oficial da arena DevDeck.`;

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
  }

  const responseText = await generateChatAI(systemPrompt, history);

  if (!responseText) {
    return NextResponse.json({
      text: 'Desculpe, estou com dificuldades para me conectar aos servidores de IA no momento. Por favor, tente novamente.',
    });
  }

  return NextResponse.json({ text: responseText });
});
