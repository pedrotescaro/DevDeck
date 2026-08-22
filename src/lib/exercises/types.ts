import type { KnowledgeProgressStatus } from '@/lib/learning/types';

export type AssistanceMode = 'GUIDED' | 'STANDARD' | 'HARD' | 'NO_ASSIST';

export interface ExerciseWorkspaceData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  objective: string;
  language: string;
  difficulty: number;
  baseXp: number;
  estimatedMinutes: number | null;
  starterCode: string;
  constraints: string[];
  hints: string[];
  documentationUrl: string | null;
  examples: unknown[];
  publicTestCount: number;
  hiddenTestCount: number;
  knowledge: {
    id: string;
    slug: string;
    title: string;
    category: string;
    mastery: number;
    status: KnowledgeProgressStatus;
  };
  activity: {
    runs: number;
    submissions: number;
    completed: boolean;
  };
}

export interface ExerciseApiTestResult {
  id: string;
  label: string;
  hidden: boolean;
  passed: boolean;
  actual?: unknown;
  expected?: unknown;
  error?: string;
}
