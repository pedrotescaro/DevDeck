import type { TrailLevel } from '../trailsData';

export const TS_TRAIL: TrailLevel[] = [
  // ── SEÇÃO 1: Fundamentos da Tipagem Estática ──
  {
    levelNumber: 1,
    title: 'Anotações & Inferência',
    description: 'Tipagem explícita vs inferência automática do compilador TypeScript.',
    unitNumber: 1,
    unitTitle: 'Fundamentos da Tipagem Estática',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'ts-l1-q1',
        question:
          'Qual caractere é usado para anotar o tipo estático de uma variável em TypeScript?',
        options: [': (dois pontos)', '= (igual)', '-> (seta)', '# (hashtag)'],
        correctIndex: 0,
      },
      {
        id: 'ts-l1-q2',
        question: 'O que é a inferência de tipos (Type Inference) no TypeScript?',
        options: [
          'A capacidade do compilador de deduzir o tipo automaticamente a partir do valor inicial',
          'Uma ferramenta para remover tipos em produção',
          'Um conversor de JSON para classes',
          'A obrigatoriedade de anotar tipos em todas as linhas',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l1-q3',
        question: 'Qual tipo representa um valor primitivo textual em TypeScript?',
        options: ['string', 'String', 'text', 'char'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 2,
    title: 'Any, Unknown & Never',
    description: 'Diferenças de segurança entre os tipos especiais any, unknown e never.',
    unitNumber: 1,
    unitTitle: 'Fundamentos da Tipagem Estática',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'ts-l2-q1',
        question: 'Por que `unknown` é considerado mais seguro do que `any`?',
        options: [
          'Porque exige verificação de tipo (type narrowing) antes de realizar operações no valor',
          'Porque aceita apenas números',
          'Porque roda mais rápido em produção',
          'Porque não permite reatribuição',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l2-q2',
        question:
          'Qual tipo representa valores que NUNCA ocorrem, como uma função que sempre lança exceção?',
        options: ['void', 'never', 'undefined', 'null'],
        correctIndex: 1,
      },
      {
        id: 'ts-l2-q3',
        question: 'Qual é o tipo de retorno de uma função que não retorna nenhum valor explicito?',
        options: ['void', 'never', 'null', 'empty'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 3,
    title: 'Union & Intersection Types',
    description: 'Composição de tipos flexíveis com operador de união (|) e interseção (&).',
    unitNumber: 1,
    unitTitle: 'Fundamentos da Tipagem Estática',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'ts-l3-q1',
        question: 'Qual operador define um Union Type (valor que pode ser de um tipo OU de outro)?',
        options: ['| (pipe)', '& (e comercial)', '|| (ou lógico)', '^ (circunflexo)'],
        correctIndex: 0,
      },
      {
        id: 'ts-l3-q2',
        question:
          'Qual operador combina múltiplos tipos em um único tipo que deve satisfazer TODOS os membros (Intersection)?',
        options: ['&', '|', '&&', '+'],
        correctIndex: 0,
      },
      {
        id: 'ts-l3-q3',
        question: 'O que é um Discriminated Union (União Discriminada)?',
        options: [
          'Um padrão onde cada tipo da união compartilha uma propriedade literal comum usada como tag identificadora',
          'Uma união que não compila',
          'Um array com múltiplos tipos',
          'Uma função com tipos genéricos',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 4,
    title: 'Tuplas & Arrays Tipados',
    description: 'Arrays homogêneos, heterogêneos e tuplas de tamanho e tipos fixos.',
    unitNumber: 1,
    unitTitle: 'Fundamentos da Tipagem Estática',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'ts-l4-q1',
        question: 'Como tipar uma tupla que contém exatamente uma string seguida de um número?',
        options: [
          '[string, number]',
          'Array<string | number>',
          '(string, number)',
          '{0: string, 1: number}',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l4-q2',
        question:
          'Como definir um array de apenas leitura (readonly) que não permite mutações como push()?',
        options: [
          'readonly number[] ou ReadonlyArray<number>',
          'const number[]',
          'immutable number[]',
          'final number[]',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l4-q3',
        question: 'Como definir elementos opcionais no final de uma tupla TypeScript?',
        options: [
          '[string, number?]',
          '[string, optional number]',
          '[string, number | undefined]',
          '[string, ?number]',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 5,
    title: 'Enums & Const Enums',
    description: 'Enumerações numéricas, de string e a otimização de const enums.',
    unitNumber: 1,
    unitTitle: 'Fundamentos da Tipagem Estática',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'ts-l5-q1',
        question: 'Qual é o benefício de usar um `const enum` em relação a um `enum` tradicional?',
        options: [
          'O compilador substitui os usos pelos valores literais inline, sem gerar código JavaScript extra no bundle',
          'Permite valores mutáveis em tempo de execução',
          'Aceita qualquer tipo como chave',
          'Não precisa ser compilado',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l5-q2',
        question:
          'Qual alternativa é frequentemente preferida ao uso de enums na comunidade TypeScript moderna?',
        options: [
          'União de tipos literais de string (ex: `type Status = "ativo" | "inativo"`)',
          'Números mágicos',
          'Objetos globais sem tipagem',
          'Classes abstratas',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l5-q3',
        question:
          'Por padrão, qual é o valor inicial atribuído ao primeiro membro de um enum numérico sem valor explícito?',
        options: ['0', '1', '-1', 'undefined'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 2: Interfaces & Type Aliases ──
  {
    levelNumber: 6,
    title: 'Interfaces & Propriedades',
    description: 'Contratos estruturais de objetos, propriedades opcionais e readonly.',
    unitNumber: 2,
    unitTitle: 'Interfaces & Type Aliases',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'ts-l6-q1',
        question: 'Como declarar uma propriedade como opcional em uma interface?',
        options: [
          'nome?: string',
          'nome: optional string',
          'optional nome: string',
          'nome: string | null',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l6-q2',
        question:
          'Qual modificador impede que uma propriedade de uma interface seja reatribuída após a criação do objeto?',
        options: ['readonly', 'const', 'immutable', 'static'],
        correctIndex: 0,
      },
      {
        id: 'ts-l6-q3',
        question: 'O que é o "Duck Typing" ou "Structural Typing" adotado pelo TypeScript?',
        options: [
          'A verificação de tipos é baseada na forma/estrutura dos dados, não na declaração explícita de pertencimento',
          'O uso obrigatório de classes para todos os dados',
          'A proibição de tipos primitivos',
          'A conversão de patos em cisnes',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 7,
    title: 'Interfaces vs Type Aliases',
    description: 'Diferenças de merge de declarações, tipos primitivos e extensibilidade.',
    unitNumber: 2,
    unitTitle: 'Interfaces & Type Aliases',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'ts-l7-q1',
        question: 'O que é o recurso de "Declaration Merging" suportado por interfaces?',
        options: [
          'Declarar a mesma interface múltiplas vezes mescla automaticamente seus campos em uma só',
          'Mesclar arquivos TypeScript no webpack',
          'Combinar tipos primitivos em um array',
          'Transformar interfaces em classes',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l7-q2',
        question:
          'Qual capacidade é exclusiva de `type` e não pode ser feita diretamente com `interface`?',
        options: [
          'Criar uniões de tipos literais primitivos: `type Modo = "escuro" | "claro"`',
          'Definir a forma de um objeto',
          'Usar genéricos',
          'Ser implementado por uma classe',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l7-q3',
        question: 'Como uma interface estende outra interface?',
        options: [
          'interface Admin extends Usuario { ... }',
          'interface Admin implements Usuario { ... }',
          'interface Admin : Usuario { ... }',
          'interface Admin with Usuario { ... }',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 8,
    title: 'Index Signatures & Record',
    description: 'Objetos com chaves dinâmicas desconhecidas em tempo de compilação.',
    unitNumber: 2,
    unitTitle: 'Interfaces & Type Aliases',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'ts-l8-q1',
        question:
          'Como declarar uma assinatura de índice para um objeto com chaves string e valores numéricos?',
        options: [
          '{ [chave: string]: number }',
          '{ keys: string, values: number }',
          '{ keyof string = number }',
          '{ string -> number }',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l8-q2',
        question: 'Qual Utility Type nativo é o atalho para `{ [key: string]: T }`?',
        options: [
          'Record<string, T>',
          'Map<string, T>',
          'Dictionary<string, T>',
          'Object<string, T>',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l8-q3',
        question:
          'O que a flag do compilador `noUncheckedIndexedAccess` adiciona ao acessar uma propriedade via índice?',
        options: [
          'Adiciona `| undefined` ao tipo retornado, forçando a verificação de existência',
          'Lança um erro em tempo de compilação',
          'Bloqueia o uso de arrays',
          'Converte chaves para maiúsculas',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 9,
    title: 'Type Assertions & Non-Null Operator',
    description: 'Uso consciente de `as Type`, `as const` e operador de asserção não-nula `!`.',
    unitNumber: 2,
    unitTitle: 'Interfaces & Type Aliases',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'ts-l9-q1',
        question: 'Qual é o efeito de adicionar `as const` ao final de um objeto literal?',
        options: [
          'Torna todas as propriedades `readonly` e infere seus tipos como literais estritos em vez de primitivos genéricos',
          'Congela o objeto em tempo de execução via Object.freeze()',
          'Gera um erro de sintaxe',
          'Converte o objeto em classe',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l9-q2',
        question:
          'O que o operador de asserção não-nula `!` faz ao final de uma expressão (ex: `el!`):',
        options: [
          'Afirma ao compilador que o valor não é `null` nem `undefined` naquele ponto',
          'Inverte o valor booleano',
          'Lança um erro se for nulo',
          'Converte para string',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l9-q3',
        question:
          'Qual palavra-chave é a forma padrão e recomendada de fazer uma Type Assertion em TypeScript?',
        options: ['as', 'cast', 'to', 'convert'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 3: Funções, Generics & Assinaturas ──
  {
    levelNumber: 10,
    title: 'Tipagem de Funções',
    description: 'Assinaturas de função, parâmetros opcionais, rest e tipos de retorno.',
    unitNumber: 3,
    unitTitle: 'Funções, Generics & Assinaturas',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'ts-l10-q1',
        question:
          'Como definir o tipo de uma função que recebe dois números e retorna um booleano?',
        options: [
          '(a: number, b: number) => boolean',
          'Function<number, number, boolean>',
          'def(number, number): boolean',
          '(a: number, b: number) -> boolean',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l10-q2',
        question: 'Como tipar o `this` explicitamente dentro de uma função em TypeScript?',
        options: [
          'Declarando `this: Tipo` como o primeiro parâmetro falso da função',
          'Usando `@this Tipo` no comentário JSDoc',
          'Com a palavra-chave `bind Tipo`',
          'Não é possível tipar o this',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l10-q3',
        question:
          'Como tipar parâmetros restantes (rest parameters) de forma que todos sejam strings?',
        options: [
          '(...itens: string[])',
          '(...itens: string)',
          '(rest itens: string[])',
          '(*itens: string)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 11,
    title: 'Function Overloads',
    description: 'Sobrecarga de funções para suportar múltiplos padrões de chamada.',
    unitNumber: 3,
    unitTitle: 'Funções, Generics & Assinaturas',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'ts-l11-q1',
        question: 'Como funciona a sobrecarga de funções (Function Overloading) no TypeScript?',
        options: [
          'Declaram-se múltiplas assinaturas de cabeçalho seguidas por uma única função de implementação compatível',
          'Criam-se múltiplas funções com corpos diferentes e o mesmo nome',
          'O compilador gera código C++ no fundo',
          'Usa-se o modificador `overload`',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l11-q2',
        question:
          'A assinatura da função de implementação de uma sobrecarga é visível diretamente para quem consome a função?',
        options: [
          'Não, apenas as assinaturas de sobrecarga declaradas acima dela são visíveis externamente',
          'Sim, sempre',
          'Apenas em modo strict',
          'Apenas se for exportada com default',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l11-q3',
        question: 'Qual é o tipo de retorno ao chamar uma função sobrecarregada?',
        options: [
          'O tipo correspondente à assinatura de sobrecarga que casou com os argumentos fornecidos',
          'A união de todos os retornos possíveis',
          'Sempre `any`',
          'Sempre `unknown`',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 12,
    title: 'Genéricos em Funções',
    description: 'Criação de funções genéricas reutilizáveis com parâmetros de tipo `<T>`.',
    unitNumber: 3,
    unitTitle: 'Funções, Generics & Assinaturas',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'ts-l12-q1',
        question:
          'Como declarar uma função genérica chamada `primeiroElemento` que recebe um array de tipo `T` e retorna `T | undefined`?',
        options: [
          'function primeiroElemento<T>(arr: T[]): T | undefined',
          'function primeiroElemento(arr: Generic[]): Generic',
          'function<T> primeiroElemento(arr: T[]): T',
          'function primeiroElemento(T, arr: T[]): T',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l12-q2',
        question:
          'O TypeScript consegue inferir o parâmetro de tipo genérico `T` automaticamente na chamada `primeiroElemento([1, 2, 3])`?',
        options: [
          'Sim, infere `T` como `number` a partir do argumento passado',
          'Não, é obrigatório passar `<number>` explicitamente',
          'Infere sempre como `any`',
          'Gera erro se não for anotado',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l12-q3',
        question: 'Como definir múltiplos parâmetros de tipo em uma função genérica?',
        options: [
          'function mapear<T, U>(valor: T, fn: (v: T) => U): U',
          'function mapear<T & U>(valor: T): U',
          'function mapear[T, U](valor: T): U',
          'function mapear<T>(U, valor: T): U',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 13,
    title: 'Generic Constraints (extends)',
    description: 'Restrição de tipos genéricos com a cláusula `extends`.',
    unitNumber: 3,
    unitTitle: 'Funções, Generics & Assinaturas',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'ts-l13-q1',
        question:
          'Como restringir um tipo genérico `T` para exigir que ele tenha uma propriedade `length: number`?',
        options: [
          '<T extends { length: number }>',
          '<T implements { length: number }>',
          '<T : { length: number }>',
          '<T with { length: number }>',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l13-q2',
        question:
          'Como garantir que uma chave `K` seja obrigatoriamente uma chave existente do objeto `T`?',
        options: [
          '<K extends keyof T>',
          '<K in keyof T>',
          '<K typeof T>',
          '<K implements keyof T>',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l13-q3',
        question:
          'Como fornecer um tipo padrão para um parâmetro genérico caso nenhum seja especificado?',
        options: [
          '<T = string>',
          '<T default string>',
          '<T : string>',
          '<T extends string = string>',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 4: Tipos Avançados & Manipulação de Tipos ──
  {
    levelNumber: 14,
    title: 'Keyof & Typeof Operators',
    description: 'Extração de uniões de chaves e inferência de tipo a partir de valores.',
    unitNumber: 4,
    unitTitle: 'Tipos Avançados & Manipulação de Tipos',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'ts-l14-q1',
        question:
          'Se `type Pessoa = { nome: string; idade: number }`, qual é o tipo resultante de `keyof Pessoa`?',
        options: ['"nome" | "idade"', 'string | number', 'Array<string>', '["nome", "idade"]'],
        correctIndex: 0,
      },
      {
        id: 'ts-l14-q2',
        question: 'Como extrair o tipo TypeScript de um objeto JavaScript existente em memória?',
        options: [
          'type Config = typeof objetoConfig;',
          'type Config = keyof objetoConfig;',
          'type Config = instanceOf objetoConfig;',
          'type Config = asType objetoConfig;',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l14-q3',
        question:
          'Como extrair a união de todos os valores de um array imutável `const cores = ["azul", "verde"] as const`?',
        options: [
          '(typeof cores)[number]',
          'keyof typeof cores',
          'cores.values()',
          'typeof cores.values',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 15,
    title: 'Indexed Access Types (Lookup Types)',
    description: 'Navegação e extração de tipos internos com a sintaxe `T[K]`.',
    unitNumber: 4,
    unitTitle: 'Tipos Avançados & Manipulação de Tipos',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'ts-l15-q1',
        question:
          'Dada a interface `Usuario`, como extrair diretamente o tipo da sua propriedade `endereco`?',
        options: [
          'Usuario["endereco"]',
          'Usuario.endereco',
          'typeof Usuario.endereco',
          'Usuario::endereco',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l15-q2',
        question:
          'Dada a lista `type Resposta = Array<{ id: number; titulo: string }>`, como extrair o tipo do elemento individual?',
        options: ['Resposta[number]', 'Resposta[0]', 'Resposta.element', 'keyof Resposta'],
        correctIndex: 0,
      },
      {
        id: 'ts-l15-q3',
        question: 'É possível indexar com uma união de chaves, como `Usuario["id" | "nome"]`?',
        options: [
          'Sim, retorna a união dos tipos correspondentes a essas propriedades',
          'Não, gera erro de compilação',
          'Apenas se for um array',
          'Apenas com tipos numéricos',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 16,
    title: 'Mapped Types',
    description: 'Transformação dinâmica de propriedades com a sintaxe `[K in keyof T]`.',
    unitNumber: 4,
    unitTitle: 'Tipos Avançados & Manipulação de Tipos',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'ts-l16-q1',
        question: 'Qual sintaxe de Mapped Type torna todas as propriedades de `T` opcionais?',
        options: [
          '{ [K in keyof T]?: T[K] }',
          '{ [K of keyof T]: T[K] }',
          '{ for K in T: optional T[K] }',
          '{ map T to optional }',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l16-q2',
        question:
          'Como remover o modificador `readonly` de todas as propriedades em um Mapped Type?',
        options: [
          '{ -readonly [K in keyof T]: T[K] }',
          '{ readonly: false [K in keyof T]: T[K] }',
          '{ mutable [K in keyof T]: T[K] }',
          '{ not readonly [K in keyof T]: T[K] }',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l16-q3',
        question: 'Como remapear chaves em um Mapped Type usando a cláusula `as` (Key Remapping)?',
        options: [
          '{ [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }',
          '{ [K in keyof T]: K as string }',
          '{ rename K in T to newK }',
          '{ mapKey(K in T) }',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 17,
    title: 'Template Literal Types',
    description: 'Composição de tipos de strings com interpolação e funções intrínsecas.',
    unitNumber: 4,
    unitTitle: 'Tipos Avançados & Manipulação de Tipos',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'ts-l17-q1',
        question:
          'Se `type Evento = "click" | "hover"`, o que `type Handler = `on${Capitalize<Evento>}`;` produz?',
        options: ['"onClick" | "onHover"', '"onclick" | "onhover"', '"onEvento"', 'string'],
        correctIndex: 0,
      },
      {
        id: 'ts-l17-q2',
        question:
          'Qual função utilitária intrínseca de string transforma todas as letras de um tipo literal em minúsculas?',
        options: ['Lowercase<S>', 'ToLowerCase<S>', 'Uncapitalize<S>', 'lower<S>'],
        correctIndex: 0,
      },
      {
        id: 'ts-l17-q3',
        question: 'Como tipar uma string que deve começar obrigatoriamente com "https://" ?',
        options: [
          '`https://${string}`',
          '"https://*"',
          'String & { startsWith: "https://" }',
          'Url<"https">',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 18,
    title: 'Type Narrowing & Type Guards',
    description: 'Refinamento de tipos com typeof, instanceof, in e predicados customizados.',
    unitNumber: 4,
    unitTitle: 'Tipos Avançados & Manipulação de Tipos',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'ts-l18-q1',
        question:
          'Como definir um Custom Type Guard que informa ao compilador que um parâmetro `pet` é do tipo `Peixe`?',
        options: [
          'function isPeixe(pet: Animal): pet is Peixe { ... }',
          'function isPeixe(pet: Animal): boolean as Peixe { ... }',
          'function isPeixe(pet: Animal) -> Peixe { ... }',
          'function isPeixe(pet: Animal): asserts pet is Peixe { ... }',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l18-q2',
        question:
          'O que uma Assertion Function com retorno `asserts condicao` realiza quando invocada?',
        options: [
          'Lança exceção se a condição for falsa e estreita o tipo do valor para o restante do escopo',
          'Gera um aviso no console',
          'Compila apenas em modo de teste',
          'Converte o valor para boolean',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l18-q3',
        question:
          'O operador `in` pode ser usado para estreitar uniões de objetos verificando a existência de uma propriedade?',
        options: [
          'Sim, estreita o tipo para as ramificações que contêm aquela propriedade',
          'Não, funciona apenas com arrays',
          'Apenas se a propriedade for numérica',
          'Apenas em classes',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 5: Utility Types Essenciais ──
  {
    levelNumber: 19,
    title: 'Partial, Required & Readonly',
    description: 'Modificadores universais de mutabilidade e obrigatoriedade.',
    unitNumber: 5,
    unitTitle: 'Utility Types Essenciais',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l19-q1',
        question: 'O que o Utility Type `Partial<T>` faz com as propriedades do tipo `T`?',
        options: [
          'Torna todas as propriedades opcionais (?)',
          'Remove todas as propriedades',
          'Torna todas de apenas leitura',
          'Transforma em strings',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l19-q2',
        question:
          'Qual Utility Type faz o inverso de `Partial<T>`, tornando todas as propriedades obrigatórias?',
        options: ['Required<T>', 'Complete<T>', 'Mandatory<T>', 'Strict<T>'],
        correctIndex: 0,
      },
      {
        id: 'ts-l19-q3',
        question: 'O que o `Readonly<T>` faz?',
        options: [
          'Impede a reatribuição de todas as propriedades no nível raiz de `T` em tempo de compilação',
          'Congela o objeto em tempo de execução',
          'Remove os métodos do objeto',
          'Transforma em tupla',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 20,
    title: 'Pick & Omit',
    description: 'Seleção e exclusão de propriedades específicas de uma interface.',
    unitNumber: 5,
    unitTitle: 'Utility Types Essenciais',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l20-q1',
        question:
          'Como criar um novo tipo contendo APENAS as propriedades "id" e "email" de `Usuario`?',
        options: [
          'Pick<Usuario, "id" | "email">',
          'Omit<Usuario, "id" | "email">',
          'Extract<Usuario, "id" | "email">',
          'Select<Usuario, "id", "email">',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l20-q2',
        question:
          'Como criar um novo tipo contendo todas as propriedades de `Usuario` EXCETO a "senha"?',
        options: [
          'Omit<Usuario, "senha">',
          'Pick<Usuario, -"senha">',
          'Exclude<Usuario, "senha">',
          'Delete<Usuario, "senha">',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l20-q3',
        question: 'Qual é o segundo argumento esperado por `Pick<T, K>`?',
        options: [
          'Uma união de chaves válidas que estendem `keyof T`',
          'Um valor booleano',
          'O tipo de retorno',
          'Um array de strings',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 21,
    title: 'Exclude, Extract & NonNullable',
    description: 'Operações de conjunto sobre uniões de tipos primitivos ou literais.',
    unitNumber: 5,
    unitTitle: 'Utility Types Essenciais',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l21-q1',
        question: 'Se `type T = "a" | "b" | "c"`, o que `Exclude<T, "a">` retorna?',
        options: ['"b" | "c"', '"a"', 'string', 'never'],
        correctIndex: 0,
      },
      {
        id: 'ts-l21-q2',
        question:
          'Qual Utility Type filtra uma união para manter APENAS os membros que são atribuíveis a um tipo de interesse?',
        options: ['Extract<T, U>', 'Pick<T, U>', 'Filter<T, U>', 'Include<T, U>'],
        correctIndex: 0,
      },
      {
        id: 'ts-l21-q3',
        question: 'O que `NonNullable<string | number | null | undefined>` produz?',
        options: ['string | number', 'string | number | null', 'never', 'unknown'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 22,
    title: 'ReturnType, Parameters & Awaited',
    description: 'Extração de metadados de funções e desempacotamento de Promises com Awaited.',
    unitNumber: 5,
    unitTitle: 'Utility Types Essenciais',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l22-q1',
        question:
          'Como extrair o tipo de retorno de uma função `function buscar(): Promise<Usuario>`?',
        options: [
          'ReturnType<typeof buscar>',
          'ReturnType<buscar>',
          'buscar.returnType',
          'TypeOf<buscar>',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l22-q2',
        question:
          'Qual Utility Type desempacota recursivamente o tipo interno resolvido por uma Promise?',
        options: ['Awaited<T>', 'Unwrap<T>', 'PromiseType<T>', 'Resolved<T>'],
        correctIndex: 0,
      },
      {
        id: 'ts-l22-q3',
        question: 'O que `Parameters<typeof fn>` retorna?',
        options: [
          'Uma tupla contendo os tipos de todos os parâmetros da função',
          'O número de argumentos',
          'Um objeto com os nomes dos parâmetros',
          'O tipo do primeiro argumento',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 6: Tipos Condicionais & inferência com infer ──
  {
    levelNumber: 23,
    title: 'Conditional Types Básicos',
    description: 'Sintaxe ternária de tipos: `T extends U ? X : Y`.',
    unitNumber: 6,
    unitTitle: 'Tipos Condicionais & Inferência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l23-q1',
        question:
          'Como escrever um tipo condicional que retorna `true` se `T` for `string` e `false` caso contrário?',
        options: [
          'type IsString<T> = T extends string ? true : false;',
          'type IsString<T> = if T is string then true else false;',
          'type IsString<T> = T == string ? true : false;',
          'type IsString<T> = match T { string => true, _ => false };',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l23-q2',
        question:
          'O que é a distributividade em Tipos Condicionais (Distributive Conditional Types)?',
        options: [
          'Quando aplicados a uma união genérica não envolvida em tupla, o tipo condicional é aplicado a cada membro da união individualmente',
          'A distribuição de arquivos pelo compilador',
          'A paralelização do typechecker',
          'O compartilhamento de tipos entre pacotes',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l23-q3',
        question:
          'Como desativar o comportamento distributivo em um tipo condicional `T extends U`?',
        options: [
          'Envolvendo ambos os lados em colchetes: `[T] extends [U] ? X : Y`',
          'Usando a flag `noDistribute`',
          'Com o modificador `static`',
          'Usando parênteses `(T) extends (U)`',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 24,
    title: 'A palavra-chave infer',
    description: 'Dedução e captura de tipos em posições arbitrárias dentro de condicionais.',
    unitNumber: 6,
    unitTitle: 'Tipos Condicionais & Inferência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l24-q1',
        question: 'Para que serve a palavra-chave `infer` em um tipo condicional?',
        options: [
          'Declarar uma variável de tipo a ser deduzida pelo compilador dentro da cláusula extends',
          'Forçar uma conversão de tipo em runtime',
          'Importar um tipo de outro arquivo',
          'Criar uma interface implícita',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l24-q2',
        question:
          'Como criar um tipo `ElementoDoArray<T>` que extrai o tipo `E` de `T extends (infer E)[]`?',
        options: [
          'type ElementoDoArray<T> = T extends (infer E)[] ? E : never;',
          'type ElementoDoArray<T> = T[infer E];',
          'type ElementoDoArray<T> = infer E from T[];',
          'type ElementoDoArray<T> = typeof T extends Array<infer E>;',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l24-q3',
        question: 'Onde a palavra-chave `infer` pode ser utilizada no TypeScript?',
        options: [
          'Exclusivamente dentro da cláusula `extends` de um tipo condicional',
          'Em qualquer declaração de variável',
          'Dentro de classes no construtor',
          'No cabeçalho de funções',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 25,
    title: 'Recursive Types & Tipos Profundos',
    description: 'Tipagem recursiva para estruturas em árvore, JSON e DeepReadonly.',
    unitNumber: 6,
    unitTitle: 'Tipos Condicionais & Inferência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l25-q1',
        question: 'O que caracteriza um tipo recursivo no TypeScript?',
        options: [
          'Um tipo que faz referência a si mesmo em sua própria definição estrutural (como árvores e nós)',
          'Um tipo que gera loop infinito no compilador',
          'Um tipo com mais de 10 propriedades',
          'Um alias para `any`',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l25-q2',
        question: 'Como definir um tipo `JSONValue` recursivo válido?',
        options: [
          'type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };',
          'type JSONValue = any;',
          'type JSONValue = Object | Array<any>;',
          'type JSONValue = string;',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l25-q3',
        question:
          'Qual é o limite de profundidade de recursão imposto pelo compilador TypeScript para evitar estouros?',
        options: [
          'O compilador possui um limite de profundidade finito para proteger contra recursões infinitas',
          'Não há limite',
          'Exatamente 2 níveis',
          'Exatamente 100.000 níveis',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 26,
    title: 'Branded Types (Nominal Typing)',
    description: 'Criação de tipos nominais seguros para IDs, CPFs, emails e moedas.',
    unitNumber: 6,
    unitTitle: 'Tipos Condicionais & Inferência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l26-q1',
        question: 'O que é o padrão de Branded Types (ou Opaque Types)?',
        options: [
          'Adicionar uma tag fantasma única via interseção a um tipo primitivo para impedir que seja misturado acidentalmente com outros primitivos do mesmo tipo base',
          'Comprar licenças de software',
          'Exportar tipos com logotipo',
          'Usar apenas classes',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l26-q2',
        question: 'Qual sintaxe exemplifica a criação de um tipo nominal `UserId` sobre `string`?',
        options: [
          'type UserId = string & { readonly __brand: unique symbol };',
          'type UserId = brand string;',
          'class UserId is string {}',
          'type UserId = new string()',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l26-q3',
        question:
          'Qual é a principal vantagem de usar `UserId` com branded type em vez de `string` comum?',
        options: [
          'Impede que um `OrderId` ou `string` genérica seja passado por engano em funções que esperam `UserId`',
          'Torna o código JavaScript mais rápido',
          'Valida o formato com regex no navegador automaticamente',
          'Criptografa o valor',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 7: Compilador, Configuração & Módulos ──
  {
    levelNumber: 27,
    title: 'Flags Estritas do tsconfig.json',
    description:
      'Ajustes essenciais: strict, noImplicitAny, strictNullChecks e noUncheckedIndexedAccess.',
    unitNumber: 7,
    unitTitle: 'Compilador, Configuração & Módulos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l27-q1',
        question: 'O que a opção `"strict": true` no `tsconfig.json` ativa?',
        options: [
          'Um conjunto completo de flags de verificação de tipo rigorosas do compilador',
          'Apenas a checagem de tipos numéricos',
          'A compilação para WebAssembly',
          'A formatação automática de código',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l27-q2',
        question: 'O que a flag `"strictNullChecks": true` garante?',
        options: [
          'Que `null` e `undefined` não sejam atribuíveis a outros tipos a menos que explicitamente especificados na união',
          'Que variáveis nunca possam ser nulas',
          'Que o banco de dados não aceite null',
          'Que todas as funções retornem void',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l27-q3',
        question:
          'O que `"noImplicitAny": true` causa ao compilar um código onde um tipo não pôde ser inferido e ficou implícito?',
        options: [
          'Emite um erro de compilação exigindo tipagem explícita',
          'Converte para unknown silenciosamente',
          'Ignora o arquivo',
          'Remove a variável',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 28,
    title: 'Arquivos de Declaração (.d.ts)',
    description: 'Criação de tipos de ambiente, declare module, declare global e pacotes @types.',
    unitNumber: 7,
    unitTitle: 'Compilador, Configuração & Módulos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l28-q1',
        question: 'Qual é o propósito de um arquivo `.d.ts`?',
        options: [
          'Conter apenas declarações de tipos e interfaces sem gerar código executável JavaScript na compilação',
          'Armazenar dados em banco SQLite',
          'Configurar o linter',
          'Executar testes no Node',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l28-q2',
        question:
          'Como tipar um módulo JavaScript externo legado que não possui tipos empacotados?',
        options: [
          'Usando `declare module "nome-do-modulo" { ... }` em um arquivo de declaração',
          'Renomeando o arquivo para .ts',
          'Adicionando `// @ts-ignore` no package.json',
          'Instalando o compilador C++',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l28-q3',
        question:
          'Como adicionar uma propriedade customizada ao objeto global `window` de forma tipada?',
        options: [
          'declare global { interface Window { meuApp: string; } }',
          'window.meuApp = string;',
          'interface Window extends App {}',
          'type GlobalWindow = Window + { meuApp: string }',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 29,
    title: 'Module Resolution & Paths',
    description: 'Resolução de módulos NodeNext/Bundler, aliases (@/*) e baseUrl no tsconfig.',
    unitNumber: 7,
    unitTitle: 'Compilador, Configuração & Módulos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l29-q1',
        question:
          'Como configurar o alias `@/*` para apontar para a pasta `src/*` no `tsconfig.json`?',
        options: [
          'No objeto `compilerOptions.paths`: `{ "@/*": ["./src/*"] }`',
          'No package.json na chave "alias"',
          'No .env com TS_PATHS',
          'Com a flag `--alias`',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l29-q2',
        question:
          'Qual valor de `moduleResolution` é o padrão recomendado para ferramentas modernas como Next.js e Vite?',
        options: ['"bundler" ou "NodeNext"', '"classic"', '"amd"', '"system"'],
        correctIndex: 0,
      },
      {
        id: 'ts-l29-q3',
        question: 'O que a flag `"isolatedModules": true` no tsconfig garante?',
        options: [
          'Garante que cada arquivo possa ser transpilado com segurança por transpiladores de arquivo único como SWC ou Babel',
          'Que os arquivos rodem em containers Docker separados',
          'Que nenhum módulo possa ser importado',
          'Que não haja dependências no npm',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 30,
    title: 'Decorators Stage 3',
    description: 'Nova especificação de decorators padrão do ECMAScript e TypeScript 5.0+.',
    unitNumber: 7,
    unitTitle: 'Compilador, Configuração & Módulos',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l30-q1',
        question: 'O que os Decorators da especificação Stage 3 permitem fazer?',
        options: [
          'Anotar e modificar classes, métodos, getters, setters e campos de forma padronizada',
          'Comprimir imagens SVG',
          'Criar temas visuais CSS',
          'Substituir o React',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l30-q2',
        question:
          'Qual argumento de contexto é fornecido aos decorators Stage 3 pelo motor em tempo de execução?',
        options: [
          '`ClassMethodDecoratorContext` (ou contexto específico do alvo) contendo metadados e helpers como addInitializer',
          'O objeto global window',
          'O arquivo package.json',
          'Um booleano',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l30-q3',
        question:
          'É necessário ativar `"experimentalDecorators": true` para utilizar os novos decorators padrão do TypeScript 5.0+?',
        options: [
          'Não, os decorators padrão Stage 3 são suportados nativamente sem flags experimentais',
          'Sim, sempre',
          'Apenas no Windows',
          'Apenas com Babel',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 8: Engenharia & Projeto Final Type-Safe ──
  {
    levelNumber: 31,
    title: 'Type-Safe Event Emitter',
    description: 'Implementação de sistemas de eventos fortemente tipados ponta a ponta.',
    unitNumber: 8,
    unitTitle: 'Engenharia & Projeto Final Type-Safe',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l31-q1',
        question:
          'Como tipar um EventEmitter genérico de forma que o método `on(evento, listener)` aceite apenas eventos e payloads válidos do mapa `T`?',
        options: [
          'on<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void',
          'on(event: string, listener: Function): void',
          'on<T>(event: any, listener: any): void',
          'on(event: keyof any): void',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l31-q2',
        question:
          'Qual é o benefício do autocomplete de nomes de eventos em IDEs ao usar um Typed EventEmitter?',
        options: [
          'Previne erros de digitação e garante que o payload recebido no callback tenha o tipo estrito esperado',
          'Reduz o consumo de CPU',
          'Remove a necessidade de testes',
          'Compila em tempo real',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l31-q3',
        question: 'Como permitir eventos que não requerem nenhum payload (vazio)?',
        options: [
          'Tipando o payload como `void` ou tornando o parâmetro opcional quando `T[K]` for `void`',
          'Usando any',
          'Lançando um erro',
          'Removendo o evento',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 32,
    title: 'Inversão de Dependência & IoC Type-Safe',
    description: 'Padrão Dependency Injection com interfaces e contêineres tipados.',
    unitNumber: 8,
    unitTitle: 'Engenharia & Projeto Final Type-Safe',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l32-q1',
        question: 'O que preceitua o Princípio da Inversão de Dependência (DIP do SOLID)?',
        options: [
          'Módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de abstrações (interfaces)',
          'O código deve ser executado de trás para frente',
          'Interfaces devem herdar de classes concretas',
          'Não se deve usar TypeScript',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l32-q2',
        question:
          'Como uma classe `UsuarioService` declara que precisa de um repositório sem se acoplar a uma implementação de banco específica?',
        options: [
          'Recebendo no construtor um parâmetro tipado como a interface `IUsuarioRepository`',
          'Instanciando `new PostgresRepository()` diretamente no método',
          'Usando variáveis globais',
          'Com a palavra-chave `require`',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l32-q3',
        question:
          'Como tipar um container de injeção de dependências para garantir que `container.get(Token)` retorne o tipo associado àquele token?',
        options: [
          'Usando assinaturas genéricas com mapas de serviços ou instâncias de Token tipadas',
          'Retornando sempre `any`',
          'Com eval()',
          'Usando dynamic cast',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 33,
    title: 'Type-Safe State Machines',
    description: 'Máquinas de estado finitas modeladas com uniões discriminadas estritas.',
    unitNumber: 8,
    unitTitle: 'Engenharia & Projeto Final Type-Safe',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l33-q1',
        question:
          'Como modelar os estados de uma requisição assíncrona (Idle, Loading, Success, Error) com segurança estrita de tipos?',
        options: [
          'Com uma União Discriminada onde o estado de Sucesso possui `data: T` e o de Erro possui `error: Error`',
          'Com 4 variáveis booleanas independentes',
          'Com uma única string solta',
          'Com `any`',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l33-q2',
        question: 'O que o padrão de Exhaustive Checking em um switch/case garante?',
        options: [
          'Garante via tipo `never` no bloco `default` que todos os possíveis estados da união foram tratados',
          'Que o switch rode em loop',
          'Que não haja estados com erro',
          'Que o código seja síncrono',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l33-q3',
        question: 'Como implementar a função de asserção de exaustividade?',
        options: [
          'function assertExhaustive(x: never): never { throw new Error("Estado não tratado: " + x); }',
          'function assertExhaustive(x: any) {}',
          'const assertExhaustive = () => true;',
          'function assertExhaustive(x: unknown): void {}',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 34,
    title: 'Validação de Schemas Type-Safe (Zod / Valibot)',
    description:
      'Padrão de validação em tempo de execução com inferência estática automática `z.infer`.',
    unitNumber: 8,
    unitTitle: 'Engenharia & Projeto Final Type-Safe',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l34-q1',
        question:
          'Como derivar o tipo TypeScript estático diretamente de um schema Zod sem duplicar código?',
        options: [
          'type Usuario = z.infer<typeof usuarioSchema>;',
          'type Usuario = typeof usuarioSchema;',
          'type Usuario = Zod.toType(usuarioSchema);',
          'type Usuario = usuarioSchema.type;',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l34-q2',
        question: 'Por que bibliotecas de schema como Zod são essenciais em aplicações TypeScript?',
        options: [
          'Porque o TypeScript é apagado na compilação e não valida dados externos em runtime (como respostas de APIs ou formulários)',
          'Porque o TypeScript não compila sem elas',
          'Para substituir o compilador tsc',
          'Para aumentar o tamanho do bundle',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l34-q3',
        question:
          'Qual método do Zod valida os dados e lança erro detalhado caso a estrutura não esteja de acordo com o schema?',
        options: [
          'schema.parse(data)',
          'schema.validate(data)',
          'schema.check(data)',
          'schema.verify(data)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 35,
    title: 'Projeto Final: Mini ORM Type-Safe',
    description:
      'Construção conceitual de um Query Builder com tipos estritos e type-safety ponta a ponta.',
    unitNumber: 8,
    unitTitle: 'Engenharia & Projeto Final Type-Safe',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'ts-l35-q1',
        question:
          'Em um Query Builder type-safe (como Prisma ou Kysely), como o método `.select("nome", "email")` infere o tipo do objeto de retorno?',
        options: [
          'Usando generics que capturam a tupla de chaves selecionadas e retornam `Pick<TTable, TKeys[number]>`',
          'Retornando sempre `any`',
          'Com comentários no código',
          'Lendo arquivos .sql em tempo de compilação',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l35-q2',
        question:
          'Como garantir que a cláusula `.where(campo, operador, valor)` aceite apenas campos reais da tabela e valores compatíveis com o tipo daquele campo?',
        options: [
          'Com restrições genéricas `<K extends keyof TTable>(campo: K, op: string, valor: TTable[K])`',
          'Aceitando `(campo: string, op: string, valor: any)`',
          'Com regex em runtime',
          'Com arrays heterogêneos',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-l35-q3',
        question:
          'Qual é o maior benefício de uma arquitetura 100% Type-Safe em projetos profissionais?',
        options: [
          'Refatorações seguras, detecção imediata de bugs em tempo de desenvolvimento e documentação viva auto-verificável',
          'Eliminar a necessidade de banco de dados',
          'Fazer deploy automático sem testes',
          'Substituir a necessidade de escrever CSS',
        ],
        correctIndex: 0,
      },
    ],
  },
];
