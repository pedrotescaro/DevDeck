import type { KnowledgeProgressStatus, LearningPathSummary } from '@/lib/learning/types';

const COMPLETED_STATUSES = new Set<KnowledgeProgressStatus>(['COMPLETED', 'MASTERED']);

export function isKnowledgeCompleted(status: KnowledgeProgressStatus) {
  return COMPLETED_STATUSES.has(status);
}

interface StatusInput {
  persistedStatus?: KnowledgeProgressStatus;
  requiredPrerequisiteStatuses: KnowledgeProgressStatus[];
  isNextRecommended: boolean;
}

export function deriveKnowledgeStatus({
  persistedStatus,
  requiredPrerequisiteStatuses,
  isNextRecommended,
}: StatusInput): KnowledgeProgressStatus {
  if (
    persistedStatus === 'MASTERED' ||
    persistedStatus === 'COMPLETED' ||
    persistedStatus === 'IN_PROGRESS'
  ) {
    return persistedStatus;
  }

  const hasMissingRequirement = requiredPrerequisiteStatuses.some(
    (status) => !isKnowledgeCompleted(status)
  );

  if (hasMissingRequirement) return 'NOT_STARTED';
  if (isNextRecommended) return 'RECOMMENDED';
  return 'AVAILABLE';
}

interface PathInput {
  id: string;
  slug: string;
  title: string;
  description: string;
  accentColor: string;
  estimatedMinutes: number | null;
  featured: boolean;
  nodeIds: string[];
}

export function calculatePathProgress(
  path: PathInput,
  statuses: ReadonlyMap<string, KnowledgeProgressStatus>
): LearningPathSummary {
  const completedNodes = path.nodeIds.filter((nodeId) => {
    const status = statuses.get(nodeId) ?? 'NOT_STARTED';
    return isKnowledgeCompleted(status);
  }).length;
  const totalNodes = path.nodeIds.length;
  const nextRecommendedNodeId =
    path.nodeIds.find((nodeId) => !isKnowledgeCompleted(statuses.get(nodeId) ?? 'NOT_STARTED')) ??
    null;

  return {
    ...path,
    completedNodes,
    totalNodes,
    progressPercent: totalNodes === 0 ? 0 : Math.round((completedNodes / totalNodes) * 100),
    nextRecommendedNodeId,
  };
}
