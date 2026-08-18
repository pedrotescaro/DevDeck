import { describe, expect, it, vi } from 'vitest';
import { requireRole } from '@/lib/auth';
import { ForbiddenError } from '@/lib/errors';

vi.mock('@/lib/auth-session', () => ({
  getAuthUserId: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  hasDatabaseConnection: () => true,
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseAdminClient: () => null,
}));

import { getAuthUserId } from '@/lib/auth-session';
import { prisma } from '@/lib/prisma';

describe('RBAC Role-Based Access Control', () => {
  it('allows access when user has the required role', async () => {
    vi.mocked(getAuthUserId).mockResolvedValueOnce('admin-123');
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: 'admin-123',
      username: 'admin',
      role: 'ADMIN',
      total_xp: 5000,
      streak_days: 10,
    } as any);

    const user = await requireRole(['ADMIN']);
    expect(user.role).toBe('ADMIN');
  });

  it('throws ForbiddenError when user has insufficient role permissions', async () => {
    vi.mocked(getAuthUserId).mockResolvedValueOnce('user-123');
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: 'user-123',
      username: 'dev',
      role: 'USER',
      total_xp: 200,
      streak_days: 2,
    } as any);

    await expect(requireRole(['ADMIN', 'EVALUATOR'])).rejects.toThrow(ForbiddenError);
  });
});
