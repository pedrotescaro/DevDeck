import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../[id]/attempt/route';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { XpService } from '@/services/xp.service';

vi.mock('@/lib/auth', () => {
  const getAuthUser = vi.fn();
  return {
    getAuthUser,
    requireAuth: vi.fn(async () => {
      const user = await getAuthUser();
      if (!user) {
        const { UnauthorizedError } = await import('@/lib/errors');
        throw new UnauthorizedError('UNAUTHORIZED', 'Autenticação necessária');
      }
      return user;
    }),
  };
});

vi.mock('@/lib/prisma', () => ({
  prisma: {
    quiz: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    quizAttempt: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('@/services/xp.service', () => ({
  XpService: {
    awardXP: vi.fn(() =>
      Promise.resolve({
        xpEarned: 15,
        newXp: 150,
        newLevel: 2,
      })
    ),
  },
}));

describe('POST /api/quiz/[id]/attempt integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should record a correct quiz attempt and award XP', async () => {
    const mockUser = { id: 'user-123', username: 'testuser', total_xp: 100 };
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as any);

    const mockQuiz = {
      id: 'quiz-123',
      correct_index: 1,
      post: { language: 'TS' },
    };
    vi.mocked(prisma.quiz.findUnique).mockResolvedValue(mockQuiz as any);
    vi.mocked(prisma.quizAttempt.findUnique).mockResolvedValue(null);

    const mockAttempt = {
      id: 'attempt-123',
      user_id: 'user-123',
      quiz_id: 'quiz-123',
      selected_index: 1,
      is_correct: true,
      xp_earned: 15,
    };
    vi.mocked(prisma.quizAttempt.create).mockResolvedValue(mockAttempt as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ total_xp: 115 } as any);

    const request = new Request('http://localhost:3000/api/quiz/quiz-123/attempt', {
      method: 'POST',
      body: JSON.stringify({ selected_index: 1 }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'quiz-123' }) });
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.is_correct).toBe(true);
    expect(json.attempt.id).toBe('attempt-123');
    expect(XpService.awardXP).toHaveBeenCalledWith('user-123', 'TS', 15);
    expect(json.xpResult.newTotalXp).toBe(115);
  });

  it('should award language XP on the first attempt for an existing trail quiz', async () => {
    const mockUser = { id: 'user-123', username: 'testuser', total_xp: 100 };
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as any);

    vi.mocked(prisma.quiz.findUnique).mockResolvedValue({
      id: 'js-l1-q1',
      correct_index: 1,
      post: null,
    } as any);
    vi.mocked(prisma.quizAttempt.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.quizAttempt.create).mockResolvedValue({
      id: 'attempt-123',
      user_id: 'user-123',
      quiz_id: 'js-l1-q1',
      selected_index: 1,
      is_correct: true,
      xp_earned: 15,
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ total_xp: 115 } as any);

    const request = new Request('http://localhost:3000/api/quiz/js-l1-q1/attempt', {
      method: 'POST',
      body: JSON.stringify({ selected_index: 1 }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'js-l1-q1' }) });

    expect(response.status).toBe(200);
    expect(XpService.awardXP).toHaveBeenCalledWith('user-123', 'JS', 15);
  });

  it('should not overwrite an existing quiz attempt', async () => {
    const mockUser = { id: 'user-123', username: 'testuser', total_xp: 100 };
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as any);

    vi.mocked(prisma.quiz.findUnique).mockResolvedValue({
      id: 'js-l1-q1',
      correct_index: 1,
      post: null,
    } as any);
    vi.mocked(prisma.quizAttempt.findUnique).mockResolvedValue({
      id: 'attempt-123',
      user_id: 'user-123',
      quiz_id: 'js-l1-q1',
      selected_index: 0,
      is_correct: false,
      xp_earned: 0,
    } as any);

    const request = new Request('http://localhost:3000/api/quiz/js-l1-q1/attempt', {
      method: 'POST',
      body: JSON.stringify({ selected_index: 1 }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: 'js-l1-q1' }) });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.is_correct).toBe(false);
    expect(json.attempt.selected_index).toBe(0);
    expect(prisma.quizAttempt.update).not.toHaveBeenCalled();
    expect(XpService.awardXP).not.toHaveBeenCalled();
  });
});
