import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

vi.mock('@/lib/auth', () => ({
  getAuthUser: vi.fn(async () => null),
}));

vi.mock('@/lib/ratelimit', () => ({
  rateLimit: vi.fn(async () => undefined),
}));

describe('POST /api/run', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it.each(['js', 'ts'])('rejects %s execution on the server', async (language) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const request = new Request('http://localhost:3000/api/run', {
      method: 'POST',
      body: JSON.stringify({ code: "console.log('ok')", language }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      ok: false,
      output: '',
      error: 'JavaScript e TypeScript rodam no navegador.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
