import { runCodeInSandbox } from '@/lib/code-runner';
import type { BlankSlot, MatchingPair, OrderItem } from './types';

export interface EvaluationOutcome {
  isCorrect: boolean;
  message?: string;
  details?: string;
  output?: string;
}

export function evaluateMultipleChoice(
  selectedOption: number | null,
  correctOptionIndex: number
): EvaluationOutcome {
  if (selectedOption === null) {
    return { isCorrect: false, message: 'Selecione uma opção antes de verificar.' };
  }

  const isCorrect = selectedOption === correctOptionIndex;
  return {
    isCorrect,
    message: isCorrect
      ? 'Excelente! Resposta correta.'
      : 'Não foi dessa vez. Analise a lógica e tente novamente.',
  };
}

export function evaluateCodeCompletion(
  userValues: Record<string, string>,
  blanks: BlankSlot[]
): EvaluationOutcome {
  if (!blanks || blanks.length === 0) {
    return { isCorrect: true, message: 'Código completo validado.' };
  }

  for (const blank of blanks) {
    const val = (userValues[blank.id] || '').trim();
    if (!val) {
      return { isCorrect: false, message: 'Preencha todas as lacunas do código.' };
    }

    const matches = blank.expected.some((exp) => exp.trim().toLowerCase() === val.toLowerCase());

    if (!matches) {
      return {
        isCorrect: false,
        message: 'Uma ou mais lacunas não correspondem à sintaxe correta esperada.',
        details: `Dica para "${blank.placeholder}": revise os operadores ou identificadores da linguagem.`,
      };
    }
  }

  return { isCorrect: true, message: 'Perfeito! Sintaxe preenchida com precisão.' };
}

export function evaluateOrdering(currentOrder: OrderItem[]): EvaluationOutcome {
  if (!currentOrder || currentOrder.length === 0) {
    return { isCorrect: true };
  }

  const isCorrect = currentOrder.every((item, idx) => item.correctIndex === idx);
  return {
    isCorrect,
    message: isCorrect
      ? 'Sequência correta! O fluxo de execução está perfeito.'
      : 'A ordem das instruções ainda não está correta. Lembre-se da precedência e fluxo de controle.',
  };
}

export function evaluateMatching(
  matchedPairs: Record<string, string>,
  totalPairs: MatchingPair[]
): EvaluationOutcome {
  const total = totalPairs.length;
  const matchedCount = Object.keys(matchedPairs).length;

  if (matchedCount < total) {
    return { isCorrect: false, message: 'Conecte todos os pares para continuar.' };
  }

  const allValid = totalPairs.every((pair) => matchedPairs[pair.left] === pair.right);
  return {
    isCorrect: allValid,
    message: allValid
      ? 'Todos os conceitos foram combinados com perfeição!'
      : 'Alguns pares combinados estão incorretos.',
  };
}

export function evaluateTerminal(userCommand: string, expectedCommand?: string): EvaluationOutcome {
  const cleanedUser = userCommand.trim().toLowerCase().replace(/\s+/g, ' ');
  const cleanedExp = (expectedCommand || '').trim().toLowerCase().replace(/\s+/g, ' ');

  if (!cleanedUser) {
    return { isCorrect: false, message: 'Digite um comando no terminal.' };
  }

  const isCorrect = cleanedUser === cleanedExp;
  return {
    isCorrect,
    message: isCorrect
      ? 'Comando executado com sucesso!'
      : `Comando não reconhecido ou parâmetros incorretos. Esperado: \`${expectedCommand}\``,
  };
}

export async function evaluateCodeEditor(
  code: string,
  language: string,
  checkCode?: string,
  expectedOutput?: string
): Promise<EvaluationOutcome> {
  const fullCode = checkCode ? `${code}\n\n${checkCode}` : code;

  try {
    const result = await runCodeInSandbox(fullCode, language);

    if (!result.ok) {
      return {
        isCorrect: false,
        message: 'Erro durante a execução do código.',
        details: result.error || 'Verifique a sintaxe e trate possíveis exceções.',
        output: result.output,
      };
    }

    if (expectedOutput) {
      const normalize = (str: string) =>
        str
          .replace(/\r/g, '')
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .join('\n');

      const normOutput = normalize(result.output || '');
      const normExpected = normalize(expectedOutput);

      if (normOutput.endsWith(normExpected) || normOutput === normExpected) {
        return {
          isCorrect: true,
          message: 'Fantástico! Todos os testes passaram com sucesso.',
          output: result.output,
        };
      }

      return {
        isCorrect: false,
        message: 'O código executou, mas a saída não corresponde ao esperado.',
        details: `Esperado:\n${expectedOutput}\n\nRecebido:\n${result.output || '(vazio)'}`,
        output: result.output,
      };
    }

    return {
      isCorrect: true,
      message: 'Código executado com sucesso!',
      output: result.output,
    };
  } catch (err: any) {
    return {
      isCorrect: false,
      message: 'Falha ao executar o código.',
      details: err.message || 'Erro de execução.',
    };
  }
}

export function evaluateBlockBuilder(
  selectedTokens: string[],
  expectedTokens: string[]
): EvaluationOutcome {
  if (!expectedTokens || expectedTokens.length === 0) {
    return { isCorrect: true };
  }

  if (selectedTokens.length === 0) {
    return { isCorrect: false, message: 'Selecione os blocos para montar a linha de código.' };
  }

  if (selectedTokens.length !== expectedTokens.length) {
    return {
      isCorrect: false,
      message: 'A quantidade de blocos selecionados está incompleta ou incorreta.',
      details: 'Organize todos os blocos necessários na ordem exata de sintaxe.',
    };
  }

  const isMatch = selectedTokens.every((tok, idx) => tok.trim() === expectedTokens[idx].trim());

  return {
    isCorrect: isMatch,
    message: isMatch
      ? 'Blocos organizados com perfeição!'
      : 'A sequência dos blocos não está na ordem correta da sintaxe.',
  };
}
