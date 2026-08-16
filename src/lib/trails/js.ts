import type { TrailLevel } from '../trailsData';

export const JS_TRAIL: TrailLevel[] = [
  // ── SEÇÃO 1: Fundamentos & Sintaxe Essencial ──
  {
    levelNumber: 1,
    title: 'Variáveis e Declarações',
    description: 'Diferenças fundamentais entre let, const e var, escopo e imutabilidade.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Essencial',
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
        question:
          'O que acontece ao tentar reatribuir o valor de uma variável declarada com const?',
        options: [
          'Gera um TypeError',
          'O valor é reatribuído normalmente',
          'Cria uma nova variável global',
          'Retorna undefined',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l1-q3',
        question: 'Qual é o comportamento do var em relação ao escopo dentro de um bloco if?',
        options: [
          'Fica restrita ao bloco if',
          'Vaza para o escopo da função ou global',
          'Gera erro de compilação',
          'É automaticamente convertida para const',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    levelNumber: 2,
    title: 'Tipos Primitivos',
    description: 'Identificação e propriedades dos tipos primitivos em JavaScript.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Essencial',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'js-l2-q1',
        question: 'Qual é o retorno de typeof null no JavaScript moderno?',
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correctIndex: 2,
      },
      {
        id: 'js-l2-q2',
        question:
          'Qual destes tipos é um tipo primitivo introduzido no ES6 para identificadores únicos?',
        options: ['Symbol', 'UUID', 'BigInt', 'Identifier'],
        correctIndex: 0,
      },
      {
        id: 'js-l2-q3',
        question:
          'Qual tipo primitivo permite representar inteiros com precisão arbitrária acima de 2^53 - 1?',
        options: ['Number', 'BigInt', 'Float64', 'Long'],
        correctIndex: 1,
      },
    ],
  },
  {
    levelNumber: 3,
    title: 'Operadores & Precedência',
    description: 'Operadores aritméticos, lógicos, de coalescência e ternários.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Essencial',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'js-l3-q1',
        question: 'Qual é a diferença entre os operadores == e ===?',
        options: [
          '== compara tipo e valor; === compara apenas valor',
          '=== compara tipo e valor sem coerção; == realiza coerção',
          'Não há diferença prática',
          '=== é usado apenas para objetos',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l3-q2',
        question: 'O que a expressão `null ?? "padrão"` retorna?',
        options: ['null', '"padrão"', 'undefined', 'false'],
        correctIndex: 1,
      },
      {
        id: 'js-l3-q3',
        question: 'O que a expressão `0 || 42` retorna em JavaScript?',
        options: ['0', '42', 'true', 'false'],
        correctIndex: 1,
      },
    ],
  },
  {
    levelNumber: 4,
    title: 'Conversão & Coerção',
    description: 'Conversões explícitas e implícitas de tipos (Type Casting).',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Essencial',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'js-l4-q1',
        question: 'Qual é o resultado da expressão `"5" - 2`?',
        options: ['"3"', '3', '"52"', 'NaN'],
        correctIndex: 1,
      },
      {
        id: 'js-l4-q2',
        question: 'Qual é o resultado da expressão `"5" + 2`?',
        options: ['7', '"52"', 'NaN', 'TypeError'],
        correctIndex: 1,
      },
      {
        id: 'js-l4-q3',
        question: 'Como converter explicitamente uma string para número inteiro em base 10?',
        options: ['parseInt(str, 10)', 'str.toInteger()', 'Number.parse(str)', 'Math.toInt(str)'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 5,
    title: 'Template Literals & Strings',
    description: 'Manipulação moderna de strings com template literals e interpolação.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Essencial',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'js-l5-q1',
        question: 'Qual caractere é utilizado para delimitar uma Template String?',
        options: ["Aspas simples (')", 'Aspas duplas (")', 'Crase (`)', 'Barra invertida (\\)'],
        correctIndex: 2,
      },
      {
        id: 'js-l5-q2',
        question:
          'Qual sintaxe realiza a interpolação de uma variável dentro de uma template string?',
        options: ['$(var)', '${var}', '#{var}', '%{var}'],
        correctIndex: 1,
      },
      {
        id: 'js-l5-q3',
        question: 'Qual método verifica se uma string começa com determinados caracteres?',
        options: ['startsWith()', 'hasPrefix()', 'beginsWith()', 'includesAt(0)'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 2: Estruturas de Controle & Fluxo ──
  {
    levelNumber: 6,
    title: 'Condicionais if/else',
    description: 'Ramificação de código com estruturas if, else if e operador ternário.',
    unitNumber: 2,
    unitTitle: 'Estruturas de Controle & Fluxo',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'js-l6-q1',
        question: 'Qual dos seguintes valores é considerado "truthy" em uma condição if?',
        options: ['"" (string vazia)', '0', '"0"', 'NaN'],
        correctIndex: 2,
      },
      {
        id: 'js-l6-q2',
        question: 'Qual é a sintaxe correta do operador ternário?',
        options: [
          'condição ? valorSeVerdade : valorSeFalso',
          'condição : valorSeVerdade ? valorSeFalso',
          'if (condição) -> valorSeVerdade',
          'condição ?? valorSeVerdade : valorSeFalso',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l6-q3',
        question: 'Qual valor não é considerado falsy em JavaScript?',
        options: ['undefined', 'null', '[] (array vazio)', 'false'],
        correctIndex: 2,
      },
    ],
  },
  {
    levelNumber: 7,
    title: 'Switch & Cláusulas Case',
    description: 'Seleção múltipla com a declaração switch, break e default.',
    unitNumber: 2,
    unitTitle: 'Estruturas de Controle & Fluxo',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'js-l7-q1',
        question:
          'Qual tipo de comparação a instrução switch realiza internamente entre a expressão e cada case?',
        options: [
          'Igualdade solta (==)',
          'Igualdade estrita (===)',
          'Verificação por tipo apenas',
          'Coerção booleana',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l7-q2',
        question: 'O que acontece se uma cláusula case não incluir a instrução break?',
        options: [
          'O código gera erro de sintaxe',
          'A execução "cai" para o próximo case (fall-through)',
          'O switch é encerrado imediatamente',
          'Retorna null',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l7-q3',
        question: 'Qual palavra-chave define o bloco executado quando nenhum case corresponde?',
        options: ['else', 'fallback', 'default', 'otherwise'],
        correctIndex: 2,
      },
    ],
  },
  {
    levelNumber: 8,
    title: 'Laços de Repetição for e while',
    description: 'Iteração com for tradicional, while e do...while.',
    unitNumber: 2,
    unitTitle: 'Estruturas de Controle & Fluxo',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'js-l8-q1',
        question:
          'Qual laço de repetição garante que o bloco será executado pelo menos uma vez antes do teste?',
        options: ['for', 'while', 'do...while', 'for...of'],
        correctIndex: 2,
      },
      {
        id: 'js-l8-q2',
        question: 'Qual instrução interrompe imediatamente a execução de um laço de repetição?',
        options: ['continue', 'return', 'break', 'exit'],
        correctIndex: 2,
      },
      {
        id: 'js-l8-q3',
        question: 'Qual instrução pula a iteração atual e avança para a próxima no laço?',
        options: ['skip', 'pass', 'continue', 'next'],
        correctIndex: 2,
      },
    ],
  },
  {
    levelNumber: 9,
    title: 'Iteração for...of e for...in',
    description: 'Diferença de iteração sobre valores de iteráveis vs chaves de objetos.',
    unitNumber: 2,
    unitTitle: 'Estruturas de Controle & Fluxo',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'js-l9-q1',
        question:
          'Qual laço é projetado especificamente para iterar sobre os VALORES de arrays e outros iteráveis?',
        options: ['for...in', 'for...of', 'while', 'forEach()'],
        correctIndex: 1,
      },
      {
        id: 'js-l9-q2',
        question: 'O que o laço for...in percorre em um objeto JavaScript?',
        options: [
          'Os valores das propriedades',
          'As chaves enumeráveis do objeto e seu protótipo',
          'Apenas os métodos estáticos',
          'Os índices numéricos estritos',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l9-q3',
        question: 'É possível utilizar break e continue dentro de um laço for...of?',
        options: [
          'Sim, normalmente',
          'Não, causa erro',
          'Apenas break é permitido',
          'Apenas com arrow functions',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 3: Funções, Escopo & Modularização ──
  {
    levelNumber: 10,
    title: 'Funções & Parâmetros',
    description: 'Declaração, expressões de função, arrow functions e valores default.',
    unitNumber: 3,
    unitTitle: 'Funções, Escopo & Modularização',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'js-l10-q1',
        question: 'Como as Arrow Functions tratam o valor do identificador `this`?',
        options: [
          'Criam um novo `this` a cada chamada',
          'Herdam o `this` do escopo léxico onde foram definidas',
          'O `this` é sempre nulo',
          'O `this` aponta sempre para o objeto global',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l10-q2',
        question: 'Como definir um valor padrão para um parâmetro em uma função?',
        options: [
          'function soma(a, b = 10) {}',
          'function soma(a, default b: 10) {}',
          'function soma(a, b : 10) {}',
          'function soma(a, b || 10) {}',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l10-q3',
        question: 'Qual sintaxe agrupa múltiplos argumentos restantes em um array?',
        options: ['...args (Rest parameters)', 'args[]', '*args', '&args'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 11,
    title: 'Escopo Léxico & Closures',
    description: 'Como funções retêm acesso ao seu escopo pai após sua execução.',
    unitNumber: 3,
    unitTitle: 'Funções, Escopo & Modularização',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'js-l11-q1',
        question: 'O que é uma Closure em JavaScript?',
        options: [
          'Uma função que não pode ser invocada',
          'A combinação de uma função com as referências ao seu escopo léxico envolvente',
          'Um método de criptografia de código',
          'Uma classe sem construtor',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l11-q2',
        question: 'O que é o conceito de Hoisting?',
        options: [
          'A elevação de declarações de variáveis e funções ao topo do seu escopo durante a fase de criação',
          'A remoção de memória de variáveis não utilizadas',
          'O processo de compilar TypeScript para JS',
          'O congelamento de objetos com Object.freeze()',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l11-q3',
        question: 'O que acontece ao acessar uma variável `let` antes da sua linha de declaração?',
        options: [
          'Retorna undefined',
          'Lança um ReferenceError (Temporal Dead Zone)',
          'Retorna null',
          'Cria a variável globalmente',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    levelNumber: 12,
    title: 'Funções de Alta Ordem',
    description: 'Uso avançado de map, filter, reduce e flatMap em coleções.',
    unitNumber: 3,
    unitTitle: 'Funções, Escopo & Modularização',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'js-l12-q1',
        question:
          'Qual método transforma cada elemento de um array e retorna um novo array com o mesmo tamanho?',
        options: ['filter()', 'map()', 'forEach()', 'reduce()'],
        correctIndex: 1,
      },
      {
        id: 'js-l12-q2',
        question: 'Qual método acumula os elementos de um array em um único valor resultante?',
        options: ['accumulate()', 'reduce()', 'sum()', 'collect()'],
        correctIndex: 1,
      },
      {
        id: 'js-l12-q3',
        question: 'O método `Array.prototype.find()` retorna:',
        options: [
          'Um array com todos os elementos correspondentes',
          'O primeiro elemento que satisfaz a função de teste ou undefined',
          'O índice do elemento',
          'Um booleano',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    levelNumber: 13,
    title: 'Recursão & Currying',
    description: 'Técnicas de programação funcional: recursão e decomposição curried.',
    unitNumber: 3,
    unitTitle: 'Funções, Escopo & Modularização',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'js-l13-q1',
        question:
          'Qual componente é indispensável em uma função recursiva para evitar estouro de pilha (Stack Overflow)?',
        options: [
          'Caso base (condição de parada)',
          'Um laço while',
          'Um bloco try/catch',
          'Uma arrow function',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l13-q2',
        question: 'O que é Currying na programação funcional?',
        options: [
          'Executar código em threads paralelas',
          'Transformar uma função que recebe múltiplos argumentos em uma sequência de funções que recebem um único argumento',
          'Validar tipagem em tempo de execução',
          'Remover mutações de objetos',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l13-q3',
        question: 'O que caracteriza uma Função Pura (Pure Function)?',
        options: [
          'Não tem parâmetros',
          'Dado os mesmos argumentos, retorna o mesmo resultado sem efeitos colaterais',
          'É escrita sem usar classes',
          'Executa apenas em ambiente Node.js',
        ],
        correctIndex: 1,
      },
    ],
  },

  // ── SEÇÃO 4: Estruturas de Dados & Coleções ──
  {
    levelNumber: 14,
    title: 'Arrays & Métodos Mutáveis',
    description: 'Operações diretas na estrutura do array: push, pop, splice e sort.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'js-l14-q1',
        question:
          'Qual método remove e retorna o primeiro elemento de um array, alterando seu tamanho?',
        options: ['pop()', 'shift()', 'unshift()', 'slice()'],
        correctIndex: 1,
      },
      {
        id: 'js-l14-q2',
        question:
          'Como o método sort() sem argumentos ordena os elementos de um array de números por padrão?',
        options: [
          'Em ordem numérica crescente',
          'Convertendo para strings e ordenando pela tabela UTF-16',
          'Em ordem decrescente',
          'Aleatoriamente',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l14-q3',
        question:
          'Qual método pode remover, substituir ou adicionar novos elementos em qualquer posição de um array mutando-o?',
        options: ['splice()', 'slice()', 'split()', 'join()'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 15,
    title: 'Imutabilidade & Métodos Não-Mutáveis',
    description: 'Padrões de manipulação imutável com slice, concat, toSorted e spread.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'js-l15-q1',
        question:
          'Qual novo método do ES2023 retorna uma cópia ordenada do array sem mutar o original?',
        options: ['toSorted()', 'sortCopy()', 'asSorted()', 'sorted()'],
        correctIndex: 0,
      },
      {
        id: 'js-l15-q2',
        question:
          'Qual método extrai uma seção de um array e retorna um novo array sem alterar o original?',
        options: ['splice()', 'slice()', 'extract()', 'chunk()'],
        correctIndex: 1,
      },
      {
        id: 'js-l15-q3',
        question:
          'Como criar uma cópia rasa (shallow copy) de um array `arr` usando o operador spread?',
        options: ['[...arr]', '{...arr}', 'arr.copy()', 'new Array(arr)'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 16,
    title: 'Objetos & Desestruturação',
    description:
      'Destructuring de objetos e arrays, Object.keys/values/entries e propriedades computadas.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'js-l16-q1',
        question:
          'Como renomear uma propriedade `nome` para `nomeCompleto` na desestruturação de um objeto?',
        options: [
          'const { nome: nomeCompleto } = pessoa;',
          'const { nome as nomeCompleto } = pessoa;',
          'const { nome -> nomeCompleto } = pessoa;',
          'const { nome = nomeCompleto } = pessoa;',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l16-q2',
        question: 'O que o método `Object.entries(obj)` retorna?',
        options: [
          'Um array com as chaves',
          'Um array com os valores',
          'Um array de pares [chave, valor]',
          'O número de propriedades',
        ],
        correctIndex: 2,
      },
      {
        id: 'js-l16-q3',
        question:
          'Qual método impede a adição, remoção e modificação de propriedades de um objeto?',
        options: [
          'Object.seal()',
          'Object.freeze()',
          'Object.lock()',
          'Object.preventExtensions()',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    levelNumber: 17,
    title: 'Map & Set',
    description:
      'Estruturas de dados avançadas para chaves complexas e coleções de valores únicos.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'js-l17-q1',
        question:
          'Qual é a principal vantagem de um `Map` sobre um objeto comum para armazenar pares chave-valor?',
        options: [
          'As chaves de um Map podem ser de qualquer tipo, incluindo objetos e funções',
          'Maps são automaticamente salvos no localStorage',
          'Objetos não podem ter valores numéricos',
          'Maps não ocupam memória na heap',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l17-q2',
        question:
          'Como garantir que um array `[1, 2, 2, 3, 3, 4]` tenha apenas elementos únicos usando `Set`?',
        options: [
          '[...new Set(arr)]',
          'Set.from(arr)',
          'arr.unique()',
          'new Set([...arr]).toArray()',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l17-q3',
        question: 'Como consultar o número de elementos armazenados em um `Set`?',
        options: ['set.length', 'set.size', 'set.count()', 'set.total'],
        correctIndex: 1,
      },
    ],
  },
  {
    levelNumber: 18,
    title: 'JSON & Serialização',
    description: 'Conversão entre estruturas em memória e texto JSON com replacer e reviver.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'js-l18-q1',
        question:
          'Qual método nativo transforma um objeto JavaScript em uma string formatada em JSON?',
        options: ['JSON.parse()', 'JSON.stringify()', 'JSON.serialize()', 'Object.toJSON()'],
        correctIndex: 1,
      },
      {
        id: 'js-l18-q2',
        question:
          'O que acontece com funções e propriedades com valor `undefined` ao executar `JSON.stringify(obj)`?',
        options: [
          'São convertidas para null',
          'São omitidas do JSON resultante',
          'Geram um TypeError',
          'São mantidas como strings',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l18-q3',
        question:
          'Qual método moderno cria uma cópia profunda (deep clone) nativa de objetos e arrays no JavaScript?',
        options: ['structuredClone()', 'Object.deepCopy()', 'JSON.deepClone()', 'cloneObject()'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 5: Programação Orientada a Objetos ──
  {
    levelNumber: 19,
    title: 'Classes & Construtores',
    description: 'Sintaxe de classes ES6, instanciação com new e métodos de instância.',
    unitNumber: 5,
    unitTitle: 'Programação Orientada a Objetos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l19-q1',
        question:
          'Qual método especial de uma classe é executado automaticamente no momento de sua instanciação com `new`?',
        options: ['init()', 'constructor()', 'create()', 'build()'],
        correctIndex: 1,
      },
      {
        id: 'js-l19-q2',
        question:
          'O que acontece ao tentar invocar uma classe como função sem usar a palavra-chave `new`?',
        options: [
          'Executa o construtor normalmente',
          'Lança um TypeError',
          'Retorna o protótipo da classe',
          'Cria uma instância no escopo global',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l19-q3',
        question:
          'Qual operador verifica se um objeto é uma instância de determinada classe ou função construtora?',
        options: ['typeof', 'instanceof', 'in', 'isPrototypeOf()'],
        correctIndex: 1,
      },
    ],
  },
  {
    levelNumber: 20,
    title: 'Encapsulamento & Campos Privados',
    description: 'Campos e métodos privados com prefixo `#`, getters e setters.',
    unitNumber: 5,
    unitTitle: 'Programação Orientada a Objetos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l20-q1',
        question:
          'Qual símbolo declara um campo ou método como estritamente privado em classes JavaScript modernas?',
        options: ['_ (underline)', '# (hashtag)', 'private', '$ (cifrão)'],
        correctIndex: 1,
      },
      {
        id: 'js-l20-q2',
        question:
          'Qual palavra-chave define um método acessor que calcula e retorna uma propriedade como se fosse um atributo?',
        options: ['set', 'get', 'fetch', 'prop'],
        correctIndex: 1,
      },
      {
        id: 'js-l20-q3',
        question: 'Como acessar um método estático `gerarId()` declarado em uma classe `Usuario`?',
        options: [
          'Usuario.gerarId()',
          'new Usuario().gerarId()',
          'Usuario::gerarId()',
          'this.gerarId()',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 21,
    title: 'Herança & Polimorfismo',
    description: 'Extensão de classes, invocação do super construtor e override de métodos.',
    unitNumber: 5,
    unitTitle: 'Programação Orientada a Objetos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l21-q1',
        question:
          'Qual palavra-chave é utilizada para criar uma classe filha herdando de uma classe pai?',
        options: ['implements', 'extends', 'inherits', 'prototypeOf'],
        correctIndex: 1,
      },
      {
        id: 'js-l21-q2',
        question:
          'Dentro do construtor de uma classe derivada, o que deve ser chamado antes de utilizar o `this`?',
        options: ['super()', 'this.init()', 'Parent.call()', 'Object.create()'],
        correctIndex: 0,
      },
      {
        id: 'js-l21-q3',
        question: 'O que é o Polimorfismo na POO com JavaScript?',
        options: [
          'A capacidade de uma classe filha sobrescrever métodos da classe pai para fornecer um comportamento específico',
          'A conversão de tipos de dados em tempo de execução',
          'Criar múltiplas classes com o mesmo nome',
          'Executar código de forma assíncrona',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 22,
    title: 'Prototypes & Cadeia de Protótipos',
    description: 'Entendimento profundo do modelo de herança prototípica do JavaScript.',
    unitNumber: 5,
    unitTitle: 'Programação Orientada a Objetos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l22-q1',
        question: 'O que é o Prototype Chain (cadeia de protótipos)?',
        options: [
          'Uma lista encadeada de objetos utilizada pelo motor para resolver propriedades não encontradas no objeto atual',
          'Uma árvore de renderização do DOM',
          'A fila de microtarefas do Event Loop',
          'Um array de funções callbacks',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l22-q2',
        question: 'Qual método retorna o protótipo de um objeto especificado de forma segura?',
        options: [
          'Object.getPrototypeOf(obj)',
          'obj.__proto__',
          'Object.prototype(obj)',
          'obj.getPrototype()',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l22-q3',
        question: 'O que o método `Object.create(proto)` realiza?',
        options: [
          'Cria um novo objeto tendo `proto` como seu protótipo explícito',
          'Clona o objeto `proto` em profundidade',
          'Congela o objeto `proto`',
          'Converte `proto` em uma classe',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 6: Tratamento de Erros, Exceções & I/O ──
  {
    levelNumber: 23,
    title: 'Try, Catch & Finally',
    description: 'Controle defensivo de fluxo, captura de exceções e blocos de limpeza.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Erros, Exceções & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l23-q1',
        question: 'Quando o bloco `finally` é executado dentro de uma estrutura try/catch/finally?',
        options: [
          'Apenas se ocorrer um erro',
          'Apenas se não ocorrer nenhum erro',
          'Sempre, independentemente de ter ocorrido erro ou não',
          'Apenas se houver um return explícito no try',
        ],
        correctIndex: 2,
      },
      {
        id: 'js-l23-q2',
        question: 'Qual palavra-chave é utilizada para disparar manualmente uma exceção?',
        options: ['raise', 'throw', 'error', 'panic'],
        correctIndex: 1,
      },
      {
        id: 'js-l23-q3',
        question: 'No ES2019, o recurso Optional Catch Binding permite:',
        options: [
          'Omitir o parâmetro `error` no bloco `catch` caso não seja utilizado: `try { ... } catch { ... }`',
          'Ignorar todos os erros automaticamente',
          'Fazer catch de erros assíncronos sem Promise',
          'Transformar erros em avisos',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 24,
    title: 'Classes de Erro Customizadas',
    description: 'Criação de hierarquias de erro estendendo a classe nativa Error.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Erros, Exceções & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l24-q1',
        question: 'Como criar uma classe de erro personalizada chamada `ValidacaoError`?',
        options: [
          'class ValidacaoError extends Error { ... }',
          'class ValidacaoError implements Exception { ... }',
          'function ValidacaoError = new Error()',
          'const ValidacaoError = Error.create()',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l24-q2',
        question:
          'Qual propriedade de uma instância de `Error` contém o rastreamento da pilha de chamadas?',
        options: ['error.trace', 'error.stack', 'error.history', 'error.callstack'],
        correctIndex: 1,
      },
      {
        id: 'js-l24-q3',
        question:
          'Qual recurso nativo do ES2022 permite encadear a causa original de um erro usando a opção `cause`?',
        options: [
          'new Error("Falha no pagamento", { cause: erroOriginal })',
          'new Error("Falha", erroOriginal)',
          'error.setCause(erroOriginal)',
          'Error.chain(erroOriginal)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 25,
    title: 'Manipulação de Eventos',
    description: 'EventTarget, CustomEvent, dispatchEvent e propagação (bubbling & capturing).',
    unitNumber: 6,
    unitTitle: 'Tratamento de Erros, Exceções & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l25-q1',
        question:
          'Qual método impede que um evento continue se propagando pela árvore DOM (bubbling)?',
        options: [
          'event.preventDefault()',
          'event.stopPropagation()',
          'event.stop()',
          'event.cancelBubble()',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l25-q2',
        question:
          'Como criar e despachar um evento customizado com dados adicionais em JavaScript?',
        options: [
          'element.dispatchEvent(new CustomEvent("notificacao", { detail: { msg: "Olá" } }))',
          'element.emit("notificacao", { msg: "Olá" })',
          'element.trigger("notificacao")',
          'window.sendEvent("notificacao")',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l25-q3',
        question: 'O que o método `event.preventDefault()` realiza?',
        options: [
          'Interrompe o bubbling do evento',
          'Cancela a ação padrão do navegador associada ao evento (ex: envio de formulário)',
          'Remove o listener do elemento',
          'Fecha a aba do navegador',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    levelNumber: 26,
    title: 'TextEncoder, Buffers & Streams',
    description: 'Trabalhando com dados binários, Uint8Array e streams no JavaScript moderno.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Erros, Exceções & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l26-q1',
        question:
          'Qual classe nativa converte uma string JavaScript para um array de bytes `Uint8Array` em UTF-8?',
        options: ['TextEncoder', 'BufferEncoder', 'BinaryEncoder', 'ByteConverter'],
        correctIndex: 0,
      },
      {
        id: 'js-l26-q2',
        question:
          'Qual estrutura representa uma sequência de bytes de tamanho fixo em memória bruta?',
        options: ['ArrayBuffer', 'DataList', 'ByteCollection', 'MemoryPool'],
        correctIndex: 0,
      },
      {
        id: 'js-l26-q3',
        question:
          'Qual API moderna permite processar grandes volumes de dados de forma contínua sob demanda?',
        options: [
          'Streams API (ReadableStream / WritableStream)',
          'Batch API',
          'ThreadAPI',
          'ChunkProcessor',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 7: Assincronismo, Concorrência & Rede ──
  {
    levelNumber: 27,
    title: 'Event Loop & Microtasks',
    description: 'Funcionamento do Call Stack, Web APIs, Microtask Queue e Macrotask Queue.',
    unitNumber: 7,
    unitTitle: 'Assincronismo, Concorrência & Rede',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l27-q1',
        question:
          'Qual fila de tarefas tem maior prioridade de execução no Event Loop após a pilha de chamadas esvaziar?',
        options: [
          'Macrotask Queue (setTimeout, setInterval)',
          'Microtask Queue (Promises, queueMicrotask)',
          'Rendering Queue',
          'Network Queue',
        ],
        correctIndex: 1,
      },
      {
        id: 'js-l27-q2',
        question:
          'Qual será a ordem de saída de: `console.log("1"); Promise.resolve().then(() => console.log("2")); console.log("3");`?',
        options: ['1, 2, 3', '1, 3, 2', '2, 1, 3', '3, 2, 1'],
        correctIndex: 1,
      },
      {
        id: 'js-l27-q3',
        question: 'Como agendar explicitamente uma microtarefa de forma nativa?',
        options: [
          'queueMicrotask(callback)',
          'setTimeout(callback, 0)',
          'setImmediate(callback)',
          'requestAnimationFrame(callback)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 28,
    title: 'Promises & Métodos Combinadores',
    description: 'Criação e combinação de Promises com Promise.all, allSettled, race e any.',
    unitNumber: 7,
    unitTitle: 'Assincronismo, Concorrência & Rede',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l28-q1',
        question:
          'Qual combinador de Promises aguarda TODAS resolverem ou rejeita imediatamente na PRIMEIRA falha?',
        options: ['Promise.all()', 'Promise.allSettled()', 'Promise.race()', 'Promise.any()'],
        correctIndex: 0,
      },
      {
        id: 'js-l28-q2',
        question:
          'Qual combinador aguarda a conclusão de todas as Promises e retorna o status (fulfilled ou rejected) de cada uma?',
        options: ['Promise.all()', 'Promise.allSettled()', 'Promise.any()', 'Promise.race()'],
        correctIndex: 1,
      },
      {
        id: 'js-l28-q3',
        question:
          'Qual combinador resolve assim que a PRIMEIRA Promise do conjunto for resolvida com sucesso?',
        options: ['Promise.any()', 'Promise.race()', 'Promise.first()', 'Promise.some()'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 29,
    title: 'Async / Await & Tratamento de Erros',
    description: 'Sintaxe assíncrona moderna, await sequencial vs concorrente e tratamento.',
    unitNumber: 7,
    unitTitle: 'Assincronismo, Concorrência & Rede',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l29-q1',
        question: 'O que uma função declarada com `async` sempre retorna?',
        options: ['Um valor síncrono', 'Uma Promise', 'Um Generator', 'undefined'],
        correctIndex: 1,
      },
      {
        id: 'js-l29-q2',
        question:
          'Como tratar erros ocorridos dentro de um bloco com operações assíncronas com `await`?',
        options: [
          'Com blocos `try...catch`',
          'Usando a cláusula `onError`',
          'Com if/else simples',
          'Adicionando `catch` no final do arquivo',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l29-q3',
        question: 'Qual é o benefício do Top-Level Await em módulos ES modernos?',
        options: [
          'Permite utilizar a palavra-chave `await` fora de funções `async` no escopo raiz do módulo',
          'Elimina a necessidade de Promises',
          'Acelera a compilação',
          'Desativa o modo estrito',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 30,
    title: 'Fetch API & Cancelamento com AbortController',
    description: 'Requisições HTTP, headers, timeouts e cancelamento com AbortSignal.',
    unitNumber: 7,
    unitTitle: 'Assincronismo, Concorrência & Rede',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l30-q1',
        question: 'Como cancelar uma requisição `fetch` em andamento após um tempo limite?',
        options: [
          'Usando uma instância de `AbortController` e passando seu `signal` no fetch',
          'Chamando `fetch.cancel()`',
          'Destruindo a Promise',
          'Fechando a conexão TCP',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l30-q2',
        question:
          'Por que o `fetch()` não rejeita a Promise em caso de resposta HTTP com status 404 ou 500?',
        options: [
          'Porque a comunicação de rede foi bem-sucedida; deve-se checar a propriedade `response.ok`',
          'É um bug da especificação',
          'Apenas erros 200 rejeitam a Promise',
          'Status codes não são suportados pelo fetch',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l30-q3',
        question:
          'Qual método nativo do objeto Response faz o parse do corpo da resposta como JSON?',
        options: [
          'response.json()',
          'response.parse()',
          'JSON.fromResponse(response)',
          'response.bodyAsJson()',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 8: Testes, Padrões & Projeto Final ──
  {
    levelNumber: 31,
    title: 'Módulos ES & Empacotamento',
    description: 'Importações estáticas e dinâmicas, exportações nomeadas e default.',
    unitNumber: 8,
    unitTitle: 'Testes, Padrões & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l31-q1',
        question:
          'Qual sintaxe realiza o carregamento dinâmico (lazy loading) assíncrono de um módulo?',
        options: [
          'import("./modulo.js")',
          'require.async("./modulo.js")',
          'loadModule("./modulo.js")',
          'include("./modulo.js")',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l31-q2',
        question: 'Quantas exportações padrão (`export default`) um módulo pode ter?',
        options: ['Apenas uma', 'Até 5', 'Quantas desejar', 'Nenhuma, é proibido'],
        correctIndex: 0,
      },
      {
        id: 'js-l31-q3',
        question:
          'Qual atributo na tag `<script>` habilita o uso nativo de módulos ES no navegador?',
        options: ['type="module"', 'module="true"', 'mode="es6"', 'script="esm"'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 32,
    title: 'Design Patterns Essenciais',
    description: 'Implementação prática de Singleton, Factory, Observer e Pub/Sub.',
    unitNumber: 8,
    unitTitle: 'Testes, Padrões & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l32-q1',
        question:
          'Qual padrão de projeto garante que uma classe tenha apenas uma única instância em toda a aplicação?',
        options: ['Singleton', 'Factory', 'Observer', 'Adapter'],
        correctIndex: 0,
      },
      {
        id: 'js-l32-q2',
        question:
          'Qual padrão define uma dependência um-para-muitos onde alterações em um objeto notificam automaticamente seus dependentes?',
        options: ['Observer / Pub-Sub', 'Decorator', 'Facade', 'Builder'],
        correctIndex: 0,
      },
      {
        id: 'js-l32-q3',
        question: 'Qual é o objetivo do padrão Factory Method?',
        options: [
          'Encapsular e abstrair a criação de objetos sem especificar a classe exata a ser instanciada',
          'Garantir que um método seja síncrono',
          'Destruir objetos da memória',
          'Gerar testes automatizados',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 33,
    title: 'Testes Unitários & Asserções',
    description: 'Fundamentos de testes automatizados, asserções, mocks e cobertura de código.',
    unitNumber: 8,
    unitTitle: 'Testes, Padrões & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l33-q1',
        question: 'Qual é o objetivo principal de um teste unitário?',
        options: [
          'Testar a menor unidade testável de código (como uma função) de forma isolada',
          'Testar a aplicação inteira em produção',
          'Validar o layout CSS no navegador',
          'Medir o uso de GPU',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l33-q2',
        question: 'Para que serve um "Mock" ou "Spy" em testes automatizados?',
        options: [
          'Simular o comportamento de dependências externas (como chamadas de API ou banco de dados) de forma controlada',
          'Acelerar o download de pacotes npm',
          'Desativar o TypeScript',
          'Gerar documentação HTML',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l33-q3',
        question: 'O que preconiza o ciclo TDD (Test-Driven Development)?',
        options: [
          'Red (escrever teste que falha) -> Green (fazer passar) -> Refactor (refatorar)',
          'Code -> Deploy -> Test',
          'Design -> Test -> Release',
          'Document -> Test -> Code',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 34,
    title: 'Otimização & Performance',
    description: 'Debounce, throttle, memoization e prevenção de memory leaks.',
    unitNumber: 8,
    unitTitle: 'Testes, Padrões & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l34-q1',
        question: 'Qual é a diferença fundamental entre as técnicas de Debounce e Throttle?',
        options: [
          'Debounce adia a execução até que parem de ocorrer chamadas; Throttle limita a execução a no máximo uma vez a cada intervalo de tempo',
          'São sinônimos exatos',
          'Throttle é exclusivo para animações 3D',
          'Debounce roda apenas em background threads',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l34-q2',
        question: 'O que é a técnica de Memoization?',
        options: [
          'Armazenar em cache o resultado de cálculos pesados para argumentos idênticos a fim de acelerar execuções futuras',
          'Limpar a memória RAM do computador',
          'Gravar logs em arquivo',
          'Comprimir arquivos JavaScript',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l34-q3',
        question:
          'Qual é uma causa comum de Memory Leak em aplicações JavaScript de página única (SPA)?',
        options: [
          'Event listeners em elementos do DOM que são removidos da tela sem que o listener seja desregistrado',
          'Uso de const no lugar de let',
          'Declaração de muitas interfaces',
          'Uso de arrow functions',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 35,
    title: 'Projeto Final: Sistema Reativo',
    description: 'Consolidação prática de todos os conceitos da trilha em um ecossistema completo.',
    unitNumber: 8,
    unitTitle: 'Testes, Padrões & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'js-l35-q1',
        question:
          'Ao construir uma biblioteca de estado reativo como Signals, como o rastreamento automático de dependências é tipicamente implementado?',
        options: [
          'Usando closures e uma pilha de contexto ativo no momento da leitura do getter do signal',
          'Usando polling a cada 10ms',
          'Com setTimeout infinito',
          'Com eval() em tempo de execução',
        ],
        correctIndex: 0,
      },
      {
        id: 'js-l35-q2',
        question:
          'Qual API nativa intercepta operações fundamentais em objetos (como leitura, escrita e deleção de propriedades) para criar reatividade transparente?',
        options: ['Proxy & Reflect', 'Object.observe()', 'WatcherAPI', 'Object.intercept()'],
        correctIndex: 0,
      },
      {
        id: 'js-l35-q3',
        question: 'Qual é o papel do objeto nativo `Reflect` ao trabalhar com `Proxy`?',
        options: [
          'Fornecer métodos com a mesma assinatura das armadilhas (traps) do Proxy para repassar o comportamento padrão',
          'Criar efeitos 3D na tela',
          'Converter proxies em JSON',
          'Medir tempo de resposta de APIs',
        ],
        correctIndex: 0,
      },
    ],
  },
];
