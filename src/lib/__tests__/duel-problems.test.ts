import { describe, it, expect } from 'vitest';
import {
  DUEL_PROBLEMS,
  getDuelProblemById,
  getRandomDuelProblem,
  buildTestHarness,
} from '../duel-problems';

describe('duel-problems', () => {
  it('has valid problem presets with test cases', () => {
    expect(DUEL_PROBLEMS.length).toBeGreaterThan(0);

    DUEL_PROBLEMS.forEach((problem) => {
      expect(problem.id).toBeTruthy();
      expect(problem.title).toBeTruthy();
      expect(problem.description).toBeTruthy();
      expect(problem.testCases.length).toBeGreaterThan(0);
      expect(problem.starters.TS).toBeTruthy();
      expect(problem.starters.PYTHON).toBeTruthy();
    });
  });

  it('retrieves problem by id or returns default', () => {
    const reverse = getDuelProblemById('reverse-string');
    expect(reverse.id).toBe('reverse-string');

    const nonExistent = getDuelProblemById('unknown-problem-123');
    expect(nonExistent).toBeDefined();
    expect(nonExistent.id).toBe(DUEL_PROBLEMS[0].id);
  });

  it('returns a random duel problem', () => {
    const p = getRandomDuelProblem();
    expect(p).toBeDefined();
    expect(DUEL_PROBLEMS).toContain(p);
  });

  it('builds TypeScript test harness containing result tokens', () => {
    const problem = getDuelProblemById('reverse-string');
    const userCode =
      'function reverseString(str: string): string { return str.split("").reverse().join(""); }';
    const harness = buildTestHarness(userCode, problem, 'TS');

    expect(harness).toContain('###TEST_RESULTS_START###');
    expect(harness).toContain('###TEST_RESULTS_END###');
    expect(harness).toContain('reverseString');
  });

  it('builds Python test harness containing json dump tokens', () => {
    const problem = getDuelProblemById('reverse-string');
    const userCode = 'def reverse_string(s):\n    return s[::-1]';
    const harness = buildTestHarness(userCode, problem, 'PYTHON');

    expect(harness).toContain('import json');
    expect(harness).toContain('###TEST_RESULTS_START###');
    expect(harness).toContain('###TEST_RESULTS_END###');
    expect(harness).toContain('reverse_string');
  });
});
