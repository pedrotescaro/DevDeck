import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { createPostSchema } from '@/lib/validators';
import { awardXP } from '@/lib/xp';
import { Language } from '@prisma/client';
import { rateLimit } from '@/lib/ratelimit';

// GET /api/posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const search = searchParams.get('search');
    const author = searchParams.get('author');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const cursor = searchParams.get('cursor') || undefined;
    const useCursor = searchParams.get('useCursor') === 'true' || !!cursor;

    const skip = (page - 1) * limit;
    const user = await getAuthUser();
    const filter = searchParams.get('filter');

    const whereClause: any = {};
    if (filter === 'following' && user) {
      const followingRelations = await prisma.follow.findMany({
        where: { follower_id: user.id },
        select: { following_id: true },
      });
      const followingIds = followingRelations.map((r) => r.following_id);
      whereClause.author_id = { in: followingIds };
    }

    if (language) {
      whereClause.language = language as Language;
    }
    if (author) {
      whereClause.author = { username: author };
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
        { author: { username: { contains: search, mode: 'insensitive' } } },
      ];
    }

    let finalWhere = { ...whereClause };
    if (cursor) {
      const parts = cursor.split('_');
      if (parts.length === 2) {
        const cursorTime = new Date(parseInt(parts[0], 10));
        const cursorId = parts[1];

        finalWhere = {
          ...whereClause,
          OR: [
            { created_at: { lt: cursorTime } },
            { created_at: cursorTime, id: { lt: cursorId } },
          ],
        };
      }
    }

    const skipVal = cursor ? undefined : skip;
    const takeVal = useCursor ? limit + 1 : limit;

    const posts = await prisma.post.findMany({
      where: finalWhere,
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      skip: skipVal,
      take: takeVal,
      include: {
        author: {
          select: {
            username: true,
            avatar_url: true,
            total_xp: true,
          },
        },
        _count: {
          select: { answers: true },
        },
        quizzes: {
          include: {
            attempts: user ? { where: { user_id: user.id } } : { where: { id: 'none' } },
          },
        },
        votes: user ? { where: { user_id: user.id } } : { where: { id: 'none' } },
        bookmarks: user ? { where: { user_id: user.id } } : { where: { id: 'none' } },
        reactions: user ? { where: { user_id: user.id } } : { where: { id: 'none' } },
      },
    });

    if (useCursor) {
      const hasNext = posts.length > limit;
      const items = hasNext ? posts.slice(0, limit) : posts;

      let nextCursor = null;
      if (hasNext && items.length > 0) {
        const lastItem = items[items.length - 1];
        const lastTime = new Date(lastItem.created_at).getTime();
        nextCursor = `${lastTime}_${lastItem.id}`;
      }
      return NextResponse.json({ items, nextCursor });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 });
  }
}

// POST /api/posts
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const rateLimitResult = await rateLimit(`posts:${user.id}`, 10, '1 h');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas postagens. Limite de 10 por hora excedido.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = createPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { title, body: postBody, language, code_snippet, image_url } = result.data;

    // Criar o post
    const post = await prisma.post.create({
      data: {
        author_id: user.id,
        title,
        body: postBody,
        language: language || null,
        code_snippet: code_snippet || null,
        image_url: image_url || null,
      },
    });

    // Conceder XP (+10 XP por Pergunta Técnica com linguagem, +5 XP por Discussão Geral)
    const xpAmount = language ? 10 : 5;
    const xpResult = await awardXP(user.id, language, xpAmount);

    // Gerar Quiz apenas se houver uma linguagem associada
    let quizCreated = false;
    if (language) {
      const openAiKey = process.env.OPENAI_API_KEY;

      if (openAiKey) {
        try {
          const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content:
                    'Você é um assistente técnico especialista em programação. Gere um quiz de múltipla escolha com exatamente 4 opções baseada na postagem enviada.',
                },
                {
                  role: 'user',
                  content: `Gere um quiz em formato JSON bruto.
Linguagem: ${language}
Título: ${title}
Conteúdo: ${postBody}
Código: ${code_snippet || ''}

Formato do JSON esperado:
{
  "question": "Pergunta do quiz",
  "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "correct_index": 0
}`,
                },
              ],
              response_format: { type: 'json_object' },
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            const quizJson = JSON.parse(aiData.choices[0].message.content);

            await prisma.quiz.create({
              data: {
                post_id: post.id,
                question: quizJson.question,
                options: quizJson.options,
                correct_index: quizJson.correct_index,
              },
            });
            quizCreated = true;
          }
        } catch (aiError) {
          console.error('OpenAI Quiz generation failed, falling back:', aiError);
        }
      }

      // Fallback de Quiz premium caso não tenha OpenAI ou dê erro
      if (!quizCreated) {
        const fallbackQuizzes: Record<
          Language,
          { question: string; options: string[]; correct_index: number }
        > = {
          TS: {
            question:
              'Qual das opções abaixo é usada para definir uma constraint (restrição) em um generic no TypeScript?',
            options: [
              'T extends SomeType',
              'T implements SomeType',
              'T requires SomeType',
              'T interface SomeType',
            ],
            correct_index: 0,
          },
          JS: {
            question: "Qual o resultado de 'typeof null' no JavaScript?",
            options: ["'null'", "'undefined'", "'object'", "'string'"],
            correct_index: 2,
          },
          PYTHON: {
            question: 'Qual dessas opções é usada para criar uma lista de forma concisa em Python?',
            options: ['Map generator', 'List comprehension', 'List compiler', 'Lambda definition'],
            correct_index: 1,
          },
          JAVA: {
            question:
              'Qual classe é utilizada para criar strings mutáveis em Java de forma eficiente?',
            options: ['String', 'StringBuffer', 'StringBuilder', 'StringWriter'],
            correct_index: 2,
          },
          RUST: {
            question:
              'Qual conceito do Rust garante a segurança de memória em tempo de compilação sem Garbage Collector?',
            options: [
              'Ownership & Borrowing',
              'Smart Pointers',
              'Automatic Reference Counting',
              'Manual Freeing',
            ],
            correct_index: 0,
          },
          GO: {
            question: 'Como declaramos concorrência em Go?',
            options: [
              'async/await',
              "Utilizando go-routines (palavra-chave 'go')",
              'Threads nativas',
              'Promessas',
            ],
            correct_index: 1,
          },
          KOTLIN: {
            question: 'Qual o operador usado em Kotlin para chamadas seguras (null safety)?',
            options: ['!!', '?.', '?:', '.*'],
            correct_index: 1,
          },
          SWIFT: {
            question: 'Qual palavra-chave é usada para definir propriedades constantes em Swift?',
            options: ['let', 'var', 'const', 'val'],
            correct_index: 0,
          },
          CPP: {
            question:
              "Qual destes operadores é usado para desalocar memória alocada dinamicamente via 'new' em C++?",
            options: ['free()', 'dispose', 'delete', 'remove'],
            correct_index: 2,
          },
        };

        const fallback = fallbackQuizzes[language] || {
          question: `Com base na postagem sobre ${language}, qual seria o comportamento esperado?`,
          options: ['Comportamento A', 'Comportamento B', 'Comportamento C', 'Comportamento D'],
          correct_index: 0,
        };

        await prisma.quiz.create({
          data: {
            post_id: post.id,
            question: fallback.question,
            options: fallback.options,
            correct_index: fallback.correct_index,
          },
        });
      }
    }

    return NextResponse.json({ post, xpResult });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: error.message || 'Erro ao criar post' }, { status: 500 });
  }
}
