import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { FALLBACK_QUIZZES } from '@/lib/config';
import { QuizService } from '@/services/quiz.service';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    quiz: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    quizLibrary: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('QuizService.generateDaily', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.quiz.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.quiz.create).mockResolvedValue({ id: 'daily-quiz' } as any);
  });

  it('publishes a curated library question without an AI request', async () => {
    const libraryQuestion = {
      id: 'library-1',
      question: 'Qual estrutura mantém chaves únicas?',
      options: ['Array', 'Set', 'String', 'Tuple'],
      correct_index: 1,
      tags: ['estruturas'],
    };
    vi.mocked(prisma.quizLibrary.count).mockResolvedValue(1);
    vi.mocked(prisma.quizLibrary.findMany).mockResolvedValue([libraryQuestion] as any);

    await QuizService.generateDaily(new Date('2026-08-21T15:00:00.000Z'));

    expect(prisma.quiz.create).toHaveBeenCalledWith({
      data: {
        question: libraryQuestion.question,
        options: libraryQuestion.options,
        correct_index: libraryQuestion.correct_index,
        is_daily: true,
        scheduled_for: new Date('2026-08-21T00:00:00.000Z'),
      },
    });
  });

  it('uses built-in curated content when the database library is empty', async () => {
    vi.mocked(prisma.quizLibrary.count).mockResolvedValue(0);

    await QuizService.generateDaily(new Date('2026-08-21T15:00:00.000Z'));

    const createdData = vi.mocked(prisma.quiz.create).mock.calls[0][0].data;
    expect(Object.values(FALLBACK_QUIZZES)).toContainEqual({
      question: createdData.question,
      options: createdData.options,
      correct_index: createdData.correct_index,
    });
    expect(prisma.quizLibrary.findMany).not.toHaveBeenCalled();
  });
});
