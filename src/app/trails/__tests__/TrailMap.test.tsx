import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrailMap } from '@/app/trails/TrailMap';
import type { TrailLevel } from '@/lib/trailsData';

function createLevel(levelNumber: number, title: string): TrailLevel {
  return {
    levelNumber,
    unitNumber: 1,
    unitTitle: 'Sintaxe Básica',
    sectionName: 'Júnior - Iniciante',
    title,
    description: title,
    questions: [
      {
        id: `js-l${levelNumber}-q1`,
        question: 'Pergunta?',
        options: ['A', 'B'],
        correctIndex: 0,
      },
    ],
  };
}

const levels = [
  createLevel(1, 'Sintaxe Básica'),
  createLevel(2, 'Estruturas de Controle'),
  createLevel(3, 'Arrays e Objetos'),
];

describe('TrailMap', () => {
  it('renders the supplied robot asset and keeps completed lessons actionable', () => {
    const onLevelClick = vi.fn();

    render(
      <TrailMap
        activeLanguage="JS"
        allLevels={levels}
        levels={levels}
        attempts={{ 'js-l1-q1': true, 'js-l2-q1': true }}
        isLevelUnlocked={(index) => index === 0}
        onLevelClick={onLevelClick}
        onCheckpointClick={vi.fn()}
      />
    );

    const robot = screen.getByAltText('Robô mascote do DevDeck digitando');
    expect(robot).toHaveAttribute('src', expect.stringContaining('blue-devdeck-robot.png'));

    const completedSecondLesson = screen.getByRole('button', {
      name: 'Seção 1, unidade 2: Estruturas de Controle',
    });
    expect(completedSecondLesson).toBeEnabled();
    fireEvent.click(completedSecondLesson);
    expect(onLevelClick).toHaveBeenCalledWith(levels[1], true);
  });

  it('places a bare chest as a path node and keeps the expanded progression locked', () => {
    const onCheckpointClick = vi.fn();

    render(
      <TrailMap
        activeLanguage="JS"
        allLevels={levels}
        levels={levels}
        attempts={{}}
        isLevelUnlocked={(index) => index === 0}
        onLevelClick={vi.fn()}
        onCheckpointClick={onCheckpointClick}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Seção 1, unidade 3: Arrays e Objetos' })
    ).toBeDisabled();
    const chestNode = screen.getByRole('button', { name: 'Baú da trilha' });
    expect(screen.getByAltText('Baú da trilha')).toHaveAttribute(
      'src',
      expect.stringContaining('trail-chest.png')
    );
    expect(chestNode).toContainElement(screen.getByAltText('Baú da trilha'));
    expect(screen.queryByText('Recompensa')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Passo de objetos: Propriedades' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Passo de objetos: Revisão' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Checkpoint da seção 1' }));
    expect(onCheckpointClick).toHaveBeenCalledWith(1);
  });
});
