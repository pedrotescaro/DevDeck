import { describe, expect, it } from 'vitest';
import { buildExerciseHarness } from '@/lib/exercises/evaluator';

describe('exercise evaluator harness', () => {
  it('builds server-side test invocations with an unpredictable result marker', () => {
    const result = buildExerciseHarness(
      'function sum(left, right) { return left + right; }',
      'sum',
      [
        {
          id: 'public-1',
          label: 'Adds positive values',
          input: [2, 3],
          invocation_code: null,
          expected_output: 5,
          is_hidden: false,
          position: 1,
        },
      ],
      '__TEST_MARKER__'
    );

    expect(result.marker).toBe('__TEST_MARKER__');
    expect(result.code).toContain('sum(...[2,3])');
    expect(result.code).toContain('__stacklystDeepEqual');
    expect(result.code).toContain('console.log("__TEST_MARKER__"');
    expect(result.code).not.toContain('new Function');
  });

  it('supports trusted asynchronous invocation code for behavioral tests', () => {
    const result = buildExerciseHarness(
      'async function mapWithConcurrency() {}',
      'mapWithConcurrency',
      [
        {
          id: 'hidden-1',
          label: 'Concurrency cap',
          input: null,
          invocation_code: 'await mapWithConcurrency([1, 2], 1, async value => value)',
          expected_output: [1, 2],
          is_hidden: true,
          position: 1,
        },
      ],
      '__TEST_MARKER__'
    );

    expect(result.code).toContain(
      'await (await mapWithConcurrency([1, 2], 1, async value => value))'
    );
  });
});
