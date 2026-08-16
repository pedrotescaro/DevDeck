import type { TrailLevel } from '../trailsData';

export const JAVA_TRAIL: TrailLevel[] = [
  // ── SEÇÃO 1: Fundamentos da JVM & Sintaxe Java ──
  {
    levelNumber: 1,
    title: 'Estrutura da JVM & Método Main',
    description:
      'Compilação para Bytecode, execução na JVM e assinatura do public static void main.',
    unitNumber: 1,
    unitTitle: 'Fundamentos da JVM & Sintaxe Java',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'java-l1-q1',
        question:
          'Qual é a assinatura padrão exata do ponto de entrada de uma aplicação Java clássica?',
        options: [
          'public static void main(String[] args)',
          'public void main(String args)',
          'static void main()',
          'void main(String[] args)',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l1-q2',
        question: 'O que o compilador `javac` gera a partir dos arquivos de código-fonte `.java`?',
        options: [
          'Arquivos `.class` contendo Bytecode portátil executado pela JVM (Java Virtual Machine)',
          'Binários executáveis nativos .exe',
          'Arquivos JavaScript',
          'Arquivos C++',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l1-q3',
        question:
          'Qual palavra-chave introduzida no Java 10 permite a inferência de tipo local para variáveis dentro de métodos?',
        options: ['var', 'auto', 'let', 'val'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 2,
    title: 'Tipos Primitivos & Wrappers',
    description: 'Os 8 tipos primitivos, classes Wrapper e o mecanismo de Autoboxing/Unboxing.',
    unitNumber: 1,
    unitTitle: 'Fundamentos da JVM & Sintaxe Java',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'java-l2-q1',
        question: 'Quantos tipos primitivos existem na linguagem Java?',
        options: [
          '8 tipos (byte, short, int, long, float, double, boolean, char)',
          '4 tipos',
          '10 tipos',
          'Infinitos',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l2-q2',
        question: 'O que é o mecanismo de Autoboxing no Java?',
        options: [
          'A conversão automática feita pelo compilador entre um tipo primitivo (ex: `int`) e sua classe Wrapper correspondente (`Integer`)',
          'A alocação de memória no disco',
          'O empacotamento de arquivos em JAR',
          'A compilação JIT',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l2-q3',
        question:
          'Qual é o valor padrão de inicialização de um campo de instância do tipo `boolean` em uma classe?',
        options: ['false', 'true', 'null', '0'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 3,
    title: 'Operadores & Precedência',
    description: 'Operadores aritméticos, lógicos de curto-circuito (&&, ||) e operador ternário.',
    unitNumber: 1,
    unitTitle: 'Fundamentos da JVM & Sintaxe Java',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'java-l3-q1',
        question:
          'Qual é a diferença entre os operadores lógicos `&` e `&&` em expressões booleanas?',
        options: [
          '`&&` realiza avaliação de curto-circuito (short-circuit), não avaliando o lado direito se o esquerdo for falso; `&` sempre avalia ambos os lados',
          '`&&` é bitwise; `&` é lógico',
          'Não há diferença',
          '`&&` é exclusivo de números',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l3-q2',
        question:
          'Qual operador verifica a igualdade de referências de memória entre dois objetos em Java?',
        options: ['==', 'equals()', '===', 'is'],
        correctIndex: 0,
      },
      {
        id: 'java-l3-q3',
        question:
          'Qual método deve ser utilizado para comparar o CONTEÚDO real de duas strings em Java?',
        options: ['str1.equals(str2)', 'str1 == str2', 'str1.compare(str2)', 'str1 === str2'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 4,
    title: 'Strings, String Pool & StringBuilder',
    description:
      'Imutabilidade de strings, otimização do String Pool e concatenação com StringBuilder.',
    unitNumber: 1,
    unitTitle: 'Fundamentos da JVM & Sintaxe Java',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'java-l4-q1',
        question: 'Por que objetos `String` são estritamente imutáveis em Java?',
        options: [
          'Para permitir o compartilhamento seguro no String Constant Pool, thread-safety e segurança em chaves de HashMaps e URLs',
          'Por limitação da JVM antiga',
          'Para impedir que sejam impressas',
          'Para ocupar mais memória',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l4-q2',
        question:
          'Qual classe mutável de alta performance deve ser utilizada para concatenação intensa de texto dentro de loops em single-thread?',
        options: ['StringBuilder', 'StringBuffer', 'StringConcat', 'StringList'],
        correctIndex: 0,
      },
      {
        id: 'java-l4-q3',
        question: 'O que o recurso Text Blocks (três aspas `"""`) introduzido no Java 15 facilita?',
        options: [
          'A escrita de strings literais multilinha preservando a formatação e sem necessidade de caracteres de escape `\\n`',
          'A criação de blocos de comentários',
          'A execução de código SQL direto no compilador',
          'A tradução de idiomas',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 5,
    title: 'Pacotes, Imports & Modificador final',
    description:
      'Organização com package, imports estáticos e o significado de final em variáveis/métodos/classes.',
    unitNumber: 1,
    unitTitle: 'Fundamentos da JVM & Sintaxe Java',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'java-l5-q1',
        question: 'O que o modificador `final` causa quando aplicado a uma CLASSE em Java?',
        options: [
          'Impede que a classe seja estendida/herdada por qualquer outra classe (ex: `final class String`)',
          'Impede que a classe seja instanciada',
          'Torna todos os métodos assíncronos',
          'Apaga a classe ao final da execução',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l5-q2',
        question: 'O que o modificador `final` causa quando aplicado a um MÉTODO?',
        options: [
          'Impede que o método seja sobrescrito (override) em subclasses',
          'Torna o método privado',
          'Torna o método estático',
          'Executa o método apenas uma vez',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l5-q3',
        question: 'Para que serve a instrução `import static` em Java?',
        options: [
          'Importar membros estáticos (constantes ou métodos) de uma classe permitindo usá-los diretamente sem prefixar o nome da classe',
          'Compilar classes mais rápido',
          'Importar pacotes em C++',
          'Alocar memória estática',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 2: Controle de Fluxo & Switch Expressions ──
  {
    levelNumber: 6,
    title: 'Condicionais & Operador Ternário',
    description: 'Ramificação com if, else if, else e expressões ternárias encadeadas.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Switch Expressions',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'java-l6-q1',
        question:
          'Em Java, é permitido usar números inteiros (como `if (1)`) como condição em um if?',
        options: [
          'Não, o Java exige estritamente uma expressão que avalie para o tipo `boolean` primitivo (`true` ou `false`)',
          'Sim, 1 é true e 0 é false',
          'Apenas em modo legado',
          'Apenas com short',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l6-q2',
        question: 'Qual é a sintaxe correta do operador ternário em Java?',
        options: [
          'condicao ? valorSeVerdade : valorSeFalso',
          'condicao : valorSeVerdade ? valorSeFalso',
          'if (condicao) -> valorSeVerdade',
          'condicao ?? valorSeVerdade',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l6-q3',
        question:
          'Qual método deve ser usado para verificar se um `Optional<T>` contém um valor em um if?',
        options: [
          'opt.isPresent() (ou opt.isEmpty())',
          'opt.hasValue()',
          'opt != null',
          'opt.exists()',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 7,
    title: 'Switch Expressions & Seta -> (Java 14+)',
    description: 'Switch moderno que retorna valores, elimina fall-through e usa yield.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Switch Expressions',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'java-l7-q1',
        question:
          'Qual é a grande vantagem das Switch Expressions com sintaxe de seta `case DIA -> ...` introduzidas no Java 14?',
        options: [
          'Podem retornar um valor como expressão e eliminam automaticamente o risco de fall-through acidental sem precisar de `break`',
          'Executam em threads paralelas',
          'Permitem comparar objetos nulos sem erro',
          'Substituem o if',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l7-q2',
        question:
          'Qual palavra-chave é utilizada para retornar um valor explicitamente de dentro de um bloco de código de múltiplos statements em uma Switch Expression?',
        options: ['yield', 'return', 'break', 'send'],
        correctIndex: 0,
      },
      {
        id: 'java-l7-q3',
        question: 'Como agrupar múltiplos casos que compartilham o mesmo resultado no novo switch?',
        options: [
          'case SEGUNDA, TERCA, QUARTA -> "Dia útil";',
          'case SEGUNDA | TERCA -> "Dia útil";',
          'case SEGUNDA or TERCA -> "Dia útil";',
          'case [SEGUNDA, TERCA] -> "Dia útil";',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 8,
    title: 'Laços de Repetição for, while & do...while',
    description: 'Iteração tradicional, laço for-each aprimorado e controle com break/continue.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Switch Expressions',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'java-l8-q1',
        question:
          'Qual é a sintaxe do laço for-each (Enhanced for loop) para percorrer uma lista de itens em Java?',
        options: [
          'for (Item item : lista) { ... }',
          'for (item in lista) { ... }',
          'for (Item item of lista) { ... }',
          'foreach (Item item : lista) { ... }',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l8-q2',
        question: 'Como interromper um laço externo a partir de um laço aninhado interno em Java?',
        options: [
          'Usando um rótulo (Labeled break): `rotuloExterno: for (...) { break rotuloExterno; }`',
          'Chamando `break 2;`',
          'Com `exit(1)`',
          'Não é possível',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l8-q3',
        question:
          'Qual interface um objeto customizado deve implementar para poder ser utilizado no laço for-each `for (T item : colecao)`?',
        options: [
          'java.lang.Iterable<T>',
          'java.util.Iterator<T>',
          'java.util.Collection<T>',
          'java.lang.Listable<T>',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 9,
    title: 'Pattern Matching para instanceof (Java 16+)',
    description: 'Eliminação de casts redundantes com a vinculação direta de variáveis.',
    unitNumber: 2,
    unitTitle: 'Controle de Fluxo & Switch Expressions',
    sectionName: 'Júnior - Iniciante',
    questions: [
      {
        id: 'java-l9-q1',
        question:
          'Como a sintaxe de Pattern Matching para `instanceof` simplifica a checagem e conversão de tipos?',
        options: [
          'Permite declarar a variável convertida diretamente na condição (ex: `if (obj instanceof String s)`), eliminando a linha de cast explícito `(String) obj`',
          'Torna o cast dinâmico em tempo de execução',
          'Remove a verificação de tipo',
          'Transforma em reflection',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l9-q2',
        question:
          'A variável de padrão `s` em `if (obj instanceof String s && s.length() > 5)` pode ser usada imediatamente na segunda parte da condição com `&&`?',
        options: [
          'Sim, porque o operador `&&` só avalia o lado direito se o `instanceof` for verdadeiro e a variável `s` estiver em escopo',
          'Não, causa erro de compilação',
          'Apenas com operadores bitwise',
          'Apenas dentro de classes abstratas',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l9-q3',
        question: 'Qual recurso do Java 21 expande o Pattern Matching para a instrução switch?',
        options: [
          'Pattern Matching for switch (ex: `case String s -> ... ; case Integer i -> ...`)',
          'Dynamic switch',
          'C++ switch',
          'Meta switch',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 3: Orientação a Objetos & Encapsulamento ──
  {
    levelNumber: 10,
    title: 'Classes, Construtores & Palavra this',
    description: 'Declaração de classes, sobrecarga de construtores com this() e instanciação.',
    unitNumber: 3,
    unitTitle: 'Orientação a Objetos & Encapsulamento',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'java-l10-q1',
        question:
          'Como invocar outro construtor da mesma classe a partir de um construtor sobrecarregado?',
        options: [
          'Chamando `this(argumentos);` como a primeira instrução do construtor',
          'Chamando `new ClassName(argumentos);`',
          'Usando `self(argumentos);`',
          'Não é permitido',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l10-q2',
        question:
          'O que o compilador Java faz se você NÃO declarar nenhum construtor explícito em uma classe?',
        options: [
          'Gera automaticamente um construtor padrão público sem argumentos (default constructor)',
          'Lança um erro de compilação',
          'Impede a criação de instâncias',
          'Transforma a classe em interface',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l10-q3',
        question: 'Para que serve a palavra-chave `this` em Java?',
        options: [
          'Referenciar a instância atual do objeto executando o código, resolvendo ambiguidades entre campos e parâmetros',
          'Criar uma nova thread',
          'Acessar a classe pai',
          'Limpar a memória',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 11,
    title: 'Modificadores de Acesso (Encapsulamento)',
    description: 'Tabela de visibilidade: public, protected, package-private (default) e private.',
    unitNumber: 3,
    unitTitle: 'Orientação a Objetos & Encapsulamento',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'java-l11-q1',
        question:
          'Qual é o nível de visibilidade de um membro de classe sem nenhum modificador de acesso declarado (Package-Private / Default)?',
        options: [
          'Acessível apenas por classes pertencentes ao MESMO pacote',
          'Acessível por todas as classes da aplicação',
          'Acessível apenas pela própria classe',
          'Acessível apenas por subclasses em qualquer pacote',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l11-q2',
        question:
          'Qual modificador de acesso permite que um membro seja acessado no mesmo pacote E por subclasses em outros pacotes diferentes?',
        options: ['protected', 'package-private', 'private', 'internal'],
        correctIndex: 0,
      },
      {
        id: 'java-l11-q3',
        question:
          'Qual é a recomendação central de Encapsulamento da Engenharia de Software em Java?',
        options: [
          'Manter os campos de dados privados (`private`) e fornecer métodos acessores controlados (`getters` e `setters`) com validação',
          'Tornar todos os campos públicos',
          'Usar apenas classes estáticas',
          'Evitar criar métodos',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 12,
    title: 'Membros Estáticos (static) & Inicializadores',
    description: 'Campos estáticos compartilhados, métodos estáticos e blocos static {}.',
    unitNumber: 3,
    unitTitle: 'Orientação a Objetos & Encapsulamento',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'java-l12-q1',
        question: 'O que caracteriza um campo declarado com `static` em uma classe Java?',
        options: [
          'Pertence à classe em si e é compartilhado por todas as instâncias existentes, existindo uma única cópia na memória',
          'É duplicado para cada novo objeto criado',
          'É alocado no disco',
          'Não pode ser modificado',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l12-q2',
        question:
          'Métodos estáticos (`static`) podem acessar diretamente campos ou métodos de instância usando `this`?',
        options: [
          'Não, porque métodos estáticos são executados no contexto da classe, sem uma instância específica associada',
          'Sim, normalmente',
          'Apenas se o método for público',
          'Apenas com synchronized',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l12-q3',
        question: 'Quando um bloco estático `static { ... }` dentro de uma classe é executado?',
        options: [
          'Apenas uma única vez quando a classe é carregada pela primeira vez na memória pela JVM (Class Loading)',
          'A cada instanciação com `new`',
          'Ao final da aplicação',
          'Ao compilar com javac',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 13,
    title: 'Records no Java Moderno (Java 16+)',
    description: 'Classes imutáveis portadoras de dados (Data Carriers) concisas com record.',
    unitNumber: 3,
    unitTitle: 'Orientação a Objetos & Encapsulamento',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'java-l13-q1',
        question:
          'O que a declaração `public record Usuario(Long id, String nome, String email) {}` gera automaticamente?',
        options: [
          'Uma classe imutável final com construtor canônico, campos privados finais, getters (ex: `u.nome()`), `equals()`, `hashCode()` e `toString()`',
          'Apenas uma interface',
          'Uma tabela no banco de dados',
          'Um arquivo JSON',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l13-q2',
        question:
          'Como são chamados os métodos de leitura gerados para os campos de um Record (ex: campo `nome`)?',
        options: [
          '`u.nome()` (sem o prefixo get)',
          '`u.getNome()`',
          '`u.fetchNome()`',
          '`u.readNome()`',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l13-q3',
        question: 'Records podem estender outras classes com `extends` em Java?',
        options: [
          'Não, todos os records já herdam implicitamente de `java.lang.Record` e são classes finais, mas podem implementar interfaces',
          'Sim, podem herdar de qualquer classe',
          'Apenas de classes abstratas',
          'Apenas de outros records',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 4: Herança, Polimorfismo & Interfaces ──
  {
    levelNumber: 14,
    title: 'Herança com extends & Palavra super',
    description:
      'Reutilização de código, anotação @Override e invocação do construtor pai super().',
    unitNumber: 4,
    unitTitle: 'Herança, Polimorfismo & Interfaces',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'java-l14-q1',
        question:
          'O Java suporta herança múltipla de classes (uma classe estender duas ou mais classes)?',
        options: [
          'Não, o Java suporta herança simples de classes (Single Inheritance), mas permite implementar múltiplas interfaces',
          'Sim, usando vírgula no extends',
          'Apenas com classes abstratas',
          'Apenas com records',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l14-q2',
        question: 'Para que serve a anotação `@Override` em métodos Java?',
        options: [
          'Garante em tempo de compilação que o método está de fato sobrescrevendo um método válido da classe pai ou interface, prevenindo erros de digitação',
          'Acelera a execução do método',
          'Torna o método público',
          'Desativa o garbage collector',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l14-q3',
        question:
          'Qual é a superclasse raiz universal de todas as classes em Java da qual qualquer objeto herda direta ou indiretamente?',
        options: ['java.lang.Object', 'java.lang.Class', 'java.lang.Root', 'java.lang.Base'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 15,
    title: 'Classes Abstratas & Métodos Abstratos',
    description: 'Classes base não-instanciáveis com abstract e contratos parciais.',
    unitNumber: 4,
    unitTitle: 'Herança, Polimorfismo & Interfaces',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'java-l15-q1',
        question:
          'É possível instanciar diretamente uma classe abstrata usando `new MinhaClasseAbstrata()`?',
        options: [
          'Não, classes abstratas não podem ser instanciadas diretamente e servem como modelos para subclasses concretas',
          'Sim, normalmente',
          'Apenas se todos os métodos forem estáticos',
          'Apenas no mesmo pacote',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l15-q2',
        question:
          'O que uma subclasse concreta é OBRIGADA a fazer ao herdar de uma classe abstrata que possui métodos `abstract`?',
        options: [
          'Implementar (sobrescrever) todos os métodos abstratos herdados',
          'Declarar todos os campos como estáticos',
          'Adicionar um construtor vazio',
          'Remover anotações',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l15-q3',
        question:
          'Classes abstratas podem conter métodos concretos (com corpo e implementação) além de construtores e atributos de instância?',
        options: [
          'Sim, classes abstratas podem ter estado, construtores e métodos com implementação completa',
          'Não, apenas métodos vazios são permitidos',
          'Apenas métodos estáticos',
          'Apenas getters',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 16,
    title: 'Interfaces & Métodos default / static',
    description:
      'Múltiplas implementações com implements, métodos default (Java 8+) e privados (Java 9+).',
    unitNumber: 4,
    unitTitle: 'Herança, Polimorfismo & Interfaces',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'java-l16-q1',
        question: 'Para que servem os métodos `default` em interfaces introduzidos no Java 8?',
        options: [
          'Permitir adicionar novos métodos com implementação padrão em interfaces existentes sem quebrar a compatibilidade com classes que já as implementavam',
          'Tornar os métodos privados',
          'Substituir construtores',
          'Permitir variáveis mutáveis nas interfaces',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l16-q2',
        question:
          'Como são tratados todos os campos (atributos) declarados em uma interface por padrão?',
        options: [
          'São implicitamente `public static final` (constantes)',
          'São variáveis privadas de instância',
          'São ponteiros mutáveis',
          'São registros em disco',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l16-q3',
        question: 'Uma classe pode implementar múltiplas interfaces em Java?',
        options: [
          'Sim, separando os nomes das interfaces por vírgula na cláusula `implements` (ex: `class App implements Serializable, Cloneable, Runnable`)',
          'Não, apenas uma',
          'No máximo 3',
          'Apenas se forem anônimas',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 17,
    title: 'Sealed Classes & Interfaces (Java 17+)',
    description:
      'Controle estrito de hierarquia de herança com sealed, permits, non-sealed e final.',
    unitNumber: 4,
    unitTitle: 'Herança, Polimorfismo & Interfaces',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'java-l17-q1',
        question:
          'O que o recurso de Sealed Classes (`sealed class ... permits ...`) introduzido no Java 17 permite fazer?',
        options: [
          'Restringir e controlar explicitamente quais classes ou interfaces têm permissão para estendê-la ou implementá-la',
          'Criptografar a classe',
          'Impedir o uso de garbage collection',
          'Tornar todos os métodos privados',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l17-q2',
        question:
          'Quais são os 3 modificadores obrigatórios que uma subclasse permitida de uma sealed class deve declarar?',
        options: [
          '`final`, `sealed` ou `non-sealed`',
          '`public`, `private` ou `protected`',
          '`abstract`, `static` ou `void`',
          '`transient`, `volatile` ou `native`',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l17-q3',
        question:
          'Qual é o grande benefício de combinar Sealed Classes com Pattern Matching em Switch no Java moderno?',
        options: [
          'O compilador sabe todas as subclasses possíveis e garante exaustividade no `switch` sem exigir cláusula `default` desnecessária',
          'Reduz o uso de RAM pela metade',
          'Acelera a compilação em 10x',
          'Elimina o uso de imports',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 18,
    title: 'Equals, HashCode & toString',
    description: 'O contrato fundamental do java.lang.Object e tabelas de espalhamento.',
    unitNumber: 4,
    unitTitle: 'Herança, Polimorfismo & Interfaces',
    sectionName: 'Pleno - Intermediário',
    questions: [
      {
        id: 'java-l18-q1',
        question: 'Qual é a regra obrigatória do contrato entre `equals()` e `hashCode()` em Java?',
        options: [
          'Se dois objetos são iguais segundo `equals()`, eles DEVEM obrigatoriamente produzir o MESMO código de `hashCode()`',
          'Dois objetos diferentes nunca podem ter o mesmo hashCode',
          'hashCode() deve retornar sempre números pares',
          'equals() deve comparar apenas números',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l18-q2',
        question:
          'O que acontece ao inserir um objeto em um `HashSet` ou `HashMap` se a classe sobrescrever `equals()` mas NÃO sobrescrever `hashCode()`?',
        options: [
          'O objeto pode não ser encontrado em buscas posteriores ou criar duplicatas, quebrando a integridade da coleção',
          'A JVM lança um NullPointerException imediato',
          'O banco de dados é corrompido',
          'O código não compila',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l18-q3',
        question:
          'Qual classe utilitária do pacote `java.util` simplifica a implementação de `equals` e `hashCode` de forma limpa?',
        options: [
          '`java.util.Objects` (com `Objects.equals()` e `Objects.hash()`)',
          '`java.util.Arrays`',
          '`java.util.Collections`',
          '`java.lang.System`',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 5: Java Collections Framework ──
  {
    levelNumber: 19,
    title: 'List: ArrayList vs LinkedList',
    description: 'Arrays redimensionáveis O(1) vs listas duplamente encadeadas O(N).',
    unitNumber: 5,
    unitTitle: 'Java Collections Framework',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l19-q1',
        question:
          'Por que o `ArrayList` é quase sempre preferível ao `LinkedList` em aplicações reais modernas?',
        options: [
          'Pela localidade de referência na CPU Cache e acesso indexado O(1), enquanto LinkedList tem alto overhead de alocação de nós na Heap e cache misses',
          'Porque LinkedList não aceita genéricos',
          'Porque ArrayList não ocupa memória',
          'Porque ArrayList roda em GPU',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l19-q2',
        question:
          'Qual método de fábrica estático do Java 9 cria uma lista imutável de forma concisa (ex: `List.of("A", "B")`)?',
        options: [
          'List.of("A", "B")',
          'Arrays.asList("A", "B")',
          'new ArrayList<>("A", "B")',
          'Collections.list("A", "B")',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l19-q3',
        question: 'O que acontece ao tentar chamar `.add()` em uma lista criada por `List.of()`?',
        options: [
          'Lança uma exceção `UnsupportedOperationException` em tempo de execução',
          'O item é adicionado normalmente',
          'Retorna false',
          'Gera erro de compilação',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 20,
    title: 'Set: HashSet vs TreeSet',
    description: 'Garantia de unicidade com tabelas Hash vs árvores rubro-negras ordenadas.',
    unitNumber: 5,
    unitTitle: 'Java Collections Framework',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l20-q1',
        question: 'Qual é a diferença fundamental entre `HashSet` e `TreeSet`?',
        options: [
          '`HashSet` oferece operações O(1) sem ordem garantida; `TreeSet` mantém os elementos ordenados em uma árvore rubro-negra com operações O(log N)',
          'HashSet é ordenado; TreeSet não é',
          'TreeSet aceita elementos duplicados',
          'HashSet só aceita números inteiros',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l20-q2',
        question:
          'O que uma classe deve implementar para que suas instâncias possam ser ordenadas naturalmente em um `TreeSet` sem passar um Comparator?',
        options: [
          'java.lang.Comparable<T>',
          'java.util.Comparator<T>',
          'java.io.Serializable',
          'java.lang.Cloneable',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l20-q3',
        question:
          'Qual implementação de Set preserva a ordem exata de inserção dos elementos usando uma lista encadeada interna?',
        options: ['LinkedHashSet', 'ArraySet', 'OrderedHashSet', 'InsertionSet'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 21,
    title: 'Map: HashMap & ConcurrentHashMap',
    description: 'Tabelas hash, buckets, encadeamento com árvores no Java 8 e concorrência.',
    unitNumber: 5,
    unitTitle: 'Java Collections Framework',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l21-q1',
        question:
          'Como o `HashMap` do Java 8+ otimiza internamente buckets que sofrem muitas colisões de hash (acima de 8 elementos)?',
        options: [
          'Converte a lista encadeada do bucket em uma Árvore Rubro-Negra (Red-Black Tree), reduzindo a complexidade de O(N) para O(log N)',
          'Dobra o tamanho do heap',
          'Lança um erro de colisão',
          'Remove os elementos antigos',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l21-q2',
        question:
          'Por que o `ConcurrentHashMap` é a escolha ideal para cenários multithread em vez de `Hashtable` ou `Collections.synchronizedMap`?',
        options: [
          'Porque utiliza travas segmentadas por buckets (Lock Striping e CAS), permitindo múltiplas leituras e escritas concorrentes sem travar o mapa inteiro',
          'Porque não usa memória',
          'Porque roda em processos separados',
          'Porque desativa o garbage collector',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l21-q3',
        question:
          'Qual método do Map computa e insere um valor de forma atômica caso a chave ainda não esteja presente?',
        options: [
          'map.computeIfAbsent(chave, k -> buscarValor(k))',
          'map.putIfMissing(chave, valor)',
          'map.getOrCreate(chave, valor)',
          'map.insertDefault(chave, valor)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 22,
    title: 'Queue, Deque & PriorityQueue',
    description: 'Filas FIFO, pilhas/filas de ponta dupla (ArrayDeque) e filas de prioridade.',
    unitNumber: 5,
    unitTitle: 'Java Collections Framework',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l22-q1',
        question:
          'Por que a classe `ArrayDeque` é a recomendação oficial do Java para implementar Pilhas (Stack) e Filas (Queue) no lugar da classe legada `java.util.Stack`?',
        options: [
          '`ArrayDeque` é muito mais rápida, não possui o overhead de sincronização pesada legada da classe `Vector` e implementa a interface `Deque` moderna',
          'Porque Stack não compila mais',
          'Porque ArrayDeque roda em C',
          'Por suportar apenas inteiros',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l22-q2',
        question:
          'Como a estrutura `PriorityQueue` organiza a ordem de remoção dos seus elementos?',
        options: [
          'Com base na prioridade natural dos elementos (Comparable) ou em um Comparator fornecido, extraindo sempre o menor/maior elemento primeiro (Heap binária)',
          'Sempre por ordem de chegada FIFO',
          'Sempre por ordem LIFO',
          'Aleatoriamente',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l22-q3',
        question:
          'Qual método da interface `Queue` remove e retorna o elemento no início da fila, retornando `null` se a fila estiver vazia sem lançar exceção?',
        options: ['poll()', 'remove()', 'pop()', 'dequeue()'],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 6: Tratamento de Exceções & I/O ──
  {
    levelNumber: 23,
    title: 'Checked vs Unchecked Exceptions',
    description: 'Hierarquia Throwable: Exception verificada vs RuntimeException e Error.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Exceções & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l23-q1',
        question:
          'Qual é a diferença fundamental entre Checked Exceptions e Unchecked (Runtime) Exceptions em Java?',
        options: [
          'Checked Exceptions (filhas diretas de `Exception`) DEVEM ser tratadas com try/catch ou declaradas no `throws`; Unchecked (`RuntimeException`) não exigem declaração obrigatória',
          'Checked ocorrem apenas na JVM; Unchecked no hardware',
          'Checked não podem ser capturadas',
          'São exatamente iguais',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l23-q2',
        question:
          'Erros graves de sistema que a aplicação normalmente não deve tentar capturar (como `OutOfMemoryError` e `StackOverflowError`) herdam de qual classe?',
        options: [
          'java.lang.Error',
          'java.lang.RuntimeException',
          'java.lang.FatalException',
          'java.lang.SystemException',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l23-q3',
        question:
          'Qual é a melhor prática ao criar exceções de negócio em arquiteturas modernas em Java?',
        options: [
          'Herdar de `RuntimeException` para evitar poluir as assinaturas dos métodos da aplicação com `throws` excessivos',
          'Herdar de `Throwable` diretamente',
          'Criar checked exceptions para cada método',
          'Nunca lançar exceções',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 24,
    title: 'Try-with-Resources & AutoCloseable',
    description: 'Gerenciamento automático de recursos I/O, sockets e conexões sem vazamentos.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Exceções & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l24-q1',
        question:
          'Qual interface um recurso (como um stream ou conexão de banco) DEVE implementar para poder ser utilizado na estrutura `try-with-resources`?',
        options: [
          'java.lang.AutoCloseable (ou java.io.Closeable)',
          'java.io.Serializable',
          'java.lang.Runnable',
          'java.lang.Disposable',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l24-q2',
        question:
          'Por que o `try-with-resources` (`try (BufferedReader br = ...) { ... }`) substituiu o padrão antigo de fechar recursos manualmente no bloco `finally`?',
        options: [
          'Garante que o método `.close()` seja chamado automaticamente na ordem correta, preservando inclusive exceções suprimidas (Suppressed Exceptions)',
          'Acelera a compilação',
          'Evita usar o disco',
          'Cria threads',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l24-q3',
        question:
          'É permitido declarar múltiplos recursos separados por ponto-e-vírgula em um único cabeçalho de `try-with-resources`?',
        options: [
          'Sim, todos serão fechados automaticamente na ordem inversa de sua abertura',
          'Não, apenas 1 recurso é permitido',
          'Apenas se forem do mesmo tipo',
          'Apenas no Java 21',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 25,
    title: 'Java NIO.2 & Manipulação de Arquivos',
    description: 'Path, java.nio.file.Files, leitura rápida e streaming de linhas.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Exceções & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l25-q1',
        question:
          'Qual classe utilitária do pacote `java.nio.file` fornece métodos estáticos modernos de alta performance para ler, escrever e copiar arquivos?',
        options: [
          'Files (ex: `Files.readString(path)`, `Files.writeString(path, texto)`)',
          'FileHelper',
          'IOUtils',
          'FileReader',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l25-q2',
        question: 'Como instanciar um objeto `Path` apontando para um arquivo no Java 11+?',
        options: [
          'Path.of("dados", "relatorio.txt")',
          'new Path("dados/relatorio.txt")',
          'FileSystem.createPath("dados")',
          'Path.from("dados")',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l25-q3',
        question:
          'Qual método de `Files` retorna um `Stream<String>` preguiçoso (lazy) para processar arquivos gigantes linha por linha sem esgotar a memória RAM?',
        options: [
          'Files.lines(path)',
          'Files.readAllLines(path)',
          'Files.stream(path)',
          'Files.openLines(path)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 26,
    title: 'Serialização de Objetos & JSON',
    description: 'A interface Serializable, serialVersionUID, palavra transient e Jackson/Gson.',
    unitNumber: 6,
    unitTitle: 'Tratamento de Exceções & I/O',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l26-q1',
        question:
          'O que a palavra-chave `transient` em um campo de uma classe indica durante a serialização de objetos?',
        options: [
          'Indica que o campo NÃO deve ser incluído no processo de serialização (será ignorado e restaurado com valor zero/null)',
          'Que o campo é criptografado',
          'Que o campo é estático',
          'Que o campo roda em thread separada',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l26-q2',
        question:
          'Para que serve a constante `serialVersionUID` em classes que implementam `Serializable`?',
        options: [
          'Garantir a compatibilidade de versão da classe durante a desserialização de objetos salvos anteriormente',
          'Controlar permissões de acesso',
          'Contar instâncias criadas',
          'Conectar ao banco de dados',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l26-q3',
        question:
          'Qual biblioteca é o padrão de mercado para serializar e desserializar objetos Java em JSON no ecossistema Spring Boot?',
        options: [
          'Jackson (com a classe `ObjectMapper`)',
          'FastJSON puro',
          'JSONParser clássico',
          'XMLMapper',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 7: Streams API, Lambdas & Threads Virtuais ──
  {
    levelNumber: 27,
    title: 'Expressões Lambda & Interfaces Funcionais',
    description: 'Sintaxe (args) -> corpo, anotação @FunctionalInterface e Method References (::).',
    unitNumber: 7,
    unitTitle: 'Streams API, Lambdas & Concorrência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l27-q1',
        question: 'O que define uma Interface Funcional (`@FunctionalInterface`) em Java?',
        options: [
          'Uma interface que declara EXATAMENTE UM único método abstrato (podendo conter métodos default ou static extras)',
          'Uma interface sem métodos',
          'Uma interface que herda de Function',
          'Uma classe anônima',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l27-q2',
        question:
          'Qual sintaxe representa uma Referência de Método (Method Reference) para o método `println` do objeto `System.out`?',
        options: [
          'System.out::println',
          'System.out->println',
          'System.out.println()',
          '::System.out.println',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l27-q3',
        question:
          'Qual interface funcional padrão do pacote `java.util.function` recebe um argumento do tipo `T` e retorna um `boolean`?',
        options: ['Predicate<T>', 'Function<T, R>', 'Consumer<T>', 'Supplier<T>'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 28,
    title: 'Streams API: Operações Intermediárias & Terminais',
    description: 'Pipelines funcionais com filter, map, flatMap, sorted, distinct e collect.',
    unitNumber: 7,
    unitTitle: 'Streams API, Lambdas & Concorrência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l28-q1',
        question:
          'Qual é a diferença entre Operações Intermediárias (ex: `filter`, `map`) e Operações Terminais (ex: `collect`, `forEach`) em uma Stream?',
        options: [
          'Operações intermediárias são preguiçosas (lazy) e retornam uma nova Stream; operações terminais disparam a execução de todo o pipeline e produzem um resultado ou efeito colateral',
          'Intermediárias rodam no disco; terminais na RAM',
          'Operações intermediárias fecham a stream',
          'Não há diferença',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l28-q2',
        question: 'Como coletar os elementos filtrados de uma Stream em uma `List` no Java 16+?',
        options: [
          'stream.toList() (ou stream.collect(Collectors.toList()))',
          'stream.toArrayList()',
          'stream.collectList()',
          'stream.getAsList()',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l28-q3',
        question:
          'Qual coletor agrupa elementos de uma coleção por uma determinada chave gerando um `Map<K, List<T>>`?',
        options: [
          'Collectors.groupingBy(fnChave)',
          'Collectors.partitioningBy(fnChave)',
          'Collectors.toMapList(fnChave)',
          'Collectors.aggregateBy(fnChave)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 29,
    title: 'CompletableFuture & Programação Assíncrona',
    description: 'Futures não-bloqueantes, encadeamento com thenApply, thenCompose e allOf.',
    unitNumber: 7,
    unitTitle: 'Streams API, Lambdas & Concorrência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l29-q1',
        question:
          'Qual classe introduzida no Java 8 permite compor pipelines de execução assíncrona não-bloqueantes com callbacks?',
        options: ['CompletableFuture<T>', 'FutureTask<T>', 'AsyncPromise<T>', 'AsyncTask<T>'],
        correctIndex: 0,
      },
      {
        id: 'java-l29-q2',
        question:
          'Qual método encadeia uma transformação síncrona no resultado assim que o `CompletableFuture` for concluído?',
        options: ['thenApply(fn)', 'thenRun(fn)', 'thenAccept(fn)', 'map(fn)'],
        correctIndex: 0,
      },
      {
        id: 'java-l29-q3',
        question:
          'Qual método combina múltiplos `CompletableFuture` aguardando a conclusão de todos eles?',
        options: [
          'CompletableFuture.allOf(f1, f2, f3)',
          'CompletableFuture.joinAll(f1, f2)',
          'CompletableFuture.waitAll(f1, f2)',
          'CompletableFuture.gather(f1, f2)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 30,
    title: 'Threads Virtuais & Project Loom (Java 21+)',
    description: 'Revolução de concorrência com Virtual Threads leves gerenciadas pela JVM.',
    unitNumber: 7,
    unitTitle: 'Streams API, Lambdas & Concorrência',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l30-q1',
        question:
          'O que são as Threads Virtuais (Virtual Threads) introduzidas como recurso final no Java 21?',
        options: [
          'Threads de espaço de usuário levíssimas gerenciadas diretamente pela JVM que permitem o modelo thread-per-request escalando para milhões de conexões simultâneas',
          'Threads executadas na nuvem',
          'Threads que rodam em navegadores',
          'Emuladores de CPU',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l30-q2',
        question:
          'Como criar um ExecutorService que dispara uma nova Virtual Thread para cada tarefa submetida?',
        options: [
          'Executors.newVirtualThreadPerTaskExecutor()',
          'Executors.newFixedVirtualThreadPool(100)',
          'Executors.newLoomPool()',
          'Executors.createVirtual()',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l30-q3',
        question:
          'O que acontece quando uma Virtual Thread executa uma operação de I/O bloqueante (como chamada de banco ou rede)?',
        options: [
          'A JVM desvincula a Virtual Thread da Carrier Thread nativa subjacente, permitindo que a Carrier Thread execute outras tarefas enquanto a I/O aguarda',
          'A Carrier Thread inteira do SO congela',
          'A JVM entra em deadlock',
          'Lança um InterruptedException',
        ],
        correctIndex: 0,
      },
    ],
  },

  // ── SEÇÃO 8: Padrões, Testes & Spring Framework ──
  {
    levelNumber: 31,
    title: 'Injeção de Dependências & Spring Boot Core',
    description: 'Inversion of Control (IoC), Beans, @Autowired via construtor e ciclo de vida.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Spring Framework',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l31-q1',
        question:
          'Por que a injeção de dependências via CONSTRUTOR é a prática recomendada no ecossistema Spring em vez da injeção por campo (`@Autowired` no atributo)?',
        options: [
          'Garante que os objetos sejam imutáveis (`final`), facilita testes unitários isolados com mocks sem precisar do container Spring e impede dependências nulas parciais',
          'Porque o Spring proibiu o uso de anotações',
          'Porque injeção por campo é mais lenta',
          'Por exigência do Maven',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l31-q2',
        question:
          'Qual anotação marca uma classe como um componente de serviço de regras de negócio gerenciado pelo container IoC do Spring?',
        options: ['@Service (ou @Component)', '@Entity', '@RepositoryBean', '@Injectable'],
        correctIndex: 0,
      },
      {
        id: 'java-l31-q3',
        question: 'Qual é o escopo padrão (Scope) de um Bean gerenciado pelo Spring Framework?',
        options: [
          'Singleton (uma única instância compartilhada por todo o ApplicationContext)',
          'Prototype (nova instância a cada injeção)',
          'Request (uma por requisição HTTP)',
          'Session',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 32,
    title: 'Testes Unitários com JUnit 5 & Mockito',
    description: 'Testes com @Test, asserções do AssertJ, mocks com Mockito e @ExtendWith.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Spring Framework',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l32-q1',
        question: 'Qual anotação do JUnit 5 marca um método como um teste automatizado executável?',
        options: ['@Test (do pacote org.junit.jupiter.api)', '@UnitTest', '@TestCase', '@Verify'],
        correctIndex: 0,
      },
      {
        id: 'java-l32-q2',
        question:
          'Como instruir um mock do Mockito a retornar um valor simulado quando um método específico for chamado?',
        options: [
          'when(meuMock.buscar(1L)).thenReturn(usuarioMock)',
          'given(meuMock).returns(usuarioMock)',
          'meuMock.onCall("buscar").send(usuarioMock)',
          'mock(meuMock).setReturn(usuarioMock)',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l32-q3',
        question:
          'Como verificar com o Mockito que um método crítico (ex: `repositorio.save()`) foi chamado exatamente 1 vez?',
        options: [
          'verify(repositorio, times(1)).save(any())',
          'assert(repositorio.called == 1)',
          'check(repositorio.save())',
          'validateMock(repositorio, 1)',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 33,
    title: 'Design Patterns Clássicos em Java',
    description: 'Implementação de Builder (Lombok / nativo), Factory, Strategy e Observer.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Spring Framework',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l33-q1',
        question:
          'Qual padrão de projeto é ideal para construir objetos complexos com muitos parâmetros opcionais de forma fluente e legível?',
        options: [
          'Builder Pattern (ex: `Usuario.builder().nome("Ana").build()`)',
          'Singleton Pattern',
          'Adapter Pattern',
          'Prototype Pattern',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l33-q2',
        question:
          'Como o Spring Framework utiliza o padrão Strategy para selecionar dinamicamente diferentes implementações de uma mesma interface?',
        options: [
          'Injetando uma lista ou mapa de beans `Map<String, MinhaEstrategia>` e selecionando a estratégia em tempo de execução',
          'Usando múltiplos if/else encadeados',
          'Criando novas classes com classloader',
          'Com scripts em C',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l33-q3',
        question:
          'Qual biblioteca de geração de código reduz o boilerplate em Java gerando getters, setters, construtores e builders via anotações em tempo de compilação?',
        options: ['Project Lombok', 'Spring Generator', 'ByteBuddy', 'AutoJava'],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 34,
    title: 'Anotações Customizadas & Reflection API',
    description:
      'Criação de anotações com @Retention e @Target, e introspecção com java.lang.reflect.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Spring Framework',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l34-q1',
        question:
          'Qual política de retenção (`@Retention(RetentionPolicy.RUNTIME)`) é necessária para que uma anotação seja lida em tempo de execução via Reflection por frameworks como Spring?',
        options: [
          'RetentionPolicy.RUNTIME',
          'RetentionPolicy.CLASS',
          'RetentionPolicy.SOURCE',
          'RetentionPolicy.JVM',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l34-q2',
        question: 'Para que serve a anotação meta `@Target(ElementType.METHOD)`?',
        options: [
          'Restringir que a anotação customizada só possa ser aplicada sobre MÉTODOS',
          'Indicar o arquivo de destino',
          'Compilar apenas aquele método',
          'Definir prioridade',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l34-q3',
        question:
          'Qual é o principal cuidado ao utilizar a Reflection API de forma intensiva em áreas críticas?',
        options: [
          'Reflection pode ter sobrecarga de performance em loops de altíssima frequência e ignora checagens de segurança de tipos em tempo de compilação',
          'Reflection apaga o código',
          'Reflection só funciona em Linux',
          'Reflection desliga a JVM',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    levelNumber: 35,
    title: 'Projeto Final: API RESTful Corporativa & Resiliente',
    description:
      'Consolidação de Spring Boot, Spring Data JPA, DTOs com Records, Bean Validation e Virtual Threads.',
    unitNumber: 8,
    unitTitle: 'Padrões, Testes & Spring Framework',
    sectionName: 'Sênior - Avançado',
    questions: [
      {
        id: 'java-l35-q1',
        question:
          'Em uma arquitetura em camadas Spring Boot, qual é a responsabilidade correta da camada de Controller (`@RestController`)?',
        options: [
          'Receber a requisição HTTP, validar os DTOs de entrada via Bean Validation (`@Valid`), delegar o processamento para a camada de Service e retornar o ResponseEntity adequado',
          'Executar queries SQL diretamente no banco',
          'Configurar o sistema operacional',
          'Controlar o Garbage Collector',
        ],
        correctIndex: 0,
      },
      {
        id: 'java-l35-q2',
        question:
          'Qual anotação do Spring gerencia transações de banco de dados automaticamente, realizando commit no sucesso e rollback automático em caso de RuntimeException?',
        options: ['@Transactional', '@DatabaseCommit', '@SafeTransaction', '@Atomic'],
        correctIndex: 0,
      },
      {
        id: 'java-l35-q3',
        question:
          'Por que o ecossistema Java moderno (Java 21+ com Spring Boot 3) continua sendo o líder global indiscutível em grandes sistemas corporativos, bancários e de missão crítica?',
        options: [
          'Ecossistema maduro gigantesco, tipagem estática robusta, Virtual Threads de altíssima escala, compiladores JIT ultrarrápidos e retrocompatibilidade exemplar',
          'Por ser uma linguagem sem tipos',
          'Por rodar apenas em navegadores',
          'Por não precisar de testes',
        ],
        correctIndex: 0,
      },
    ],
  },
];
