import type { AssistanceMode, KnowledgeProgressStatus } from '@prisma/client';

const XP_MULTIPLIER: Record<AssistanceMode, number> = {
  GUIDED: 1,
  STANDARD: 1.25,
  HARD: 1.5,
  NO_ASSIST: 1.5,
};

const MASTERY_BONUS: Record<AssistanceMode, number> = {
  GUIDED: 0,
  STANDARD: 5,
  HARD: 15,
  NO_ASSIST: 15,
};

export function calculateExerciseXp(baseXp: number, mode: AssistanceMode) {
  return Math.round(Math.max(0, baseXp) * XP_MULTIPLIER[mode]);
}

export function calculateNodeMastery(input: {
  completedExercises: number;
  totalExercises: number;
  assistanceMode: AssistanceMode;
}) {
  if (input.totalExercises <= 0) return 0;
  const completionScore = Math.round(
    (Math.min(input.completedExercises, input.totalExercises) / input.totalExercises) * 85
  );
  return Math.min(100, completionScore + MASTERY_BONUS[input.assistanceMode]);
}

export function deriveCompletedNodeStatus(input: {
  completedExercises: number;
  totalExercises: number;
  mastery: number;
}): KnowledgeProgressStatus {
  if (input.completedExercises < input.totalExercises) return 'IN_PROGRESS';
  return input.mastery >= 90 ? 'MASTERED' : 'COMPLETED';
}
