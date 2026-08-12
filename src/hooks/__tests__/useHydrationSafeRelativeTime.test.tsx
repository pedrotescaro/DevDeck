import { act } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useHydrationSafeRelativeTime } from '@/hooks/useHydrationSafeRelativeTime';

function RelativeTimeProbe({ date }: { date: string }) {
  const { text, isRelative } = useHydrationSafeRelativeTime(date);

  return (
    <time dateTime={date} data-relative={isRelative ? 'true' : 'false'}>
      {text}
    </time>
  );
}

describe('useHydrationSafeRelativeTime', () => {
  let hydratedRoot: Root | null = null;

  beforeEach(() => {
    vi.useFakeTimers();
    (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT?: boolean;
      }
    ).IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    if (hydratedRoot) {
      act(() => hydratedRoot?.unmount());
      hydratedRoot = null;
    }

    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('hydrates without a text mismatch when the clock crosses a minute boundary', async () => {
    const createdAt = '2026-08-12T12:00:00.000Z';
    vi.setSystemTime(new Date('2026-08-12T12:00:59.900Z'));

    const serverHtml = renderToString(<RelativeTimeProbe date={createdAt} />);
    expect(serverHtml).toContain('12/08/2026');

    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    vi.setSystemTime(new Date('2026-08-12T12:01:00.100Z'));
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await act(async () => {
      hydratedRoot = hydrateRoot(container, <RelativeTimeProbe date={createdAt} />);
      await Promise.resolve();
    });

    expect(container.querySelector('time')).toHaveTextContent('1m atrás');
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('refreshes the relative label once per minute after mounting', () => {
    const createdAt = '2026-08-12T12:00:00.000Z';
    vi.setSystemTime(new Date('2026-08-12T12:00:30.000Z'));

    render(<RelativeTimeProbe date={createdAt} />);
    expect(screen.getByText('agora')).toHaveAttribute('data-relative', 'true');

    act(() => vi.advanceTimersByTime(60_000));

    expect(screen.getByText('1m atrás')).toHaveAttribute('data-relative', 'true');
  });
});
