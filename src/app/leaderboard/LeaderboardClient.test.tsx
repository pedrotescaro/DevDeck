import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeaderboardClient } from './LeaderboardClient';

vi.mock('@/components/Sidebar', () => ({
  Sidebar: (props: Record<string, unknown>) => (
    <aside data-testid="sidebar" data-variant={props.variant ?? 'default'} />
  ),
}));

const viewer = {
  id: 'viewer-1',
  username: 'pedro',
  avatar_url: null,
  total_xp: 720,
  streak: 4,
};

const leaderboard = [
  { rank: 1, username: 'alice', avatar_url: null, xp: 900, level: 1 },
  { rank: 2, username: 'bruno', avatar_url: null, xp: 800, level: 1 },
  { rank: 3, username: 'pedro', avatar_url: null, xp: 720, level: 1 },
  { rank: 4, username: 'carol', avatar_url: null, xp: 500, level: 1 },
];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('LeaderboardClient', () => {
  it('usa a sidebar padrão e apresenta a classificação somente em XP', () => {
    render(<LeaderboardClient initialUser={viewer} initialLeaderboard={leaderboard} />);

    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-variant', 'default');
    expect(screen.getByRole('heading', { level: 1, name: 'Ranking de XP' })).toBeInTheDocument();
    expect(screen.getAllByText('900 XP').length).toBeGreaterThan(0);
    expect(screen.getAllByText('500 XP').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: '1º lugar, alice, 900 XP' })).toHaveAttribute(
      'href',
      '/profile/alice'
    );
    expect(screen.getByRole('link', { name: '4º lugar, carol, 500 XP' })).toHaveAttribute(
      'href',
      '/profile/carol'
    );
    expect(screen.queryByText('Alexa miliano')).not.toBeInTheDocument();
    expect(screen.queryByText(/\bRP\b|divisão|temporada|liga/i)).not.toBeInTheDocument();
  });

  it('troca para o XP da linguagem sem refazer a requisição em loop', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ rank: 1, username: 'pythonista', avatar_url: null, xp: 420, level: 2 }],
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<LeaderboardClient initialUser={viewer} initialLeaderboard={leaderboard} />);
    await user.selectOptions(screen.getByLabelText('Filtrar ranking por linguagem'), 'PYTHON');

    expect(await screen.findByText('420 XP')).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith('/api/leaderboard?language=PYTHON', {
      signal: expect.any(AbortSignal),
    });
  });
});
