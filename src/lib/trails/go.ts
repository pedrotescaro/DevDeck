import type { TrailLevel } from '../trailsData';

export const GO_TRAIL: TrailLevel[] = [
  // ── SEÇÃO 1: Fundamentos & Sintaxe Go ──
  {
    levelNumber: 1,
    title: 'Pacotes, Variáveis & Operador :=',
    description: 'Declaração com var, operador de declaração curta := e ponto de entrada.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Go',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'go-l1-q1',
        question:
          'Qual operador realiza a declaração curta com inferência de tipo de variáveis dentro de funções em Go?',
        options: [':=', '=', '::', '->'],
        correctIndex: 0,
      },
      {
        id: 'go-l1-q2',
        question:
          'Qual é o nome do pacote e da função que servem como ponto de entrada principal de um executável Go?',
        options: [
          'package main e func main()',
          'package root e func start()',
          'package app e func init()',
          'package default e func run()',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l1-q3',
        question:
          'O que o compilador de Go faz se você declarar uma variável local e não utilizá-la no código?',
        options: [
          'Gera um erro de compilação imediato ("declared and not used")',
          'Emite apenas um aviso silencioso',
          'Remove a variável na compilação',
          'Substitui por zero',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 2,
    title: 'Tipos Primitivos & Valores Zero (Zero Values)',
    description: 'Valores padrão de inicialização de cada tipo em Go.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Go',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'go-l2-q1',
        question:
          'Qual é o "Zero Value" (valor padrão de inicialização) de uma variável do tipo `string` em Go?',
        options: ['"" (string vazia)', 'nil', 'null', 'undefined'],
        correctIndex: 0,
      },
      {
        id: 'go-l2-q2',
        question:
          'Qual é o Zero Value de ponteiros, slices, maps e interfaces não inicializados em Go?',
        options: ['nil', '0', 'false', 'empty'],
        correctIndex: 0,
      },
      {
        id: 'go-l2-q3',
        question: 'Qual é o tamanho padrão do tipo `int` em uma arquitetura de 64 bits em Go?',
        options: ['64 bits (8 bytes)', '32 bits (4 bytes)', '16 bits (2 bytes)', '128 bits'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 3,
    title: 'Constantes & Gerador Iota',
    description: 'Declaração com const e enumeração com o gerador iota.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Go',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'go-l3-q1',
        question:
          'Para que serve o identificador especial `iota` em um bloco de constantes `const ()`?',
        options: [
          'Gera automaticamente números inteiros incrementais consecutivos a partir de 0 a cada linha do bloco',
          'Calcula números primos',
          'Define constantes imutáveis em C',
          'Converte para string',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l3-q2',
        question: 'Constantes em Go podem ser tipadas e não-tipadas (untyped)?',
        options: [
          'Sim, constantes não-tipadas possuem precisão arbitrária até serem atribuídas a uma variável',
          'Não, todas as constantes devem ter tipo estrito',
          'Apenas constantes numéricas',
          'Apenas em pacotes internos',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l3-q3',
        question: 'É permitido usar o operador `:=` para declarar constantes em Go?',
        options: [
          'Não, constantes DEVEM ser declaradas com a palavra-chave `const`',
          'Sim, normalmente',
          'Apenas dentro de main()',
          'Apenas com strings',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 4,
    title: 'Funções & Múltiplos Retornos',
    description: 'Declaração com func, múltiplos retornos de valores e retornos nomeados.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Go',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'go-l4-q1',
        question:
          'Como declarar uma função que recebe dois inteiros e retorna um inteiro e um erro?',
        options: [
          'func dividir(a, b int) (int, error) { ... }',
          'func dividir(a int, b int) -> (int, error)',
          'def dividir(a, b): int, error',
          'function dividir(a: int, b: int): (int, error)',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l4-q2',
        question: 'Como descartar um valor de retorno que não se deseja utilizar?',
        options: [
          'Usando o identificador em branco `_` (blank identifier)',
          'Omitindo a variável',
          'Com a palavra `ignore`',
          'Passando nil',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l4-q3',
        question: 'O que caracteriza parâmetros variádicos em Go (ex: `func somar(nums ...int)`)?',
        options: [
          'A função aceita zero ou mais argumentos daquele tipo, que são recebidos internamente como um slice',
          'Aceita qualquer tipo como any',
          'É um macro de compilação',
          'Roda em thread separada',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 5,
    title: 'Visibilidade de Pacotes (Exportação)',
    description:
      'Controle de acesso público vs privado baseado na primeira letra maiúscula/minúscula.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Sintaxe Go',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'go-l5-q1',
        question:
          'Como o Go determina se uma variável, struct ou função é pública (exportada para outros pacotes)?',
        options: [
          'Se o nome começar com uma letra MAIÚSCULA, é pública (exportada); se começar com minúscula, é privada do pacote',
          'Usando as palavras-chave `public` e `private`',
          'Com anotações `@export`',
          'No arquivo go.mod',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l5-q2',
        question:
          'Qual função especial de um pacote é executada automaticamente antes da função `main()` durante a inicialização?',
        options: ['func init()', 'func setup()', 'func bootstrap()', 'func start()'],
        correctIndex: 0,
      },
      {
        id: 'go-l5-q3',
        question: 'É permitido ter múltiplas funções `init()` em um mesmo pacote ou arquivo em Go?',
        options: [
          'Sim, todas são executadas em ordem na inicialização do pacote',
          'Não, causa erro de compilação',
          'Apenas uma por módulo',
          'Apenas em modo debug',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 2: Controle de Fluxo & Defer ──
  {
    levelNumber: 6,
    title: 'Condicionais com Inicialização',
    description: 'Sintaxe concisa `if init; condicao` e escopo restrito.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Defer',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'go-l6-q1',
        question:
          'Qual é o padrão idiomático para executar uma instrução antes da condição em um if (ex: captura de erro)?',
        options: [
          'if valor, err := buscar(); err != nil { ... }',
          'valor, err := buscar(); if (err) { ... }',
          'if (err = buscar()) != nil { ... }',
          'try { valor = buscar() }',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l6-q2',
        question:
          'As variáveis declaradas na instrução de inicialização do `if` são acessíveis fora dos blocos `if` e `else`?',
        options: [
          'Não, seu escopo fica restrito exclusivamente ao corpo do if e dos respectivos else',
          'Sim, são globais',
          'Sim, até o fim da função',
          'Depende da tipagem',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l6-q3',
        question:
          'Em Go, é obrigatório o uso de parênteses em torno das condições em instruções `if` e `for`?',
        options: [
          'Não, parênteses são desencorajados e as chaves `{}` do bloco são obrigatórias',
          'Sim, são estritamente obrigatórios',
          'Apenas no if',
          'Apenas no for',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 7,
    title: 'O Único Laço: for',
    description: 'For tradicional, for estilo while e for infinito em Go.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Defer',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'go-l7-q1',
        question: 'Quantas palavras-chave de laço de repetição existem na linguagem Go?',
        options: [
          'Apenas uma: `for` (que cobre for tradicional, while e loops infinitos)',
          'Três: for, while e do...while',
          'Duas: for e loop',
          'Quatro',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l7-q2',
        question: 'Como escrever um laço infinito em Go?',
        options: ['for { ... }', 'while (true) { ... }', 'loop { ... }', 'for true { ... }'],
        correctIndex: 0,
      },
      {
        id: 'go-l7-q3',
        question: 'Como emular um loop `while (condicao)` em Go?',
        options: [
          'for condicao { ... }',
          'while condicao { ... }',
          'for ; condicao ; { ... }',
          'do condicao { ... }',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 8,
    title: 'Switch & Ausência de Fallthrough',
    description:
      'Comportamento seguro do switch em Go, switch sem condição e fallthrough explícito.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Defer',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'go-l8-q1',
        question:
          'Em Go, é necessário adicionar a instrução `break` ao final de cada `case` em um switch?',
        options: [
          'Não, o Go interrompe a execução do switch automaticamente após o primeiro case satisfeito',
          'Sim, é obrigatório como em C',
          'Apenas se houver default',
          'Apenas em switches numéricos',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l8-q2',
        question:
          'Qual palavra-chave é usada caso você QUEIRA explicitamente que a execução caia para o próximo case?',
        options: ['fallthrough', 'continue', 'next', 'pass'],
        correctIndex: 0,
      },
      {
        id: 'go-l8-q3',
        question: 'O que um switch sem expressão de condição (`switch { case ... }`) avalia?',
        options: [
          'Avalia cada case como uma condição booleana, funcionando como uma cadeia limpa de if/else',
          'Lança um erro',
          'Compara com nil',
          'Gera um loop',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 9,
    title: 'A Declaração defer',
    description: 'Agendamento LIFO de funções de limpeza executadas ao final da função.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Defer',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'go-l9-q1',
        question:
          'O que a palavra-chave `defer` faz quando colocada antes de uma chamada de função (ex: `defer f.Close()`)?',
        options: [
          'Adia a execução daquela chamada de função para o momento exato em que a função envolvente retornar',
          'Executa a função em background em outra thread',
          'Cancela a execução se houver erro',
          'Acelera o fechamento do arquivo',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l9-q2',
        question:
          'Quando múltiplos `defer` são declarados na mesma função, em qual ordem eles são executados no retorno?',
        options: [
          'LIFO (Last In, First Out — ordem inversa à declaração)',
          'FIFO (First In, First Out — ordem direta)',
          'Aleatoriamente',
          'Concorrentemente',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l9-q3',
        question:
          'Quando os argumentos passados para uma função chamada com `defer` são avaliados?',
        options: [
          'Imediatamente no momento em que a linha do `defer` é lida',
          'Apenas no momento do retorno da função',
          'Em tempo de compilação',
          'Nunca',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 3: Estruturas de Dados & Coleções ──
  {
    levelNumber: 10,
    title: 'Arrays vs Slices',
    description: 'Arrays de tamanho fixo na stack vs Slices dinâmicos como janelas sobre arrays.',
    unitNumber: 3,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'go-l10-q1',
        question:
          'Qual é a diferença fundamental entre um Array `[5]int` e um Slice `[]int` em Go?',
        options: [
          'Um Array tem tamanho fixo que faz parte do seu tipo; um Slice é uma estrutura dinâmica que referencia um segmento de array subjacente',
          'Slices aceitam múltiplos tipos; arrays não',
          'Arrays são alocados na heap; slices na stack',
          'São exatamente iguais',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l10-q2',
        question: 'Quais são os 3 componentes internos de um cabeçalho de Slice em Go?',
        options: [
          'Um ponteiro para o array subjacente, o comprimento (len) e a capacidade (cap)',
          'Apenas o ponteiro e o tipo',
          'Um array completo duplicado e um contador',
          'O endereço e o hash',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l10-q3',
        question:
          'Qual função embutida cria um slice alocado com comprimento e capacidade especificados?',
        options: [
          'make([]int, len, cap)',
          'new([]int, len)',
          'slice.create(len, cap)',
          'allocate([]int, len)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 11,
    title: 'Append, Copy & Fatiamento de Slices',
    description: 'Crescimento dinâmico com append, duplicação com copy e sub-fatiamento.',
    unitNumber: 3,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'go-l11-q1',
        question:
          'O que acontece quando a função `append()` precisa adicionar elementos além da capacidade atual do slice?',
        options: [
          'O Go aloca automaticamente um novo array subjacente maior (geralmente com o dobro da capacidade), copia os dados antigos e retorna o novo slice',
          'Lança um panic',
          'Sobrescreve a memória adjacente',
          'Bloqueia a thread',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l11-q2',
        question: 'Como concatenar dois slices `s1` e `s2` usando a função `append`?',
        options: [
          's1 = append(s1, s2...)',
          's1 = append(s1, s2)',
          's1 = s1 + s2',
          's1 = slice.concat(s1, s2)',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l11-q3',
        question: 'A função `copy(destino, origem)` copia quantos elementos?',
        options: [
          'O mínimo entre `len(destino)` e `len(origem)`',
          'Sempre o tamanho da origem, aumentando o destino',
          'Apenas 1 elemento',
          'Toda a capacidade',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 12,
    title: 'Maps & Gerenciamento de Chaves',
    description: 'Dicionários hash nativos com map[K]V, verificação de existência e delete.',
    unitNumber: 3,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'go-l12-q1',
        question:
          'Como verificar com segurança se uma chave existe em um map (o padrão "comma ok")?',
        options: [
          'valor, existe := meuMap[chave]',
          'if meuMap.has(chave) { ... }',
          'if chave in meuMap { ... }',
          'existe := meuMap.contains(chave)',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l12-q2',
        question: 'Qual função embutida remove uma chave de um map?',
        options: [
          'delete(meuMap, chave)',
          'meuMap.remove(chave)',
          'remove(meuMap, chave)',
          'meuMap.delete(chave)',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l12-q3',
        question: 'O que acontece ao tentar ler uma chave inexistente em um map?',
        options: [
          'Retorna o Zero Value do tipo do valor sem gerar erro',
          'Lança um panic de KeyNotFound',
          'Retorna nil sempre',
          'Trava a execução',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 13,
    title: 'Iteração com range',
    description: 'Percorrendo slices, arrays, maps, strings e canais com a cláusula for range.',
    unitNumber: 3,
    unitTitle: 'Estruturas de Dados & Coleções',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'go-l13-q1',
        question: 'O que `for i, v := range meuSlice` retorna em cada iteração?',
        options: [
          '`i` é o índice numérico e `v` é uma cópia do valor do elemento',
          '`i` é o ponteiro e `v` é a chave',
          '`i` é o valor e `v` é o índice',
          'Apenas referências',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l13-q2',
        question:
          'A ordem de iteração sobre as chaves de um map com `for k, v := range meuMap` é garantida?',
        options: [
          'Não, a ordem de iteração de maps em Go é deliberadamente aleatória a cada execução',
          'Sim, é sempre alfabética',
          'Sim, é a ordem de inserção',
          'Sim, é ordenada por hash',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l13-q3',
        question:
          'Ao iterar sobre uma `string` com `range`, o que a segunda variável recebe a cada passo?',
        options: [
          'A `rune` Unicode (código do caractere) e seu índice de byte correspondente',
          'Um byte simples `uint8`',
          'Uma substring de tamanho 1',
          'O ponteiro',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 4: Ponteiros & Structs ──
  {
    levelNumber: 14,
    title: 'Ponteiros em Go',
    description: 'Operadores & (endereço) e * (desreferenciação), sem aritmética de ponteiros.',
    unitNumber: 4,
    unitTitle: 'Ponteiros & Structs',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'go-l14-q1',
        question: 'O Go permite aritmética direta de ponteiros (como `p++` em C)?',
        options: [
          'Não, ponteiros em Go são seguros e não permitem aritmética direta de memória (a menos que use unsafe)',
          'Sim, idêntico a C',
          'Apenas com ponteiros de inteiros',
          'Apenas em 32 bits',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l14-q2',
        question: 'Qual operador obtém o endereço de memória de uma variável `x`?',
        options: ['&x', '*x', 'ptr(x)', '@x'],
        correctIndex: 0,
      },
      {
        id: 'go-l14-q3',
        question: 'O que o operador `*p` faz quando `p` é um ponteiro para um valor?',
        options: [
          'Desreferencia o ponteiro para ler ou alterar o valor armazenado naquele endereço',
          'Multiplica o ponteiro por 2',
          'Apaga o ponteiro da memória',
          'Aloca uma struct',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 15,
    title: 'Structs & Struct Tags',
    description: 'Definição de tipos estruturados, tags json/db e campos anônimos.',
    unitNumber: 4,
    unitTitle: 'Ponteiros & Structs',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'go-l15-q1',
        question:
          'Para que servem as Struct Tags em campos de uma struct (ex: `json:"nome_completo"` `)?',
        options: [
          'Fornecer metadados lidos por reflexão (como no encoding/json) para mapear nomes de campos em serializações',
          'Comentários para a IDE',
          'Anotações de tipo para o compilador',
          'Definir cores no terminal',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l15-q2',
        question: 'Como inicializar uma struct usando nomes de campos explícitos?',
        options: [
          'u := Usuario{Nome: "Ana", Idade: 28}',
          'u := Usuario("Ana", 28)',
          'u := new Usuario(Nome = "Ana")',
          'u := Usuario{ "Nome" = "Ana" }',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l15-q3',
        question:
          'Qual função construtora é a convenção idiomática padrão para criar instâncias configuradas de structs em Go?',
        options: [
          'Funções fábrica prefixadas com `New` (ex: `func NewUsuario(...) *Usuario`)',
          'Métodos chamados `constructor()`',
          'A palavra-chave `init`',
          'Construtores estáticos com class',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 16,
    title: 'Composição & Struct Embedding',
    description: 'Herança via composição: embutimento de structs anônimas e promoção de campos.',
    unitNumber: 4,
    unitTitle: 'Ponteiros & Structs',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'go-l16-q1',
        question:
          'Como o Go implementa o reaproveitamento de código sem usar o conceito de herança tradicional de classes?',
        options: [
          'Através de Composição por Embutimento de Structs (Struct Embedding), onde campos e métodos da struct embutida são promovidos',
          'Usando a palavra extends',
          'Com herança múltipla de classes',
          'Com decorators',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l16-q2',
        question:
          'Se a struct `Admin` embute a struct `Usuario`, como acessar o campo `Nome` de Usuario em uma instância `a` de Admin?',
        options: [
          'Tanto `a.Nome` (por promoção) quanto `a.Usuario.Nome` são válidos',
          'Apenas `a.Usuario.Nome`',
          'Apenas com type cast `a.(Usuario).Nome`',
          'Não é possível',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l16-q3',
        question:
          'O que acontece se `Admin` declarar um método com o mesmo nome de um método da struct `Usuario` embutida?',
        options: [
          'O método de `Admin` sobrescreve o método embutido no acesso direto `a.Metodo()`, mas `a.Usuario.Metodo()` continua acessível',
          'Gera erro de compilação por ambiguidade',
          'Ambos são executados em paralelo',
          'Apaga o método antigo',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 17,
    title: 'Métodos: Value vs Pointer Receivers',
    description: 'Receptores de valor (cópia) vs receptores de ponteiro (mutação e performance).',
    unitNumber: 4,
    unitTitle: 'Ponteiros & Structs',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'go-l17-q1',
        question:
          'Quando se DEVE utilizar um Pointer Receiver (ex: `func (u *Usuario) AlterarNome(...)`) em um método?',
        options: [
          'Quando o método precisa modificar o estado interno da struct OU quando a struct é grande e quer-se evitar a sobrecarga de copiá-la',
          'Apenas quando a função retorna um erro',
          'Sempre em todas as structs',
          'Nunca, ponteiros são proibidos em métodos',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l17-q2',
        question:
          'Se um método tem Value Receiver (`func (u Usuario) Imprimir()`), o que acontece se ele tentar alterar um campo `u.Nome`?',
        options: [
          'Altera apenas a cópia local do receptor; a struct original externa permanece inalterada',
          'Altera a struct original',
          'Gera um panic',
          'Causa erro de compilação',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l17-q3',
        question:
          'O Go realiza desreferenciação e tomada de endereço automáticas ao chamar métodos em valores e ponteiros?',
        options: [
          'Sim, o Go converte transparentemente `u.Metodo()` para `(&u).Metodo()` quando necessário para satisfazer o receiver',
          'Não, exige anotação manual com (*u)',
          'Apenas em arrays',
          'Apenas com structs públicas',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 18,
    title: 'Serialização JSON & Pacote encoding/json',
    description: 'json.Marshal, json.Unmarshal, json.Encoder e decoder de streams.',
    unitNumber: 4,
    unitTitle: 'Ponteiros & Structs',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'go-l18-q1',
        question:
          'Qual função serializa uma struct Go para um slice de bytes `[]byte` contendo JSON?',
        options: [
          'json.Marshal(dados)',
          'json.Stringify(dados)',
          'json.Serialize(dados)',
          'json.Encode(dados)',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l18-q2',
        question:
          'Por que campos de uma struct precisam ter a primeira letra MAIÚSCULA para serem serializados pelo pacote `encoding/json`?',
        options: [
          'Porque o pacote json é externo ao pacote da struct e só consegue ler campos públicos (exportados) via reflexão',
          'Por mera convenção estética',
          'Para o compilador gerar getters',
          'Para permitir campos nulos',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l18-q3',
        question:
          'Qual opção na struct tag faz com que um campo com valor zero seja omitido do JSON resultante (ex: `json:"idade,omitempty"` )?',
        options: ['omitempty', 'optional', 'skipzero', 'ignore_empty'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 5: Interfaces & Polimorfismo Implícito ──
  {
    levelNumber: 19,
    title: 'Interfaces Implícitas',
    description:
      'Duck typing estático: tipos implementam interfaces automaticamente sem palavra implements.',
    unitNumber: 5,
    unitTitle: 'Interfaces & Polimorfismo Implícito',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l19-q1',
        question: 'Como um tipo em Go implementa uma interface?',
        options: [
          'Implicitamente: basta implementar todos os métodos declarados na interface, sem nenhuma palavra-chave como implements',
          'Declarando `type T implements Interface`',
          'Herdando de uma classe abstrata',
          'Com o modificador `@implements`',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l19-q2',
        question: 'Qual é o provérbio clássico de Go sobre o tamanho ideal de interfaces?',
        options: [
          '"Quanto maior a interface, mais fraca a abstração." (Interfaces devem ser pequenas e focadas, frequentemente com apenas 1 ou 2 métodos)',
          '"Interfaces devem ter pelo menos 10 métodos."',
          '"Tudo deve ser uma interface."',
          '"Interfaces não devem ser exportadas."',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l19-q3',
        question: 'Qual é o tipo e valor de uma variável de interface não inicializada?',
        options: [
          'Tanto seu tipo dinâmico quanto seu valor dinâmico são `nil` (uma interface é nil se ambos forem nil)',
          'Valor é 0',
          'Tipo é Object',
          'Lança um erro',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 20,
    title: 'Type Assertions & Type Switches',
    description: 'Extração do tipo concreto subjacente e chaveamento de tipos com .(type).',
    unitNumber: 5,
    unitTitle: 'Interfaces & Polimorfismo Implícito',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l20-q1',
        question:
          'Como fazer uma asserção de tipo segura (Type Assertion) para extrair uma `string` de uma interface `i`?',
        options: [
          's, ok := i.(string)',
          's := (string)i',
          's := i as string',
          's := type_cast(i, string)',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l20-q2',
        question:
          'O que acontece ao fazer uma asserção `s := i.(string)` sem a forma comma-ok caso `i` NÃO seja uma string?',
        options: [
          'O programa entra em panic em tempo de execução',
          'Retorna uma string vazia silenciosamente',
          'Retorna nil',
          'Converte o valor',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l20-q3',
        question:
          'Qual construção permite testar uma interface contra múltiplos tipos concretos em ramificações case?',
        options: [
          'Type Switch: `switch v := i.(type) { case string: ... }`',
          'Pattern Switch',
          'instanceof switch',
          'Match Type',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 21,
    title: 'A Interface Vazia & o Tipo any',
    description: 'Interface interface{} e o alias any introduzido no Go 1.18.',
    unitNumber: 5,
    unitTitle: 'Interfaces & Polimorfismo Implícito',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l21-q1',
        question: 'O que é o identificador `any` introduzido no Go 1.18?',
        options: [
          'Um alias nativo exato para a interface vazia `interface{}`',
          'Um tipo dinâmico do Python',
          'Um ponteiro genérico void*',
          'Uma macro',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l21-q2',
        question: 'Por que qualquer valor em Go satisfaz a interface vazia `interface{}` / `any`?',
        options: [
          'Porque a interface vazia declara zero métodos, e todo e qualquer tipo em Go implementa pelo menos zero métodos',
          'Porque o Go desativa a checagem de tipos',
          'Porque todos os tipos herdam de Object',
          'Por coerção de tipos',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l21-q3',
        question:
          'Qual é o custo de aceitar parâmetros como `any` em funções em vez de tipos estritos ou genéricos?',
        options: [
          'Perda de segurança de tipos em compilação e necessidade de type assertions / reflexão em runtime',
          'Uso infinito de memória',
          'Compilação 100x mais lenta',
          'Impossibilidade de rodar em containers',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 22,
    title: 'Interfaces Padrão: io.Reader & io.Writer',
    description: 'Os blocos de construção fundamentais de streaming e I/O no ecossistema Go.',
    unitNumber: 5,
    unitTitle: 'Interfaces & Polimorfismo Implícito',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l22-q1',
        question: 'Qual é a assinatura do único método declarado na interface `io.Reader`?',
        options: [
          'Read(p []byte) (n int, err error)',
          'Read() ([]byte, error)',
          'ReadBytes(p *[]byte) int',
          'Fetch(p []byte) error',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l22-q2',
        question:
          'Qual função utilitária do pacote `io` copia todos os dados de um `io.Reader` para um `io.Writer` em streaming eficiente?',
        options: [
          'io.Copy(dst, src)',
          'io.Transfer(dst, src)',
          'io.Pipe(dst, src)',
          'io.Stream(dst, src)',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l22-q3',
        question:
          'Qual erro sentinel é retornado por um `io.Reader` para indicar que todos os dados foram lidos (fim do arquivo)?',
        options: ['io.EOF', 'io.ErrDone', 'io.ErrFinished', 'io.Null'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 6: Tratamento de Erros, Panic & I/O ──
  {
    levelNumber: 23,
    title: 'Tratamento de Erros Idiomático',
    description:
      'A interface error nativa, checagem explícita com if err != nil e sentinel errors.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Erros, Panic & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l23-q1',
        question: 'Como o tipo embutido `error` é definido na biblioteca padrão do Go?',
        options: [
          'Como uma interface com um único método: `type error interface { Error() string }`',
          'Como uma struct com stack trace',
          'Como um inteiro com código de erro',
          'Como uma classe de exceção',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l23-q2',
        question:
          'Por que o Go prefere retornar erros como valores explícitos em vez de usar exceções tradicionais try/catch?',
        options: [
          'Para tornar os pontos de falha visíveis, explícitos no fluxo de controle e incentivar o tratamento imediato',
          'Porque os criadores esqueceram de implementar exceções',
          'Para obrigar o uso de logs',
          'Para evitar o uso de memória',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l23-q3',
        question: 'Como criar uma mensagem de erro simples usando o pacote padrão `errors`?',
        options: [
          'errors.New("mensagem de falha")',
          'new(error, "mensagem")',
          'error.Create("mensagem")',
          'Error("mensagem")',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 24,
    title: 'Empacotamento de Erros (errors.Is & errors.As)',
    description: 'Formatação com fmt.Errorf %w, unwrapping e inspeção de cadeia de erros.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Erros, Panic & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l24-q1',
        question:
          'Qual verbo de formatação no `fmt.Errorf` empacota (wrap) um erro original preservando sua cadeia de inspeção?',
        options: ['%w', '%v', '%s', '%+v'],
        correctIndex: 0,
      },
      {
        id: 'go-l24-q2',
        question: 'Para que serve a função `errors.Is(err, alvo)` introduzida no Go 1.13?',
        options: [
          'Verifica recursivamente se algum erro na cadeia empacotada corresponde a um erro sentinel específico',
          'Converte o erro para string',
          'Lança um panic se err for nulo',
          'Compara tipos de structs',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l24-q3',
        question: 'Para que serve a função `errors.As(err, &alvoCustomizado)`?',
        options: [
          'Busca na cadeia de erros se há algum erro de um tipo customizado específico e o extrai para a variável de destino',
          'Cria um alias para o erro',
          'Converte para JSON',
          'Muda a mensagem do erro',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 25,
    title: 'Panic & Recover',
    description:
      'Exceções fatais com panic(), recuperação em defer com recover() e limites de uso.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Erros, Panic & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l25-q1',
        question: 'Quando o uso de `panic()` é considerado aceitável em aplicações Go idiomáticas?',
        options: [
          'Apenas para erros verdadeiramente irrecuperáveis durante a inicialização (ex: falha de configuração essencial) ou bugs internos de programação',
          'Para qualquer erro de validação de formulário',
          'Em respostas HTTP 404',
          'No lugar de return',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l25-q2',
        question:
          'Onde a função `recover()` DEVE ser invocada para capturar um panic e restaurar o controle da goroutine?',
        options: [
          'Diretamente dentro de uma função agendada com `defer`',
          'No bloco if principal',
          'Em qualquer lugar da função main()',
          'Dentro de uma goroutine separada',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l25-q3',
        question:
          'O `recover()` em uma goroutine consegue capturar um panic que ocorreu em OUTRA goroutine concorrente?',
        options: [
          'Não, o `recover()` captura panics apenas na mesma goroutine em que foi executado; panics não tratados em outras goroutines encerram o processo',
          'Sim, captura globalmente',
          'Apenas se houver canais',
          'Apenas com permissão de root',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 26,
    title: 'Pacotes os & bufio (I/O)',
    description: 'Leitura e escrita de arquivos com os.ReadFile, os.WriteFile e bufio.Scanner.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Erros, Panic & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l26-q1',
        question:
          'Qual estrutura do pacote `bufio` é ideal para ler um arquivo ou entrada padrão linha por linha de forma eficiente?',
        options: [
          'bufio.NewScanner(reader)',
          'bufio.NewParser(reader)',
          'bufio.LineReader(reader)',
          'os.ScanLines(reader)',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l26-q2',
        question: 'Como iterar sobre as linhas com um `scanner` do bufio até o final dos dados?',
        options: [
          'for scanner.Scan() { linha := scanner.Text() }',
          'while scanner.HasNext() { ... }',
          'for line in scanner { ... }',
          'scanner.ReadAll()',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l26-q3',
        question:
          'Qual função do pacote `os` lê um arquivo inteiro para a memória em uma única linha de código?',
        options: [
          'os.ReadFile("caminho.txt")',
          'os.OpenAndRead("caminho.txt")',
          'os.Fetch("caminho.txt")',
          'io.ReadFile("caminho.txt")',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 7: Goroutines, Canais & Concorrência ──
  {
    levelNumber: 27,
    title: 'Goroutines & Concorrência Leve',
    description:
      'A palavra-chave go, threads de espaço de usuário (M:N scheduler) e custo mínimo de stack.',
    unitNumber: 7,
    unitTitle: 'Goroutines, Canais & Concorrência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l27-q1',
        question:
          'Como iniciar a execução de uma função de forma assíncrona/concorrente em uma Goroutine?',
        options: [
          'Prefixando a chamada da função com a palavra-chave `go` (ex: `go processar()`)',
          'Chamando `thread.Start(processar)`',
          'Usando `async processar()`',
          'Com `spawn processar()`',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l27-q2',
        question:
          'Qual é a média de tamanho da pilha inicial (stack) alocada para uma nova Goroutine em Go?',
        options: [
          'Apenas cerca de 2 KB (crescendo dinamicamente sob demanda), permitindo centenas de milhares de goroutines simultâneas',
          'Cerca de 1 MB a 2 MB fixos como threads do sistema operacional',
          '64 KB fixos',
          '100 MB',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l27-q3',
        question:
          'O que acontece com todas as outras Goroutines em execução quando a função `main()` principal termina e retorna?',
        options: [
          'O programa inteiro é encerrado imediatamente, finalizando todas as outras goroutines sem esperar por elas',
          'O Go aguarda todas terminarem automaticamente',
          'Gera um panic',
          'As goroutines viram processos zumbis no SO',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 28,
    title: 'Canais (Channels) Unbuffered vs Buffered',
    description: 'Comunicação tipada com chan T, operador <-, canais com buffer e bloqueios.',
    unitNumber: 7,
    unitTitle: 'Goroutines, Canais & Concorrência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l28-q1',
        question:
          'Como enviar um valor `42` para um canal `ch` e como ler esse valor do canal em outra goroutine?',
        options: [
          'Enviar: `ch <- 42` ; Ler: `valor := <-ch`',
          'Enviar: `ch.Send(42)` ; Ler: `ch.Receive()`',
          'Enviar: `<-ch 42` ; Ler: `ch->`',
          'Enviar: `ch.Push(42)` ; Ler: `ch.Pop()`',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l28-q2',
        question:
          'Como um canal sem buffer (Unbuffered Channel: `make(chan int)`) se comporta em operações de envio e recebimento?',
        options: [
          'É síncrono: o transmissor bloqueia até que um receptor esteja pronto para receber o dado (e vice-versa), servindo como ponto de rendezvous',
          'Nunca bloqueia',
          'Armazena até 100 itens',
          'Lança um erro',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l28-q3',
        question:
          'O que acontece ao tentar enviar um valor para um canal que já foi fechado com `close(ch)`?',
        options: [
          'O Go entra em panic ("send on closed channel")',
          'O envio é ignorado silenciosamente',
          'O canal reabre automaticamente',
          'Retorna false',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 29,
    title: 'Multiplexação com a instrução select',
    description: 'Aguardar múltiplos canais simultâneos, timeouts e cláusula default.',
    unitNumber: 7,
    unitTitle: 'Goroutines, Canais & Concorrência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l29-q1',
        question: 'Para que serve a instrução `select` em Go?',
        options: [
          'Permite que uma goroutine aguarde por operações de comunicação em múltiplos canais simultaneamente, executando o primeiro que estiver pronto',
          'Consultar bancos SQL nativamente',
          'Filtrar arrays em memória',
          'Trocar de thread na CPU',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l29-q2',
        question:
          'Como implementar um timeout de 2 segundos em uma operação de canal usando `select`?',
        options: [
          'case <-time.After(2 * time.Second): fmt.Println("timeout")',
          'case timeout(2s):',
          'timeout 2s { ... }',
          'case ch.Timeout(2):',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l29-q3',
        question: 'O que a cláusula `default:` faz dentro de um bloco `select`?',
        options: [
          'Executa imediatamente sem bloquear caso nenhum dos outros canais esteja pronto para envio ou recebimento',
          'Lança um erro',
          'Reinicia o select',
          'Bloqueia por 1 segundo',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 30,
    title: 'Sincronização com sync.WaitGroup & Mutex',
    description: 'Coordenação de goroutines com WaitGroup (Add, Done, Wait) e sync.Mutex.',
    unitNumber: 7,
    unitTitle: 'Goroutines, Canais & Concorrência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l30-q1',
        question:
          'Quais são os 3 métodos do `sync.WaitGroup` para coordenar a conclusão de N goroutines concorrentes?',
        options: [
          '`wg.Add(n)` para incrementar o contador, `wg.Done()` ao finalizar cada tarefa e `wg.Wait()` para bloquear até o contador chegar a zero',
          '`Start()`, `Stop()` e `Join()`',
          '`Push()`, `Pop()` e `Sync()`',
          '`Lock()`, `Unlock()` e `Await()`',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l30-q2',
        question:
          'Por que uma instância de `sync.WaitGroup` ou `sync.Mutex` DEVE ser passada sempre por PONTEIRO (`*sync.WaitGroup`) para outras funções?',
        options: [
          'Porque tipos do pacote `sync` não devem ser copiados por valor (copiar invalidaria o estado interno da sincronização)',
          'Porque o compilador não aceita tipos sync',
          'Para economizar 1 byte de RAM',
          'Por restrição de rede',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l30-q3',
        question:
          'Qual ferramenta de linha de comando embutida do Go detecta condições de corrida (Race Conditions) em tempo de execução?',
        options: [
          'A flag `-race` (ex: `go test -race` ou `go run -race .`)',
          'O comando `go vet --threads`',
          'O linter `golint`',
          'Não existe detector nativo',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 8: Padrões, Testes & Projeto Final ──
  {
    levelNumber: 31,
    title: 'O Pacote context (Cancelamento & Timeout)',
    description: 'Propagação de cancelamentos, prazos limites e metadados com context.Context.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l31-q1',
        question:
          'Qual é a convenção padrão para a posição do parâmetro `ctx context.Context` em funções e métodos Go?',
        options: [
          'Deve ser SEMPRE o primeiro parâmetro da função (ex: `func Buscar(ctx context.Context, id string)`)',
          'Deve ser o último parâmetro',
          'Deve ser uma variável global',
          'Deve ser passado como struct tag',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l31-q2',
        question: 'Como criar um contexto com cancelamento manual em Go?',
        options: [
          'ctx, cancel := context.WithCancel(parentCtx)',
          'ctx := context.New()',
          'ctx := context.Cancellable()',
          'ctx, stop := context.Create()',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l31-q3',
        question:
          'Como uma goroutine monitora se o contexto foi cancelado pelo chamador ou atingiu o timeout?',
        options: [
          'Aguardando no canal `case <-ctx.Done():`',
          'Chamando `if ctx.IsClosed()`',
          'Com a flag `ctx.Active`',
          'Lendo `ctx.Error` em loop',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 32,
    title: 'Testes com o Pacote testing & Benchmarks',
    description: 'Testes unitários com *testing.T, Table-Driven Tests e benchmarks com *testing.B.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l32-q1',
        question:
          'Qual é o sufixo obrigatório no nome do arquivo para que o comando `go test` o identifique como arquivo de teste?',
        options: ['`_test.go` (ex: `calculadora_test.go`)', '`.spec.go`', '`.test.go`', `_spec.go`],
        correctIndex: 0,
      },
      {
        id: 'go-l32-q2',
        question:
          'O que é o padrão "Table-Driven Tests" amplamente adotado e considerado a melhor prática em Go?',
        options: [
          'Definir uma slice de structs contendo múltiplos casos de entrada e saídas esperadas, iterando sobre eles com `t.Run()`',
          'Salvar os testes em tabelas do PostgreSQL',
          'Executar testes em ordem aleatória',
          'Criar planilhas Excel para testes',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l32-q3',
        question:
          'Como declarar uma função de Benchmark para medir a velocidade de execução em Go?',
        options: [
          'func BenchmarkNomeDaFuncao(b *testing.B) { for i := 0; i < b.N; i++ { ... } }',
          'func TestSpeed(t *testing.T) { ... }',
          'func MeasurePerformance() { ... }',
          'func PerfTest(b *Benchmark) { ... }',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 33,
    title: 'Genéricos em Go (Go 1.18+)',
    description: 'Parâmetros de tipo `[T any]`, type constraints e o pacote constraints.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l33-q1',
        question:
          'Como declarar uma função genérica `Mapear` que recebe um slice de `T` e retorna um slice de `U`?',
        options: [
          'func Mapear[T any, U any](itens []T, fn func(T) U) []U',
          'func Mapear<T, U>(itens []T, fn func(T) U) []U',
          'func[T, U] Mapear(itens []T) []U',
          'generic func Mapear(T, U) []U',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l33-q2',
        question:
          'Qual constraint genérica predefinida aceita qualquer tipo que suporte operadores de comparação `==` e `!=`?',
        options: ['`comparable`', '`any`', '`equality`', '`ordered`'],
        correctIndex: 0,
      },
      {
        id: 'go-l33-q3',
        question: 'O que o símbolo `~` significa em uma restrição de tipo (ex: `~int`)?',
        options: [
          'Aceita o tipo `int` e QUALQUER tipo derivado cujo tipo subjacente fundamental seja `int` (ex: `type MeuInt int`)',
          'Nega o tipo int',
          'Indica um ponteiro',
          'Aproximação de ponto flutuante',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 34,
    title: 'Módulos Go & Gestão de Dependências',
    description: 'Comandos go mod init, tidy, download e versionamento semântico.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l34-q1',
        question:
          'Qual comando limpa dependências não utilizadas e adiciona as dependências faltantes no arquivo `go.mod` e `go.sum`?',
        options: ['go mod tidy', 'go mod clean', 'go get --all', 'go mod sync'],
        correctIndex: 0,
      },
      {
        id: 'go-l34-q2',
        question: 'Qual é o papel do arquivo `go.sum` em um projeto Go?',
        options: [
          'Armazenar os hashes criptográficos de checksum de cada dependência para garantir integridade e segurança na compilação',
          'Somar as linhas de código',
          'Configurar o linter',
          'Controlar permissões de deploy',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l34-q3',
        question: 'Qual comando inicializa um novo módulo Go criando o arquivo `go.mod`?',
        options: ['go mod init nome-do-modulo', 'go create module', 'go init', 'cargo init'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 35,
    title: 'Projeto Final: Microserviço HTTP Concorrente & Resiliente',
    description:
      'Consolidação de HTTP server, net/http, middlewares, graceful shutdown e channels.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'go-l35-q1',
        question:
          'Como implementar Graceful Shutdown em um servidor `http.Server` ao receber sinais SIGINT/SIGTERM do sistema operacional?',
        options: [
          'Interceptando os sinais via `os/signal` e chamando `server.Shutdown(ctx)` para concluir as requisições em andamento',
          'Chamando `os.Exit(0)` imediatamente',
          'Fechando o socket bruscamente',
          'Reiniciando a máquina',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l35-q2',
        question: 'Como escrever um Middleware HTTP padrão reutilizável em Go?',
        options: [
          'Uma função que recebe um `http.Handler` e retorna um novo `http.Handler` envolvendo a requisição (ex: logging, auth)',
          'Usando classes abstratas',
          'Adicionando decorators com @',
          'Modificando o pacote net/http original',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-l35-q3',
        question:
          'Por que a linguagem Go se tornou o padrão dominante na construção de sistemas em nuvem, Docker, Kubernetes e infraestrutura moderna?',
        options: [
          'Compilação ultrarrápida para binário nativo único estático, concorrência nativa levíssima (Goroutines) e simplicidade de manutenção',
          'Porque usa Garbage Collector baseado em pausar o mundo por 10s',
          'Porque não usa tipos estáticos',
          'Por ser idêntica a C++',
        ],
        correctIndex: 0,
      },
    ],
  },
];
