import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrailMap } from '@/app/trails/TrailMap';
import type { TrailLevel } from '@/lib/trailsData';

function createLevel(levelNumber: number, unitNumber: number, title: string): TrailLevel {
  return {
    levelNumber,
    unitNumber,
    unitTitle: `Unidade ${unitNumber}`,
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

describe('TrailMap', () => {
  it('empilha todas as unidades, cada uma com divisória, robôs, baú e checkpoint', () => {
    const levels = [
      createLevel(1, 1, 'Sintaxe Básica'),
      createLevel(2, 1, 'Estruturas de Controle'),
      createLevel(3, 2, 'Funções'),
      createLevel(4, 2, 'Arrays'),
    ];

    render(
      <TrailMap
        activeLanguage="JS"
        allLevels={levels}
        attempts={{}}
        isLevelUnlocked={(index) => index === 0}
        onLevelClick={vi.fn()}
        onCheckpointClick={vi.fn()}
      />
    );

    // Linha divisória com o texto de cada unidade
    expect(screen.getByText('Unidade 1')).toBeInTheDocument();
    expect(screen.getByText('Unidade 2')).toBeInTheDocument();

    // Popup "Pular pra cá" no primeiro nó não concluído de cada unidade
    expect(screen.getAllByText('PULAR PRA CÁ?')).toHaveLength(2);

    // Robôs e baú em CADA unidade
    expect(screen.getAllByTestId('trail-robot')).toHaveLength(2);
    expect(screen.getAllByTestId('trail-robot-gaming')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Baú da trilha' })).toHaveLength(2);

    // Checkpoint de cada seção
    expect(screen.getByRole('button', { name: 'Checkpoint da seção 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Checkpoint da seção 2' })).toBeInTheDocument();

    // Todas as unidades aparecem
    expect(
      screen.getByRole('button', { name: 'Seção 1, unidade 1: Sintaxe Básica' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Seção 2, unidade 2: Arrays' })).toBeInTheDocument();

    // Passo circular depois do penúltimo nó de cada unidade
    expect(screen.getAllByRole('button', { name: 'Passo final de Arrays' })).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: 'Passo final de Estruturas de Controle' })
    ).toBeInTheDocument();

    // Níveis bloqueados ficam desabilitados
    expect(
      screen.getByRole('button', { name: 'Seção 1, unidade 2: Estruturas de Controle' })
    ).toBeDisabled();
  });

  it('keeps completed lessons actionable and fires checkpoint click', () => {
    const onLevelClick = vi.fn();
    const onCheckpointClick = vi.fn();
    const levels = [
      createLevel(1, 1, 'Sintaxe Básica'),
      createLevel(2, 1, 'Estruturas de Controle'),
    ];

    render(
      <TrailMap
        activeLanguage="JS"
        allLevels={levels}
        attempts={{ 'js-l1-q1': true, 'js-l2-q1': true }}
        isLevelUnlocked={(index) => index === 0}
        onLevelClick={onLevelClick}
        onCheckpointClick={onCheckpointClick}
      />
    );

    // Primeiro nó já concluído: sem popup "Pular pra cá"
    expect(screen.queryByText('PULAR PRA CÁ?')).not.toBeInTheDocument();

    const completedSecondLesson = screen.getByRole('button', {
      name: 'Seção 1, unidade 2: Estruturas de Controle',
    });
    expect(completedSecondLesson).toBeEnabled();
    fireEvent.click(completedSecondLesson);
    expect(onLevelClick).toHaveBeenCalledWith(levels[1], true);

    fireEvent.click(screen.getByRole('button', { name: 'Checkpoint da seção 1' }));
    expect(onCheckpointClick).toHaveBeenCalledWith(1);
  });

  it('primeiro nó iniciado (mesmo incompleto) mostra o ícone de concluído e esconde o popup', () => {
    const levels = [createLevel(1, 1, 'Sintaxe Básica')];

    const { container } = render(
      <TrailMap
        activeLanguage="JS"
        allLevels={levels}
        attempts={{ 'js-l1-q1': false }}
        isLevelUnlocked={(index) => index === 0}
        onLevelClick={vi.fn()}
        onCheckpointClick={vi.fn()}
      />
    );

    // A lição foi respondida (mesmo errado): popup some e aparece o ✅
    expect(screen.queryByText('PULAR PRA CÁ?')).not.toBeInTheDocument();
    expect(container.querySelector('.lucide-check')).toBeInTheDocument();
    expect(container.querySelector('.lucide-fast-forward')).not.toBeInTheDocument();
  });

  it('primeiro nó nunca tocado mostra o ícone de dois plays e o popup', () => {
    const levels = [createLevel(1, 1, 'Sintaxe Básica')];

    const { container } = render(
      <TrailMap
        activeLanguage="JS"
        allLevels={levels}
        attempts={{}}
        isLevelUnlocked={(index) => index === 0}
        onLevelClick={vi.fn()}
        onCheckpointClick={vi.fn()}
      />
    );

    expect(screen.getByText('PULAR PRA CÁ?')).toBeInTheDocument();
    expect(container.querySelector('.lucide-fast-forward')).toBeInTheDocument();
    expect(container.querySelector('.lucide-check')).not.toBeInTheDocument();
  });

  it('checkpoint concluído fica com a cor do tema em vez de cinza', () => {
    const levels = [createLevel(1, 1, 'Sintaxe Básica')];

    render(
      <TrailMap
        activeLanguage="JS"
        allLevels={levels}
        attempts={{ 'js-u1-checkpoint': true }}
        isLevelUnlocked={(index) => index === 0}
        onLevelClick={vi.fn()}
        onCheckpointClick={vi.fn()}
      />
    );

    const checkpoint = screen.getByRole('button', { name: 'Checkpoint da seção 1' });
    // Usa a cor do tema da seção (azul), não o cinza de bloqueado
    expect(checkpoint.className).toContain('bg-blue-500');
    expect(checkpoint.className).not.toContain('bg-[#37464f]');
  });

  it('tinge o baú com a cor do tema de cada unidade', () => {
    const levels = [
      createLevel(1, 1, 'Sintaxe Básica'),
      createLevel(2, 1, 'Estruturas de Controle'),
      createLevel(3, 2, 'Funções'),
      createLevel(4, 2, 'Arrays'),
    ];

    const { container } = render(
      <TrailMap
        activeLanguage="JS"
        allLevels={levels}
        attempts={{}}
        isLevelUnlocked={(index) => index === 0}
        onLevelClick={vi.fn()}
        onCheckpointClick={vi.fn()}
      />
    );

    const chests = container.querySelectorAll('img[alt="Baú da trilha"]');
    expect(chests).toHaveLength(2);

    // Unidade 1 (azul, tema original) fica com hue-rotate 0
    expect(chests[0].getAttribute('style')).toContain('hue-rotate(0');
    // Unidade 2 (roxo) recebe um filtro diferente
    expect(chests[1].getAttribute('style')).not.toBe(chests[0].getAttribute('style'));
    expect(chests[1].getAttribute('style')).toContain('hue-rotate(53');
  });

  it('opens the reward chest modal when the chest is unlocked', () => {
    const levels = [
      createLevel(1, 1, 'Sintaxe Básica'),
      createLevel(2, 1, 'Estruturas de Controle'),
    ];

    render(
      <TrailMap
        activeLanguage="JS"
        allLevels={levels}
        attempts={{ 'js-l2-q1': true }}
        isLevelUnlocked={(index) => index === 0}
        onLevelClick={vi.fn()}
        onCheckpointClick={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Baú da trilha' }));

    expect(screen.getByText('Baú de Recompensa Resgatado!')).toBeInTheDocument();
    expect(screen.getByText('+150 XP Bônus')).toBeInTheDocument();
  });
});
