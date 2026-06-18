import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { awardXP } from '@/lib/xp';

vi.mock('@/lib/auth', () => ({
  getAuthUser: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      create: vi.fn(),
    },
    quiz: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/xp', () => ({
  awardXP: vi.fn(() =>
    Promise.resolve({
      xpEarned: 10,
      newXp: 100,
      newLevel: 1,
    })
  ),
}));

describe('POST /api/posts integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject unauthenticated request', async () => {
    vi.mocked(getAuthUser).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Valid Title',
        body: 'This is a valid body with more than 10 characters.',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe('Não autorizado');
  });

  it('should create a post and award XP for authenticated users', async () => {
    const mockUser = { id: 'user-123', username: 'testuser' };
    vi.mocked(getAuthUser).mockResolvedValue(mockUser as any);

    const createdPostMock = {
      id: 'post-123',
      title: 'Valid Title',
      body: 'This is a valid body with more than 10 characters.',
      language: 'TS',
    };
    vi.mocked(prisma.post.create).mockResolvedValue(createdPostMock as any);
    vi.mocked(prisma.quiz.create).mockResolvedValue({ id: 'quiz-123' } as any);

    const request = new Request('http://localhost:3000/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Valid Title',
        body: 'This is a valid body with more than 10 characters.',
        language: 'TS',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.post.id).toBe('post-123');
    expect(awardXP).toHaveBeenCalledWith('user-123', 'TS', 10);
  });
});
