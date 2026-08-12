// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Prisma environment configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('fails explicitly instead of connecting to localhost when URLs are absent', async () => {
    vi.stubEnv('DIRECT_URL', '');
    vi.stubEnv('DATABASE_URL', '');
    vi.resetModules();

    const { hasDatabaseConnection, prisma } = await import('@/lib/prisma');

    expect(hasDatabaseConnection()).toBe(false);
    await expect(prisma.user.findUnique({ where: { id: 'user-1' } })).rejects.toMatchObject({
      code: 'DATABASE_NOT_CONFIGURED',
    });

    await prisma.$disconnect();
  });
});
