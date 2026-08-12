// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getUnreadCount: vi.fn(),
  loggerWarn: vi.fn(),
}));

vi.mock('@/services/notification.service', () => ({
  NotificationService: {
    getUnreadCount: mocks.getUnreadCount,
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: mocks.loggerWarn,
  },
}));

import { handleUnreadCountRequest } from '../handler';

const request = new Request('http://localhost:3000/api/notifications/unread-count');
const params = Promise.resolve({});

describe('GET /api/notifications/unread-count handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns zero without querying notifications when the session is absent', async () => {
    const response = await handleUnreadCountRequest(request, { session: null, params });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 0 });
    expect(mocks.getUnreadCount).not.toHaveBeenCalled();
  });

  it('returns the unread notification count', async () => {
    mocks.getUnreadCount.mockResolvedValue(7);

    const response = await handleUnreadCountRequest(request, {
      session: { id: 'user-1' },
      params,
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 7 });
    expect(mocks.getUnreadCount).toHaveBeenCalledWith('user-1');
  });

  it('degrades a transient connection failure to a zero count', async () => {
    mocks.getUnreadCount.mockRejectedValue(
      Object.assign(new Error('Maximum database sessions reached'), {
        code: 'EMAXCONNSESSION',
      })
    );

    const response = await handleUnreadCountRequest(request, {
      session: { id: 'user-1' },
      params,
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ count: 0 });
    expect(mocks.loggerWarn).toHaveBeenCalledWith(
      'Notification unread count temporarily unavailable',
      {
        code: 'EMAXCONNSESSION',
        errorMessage: 'Maximum database sessions reached',
      }
    );
  });

  it('propagates a non-transient notification error', async () => {
    const error = new Error('Invalid notification query');
    mocks.getUnreadCount.mockRejectedValue(error);

    await expect(
      handleUnreadCountRequest(request, {
        session: { id: 'user-1' },
        params,
      })
    ).rejects.toBe(error);
    expect(mocks.loggerWarn).not.toHaveBeenCalled();
  });
});
