export interface CheckpointChallenge {
  title: string;
  description: string;
  template: string;
  expectedOutput: string;
  checkCode: string;
}

export interface CheckpointData {
  title: string;
  description: string;
  challenge: CheckpointChallenge;
}

export const CHECKPOINTS_DATA: Record<string, Record<number, CheckpointData>> = {
  JS: {
    1: {
      title: 'Check-point: Introdução à Sintaxe e Variáveis',
      description:
        'Revisão geral de tipos primitivos, estruturas condicionais, de repetição, arrays e objetos.',
      challenge: {
        title: 'Filtrar Maiores de Idade',
        description:
          'Escreva uma função `filtrarMaiores(idades)` que recebe um array de números (idades) e retorna um novo array contendo apenas as idades maiores ou iguais a 18. Ex: `filtrarMaiores([14, 22, 18, 15, 30])` deve retornar `[22, 18, 30]`. Utilize métodos de array como `filter()`.',
        template: `function filtrarMaiores(idades) {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(JSON.stringify(filtrarMaiores([14, 22, 18, 15, 30])));`,
        expectedOutput: `[22,18,30]`,
      },
    },
    2: {
      title: 'Check-point: Estruturação de Código e Assincronismo',
      description: 'Revisão sobre funções, closures, manipulação de promises e consumo de APIs.',
      challenge: {
        title: 'Somar Dobro dos Pares',
        description:
          'Escreva uma função `somarDobroPares(numeros)` que recebe um array de números, filtra os números que são pares, multiplica cada um por 2 e retorna a soma de todos eles. Ex: `somarDobroPares([1, 2, 3, 4])` deve retornar `12` (2*2 + 4*2).',
        template: `function somarDobroPares(numeros) {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(somarDobroPares([1, 2, 3, 4]));`,
        expectedOutput: `12`,
      },
    },
    3: {
      title: 'Check-point: Conceitos de Baixo Nível e Performance',
      description: 'Revisão sobre o Event Loop, gerenciamento de memória, otimização e tooling.',
      challenge: {
        title: 'Fila de Tarefas Básica',
        description:
          'Implemente uma classe `TaskQueue` simples. Ela deve ter um método `add(task)` que recebe uma função síncrona, e um método `runAll()` que executa todas as tarefas na fila em ordem e depois limpa a fila. Ex: `queue.add(() => console.log("A"))` seguido de `queue.runAll()` deve imprimir as saídas correspondentes.',
        template: `class TaskQueue {
  constructor() {
    this.queue = [];
  }
  
  add(task) {
    // Adiciona tarefa
  }
  
  runAll() {
    // Executa todas e limpa a fila
  }
}`,
        checkCode: `\nconst q = new TaskQueue(); q.add(() => console.log("Task 1")); q.add(() => console.log("Task 2")); q.runAll();`,
        expectedOutput: `Task 1\nTask 2`,
      },
    },
  },
  TS: {
    1: {
      title: 'Check-point: Introdução à Tipagem Estática',
      description: 'Revisão sobre tipos primitivos, interfaces, aliases de tipo e asserções.',
      challenge: {
        title: 'Função Genérica de Identidade',
        description:
          'Escreva uma função genérica chamada `identidade<T>(valor: T): T` que apenas retorna o valor passado como argumento, mantendo a tipagem estática correspondente.',
        template: `function identidade<T>(valor: T): T {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(identidade("DevDeck"), identidade(42));`,
        expectedOutput: `DevDeck 42`,
      },
    },
    2: {
      title: 'Check-point: Genéricos e Tipagem Avançada',
      description:
        'Revisão sobre classes com modificadores, generics avancados e utilitários de tipo.',
      challenge: {
        title: 'Par de Chave e Valor Genérico',
        description:
          'Crie uma classe genérica chamada `Par<K, V>` que armazene uma `chave` de tipo `K` e um `valor` de tipo `V` no construtor (ambos devem ser de leitura pública, `readonly`). Adicione um método `obterDescricao(): string` que retorna a string `"{chave}: {valor}"`. Ex: `new Par("id", 101)` deve retornar `"id: 101"`.',
        template: `class Par<K, V> {
  // Escreva a classe aqui
  
}`,
        checkCode: `\nconst p = new Par("XP", 500); console.log(p.obterDescricao());`,
        expectedOutput: `XP: 500`,
      },
    },
    3: {
      title: 'Check-point: Arquitetura e Inferência Avançada',
      description: 'Revisão sobre tipos mapeados, guardas de tipo e decoradores.',
      challenge: {
        title: 'Guarda de Tipo Customizado',
        description:
          'Crie um Type Guard chamado `ehNumero(valor: unknown): valor is number` que verifica se um valor é do tipo `number`. A função deve retornar um predicado de tipo.',
        template: `function ehNumero(valor: unknown): valor is number {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(ehNumero(42), ehNumero("42"));`,
        expectedOutput: `true false`,
      },
    },
  },
  PYTHON: {
    1: {
      title: 'Check-point: Fundamentos de Python e Estruturas',
      description:
        'Revisão de tuplas, listas, list comprehensions, geradores e tratamento de exceções.',
      challenge: {
        title: 'Filtrar e Elevar ao Quadrado',
        description:
          'Escreva uma função `quadrados_impares(numeros)` que recebe uma lista de inteiros e, utilizando list comprehension, retorne uma nova lista contendo os quadrados apenas dos números ímpares. Ex: `quadrados_impares([1, 2, 3, 4, 5])` deve retornar `[1, 9, 25]`.',
        template: `def quadrados_impares(numeros):
    # Escreva seu código aqui
    pass`,
        checkCode: `\nprint(quadrados_impares([1, 2, 3, 4, 5]))`,
        expectedOutput: `[1, 9, 25]`,
      },
    },
    2: {
      title: 'Check-point: Modificadores de Escopo e OOP',
      description:
        'Revisão de args/kwargs, decoradores, orientação a objetos e gerenciadores de contexto.',
      challenge: {
        title: 'Decorador de Multiplicação',
        description:
          'Escreva um decorador chamado `triplicar_retorno` que triplica (multiplica por 3) o retorno da função decorada. Ex: se uma função retorna 5, a versão decorada deve retornar 15.',
        template: `def triplicar_retorno(func):
    # Escreva seu código aqui
    pass`,
        checkCode: `\n@triplicar_retorno\ndef soma(a, b):\n    return a + b\nprint(soma(2, 3))`,
        expectedOutput: `15`,
      },
    },
    3: {
      title: 'Check-point: Metaprogramação e Performance',
      description: 'Revisão de asyncio, slots, gil e profiling em Python.',
      challenge: {
        title: 'Controle de Memória com Slots',
        description:
          'Escreva uma classe chamada `Ponto` que representa coordenadas 2D (atributos `x` e `y`) e que utilize `__slots__` para otimização de memória, impedindo a criação dinâmica de outras propriedades.',
        template: `class Ponto:
    # Defina __slots__ e o __init__ correspondente
    pass`,
        checkCode: `\np = Ponto()\np.x = 10\np.y = 20\ntry:\n    p.z = 30\nexcept AttributeError:\n    print("Slots ativo")`,
        expectedOutput: `Slots ativo`,
      },
    },
  },
  RUST: {
    1: {
      title: 'Check-point: Fundamentos de Rust',
      description: 'Revisão sobre o sistema de tipos, funções e macros básicas do Rust.',
      challenge: {
        title: 'Soma de Quadrados',
        description:
          'Escreva uma função `fn soma_quadrados(a: i32, b: i32) -> i32` que retorne a soma dos quadrados de `a` e `b`. Ex: `soma_quadrados(3, 4)` deve retornar `25`.',
        template: `fn soma_quadrados(a: i32, b: i32) -> i32 {
    // Escreva seu código aqui
    
}`,
        checkCode: `\nfn main() { println!("{}", soma_quadrados(3, 4)); }`,
        expectedOutput: `25`,
      },
    },
    2: {
      title: 'Check-point: Estruturação e Ownership',
      description: 'Revisão sobre o sistema de Ownership e Borrowing do Rust.',
      challenge: {
        title: 'Dobrar Valor',
        description:
          'Escreva uma função `fn dobrar(val: i32) -> i32` que retorne o dobro de `val`.',
        template: `fn dobrar(val: i32) -> i32 {
    // Escreva seu código aqui
    
}`,
        checkCode: `\nfn main() { println!("{}", dobrar(8)); }`,
        expectedOutput: `16`,
      },
    },
    3: {
      title: 'Check-point: Segurança e Tipagem',
      description: 'Revisão de segurança de memória e concorrência no Rust.',
      challenge: {
        title: 'Verificação de Paridade',
        description:
          'Escreva uma função `fn eh_par(val: i32) -> bool` que retorne true se o valor for par.',
        template: `fn eh_par(val: i32) -> bool {
    // Escreva seu código aqui
    
}`,
        checkCode: `\nfn main() { println!("{} {}", eh_par(4), eh_par(7)); }`,
        expectedOutput: `true false`,
      },
    },
  },
  GO: {
    1: {
      title: 'Check-point: Fundamentos de Go',
      description: 'Revisão da sintaxe básica, condicionais e concorrência em Go.',
      challenge: {
        title: 'Soma em Go',
        description:
          'Escreva uma função `func soma(a int, b int) int` que retorne a soma de `a` e `b`.',
        template: `func soma(a int, b int) int {
    // Escreva seu código aqui
    
}`,
        checkCode: `\nfunc main() { fmt.Println(soma(5, 7)) }`,
        expectedOutput: `12`,
      },
    },
    2: {
      title: 'Check-point: Estruturas e Canais',
      description: 'Revisão de Structs, Go-routines e Canais.',
      challenge: {
        title: 'Calcular Quadrado',
        description: 'Escreva uma função `func quadrado(n int) int` que retorne o quadrado de `n`.',
        template: `func quadrado(n int) int {
    // Escreva seu código aqui
    
}`,
        checkCode: `\nfunc main() { fmt.Println(quadrado(9)) }`,
        expectedOutput: `81`,
      },
    },
    3: {
      title: 'Check-point: Práticas Avançadas em Go',
      description: 'Revisão sobre interfaces e tratamento de erros avançado.',
      challenge: {
        title: 'Verificar Paridade',
        description:
          'Escreva uma função `func ehPar(n int) bool` que retorne true se o número for par.',
        template: `func ehPar(n int) bool {
    // Escreva seu código aqui
    
}`,
        checkCode: `\nfunc main() { fmt.Println(ehPar(10), ehPar(11)) }`,
        expectedOutput: `true false`,
      },
    },
  },
  JAVA: {
    1: {
      title: 'Check-point: Fundamentos de Java',
      description: 'Revisão sobre POO, tipos estáticos e estruturas fundamentais em Java.',
      challenge: {
        title: 'Soma Estática',
        description:
          'Escreva um método `public static int soma(int a, int b)` dentro da classe `Solucao` que retorne a soma dos argumentos.',
        template: `class Solucao {
    public static int soma(int a, int b) {
        // Escreva seu código aqui
        
    }
}`,
        checkCode: `\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Solucao.soma(5, 7));\n    }\n}`,
        expectedOutput: `12`,
      },
    },
    2: {
      title: 'Check-point: Estruturação e Coleções',
      description: 'Revisão sobre Coleções e Generics em Java.',
      challenge: {
        title: 'Dobro de um Número',
        description:
          'Escreva um método `public static int dobro(int n)` na classe `Solucao` que retorne o dobro de `n`.',
        template: `class Solucao {
    public static int dobro(int n) {
        // Escreva seu código aqui
        
    }
}`,
        checkCode: `\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Solucao.dobro(8));\n    }\n}`,
        expectedOutput: `16`,
      },
    },
    3: {
      title: 'Check-point: Concorrência e Streams',
      description: 'Revisão sobre Java Streams e concorrência multithread.',
      challenge: {
        title: 'Checar Paridade',
        description:
          'Escreva um método `public static boolean ehPar(int n)` na classe `Solucao` que retorne `true` se o número for par.',
        template: `class Solucao {
    public static boolean ehPar(int n) {
        // Escreva seu código aqui
        
    }
}`,
        checkCode: `\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Solucao.ehPar(4) + " " + Solucao.ehPar(7));\n    }\n}`,
        expectedOutput: `true false`,
      },
    },
  },
};
