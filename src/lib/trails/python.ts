import type { TrailLevel } from '../trailsData';

export const PYTHON_TRAIL: TrailLevel[] = [
  // ── SEÇÃO 1: Fundamentos & Sintaxe Python ──
  {
    levelNumber: 1,
    title: 'Variáveis & Tipos Primitivos',
    description: 'Tipagem dinâmica forte em Python: int, float, str e bool.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Python',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'py-l1-q1',
        question: 'Qual função embutida retorna o tipo de dado de uma variável em Python?',
        options: ['type()', 'typeof()', 'dtype()', 'classOf()'],
        correctIndex: 0,
      },
      {
        id: 'py-l1-q2',
        question: 'Qual é o resultado da divisão inteira `7 // 2` em Python?',
        options: ['3', '3.5', '4', '3.0'],
        correctIndex: 0,
      },
      {
        id: 'py-l1-q3',
        question: 'Qual operador calcula a exponenciação (potência) em Python?',
        options: ['**', '^', '^^', 'pow'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 2,
    title: 'F-Strings & Formatação',
    description: 'Interpolação de strings moderna com f-strings e métodos de texto.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Python',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'py-l2-q1',
        question: 'Qual prefixo literal é colocado antes das aspas para criar uma f-string?',
        options: ['f ou F', 's ou S', '$', '@'],
        correctIndex: 0,
      },
      {
        id: 'py-l2-q2',
        question: 'Como formatar um número decimal com 2 casas decimais em uma f-string?',
        options: ['f"{valor:.2f}"', 'f"{valor:2d}"', 'f"{valor%2}"', 'f"{valor.round(2)}"'],
        correctIndex: 0,
      },
      {
        id: 'py-l2-q3',
        question:
          'Qual método divide uma string em uma lista de substrings baseando-se em um delimitador?',
        options: ['split()', 'divide()', 'slice()', 'cut()'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 3,
    title: 'Operadores & Comparações',
    description: 'Operadores lógicos and/or/not, operador is vs == e encadeamento.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Python',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'py-l3-q1',
        question: 'Qual é a diferença entre os operadores `==` e `is` em Python?',
        options: [
          '`==` compara a igualdade de valores; `is` compara a identidade de memória dos objetos',
          '`is` compara valores; `==` compara memória',
          'Não há diferença',
          '`is` é usado apenas para números',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l3-q2',
        question: 'O Python permite comparações encadeadas como `1 < x < 10`?',
        options: [
          'Sim, é uma sintaxe válida e idiomática equivalente a `1 < x and x < 10`',
          'Não, gera erro de sintaxe',
          'Apenas no Python 2',
          'Apenas dentro de funções',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l3-q3',
        question: 'Qual operador lógico inverte o valor booleano de uma expressão em Python?',
        options: ['not', '!', '~', 'inv'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 4,
    title: 'Entrada, Saída & Conversão',
    description: 'Leitura com input(), escrita com print() e casting explícito.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Python',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'py-l4-q1',
        question: 'Qual é o tipo de dado retornado pela função `input()` por padrão?',
        options: ['str (string)', 'int', 'any', 'NoneType'],
        correctIndex: 0,
      },
      {
        id: 'py-l4-q2',
        question: 'Como converter uma string `"123"` para número inteiro?',
        options: ['int("123")', 'Integer("123")', 'to_int("123")', 'parseInt("123")'],
        correctIndex: 0,
      },
      {
        id: 'py-l4-q3',
        question: 'Como alterar o separador padrão entre itens na função `print()`?',
        options: [
          'Usando o parâmetro nomeado `sep=","`',
          'Usando o parâmetro `delimiter=","`',
          'Com `split=","`',
          'Com `end=","`',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 5,
    title: 'PEP 8 & Convenções de Código',
    description: 'Guia de estilo oficial: identação de 4 espaços, snake_case e docstrings.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Python',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'py-l5-q1',
        question:
          'Qual é o padrão de nomenclatura recomendado pela PEP 8 para variáveis e funções?',
        options: [
          'snake_case (letras minúsculas separadas por underline)',
          'camelCase',
          'PascalCase',
          'kebab-case',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l5-q2',
        question: 'Qual padrão é recomendado para nomes de Classes em Python?',
        options: [
          'PascalCase (ex: `ProcessadorDados`)',
          'snake_case',
          'SCREAMING_SNAKE_CASE',
          'camelCase',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l5-q3',
        question: 'Quantos espaços de identação por nível são recomendados pela PEP 8?',
        options: ['4 espaços', '2 espaços', '8 espaços', '1 tabulação livre'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 2: Controle de Fluxo & Estruturas ──
  {
    levelNumber: 6,
    title: 'Condicionais if, elif & else',
    description: 'Ramificação de fluxo e operador ternário condicional.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Estruturas',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'py-l6-q1',
        question: 'Qual é a palavra-chave usada para "else if" em Python?',
        options: ['elif', 'else if', 'elseif', 'elsif'],
        correctIndex: 0,
      },
      {
        id: 'py-l6-q2',
        question: 'Qual é a sintaxe da expressão condicional (operador ternário) em Python?',
        options: [
          'valor_se_verdade if condicao else valor_se_falso',
          'condicao ? valor_se_verdade : valor_se_falso',
          'if condicao: valor_se_verdade else valor_se_falso',
          'valor_se_verdade ? condicao',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l6-q3',
        question: 'Quais dos seguintes valores são avaliados como falsos (falsy) em uma condição?',
        options: [
          '0, None, "", [], {}, set()',
          'Qualquer número negativo',
          'A string "0"',
          'O número float 0.1',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 7,
    title: 'Laços de Repetição for & range',
    description: 'Iteração sobre sequências, função range() e enumerate().',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Estruturas',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'py-l7-q1',
        question: 'Quais números são gerados por `range(1, 6, 2)`?',
        options: ['1, 3, 5', '1, 2, 3, 4, 5, 6', '2, 4, 6', '1, 3'],
        correctIndex: 0,
      },
      {
        id: 'py-l7-q2',
        question:
          'Qual função embutida gera pares de `(índice, elemento)` ao iterar sobre uma lista?',
        options: ['enumerate()', 'zip()', 'indexed()', 'items()'],
        correctIndex: 0,
      },
      {
        id: 'py-l7-q3',
        question:
          'Qual função combina múltiplos iteráveis elemento a elemento em tuplas paralelas?',
        options: ['zip()', 'combine()', 'merge()', 'pair()'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 8,
    title: 'While Loops & Break / Continue',
    description: 'Laços baseados em condições, cláusula else em loops e interrupções.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Estruturas',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'py-l8-q1',
        question:
          'Quando a cláusula `else` anexada a um laço `for` ou `while` é executada em Python?',
        options: [
          'Apenas quando o laço termina naturalmente, sem ter sido interrompido por um `break`',
          'Sempre que o laço falha',
          'Apenas quando há erro',
          'Nunca',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l8-q2',
        question:
          'Qual comando pula o restante do bloco da iteração atual e avança para a próxima?',
        options: ['continue', 'skip', 'pass', 'next'],
        correctIndex: 0,
      },
      {
        id: 'py-l8-q3',
        question: 'O que o comando `pass` faz quando executado em um bloco?',
        options: [
          'É uma operação nula (no-op) que serve como espaço reservado sintático',
          'Pula para a próxima função',
          'Retorna True',
          'Fecha o programa',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 9,
    title: 'Match Case (Structural Pattern Matching)',
    description: 'Recurso introduzido no Python 3.10 para casamento de padrões estruturais.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Estruturas',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'py-l9-q1',
        question:
          'Qual par de palavras-chave define o Structural Pattern Matching em Python 3.10+?',
        options: ['match e case', 'switch e case', 'select e when', 'choose e case'],
        correctIndex: 0,
      },
      {
        id: 'py-l9-q2',
        question: 'Qual símbolo atua como padrão curinga (wildcard padrão / default) no `case`?',
        options: ['_ (underline)', '*', 'default', '...'],
        correctIndex: 0,
      },
      {
        id: 'py-l9-q3',
        question:
          'É possível adicionar uma condição de guarda em um case (ex: `case [x, y] if x > 0:`)?',
        options: [
          'Sim, usando a cláusula `if` após o padrão',
          'Não, é proibido',
          'Apenas com números inteiros',
          'Apenas dentro de classes',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 3: Funções & Programação Funcional ──
  {
    levelNumber: 10,
    title: 'Definição de Funções & Retorno',
    description: 'Declaração com def, múltiplos retornos como tupla e docstrings.',
    unitNumber: 3,
    unitTitle: 'Funções & Programação Funcional',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'py-l10-q1',
        question: 'Como retornar múltiplos valores em uma função Python (ex: `return x, y`)?',
        options: [
          'Os valores são empacotados e retornados automaticamente como uma tupla',
          'É gerado um erro de sintaxe',
          'Apenas o último valor é retornado',
          'É retornado um dicionário',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l10-q2',
        question: 'O que uma função sem declaração de `return` retorna ao ser executada até o fim?',
        options: ['None', 'False', '0', 'undefined'],
        correctIndex: 0,
      },
      {
        id: 'py-l10-q3',
        question: 'O que são Docstrings em funções Python?',
        options: [
          'Strings literais delimitadas por três aspas na primeira linha do corpo da função usadas para documentação e acessíveis via `fn.__doc__`',
          'Comentários com #',
          'Anotações de tipo',
          'Logs de compilação',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 11,
    title: 'Parâmetros *args & **kwargs',
    description:
      'Empacotamento e desempacotamento de argumentos posicionais e nomeados arbitrários.',
    unitNumber: 3,
    unitTitle: 'Funções & Programação Funcional',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'py-l11-q1',
        question: 'Em que tipo de estrutura os argumentos passados para `*args` são empacotados?',
        options: [
          'Em uma tupla (tuple)',
          'Em uma lista (list)',
          'Em um dicionário (dict)',
          'Em um conjunto (set)',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l11-q2',
        question:
          'Em que tipo de estrutura os argumentos nomeados passados para `**kwargs` são empacotados?',
        options: [
          'Em um dicionário (dict)',
          'Em uma tupla',
          'Em uma lista',
          'Em um objeto anônimo',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l11-q3',
        question:
          'Por que deve-se evitar usar objetos mutáveis (como listas `[]` ou dicts `{}`) como valor padrão de parâmetros em funções?',
        options: [
          'Porque o valor padrão é avaliado apenas uma vez na definição da função e é compartilhado entre todas as chamadas subsequentes',
          'Porque causa erro de compilação',
          'Porque o Python apaga a lista',
          'Porque a função se torna assíncrona',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 12,
    title: 'Escopo LEGB & Closures',
    description:
      'Resolução de escopo Local, Enclosing, Global, Built-in e palavras global/nonlocal.',
    unitNumber: 3,
    unitTitle: 'Funções & Programação Funcional',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'py-l12-q1',
        question: 'Qual é a ordem de resolução de escopos (regra LEGB) no Python?',
        options: [
          'Local -> Enclosing -> Global -> Built-in',
          'Global -> Local -> Built-in -> Enclosing',
          'Built-in -> Global -> Enclosing -> Local',
          'Local -> Global -> Enclosing',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l12-q2',
        question:
          'Qual palavra-chave permite modificar uma variável do escopo envolvente (não-global) em uma função aninhada (Closure)?',
        options: ['nonlocal', 'global', 'outer', 'parent'],
        correctIndex: 0,
      },
      {
        id: 'py-l12-q3',
        question:
          'Qual palavra-chave declara que uma atribuição dentro de uma função deve modificar a variável no escopo do módulo raiz?',
        options: ['global', 'public', 'root', 'extern'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 13,
    title: 'Lambdas, Map & Filter',
    description: 'Funções anônimas de uma linha e utilitários funcionais.',
    unitNumber: 3,
    unitTitle: 'Funções & Programação Funcional',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'py-l13-q1',
        question: 'Como definir uma função lambda anônima que recebe `x` e retorna seu dobro?',
        options: [
          'lambda x: x * 2',
          'def (x) => x * 2',
          'fn(x) -> x * 2',
          'lambda(x) { return x * 2 }',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l13-q2',
        question: 'Qual função do módulo `functools` realiza a redução cumulativa de uma coleção?',
        options: [
          'functools.reduce()',
          'functools.accumulate()',
          'functools.fold()',
          'functools.aggregate()',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l13-q3',
        question: 'O que as funções `map()` e `filter()` retornam no Python 3?',
        options: [
          'Iteradores preuiçosos (lazy iterators), que devem ser convertidos explicitamente (ex: `list()`) caso se queira uma lista',
          'Listas prontas na memória',
          'Tuplas imutáveis',
          'Geradores infinitos',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 4: Estruturas de Dados & Coleções ──
  {
    levelNumber: 14,
    title: 'Listas & List Comprehensions',
    description: 'Manipulação de listas mutáveis e sintaxe declarativa de compreensão.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'py-l14-q1',
        question:
          'Qual List Comprehension cria uma lista com o quadrado dos números pares de 0 a 9?',
        options: [
          '[x**2 for x in range(10) if x % 2 == 0]',
          '[x**2 if x % 2 == 0 for x in range(10)]',
          '[for x in range(10): x**2 if x % 2 == 0]',
          '[x**2 where x % 2 == 0 in range(10)]',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l14-q2',
        question: 'Qual método adiciona um elemento ao final de uma lista mutando-a?',
        options: ['append()', 'push()', 'add()', 'insert_last()'],
        correctIndex: 0,
      },
      {
        id: 'py-l14-q3',
        question: 'Como obter uma fatia invertida de uma lista `lst` usando fatiamento (slicing)?',
        options: ['lst[::-1]', 'lst[-1:]', 'lst.reverse_copy()', 'lst[0:-1:-1]'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 15,
    title: 'Tuplas & Imutabilidade',
    description: 'Propriedades de tuplas, desempacotamento e namedtuples.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'py-l15-q1',
        question: 'Como criar uma tupla de apenas um elemento com o valor 42?',
        options: ['(42,)', '(42)', 'tuple(42)', '[42,]'],
        correctIndex: 0,
      },
      {
        id: 'py-l15-q2',
        question: 'Tuplas podem ser usadas como chaves em dicionários Python?',
        options: [
          'Sim, desde que contenham apenas elementos imutáveis (hashable)',
          'Não, chaves devem ser sempre strings',
          'Apenas se tiverem tamanho 1',
          'Apenas com inteiros',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l15-q3',
        question:
          'Qual classe do módulo `collections` permite acessar campos de uma tupla por nome?',
        options: ['namedtuple', 'TypedTuple', 'Struct', 'Record'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 16,
    title: 'Dicionários & Dict Comprehensions',
    description: 'Pares chave-valor, métodos get/setdefault/items e compreensão de dicts.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'py-l16-q1',
        question:
          'Qual método busca uma chave no dicionário retornando um valor padrão sem lançar KeyError caso a chave não exista?',
        options: [
          'd.get(chave, valor_padrao)',
          'd.find(chave)',
          'd.fetch(chave)',
          'd.lookup(chave)',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l16-q2',
        question:
          'Qual operador introduzido no Python 3.9 realiza a união de dois dicionários (`d1 | d2`)?',
        options: ['| (pipe de união)', '+ (soma)', '& (interseção)', '||'],
        correctIndex: 0,
      },
      {
        id: 'py-l16-q3',
        question: 'Como inverter chaves e valores de um dicionário `d` com Dict Comprehension?',
        options: [
          '{v: k for k, v in d.items()}',
          '{k: v for v, k in d.items()}',
          'd.invert()',
          '{v: k in d}',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 17,
    title: 'Sets & Operações de Conjunto',
    description: 'Coleções de elementos únicos, união, interseção e diferença simétrica.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'py-l17-q1',
        question:
          'Qual operador calcula a INTERSEÇÃO entre dois conjuntos (elementos presentes em ambos)?',
        options: ['&', '|', '-', '^'],
        correctIndex: 0,
      },
      {
        id: 'py-l17-q2',
        question: 'Como inicializar um conjunto vazio em Python?',
        options: ['set()', '{} (isso cria um dicionário vazio)', 'Set[]', '()'],
        correctIndex: 0,
      },
      {
        id: 'py-l17-q3',
        question:
          'Qual é a versão imutável de um `set` que pode ser usada como chave de dicionário?',
        options: ['frozenset', 'const_set', 'immutable_set', 'static_set'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 18,
    title: 'Módulo Collections Avançado',
    description: 'Uso de Counter, defaultdict, deque e OrderedDict.',
    unitNumber: 4,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'py-l18-q1',
        question:
          'Qual estrutura de `collections` implementa uma fila de ponta dupla com operações de append e pop O(1) em ambas as extremidades?',
        options: ['deque', 'Queue', 'DoubleList', 'StackQueue'],
        correctIndex: 0,
      },
      {
        id: 'py-l18-q2',
        question:
          'Qual estrutura inicializa automaticamente valores para chaves inexistentes usando uma fábrica (ex: `int`, `list`)?',
        options: ['defaultdict', 'autodict', 'SafeDict', 'FactoryDict'],
        correctIndex: 0,
      },
      {
        id: 'py-l18-q3',
        question:
          'Qual classe conta a frequência de elementos de um iterável e fornece o método `most_common()`?',
        options: ['Counter', 'Frequency', 'Tally', 'Histogram'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 5: Orientação a Objetos em Python ──
  {
    levelNumber: 19,
    title: 'Classes & O Construtor __init__',
    description: 'Definição de classes, instanciação e o papel explícito do parâmetro self.',
    unitNumber: 5,
    unitTitle: 'Orientação a Objetos em Python',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l19-q1',
        question: 'Qual é o papel do primeiro parâmetro `self` nos métodos de instância?',
        options: [
          'Representa explicitamente a referência à instância atual do objeto sendo manipulada',
          'É uma palavra-chave reservada do sistema',
          'É o protótipo da classe',
          'É um ponteiro nulo',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l19-q2',
        question:
          'Qual método dunder é o inicializador de atributos da instância após sua criação?',
        options: ['__init__()', '__new__()', '__construct__()', '__build__()'],
        correctIndex: 0,
      },
      {
        id: 'py-l19-q3',
        question:
          'Qual método dunder é responsável pela ALOCAÇÃO e criação real da nova instância na memória?',
        options: ['__new__()', '__init__()', '__create__()', '__alloc__()'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 20,
    title: 'Métodos Mágicos (Dunder Methods)',
    description: 'Sobrecarga de operadores e protocolos: __str__, __repr__, __len__ e __getitem__.',
    unitNumber: 5,
    unitTitle: 'Orientação a Objetos em Python',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l20-q1',
        question: 'Qual é a diferença de propósito entre os métodos `__str__` e `__repr__`?',
        options: [
          '`__str__` foca em uma representação legível para humanos; `__repr__` deve ser inequívoca e útil para desenvolvedores/debugging',
          '`__str__` é para números; `__repr__` é para strings',
          'Não há diferença',
          '`__repr__` é exclusivo de testes',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l20-q2',
        question:
          'Qual método mágico permite que uma classe responda à função embutida `len(obj)`?',
        options: ['__len__()', '__size__()', '__count__()', '__length__()'],
        correctIndex: 0,
      },
      {
        id: 'py-l20-q3',
        question:
          'Qual método mágico permite indexar uma instância como uma lista ou dict (`obj[chave]`)?',
        options: ['__getitem__()', '__index__()', '__get__()', '__fetch__()'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 21,
    title: 'Herança, Super & MRO',
    description: 'Herança múltipla, função super() e Method Resolution Order (MRO).',
    unitNumber: 5,
    unitTitle: 'Orientação a Objetos em Python',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l21-q1',
        question: 'Como chamar o construtor da classe base (pai) a partir de uma classe filha?',
        options: [
          'super().__init__(args)',
          'parent.__init__(self, args)',
          'BaseClass.call(self)',
          'self.super(args)',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l21-q2',
        question: 'O que é o MRO (Method Resolution Order) em Python?',
        options: [
          'A ordem algorítmica (C3 Linearization) em que as classes são percorridas para resolver atributos e métodos na herança múltipla',
          'A fila de microtarefas do GIL',
          'A prioridade de garbage collection',
          'A ordem alfabética dos métodos',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l21-q3',
        question: 'Como inspecionar a ordem do MRO de uma classe `C`?',
        options: ['C.__mro__ ou C.mro()', 'C.order()', 'mro(C)', 'inspect.mro(C)'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 22,
    title: 'Propriedades, @classmethod & Dataclasses',
    description: 'Decorador @property, @staticmethod, @classmethod e o módulo dataclasses.',
    unitNumber: 5,
    unitTitle: 'Orientação a Objetos em Python',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l22-q1',
        question:
          'Qual decorador transforma um método de leitura em um getter que pode ser acessado como atributo sem parênteses?',
        options: ['@property', '@getter', '@attribute', '@field'],
        correctIndex: 0,
      },
      {
        id: 'py-l22-q2',
        question: 'Qual é o primeiro parâmetro recebido por um método decorado com `@classmethod`?',
        options: ['cls (a própria classe)', 'self (a instância)', 'ctx (o contexto)', 'None'],
        correctIndex: 0,
      },
      {
        id: 'py-l22-q3',
        question:
          'Qual é a principal vantagem do decorador `@dataclass` introduzido no Python 3.7?',
        options: [
          'Gera automaticamente métodos como `__init__`, `__repr__` e `__eq__` com base nas anotações de tipo dos campos',
          'Converte a classe para C++',
          'Torna os atributos imutáveis em runtime',
          'Cria endpoints de API',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 6: Tratamento de Exceções & Arquivos ──
  {
    levelNumber: 23,
    title: 'Try, Except, Else & Finally',
    description: 'Manejo defensivo de exceções e a cláusula else.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Exceções & Arquivos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l23-q1',
        question: 'Quando o bloco `else` de uma estrutura try/except/else/finally é executado?',
        options: [
          'Apenas quando NENHUMA exceção foi lançada no bloco try',
          'Apenas quando ocorre exceção',
          'Sempre',
          'Nunca',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l23-q2',
        question: 'Qual palavra-chave é utilizada para lançar uma exceção explicitamente?',
        options: ['raise', 'throw', 'error', 'panic'],
        correctIndex: 0,
      },
      {
        id: 'py-l23-q3',
        question: 'Como capturar múltiplas exceções diferentes em um único bloco `except`?',
        options: [
          'except (ValueError, TypeError) as e:',
          'except ValueError or TypeError:',
          'except ValueError, TypeError:',
          'except [ValueError, TypeError]:',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 24,
    title: 'Exceções Customizadas & Exception Groups',
    description: 'Criação de classes de erro derivadas de Exception e novidades do Python 3.11.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Exceções & Arquivos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l24-q1',
        question: 'De qual classe base as exceções customizadas de uma aplicação devem herdar?',
        options: ['Exception', 'BaseException', 'Error', 'SystemExit'],
        correctIndex: 0,
      },
      {
        id: 'py-l24-q2',
        question:
          'Qual novidade do Python 3.11 permite tratar múltiplos erros simultâneos (ex: tarefas concorrentes)?',
        options: ['ExceptionGroup e a sintaxe `except*`', 'MultiCatch', 'try_all', 'ParallelError'],
        correctIndex: 0,
      },
      {
        id: 'py-l24-q3',
        question:
          'Como encadear uma exceção preservando o rastreamento da causa original (Exception Chaining)?',
        options: [
          'raise NovaExcecao("Erro") from erro_original',
          'raise NovaExcecao("Erro", erro_original)',
          'raise NovaExcecao.with_cause(erro_original)',
          'NovaExcecao.chain(erro_original)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 25,
    title: 'Gerenciadores de Contexto (with)',
    description: 'Uso da declaração with e protocolo __enter__ e __exit__.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Exceções & Arquivos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l25-q1',
        question:
          'Por que a declaração `with open("arquivo.txt") as f:` é a forma recomendada de manipular arquivos?',
        options: [
          'Garante que o arquivo seja fechado automaticamente ao sair do bloco, mesmo que ocorram exceções',
          'Acelera a leitura em 10x',
          'Criptografa o arquivo',
          'Evita uso de memória',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l25-q2',
        question:
          'Quais dois métodos dunder um objeto deve implementar para ser usado como Gerenciador de Contexto?',
        options: [
          '`__enter__()` e `__exit__()`',
          '`__open__()` e `__close__()`',
          '`__start__()` e `__stop__()`',
          '`__init__()` e `__del__()`',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l25-q3',
        question:
          'Qual decorador do módulo `contextlib` transforma uma função geradora em um context manager simples?',
        options: ['@contextmanager', '@with_block', '@context_handler', '@manager'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 26,
    title: 'Pathlib & Manipulação de Arquivos',
    description: 'Uso moderno do módulo pathlib.Path e serialização JSON.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Exceções & Arquivos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l26-q1',
        question:
          'Qual é a forma moderna e orientada a objetos de manipular caminhos de arquivos em Python?',
        options: [
          'from pathlib import Path',
          'import os.path',
          'import file_system',
          'import glob',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l26-q2',
        question: 'Como concatenar subpastas em um objeto `Path` usando sobrecarga de operador?',
        options: [
          'Path("/home") / "usuario" / "docs"',
          'Path("/home") + "usuario"',
          'Path.join("/home", "usuario")',
          'Path.concat()',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l26-q3',
        question:
          'Qual função do módulo `json` carrega dados diretamente a partir de um arquivo aberto?',
        options: ['json.load(f)', 'json.loads(f)', 'json.read(f)', 'json.parse(f)'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 7: Iteradores, Geradores & Asyncio ──
  {
    levelNumber: 27,
    title: 'Iteradores & Protocolo de Iteração',
    description: 'Métodos __iter__ e __next__, StopIteration e iteráveis customizados.',
    unitNumber: 7,
    unitTitle: 'Iteradores, Geradores & Asyncio',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l27-q1',
        question:
          'Qual exceção sinaliza para os laços `for` que um iterador não possui mais elementos?',
        options: ['StopIteration', 'IndexError', 'EndLoopError', 'IterationComplete'],
        correctIndex: 0,
      },
      {
        id: 'py-l27-q2',
        question: 'Qual função embutida obtém o próximo item de um iterador?',
        options: ['next()', 'advance()', 'step()', 'fetch()'],
        correctIndex: 0,
      },
      {
        id: 'py-l27-q3',
        question: 'O que a função `iter(objeto)` invoca internamente no objeto?',
        options: [
          'objeto.__iter__()',
          'objeto.__next__()',
          'objeto.__list__()',
          'objeto.__start__()',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 28,
    title: 'Geradores & A palavra-chave yield',
    description: 'Funções geradoras, yield, economia de memória e Generator Expressions.',
    unitNumber: 7,
    unitTitle: 'Iteradores, Geradores & Asyncio',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l28-q1',
        question:
          'Qual é a principal vantagem de uma função geradora com `yield` sobre uma que retorna uma lista completa?',
        options: [
          'Gera os itens sob demanda (lazy evaluation) economizando memória RAM em grandes conjuntos de dados',
          'Executa mais rápido em GPU',
          'Pode ser salva em banco de dados automaticamente',
          'Não permite erros',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l28-q2',
        question: 'Como delegar a iteração para outro gerador secundário de forma concisa?',
        options: [
          'yield from sub_gerador()',
          'yield sub_gerador()',
          'delegate sub_gerador()',
          'return from sub_gerador()',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l28-q3',
        question: 'Qual sintaxe define uma Generator Expression (compreensão de gerador)?',
        options: [
          '(x * 2 for x in range(1000))',
          '[x * 2 for x in range(1000)]',
          '{x * 2 for x in range(1000)}',
          'gen x * 2 in range(1000)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 29,
    title: 'Decoradores de Função & Classe',
    description: 'Funções que recebem funções, functools.wraps e decoradores com argumentos.',
    unitNumber: 7,
    unitTitle: 'Iteradores, Geradores & Asyncio',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l29-q1',
        question: 'Qual caractere prefixa a aplicação de um decorador sobre uma função em Python?',
        options: ['@', '#', '$', '&'],
        correctIndex: 0,
      },
      {
        id: 'py-l29-q2',
        question:
          'Por que é uma boa prática aplicar `@functools.wraps(fn)` dentro da função wrapper de um decorador?',
        options: [
          'Para preservar o nome original da função, docstring e metadados (`__name__`, `__doc__`)',
          'Para compilar o código em C',
          'Para desativar o garbage collector',
          'Para rodar em thread separada',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l29-q3',
        question: 'A sintaxe `@decorador def func(): pass` é syntactic sugar para:',
        options: [
          'func = decorador(func)',
          'decorador.apply(func)',
          'func.set_decorator(decorador)',
          'decorador.wrap(func)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 30,
    title: 'Programação Assíncrona com Asyncio',
    description: 'Event loop, corrotinas async/await, asyncio.gather e tasks concorrentes.',
    unitNumber: 7,
    unitTitle: 'Iteradores, Geradores & Asyncio',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l30-q1',
        question:
          'Como executar a corrotina principal de uma aplicação assíncrona a partir do ponto de entrada síncrono?',
        options: [
          'asyncio.run(main())',
          'main().start()',
          'asyncio.start_loop(main)',
          'await main()',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l30-q2',
        question:
          'Qual função do `asyncio` executa múltiplas corrotinas concorrentemente e coleta seus resultados em ordem?',
        options: [
          'asyncio.gather(*corrotinas)',
          'asyncio.all(*corrotinas)',
          'asyncio.parallel(*corrotinas)',
          'asyncio.collect(*corrotinas)',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l30-q3',
        question:
          'Por que chamadas síncronas bloqueantes (como `time.sleep()`) devem ser evitadas dentro de corrotinas `async`?',
        options: [
          'Porque bloqueiam todo o Event Loop, congelando a execução de todas as outras tarefas assíncronas concorrentes',
          'Porque geram um SyntaxError',
          'Porque fecham o terminal',
          'Porque gastam memória',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 8: Padrões, Testes & Engenharia ──
  {
    levelNumber: 31,
    title: 'Type Hints & Mypy',
    description:
      'Anotações estáticas de tipo (PEP 484), módulo typing e verificação estática com mypy.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Engenharia',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l31-q1',
        question:
          'Como anotar que uma função recebe uma lista de strings e pode retornar um inteiro ou None (Python 3.10+)?',
        options: [
          'def processar(itens: list[str]) -> int | None:',
          'def processar(itens: List(str)) -> (int, None):',
          'def processar(itens: [str]): int or None:',
          'def processar(itens: str[]): int?',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l31-q2',
        question:
          'O interpretador padrão do Python (CPython) valida e impõe as anotações de tipo em tempo de execução?',
        options: [
          'Não, os type hints são ignorados em runtime pelo CPython e servem para ferramentas estáticas (IDE, mypy)',
          'Sim, lança TypeError em qualquer incoerência',
          'Apenas em modo de debug',
          'Apenas com números',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l31-q3',
        question:
          'Qual ferramenta de linha de comando é o checador estático de tipos padrão no ecossistema Python?',
        options: ['mypy', 'pytest', 'black', 'flake8'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 32,
    title: 'Testes com Pytest & Fixtures',
    description:
      'Escrita de testes com pytest, asserts idiomáticos e injeção de fixtures com @pytest.fixture.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Engenharia',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l32-q1',
        question: 'Qual instrução nativa do Python é utilizada para asserções no `pytest`?',
        options: [
          'assert condicao',
          'self.assertEqual()',
          'expect(condicao).toBe()',
          'pytest.check(condicao)',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l32-q2',
        question: 'Para que serve o decorador `@pytest.fixture`?',
        options: [
          'Criar funções utilitárias reutilizáveis que fornecem dados ou conexões configuradas para as funções de teste',
          'Ignorar testes que falham',
          'Medir cobertura de código',
          'Compilar o teste',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l32-q3',
        question: 'Como testar se uma função lançou a exceção `ValueError` esperada no pytest?',
        options: [
          'with pytest.raises(ValueError): funcao()',
          'assert funcao() == ValueError',
          'try: funcao() except ValueError: pass',
          'pytest.expect_error(ValueError, funcao)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 33,
    title: 'Padrões de Projeto em Python',
    description: 'Implementação idiomática de Singleton, Factory, Strategy e Observer.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Engenharia',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l33-q1',
        question:
          'Qual é a forma mais simples e idiomática (Pythonic) de criar um Singleton em Python?',
        options: [
          'Usando a importação de um módulo Python (módulos são inicializados apenas uma vez e cacheados em `sys.modules`)',
          'Criando uma metaclasse complexa',
          'Sobrescrevendo o `__new__` em todas as classes',
          'Com variáveis globais em C',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l33-q2',
        question:
          'Qual módulo nativo fornece a classe `ABC` e o decorador `@abstractmethod` para classes base abstratas?',
        options: ['abc', 'abstract', 'typing', 'interfaces'],
        correctIndex: 0,
      },
      {
        id: 'py-l33-q3',
        question: 'O que o padrão Strategy permite fazer?',
        options: [
          'Definir uma família de algoritmos intercambiáveis encapsulados em funções ou classes separadas',
          'Criar logs no disco',
          'Proteger contra ataques SQL Injection',
          'Paralelizar processos',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 34,
    title: 'GIL & Concorrência (Threading vs Multiprocessing)',
    description: 'Global Interpreter Lock, CPU-bound vs I/O-bound e concurrent.futures.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Engenharia',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l34-q1',
        question: 'O que é o GIL (Global Interpreter Lock) no CPython?',
        options: [
          'Um mutex que impede que múltiplas threads nativas executem bytecodes Python simultaneamente em um mesmo processo',
          'Uma trava de segurança do banco de dados',
          'Um sistema de criptografia',
          'O gerenciador de pacotes',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l34-q2',
        question:
          'Para tarefas com uso intensivo de CPU (CPU-bound) que precisam de paralelismo real em múltiplos núcleos, qual módulo deve ser usado?',
        options: ['multiprocessing (ou ProcessPoolExecutor)', 'threading', 'asyncio', 'time'],
        correctIndex: 0,
      },
      {
        id: 'py-l34-q3',
        question:
          'Para tarefas com gargalo de rede/disco (I/O-bound), qual modelo oferece alta eficiência sem sobrecarga de múltiplos processos pesados?',
        options: [
          'asyncio (ou threading)',
          'multiprocessing exclusivamente',
          'Subprocessos C++',
          'Compilação Cython',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 35,
    title: 'Projeto Final: API Assíncrona de Alta Performance',
    description:
      'Consolidação completa: FastAPI/asyncio, Pydantic, tipagem estrita e arquitetura limpa.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Engenharia',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'py-l35-q1',
        question:
          'Como frameworks modernos como FastAPI e Pydantic realizam validação e serialização automática de dados?',
        options: [
          'Inspecionando os Type Hints das funções e classes BaseModel em tempo de inicialização',
          'Usando comentários no código',
          'Lendo arquivos XML',
          'Com polling contínuo',
        ],
        correctIndex: 0,
      },
      {
        id: 'py-l35-q2',
        question:
          'Qual é o servidor ASGI de alta performance padrão amplamente utilizado para hospedar aplicações assíncronas Python?',
        options: ['uvicorn', 'gunicorn síncrono', 'apache mod_php', 'nginx puro'],
        correctIndex: 0,
      },
      {
        id: 'py-l35-q3',
        question:
          'Qual prática garante que a aplicação seja robusta, manutenível e escalável em produção?',
        options: [
          'Separação clara em camadas (Controllers, Services, Repositories), cobertura de testes com pytest e tipagem estrita com mypy',
          'Colocar todo o código em um único arquivo main.py',
          'Desativar logs para economizar disco',
          'Ignorar tratamento de exceções',
        ],
        correctIndex: 0,
      },
    ],
  },
];
