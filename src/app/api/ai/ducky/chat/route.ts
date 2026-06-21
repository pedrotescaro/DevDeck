import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { generateChatAI, type ChatContentPart } from '@/lib/ai';
import { z } from 'zod';

const contentPartSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({
    type: z.literal('image'),
    mimeType: z.string(),
    data: z.string(),
  }),
]);

const duckyChatSchema = z.object({
  language: z.string(),
  history: z.array(
    z.object({
      role: z.enum(['user', 'model', 'assistant', 'ducky']),
      content: z.union([z.string(), z.array(contentPartSchema)]),
    })
  ),
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const { language, history } = duckyChatSchema.parse(body);

  const systemPrompt = `Você é o Ducky (quack! 🦆), o patinho de borracha de programação oficial do DevDeck.
Seu papel é atuar como um Rubber Duck Debugging Assistant (depuração de patinho de borracha), ajudando o desenvolvedor a estruturar pensamentos, depurar código com bugs e consolidar conceitos.

Diretrizes de comportamento:
1. Sempre inicie suas interações com um simpático "Quack! 🦆" ou insira pequenas menções divertidas a patos de forma natural.
2. Mantenha um tom alegre, encorajador, inteligente e técnico em português do Brasil.
3. Se o desenvolvedor descrever um problema ou erro, faça perguntas investigativas que o incentivem a verbalizar a lógica de seu próprio código (princípio de rubber ducking), ajudando-o a descobrir o bug sozinho. Se necessário, forneça insights técnicos detalhados e sugestões de correção.
4. Adapte suas explicações, sintaxe e exemplos de código para a trilha ativa do desenvolvedor, que atualmente é de **${language}**.
5. Formate suas mensagens usando Markdown limpo com syntax highlighting para blocos de código.
6. Quando o usuário anexar arquivos de código, leia e considere o conteúdo anexado na sua resposta. Quando anexar imagens (screenshots de erros, UI, etc), descreva e analise o que vê.
7. Nunca saia do personagem. Você é o Ducky, não um modelo de linguagem da OpenAI, Google ou Groq.`;

  // Mapear o histórico para os papéis aceitos ('user' / 'assistant'), preservando
  // conteúdo multimodal (texto + imagens).
  const mappedHistory = history.map((h) => {
    const role = (h.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant';
    const content: string | ChatContentPart[] =
      typeof h.content === 'string' ? h.content : (h.content as ChatContentPart[]);
    return { role, content };
  });

  const responseText = await generateChatAI(systemPrompt, mappedHistory);

  if (!responseText) {
    return NextResponse.json({
      text: 'Quack... Estou com dificuldades para me conectar aos meus neurônios de IA agora. Pode tentar de novo?',
    });
  }

  return NextResponse.json({ text: responseText });
});
