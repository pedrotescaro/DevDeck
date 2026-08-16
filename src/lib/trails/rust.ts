import type { TrailLevel } from '../trailsData';

export const RUST_TRAIL: TrailLevel[] = [
  // ── SEÇÃO 1: Fundamentos & Ferramental Cargo ──
  {
    levelNumber: 1,
    title: 'Variáveis & Mutabilidade',
    description: 'Imutabilidade por padrão, palavra-chave mut e shadowing.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Ferramental Cargo',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'rust-l1-q1',
        question: 'Em Rust, as variáveis declaradas com `let` são, por padrão:',
        options: ['Imutáveis', 'Mutáveis', 'Globais', 'Ponteiros brutos'],
        correctIndex: 0,
      },
      {
        id: 'rust-l1-q2',
        question: 'Qual palavra-chave torna uma variável mutável em Rust?',
        options: ['mut', 'var', 'mutable', 'dyn'],
        correctIndex: 0,
      },
      {
        id: 'rust-l1-q3',
        question: 'O que é o conceito de Shadowing em Rust?',
        options: [
          'Declarar uma nova variável com o mesmo nome de uma anterior usando `let`, permitindo inclusive alterar seu tipo',
          'Ocultar erros de compilação',
          'Alocação dinâmica na heap',
          'Um recurso do depurador',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 2,
    title: 'Tipos Escalares & Compostos',
    description: 'Inteiros com sinal e sem sinal, floats, bool, char e tuplas.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Ferramental Cargo',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'rust-l2-q1',
        question: 'Qual tipo representa um inteiro com sinal de 32 bits em Rust?',
        options: ['i32', 'u32', 'int32', 'i64'],
        correctIndex: 0,
      },
      {
        id: 'rust-l2-q2',
        question:
          'Quantos bytes o tipo `char` do Rust ocupa na memória para suportar qualquer caractere Unicode?',
        options: ['4 bytes (32 bits)', '1 byte (8 bits)', '2 bytes (16 bits)', '8 bytes (64 bits)'],
        correctIndex: 0,
      },
      {
        id: 'rust-l2-q3',
        question: 'Como acessar o primeiro elemento de uma tupla `tup = (10, "olá")`?',
        options: ['tup.0', 'tup[0]', 'tup.first()', 'tup->0'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 3,
    title: 'Funções & Retorno de Expressões',
    description: 'Declaração com fn, parâmetros tipados e retorno implícito por expressão final.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Ferramental Cargo',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'rust-l3-q1',
        question: 'Como retornar um valor em uma função Rust sem usar a palavra-chave `return`?',
        options: [
          'Colocando a expressão na última linha da função SEM ponto-e-vírgula no final',
          'Com a palavra `send`',
          'Atribuindo à variável com o mesmo nome da função',
          'Não é possível',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l3-q2',
        question: 'O que a adição de um ponto-e-vírgula (`;`) faz com uma expressão em Rust?',
        options: [
          'Transforma a expressão em um statement (declaração) que avalia para o tipo unit `()`',
          'Acelera a compilação',
          'Lança um panic',
          'Torna a expressão imutável',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l3-q3',
        question:
          'Qual símbolo indica o tipo de retorno de uma função no cabeçalho (ex: `fn soma(a: i32) -> i32`)?',
        options: ['-> (seta magra)', '=> (seta gorda)', ':', 'returns'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 4,
    title: 'Gerenciador de Pacotes Cargo',
    description: 'Comandos cargo build, run, check, test e o manifesto Cargo.toml.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Ferramental Cargo',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'rust-l4-q1',
        question:
          'Qual comando do Cargo verifica se o código compila sem gerar os binários executáveis, sendo muito mais rápido?',
        options: ['cargo check', 'cargo build', 'cargo verify', 'cargo test'],
        correctIndex: 0,
      },
      {
        id: 'rust-l4-q2',
        question:
          'Qual arquivo armazena as dependências, metadados do pacote e configurações do projeto em Rust?',
        options: ['Cargo.toml', 'package.json', 'rust.config', 'Cargo.lock'],
        correctIndex: 0,
      },
      {
        id: 'rust-l4-q3',
        question: 'Qual comando compila o projeto com otimizações máximas para produção?',
        options: ['cargo build --release', 'cargo build --prod', 'cargo compile -O3', 'cargo dist'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 5,
    title: 'Constantes & Tipagem Explícita',
    description: 'Diferença entre const e let, tipo unit `()` e imutabilidade universal.',
    unitNumber: 1,
    unitTitle: 'Fundamentos & Ferramental Cargo',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'rust-l5-q1',
        question: 'Qual é uma regra obrigatória ao declarar uma constante com `const` em Rust?',
        options: [
          'O tipo de dado deve ser anotado explicitamente e seu valor deve ser uma expressão constante computável em tempo de compilação',
          'Ela pode ser reatribuída uma vez',
          'Deve ser declarada em minúsculas',
          'Não pode ter nome',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l5-q2',
        question: 'O que o tipo `()` (unit type) representa em Rust?',
        options: [
          'Uma tupla vazia que indica ausência de valor significativo (análogo a void)',
          'Um ponteiro nulo',
          'Um erro de sintaxe',
          'Um booleano',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l5-q3',
        question: 'Qual convenção de nomenclatura é exigida para constantes em Rust?',
        options: [
          'SCREAMING_SNAKE_CASE (ex: `VALOR_MAXIMO`)',
          'camelCase',
          'snake_case',
          'PascalCase',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 2: Ownership, Borrowing & Slices ──
  {
    levelNumber: 6,
    title: 'As Três Regras do Ownership',
    description: 'Propriedade de memória, escopo e liberação automática com drop.',
    unitNumber: 2,
    unitTitle: 'Ownership, Borrowing & Slices',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'rust-l6-q1',
        question: 'Qual é a regra central de Ownership (Propriedade) do Rust?',
        options: [
          'Cada valor em Rust tem um proprietário (owner) e só pode existir um único proprietário por vez; quando o owner sai de escopo, o valor é descartado (drop)',
          'Valores são gerenciados por um Garbage Collector em tempo de execução',
          'Toda memória deve ser liberada manualmente com `free()`',
          'Apenas tipos primitivos têm donos',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l6-q2',
        question: 'O que acontece ao atribuir uma `String` `s1` para `s2` (`let s2 = s1;`)?',
        options: [
          'Ocorre um Move (a posse é transferida para `s2` e `s1` se torna inválida)',
          'Uma cópia profunda de todos os caracteres é feita',
          'Um ponteiro compartilhado com contagem de referência é criado',
          'Gera erro de compilação',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l6-q3',
        question:
          'Quais tipos implementam a trait `Copy` e são duplicados por valor automaticamente em vez de moverem?',
        options: [
          'Tipos escalares alocados exclusivamente na stack (como i32, f64, bool, char e tuplas de Copy)',
          'String e Vec',
          'Todos os tipos',
          'Apenas ponteiros brutos',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 7,
    title: 'Referências & Borrowing (Empréstimo)',
    description: 'Empréstimos imutáveis (&T) vs mutáveis (&mut T) e prevenção de Data Races.',
    unitNumber: 2,
    unitTitle: 'Ownership, Borrowing & Slices',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'rust-l7-q1',
        question: 'Qual é a regra fundamental de referências do Rust garantida pelo compilador?',
        options: [
          'Você pode ter QUALQUER número de referências imutáveis (`&T`) OU EXATAMENTE UMA referência mutável (`&mut T`) em um determinado escopo, mas nunca ambas',
          'Você pode ter infinitas referências mutáveis',
          'Referências mutáveis só funcionam em threads',
          'Não há restrições',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l7-q2',
        question: 'O que é um "Dangling Pointer" (ponteiro pendente) e como o Rust o impede?',
        options: [
          'Um ponteiro para memória já liberada; o Rust impede isso garantindo que a referência nunca viva mais tempo do que o dado ao qual aponta',
          'Um ponteiro nulo',
          'Um vazamento de memória',
          'Uma variável não inicializada',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l7-q3',
        question:
          'O ato de criar uma referência para acessar dados sem tomar a posse de seu ownership chama-se:',
        options: ['Borrowing (Empréstimo)', 'Cloning', 'Moving', 'Shadowing'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 8,
    title: 'String vs &str & Slices',
    description: 'Diferenças de alocação na Heap vs referências a fatias de memória.',
    unitNumber: 2,
    unitTitle: 'Ownership, Borrowing & Slices',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'rust-l8-q1',
        question: 'Qual é a diferença entre `String` e `&str` em Rust?',
        options: [
          '`String` é um tipo dinâmico alocado na Heap que pode crescer; `&str` é uma fatia imutável (string slice) que referencia uma sequência de bytes UTF-8',
          '`String` é imutável; `&str` é mutável',
          '`&str` é para caracteres ASCII apenas',
          'São sinônimos exatos',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l8-q2',
        question: 'Como criar uma fatia dos três primeiros elementos de um array `arr`?',
        options: ['&arr[0..3]', '&arr[0..2]', 'arr.slice(0, 3)', 'arr[1..3]'],
        correctIndex: 0,
      },
      {
        id: 'rust-l8-q3',
        question:
          'As fatias de array (`&[T]`) e de string (`&str`) armazenam quais dois componentes internamente?',
        options: [
          'Um ponteiro para o início dos dados e o comprimento (tamanho) da fatia',
          'Apenas o ponteiro',
          'O array inteiro duplicado',
          'Um identificador numérico',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 9,
    title: 'Método Clone & Cópia Explícita',
    description: 'Duplicação de dados na heap com clone() e custo de performance.',
    unitNumber: 2,
    unitTitle: 'Ownership, Borrowing & Slices',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'rust-l9-q1',
        question:
          'Como duplicar explicitamente os dados de uma `String` na Heap para manter ambos os proprietários válidos?',
        options: [
          'let s2 = s1.clone();',
          'let s2 = s1.copy();',
          'let s2 = &s1;',
          'let s2 = copy(s1);',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l9-q2',
        question: 'Qual é o impacto do uso excessivo de `.clone()` em tipos complexos?',
        options: [
          'Pode introduzir sobrecarga de alocação de memória na heap e cópia de bytes, afetando a performance',
          'Gera memory leak',
          'Causa corrupção de dados',
          'Trava o compilador',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l9-q3',
        question:
          'Qual trait permite que uma struct personalizada possa ser duplicada com o método `.clone()`?',
        options: [
          '#[derive(Clone)]',
          '#[derive(Copy)]',
          '#[derive(Duplicate)]',
          '#[derive(Serializable)]',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 3: Controle de Fluxo & Pattern Matching ──
  {
    levelNumber: 10,
    title: 'Expressões if e if let',
    description: 'If como expressão de atribuição e desconstrução com if let.',
    unitNumber: 3,
    unitTitle: 'Controle de Fluxo & Pattern Matching',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'rust-l10-q1',
        question: 'Como utilizar o `if` como uma expressão para inicializar uma variável?',
        options: [
          'let num = if condicao { 5 } else { 10 };',
          'let num = condicao ? 5 : 10;',
          'let num = if (condicao) 5 else 10;',
          'let num = match condicao -> 5 | 10;',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l10-q2',
        question: 'Qual é a regra obrigatória ao usar `if` como expressão em uma atribuição `let`?',
        options: [
          'Todos os blocos (if e else) devem retornar expressões do MESMO tipo de dado',
          'O bloco else é proibido',
          'Deve retornar apenas números',
          'Deve terminar com vírgula',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l10-q3',
        question: 'Para que serve a sintaxe `if let Some(valor) = opcao { ... }`?',
        options: [
          'Forma concisa de desestruturar e tratar apenas um caso específico de pattern matching, ignorando os demais',
          'Declarar variáveis no if',
          'Forçar unwrap em tempo de compilação',
          'Criar uma closure',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 11,
    title: 'Loops: loop, while e for',
    description: 'Laço infinito com loop, retorno de valores com break e laços rotulados.',
    unitNumber: 3,
    unitTitle: 'Controle de Fluxo & Pattern Matching',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'rust-l11-q1',
        question: 'Como retornar um valor a partir de um laço `loop` infinito em Rust?',
        options: ['break valor;', 'return valor;', 'yield valor;', 'exit valor;'],
        correctIndex: 0,
      },
      {
        id: 'rust-l11-q2',
        question:
          'Como rotular um laço externo para que um `break` em um laço interno interrompa o laço externo?',
        options: [
          "'rotulo: loop { ... break 'rotulo; }",
          '@rotulo: loop { ... break @rotulo; }',
          'loop(rotulo) { break(rotulo); }',
          '#rotulo loop { break #rotulo; }',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l11-q3',
        question:
          'Qual método é usado para iterar sobre referências imutáveis de um vetor `v` em um laço for?',
        options: [
          'for item in &v (ou v.iter())',
          'for item in v.all()',
          'for item in *v',
          'for item in v.values()',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 12,
    title: 'Pattern Matching Exaustivo com match',
    description: 'Controle com match, guards condicionais e obrigatoriedade de cobertura total.',
    unitNumber: 3,
    unitTitle: 'Controle de Fluxo & Pattern Matching',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'rust-l12-q1',
        question:
          'O que o compilador do Rust exige em relação aos braços de uma instrução `match`?',
        options: [
          'O match deve ser EXAUSTIVO — todos os possíveis valores ou variantes do tipo devem ser tratados',
          'Deve ter no máximo 4 braços',
          'Cada braço deve ter um loop',
          'Deve incluir obrigatoriamente um break',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l12-q2',
        question:
          'Qual padrão é usado para casar com qualquer outro valor não explicitado anteriormente (padrão coringa)?',
        options: ['_ (underline)', '*', 'default', 'else'],
        correctIndex: 0,
      },
      {
        id: 'rust-l12-q3',
        question: 'Como adicionar uma condição extra a um braço do match (Match Guard)?',
        options: [
          'Some(x) if x > 10 => { ... }',
          'Some(x) where x > 10 => { ... }',
          'Some(x) && x > 10 => { ... }',
          'Some(x) : x > 10 => { ... }',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 13,
    title: 'Desestruturação & Padrões Avançados',
    description: 'Desconstrução de tuplas, structs, enums e operadores `@` de binding.',
    unitNumber: 3,
    unitTitle: 'Controle de Fluxo & Pattern Matching',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'rust-l13-q1',
        question: 'Para que serve o operador `@` em um padrão de match (ex: `id @ 1..=5`)?',
        options: [
          'Permite testar um valor contra um padrão e ao mesmo tempo vincular esse valor a uma variável `id`',
          'Indica um ponteiro',
          'Executa uma função assíncrona',
          'Compara endereços de memória',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l13-q2',
        question: 'Como ignorar campos específicos de uma struct ao desestruturá-la?',
        options: [
          'Usando `..` (ex: `Ponto { x, .. }`)',
          'Usando `*`',
          'Com `pass`',
          'Omitindo as chaves',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l13-q3',
        question: 'Como casar múltiplos valores literais alternativos em um mesmo braço de match?',
        options: [
          '1 | 2 | 3 => { ... }',
          '1 || 2 || 3 => { ... }',
          '[1, 2, 3] => { ... }',
          '1, 2, 3 => { ... }',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 4: Structs, Enums & Option/Result ──
  {
    levelNumber: 14,
    title: 'Structs & Métodos (impl)',
    description: 'Structs com campos nomeados, tuple structs e blocos de implementação impl.',
    unitNumber: 4,
    unitTitle: 'Structs, Enums & Option/Result',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'rust-l14-q1',
        question: 'Qual bloco define métodos e funções associadas para uma struct em Rust?',
        options: [
          'impl NomeDaStruct { ... }',
          'class NomeDaStruct { ... }',
          'struct methods NomeDaStruct { ... }',
          'methods for NomeDaStruct { ... }',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l14-q2',
        question:
          'Como se diferenciam métodos de instância de funções associadas (estáticas) dentro de um bloco `impl`?',
        options: [
          'Métodos de instância recebem `&self`, `&mut self` ou `self` como primeiro parâmetro; funções associadas não recebem self',
          'Funções associadas usam a palavra `static`',
          'Métodos usam `fn` e funções usam `def`',
          'Não há diferença',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l14-q3',
        question:
          'Como instanciar uma struct usando a sintaxe de atualização para copiar os campos restantes de `outra`?',
        options: [
          'Usuario { email: novo_email, ..outra }',
          'Usuario { email: novo_email, ...outra }',
          'Usuario.copy(outra, email = novo_email)',
          'Usuario.from(outra)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 15,
    title: 'Enums com Dados Associados',
    description: 'Enums como tipos soma algébricos ricos com tuplas e structs internas.',
    unitNumber: 4,
    unitTitle: 'Structs, Enums & Option/Result',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'rust-l15-q1',
        question: 'O que diferencia os Enums do Rust dos enums da maioria das outras linguagens?',
        options: [
          'Cada variante do Enum em Rust pode conter diferentes tipos e quantidades de dados associados (tuplas, structs, etc.)',
          'Enums em Rust são apenas números',
          'Enums só aceitam strings',
          'Enums não podem ser usados em match',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l15-q2',
        question: 'É possível implementar métodos e blocos `impl` para Enums em Rust?',
        options: [
          'Sim, da mesma forma que em structs usando `impl NomeDoEnum`',
          'Não, enums não podem ter métodos',
          'Apenas se todas as variantes forem numéricas',
          'Apenas com macros',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l15-q3',
        question: 'Qual é o tamanho de memória ocupado por um Enum em Rust?',
        options: [
          'O tamanho da sua maior variante mais um discriminante (tag) de enumeração',
          'A soma de todas as variantes juntas',
          'Sempre 8 bytes',
          'Sempre 64 bytes',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 16,
    title: 'O Enum Option<T> & Ausência Segura',
    description: 'Eliminação de ponteiros nulos com as variantes Some(T) e None.',
    unitNumber: 4,
    unitTitle: 'Structs, Enums & Option/Result',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'rust-l16-q1',
        question: 'Por que o Rust não possui o valor `null` nativo?',
        options: [
          'Para eliminar a categoria inteira de erros de desreferenciação nula em tempo de compilação usando o enum `Option<T>`',
          'Para acelerar a inicialização',
          'Porque computadores modernos não suportam null',
          'Por preferência de sintaxe apenas',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l16-q2',
        question: 'Quais são as duas variantes do enum padrão `Option<T>`?',
        options: [
          '`Some(T)` e `None`',
          '`Ok(T)` e `Err(E)`',
          '`Present(T)` e `Empty`',
          '`Just(T)` e `Nothing`',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l16-q3',
        question:
          'Qual método de `Option<T>` extrai o valor interno ou retorna um valor padrão caso seja `None`?',
        options: [
          'opt.unwrap_or(padrao)',
          'opt.get()',
          'opt.value_or_default()',
          'opt.extract(padrao)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 17,
    title: 'O Enum Result<T, E> & Operador ?',
    description: 'Tratamento de erros recuperáveis com Ok, Err e propagação elegante com ?.',
    unitNumber: 4,
    unitTitle: 'Structs, Enums & Option/Result',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'rust-l17-q1',
        question:
          'O que o operador de propagação de erro `?` faz ao ser aplicado em um `Result<T, E>`?',
        options: [
          'Se for `Ok(v)`, desempacota o valor `v`; se for `Err(e)`, retorna imediatamente o erro da função atual',
          'Lança um panic em caso de erro',
          'Converte o erro para String',
          'Ignora o erro',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l17-q2',
        question: 'Quais são as duas variantes do enum padrão `Result<T, E>`?',
        options: [
          '`Ok(T)` e `Err(E)`',
          '`Some(T)` e `None`',
          '`Success(T)` e `Failure(E)`',
          '`Valid` e `Invalid`',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l17-q3',
        question:
          'O que o método `.expect("Mensagem personalizada")` faz se aplicado em um `Result::Err`?',
        options: [
          'Causa um panic encerrando o programa e exibindo a mensagem personalizada no terminal',
          'Registra um log de warning',
          'Retorna None',
          'Tenta a operação novamente',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 18,
    title: 'Combinações Funcionais em Option/Result',
    description: 'Métodos combinadores: map, and_then, or_else e unwrap_or_else.',
    unitNumber: 4,
    unitTitle: 'Structs, Enums & Option/Result',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'rust-l18-q1',
        question:
          'Qual método transforma o valor interno de um `Option<T>` em `Option<U>` aplicando uma função sem desempacotar?',
        options: ['opt.map(fn)', 'opt.transform(fn)', 'opt.apply(fn)', 'opt.convert(fn)'],
        correctIndex: 0,
      },
      {
        id: 'rust-l18-q2',
        question:
          'Qual método é usado para encadear operações que retornam outro `Option` ou `Result` evitando aninhamento duplo (FlatMap)?',
        options: ['and_then()', 'flatten()', 'map()', 'chain()'],
        correctIndex: 0,
      },
      {
        id: 'rust-l18-q3',
        question:
          'Qual método calcula o valor de fallback apenas de forma preguiçosa (lazy) através de uma closure caso seja None?',
        options: [
          'unwrap_or_else(closure)',
          'unwrap_or(valor)',
          'or(valor)',
          'default_with(closure)',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 5: Traits, Generics & Lifetimes ──
  {
    levelNumber: 19,
    title: 'Generics em Rust',
    description: 'Parâmetros de tipo genérico em funções, structs, enums e monomorfização.',
    unitNumber: 5,
    unitTitle: 'Traits, Generics & Lifetimes',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l19-q1',
        question:
          'O que é a Monomorfização (Monomorphization) realizada pelo compilador do Rust para código genérico?',
        options: [
          'Gera versões especializadas de código nativo para cada tipo concreto utilizado, garantindo Zero-Cost Abstractions (sem custo de performance em runtime)',
          'Converte tudo para ponteiros void*',
          'Adiciona um interpretador',
          'Executa apenas em modo debug',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l19-q2',
        question:
          'Como declarar uma struct genérica `Ponto` com dois campos `x` e `y` do mesmo tipo `T`?',
        options: [
          'struct Ponto<T> { x: T, y: T }',
          'struct Ponto(T, T)',
          'generic struct Ponto<T> { x: T, y: T }',
          'struct Ponto: T { x: T, y: T }',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l19-q3',
        question: 'Como implementar métodos específicos apenas para `Ponto<f64>`?',
        options: [
          'impl Ponto<f64> { ... }',
          'impl<f64> Ponto { ... }',
          'impl Ponto where T = f64 { ... }',
          'impl f64 for Ponto { ... }',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 20,
    title: 'Traits & Implementações',
    description: 'Definição de interfaces com traits, métodos padrão e orphan rule.',
    unitNumber: 5,
    unitTitle: 'Traits, Generics & Lifetimes',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l20-q1',
        question: 'Qual palavra-chave define uma Trait (contrato de comportamento) em Rust?',
        options: ['trait', 'interface', 'protocol', 'abstract'],
        correctIndex: 0,
      },
      {
        id: 'rust-l20-q2',
        question: 'Como implementar a trait `Resumo` para a struct `Artigo`?',
        options: [
          'impl Resumo for Artigo { ... }',
          'impl Artigo implements Resumo { ... }',
          'impl Artigo: Resumo { ... }',
          'trait Resumo on Artigo { ... }',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l20-q3',
        question: 'O que diz a Orphan Rule (regra do órfão) em Rust?',
        options: [
          'Você só pode implementar uma trait para um tipo se pelo menos a trait OU o tipo foram definidos no seu crate atual',
          'Nenhum struct pode ter mais de uma trait',
          'Traits não podem ter métodos padrão',
          'Tipos genéricos não podem ser derivados',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 21,
    title: 'Trait Bounds & Cláusula where',
    description: 'Restrições de traits, múltiplos bounds com + e sintaxe limpa com where.',
    unitNumber: 5,
    unitTitle: 'Traits, Generics & Lifetimes',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l21-q1',
        question:
          'Como restringir um tipo genérico `T` para exigir que ele implemente tanto `Display` quanto `Clone`?',
        options: [
          '<T: Display + Clone>',
          '<T: Display & Clone>',
          '<T extends Display, Clone>',
          '<T implements Display + Clone>',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l21-q2',
        question:
          'Qual cláusula melhora a legibilidade de assinaturas de função com muitos trait bounds complexos?',
        options: [
          'A cláusula `where` ao final do cabeçalho da função',
          'A cláusula `constrain`',
          'O atributo `#[bounds]`',
          'Macros procedurais',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l21-q3',
        question: 'O que o tipo `impl Trait` na posição de retorno de uma função permite?',
        options: [
          'Retornar um tipo concreto que implementa a Trait sem precisar nomear o tipo concreto explicitamente',
          'Retornar múltiplos tipos dinâmicos',
          'Retornar ponteiros nulos',
          'Criar threads',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 22,
    title: "Lifetimes Explícitos ('a)",
    description:
      'O Borrow Checker, anotações de tempo de vida de referências e elisão de lifetimes.',
    unitNumber: 5,
    unitTitle: 'Traits, Generics & Lifetimes',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l22-q1',
        question: "Qual é o papel das anotações de Lifetime (`'a`) em Rust?",
        options: [
          'Informar ao Borrow Checker a relação entre os tempos de vida de múltiplas referências para garantir que nenhuma referência seja inválida',
          'Alterar quanto tempo a memória vive na Heap',
          'Configurar garbage collection',
          'Acelerar o loop de CPU',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l22-q2',
        question:
          'Qual lifetime especial indica que os dados vivem durante toda a duração da execução do programa (ex: strings literais)?',
        options: ["'static", "'global", "'forever", "'app"],
        correctIndex: 0,
      },
      {
        id: 'rust-l22-q3',
        question:
          'Se uma struct guarda uma referência `&str`, o que é obrigatório em sua declaração?',
        options: [
          "A struct deve declarar um parâmetro de lifetime (ex: `struct Exemplo<'a> { texto: &'a str }`)",
          'Deve usar unsafe',
          'Deve ser declarada como mutável',
          'Deve implementar Copy',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 6: Coleções Avançadas & Tratamento de Erros ──
  {
    levelNumber: 23,
    title: 'Vetores (Vec<T>) em Profundidade',
    description: 'Capacidade, realocação na heap, macro vec! e iteração.',
    unitNumber: 6,
    unitTitle: 'Coleções Avançadas & Tratamento de Erros',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l23-q1',
        question: 'Qual macro padrão inicializa um vetor com elementos iniciais em Rust?',
        options: ['vec![1, 2, 3]', 'vector!(1, 2, 3)', 'new_vec!(1, 2, 3)', 'list![1, 2, 3]'],
        correctIndex: 0,
      },
      {
        id: 'rust-l23-q2',
        question:
          'Qual método acessa um elemento do vetor retornando `Option<&T>` com segurança contra out-of-bounds?',
        options: ['v.get(indice)', 'v[indice]', 'v.at(indice)', 'v.lookup(indice)'],
        correctIndex: 0,
      },
      {
        id: 'rust-l23-q3',
        question:
          'Como pré-alocar espaço em memória para 100 elementos em um vetor evitando realocações frequentes?',
        options: [
          'Vec::with_capacity(100)',
          'Vec::new(100)',
          'Vec::reserve_all(100)',
          'Vec::allocate(100)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 24,
    title: 'HashMap & Entry API',
    description: 'Tabelas hash, hashing de chaves e padrão idiomático com .entry().',
    unitNumber: 6,
    unitTitle: 'Coleções Avançadas & Tratamento de Erros',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l24-q1',
        question:
          'Qual método idiomático da Entry API do `HashMap` busca uma chave ou insere um valor padrão caso não exista?',
        options: [
          'map.entry(chave).or_insert(valor_padrao)',
          'map.get_or_set(chave, valor_padrao)',
          'map.setdefault(chave, valor_padrao)',
          'map.insert_if_missing(chave, valor_padrao)',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l24-q2',
        question: 'Qual módulo da biblioteca padrão contém a estrutura `HashMap`?',
        options: [
          'std::collections::HashMap',
          'std::hash::HashMap',
          'std::map::HashMap',
          'std::ds::HashMap',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l24-q3',
        question:
          'Quais duas traits uma struct precisa implementar para ser usada como chave de um HashMap?',
        options: ['`Eq` e `Hash`', '`Clone` e `Display`', '`Ord` e `Send`', '`PartialEq` e `Copy`'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 25,
    title: 'Erros Personalizados (thiserror & anyhow)',
    description:
      'A trait std::error::Error e os ecossistemas thiserror para bibliotecas e anyhow para apps.',
    unitNumber: 6,
    unitTitle: 'Coleções Avançadas & Tratamento de Erros',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l25-q1',
        question:
          'No ecossistema Rust, qual crate é o padrão da indústria para modelar enums de erro estruturados em bibliotecas?',
        options: ['thiserror', 'anyhow', 'error_chain', 'panic_handler'],
        correctIndex: 0,
      },
      {
        id: 'rust-l25-q2',
        question:
          'Qual crate é amplamente utilizada em aplicações para captura e propagação flexível de qualquer erro?',
        options: ['anyhow', 'thiserror', 'log', 'env_logger'],
        correctIndex: 0,
      },
      {
        id: 'rust-l25-q3',
        question: 'Qual trait padrão da std representa a abstração universal de erros em Rust?',
        options: [
          'std::error::Error',
          'std::fmt::Error',
          'std::exception::Exception',
          'std::core::Fail',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 26,
    title: 'I/O de Arquivos & Manipulação de Bytes',
    description: 'Leitura e escrita com std::fs, std::io::BufReader e tratamento de streams.',
    unitNumber: 6,
    unitTitle: 'Coleções Avançadas & Tratamento de Erros',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l26-q1',
        question:
          'Qual função concisa lê todo o conteúdo de um arquivo em texto para uma `String`?',
        options: [
          'std::fs::read_to_string("arquivo.txt")',
          'std::fs::read("arquivo.txt")',
          'std::io::read_file("arquivo.txt")',
          'File::open_and_read("arquivo.txt")',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l26-q2',
        question:
          'Por que usar `BufReader` ao ler um arquivo linha por linha em vez de ler diretamente de `File`?',
        options: [
          'Porque o `BufReader` armazena blocos em cache na memória, reduzindo o número de chamadas de sistema (syscalls) caras',
          'Porque converte para JSON automaticamente',
          'Porque roda em threads separadas',
          'Porque fecha o arquivo mais rápido',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l26-q3',
        question: 'Qual trait fornece o método `.lines()` para iterar sobre linhas de texto?',
        options: ['std::io::BufRead', 'std::io::Read', 'std::io::Write', 'std::iter::Iterator'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 7: Iteradores, Closures & Smart Pointers ──
  {
    levelNumber: 27,
    title: 'Closures & Traits Fn, FnMut e FnOnce',
    description: 'Funções anônimas, captura de ambiente e a hierarquia de traits Fn.',
    unitNumber: 7,
    unitTitle: 'Iteradores, Closures & Smart Pointers',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l27-q1',
        question: 'Qual delimitador é usado para os parâmetros de uma closure em Rust?',
        options: [
          '|x, y| { ... } (barras verticais)',
          '(x, y) => { ... }',
          '[x, y] { ... }',
          'lambda x, y: ...',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l27-q2',
        question: 'O que a palavra-chave `move` faz antes de uma closure (ex: `move || { ... }`)?',
        options: [
          'Força a closure a tomar a posse (ownership) das variáveis capturadas do ambiente em vez de apenas tomar emprestado',
          'Executa a closure em outra CPU',
          'Torna a closure mutável',
          'Retorna uma Promise',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l27-q3',
        question:
          'Qual trait de closure representa funções que consomem as variáveis capturadas e só podem ser chamadas uma única vez?',
        options: ['FnOnce', 'FnMut', 'Fn', 'FnClone'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 28,
    title: 'Iteradores & Adaptadores',
    description: 'A trait Iterator, adaptadores preguiçosos map/filter e consumidores collect.',
    unitNumber: 7,
    unitTitle: 'Iteradores, Closures & Smart Pointers',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l28-q1',
        question:
          'Os adaptadores de iterador em Rust (como `.map()` e `.filter()`) são preguiçosos (lazy)?',
        options: [
          'Sim, nenhum processamento ocorre até que um método consumidor (como `.collect()` ou um laço `for`) seja chamado',
          'Não, executam imediatamente',
          'Apenas em modo release',
          'Apenas com números',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l28-q2',
        question:
          'Qual método transforma os elementos produzidos por um iterador em uma coleção concreta como um `Vec<T>`?',
        options: ['collect()', 'to_vec()', 'gather()', 'materialize()'],
        correctIndex: 0,
      },
      {
        id: 'rust-l28-q3',
        question:
          'Qual é o único método obrigatório que uma struct precisa implementar para satisfazer a trait `Iterator`?',
        options: [
          'fn next(&mut self) -> Option<Self::Item>',
          'fn has_next(&self) -> bool',
          'fn current(&self) -> Self::Item',
          'fn iter(&self) -> Self',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 29,
    title: 'Smart Pointers: Box<T>',
    description: 'Alocação explícita na Heap, tipos recursivos e tamanho conhecido em compilação.',
    unitNumber: 7,
    unitTitle: 'Iteradores, Geradores & Asyncio',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l29-q1',
        question: 'Para que serve o ponteiro inteligente `Box<T>` em Rust?',
        options: [
          'Alocar dados diretamente na Heap com tamanho conhecido de ponteiro na Stack, permitindo inclusive estruturas de dados recursivas',
          'Compartilhar dados entre threads sem lock',
          'Desativar o borrow checker',
          'Criar variáveis globais',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l29-q2',
        question:
          'Por que uma struct recursiva em árvore ou lista encadeada precisa usar `Box<Nodo>` nos nós filhos?',
        options: [
          'Para que o compilador saiba o tamanho exato da struct na Stack (o tamanho de um ponteiro Box), evitando tamanho infinito',
          'Para evitar usar memória RAM',
          'Porque o Rust proíbe structs com mais de 3 campos',
          'Para permitir herança',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l29-q3',
        question: 'Quais duas traits essenciais caracterizam os Smart Pointers em Rust?',
        options: ['`Deref` e `Drop`', '`Clone` e `Copy`', '`Send` e `Sync`', '`Display` e `Debug`'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 30,
    title: 'Rc<T>, Arc<T> & RefCell<T>',
    description:
      'Contagem de referência (Reference Counting) e mutabilidade interior (Interior Mutability).',
    unitNumber: 7,
    unitTitle: 'Iteradores, Geradores & Asyncio',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l30-q1',
        question:
          'Qual ponteiro inteligente permite múltiplos proprietários de um mesmo dado em cenários MULTITHREAD seguros?',
        options: ['Arc<T> (Atomic Reference Counting)', 'Rc<T>', 'Box<T>', 'RefCell<T>'],
        correctIndex: 0,
      },
      {
        id: 'rust-l30-q2',
        question:
          'O que o padrão de Mutabilidade Interior (Interior Mutability) com `RefCell<T>` ou `Mutex<T>` permite?',
        options: [
          'Modificar dados mesmo através de uma referência imutável, movendo a checagem das regras de empréstimo para o tempo de execução',
          'Criar código C++',
          'Ignorar tipos genéricos',
          'Evitar desalocação',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l30-q3',
        question: 'Por que o `Rc<T>` não pode ser enviado entre threads diferentes?',
        options: [
          'Porque ele não implementa a trait `Send`, pois sua contagem de referências não utiliza operações atômicas',
          'Porque é muito lento',
          'Porque o compilador não permite ponteiros',
          'Porque usa memória da GPU',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 8: Concorrência, Async & Projeto Final ──
  {
    levelNumber: 31,
    title: 'Threads Nativas & Traits Send/Sync',
    description:
      'Criação de threads com std::thread::spawn e as traits marcadoras de concorrência.',
    unitNumber: 8,
    unitTitle: 'Concorrência, Async & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l31-q1',
        question: 'Como criar e aguardar o término de uma thread nativa em Rust?',
        options: [
          'let handle = std::thread::spawn(closure); handle.join().unwrap();',
          'std::thread::create(closure).wait();',
          'async std::thread::start(closure);',
          'Thread::new(closure).run();',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l31-q2',
        question: 'O que a trait marcadora `Send` indica sobre um tipo?',
        options: [
          'Que a posse (ownership) do tipo pode ser transferida com segurança entre diferentes threads',
          'Que o tipo pode ser enviado pela rede via HTTP',
          'Que o tipo é serializável',
          'Que o tipo não ocupa memória',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l31-q3',
        question: 'O que a trait marcadora `Sync` indica sobre um tipo `T`?',
        options: [
          'Que é seguro referenciar `&T` a partir de múltiplas threads concorrentemente',
          'Que os métodos são síncronos',
          'Que o tipo usa banco de dados',
          'Que o tipo é imutável',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 32,
    title: 'Passagem de Mensagens (mpsc channels)',
    description:
      'Comunicação entre threads por passagem de mensagens em vez de memória compartilhada.',
    unitNumber: 8,
    unitTitle: 'Concorrência, Async & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l32-q1',
        question: 'O que a sigla `mpsc` significa em `std::sync::mpsc::channel()`?',
        options: [
          'Multiple Producer, Single Consumer (Múltiplos produtores transmissores, um único consumidor receptor)',
          'Multi Process Safe Channel',
          'Memory Pointer Shared Core',
          'Mutex Protected State Channel',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l32-q2',
        question: 'Como permitir que múltiplas threads enviem mensagens pelo mesmo canal?',
        options: [
          'Clonando o transmissor `tx` (`tx.clone()`) e movendo cada clone para uma thread diferente',
          'Compartilhando o `rx` com ponteiro',
          'Usando variáveis globais',
          'Não é suportado',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l32-q3',
        question: 'Qual filosofia famosa de concorrência o Rust e Go adotam com canais?',
        options: [
          '"Não se comunique compartilhando memória; em vez disso, compartilhe memória comunicando-se."',
          '"Sempre use variáveis globais com locks."',
          '"Threads não devem se comunicar."',
          '"Tudo deve ser síncrono."',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 33,
    title: 'Mutex & Memória Compartilhada',
    description: 'Uso de Arc<Mutex<T>> para exclusão mútua e sincronização de estado.',
    unitNumber: 8,
    unitTitle: 'Concorrência, Async & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l33-q1',
        question:
          'Qual combinação de tipos é a receita padrão para compartilhar e mutar dados concorrentemente entre múltiplas threads?',
        options: ['`Arc<Mutex<T>>`', '`Rc<RefCell<T>>`', '`Box<T>`', '`&mut T`'],
        correctIndex: 0,
      },
      {
        id: 'rust-l33-q2',
        question: 'Como a trava (lock) do `Mutex` é liberada automaticamente em Rust?',
        options: [
          'Quando o `MutexGuard` retornado por `.lock()` sai de escopo e seu método `drop` é executado',
          'Chamando `mutex.unlock()` manualmente',
          'Ao final da thread apenas',
          'Com garbage collection',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l33-q3',
        question:
          'O que acontece ao tentar adquirir um lock em um Mutex onde a thread que detinha o lock entrou em panic?',
        options: [
          'O lock é considerado "envenenado" (Poisoned), e `.lock()` retorna um `Err(PoisonError)`',
          'O programa trava para sempre',
          'O dado é corrompido silenciosamente',
          'O computador reinicia',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 34,
    title: 'Rust Assíncrono com Tokio Runtime',
    description: 'Futures, poll, async/await e o runtime de alta performance Tokio.',
    unitNumber: 8,
    unitTitle: 'Concorrência, Async & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l34-q1',
        question: 'Por que o Rust não inclui um runtime assíncrono embutido na biblioteca padrão?',
        options: [
          'Para manter a filosofia de Zero-Cost Abstractions, permitindo que a comunidade escolha runtimes especializados (como Tokio para servidores ou Embassy para microcontroladores)',
          'Porque o Rust não suporta async',
          'Para forçar o uso de threads nativas apenas',
          'Por limitação de hardware',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l34-q2',
        question: 'O que o macro `#[tokio::main]` faz quando anotado na função `async fn main()`?',
        options: [
          'Inicializa o Tokio Runtime e executa a função main assíncrona até a conclusão',
          'Compila o código para WebAssembly',
          'Gera testes automatizados',
          'Cria um container Docker',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l34-q3',
        question:
          'Qual função do Tokio agenda uma tarefa assíncrona para rodar em background no thread pool?',
        options: [
          'tokio::spawn(async { ... })',
          'tokio::run(async { ... })',
          'tokio::thread(async { ... })',
          'tokio::fork(async { ... })',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 35,
    title: 'Projeto Final: Servidor Web Multithread de Alta Performance',
    description: 'Consolidação de ownership, traits, arc/mutex, tcp listener e thread pool.',
    unitNumber: 8,
    unitTitle: 'Concorrência, Async & Projeto Final',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'rust-l35-q1',
        question:
          'Em um Thread Pool customizado em Rust, como os Workers recebem continuamente novas tarefas de execução?',
        options: [
          'Compartilhando um receptor de canal `Arc<Mutex<mpsc::Receiver<Job>>>` entre todas as threads de trabalho',
          'Criando uma nova thread para cada requisição',
          'Com um loop infinito síncrono',
          'Usando variáveis voláteis em C',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l35-q2',
        question:
          'Como garantir o encerramento gracioso (Graceful Shutdown) do Thread Pool ao fechar o servidor?',
        options: [
          'Descartando o transmissor (sender) do canal para fechar a fila e chamando `.join()` no handle de cada worker',
          'Chamando `std::process::exit(0)` abruptamente',
          'Cortando a energia do processo',
          'Deixando as threads rodando',
        ],
        correctIndex: 0,
      },
      {
        id: 'rust-l35-q3',
        question: 'Qual é o maior trunfo do Rust para sistemas críticos e de infraestrutura?',
        options: [
          'Garantia de segurança de memória e ausência de data races em tempo de compilação sem necessidade de Garbage Collector (Fearless Concurrency)',
          'Sintaxe idêntica a JavaScript',
          'Não precisar compilar',
          'Permitir tipagem dinâmica',
        ],
        correctIndex: 0,
      },
    ],
  },
];
