# DevDeck — Rede Social Gamificada para Programadores 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

O **DevDeck** é uma rede social completa, moderna e gamificada desenvolvida sob medida para programadores. Nele, desenvolvedores podem compartilhar dúvidas, postar ideias, competir em duelos de código em tempo real com editor integrado, testar seus conhecimentos em quizzes diários gerados automaticamente, acumular XP e subir de nível em trilhas específicas de tecnologia (como TypeScript, Python, Rust, Go, etc.) e colecionar insígnias (badges) meméticas e interativas de conquistas.

---

## 🎨 Funcionalidades Principais (Features)

### 🐦 Interface Estilo Twitter/X (Desktop & Mobile)
- **Barra Lateral Completa**: Navegação ágil no desktop incluindo Página Inicial, Explorar, Notificações com contador em tempo real, Bate-papo, Ducky (Assistente Virtual), Itens Salvos, Perfil do Usuário e modal de Upgrade Premium ativo com contador regressivo.
- **Header e Bottom Nav**: Design otimizado para celulares estilo Twitter Mobile, ocultando a barra lateral e dando lugar a um menu inferior e cabeçalho compactos.
- **Tema Escuro Puro (OLED Black)**: Visual moderno e escuro de alta legibilidade, com suporte a troca de aparência diretamente nas configurações da conta.

### 🎮 Gamificação de Aprendizado e Redes Sociais
- **Trilhas de XP por Linguagem**: Acumule experiência e avance de nível individualmente em TypeScript, Python, Go, C++, Java, Swift, Rust, Kotlin ou JavaScript.
- **Quiz Diário Oficial**: Teste rápido de codificação na aba de quizzes que concede `+15 XP` ao ser respondido corretamente.
- **Badges Meméticos Profissionais**: Conquistas interativas com geometrias exclusivas (hexágonos, escudos, anéis concêntricos) inspiradas no Credly, com títulos como *Hello World!*, *Sobrevivente do Segfault*, *Git Push --force* e *Mago do TypeScript*.
- **Sequências Diárias (Streaks)**: Acompanhe sua ofensiva diária em cada tecnologia.

### ⚔️ Duelos de Código em Tempo Real
- **Editor de Código Integrado**: Submeta soluções diretamente da plataforma com destaque de sintaxe profissional (CodeMirror).
- **Matchmaking & Votação da Comunidade**: Desafie outros usuários no ranking geral e participe votando na melhor resposta dos duelos ativos.

### 💬 Chat / Mensagens e Notificações Reais
- **Notificações em Tempo Real**: Alertas dinâmicos disparados quando respondem suas dúvidas, quando você ganha XP ou é desafiado para duelos.
- **Bate-papo Interno (`/messages`)**: Envie mensagens privadas para outros programadores de forma fluida.
- **Sugestão de Menção com `@`**: Pop-up premium semitransparente que autocompleta nomes de usuário à medida que você escreve postagens.

---

## 🛠️ Stack Tecnológica

- **Core**: Next.js 16 (App Router) & React 19
- **Estilização**: Tailwind CSS v4 (Flat Design System em tons OLED e Laranja)
- **Animações**: Framer Motion (Transições e Toasts dinâmicos)
- **Banco de Dados**: Supabase (PostgreSQL, Auth baseada em Cookies de Sessão, Realtime)
- **Banco ORM**: Prisma 7 (com driver adapter nativo `@prisma/adapter-pg` e WASM)
- **Validação**: Zod

---

## 🗄️ Arquitetura do Banco de Dados (Modelagem Prisma)

* `User`: Cadastro principal, bio, total de XP geral e conquistas.
* `LanguageTrail`: Progressão, XP acumulado e streaks por tecnologia individual.
* `Post`: Dúvidas técnicas (com linguagem e código) ou postagens de Discussão Geral.
* `Answer`: Comentários de soluções com suporte à aceitação do autor do post (`is_accepted`).
* `Quiz` & `QuizAttempt`: Quizzes vinculados a posts e histórico de respostas dos usuários.
* `Duel`, `DuelSolution` & `DuelVote`: Matchmaking de algoritmo, submissões de código e votação.
* `Badge` & `UserBadge`: Relação de conquistas e badges desbloqueados pelos usuários.
* `Report`: Registro de denúncias de posts impróprios.

---

## 🚀 Como Iniciar Localmente

### 1. Pré-requisitos
* Node.js v20 ou superior instalado.

### 2. Clonar e Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis obtidas no painel do Supabase:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

### 4. Preparar o Banco de Dados (Prisma)
Gere o cliente do Prisma:
```bash
npx prisma generate
```

Aplique as migrations para criar as tabelas no Supabase:
```bash
npx prisma migrate dev
```

Popule o banco com dados de teste estruturados (badges, usuários confirmados, duelos, etc.):
```bash
npx prisma db seed
```

### 5. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
Abra seu navegador em [http://localhost:3000](http://localhost:3000).

---

## 👥 Contas de Teste (Provisionadas no Seed)

Você pode logar nas seguintes contas pré-configuradas (senha idêntica para todas):
* **Senha padrão:** `pedroa080705!`

1. **Pedro (Especialidade: TypeScript)**
   - **E-mail:** `pedro@devdeck.dev`
2. **Ana (Especialidade: Python)**
   - **E-mail:** `ana@devdeck.dev`
3. **Carlos (Especialidade: Rust & C++)**
   - **E-mail:** `carlos@devdeck.dev`

---

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos e portfólio pessoal. Sinta-se livre para explorar o código, clonar e criar novas features.
