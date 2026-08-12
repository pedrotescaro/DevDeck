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

  it('prefers the pooled runtime URL and keeps a conservative serverless pool', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://pooled.example.test:6543/devdeck');
    vi.stubEnv('DIRECT_URL', 'postgresql://direct.example.test:5432/devdeck');
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('DATABASE_POOL_MAX', '');
    vi.resetModules();

    const { getDatabaseConnectionString, getDatabasePoolMax, prisma } =
      await import('@/lib/prisma');

    expect(getDatabaseConnectionString()).toBe('postgresql://pooled.example.test:6543/devdeck');
    expect(getDatabasePoolMax()).toBe(1);

    await prisma.$disconnect();
  });

  it('allows an explicit pool-size override', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('DATABASE_POOL_MAX', '3');
    vi.resetModules();

    const { getDatabasePoolMax, prisma } = await import('@/lib/prisma');

    expect(getDatabasePoolMax()).toBe(3);

    await prisma.$disconnect();
  });

  it('prefers the direct URL for Prisma CLI workflows', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://pooled.example.test:6543/devdeck');
    vi.stubEnv('DIRECT_URL', 'postgresql://direct.example.test:5432/devdeck');
    vi.resetModules();

    const { default: config } = await import('../../../prisma.config');

    expect(config.datasource?.url).toBe('postgresql://direct.example.test:5432/devdeck');
  }, 30_000);
});
