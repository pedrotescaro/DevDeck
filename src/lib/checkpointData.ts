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
      title: 'Check-point 1: Introdução à Sintaxe e Variáveis',
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
      title: 'Check-point 2: Estruturas de Controle e Fluxo',
      description: 'Revisão de condicionais, loops e transformações com arrays.',
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
      title: 'Check-point 3: Funções, Closures e Escopo',
      description: 'Revisão de funções de alta ordem, closures e modularização.',
      challenge: {
        title: 'Criador de Contador com Closure',
        description:
          'Escreva uma função `criarContador(inicial)` que retorna uma função. Cada vez que a função retornada for executada, ela deve incrementar o valor e retornar o novo número atualizado. Ex: `const c = criarContador(5); c(); c();` deve retornar 6 e 7.',
        template: `function criarContador(inicial = 0) {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconst c = criarContador(10); console.log(c(), c(), c());`,
        expectedOutput: `11 12 13`,
      },
    },
    4: {
      title: 'Check-point 4: Estruturas de Dados e Coleções',
      description: 'Revisão sobre Map, Set, objetos e agrupamento de dados.',
      challenge: {
        title: 'Frequência de Palavras',
        description:
          'Escreva uma função `contarFrequencia(palavras)` que recebe um array de strings e retorna um objeto onde as chaves são as palavras e os valores são a quantidade de ocorrências. Ex: `contarFrequencia(["js", "ts", "js"])` deve retornar `{"js":2,"ts":1}`.',
        template: `function contarFrequencia(palavras) {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(JSON.stringify(contarFrequencia(["js", "ts", "js", "go", "ts", "js"])));`,
        expectedOutput: `{"js":3,"ts":2,"go":1}`,
      },
    },
    5: {
      title: 'Check-point 5: Programação Orientada a Objetos',
      description: 'Revisão de classes ES6, encapsulamento e métodos.',
      challenge: {
        title: 'Classe Conta Bancária',
        description:
          'Crie uma classe `ContaBancaria` com saldo inicial no construtor. Adicione um método `depositar(valor)` que soma ao saldo, um método `sacar(valor)` que subtrai se houver saldo suficiente, e um getter `saldoAtual` que retorna o saldo formatado como número.',
        template: `class ContaBancaria {
  constructor(saldoInicial = 0) {
    this._saldo = saldoInicial;
  }
  
  depositar(valor) {
    // Implemente
  }
  
  sacar(valor) {
    // Implemente
  }
  
  get saldoAtual() {
    // Implemente
  }
}`,
        checkCode: `\nconst conta = new ContaBancaria(100); conta.depositar(50); conta.sacar(30); console.log(conta.saldoAtual);`,
        expectedOutput: `120`,
      },
    },
    6: {
      title: 'Check-point 6: Tratamento de Erros e Validação',
      description: 'Revisão sobre blocos try/catch e exceções customizadas.',
      challenge: {
        title: 'Parser JSON Seguro',
        description:
          'Escreva uma função `parseJSONSeguro(texto, fallback)` que tenta realizar o parse de uma string JSON com `JSON.parse`. Se o JSON for inválido, deve capturar o erro e retornar o valor de `fallback` sem quebrar a aplicação.',
        template: `function parseJSONSeguro(texto, fallback = null) {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(parseJSONSeguro('{"nome":"Stacklyst"}').nome, parseJSONSeguro('invalido', 'PADRAO'));`,
        expectedOutput: `Stacklyst PADRAO`,
      },
    },
    7: {
      title: 'Check-point 7: Assincronismo e Promises',
      description: 'Revisão sobre Promises, async/await e Promise.all.',
      challenge: {
        title: 'Fila de Tarefas Simples',
        description:
          'Implemente uma classe `TaskQueue` simples. Ela deve ter um método `add(task)` que recebe uma função síncrona, e um método `runAll()` que executa todas as tarefas na fila em ordem e depois limpa a fila.',
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
    8: {
      title: 'Check-point 8: Projeto Final e Padrões',
      description: 'Consolidação de padrões de projeto e engenharia em JavaScript.',
      challenge: {
        title: 'Emissor de Eventos (Event Emitter)',
        description:
          'Crie uma classe `EventEmitter` com métodos `on(evento, callback)` para registrar ouvintes e `emit(evento, dados)` para disparar todos os callbacks registrados para aquele evento na ordem.',
        template: `class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    // Implemente
  }
  
  emit(event, data) {
    // Implemente
  }
}`,
        checkCode: `\nconst em = new EventEmitter(); em.on("login", user => console.log("Bem-vindo " + user)); em.emit("login", "Dev");`,
        expectedOutput: `Bem-vindo Dev`,
      },
    },
  },
  TS: {
    1: {
      title: 'Check-point 1: Introdução à Tipagem Estática',
      description: 'Revisão sobre tipos primitivos, interfaces, aliases de tipo e asserções.',
      challenge: {
        title: 'Função Genérica de Identidade',
        description:
          'Escreva uma função genérica chamada `identidade<T>(valor: T): T` que apenas retorna o valor passado como argumento, mantendo a tipagem estática correspondente.',
        template: `function identidade<T>(valor: T): T {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(identidade("Stacklyst"), identidade(42));`,
        expectedOutput: `Stacklyst 42`,
      },
    },
    2: {
      title: 'Check-point 2: Interfaces e Classes Genéricas',
      description:
        'Revisão sobre classes com modificadores, generics avançados e propriedades readonly.',
      challenge: {
        title: 'Par de Chave e Valor Genérico',
        description:
          'Crie uma classe genérica chamada `Par<K, V>` que armazene uma `chave` de tipo `K` e um `valor` de tipo `V` no construtor (ambos readonly). Adicione um método `obterDescricao(): string` que retorna `"{chave}: {valor}"`.',
        template: `class Par<K, V> {
  // Escreva a classe aqui
  
}`,
        checkCode: `\nconst p = new Par("XP", 500); console.log(p.obterDescricao());`,
        expectedOutput: `XP: 500`,
      },
    },
    3: {
      title: 'Check-point 3: Guardas de Tipo e Predicados',
      description: 'Revisão sobre Type Guards com operador is e narrowing seguro.',
      challenge: {
        title: 'Guarda de Tipo Customizado',
        description:
          'Crie um Type Guard chamado `ehNumero(valor: unknown): valor is number` que verifica se um valor é do tipo `number` e não é `NaN`.',
        template: `function ehNumero(valor: unknown): valor is number {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(ehNumero(42), ehNumero("42"));`,
        expectedOutput: `true false`,
      },
    },
    4: {
      title: 'Check-point 4: Tipos Mapeados e Utilitários',
      description: 'Manipulação avançada de chaves com keyof e Pick/Omit.',
      challenge: {
        title: 'Extrator de Propriedades',
        description:
          'Escreva uma função genérica `obterPropriedade<T, K extends keyof T>(obj: T, chave: K): T[K]` que retorna com segurança de tipos o valor da propriedade `chave` do objeto `obj`.',
        template: `function obterPropriedade<T, K extends keyof T>(obj: T, chave: K): T[K] {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(obterPropriedade({ id: 101, nome: "Stacklyst" }, "nome"));`,
        expectedOutput: `Stacklyst`,
      },
    },
    5: {
      title: 'Check-point 5: União Discriminada e Exhaustive Check',
      description: 'Modelagem de estados e checagem de tipos estrita com never.',
      challenge: {
        title: 'Formatador de Resposta de API',
        description:
          'Dada a união `type Resposta = { status: "sucesso"; dados: string } | { status: "erro"; mensagem: string }`, crie uma função `formatarResposta(res: Resposta): string` que retorna os dados ou a mensagem de erro.',
        template: `type Resposta = 
  | { status: "sucesso"; dados: string }
  | { status: "erro"; mensagem: string };

function formatarResposta(res: Resposta): string {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(formatarResposta({ status: "sucesso", dados: "OK 200" }), formatarResposta({ status: "erro", mensagem: "Falha 500" }));`,
        expectedOutput: `OK 200 Falha 500`,
      },
    },
    6: {
      title: 'Check-point 6: Tipos Condicionais e infer',
      description: 'Dedução de tipos estáticos com extends e infer.',
      challenge: {
        title: 'Desempacotador de Array',
        description:
          'Escreva uma função genérica `primeiroItem<T extends any[]>(lista: T): T[0] | undefined` que retorna o primeiro item do array preservando sua tipagem estática exata.',
        template: `function primeiroItem<T extends any[]>(lista: T): T[0] | undefined {
  // Escreva seu código aqui
  
}`,
        checkCode: `\nconsole.log(primeiroItem(["Stacklyst", "TypeScript"]), primeiroItem([10, 20]));`,
        expectedOutput: `Stacklyst 10`,
      },
    },
    7: {
      title: 'Check-point 7: EventEmitter Type-Safe',
      description: 'Sistemas de eventos desacoplados fortemente tipados.',
      challenge: {
        title: 'Event Emitter Tipado',
        description:
          'Crie uma classe genérica `TypedEmitter<TEvents extends Record<string, any>>` com métodos `on<K extends keyof TEvents>(evento: K, listener: (dados: TEvents[K]) => void)` e `emit<K extends keyof TEvents>(evento: K, dados: TEvents[K])`.',
        template: `class TypedEmitter<TEvents extends Record<string, any>> {
  private handlers: { [K in keyof TEvents]?: Array<(data: TEvents[K]) => void> } = {};

  on<K extends keyof TEvents>(event: K, listener: (data: TEvents[K]) => void) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event]!.push(listener);
  }

  emit<K extends keyof TEvents>(event: K, data: TEvents[K]) {
    this.handlers[event]?.forEach(fn => fn(data));
  }
}`,
        checkCode: `\nconst emitter = new TypedEmitter<{ alerta: string }>(); emitter.on("alerta", msg => console.log("Alerta: " + msg)); emitter.emit("alerta", "Sistema OK");`,
        expectedOutput: `Alerta: Sistema OK`,
      },
    },
    8: {
      title: 'Check-point 8: Projeto Final Type-Safe',
      description: 'Validação e tipagem estrita de ponta a ponta.',
      challenge: {
        title: 'Resultado Monádico (Result Type)',
        description:
          'Crie classes `Ok<T>` e `Err<E>` que implementem uma interface comum `Result<T, E>`. A classe `Ok` deve ter `isOk = true` e `valor: T`, e a classe `Err` deve ter `isOk = false` e `erro: E`.',
        template: `class Ok<T> {
  readonly isOk = true;
  constructor(public readonly valor: T) {}
}

class Err<E> {
  readonly isOk = false;
  constructor(public readonly erro: E) {}
}`,
        checkCode: `\nconst r1 = new Ok("Sucesso"); const r2 = new Err("Falha"); console.log(r1.isOk, r1.valor, r2.isOk, r2.erro);`,
        expectedOutput: `true Sucesso false Falha`,
      },
    },
  },
  PYTHON: {
    1: {
      title: 'Check-point 1: Fundamentos de Python e Estruturas',
      description: 'Revisão de tuplas, listas, list comprehensions e formatação de texto.',
      challenge: {
        title: 'Filtrar e Elevar ao Quadrado',
        description:
          'Escreva uma função `quadrados_impares(numeros)` que recebe uma lista de inteiros e, utilizando list comprehension, retorne uma nova lista contendo os quadrados apenas dos números ímpares.',
        template: `def quadrados_impares(numeros):
    # Escreva seu código aqui
    pass`,
        checkCode: `\nprint(quadrados_impares([1, 2, 3, 4, 5]))`,
        expectedOutput: `[1, 9, 25]`,
      },
    },
    2: {
      title: 'Check-point 2: Controle de Fluxo e Match Case',
      description: 'Revisão de loops, condicionais e pattern matching no Python.',
      challenge: {
        title: 'Classificador de HTTP Status',
        description:
          'Escreva uma função `classificar_status(codigo)` que recebe um número inteiro de status HTTP e retorna "Sucesso" para 200..299, "Cliente" para 400..499, "Servidor" para 500..599 e "Outro" para os demais.',
        template: `def classificar_status(codigo):
    # Escreva seu código aqui
    pass`,
        checkCode: `\nprint(classificar_status(200), classificar_status(404), classificar_status(500))`,
        expectedOutput: `Sucesso Cliente Servidor`,
      },
    },
    3: {
      title: 'Check-point 3: Decoradores e Funções de Alta Ordem',
      description: 'Revisão de args/kwargs, decoradores e closures.',
      challenge: {
        title: 'Decorador de Multiplicação',
        description:
          'Escreva um decorador chamado `triplicar_retorno` que triplica (multiplica por 3) o retorno da função decorada.',
        template: `def triplicar_retorno(func):
    # Escreva seu código aqui
    pass`,
        checkCode: `\n@triplicar_retorno\ndef soma(a, b):\n    return a + b\nprint(soma(2, 3))`,
        expectedOutput: `15`,
      },
    },
    4: {
      title: 'Check-point 4: Dicionários e Coleções Avançadas',
      description: 'Revisão de dict comprehensions, Counter e defaultdict.',
      challenge: {
        title: 'Inversor de Dicionário',
        description:
          'Escreva uma função `inverter_dicionario(d)` que usa Dict Comprehension para inverter as chaves e valores de um dicionário.',
        template: `def inverter_dicionario(d):
    # Escreva seu código aqui
    pass`,
        checkCode: `\nprint(inverter_dicionario({"a": 1, "b": 2}))`,
        expectedOutput: `{1: 'a', 2: 'b'}`,
      },
    },
    5: {
      title: 'Check-point 5: Classes e Métodos Mágicos',
      description: 'Revisão de orientação a objetos, `__str__` e `@property`.',
      challenge: {
        title: 'Classe Retângulo',
        description:
          'Crie uma classe `Retangulo` com `largura` e `altura` no `__init__`. Adicione uma `@property` chamada `area` que calcula e retorna a área (`largura * altura`).',
        template: `class Retangulo:
    def __init__(self, largura, altura):
        self.largura = largura
        self.altura = altura

    @property
    def area(self):
        # Implemente
        pass`,
        checkCode: `\nr = Retangulo(4, 5)\nprint(r.area)`,
        expectedOutput: `20`,
      },
    },
    6: {
      title: 'Check-point 6: Gerenciadores de Contexto (with)',
      description: 'Protocolo de contexto com `__enter__` e `__exit__`.',
      challenge: {
        title: 'Context Manager de Bloco',
        description:
          'Crie uma classe `TemporizadorSilencioso` que funcione com `with` imprimindo "Iniciando" no `__enter__` e "Finalizado" no `__exit__`.',
        template: `class TemporizadorSilencioso:
    def __enter__(self):
        print("Iniciando")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Finalizado")`,
        checkCode: `\nwith TemporizadorSilencioso():\n    print("Executando")`,
        expectedOutput: `Iniciando\nExecutando\nFinalizado`,
      },
    },
    7: {
      title: 'Check-point 7: Geradores e Yield',
      description: 'Produção preguiçosa de dados com funções geradoras.',
      challenge: {
        title: 'Gerador de Fibonacci',
        description:
          'Escreva uma função geradora `fibonacci(n)` que usa `yield` para produzir os primeiros `n` números da sequência de Fibonacci (iniciando em 0, 1, 1, 2...).',
        template: `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b`,
        checkCode: `\nprint(list(fibonacci(6)))`,
        expectedOutput: `[0, 1, 1, 2, 3, 5]`,
      },
    },
    8: {
      title: 'Check-point 8: Projeto Final e Engenharia Python',
      description: 'Consolidação de type hints, dataclasses e arquitetura limpa.',
      challenge: {
        title: 'Pipeline de Dados Funcional',
        description:
          'Escreva uma função `pipeline_processamento(valores)` que recebe uma lista de números, filtra os positivos, multiplica cada um por 10 e retorna a soma total.',
        template: `def pipeline_processamento(valores):
    # Implemente
    pass`,
        checkCode: `\nprint(pipeline_processamento([-5, 2, -1, 4, 10]))`,
        expectedOutput: `160`,
      },
    },
  },
  RUST: {
    1: {
      title: 'Check-point 1: Fundamentos e Variáveis',
      description: 'Revisão de mutabilidade, tipos primitivos e funções.',
      challenge: {
        title: 'Dobro dos Valores Positivos',
        description:
          'Escreva uma função `fn dobrar_positivos(v: &[i32]) -> Vec<i32>` que recebe um slice de inteiros e retorna um novo vetor contendo o dobro apenas dos números maiores que zero.',
        template: `fn dobrar_positivos(v: &[i32]) -> Vec<i32> {
    // Escreva seu código aqui
    
}`,
        checkCode: `\nprintln!("{:?}", dobrar_positivos(&[-2, 3, 0, 5]));`,
        expectedOutput: `[6, 10]`,
      },
    },
    2: {
      title: 'Check-point 2: Structs e Blocos impl',
      description: 'Definição de estruturas e métodos com &self.',
      challenge: {
        title: 'Área do Retângulo',
        description:
          'Crie uma struct `Retangulo { largura: u32, altura: u32 }` e implemente um método `fn area(&self) -> u32` que calcula a área multiplicando largura por altura.',
        template: `struct Retangulo {
    largura: u32,
    altura: u32,
}

impl Retangulo {
    fn area(&self) -> u32 {
        // Implemente
    }
}`,
        checkCode: `\nlet r = Retangulo { largura: 6, altura: 7 }; println!("{}", r.area());`,
        expectedOutput: `42`,
      },
    },
    3: {
      title: 'Check-point 3: Tratamento de Erros com Result',
      description: 'Revisão de Result, Ok e Err no Rust.',
      challenge: {
        title: 'Divisão Segura',
        description:
          'Escreva uma função `fn dividir_seguro(a: i32, b: i32) -> Result<i32, String>` que retorna `Ok(a / b)` se `b != 0` ou `Err("Divisão por zero".to_string())` se `b == 0`.',
        template: `fn dividir_seguro(a: i32, b: i32) -> Result<i32, String> {
    // Escreva seu código aqui
    
}`,
        checkCode: `\nprintln!("{:?} {:?}", dividir_seguro(10, 2), dividir_seguro(10, 0));`,
        expectedOutput: `Ok(5) Err("Divisão por zero")`,
      },
    },
    4: {
      title: 'Check-point 4: Enums e Pattern Matching',
      description: 'Revisão de enums algébricos e match exaustivo.',
      challenge: {
        title: 'Avaliador de Mensagens',
        description:
          'Dado o enum `enum Mensagem { Texto(String), Sair }`, implemente uma função `fn processar_msg(m: Mensagem) -> String` que retorna o texto ou "Encerrado".',
        template: `enum Mensagem {
    Texto(String),
    Sair,
}

fn processar_msg(m: Mensagem) -> String {
    match m {
        Mensagem::Texto(t) => t,
        Mensagem::Sair => "Encerrado".to_string(),
    }
}`,
        checkCode: `\nprintln!("{} {}", processar_msg(Mensagem::Texto("Stacklyst".into())), processar_msg(Mensagem::Sair));`,
        expectedOutput: `Stacklyst Encerrado`,
      },
    },
    5: {
      title: 'Check-point 5: Traits e Polimorfismo Estático',
      description: 'Contratos de comportamento com traits e trait bounds.',
      challenge: {
        title: 'Trait de Descrição',
        description:
          'Defina uma trait `Descrevivel` com o método `fn descrever(&self) -> String;` e implemente-a para uma struct `Item { nome: String }`.',
        template: `trait Descrevivel {
    fn descrever(&self) -> String;
}

struct Item {
    nome: String,
}

impl Descrevivel for Item {
    fn descrever(&self) -> String {
        format!("Item: {}", self.nome)
    }
}`,
        checkCode: `\nlet item = Item { nome: "Espada".to_string() }; println!("{}", item.descrever());`,
        expectedOutput: `Item: Espada`,
      },
    },
    6: {
      title: 'Check-point 6: Coleções e HashMap',
      description: 'Contagem e agregação de dados com HashMap e Entry API.',
      challenge: {
        title: 'Contador de Ocorrências com Entry',
        description:
          'Escreva uma função `fn contar_freq(palavras: &[&str]) -> std::collections::HashMap<String, u32>` que usa `.entry().or_insert(0)` para contar a frequência de cada palavra.',
        template: `use std::collections::HashMap;

fn contar_freq(palavras: &[&str]) -> HashMap<String, u32> {
    let mut mapa = HashMap::new();
    for &p in palavras {
        *mapa.entry(p.to_string()).or_insert(0) += 1;
    }
    mapa
}`,
        checkCode: `\nlet m = contar_freq(&["rust", "go", "rust"]); println!("{}", m.get("rust").unwrap_or(&0));`,
        expectedOutput: `2`,
      },
    },
    7: {
      title: 'Check-point 7: Smart Pointers e Lifetimes',
      description: 'Alocação na heap com Box e contagem de referências.',
      challenge: {
        title: 'Nó de Lista com Box',
        description:
          'Defina uma struct `Nodo { valor: i32, proximo: Option<Box<Nodo>> }` e crie uma função que constrói uma lista encadeada com dois nós (1 -> 2).',
        template: `struct Nodo {
    valor: i32,
    proximo: Option<Box<Nodo>>,
}

fn criar_dois_nos(v1: i32, v2: i32) -> Nodo {
    Nodo {
        valor: v1,
        proximo: Some(Box::new(Nodo { valor: v2, proximo: None })),
    }
}`,
        checkCode: `\nlet n = criar_dois_nos(10, 20); println!("{} -> {}", n.valor, n.proximo.unwrap().valor);`,
        expectedOutput: `10 -> 20`,
      },
    },
    8: {
      title: 'Check-point 8: Concorrência e Canais mpsc',
      description: 'Comunicação entre threads com passagem de mensagens.',
      challenge: {
        title: 'Canal de Mensagens Multithread',
        description:
          'Use `std::sync::mpsc::channel()` e `std::thread::spawn` para enviar um número de uma thread secundária e recebê-lo na thread principal.',
        template: `use std::sync::mpsc;
use std::thread;

fn enviar_e_receber(valor: i32) -> i32 {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        tx.send(valor * 2).unwrap();
    });
    rx.recv().unwrap()
}`,
        checkCode: `\nprintln!("{}", enviar_e_receber(21));`,
        expectedOutput: `42`,
      },
    },
  },
  GO: {
    1: {
      title: 'Check-point 1: Fundamentos e Slices',
      description: 'Revisão de slices, loops for e cálculo de médias.',
      challenge: {
        title: 'Média de Números Positivos',
        description:
          'Escreva uma função `CalcularMedia(nums []float64) float64` que recebe um slice de floats e retorna a média aritmética simples de seus valores.',
        template: `func CalcularMedia(nums []float64) float64 {
    if len(nums) == 0 {
        return 0
    }
    var soma float64
    for _, n := range nums {
        soma += n
    }
    return soma / float64(len(nums))
}`,
        checkCode: `\nfmt.Println(CalcularMedia([]float64{10, 20, 30}))`,
        expectedOutput: `20`,
      },
    },
    2: {
      title: 'Check-point 2: Funções e Múltiplos Retornos',
      description: 'Padrão idiomático de retorno de erro no Go.',
      challenge: {
        title: 'Divisão Segura com Error',
        description:
          'Escreva uma função `Dividir(a, b int) (int, error)` que retorna `(a/b, nil)` se `b != 0` ou `(0, errors.New("divisao por zero"))` se `b == 0`.',
        template: `import "errors"

func Dividir(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("divisao por zero")
    }
    return a / b, nil
}`,
        checkCode: `\nres, err := Dividir(20, 4); fmt.Println(res, err == nil)`,
        expectedOutput: `5 true`,
      },
    },
    3: {
      title: 'Check-point 3: Structs e Pointer Receivers',
      description: 'Receptores de ponteiro para mutação de estado em métodos.',
      challenge: {
        title: 'Estrutura Contador',
        description:
          'Defina uma struct `Contador { valor int }` com um método `(c *Contador) Incrementar()` que soma 1 e um método `(c *Contador) Obter() int` que retorna o valor.',
        template: `type Contador struct {
    valor int
}

func (c *Contador) Incrementar() {
    c.valor++
}

func (c *Contador) Obter() int {
    return c.valor
}`,
        checkCode: `\nvar c Contador; c.Incrementar(); c.Incrementar(); fmt.Println(c.Obter())`,
        expectedOutput: `2`,
      },
    },
    4: {
      title: 'Check-point 4: Maps e Agregação de Dados',
      description: 'Manipulação de mapas e verificação comma-ok.',
      challenge: {
        title: 'Contador de Palavras em Go',
        description:
          'Escreva uma função `ContarPalavras(palavras []string) map[string]int` que retorna um mapa com a frequência de cada palavra.',
        template: `func ContarPalavras(palavras []string) map[string]int {
    m := make(map[string]int)
    for _, p := range palavras {
        m[p]++
    }
    return m
}`,
        checkCode: `\nm := ContarPalavras([]string{"go", "rust", "go"}); fmt.Println(m["go"], m["rust"])`,
        expectedOutput: `2 1`,
      },
    },
    5: {
      title: 'Check-point 5: Interfaces e Polimorfismo Implícito',
      description: 'Implementação implícita de interfaces em Go.',
      challenge: {
        title: 'Interface Formatador',
        description:
          'Defina uma interface `Formatador` com o método `Formatar() string` e implemente-a para a struct `Texto { Conteudo string }`.',
        template: `type Formatador interface {
    Formatar() string
}

type Texto struct {
    Conteudo string
}

func (t Texto) Formatar() string {
    return "[" + t.Conteudo + "]"
}`,
        checkCode: `\nvar f Formatador = Texto{Conteudo: "Stacklyst"}; fmt.Println(f.Formatar())`,
        expectedOutput: `[Stacklyst]`,
      },
    },
    6: {
      title: 'Check-point 6: Defer e Gerenciamento de Recursos',
      description: 'Execução postergada LIFO para limpeza de recursos.',
      challenge: {
        title: 'Rastreador com Defer',
        description:
          'Escreva uma função que usa `defer` para garantir que uma mensagem de encerramento seja impressa após o corpo principal.',
        template: `func ExecutarComLog() {
    defer fmt.Println("Fim")
    fmt.Println("Inicio")
}`,
        checkCode: `\nExecutarComLog()`,
        expectedOutput: `Inicio\nFim`,
      },
    },
    7: {
      title: 'Check-point 7: Goroutines e Canais',
      description: 'Concorrência com go e canais de comunicação.',
      challenge: {
        title: 'Canal de Resposta Assíncrona',
        description:
          'Escreva uma função `CalcularAssincrono(n int) int` que dispara uma goroutine para calcular `n * 3`, envia o resultado por um canal e retorna o valor recebido.',
        template: `func CalcularAssincrono(n int) int {
    ch := make(chan int)
    go func() {
        ch <- n * 3
    }()
    return <-ch
}`,
        checkCode: `\nfmt.Println(CalcularAssincrono(14))`,
        expectedOutput: `42`,
      },
    },
    8: {
      title: 'Check-point 8: Generics e Concorrência Avançada',
      description: 'Genéricos [T any] e sync.WaitGroup em pipelines concorrentes.',
      challenge: {
        title: 'Inversor Genérico de Slices',
        description:
          'Escreva uma função genérica `InverterSlice[T any](s []T) []T` que retorna uma cópia invertida do slice fornecido.',
        template: `func InverterSlice[T any](s []T) []T {
    res := make([]T, len(s))
    for i, v := range s {
        res[len(s)-1-i] = v
    }
    return res
}`,
        checkCode: `\nfmt.Println(InverterSlice([]int{1, 2, 3}), InverterSlice([]string{"a", "b"}))`,
        expectedOutput: `[3 2 1] [b a]`,
      },
    },
  },
  JAVA: {
    1: {
      title: 'Check-point 1: Fundamentos da JVM e Strings',
      description: 'Revisão de tipos primitivos, operadores e manipulação com StringBuilder.',
      challenge: {
        title: 'Inversor de Strings',
        description:
          'Escreva um método estático `public static String inverter(String s)` que usa `StringBuilder` para inverter o texto recebido.',
        template: `public class Solucao {
    public static String inverter(String s) {
        return new StringBuilder(s).reverse().toString();
    }
}`,
        checkCode: `\nSystem.out.println(Solucao.inverter("Stacklyst"));`,
        expectedOutput: `tsylkcatS`,
      },
    },
    2: {
      title: 'Check-point 2: Records e Imutabilidade (Java 16+)',
      description: 'Criação concisa de portadores de dados com record.',
      challenge: {
        title: 'Record Produto com Desconto',
        description:
          'Crie um `public record Produto(String nome, double preco)` com um método `public double precoComDesconto(double percentual)` que retorna o preço calculado com o desconto aplicado.',
        template: `public record Produto(String nome, double preco) {
    public double precoComDesconto(double percentual) {
        return this.preco * (1.0 - (percentual / 100.0));
    }
}`,
        checkCode: `\nProduto p = new Produto("Curso", 100.0); System.out.println((int) p.precoComDesconto(15.0));`,
        expectedOutput: `85`,
      },
    },
    3: {
      title: 'Check-point 3: Streams API e Lambdas',
      description: 'Pipelines declarativos com filter, map e toList.',
      challenge: {
        title: 'Filtrar Pares e Dobrar com Streams',
        description:
          'Escreva um método estático `public static List<Integer> processar(List<Integer> nums)` que filtra apenas os números pares, multiplica por 2 e retorna a nova lista.',
        template: `import java.util.List;
import java.util.stream.Collectors;

public class Solucao {
    public static List<Integer> processar(List<Integer> nums) {
        return nums.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * 2)
            .collect(Collectors.toList());
    }
}`,
        checkCode: `\nSystem.out.println(Solucao.processar(List.of(1, 2, 3, 4)));`,
        expectedOutput: `[4, 8]`,
      },
    },
    4: {
      title: 'Check-point 4: Interfaces e Polimorfismo',
      description: 'Contratos e métodos default em interfaces Java.',
      challenge: {
        title: 'Interface Calculadora de Imposto',
        description:
          'Crie uma interface `Tributavel` com o método `double getValorImposto();` e implemente-a em uma classe `Servico` com o campo `double valor` onde o imposto é 10% do valor.',
        template: `interface Tributavel {
    double getValorImposto();
}

class Servico implements Tributavel {
    private final double valor;
    public Servico(double valor) { this.valor = valor; }
    @Override
    public double getValorImposto() { return this.valor * 0.10; }
}`,
        checkCode: `\nTributavel t = new Servico(500.0); System.out.println((int) t.getValorImposto());`,
        expectedOutput: `50`,
      },
    },
    5: {
      title: 'Check-point 5: Java Collections e Agrupamento',
      description: 'Agregação com Collectors.groupingBy e Mapas.',
      challenge: {
        title: 'Agrupamento por Paridade',
        description:
          'Escreva um método `agruparPorParidade(List<Integer> nums)` que retorna um `Map<Boolean, List<Integer>>` separando números pares de ímpares com `Collectors.partitioningBy`.',
        template: `import java.util.*;
import java.util.stream.Collectors;

public class Solucao {
    public static Map<Boolean, List<Integer>> agruparPorParidade(List<Integer> nums) {
        return nums.stream().collect(Collectors.partitioningBy(n -> n % 2 == 0));
    }
}`,
        checkCode: `\nMap<Boolean, List<Integer>> m = Solucao.agruparPorParidade(List.of(1, 2, 3, 4)); System.out.println(m.get(true));`,
        expectedOutput: `[2, 4]`,
      },
    },
    6: {
      title: 'Check-point 6: Try-with-resources e AutoCloseable',
      description: 'Gerenciamento automático de recursos I/O.',
      challenge: {
        title: 'Recurso Customizado AutoCloseable',
        description:
          'Crie uma classe `ConexaoSimulada` que implemente `AutoCloseable` imprimindo "Conectado" no construtor e "Fechado" no método `close()`.',
        template: `public class ConexaoSimulada implements AutoCloseable {
    public ConexaoSimulada() { System.out.println("Conectado"); }
    @Override
    public void close() { System.out.println("Fechado"); }
}`,
        checkCode: `\ntry (ConexaoSimulada c = new ConexaoSimulada()) { System.out.println("Em uso"); }`,
        expectedOutput: `Conectado\nEm uso\nFechado`,
      },
    },
    7: {
      title: 'Check-point 7: Programação Assíncrona com CompletableFuture',
      description: 'Pipelines assíncronos e composição de futures.',
      challenge: {
        title: 'Pipeline Assíncrono com thenApply',
        description:
          'Escreva um método que inicia um `CompletableFuture.supplyAsync()`, transforma o resultado com `.thenApply()` e retorna o valor com `.join()`.',
        template: `import java.util.concurrent.CompletableFuture;

public class Solucao {
    public static String executarAsync(String entrada) {
        return CompletableFuture.supplyAsync(() -> entrada.toUpperCase())
            .thenApply(s -> "[" + s + "]")
            .join();
    }
}`,
        checkCode: `\nSystem.out.println(Solucao.executarAsync("stacklyst"));`,
        expectedOutput: `[STACKLYST]`,
      },
    },
    8: {
      title: 'Check-point 8: Projeto Final Corporativo',
      description: 'Padrão Repository Genérico com validação em memória.',
      challenge: {
        title: 'Repositório Genérico em Memória',
        description:
          'Crie uma classe genérica `RepositorioMemoria<T>` com um `Map<String, T>` interno e métodos `salvar(String id, T item)` e `Optional<T> buscar(String id)`.',
        template: `import java.util.*;

public class RepositorioMemoria<T> {
    private final Map<String, T> banco = new HashMap<>();

    public void salvar(String id, T item) {
        banco.put(id, item);
    }

    public Optional<T> buscar(String id) {
        return Optional.ofNullable(banco.get(id));
    }
}`,
        checkCode: `\nRepositorioMemoria<String> repo = new RepositorioMemoria<>(); repo.salvar("1", "Dev"); System.out.println(repo.buscar("1").orElse("Nao encontrado"));`,
        expectedOutput: `Dev`,
      },
    },
  },
};
