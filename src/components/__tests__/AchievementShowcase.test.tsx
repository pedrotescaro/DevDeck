import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AchievementShowcase, type AchievementBadge } from '../AchievementShowcase';

const badges: AchievementBadge[] = [
  {
    slug: 'hello_world',
    label: 'Hello World!',
    description: 'Primeiro código',
    icon: '👋',
    color: '#22d48a',
    earned_at: null,
  },
  {
    slug: 'python_master',
    label: 'Python Master',
    description: 'Nível dez em Python',
    icon: '🐍',
    color: '#5ba3f5',
    earned_at: null,
  },
  {
    slug: 'speed_coder',
    label: 'Speed Coder',
    description: 'Venceu um duelo',
    icon: '⚡',
    color: '#f5a623',
    earned_at: null,
  },
  {
    slug: 'typescript_wizard',
    label: 'Mago do TypeScript',
    description: 'Dominou generics',
    icon: '🧙‍♂️',
    color: '#5ba3f5',
    earned_at: '2026-08-14T12:00:00.000Z',
  },
  {
    slug: 'code_streak',
    label: '100-Day Code Streak',
    description: 'Ofensiva de código',
    icon: '🔥',
    color: '#f5a623',
    earned_at: '2026-08-14T12:00:00.000Z',
  },
];

describe('AchievementShowcase', () => {
  it('mostra a prévia compacta do feed na ordem visual e com acesso ao perfil', () => {
    render(
      <AchievementShowcase
        badges={badges}
        variant="compact"
        viewAllHref="/profile/pedrotescaro?tab=badges"
      />
    );

    expect(screen.getByRole('heading', { name: 'Conquistas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas' })).toHaveAttribute(
      'href',
      '/profile/pedrotescaro?tab=badges'
    );
    expect(screen.getAllByRole('img')).toHaveLength(3);
    const streakBadge = screen.getByRole('img', { name: /Code Streak, nível 9/ });
    expect(streakBadge).toBeInTheDocument();
    expect(streakBadge).toHaveTextContent('100-Day Code Streak');
    expect(streakBadge.firstElementChild).toHaveClass('h-[112px]');
    expect(screen.getByRole('img', { name: /Mago do TypeScript, nível 10/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Python Master, nível 10/ })).toBeInTheDocument();
  });

  it('mostra a coleção completa no perfil', () => {
    render(<AchievementShowcase badges={badges} />);

    const completeCollection = screen.getAllByRole('img');
    expect(completeCollection).toHaveLength(5);
    expect(screen.getByText('Hello World!')).toBeInTheDocument();
    expect(screen.getByText('Speed Coder')).toBeInTheDocument();
    expect(completeCollection[0]?.firstElementChild).toHaveClass('h-[158px]');
    expect(screen.queryByRole('link', { name: 'Ver todas' })).not.toBeInTheDocument();
  });
});
