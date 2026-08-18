import { describe, it, expect } from 'vitest';
import {
  evaluateMultipleChoice,
  evaluateCodeCompletion,
  evaluateOrdering,
  evaluateMatching,
  evaluateTerminal,
  evaluateBlockBuilder,
} from '../evaluators';
import { getLessonById } from '../registry';

describe('Lesson Evaluators', () => {
  it('evaluates multiple choice selections correctly', () => {
    expect(evaluateMultipleChoice(1, 1).isCorrect).toBe(true);
    expect(evaluateMultipleChoice(0, 1).isCorrect).toBe(false);
    expect(evaluateMultipleChoice(null, 1).isCorrect).toBe(false);
  });

  it('evaluates code completions with blanks', () => {
    const blanks = [
      { id: 'b1', placeholder: 'tipo', expected: ['number', 'Number'] },
      { id: 'b2', placeholder: 'retorno', expected: ['string'] },
    ];

    expect(evaluateCodeCompletion({ b1: 'number', b2: 'string' }, blanks).isCorrect).toBe(true);

    expect(evaluateCodeCompletion({ b1: 'boolean', b2: 'string' }, blanks).isCorrect).toBe(false);

    expect(evaluateCodeCompletion({ b1: '', b2: 'string' }, blanks).isCorrect).toBe(false);
  });

  it('evaluates ordering items', () => {
    const items = [
      { id: '1', text: 'linha 1', correctIndex: 0 },
      { id: '2', text: 'linha 2', correctIndex: 1 },
      { id: '3', text: 'linha 3', correctIndex: 2 },
    ];

    expect(evaluateOrdering(items).isCorrect).toBe(true);

    const reversed = [items[2], items[1], items[0]];
    expect(evaluateOrdering(reversed).isCorrect).toBe(false);
  });

  it('evaluates block builder (drag_drop) tokens', () => {
    const expected = ['const', 'PI', '=', '3.14', ';'];

    expect(evaluateBlockBuilder(['const', 'PI', '=', '3.14', ';'], expected).isCorrect).toBe(true);

    expect(evaluateBlockBuilder(['const', '3.14', '=', 'PI', ';'], expected).isCorrect).toBe(false);

    expect(evaluateBlockBuilder(['const', 'PI'], expected).isCorrect).toBe(false);
  });

  it('evaluates matching pairs', () => {
    const pairs = [
      { id: '1', left: 'const', right: 'imutável' },
      { id: '2', left: 'let', right: 'mutável' },
    ];

    expect(evaluateMatching({ const: 'imutável', let: 'mutável' }, pairs).isCorrect).toBe(true);

    expect(evaluateMatching({ const: 'mutável', let: 'imutável' }, pairs).isCorrect).toBe(false);

    expect(evaluateMatching({ const: 'imutável' }, pairs).isCorrect).toBe(false);
  });

  it('evaluates terminal commands', () => {
    expect(evaluateTerminal('git init', 'git init').isCorrect).toBe(true);
    expect(evaluateTerminal('  git   init  ', 'git init').isCorrect).toBe(true);
    expect(evaluateTerminal('git status', 'git init').isCorrect).toBe(false);
    expect(evaluateTerminal('', 'git init').isCorrect).toBe(false);
  });

  it('ensures every lesson includes at least 1 code block builder step', () => {
    const jsL1 = getLessonById('js-l1');
    expect(jsL1).toBeDefined();
    expect(jsL1?.steps.some((s) => s.type === 'drag_drop')).toBe(true);

    const pythonDynamic = getLessonById('python-l1');
    expect(pythonDynamic).toBeDefined();
    expect(pythonDynamic?.steps.some((s) => s.type === 'drag_drop')).toBe(true);

    const goDynamic = getLessonById('go-l2');
    expect(goDynamic).toBeDefined();
    expect(goDynamic?.steps.some((s) => s.type === 'drag_drop')).toBe(true);
  });
});
