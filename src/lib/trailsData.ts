import { JS_TRAIL } from './trails/js';
import { TS_TRAIL } from './trails/ts';
import { PYTHON_TRAIL } from './trails/python';
import { RUST_TRAIL } from './trails/rust';
import { GO_TRAIL } from './trails/go';
import { JAVA_TRAIL } from './trails/java';

export interface TrailQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TrailLevel {
  levelNumber: number;
  title: string;
  description: string;
  unitNumber: number;
  unitTitle: string;
  sectionName: string;
  questions: TrailQuestion[];
}

export const TRAILS_DATA: Record<string, TrailLevel[]> = {
  JS: JS_TRAIL,
  TS: TS_TRAIL,
  PYTHON: PYTHON_TRAIL,
  RUST: RUST_TRAIL,
  GO: GO_TRAIL,
  JAVA: JAVA_TRAIL,
};

export function findTrailQuestionById(
  id: string
): { language: string; question: TrailQuestion; level: TrailLevel } | null {
  for (const [lang, levels] of Object.entries(TRAILS_DATA)) {
    for (const level of levels) {
      const q = level.questions.find((candidate) => candidate.id === id);
      if (q) {
        return { language: lang, question: q, level };
      }
    }
  }
  return null;
}
