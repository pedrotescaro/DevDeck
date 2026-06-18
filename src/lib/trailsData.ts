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
  JS: [
    {
      levelNumber: 1,
      title: 'Sintaxe Básica',
      description: 'Fundamentos de variáveis, escopo e tipos primitivos em JavaScript.',
      unitNumber: 1,
      unitTitle: 'Introdução à Sintaxe e Variáveis',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'js-l1-q1',
          question:
            'Qual palavra-chave declara uma variável com escopo de bloco que pode ser reatribuída?',
          options: ['var', 'let', 'const', 'def'],
          correctIndex: 1,
        },
        {
          id: 'js-l1-q2',
          question: 'Qual é o resultado de typeof null em JavaScript?',
          options: ["'null'", "'undefined'", "'object'", "'string'"],
          correctIndex: 2,
        },
        {
          id: 'js-l1-q3',
          question: 'Qual método converte uma string em número inteiro?',
          options: ['parseInt()', 'parseFloat()', 'Number.toInteger()', 'Math.floor()'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 2,
      title: 'Estruturas de Controle',
      description: 'Loops, condicionais e tratamento de erros básicas.',
      unitNumber: 1,
      unitTitle: 'Introdução à Sintaxe e Variáveis',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'js-l2-q1',
          question: 'Qual operador realiza comparação de valor e tipo (igualdade estrita)?',
          options: ['==', '===', '=', '!='],
          correctIndex: 1,
        },
        {
          id: 'js-l2-q2',
          question: 'Qual estrutura captura erros gerados em um bloco de código?',
          options: ['try...catch', 'if...else', 'switch...case', 'throw...error'],
          correctIndex: 0,
        },
        {
          id: 'js-l2-q3',
          question: 'Qual loop garante a execução de um bloco de código pelo menos uma vez?',
          options: ['while', 'for', 'do...while', 'for...in'],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 3,
      title: 'Arrays e Objetos',
      description: 'Manipulação de estruturas de dados e métodos básicos.',
      unitNumber: 1,
      unitTitle: 'Introdução à Sintaxe e Variáveis',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'js-l3-q1',
          question:
            'Qual método adiciona um ou mais elementos ao final de um array e retorna o novo comprimento?',
          options: ['pop()', 'push()', 'shift()', 'unshift()'],
          correctIndex: 1,
        },
        {
          id: 'js-l3-q2',
          question: 'Qual operador verifica se uma propriedade existe em um objeto?',
          options: ['in', 'instanceof', 'typeof', 'has'],
          correctIndex: 0,
        },
        {
          id: 'js-l3-q3',
          question:
            'Qual método extrai uma seção de um array e retorna um novo array sem modificar o original?',
          options: ['splice()', 'slice()', 'cut()', 'split()'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 4,
      title: 'Funções e Closures',
      description: 'Arrow functions, callbacks, escopo léxico e closures.',
      unitNumber: 2,
      unitTitle: 'Estruturação de Código e Closures',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'js-l4-q1',
          question: 'O que é uma closure em JavaScript?',
          options: [
            'Uma função que fecha a execução do programa.',
            'Uma função que tem acesso ao escopo de sua função externa, mesmo após a função externa ter retornado.',
            'Um bloco try-catch embutido em objetos.',
            'Uma forma de exportar módulos privados.',
          ],
          correctIndex: 1,
        },
        {
          id: 'js-l4-q2',
          question:
            'Qual é a principal diferença de comportamento das Arrow Functions em relação à palavra-chave this?',
          options: [
            "Elas não possuem seu próprio 'this', herdando-o do escopo léxico.",
            "Elas sempre vinculam o 'this' ao objeto global.",
            'Elas não aceitam argumentos em escopos internos.',
            'Elas não podem retornar promessas.',
          ],
          correctIndex: 0,
        },
        {
          id: 'js-l4-q3',
          question:
            'Qual método de array executa uma função de callback para cada elemento, retornando um novo array com os resultados?',
          options: ['forEach()', 'filter()', 'map()', 'reduce()'],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 5,
      title: 'Assincronismo e Promises',
      description: 'Promises, async/await e concorrência em JS.',
      unitNumber: 2,
      unitTitle: 'Estruturação de Código e Closures',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'js-l5-q1',
          question: 'Qual estado de Promise indica que a operação foi concluída com sucesso?',
          options: ['pending', 'fulfilled', 'rejected', 'resolved'],
          correctIndex: 1,
        },
        {
          id: 'js-l5-q2',
          question: 'Qual bloco trata rejeições de promises dentro de uma função async?',
          options: ['then().catch()', 'try...catch', 'await catch()', 'throw new Error()'],
          correctIndex: 1,
        },
        {
          id: 'js-l5-q3',
          question:
            'Qual método executa múltiplas promises em paralelo e falha imediatamente se qualquer uma for rejeitada?',
          options: ['Promise.all()', 'Promise.race()', 'Promise.allSettled()', 'Promise.any()'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 6,
      title: 'Manipulação de DOM e APIs',
      description: 'Acessando elementos, ouvindo eventos e consumindo APIs.',
      unitNumber: 2,
      unitTitle: 'Estruturação de Código e Closures',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'js-l6-q1',
          question:
            'Qual método seleciona o primeiro elemento que corresponde a um seletor CSS específico?',
          options: [
            'getElementById()',
            'getElementsByClassName()',
            'querySelector()',
            'querySelectorAll()',
          ],
          correctIndex: 2,
        },
        {
          id: 'js-l6-q2',
          question:
            'Qual método adiciona um ouvinte de eventos a um elemento HTML sem sobrescrever os existentes?',
          options: ['onclick = fn', 'addEventListener()', 'attachEvent()', 'listen()'],
          correctIndex: 1,
        },
        {
          id: 'js-l6-q3',
          question:
            'Qual API nativa do JS moderno realiza requisições HTTP assíncronas e retorna uma Promise?',
          options: ['XMLHttpRequest', 'fetch()', 'axios()', 'ajax()'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 7,
      title: 'Event Loop e Protótipos',
      description: 'Protótipos, Event Loop, vazamentos de memória e performance.',
      unitNumber: 3,
      unitTitle: 'Conceitos de Baixo Nível e Performance',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'js-l7-q1',
          question: 'Onde as microtasks (como callbacks de Promises) são executadas no Event Loop?',
          options: [
            'Antes de esvaziar a call stack.',
            'Imediatamente após a call stack esvaziar, antes de processar macrotasks ou renderização.',
            'No final da fila de macrotasks.',
            'Em uma thread secundária paralela.',
          ],
          correctIndex: 1,
        },
        {
          id: 'js-l7-q2',
          question:
            'Qual tipo de referência fraca não previne que o garbage collector colete chaves de objeto?',
          options: ['WeakMap', 'Map', 'Set', 'WeakRef'],
          correctIndex: 0,
        },
        {
          id: 'js-l7-q3',
          question: "Qual é o efeito do modo estrito ('use strict') no escopo global?",
          options: [
            'Impede a criação de variáveis globais acidentais sem declaração.',
            'Torna todas as variáveis constantes por padrão.',
            'Desativa o suporte a Promises assíncronas.',
            'Acelera a renderização do DOM.',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 8,
      title: 'Vazamento de Memória',
      description: 'Como gerenciar referências de memória no JS.',
      unitNumber: 3,
      unitTitle: 'Conceitos de Baixo Nível e Performance',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'js-l8-q1',
          question:
            'Qual das seguintes alternativas é uma causa comum de vazamento de memória (Memory Leak) em SPAs?',
          options: [
            'Uso de loops do...while.',
            'Event listeners registrados no objeto window que não são removidos no desmontar do componente.',
            'Utilização excessiva de const em vez de let.',
            'Chamada frequente de console.log.',
          ],
          correctIndex: 1,
        },
        {
          id: 'js-l8-q2',
          question:
            'Como o algoritmo Mark-and-Sweep do Garbage Collector decide se um objeto deve ser limpo?',
          options: [
            'Contando quantas referências apontam para ele.',
            'Verificando se o objeto é alcançável a partir do objeto raiz (Global/Window).',
            'Limpando objetos que não foram alterados nos últimos 5 segundos.',
            'Deletando objetos com chaves longas.',
          ],
          correctIndex: 1,
        },
        {
          id: 'js-l8-q3',
          question:
            'Qual técnica evita a execução repetida de uma função de alto custo a cada evento de scroll limitando a no máximo 1 execução por intervalo fixo?',
          options: ['Debounce', 'Throttle', 'Memoization', 'Currying'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 9,
      title: 'Módulos e Tooling',
      description: 'ES Modules, dynamic import e empacotadores.',
      unitNumber: 3,
      unitTitle: 'Conceitos de Baixo Nível e Performance',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'js-l9-q1',
          question: 'Qual sintaxe é padrão do ES6 para importação de dependências em módulos?',
          options: ['require()', 'import ... from', 'include()', 'define()'],
          correctIndex: 1,
        },
        {
          id: 'js-l9-q2',
          question: 'O que caracteriza o escopo de variáveis dentro de um ES Module?',
          options: [
            'As variáveis são injetadas diretamente no escopo global window.',
            'As variáveis têm escopo local ao arquivo do módulo e não vazam globalmente.',
            'As variáveis são compartilhadas entre todos os arquivos sem import.',
            'Elas só duram até a primeira chamada assíncrona.',
          ],
          correctIndex: 1,
        },
        {
          id: 'js-l9-q3',
          question: "Como funciona a função de Dynamic Import no JavaScript (import('mod'))?",
          options: [
            'Ela bloqueia a execução síncrona do script até o arquivo carregar.',
            'Ela retorna uma Promise que é resolvida com o objeto do módulo carregado.',
            'Ela permite importar módulos em servidores PHP.',
            'Ela só funciona dentro de loops do-while.',
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
  TS: [
    {
      levelNumber: 1,
      title: 'Tipos Básicos',
      description: 'Tipagem estática, any, unknown e asserções.',
      unitNumber: 1,
      unitTitle: 'Introdução à Tipagem Estática',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'ts-l1-q1',
          question: 'Qual tipo representa a ausência completa de retorno em uma função?',
          options: ['null', 'undefined', 'void', 'never'],
          correctIndex: 2,
        },
        {
          id: 'ts-l1-q2',
          question:
            'Qual tipo é mais seguro para variáveis de tipo desconhecido, forçando verificação antes do uso?',
          options: ['any', 'unknown', 'never', 'object'],
          correctIndex: 1,
        },
        {
          id: 'ts-l1-q3',
          question: 'Como se escreve uma asserção de tipo (Type Assertion) no TypeScript?',
          options: [
            'let x = y as string',
            'let x: string = y',
            'let x = <string>y',
            'Ambas as opções A e C estão corretas',
          ],
          correctIndex: 3,
        },
      ],
    },
    {
      levelNumber: 2,
      title: 'Interfaces e Aliases',
      description: 'Definição de contratos de objetos com interfaces e types.',
      unitNumber: 1,
      unitTitle: 'Introdução à Tipagem Estática',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'ts-l2-q1',
          question: 'Como indicar que uma propriedade de uma interface é opcional?',
          options: [
            "Adicionando um '?' após o nome da propriedade",
            "Adicionando '| null' ao tipo",
            'Usando a palavra-chave optional',
            "Adicionando '| undefined'",
          ],
          correctIndex: 0,
        },
        {
          id: 'ts-l2-q2',
          question: 'Qual é uma diferença fundamental entre Type Aliases e Interfaces?',
          options: [
            'Interfaces não podem ser estendidas com herança.',
            'Interfaces suportam Declaration Merging (mesmo nome junta propriedades), enquanto Type Aliases não.',
            'Type Aliases não aceitam tipos primitivos.',
            'Interfaces só servem para classes e não para objetos literais.',
          ],
          correctIndex: 1,
        },
        {
          id: 'ts-l2-q3',
          question: 'Como declarar uma propriedade somente leitura em uma interface?',
          options: ['const propName', 'readonly propName', 'private propName', 'final propName'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 3,
      title: 'Tipos de União e Interseção',
      description: 'Combinando tipos com Union (|) e Intersection (&).',
      unitNumber: 1,
      unitTitle: 'Introdução à Tipagem Estática',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'ts-l3-q1',
          question:
            'Qual operador é usado para declarar um tipo de União (Union Type) no TypeScript?',
          options: ['&', '|', '&&', '||'],
          correctIndex: 1,
        },
        {
          id: 'ts-l3-q2',
          question: 'O que representa o tipo resultante de uma Interseção (ex: TypeA & TypeB)?',
          options: [
            'Um objeto que deve conter as propriedades de TypeA ou de TypeB.',
            'Um objeto que deve conter todas as propriedades tanto de TypeA quanto de TypeB.',
            'Apenas propriedades comuns entre ambos os tipos.',
            'Um array composto por elementos dos dois tipos.',
          ],
          correctIndex: 1,
        },
        {
          id: 'ts-l3-q3',
          question: "Como declarar uma união de strings literais chamada 'Status'?",
          options: [
            "type Status = 'open' & 'closed'",
            "type Status = 'open' | 'closed'",
            "interface Status { 'open'; 'closed' }",
            "enum Status { 'open', 'closed' }",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 4,
      title: 'Genéricos (Generics)',
      description: 'Escrevendo código reutilizável com parâmetros de tipo.',
      unitNumber: 2,
      unitTitle: 'Genéricos e Tipagem Avançada',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'ts-l4-q1',
          question: 'Como se declara uma função genérica com o parâmetro de tipo T?',
          options: [
            'function identity(arg: T): T',
            'function identity<T>(arg: T): T',
            'function <T>identity(arg: T)',
            'function identity(arg: <T>)',
          ],
          correctIndex: 1,
        },
        {
          id: 'ts-l4-q2',
          question:
            'Como restringir um tipo genérico T para herdar propriedades de outro tipo (ex: Lengthwise)?',
          options: [
            '<T implements Lengthwise>',
            '<T extends Lengthwise>',
            '<T: Lengthwise>',
            '<T typeof Lengthwise>',
          ],
          correctIndex: 1,
        },
        {
          id: 'ts-l4-q3',
          question: 'O que faz a classe utilitária Partial<T> no TypeScript?',
          options: [
            'Exclui metade das chaves do objeto.',
            'Torna todas as propriedades do tipo T opcionais.',
            'Torna todas as propriedades do tipo T obrigatórias.',
            'Gera um subconjunto de tipos dinamicamente.',
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 5,
      title: 'Tipos Utilitários e Mapeados',
      description: 'Pick, Omit, Record, Readonly e tipos mapeados.',
      unitNumber: 2,
      unitTitle: 'Genéricos e Tipagem Avançada',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'ts-l5-q1',
          question:
            'Qual utilitário constrói um tipo pegando apenas um conjunto de propriedades K de T?',
          options: ['Omit<T, K>', 'Pick<T, K>', 'Extract<T, K>', 'Exclude<T, K>'],
          correctIndex: 1,
        },
        {
          id: 'ts-l5-q2',
          question: 'Qual é a saída do tipo Record<string, number>?',
          options: [
            'Um objeto com chaves string e valores number.',
            'Um array contendo strings e numbers.',
            'Uma tupla com exatamente dois elementos.',
            'Um conjunto único ordenado.',
          ],
          correctIndex: 0,
        },
        {
          id: 'ts-l5-q3',
          question: 'Como funciona o utilitário Omit<T, K>?',
          options: [
            'Remove propriedades específicas K do tipo T.',
            'Filtra tipos nulos de T.',
            'Torna apenas K como propriedades opcionais em T.',
            'Substitui propriedades de T por K.',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 6,
      title: 'Classes e Modificadores',
      description: 'Polimorfismo, private, protected e readonly em classes.',
      unitNumber: 2,
      unitTitle: 'Genéricos e Tipagem Avançada',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'ts-l6-q1',
          question:
            'Qual modificador de classe impede o acesso à propriedade fora da classe, exceto nas subclasses derivadas?',
          options: ['private', 'protected', 'public', 'readonly'],
          correctIndex: 1,
        },
        {
          id: 'ts-l6-q2',
          question:
            'Como declarar um parâmetro de construtor de classe que cria e inicializa um membro automaticamente?',
          options: [
            'constructor(name: string) { this.name = name }',
            'constructor(private name: string) {}',
            'constructor(readonly name: string) {}',
            'Ambas as opções B e C estão corretas',
          ],
          correctIndex: 3,
        },
        {
          id: 'ts-l6-q3',
          question:
            'O que acontece ao tentar herdar uma classe que não possui construtor acessível?',
          options: [
            'Compila normalmente herdando o default.',
            'Gera erro se a superclasse tiver propriedades privadas.',
            'Não compila se o construtor da superclasse for private.',
            'Substitui a superclasse em tempo de execução.',
          ],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 7,
      title: 'Tipagem Avançada',
      description: 'Conditional Types, Mapped Types e inferência avançada.',
      unitNumber: 3,
      unitTitle: 'Arquitetura e Inferência Avançada',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'ts-l7-q1',
          question:
            'Qual palavra-chave é usada dentro de uma cláusula extends de um tipo condicional para inferir um tipo dinâmico?',
          options: ['infer', 'typeof', 'keyof', 'in'],
          correctIndex: 0,
        },
        {
          id: 'ts-l7-q2',
          question: 'O que o operador keyof faz?',
          options: [
            'Retorna um array com chaves de objeto em tempo de execução.',
            'Cria uma união de chaves literais do tipo do objeto informado.',
            'Garante a tipagem de chaves dinâmicas em arrays.',
            'Verifica se uma propriedade existe em tempo de execução.',
          ],
          correctIndex: 1,
        },
        {
          id: 'ts-l7-q3',
          question: 'Qual operador retorna o tipo correspondente de um typeof em nível de tipos?',
          options: ['instanceof', 'typeof', 'as', 'is'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 8,
      title: 'Type Guards e Asserções',
      description: 'Predicados de tipo (is), guardas de tipo e asserções customizadas.',
      unitNumber: 3,
      unitTitle: 'Arquitetura e Inferência Avançada',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'ts-l8-q1',
          question:
            'Qual é o retorno correto de uma assinatura de predicado de tipo customizada (User-defined Type Guard)?',
          options: ['parameterName is Type', 'boolean', 'parameterName instanceof Type', 'Type'],
          correctIndex: 0,
        },
        {
          id: 'ts-l8-q2',
          question:
            'Qual operador assegura ao compilador que um valor não é null nem undefined (Non-null Assertion Operator)?',
          options: ['?', '!', '??', 'as any'],
          correctIndex: 1,
        },
        {
          id: 'ts-l8-q3',
          question:
            'Qual palavra-chave realiza estreitamento de tipo em blocos condicionais testando classes em tempo de execução?',
          options: ['typeof', 'instanceof', 'is', 'extends'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 9,
      title: 'Decoradores e Metadata',
      description: 'Decorators experimentais e reflexão de tipos.',
      unitNumber: 3,
      unitTitle: 'Arquitetura e Inferência Avançada',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'ts-l9-q1',
          question: 'Qual parâmetro é passado para um decorador de classe no TypeScript?',
          options: [
            'O protótipo da classe.',
            'A própria função construtora da classe.',
            'Um objeto contendo as propriedades estáticas.',
            'Uma referência da instância criada.',
          ],
          correctIndex: 1,
        },
        {
          id: 'ts-l9-q2',
          question:
            'Para usar decoradores experimentais, qual configuração deve estar ativada no tsconfig.json?',
          options: [
            '"experimentalDecorators": true',
            '"emitDecoratorMetadata": true',
            'Ambas as opções A e B são recomendadas',
            'Nenhuma, decoradores são ativados por padrão',
          ],
          correctIndex: 2,
        },
        {
          id: 'ts-l9-q3',
          question:
            'O que o decorador de método recebe em sua assinatura além do target e propertyKey?',
          options: [
            'Apenas a função callback.',
            'O property descriptor (PropertyDescriptor) do método.',
            'Um array contendo os argumentos do construtor.',
            'A chave de hash única do compilador.',
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
  PYTHON: [
    {
      levelNumber: 1,
      title: 'Sintaxe Básica',
      description: 'Listas, tuplas, dicionários e PEP 8.',
      unitNumber: 1,
      unitTitle: 'Fundamentos de Python e Estruturas',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'py-l1-q1',
          question: 'Qual estrutura de dados do Python é imutável?',
          options: ['list', 'dict', 'tuple', 'set'],
          correctIndex: 2,
        },
        {
          id: 'py-l1-q2',
          question: 'Qual método adiciona um elemento ao final de uma lista?',
          options: ['add()', 'push()', 'append()', 'insert()'],
          correctIndex: 2,
        },
        {
          id: 'py-l1-q3',
          question: 'Qual é a indentação recomendada pela PEP 8 para blocos de código em Python?',
          options: ['1 tabulação', '2 espaços', '4 espaços', 'Variável por escopo'],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 2,
      title: 'List Comprehensions & Iteradores',
      description: 'Map, filter, list comprehensions e geradores.',
      unitNumber: 1,
      unitTitle: 'Fundamentos de Python e Estruturas',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'py-l2-q1',
          question:
            'Como escrever uma list comprehension que filtra números pares de um range(10)?',
          options: [
            '[x for x in range(10) if x % 2 == 0]',
            '[x if x % 2 == 0 for x in range(10)]',
            'list(filter(lambda x: x % 2 == 0, range(10)))',
            'Ambas as opções A e C estão corretas',
          ],
          correctIndex: 3,
        },
        {
          id: 'py-l2-q2',
          question: 'Qual palavra-chave transforma uma função comum em um generator?',
          options: ['return', 'yield', 'gen', 'emit'],
          correctIndex: 1,
        },
        {
          id: 'py-l2-q3',
          question: 'Qual função embutida cria pares indexados a partir de um iterável?',
          options: ['zip()', 'enumerate()', 'map()', 'range()'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 3,
      title: 'Tratamento de Exceções',
      description: 'Estruturas try, except, finally e asserts.',
      unitNumber: 1,
      unitTitle: 'Fundamentos de Python e Estruturas',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'py-l3-q1',
          question:
            'Qual bloco de código garante a execução mesmo se uma exceção for levantada no bloco try?',
          options: ['except', 'else', 'finally', 'catch'],
          correctIndex: 2,
        },
        {
          id: 'py-l3-q2',
          question:
            'Qual palavra-chave é usada para levantar/disparar uma exceção manualmente em Python?',
          options: ['throw', 'raise', 'trigger', 'emit'],
          correctIndex: 1,
        },
        {
          id: 'py-l3-q3',
          question: "Quando o bloco 'else' de uma estrutura try-except é executado?",
          options: [
            'Sempre que ocorrer um erro.',
            'Apenas se nenhuma exceção for gerada no bloco try.',
            'Se o bloco finally falhar.',
            'Quando a função retorna um valor nulo.',
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 4,
      title: 'Funções e Decoradores',
      description: 'Args, kwargs, closures e decorators.',
      unitNumber: 2,
      unitTitle: 'Modificadores de Escopo e Decoradores',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'py-l4-q1',
          question: 'Qual é o papel do argumento *args na definição de uma função?',
          options: [
            'Aceitar argumentos posicionais variáveis como uma tupla.',
            'Aceitar argumentos de palavra-chave variáveis como um dicionário.',
            'Forçar a tipagem do argumento interno.',
            'Passar chaves ordenadas de dicionários.',
          ],
          correctIndex: 0,
        },
        {
          id: 'py-l4-q2',
          question: 'Qual é o comportamento de um decorador (decorator) em Python?',
          options: [
            'Modificar a folha de estilo de saídas do terminal.',
            'Uma função que recebe outra função como argumento e estende seu comportamento sem modificá-la diretamente.',
            'Uma função para compilar bibliotecas externas de C.',
            'Um método de classe para herança múltipla.',
          ],
          correctIndex: 1,
        },
        {
          id: 'py-l4-q3',
          question: 'Como se declara argumentos nomeados obrigatórios (kwargs) usando dicionários?',
          options: ['**kwargs', '*kwargs', 'kwargs()', 'dict kwargs'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 5,
      title: 'Orientação a Objetos',
      description: 'Classes, herança múltipla, Dunder methods.',
      unitNumber: 2,
      unitTitle: 'Modificadores de Escopo e Decoradores',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'py-l5-q1',
          question: 'Qual método especial (dunder) serve como construtor inicializador da classe?',
          options: ['__init__', '__new__', '__constructor__', '__call__'],
          correctIndex: 0,
        },
        {
          id: 'py-l5-q2',
          question: 'O que o método especial __str__ retorna?',
          options: [
            'Uma representação em string legível para usuários.',
            'Uma representação técnica em string para desenvolvedores (debug).',
            'A conversão exata do hash do objeto.',
            'Um JSON contendo chaves internas.',
          ],
          correctIndex: 0,
        },
        {
          id: 'py-l5-q3',
          question: 'Como funciona a resolução de herança múltipla (MRO) em Python?',
          options: [
            'Usa o algoritmo C3 Linearization para determinar a ordem de busca.',
            'Busca da esquerda para a direita de forma aleatória.',
            'Não há suporte a herança múltipla em Python.',
            'Utiliza a ordem de compilação de arquivos importados.',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 6,
      title: 'Funções de Alta Ordem',
      description: 'Lambda, map, filter, reduce e functools.',
      unitNumber: 2,
      unitTitle: 'Modificadores de Escopo e Decoradores',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'py-l6-q1',
          question: 'Qual palavra-chave define uma função anônima inline em Python?',
          options: ['def', 'lambda', 'inline', 'func'],
          correctIndex: 1,
        },
        {
          id: 'py-l6-q2',
          question: "De qual módulo padrão do Python o utilitário 'reduce' deve ser importado?",
          options: ['itertools', 'functools', 'collections', 'operator'],
          correctIndex: 1,
        },
        {
          id: 'py-l6-q3',
          question: 'O que faz o decorador @functools.lru_cache?',
          options: [
            'Deleta o cache do processador.',
            'Armazena em cache (memoization) os resultados de chamadas da função para argumentos idênticos.',
            'Limpa as variáveis locais para economizar memória.',
            'Gera logs de tempo de execução da função.',
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 7,
      title: 'Context Managers e Metaclasses',
      description: 'With, __enter__, __exit__ e metaclasses.',
      unitNumber: 3,
      unitTitle: 'Metaclasses e Programação Assíncrona',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'py-l7-q1',
          question:
            'Quais métodos especiais um objeto precisa implementar para ser usado como Context Manager (com a palavra-chave with)?',
          options: [
            '__start__ e __stop__',
            '__enter__ e __exit__',
            '__open__ e __close__',
            '__init__ e __del__',
          ],
          correctIndex: 1,
        },
        {
          id: 'py-l7-q2',
          question: 'Qual é a finalidade de uma Metaclasse em Python?',
          options: [
            'Criar instâncias de funções privadas.',
            'Definir as regras de criação de novas classes (classes de classes).',
            'Monitorar vazamento de memória em tempo de execução.',
            'Tratar conexões de banco de dados assíncronas.',
          ],
          correctIndex: 1,
        },
        {
          id: 'py-l7-q3',
          question:
            'Qual método especial de classe intercepta a criação de instâncias de uma metaclasse?',
          options: ['__new__', '__init__', '__call__', '__prepare__'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 8,
      title: 'Programação Assíncrona',
      description: 'Asyncio, event loops, tasks e futures.',
      unitNumber: 3,
      unitTitle: 'Metaclasses e Programação Assíncrona',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'py-l8-q1',
          question:
            'Qual biblioteca padrão gerencia a execução de corrotinas concorrentes assíncronas em Python?',
          options: ['threading', 'multiprocessing', 'asyncio', 'socket'],
          correctIndex: 2,
        },
        {
          id: 'py-l8-q2',
          question:
            'Qual expressão é usada para pausar a execução de uma corrotina aguardando o término de outra corrotina/futuro?',
          options: ['yield from', 'await', 'wait', 'async return'],
          correctIndex: 1,
        },
        {
          id: 'py-l8-q3',
          question:
            'Qual método do asyncio agenda a execução concorrente de múltiplas corrotinas e retorna uma lista ordenada de respostas?',
          options: ['asyncio.gather()', 'asyncio.run()', 'asyncio.wait()', 'asyncio.create_task()'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 9,
      title: 'GIL e Concorrência',
      description: 'Global Interpreter Lock, threads e multiprocessamento.',
      unitNumber: 3,
      unitTitle: 'Metaclasses e Programação Assíncrona',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'py-l9-q1',
          question: 'O que é o GIL (Global Interpreter Lock) no CPython?',
          options: [
            'Um lock que permite que apenas uma thread Python execute bytecode por vez, limitando CPU-bound multithreading.',
            'Uma biblioteca para compilar Python em C.',
            'Um coletor de lixo que limpa o cache automaticamente.',
            'O interpretador nativo de scripts assíncronos do Django.',
          ],
          correctIndex: 0,
        },
        {
          id: 'py-l9-q2',
          question:
            'Qual biblioteca padrão do Python deve ser usada para contornar o GIL dividindo tarefas em múltiplos cores de CPU?',
          options: ['threading', 'multiprocessing', 'subprocess', 'asyncio'],
          correctIndex: 1,
        },
        {
          id: 'py-l9-q3',
          question:
            'O que acontece ao tentar usar threads comuns (módulo threading) para acelerar uma tarefa puramente CPU-bound em Python?',
          options: [
            'A tarefa roda muito mais rápido usando 100% de todos os cores.',
            'Não haverá ganho de performance real devido ao limite de execução de thread única imposto pelo GIL.',
            'O Python dispara uma exceção RuntimeError.',
            'O computador desliga por aquecimento.',
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
  RUST: [
    {
      levelNumber: 1,
      title: 'Ownership & Borrowing',
      description: 'Regras de propriedade, referências e lifetimes básicas.',
      unitNumber: 1,
      unitTitle: 'Gerenciamento de Memória e Ownership',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'rust-l1-q1',
          question: 'Quantos donos (owners) um recurso/dado na heap pode ter por vez no Rust?',
          options: ['Qualquer quantidade', 'Apenas 1', 'Até 2', 'Nenhum, gerenciado por GC'],
          correctIndex: 1,
        },
        {
          id: 'rust-l1-q2',
          question: 'Qual caractere define uma referência mutável em Rust?',
          options: ['&mut', '*mut', 'ref mut', '&'],
          correctIndex: 0,
        },
        {
          id: 'rust-l1-q3',
          question:
            'O que acontece ao passar um tipo que não implementa o trait Copy para outra função?',
          options: [
            'O dado é copiado na stack automaticamente.',
            'O ownership é transferido (move), tornando o dado inutilizável no escopo anterior.',
            'Gera um aviso do compilador, mas executa normalmente.',
            'O compilador aloca no Garbage Collector.',
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 2,
      title: 'Pattern Matching & Enums',
      description: 'Match, Option, Result e tratamento de erros.',
      unitNumber: 1,
      unitTitle: 'Gerenciamento de Memória e Ownership',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'rust-l2-q1',
          question: 'Qual enum representa a presença ou ausência de um valor em Rust?',
          options: ['Result', 'Option', 'Choice', 'Maybe'],
          correctIndex: 1,
        },
        {
          id: 'rust-l2-q2',
          question:
            'Qual palavra-chave é usada para obter o valor de um Option/Result gerando panic caso seja None/Err?',
          options: ['unwrap()', 'expect()', 'unwrap_or()', 'Ambas as opções A e B estão corretas'],
          correctIndex: 3,
        },
        {
          id: 'rust-l2-q3',
          question: 'Qual macro lança um erro crítico imediato abortando a execução (panic)?',
          options: ['println!', 'err!', 'panic!', 'assert!'],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 3,
      title: 'Structs e Vetores',
      description: 'Definição de tipos customizados e listas no Rust.',
      unitNumber: 1,
      unitTitle: 'Gerenciamento de Memória e Ownership',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'rust-l3-q1',
          question: 'Como declarar um vetor dinâmico contendo inteiros em Rust?',
          options: [
            'let v = vec![1, 2, 3]',
            'let v: Array<i32> = [1, 2, 3]',
            'let v = Vector::new()',
            'let v = [1, 2, 3]',
          ],
          correctIndex: 0,
        },
        {
          id: 'rust-l3-q2',
          question: 'Como se definem métodos aplicados a uma struct em Rust?',
          options: [
            'Dentro da própria definição da struct com a sintaxe structName { fn ... }.',
            "Dentro de um bloco de implementação separado usando 'impl structName { fn ... }'.",
            'Usando herança de classes abstratas.',
            'Definindo funções globais com prefixo.',
          ],
          correctIndex: 1,
        },
        {
          id: 'rust-l3-q3',
          question:
            'Qual é a diferença de uma struct de tupla (Tuple Struct) para uma struct comum?',
          options: [
            'Ela não possui nomes nomeados para seus campos, apenas tipos (ex: struct Point(i32, i32)).',
            'Ela é sempre imutável.',
            'Ela não aceita blocos impl.',
            'Ela só serve para armazenar strings.',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 4,
      title: 'Traits e Polimorfismo',
      description: 'Implementação de métodos, traits e polimorfismo estático.',
      unitNumber: 2,
      unitTitle: 'Traits, Lifetimes e Segurança',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'rust-l4-q1',
          question: 'Qual palavra-chave declara que uma struct implementa um determinado Trait?',
          options: [
            'impl Trait for Struct',
            'Struct implements Trait',
            'Struct : Trait',
            'use Trait in Struct',
          ],
          correctIndex: 0,
        },
        {
          id: 'rust-l4-q2',
          question:
            'Qual é o equivalente a uma interface em outras linguagens, definindo comportamento compartilhado em Rust?',
          options: ['Struct', 'Enum', 'Trait', 'Module'],
          correctIndex: 2,
        },
        {
          id: 'rust-l4-q3',
          question:
            'Qual parâmetro de método representa a referência imutável à própria instância da struct?',
          options: ['self', '&self', '&mut self', 'Box<self>'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 5,
      title: 'Lifetimes e Genéricos',
      description: 'Sintaxe de tempo de vida de referências e tipos genéricos.',
      unitNumber: 2,
      unitTitle: 'Traits, Lifetimes e Segurança',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'rust-l5-q1',
          question: "Como se declara um lifetime com nome 'a em uma função?",
          options: [
            "fn func<'a>(x: &'a str)",
            'fn func(x: &a str)',
            "fn<'a> func(x: &str)",
            "fn func(x: &str) where 'a",
          ],
          correctIndex: 0,
        },
        {
          id: 'rust-l5-q2',
          question:
            'Qual é o lifetime especial que indica que a referência vive por toda a duração do programa?',
          options: ["'static", "'global", "'always", "'main"],
          correctIndex: 0,
        },
        {
          id: 'rust-l5-q3',
          question:
            'Como impor que um tipo genérico T implemente o trait Display usando a sintaxe trait bounds?',
          options: [
            'fn show<T: Display>(val: T)',
            'fn show<T>(val: T) where T: Display',
            'Ambas as opções A e B estão corretas',
            'Nenhuma das opções',
          ],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 6,
      title: 'Closures e Iteradores',
      description: 'Closures, iter, map e collect no Rust.',
      unitNumber: 2,
      unitTitle: 'Traits, Lifetimes e Segurança',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'rust-l6-q1',
          question: 'Qual é a sintaxe para declarar uma closure em Rust?',
          options: ['|x| x + 1', 'fn(x) { x + 1 }', 'lambda x: x + 1', 'let x => x + 1'],
          correctIndex: 0,
        },
        {
          id: 'rust-l6-q2',
          question:
            'Qual método consome um iterador transformando-o em uma coleção concreta (ex: Vec)?',
          options: ['collect()', 'to_vec()', 'convert()', 'drain()'],
          correctIndex: 0,
        },
        {
          id: 'rust-l6-q3',
          question:
            'Qual palavra-chave/modificador força uma closure a capturar o ownership das variáveis externas?',
          options: ['take', 'move', 'own', 'copy'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 7,
      title: 'Smart Pointers',
      description: 'Box, Rc, Arc, RefCell e concorrência segura.',
      unitNumber: 3,
      unitTitle: 'Tipagem Estrita e Concorrência Segura',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'rust-l7-q1',
          question:
            'Qual ponteiro inteligente é usado para compartilhar ownership de um recurso entre múltiplas threads de forma segura?',
          options: ['Rc<T>', 'Arc<T>', 'Box<T>', 'RefCell<T>'],
          correctIndex: 1,
        },
        {
          id: 'rust-l7-q2',
          question:
            'Qual smart pointer fornece mutabilidade interna (interior mutability) em tempo de execução sob regras de empréstimo dinâmicas?',
          options: ['Box<T>', 'Rc<T>', 'RefCell<T>', 'Arc<T>'],
          correctIndex: 2,
        },
        {
          id: 'rust-l7-q3',
          question:
            'Qual struct de concorrência garante acesso exclusivo a um dado bloqueando outras threads (exclusão mútua)?',
          options: ['Mutex<T>', 'RwLock<T>', 'Channel<T>', 'Barrier'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 8,
      title: 'Macros e Metaprogramação',
      description: 'Macros declarativas e procedurais no Rust.',
      unitNumber: 3,
      unitTitle: 'Tipagem Estrita e Concorrência Segura',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'rust-l8-q1',
          question: 'Qual caractere ao final da chamada indica o uso de uma macro em Rust?',
          options: ['?', '!', '#', '@'],
          correctIndex: 1,
        },
        {
          id: 'rust-l8-q2',
          question: "Qual tipo de macro é declarada usando a macro 'macro_rules!'?",
          options: [
            'Macro procedural.',
            'Macro declarativa (ou macro por exemplo).',
            'Derive macro.',
            'Attribute macro.',
          ],
          correctIndex: 1,
        },
        {
          id: 'rust-l8-q3',
          question: "O que faz a macro procedural '#[derive(Debug)]' em uma struct?",
          options: [
            'Faz a struct compilar mais rápido.',
            'Gera automaticamente a implementação do trait Debug para permitir formatação de impressão (debug printing).',
            'Cria getters e setters automáticos.',
            'Torna a struct thread-safe.',
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 9,
      title: 'Código Unsafe',
      description: 'Ponteiros brutos, raw pointers e unsafe blocks.',
      unitNumber: 3,
      unitTitle: 'Tipagem Estrita e Concorrência Segura',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'rust-l9-q1',
          question:
            'Qual palavra-chave é usada para realizar operações de baixo nível que o compilador não pode garantir a segurança?',
          options: ['unsafe', 'raw', 'unchecked', 'lowlevel'],
          correctIndex: 0,
        },
        {
          id: 'rust-l9-q2',
          question: 'Qual das seguintes operações é permitida SOMENTE dentro de um bloco unsafe?',
          options: [
            'Desreferenciar um ponteiro bruto (Raw Pointer).',
            'Chamar uma função que foi marcada como unsafe.',
            'Mutar uma variável estática global.',
            'Todas as alternativas estão corretas.',
          ],
          correctIndex: 3,
        },
        {
          id: 'rust-l9-q3',
          question: 'O que são Raw Pointers no Rust?',
          options: [
            'Referências seguras que usam contagem de referência.',
            "Ponteiros imutáveis '*const T' ou mutáveis '*mut T' que ignoram as regras de borrow checker do Rust.",
            'Ponteiros automáticos para a heap.',
            'Arrays estáticos alocados na pilha.',
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
  GO: [
    {
      levelNumber: 1,
      title: 'Sintaxe Básica',
      description: 'Declaração curta, Slices, Maps e Arrays.',
      unitNumber: 1,
      unitTitle: 'Conceitos Básicos e Tipagem Go',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'go-l1-q1',
          question: 'Qual é o operador de declaração e atribuição curta em Go?',
          options: ['=', ':=', '::=', 'var'],
          correctIndex: 1,
        },
        {
          id: 'go-l1-q2',
          question: 'Qual função embutida inicializa maps, slices e channels alocando memória?',
          options: ['new()', 'make()', 'alloc()', 'create()'],
          correctIndex: 1,
        },
        {
          id: 'go-l1-q3',
          question: 'Qual é a principal diferença de um Slice em relação a um Array?',
          options: [
            'Slices possuem tamanho dinâmico, enquanto Arrays têm tamanho fixo na definição de tipo.',
            'Arrays aceitam tipos mistos, Slices não.',
            'Slices são alocados sempre na stack.',
            'Não há diferença, são sinônimos.',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 2,
      title: 'Tratamento de Erros e Controle',
      description: 'Errors, defer, panic e recover.',
      unitNumber: 1,
      unitTitle: 'Conceitos Básicos e Tipagem Go',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'go-l2-q1',
          question: 'Qual é a convenção recomendada de retorno para tratamento de erros em Go?',
          options: [
            'Levantar exceções (throw/catch).',
            'Retornar o erro como o último valor do retorno múltiplo de uma função.',
            'Usar canais exclusivos para log de erros.',
            'Panic imediato em qualquer falha de validação.',
          ],
          correctIndex: 1,
        },
        {
          id: 'go-l2-q2',
          question: 'Qual é o comportamento da palavra-chave defer?',
          options: [
            'Adia a execução de uma função para imediatamente antes da função externa retornar.',
            'Executa a instrução em uma thread secundária paralela.',
            'Cancela o loop caso ocorra algum estouro de pilha.',
            'Atrasa o carregamento de variáveis globais.',
          ],
          correctIndex: 0,
        },
        {
          id: 'go-l2-q3',
          question:
            'Qual função interrompe o fluxo normal de execução e inicia o desempilhamento de chamadas (unwinding) lançando um erro?',
          options: ['panic()', 'recover()', 'exit()', 'log.Fatal()'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 3,
      title: 'Ponteiros e Estruturas',
      description: 'Endereçamento de memória e modificadores em Go.',
      unitNumber: 1,
      unitTitle: 'Conceitos Básicos e Tipagem Go',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'go-l3-q1',
          question:
            'Qual caractere é usado para obter o endereço de memória de uma variável em Go?',
          options: ['*', '&', '#', '@'],
          correctIndex: 1,
        },
        {
          id: 'go-l3-q2',
          question:
            'Qual função aloca espaço na memória inicializando-o com o valor zero e retorna um ponteiro para esse endereço?',
          options: ['make()', 'new()', 'alloc()', 'init()'],
          correctIndex: 1,
        },
        {
          id: 'go-l3-q3',
          question:
            'O que acontece ao tentar desreferenciar um ponteiro nulo (nil pointer dereference) em Go?',
          options: [
            'A variável recebe o valor zero do tipo.',
            'O programa gera um panic de tempo de execução.',
            'O compilador avisa mas ignora em tempo de execução.',
            'O Go realoca automaticamente em segundo plano.',
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 4,
      title: 'Structs e Interfaces',
      description: 'Composição, Receiver methods e interfaces implícitas.',
      unitNumber: 2,
      unitTitle: 'Orientação e Interfaces Implícitas',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'go-l4-q1',
          question: 'Como Go implementa interfaces?',
          options: [
            'Explicitamente com a palavra-chave implements.',
            'Implicitamente, se uma struct implementa todos os métodos declarados na interface.',
            'Através de herança múltipla de classes abstratas.',
            'Utilizando decorators em tempo de compilação.',
          ],
          correctIndex: 1,
        },
        {
          id: 'go-l4-q2',
          question: 'Qual receiver method permite modificar o valor interno de uma struct?',
          options: [
            'Receiver de valor (Value Receiver)',
            'Receiver de ponteiro (Pointer Receiver)',
            'Receiver estático (Static Receiver)',
            'Receiver privado (Private Receiver)',
          ],
          correctIndex: 1,
        },
        {
          id: 'go-l4-q3',
          question: 'Qual interface vazia pode representar qualquer valor em Go (similar ao any)?',
          options: ['interface{}', 'any[]', 'nil', 'object'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 5,
      title: 'Concorrência Básica',
      description: 'Goroutines, Channels e Select.',
      unitNumber: 2,
      unitTitle: 'Orientação e Interfaces Implícitas',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'go-l5-q1',
          question: 'Como iniciar uma goroutine em Go?',
          options: ['go funcName()', 'start funcName()', 'run funcName()', 'goroutine funcName()'],
          correctIndex: 0,
        },
        {
          id: 'go-l5-q2',
          question: "Qual operador envia um valor 'x' para um canal 'ch'?",
          options: ['ch <- x', 'ch <- = x', 'x -> ch', 'send(ch, x)'],
          correctIndex: 0,
        },
        {
          id: 'go-l5-q3',
          question:
            'Qual estrutura permite escutar múltiplos canais de comunicação concorrentemente?',
          options: ['switch', 'select', 'for range', 'if channel'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 6,
      title: 'Pacotes e Módulos',
      description: 'Gerenciamento de dependências com go mod.',
      unitNumber: 2,
      unitTitle: 'Orientação e Interfaces Implícitas',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'go-l6-q1',
          question: 'Qual comando inicializa um novo módulo Go criando o arquivo go.mod?',
          options: ['go init', 'go mod init', 'go module start', 'go install'],
          correctIndex: 1,
        },
        {
          id: 'go-l6-q2',
          question: 'Como importar um pacote local ou de terceiros em um arquivo Go?',
          options: [
            'Usando a palavra-chave import seguida do caminho do pacote entre aspas.',
            'Usando require no topo do arquivo.',
            'Adicionando o arquivo diretamente na pasta lib.',
            'O Go importa tudo automaticamente, não precisa declarar.',
          ],
          correctIndex: 0,
        },
        {
          id: 'go-l6-q3',
          question:
            'Qual arquivo registra as somas de verificação (hashes) exatas das dependências baixadas no Go?',
          options: ['go.mod', 'go.sum', 'vendor.json', 'go.lock'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 7,
      title: 'Concorrência Avançada',
      description: 'Buffered channels, WaitGroups e sync package.',
      unitNumber: 3,
      unitTitle: 'Concorrência Avançada e WaitGroups',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'go-l7-q1',
          question:
            'Qual struct do pacote sync serve para esperar que um grupo de goroutines termine de rodar?',
          options: ['sync.Mutex', 'sync.WaitGroup', 'sync.Once', 'sync.Cond'],
          correctIndex: 1,
        },
        {
          id: 'go-l7-q2',
          question:
            'O que acontece ao tentar enviar um dado para um canal não bufferizado que não possui um receptor pronto?',
          options: [
            'O dado é descartado e o fluxo continua.',
            'A goroutine bloqueia (fica pausada) até que um receptor leia do canal.',
            'Gera panic imediato.',
            'O dado é armazenado em cache temporário.',
          ],
          correctIndex: 1,
        },
        {
          id: 'go-l7-q3',
          question:
            'Qual função do sync/atomic garante a incrementação thread-safe de inteiros sem mutexes?',
          options: ['AddInt64()', 'CompareAndSwap()', 'Store()', 'Ambas as opções A e B'],
          correctIndex: 3,
        },
      ],
    },
    {
      levelNumber: 8,
      title: 'Context e Timeout',
      description: 'Cancelamento concorrente usando o context package.',
      unitNumber: 3,
      unitTitle: 'Concorrência Avançada e WaitGroups',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'go-l8-q1',
          question: 'Qual é a finalidade principal do pacote context no Go?',
          options: [
            'Gerenciar parâmetros globais e conexões com banco de dados.',
            'Propagar sinais de cancelamento, prazos (deadlines) e valores entre goroutines.',
            'Exibir logs estruturados do sistema.',
            'Formatar dados de saída em tempo de execução.',
          ],
          correctIndex: 1,
        },
        {
          id: 'go-l8-q2',
          question:
            'Qual função cria um contexto filho que é cancelado automaticamente após um período determinado?',
          options: [
            'context.WithCancel()',
            'context.WithTimeout()',
            'context.WithDeadline()',
            'Ambas as opções B e C são corretas',
          ],
          correctIndex: 3,
        },
        {
          id: 'go-l8-q3',
          question: 'Qual canal do struct Context avisa que a operação foi cancelada ou expirou?',
          options: ['<-ctx.Done()', '<-ctx.Cancel()', '<-ctx.Error()', '<-ctx.Close()'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 9,
      title: 'Reflection e Generics',
      description: 'Reflect package e interfaces genéricas no Go 1.18+.',
      unitNumber: 3,
      unitTitle: 'Concorrência Avançada e WaitGroups',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'go-l9-q1',
          question:
            'Como o Go 1.18+ declara um tipo ou função genérica para aceitar um conjunto específico de tipos?',
          options: [
            'Usando a sintaxe interface { Type1 | Type2 } como restrição (Type Constraint).',
            'Usando a palavra-chave extends.',
            'Usando o operador generic.',
            'Através do reflect.Value.',
          ],
          correctIndex: 0,
        },
        {
          id: 'go-l9-q2',
          question:
            'Qual pacote padrão do Go permite examinar e manipular variáveis de tipos dinâmicos em tempo de execução?',
          options: ['reflect', 'inspect', 'ast', 'runtime'],
          correctIndex: 0,
        },
        {
          id: 'go-l9-q3',
          question:
            "O que o tipo pré-declarado 'comparable' representa como restrição genérica no Go?",
          options: [
            'Qualquer tipo numérico.',
            'Tipos que podem ser comparados usando os operadores == e !=.',
            'Apenas tipos struct compostos.',
            'Funções de callback de ordenação.',
          ],
          correctIndex: 1,
        },
      ],
    },
  ],
  JAVA: [
    {
      levelNumber: 1,
      title: 'Sintaxe Básica',
      description: 'Tipos primitivos, variáveis e o método main.',
      unitNumber: 1,
      unitTitle: 'Introdução ao Java',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'java-l1-q1',
          question: 'Qual palavra-chave declara uma constante em Java?',
          options: ['var', 'let', 'final', 'const'],
          correctIndex: 2,
        },
        {
          id: 'java-l1-q2',
          question: 'Qual é o ponto de entrada padrão de um programa Java?',
          options: [
            'public static void start(String[] args)',
            'public static void main(String[] args)',
            'static void main()',
            'public void main(String args)',
          ],
          correctIndex: 1,
        },
        {
          id: 'java-l1-q3',
          question: 'Qual tipo primitivo armazena números inteiros de 32 bits?',
          options: ['long', 'int', 'short', 'byte'],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 2,
      title: 'Estruturas de Controle',
      description: 'Condicionais, loops e switch.',
      unitNumber: 1,
      unitTitle: 'Introdução ao Java',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'java-l2-q1',
          question: 'Qual loop verifica a condição antes de cada iteração?',
          options: ['do-while', 'while', 'for-each', 'Ambos B e C'],
          correctIndex: 3,
        },
        {
          id: 'java-l2-q2',
          question: 'O que o operador % faz em Java?',
          options: [
            'Calcula a porcentagem',
            'Retorna o resto da divisão',
            'Divide dois números',
            'Multiplica dois números',
          ],
          correctIndex: 1,
        },
        {
          id: 'java-l2-q3',
          question: 'Desde Java 14+, qual sintaxe moderna substitui switch tradicional com múltiplos breaks?',
          options: ['switch expression', 'match case', 'when', 'select'],
          correctIndex: 0,
        },
      ],
    },
    {
      levelNumber: 3,
      title: 'Arrays e Strings',
      description: 'Manipulação de arrays e a classe String.',
      unitNumber: 1,
      unitTitle: 'Introdução ao Java',
      sectionName: 'Júnior - Iniciante',
      questions: [
        {
          id: 'java-l3-q1',
          question: 'Como obter o comprimento de um array em Java?',
          options: ['array.size()', 'array.length()', 'array.length', 'len(array)'],
          correctIndex: 2,
        },
        {
          id: 'java-l3-q2',
          question: 'Strings em Java são:',
          options: [
            'Tipos primitivos',
            'Objetos imutáveis',
            'Mutáveis por padrão',
            'Apenas arrays de char sem métodos',
          ],
          correctIndex: 1,
        },
        {
          id: 'java-l3-q3',
          question: 'Qual método compara o conteúdo de duas Strings (não a referência)?',
          options: ['==', 'compare()', 'equals()', 'same()'],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 4,
      title: 'Classes e Objetos',
      description: 'POO básica: classes, construtores e métodos.',
      unitNumber: 2,
      unitTitle: 'Orientação a Objetos',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'java-l4-q1',
          question: 'O que é um construtor em Java?',
          options: [
            'Um método estático que destrói objetos',
            'Um método especial chamado ao instanciar um objeto',
            'Uma interface obrigatória',
            'Um modificador de acesso',
          ],
          correctIndex: 1,
        },
        {
          id: 'java-l4-q2',
          question: 'Qual palavra-chave referencia a instância atual dentro de um método?',
          options: ['self', 'this', 'super', 'current'],
          correctIndex: 1,
        },
        {
          id: 'java-l4-q3',
          question: 'Qual modificador impede que uma classe seja herdada?',
          options: ['static', 'private', 'final', 'abstract'],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 5,
      title: 'Herança e Polimorfismo',
      description: 'extends, super e sobrescrita de métodos.',
      unitNumber: 2,
      unitTitle: 'Orientação a Objetos',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'java-l5-q1',
          question: 'Qual palavra-chave indica herança de classe em Java?',
          options: ['implements', 'extends', 'inherits', 'super'],
          correctIndex: 1,
        },
        {
          id: 'java-l5-q2',
          question: 'O que a anotação @Override indica?',
          options: [
            'Que o método é privado',
            'Que o método sobrescreve um da superclasse',
            'Que o método é estático',
            'Que o método é abstrato',
          ],
          correctIndex: 1,
        },
        {
          id: 'java-l5-q3',
          question: 'Qual palavra-chave chama o construtor da classe pai?',
          options: ['this()', 'parent()', 'super()', 'base()'],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 6,
      title: 'Interfaces e Abstração',
      description: 'Interfaces, classes abstratas e contratos.',
      unitNumber: 2,
      unitTitle: 'Orientação a Objetos',
      sectionName: 'Pleno - Intermediário',
      questions: [
        {
          id: 'java-l6-q1',
          question: 'Uma classe pode implementar quantas interfaces?',
          options: ['Apenas uma', 'Duas no máximo', 'Quantas quiser', 'Nenhuma'],
          correctIndex: 2,
        },
        {
          id: 'java-l6-q2',
          question: 'Qual diferença principal entre classe abstrata e interface (pré-Java 8)?',
          options: [
            'Interfaces podem ter construtores',
            'Classes abstratas podem ter estado e construtores; interfaces não',
            'Classes abstratas não podem ser herdadas',
            'Não há diferença',
          ],
          correctIndex: 1,
        },
        {
          id: 'java-l6-q3',
          question: 'Métodos default em interfaces foram introduzidos em qual versão do Java?',
          options: ['Java 6', 'Java 7', 'Java 8', 'Java 11'],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 7,
      title: 'Collections',
      description: 'ArrayList, HashMap e Iterator.',
      unitNumber: 3,
      unitTitle: 'Coleções e Generics',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'java-l7-q1',
          question: 'Qual interface representa uma lista ordenada com acesso por índice?',
          options: ['Set', 'Map', 'List', 'Queue'],
          correctIndex: 2,
        },
        {
          id: 'java-l7-q2',
          question: 'Qual estrutura armazena pares chave-valor sem ordem garantida?',
          options: ['ArrayList', 'LinkedList', 'HashMap', 'TreeSet'],
          correctIndex: 2,
        },
        {
          id: 'java-l7-q3',
          question: 'O que generics permitem em Java?',
          options: [
            'Executar código em paralelo',
            'Tipagem segura em tempo de compilação para coleções e classes',
            'Criar threads automaticamente',
            'Substituir interfaces',
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      levelNumber: 8,
      title: 'Exceções',
      description: 'try-catch-finally e hierarquia de exceções.',
      unitNumber: 3,
      unitTitle: 'Coleções e Generics',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'java-l8-q1',
          question: 'Qual exceção é lançada ao acessar índice inválido em array?',
          options: [
            'NullPointerException',
            'ArrayIndexOutOfBoundsException',
            'IndexError',
            'OutOfMemoryError',
          ],
          correctIndex: 1,
        },
        {
          id: 'java-l8-q2',
          question: 'Exceções checadas (checked) em Java devem ser:',
          options: [
            'Ignoradas sempre',
            'Tratadas com try-catch ou declaradas com throws',
            'Convertidas em runtime automaticamente',
            'Apenas logadas',
          ],
          correctIndex: 1,
        },
        {
          id: 'java-l8-q3',
          question: 'Qual bloco sempre executa, com ou sem exceção?',
          options: ['catch', 'throw', 'finally', 'else'],
          correctIndex: 2,
        },
      ],
    },
    {
      levelNumber: 9,
      title: 'Streams e Lambda',
      description: 'Programação funcional com Java 8+.',
      unitNumber: 3,
      unitTitle: 'Coleções e Generics',
      sectionName: 'Sênior - Avançado',
      questions: [
        {
          id: 'java-l9-q1',
          question: 'Qual interface funcional representa uma função sem argumentos que retorna void?',
          options: ['Function', 'Consumer', 'Runnable', 'Supplier'],
          correctIndex: 2,
        },
        {
          id: 'java-l9-q2',
          question: 'Qual método de Stream transforma cada elemento em outro valor?',
          options: ['filter()', 'map()', 'forEach()', 'collect()'],
          correctIndex: 1,
        },
        {
          id: 'java-l9-q3',
          question: 'Expressões lambda em Java usam qual sintaxe para parâmetros e corpo?',
          options: [
            '(params) -> { corpo }',
            'fn params => corpo',
            'lambda params: corpo',
            'params :: corpo',
          ],
          correctIndex: 0,
        },
      ],
    },
  ],
};

export function findTrailQuestionById(
  id: string
): { question: TrailQuestion; language: string } | null {
  for (const [lang, levels] of Object.entries(TRAILS_DATA)) {
    for (const level of levels) {
      const q = level.questions.find((quest) => quest.id === id);
      if (q) return { question: q, language: lang };
    }
  }
  return null;
}
