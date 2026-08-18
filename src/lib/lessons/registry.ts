import { TRAILS_DATA, TrailLevel, findTrailQuestionById } from '@/lib/trailsData';
import { CHECKPOINTS_DATA } from '@/lib/checkpointData';
import type { Lesson, LessonStep } from './types';

export const HANDCRAFTED_LESSONS: Record<string, Lesson> = {
  'js-l1': {
    id: 'js-l1',
    title: 'Variáveis e Declarações',
    description: 'Aprenda e pratique let, const, var, escopo de bloco e imutabilidade.',
    language: 'JS',
    unitNumber: 1,
    levelNumber: 1,
    xpReward: 140,
    difficulty: 'iniciante',
    estimatedTime: '6 min',
    steps: [
      {
        id: 'js-l1-s1',
        type: 'concept_explanation',
        title: 'Declarações em JavaScript Moderno',
        conceptText:
          'Em JavaScript (ES6+), existem três palavras-chave para criar variáveis: `const`, `let` e `var`.\n\n- `const`: cria referências imutáveis com escopo de bloco.\n- `let`: cria variáveis que podem ser reatribuídas, com escopo de bloco.\n- `var`: forma legada com escopo de função que vaza de blocos `if` ou `for`.',
        codeSnippet:
          'const pi = 3.14159;\nlet pontuacao = 0;\npontuacao += 10; // Permitido!\n\n// pi = 3.14; // Erro: TypeError!',
        tip: 'Boas práticas: utilize `const` por padrão. Só utilize `let` quando a variável for intencionalmente reatribuída.',
        xp: 15,
      },
      {
        id: 'js-l1-s2',
        type: 'matching',
        title: 'Combine os Conceitos',
        instruction: 'Conecte cada palavra-chave ou conceito à sua respectiva característica:',
        matchingPairs: [
          { id: 'm1', left: 'const', right: 'Valor não pode ser reatribuído' },
          { id: 'm2', left: 'let', right: 'Escopo de bloco reatribuível' },
          { id: 'm3', left: 'var', right: 'Escopo de função (legado)' },
          { id: 'm4', left: 'Escopo de Bloco', right: 'Limitado entre { e }' },
        ],
        explanation: '`const` e `let` respeitam o bloco `{}` onde foram declarados.',
        hints: ['Lembre-se que const vem de constant (constante).', 'let permite nova atribuição.'],
        xp: 20,
      },
      {
        id: 'js-l1-s3',
        type: 'multiple_choice',
        title: 'Comportamento do Escopo',
        question:
          'O que acontece ao tentar acessar uma variável declarada com `let` fora do seu bloco `if`?',
        options: [
          'A variável é acessada normalmente',
          'Lança um ReferenceError (não definida no escopo externo)',
          'Retorna undefined sem lançar erro',
          'A variável vira automaticamente uma constante global',
        ],
        correctOptionIndex: 1,
        explanation:
          'Variáveis declaradas com `let` existem exclusivamente dentro do bloco `{}` em que foram criadas.',
        hints: ['Escopo de bloco impede que a variável vaze para fora das chaves.'],
        xp: 15,
      },
      {
        id: 'js-l1-s4-blocks',
        type: 'drag_drop',
        title: 'Monte o Código',
        instruction: 'Organize os blocos para declarar a constante PI com o valor 3.14:',
        blockTokens: ['const', 'PI', '=', '3.14', ';', 'let', 'var', 'valor'],
        expectedBlockTokens: ['const', 'PI', '=', '3.14', ';'],
        explanation:
          'Excelente! A constante PI foi declarada perfeitamente na sintaxe do JavaScript.',
        hints: ['Comece com const, depois o identificador, o operador de atribuição e o valor.'],
        xp: 20,
      },
      {
        id: 'js-l1-s5',
        type: 'code_completion',
        title: 'Complete a Declaração',
        instruction:
          'Preencha a lacuna para criar uma constante chamada `TAXA` com o valor `0.15`:',
        completionPrefix: '',
        completionSuffix: ' TAXA = 0.15;',
        blanks: [
          {
            id: 'b1',
            placeholder: 'palavra-chave',
            expected: ['const'],
          },
        ],
        explanation: 'Constantes são declaradas com a palavra-chave `const`.',
        hints: ['Utilize a palavra que define valores imutáveis.'],
        xp: 15,
      },
      {
        id: 'js-l1-s6',
        type: 'output_prediction',
        title: 'Prever a Saída',
        instruction: 'Analise o trecho de código abaixo e determine o que será impresso:',
        codeSnippet: 'let x = 10;\n{\n  let x = 20;\n}\nconsole.log(x);',
        options: ['10', '20', 'undefined', 'ReferenceError'],
        correctOptionIndex: 0,
        explanation:
          'A variável `x` interna tem escopo local ao bloco `{}`. O `console.log(x)` fora do bloco acessa a variável externa `10`.',
        hints: ['O bloco interno criou um novo x com shadowing que não altera o x de fora.'],
        xp: 20,
      },
      {
        id: 'js-l1-s7',
        type: 'code_editor',
        title: 'Desafio de Programação',
        instruction:
          'Crie uma função chamada `calcularDesconto(preco, percentual)` que retorna o valor do desconto calculado (`preco * (percentual / 100)`).',
        codeTemplate:
          'function calcularDesconto(preco, percentual) {\n  // Escreva seu código aqui\n  \n}',
        solutionCode:
          'function calcularDesconto(preco, percentual) {\n  return preco * (percentual / 100);\n}',
        checkCode:
          'console.log(calcularDesconto(100, 10));\nconsole.log(calcularDesconto(200, 25));',
        expectedOutput: '10\n50',
        testCases: [
          {
            id: 't1',
            description: 'calcularDesconto(100, 10)',
            testCode: 'calcularDesconto(100, 10)',
            expectedOutput: '10',
          },
          {
            id: 't2',
            description: 'calcularDesconto(200, 25)',
            testCode: 'calcularDesconto(200, 25)',
            expectedOutput: '50',
          },
        ],
        hints: [
          'A fórmula é: preco * (percentual / 100)',
          'Utilize return para devolver o resultado.',
        ],
        xp: 25,
      },
    ],
  },

  'js-l2': {
    id: 'js-l2',
    title: 'Tipos Primitivos & typeof',
    description: 'Domine os tipos fundamentais, peculiaridades históricas e checagem de tipos.',
    language: 'JS',
    unitNumber: 1,
    levelNumber: 2,
    xpReward: 130,
    difficulty: 'iniciante',
    estimatedTime: '6 min',
    steps: [
      {
        id: 'js-l2-s1',
        type: 'concept_explanation',
        title: 'Os 7 Tipos Primitivos do JS',
        conceptText:
          'JavaScript possui 7 tipos primitivos imutáveis:\n\n1. `string` - Textos ("Stacklyst")\n2. `number` - Inteiros e decimais (42, 3.14)\n3. `bigint` - Inteiros de precisão arbitrária (9007199254740991n)\n4. `boolean` - `true` ou `false`\n5. `undefined` - Variável declarada sem valor\n6. `symbol` - Identificadores únicos e imutáveis\n7. `null` - Ausência intencional de valor',
        codeSnippet:
          'console.log(typeof "olá"); // "string"\nconsole.log(typeof 100);   // "number"\nconsole.log(typeof null);  // "object" (peculiaridade histórica!)',
        tip: 'Atenção: `typeof null === "object"` é um bug de legado mantido por compatibilidade com a web antiga.',
        xp: 15,
      },
      {
        id: 'js-l2-s2',
        type: 'matching',
        title: 'Combine os Tipos Primitivos',
        instruction: 'Conecte cada tipo de dado com seu exemplo característico:',
        matchingPairs: [
          { id: 'm1', left: 'string', right: '"DevDeck"' },
          { id: 'm2', left: 'number', right: '3.1415' },
          { id: 'm3', left: 'boolean', right: 'true' },
          { id: 'm4', left: 'bigint', right: '1000n' },
        ],
        explanation: 'Cada tipo primitivo possui sintaxe e literais próprios.',
        xp: 20,
      },
      {
        id: 'js-l2-s3-blocks',
        type: 'drag_drop',
        title: 'Monte a Expressão',
        instruction: 'Organize os blocos para checar se o tipo de null retorna "object":',
        blockTokens: ['typeof', 'null', '===', '"object"', '==', '"null"', 'undefined'],
        expectedBlockTokens: ['typeof', 'null', '===', '"object"'],
        explanation: 'Perfeito! Em JavaScript, typeof null retorna "object".',
        xp: 20,
      },
      {
        id: 'js-l2-s4',
        type: 'debug',
        title: 'Encontre e Corrija o Bug',
        instruction:
          'A função abaixo deveria verificar se um valor é estritamente nulo, mas está usando `typeof`, que retorna "object". Corrija para verificar diretamente se `val === null`.',
        codeTemplate: 'function isNull(val) {\n  return typeof val === "null";\n}',
        solutionCode: 'function isNull(val) {\n  return val === null;\n}',
        checkCode:
          'console.log(isNull(null));\nconsole.log(isNull({}));\nconsole.log(isNull(undefined));',
        expectedOutput: 'true\nfalse\nfalse',
        hints: [
          'Lembre-se que typeof null retorna "object".',
          'Use comparação direta com === null.',
        ],
        xp: 25,
      },
      {
        id: 'js-l2-s5',
        type: 'code_editor',
        title: 'Desafio: Identificador de Tipos',
        instruction:
          'Crie uma função `identificarTipo(valor)` que retorna "nulo" se o valor for `null`, ou o retorno do operador `typeof` caso contrário.',
        codeTemplate: 'function identificarTipo(valor) {\n  // Escreva sua lógica aqui\n  \n}',
        solutionCode:
          'function identificarTipo(valor) {\n  if (valor === null) return "nulo";\n  return typeof valor;\n}',
        checkCode:
          'console.log(identificarTipo(null));\nconsole.log(identificarTipo(42));\nconsole.log(identificarTipo("teste"));',
        expectedOutput: 'nulo\nnumber\nstring',
        testCases: [
          {
            id: 't1',
            description: 'identificarTipo(null)',
            testCode: 'identificarTipo(null)',
            expectedOutput: 'nulo',
          },
          {
            id: 't2',
            description: 'identificarTipo(42)',
            testCode: 'identificarTipo(42)',
            expectedOutput: 'number',
          },
        ],
        xp: 25,
      },
    ],
  },

  'ts-l1': {
    id: 'ts-l1',
    title: 'Fundamentos de Tipagem Estática',
    description: 'Aprenda anotações de tipo, inferência e tipos primitivos no TypeScript.',
    language: 'TS',
    unitNumber: 1,
    levelNumber: 1,
    xpReward: 130,
    difficulty: 'iniciante',
    estimatedTime: '7 min',
    steps: [
      {
        id: 'ts-l1-s1',
        type: 'concept_explanation',
        title: 'Por que usar TypeScript?',
        conceptText:
          'O TypeScript adiciona tipagem estática ao JavaScript. Isso permite detectar erros durante o desenvolvimento, antes mesmo do código rodar em produção.\n\nTipos básicos:\n- `string`: `const nome: string = "Ada";`\n- `number`: `const idade: number = 28;`\n- `boolean`: `const ativo: boolean = true;`\n- `unknown`: tipo seguro para valores desconhecidos.',
        codeSnippet:
          'function saudar(nome: string): string {\n  return `Olá, ${nome}!`;\n}\n\nconsole.log(saudar("Dev"));',
        tip: 'O compilador TypeScript remove todos os tipos durante a transpilação, gerando JavaScript puro.',
        xp: 15,
      },
      {
        id: 'ts-l1-s2',
        type: 'matching',
        title: 'Combine os Tipos TypeScript',
        instruction: 'Conecte cada tipo especial à sua finalidade:',
        matchingPairs: [
          { id: 'm1', left: 'unknown', right: 'Tipo seguro que exige validação antes do uso' },
          { id: 'm2', left: 'never', right: 'Representa valores que nunca ocorrem' },
          { id: 'm3', left: 'any', right: 'Desativa a checagem estática de tipos' },
          { id: 'm4', left: 'void', right: 'Função que não retorna nenhum valor' },
        ],
        explanation:
          '`unknown` é muito mais seguro que `any`, pois força você a fazer type narrowing.',
        xp: 20,
      },
      {
        id: 'ts-l1-s3-blocks',
        type: 'drag_drop',
        title: 'Monte o Código',
        instruction: 'Organize os blocos para declarar uma variável com o tipo seguro unknown:',
        blockTokens: ['let', 'dado:', 'unknown', '=', '"Stacklyst";', 'any', 'number', 'var'],
        expectedBlockTokens: ['let', 'dado:', 'unknown', '=', '"Stacklyst";'],
        explanation: 'Muito bem! unknown é o tipo com checagem estrita no TypeScript.',
        xp: 20,
      },
      {
        id: 'ts-l1-s4',
        type: 'code_completion',
        title: 'Complete a Assinatura',
        instruction: 'Defina o tipo do parâmetro `x` como `number` e o retorno como `number`:',
        completionPrefix: 'function dobro(x: ',
        completionSuffix: '): number {\n  return x * 2;\n}',
        blanks: [{ id: 'b1', placeholder: 'tipo', expected: ['number'] }],
        explanation: 'Anotamos os parâmetros de funções com `: tipo`.',
        xp: 15,
      },
      {
        id: 'ts-l1-s5',
        type: 'code_editor',
        title: 'Desafio TypeScript',
        instruction:
          'Crie uma função `formatarPreco(valor: number, moeda: string): string` que retorna `${moeda} ${valor.toFixed(2)}`.',
        codeTemplate:
          'function formatarPreco(valor: number, moeda: string): string {\n  // Implemente aqui\n  \n}',
        solutionCode:
          'function formatarPreco(valor: number, moeda: string): string {\n  return `${moeda} ${valor.toFixed(2)}`;\n}',
        checkCode: 'console.log(formatarPreco(19.9, "R$"));\nconsole.log(formatarPreco(100, "$"));',
        expectedOutput: 'R$ 19.90\n$ 100.00',
        testCases: [
          {
            id: 't1',
            description: 'formatarPreco(19.9, "R$")',
            testCode: 'formatarPreco(19.9, "R$")',
            expectedOutput: 'R$ 19.90',
          },
        ],
        xp: 25,
      },
    ],
  },
};

/**
 * Constrói dinamicamente uma lição gamificada rica caso ainda não exista uma versão manual.
 */
export function buildDynamicLesson(level: TrailLevel, language: string): Lesson {
  const langUpper = language.toUpperCase();
  const steps: LessonStep[] = [];

  // Etapa 1: Explicação Conceitual
  steps.push({
    id: `${level.levelNumber}-step-concept`,
    type: 'concept_explanation',
    title: `Conceito: ${level.title}`,
    conceptText: `Nesta lição de ${langUpper}, exploramos **${level.title}**.\n\n${level.description}\n\nCompreender esses fundamentos garante código limpo, performático e livre de bugs comuns no ecossistema ${langUpper}.`,
    codeSnippet: `// Exemplo prático de ${level.title}\n// Dominar este conceito é essencial na trilha de ${langUpper}.\nconsole.log("Aprendendo ${level.title} no Stacklyst");`,
    tip: `Preste atenção aos detalhes de sintaxe e boas práticas de ${langUpper} ao responder às próximas etapas.`,
    xp: 15,
  });

  // Etapas de Perguntas do Level
  level.questions.forEach((q, idx) => {
    if (idx === 0) {
      steps.push({
        id: q.id,
        type: 'multiple_choice',
        title: `Etapa ${idx + 1}: ${level.title}`,
        question: q.question,
        options: q.options,
        correctOptionIndex: q.correctIndex,
        explanation: `A alternativa correta é "${q.options[q.correctIndex]}".`,
        hints: ['Analise com atenção a precedência e o propósito de cada opção.'],
        xp: 15,
      });
    } else if (idx === 1 && q.options.length >= 2) {
      steps.push({
        id: q.id,
        type: 'multiple_choice',
        title: `Etapa ${idx + 1}: Prática`,
        question: q.question,
        options: q.options,
        correctOptionIndex: q.correctIndex,
        explanation: `Correto: ${q.options[q.correctIndex]}.`,
        hints: ['Lembre-se das regras fundamentais da linguagem.'],
        xp: 20,
      });
    }
  });

  // ETAPA OBRIGATÓRIA: Montar Código com Blocos (Duolingo Style)
  let blockTokens: string[] = [];
  let expectedBlockTokens: string[] = [];
  let blockInstruction = `Organize os blocos para formar a instrução correta em ${langUpper}:`;

  if (langUpper === 'PYTHON') {
    blockTokens = ['def', 'calcular(x):', 'return', 'x * 2', 'function', 'const', 'val'];
    expectedBlockTokens = ['def', 'calcular(x):', 'return', 'x * 2'];
    blockInstruction = 'Organize os blocos para definir a função em Python:';
  } else if (langUpper === 'GO') {
    blockTokens = ['func', 'somar(a, b int)', 'int', '{', 'return a + b', '}', 'def', 'const'];
    expectedBlockTokens = ['func', 'somar(a, b int)', 'int', '{', 'return a + b', '}'];
    blockInstruction = 'Organize os blocos para declarar a função em Go:';
  } else if (langUpper === 'RUST') {
    blockTokens = ['fn', 'principal()', '->', 'i32', '{', '42', '}', 'def', 'var'];
    expectedBlockTokens = ['fn', 'principal()', '->', 'i32', '{', '42', '}'];
    blockInstruction = 'Organize os blocos para montar a função em Rust:';
  } else if (langUpper === 'JAVA') {
    blockTokens = ['int', 'pontuacao', '=', '100', ';', 'var', 'const', 'def'];
    expectedBlockTokens = ['int', 'pontuacao', '=', '100', ';'];
    blockInstruction = 'Organize os blocos para declarar a variável em Java:';
  } else {
    blockTokens = ['const', 'total', '=', 'somar(a, b)', ';', 'let', 'var', 'def'];
    expectedBlockTokens = ['const', 'total', '=', 'somar(a, b)', ';'];
    blockInstruction = `Organize os blocos para montar a declaração em ${langUpper}:`;
  }

  steps.push({
    id: `${level.levelNumber}-block-builder`,
    type: 'drag_drop',
    title: 'Monte o Código',
    instruction: blockInstruction,
    blockTokens,
    expectedBlockTokens,
    explanation: 'Excelente! Você montou a estrutura de código com perfeição.',
    xp: 20,
  });

  // Se houver mais perguntas no level, adiciona
  if (level.questions.length >= 3) {
    const q3 = level.questions[2];
    steps.push({
      id: q3.id,
      type: 'multiple_choice',
      title: 'Etapa de Fixação',
      question: q3.question,
      options: q3.options,
      correctOptionIndex: q3.correctIndex,
      explanation: `Excelente raciocínio! Resposta: ${q3.options[q3.correctIndex]}.`,
      hints: ['Pense no comportamento esperado em tempo de execução.'],
      xp: 20,
    });
  }

  // Desafio final de código da lição
  const sampleSolution = `console.log("Sucesso");`;
  steps.push({
    id: `${level.levelNumber}-final-challenge`,
    type: 'code_editor',
    title: 'Desafio Final da Lição',
    instruction: `Escreva um código em ${langUpper} que imprima "Sucesso" no console para concluir a lição de ${level.title}.`,
    codeTemplate:
      langUpper === 'PYTHON'
        ? 'print("Sucesso")'
        : langUpper === 'GO'
          ? 'package main\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Sucesso")\n}'
          : langUpper === 'RUST'
            ? 'fn main() {\n  println!("Sucesso");\n}'
            : langUpper === 'JAVA'
              ? 'class Main {\n  public static void main(String[] args) {\n    System.out.println("Sucesso");\n  }\n}'
              : 'console.log("Sucesso");',
    solutionCode: sampleSolution,
    expectedOutput: 'Sucesso',
    testCases: [
      {
        id: 't1',
        description: 'Imprimir "Sucesso"',
        testCode: 'main()',
        expectedOutput: 'Sucesso',
      },
    ],
    hints: ['Verifique se a string está exatamente como "Sucesso".'],
    xp: 25,
  });

  return {
    id: `${language.toLowerCase()}-l${level.levelNumber}`,
    title: level.title,
    description: level.description,
    language: langUpper,
    unitNumber: level.unitNumber,
    levelNumber: level.levelNumber,
    xpReward: steps.reduce((sum, s) => sum + s.xp, 0),
    difficulty:
      level.levelNumber > 10 ? 'avancado' : level.levelNumber > 5 ? 'intermediario' : 'iniciante',
    estimatedTime: `${Math.max(5, steps.length * 1.5)} min`,
    steps,
  };
}

/**
 * Busca uma lição pelo ID (ex: "js-l1", "ts-l2", "python-l3")
 */
export function getLessonById(lessonId: string): Lesson | null {
  if (HANDCRAFTED_LESSONS[lessonId]) {
    return HANDCRAFTED_LESSONS[lessonId];
  }

  // Tenta extrair language e levelNumber do ID (ex: "js-l1" -> lang: "JS", level: 1)
  const match = /^([a-zA-Z]+)-l(\d+)$/i.exec(lessonId);
  if (match) {
    const langKey = match[1].toUpperCase();
    const levelNum = parseInt(match[2], 10);

    const trailLevels = TRAILS_DATA[langKey];
    if (trailLevels) {
      const level = trailLevels.find((l) => l.levelNumber === levelNum);
      if (level) {
        return buildDynamicLesson(level, langKey);
      }
    }
  }

  // Tenta checar se é um question ID legado
  const questionContext = findTrailQuestionById(lessonId);
  if (questionContext) {
    return buildDynamicLesson(questionContext.level, questionContext.language);
  }

  return null;
}
