import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { XpService } from './xp.service';
import { findTrailQuestionById } from '@/lib/trailsData';
import { NotificationService } from './notification.service';
import { generateQuizAI, AIQuizResponse } from '@/lib/ai';

export const QuizService = {
  async generateDaily(scheduledFor: Date) {
    const todayStr = new Date(scheduledFor.getTime());
    todayStr.setUTCHours(0, 0, 0, 0);

    // 1. Idempotent check
    const existing = await prisma.quiz.findUnique({
      where: { scheduled_for: todayStr },
    });

    if (existing) {
      logger.info('Daily quiz already exists for date', { date: todayStr.toISOString() });
      return existing;
    }

    let quizData: AIQuizResponse | null = null;
    let source: 'ai' | 'library' | 'null' = 'null';

    // 2. Try AI Geração
    try {
      const systemPrompt = 'Você é um assistente técnico especialista em programação.';
      const userPrompt = `Gere um quiz de múltipla escolha sobre tecnologia de software, adequado para desenvolvedores de nível intermediário. O quiz deve ser sobre um dos temas: linguagens de programação, arquitetura de software, algoritmos, boas práticas, ferramentas de desenvolvimento ou paradigmas de programação. Retorne APENAS JSON válido, sem markdown, sem explicações extras. Schema: { "question": string, "options": [string, string, string, string], "correct_index": number (0-3), "explanation": string, "tags": [string] }`;

      quizData = await generateQuizAI(systemPrompt, userPrompt);
      if (quizData) {
        source = 'ai';
      }
    } catch (err) {
      logger.error('AI quiz generation completely failed', { error: String(err) });
    }

    // 3. Fallback to QuizLibrary
    if (!quizData) {
      const libraryCount = await prisma.quizLibrary.count();
      if (libraryCount > 0) {
        const randomIndex = Math.floor(Math.random() * libraryCount);
        const fallbackItem = await prisma.quizLibrary.findMany({
          skip: randomIndex,
          take: 1,
        });

        if (fallbackItem.length > 0) {
          const item = fallbackItem[0];
          quizData = {
            question: item.question,
            options: item.options as string[],
            correct_index: item.correct_index,
            explanation: `Questão importada da biblioteca de fallback. Tags: ${item.tags.join(', ')}`,
            tags: item.tags,
          };
          source = 'library';
        }
      }
    }

    if (!quizData) {
      logger.error('Quiz library is empty and OpenAI failed. No quiz generated.', {
        scheduledFor: todayStr.toISOString(),
      });
      return null;
    }

    // 4. Create the quiz
    const createdQuiz = await prisma.quiz.create({
      data: {
        question: quizData.question,
        options: quizData.options,
        correct_index: quizData.correct_index,
        is_daily: true,
        scheduled_for: todayStr,
      },
    });

    logger.info('Quiz generated successfully', {
      source,
      scheduledFor: todayStr.toISOString(),
      quizId: createdQuiz.id,
    });

    return createdQuiz;
  },

  async validateQuizAnswer(userId: string, quizId: string, selectedIndex: number) {
    const trailInfo = findTrailQuestionById(quizId);
    let quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        post: true,
      },
    });

    let correctIndex = 0;
    let language: string | null = null;

    if (!quiz) {
      if (!trailInfo) {
        throw new Error('QUIZ_NOT_FOUND');
      }

      // Dynamically provision trail questions in the DB
      quiz = await prisma.quiz.create({
        data: {
          id: quizId,
          question: trailInfo.question.question,
          options: trailInfo.question.options,
          correct_index: trailInfo.question.correctIndex,
          is_daily: false,
        },
        include: {
          post: true,
        },
      });

      correctIndex = trailInfo.question.correctIndex;
      language = trailInfo.language;
    } else {
      correctIndex = quiz.correct_index;
      language = quiz.post?.language ?? trailInfo?.language ?? null;
    }

    const selectedAnswerIsCorrect = selectedIndex === correctIndex;
    let isCorrect = selectedAnswerIsCorrect;

    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        user_id_quiz_id: {
          user_id: userId,
          quiz_id: quiz.id,
        },
      },
    });

    let attempt;
    let xpAmount = 0;
    let xpResult = null;

    if (existingAttempt) {
      attempt = existingAttempt;
      isCorrect = existingAttempt.is_correct;
    } else {
      xpAmount = selectedAnswerIsCorrect ? 15 : 0;
      attempt = await prisma.quizAttempt.create({
        data: {
          user_id: userId,
          quiz_id: quiz.id,
          selected_index: selectedIndex,
          is_correct: selectedAnswerIsCorrect,
          xp_earned: xpAmount,
        },
      });
      if (selectedAnswerIsCorrect) {
        xpResult = await XpService.awardXP(userId, language as any, xpAmount);
      }
    }

    if (xpAmount > 0) {
      try {
        await NotificationService.create({
          userId,
          type: 'QUIZ_CORRECT',
          resourceId: quiz.id,
          resourceType: 'QUIZ',
        });
      } catch (err) {
        logger.error('Failed to dispatch quiz correct notification', { error: String(err) });
      }
    }

    logger.info('Quiz answered', {
      userId,
      quizId: quiz.id,
      isCorrect,
      xpAwarded: xpAmount,
    });

    return {
      attempt,
      correctIndex,
      isCorrect,
      xpResult,
    };
  },

  async generateForPost(
    postId: string,
    language: string,
    title: string,
    body: string,
    code?: string
  ) {
    let quizCreated = false;

    try {
      const systemPrompt =
        'Você é um assistente técnico especialista em programação. Gere um quiz de múltipla escolha com exatamente 4 opções baseada na postagem enviada.';
      const userPrompt = `Gere um quiz em formato JSON bruto.
Linguagem: ${language}
Título: ${title}
Conteúdo: ${body}
Código: ${code || ''}

Formato do JSON esperado:
{
  "question": "Pergunta do quiz",
  "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "correct_index": 0
}`;

      const quizData = await generateQuizAI(systemPrompt, userPrompt);
      if (quizData) {
        await prisma.quiz.create({
          data: {
            post_id: postId,
            question: quizData.question,
            options: quizData.options,
            correct_index: quizData.correct_index,
          },
        });
        quizCreated = true;
      }
    } catch (aiError) {
      logger.error('AI Post Quiz generation failed, falling back', {
        error: String(aiError),
      });
    }

    if (!quizCreated) {
      // Fallback quizzes list
      const fallbackQuizzes: Record<
        string,
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
          post_id: postId,
          question: fallback.question,
          options: fallback.options,
          correct_index: fallback.correct_index,
        },
      });
    }
  },
};

// Removed fetchOpenAIQuiz as it is superseded by generateQuizAI
