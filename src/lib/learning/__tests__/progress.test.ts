import { describe, expect, it } from 'vitest';
import {
  calculatePathProgress,
  deriveKnowledgeStatus,
  isKnowledgeCompleted,
} from '@/lib/learning/progress';

describe('knowledge progress', () => {
  it('keeps persisted completion states authoritative', () => {
    expect(
      deriveKnowledgeStatus({
        persistedStatus: 'MASTERED',
        requiredPrerequisiteStatuses: ['NOT_STARTED'],
        isNextRecommended: false,
      })
    ).toBe('MASTERED');
    expect(isKnowledgeCompleted('COMPLETED')).toBe(true);
    expect(isKnowledgeCompleted('IN_PROGRESS')).toBe(false);
  });

  it('uses REQUIRED relations as gates and recommendations as guidance', () => {
    expect(
      deriveKnowledgeStatus({
        requiredPrerequisiteStatuses: ['IN_PROGRESS'],
        isNextRecommended: true,
      })
    ).toBe('NOT_STARTED');

    expect(
      deriveKnowledgeStatus({
        requiredPrerequisiteStatuses: ['COMPLETED'],
        isNextRecommended: true,
      })
    ).toBe('RECOMMENDED');

    expect(
      deriveKnowledgeStatus({
        requiredPrerequisiteStatuses: [],
        isNextRecommended: false,
      })
    ).toBe('AVAILABLE');
  });

  it('calculates shared path progress from node statuses', () => {
    const result = calculatePathProgress(
      {
        id: 'path-1',
        slug: 'frontend',
        title: 'Frontend',
        description: 'Recommended path',
        accentColor: '#3b82f6',
        estimatedMinutes: 120,
        featured: true,
        nodeIds: ['shared-js', 'react', 'project'],
      },
      new Map([
        ['shared-js', 'MASTERED'],
        ['react', 'COMPLETED'],
        ['project', 'IN_PROGRESS'],
      ])
    );

    expect(result.completedNodes).toBe(2);
    expect(result.totalNodes).toBe(3);
    expect(result.progressPercent).toBe(67);
    expect(result.nextRecommendedNodeId).toBe('project');
  });
});
