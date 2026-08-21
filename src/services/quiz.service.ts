import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { XpService } from './xp.service';
import { findTrailQuestionById } from '@/lib/trailsData';
import { NotificationService } from './notification.service';
import { FALLBACK_QUIZZES, XP_QUIZ_CORRECT } from '@/lib/config';

type QuizContent = {
  question: string;
  options: string[];
  correct_index: number;
};

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

    let quizData: QuizContent | null = null;
    let source: 'library' | 'built-in' = 'library';

    // Daily quizzes come from curated content instead of a paid AI request.
    const libraryCount = await prisma.quizLibrary.count();
    if (libraryCount > 0) {
      const randomIndex = Math.floor(Math.random() * libraryCount);
      const libraryItems = await prisma.quizLibrary.findMany({
        skip: randomIndex,
        take: 1,
      });

      if (libraryItems.length > 0) {
        const item = libraryItems[0];
        quizData = {
          question: item.question,
          options: item.options as string[],
          correct_index: item.correct_index,
        };
      }
    }

    // Keep the daily experience available even before the curated library is seeded.
    if (!quizData) {
      const builtInQuizzes = Object.values(FALLBACK_QUIZZES);
      const dayIndex = Math.floor(todayStr.getTime() / 86_400_000);
      quizData = builtInQuizzes[Math.abs(dayIndex) % builtInQuizzes.length];
      source = 'built-in';
    }

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
      xpAmount = selectedAnswerIsCorrect ? XP_QUIZ_CORRECT : 0;
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
};
