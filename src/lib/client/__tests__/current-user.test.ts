import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentUser, invalidateCurrentUser } from '@/lib/client/current-user';

describe('current user request cache', () => {
  beforeEach(() => {
    invalidateCurrentUser();
    vi.restoreAllMocks();
  });

  it('deduplicates simultaneous requests and reuses the short-lived result', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'user-1', username: 'pedro' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const [first, second] = await Promise.all([
      getCurrentUser<{ id: string }>(),
      getCurrentUser<{ id: string }>(),
    ]);
    const third = await getCurrentUser<{ id: string }>();

    expect(first?.id).toBe('user-1');
    expect(second).toEqual(first);
    expect(third).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not restore stale data after the cache is invalidated', async () => {
    let resolveFirstRequest: ((response: Response) => void) | undefined;
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            resolveFirstRequest = resolve;
          })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'user-2' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    vi.stubGlobal('fetch', fetchMock);

    const staleRequest = getCurrentUser<{ id: string }>();
    invalidateCurrentUser();
    const freshUser = await getCurrentUser<{ id: string }>();

    resolveFirstRequest?.(
      new Response(JSON.stringify({ id: 'user-1' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    await staleRequest;

    expect(freshUser?.id).toBe('user-2');
    expect((await getCurrentUser<{ id: string }>())?.id).toBe('user-2');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries a temporary server outage without treating it as logout', async () => {
    const connectionStates: string[] = [];
    const handleConnectionState = (event: Event) => {
      const state = (event as CustomEvent<{ state: string }>).detail.state;
      connectionStates.push(state);
    };
    window.addEventListener('devdeck:connection-state', handleConnectionState);

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'user-1' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    vi.stubGlobal('fetch', fetchMock);

    const user = await getCurrentUser<{ id: string }>();
    window.removeEventListener('devdeck:connection-state', handleConnectionState);

    expect(user?.id).toBe('user-1');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(connectionStates).toEqual(['degraded', 'restored']);
  });
});
