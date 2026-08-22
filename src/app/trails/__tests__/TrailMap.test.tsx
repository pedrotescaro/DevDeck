import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrailMap } from '@/app/trails/TrailMap';
import type { KnowledgeMapNode } from '@/lib/learning/types';

const nodes: KnowledgeMapNode[] = [
  {
    id: 'foundations',
    slug: 'foundations',
    title: 'Fundamentos',
    description: 'Base compartilhada',
    type: 'FOUNDATION',
    category: 'Fundamentos',
    language: 'JS',
    difficulty: 3,
    xpReward: 120,
    estimatedMinutes: 90,
    position: { x: 80, y: 100 },
    status: 'COMPLETED',
    mastery: 85,
    completedExercises: 1,
    exercises: [],
    prerequisites: [],
  },
  {
    id: 'react',
    slug: 'react-state',
    title: 'Arquitetura de Estado React',
    description: 'Estado previsível',
    type: 'FRAMEWORK',
    category: 'Frontend',
    language: 'TS',
    difficulty: 5,
    xpReward: 230,
    estimatedMinutes: 190,
    position: { x: 340, y: 220 },
    status: 'RECOMMENDED',
    mastery: 0,
    completedExercises: 0,
    exercises: [],
    prerequisites: [
      {
        nodeId: 'foundations',
        title: 'Fundamentos',
        relation: 'RECOMMENDED',
        status: 'COMPLETED',
        completed: true,
      },
    ],
  },
];

describe('TrailMap', () => {
  it('renders the same selectable knowledge nodes in graph and mobile views', () => {
    const onSelectNode = vi.fn();

    render(
      <TrailMap
        nodes={nodes}
        edges={[
          {
            id: 'edge-1',
            sourceNodeId: 'foundations',
            targetNodeId: 'react',
            relation: 'RECOMMENDED',
          },
        ]}
        selectedNodeId="foundations"
        activePathNodeIds={['foundations', 'react']}
        onSelectNode={onSelectNode}
      />
    );

    expect(screen.getByTestId('knowledge-map-mobile-list')).toBeInTheDocument();
    expect(screen.getByTestId('knowledge-map-graph')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Arquitetura de Estado React/ })).toHaveLength(2);

    fireEvent.click(screen.getAllByRole('button', { name: /Arquitetura de Estado React/ })[0]);
    expect(onSelectNode).toHaveBeenCalledWith('react');
  });

  it('draws typed connections and highlights the selected node accessibly', () => {
    const { container } = render(
      <TrailMap
        nodes={nodes}
        edges={[
          {
            id: 'edge-1',
            sourceNodeId: 'foundations',
            targetNodeId: 'react',
            relation: 'RECOMMENDED',
          },
        ]}
        selectedNodeId="react"
        activePathNodeIds={['foundations', 'react']}
        onSelectNode={vi.fn()}
      />
    );

    expect(container.querySelector('path[data-relation="RECOMMENDED"]')).toBeInTheDocument();
    for (const selectedButton of screen.getAllByRole('button', {
      name: /Arquitetura de Estado React/,
    })) {
      expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
    }
  });
});
