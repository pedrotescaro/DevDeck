import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Language } from '@prisma/client';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Adding extra posts for explore tabs...\n');

  // Find all existing users in the DB
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.error('❌ No users found in the database. Please run the main seed first.');
    return;
  }

  console.log(`Found ${users.length} users in the database.`);

  const postsToCreate = [
    // --- NOTÍCIAS ---
    {
      title: 'Next.js 16 lançado oficialmente com melhorias de performance no Turbopack',
      body: 'O time da Vercel anunciou hoje o Next.js 16! A maior novidade é a estabilização completa do Turbopack, que agora está habilitado por padrão em todos os novos projetos e entrega builds até 90% mais rápidos.',
      language: Language.JS,
      code_snippet: 'npx create-next-app@latest --turbopack',
      view_count: 120,
    },
    {
      title: 'React 19 está estável: o que muda com React Server Actions?',
      body: 'As Server Actions vieram para ficar no React 19. Elas simplificam a comunicação cliente-servidor sem a necessidade de criar endpoints de API manuais. Como vocês estão estruturando o error handling e validações de schemas com Zod nas suas actions?',
      language: Language.TS,
      code_snippet:
        "// Server Action de exemplo\nasync function subscribe(formData: FormData) {\n  'use server';\n  const email = formData.get('email');\n  // ... salvar no banco\n}",
      view_count: 98,
    },
    {
      title: 'Prisma 6 introduz suporte completo a novas extensões do Postgres',
      body: 'A nova versão do Prisma traz melhorias incríveis de tipagem para extensões como pg_vector e suporte nativo a indexação avançada. Quem já atualizou sentiu diferença na velocidade de geração do client?',
      language: Language.JS,
      code_snippet:
        'generator client {\n  provider = "prisma-client-js"\n  previewFeatures = ["postgresqlExtensions"]\n}',
      view_count: 76,
    },
    {
      title: 'GitHub Copilot Workspace: o futuro do desenvolvimento assistido por IA',
      body: 'O Copilot Workspace traz um ambiente completo onde você descreve a tarefa em linguagem natural e a IA gera todo o plano de especificação, código e verificação. O que vocês acham dessa evolução no papel do desenvolvedor?',
      language: Language.TS,
      code_snippet:
        '// O Copilot gera o plano:\n// 1. Pesquisar arquivos\n// 2. Modificar código\n// 3. Rodar testes',
      view_count: 154,
    },

    // --- OPEN SOURCE ---
    {
      title: 'Como fazer sua primeira contribuição em projetos de código aberto',
      body: 'Contribuir para open source pode parecer assustador no início, mas é uma das melhores maneiras de evoluir na carreira. Dica: procure por issues marcadas com "good first issue" ou comece melhorando a documentação dos projetos que você já usa!',
      language: Language.JS,
      code_snippet:
        '# Clone o repositório\ngit clone https://github.com/exemplo/projeto-os.git\n# Crie uma branch para a correção\ngit checkout -b fix/documentacao',
      view_count: 64,
    },
    {
      title: 'Por que Rust é a linguagem favorita para novos projetos Open Source?',
      body: 'Segurança de memória sem garbage collector, concorrência segura por design e um ecossistema moderno com Cargo. Esses são os pilares que fazem do Rust a escolha preferida para a criação de novas ferramentas de infraestrutura e bibliotecas.',
      language: Language.RUST,
      code_snippet:
        'fn main() {\n    let mut data = vec![1, 2, 3];\n    // O compilador garante concorrência segura por design\n    std::thread::spawn(move || {\n        data.push(4);\n    });\n}',
      view_count: 89,
    },
    {
      title: 'O estado do Open Source em 2026: sustentabilidade e IA',
      body: 'Com o crescimento estrondoso de ferramentas baseadas em IA generativa, como o open source deve se posicionar quanto ao licenciamento de dados e sustentabilidade financeira dos mantenedores de pacotes críticos?',
      language: Language.JS,
      code_snippet: '// Licenças clássicas como MIT/Apache 2.0 vs novas licenças focadas em IA',
      view_count: 47,
    },
    {
      title: 'Principais repositórios Git para treinar habilidades de desenvolvimento',
      body: 'Aqui vai uma lista de repositórios open source que possuem um design de código excelente para estudar: \n1. Exemplo de CLI limpa em Go\n2. Padrões de arquitetura limpa em TypeScript\n3. Algoritmos clássicos implementados em Python.',
      language: Language.GO,
      code_snippet: 'git clone https://github.com/golang/go.git',
      view_count: 52,
    },

    // --- CARREIRA ---
    {
      title: 'Como passar em entrevistas de System Design para vagas sênior',
      body: 'Em entrevistas sênior, o foco está em trade-offs. Não existe resposta perfeita: discuta escalabilidade vertical vs horizontal, escolha do banco de dados adequado (SQL vs NoSQL), estratégias de cache e arquitetura orientada a eventos.',
      language: Language.TS,
      code_snippet:
        '// Arquitetura clássica de System Design:\n// Client -> Load Balancer -> Web App -> Cache -> DB',
      view_count: 180,
    },
    {
      title: 'O que as empresas realmente buscam em um currículo de desenvolvedor júnior',
      body: 'Mais do que uma lista de tecnologias, os recrutadores buscam ver sua capacidade de resolver problemas práticos e vontade de aprender. Destaque projetos reais completos, contribuições open source e descreva o impacto ou as decisões de engenharia que tomou.',
      language: Language.JS,
      code_snippet: '// Foque em projetos que resolvam dores reais e mostrem código organizado',
      view_count: 142,
    },
    {
      title: 'Dicas essenciais para negociar salário na área de tecnologia',
      body: 'Nunca diga a primeira oferta. Pesquise a faixa de mercado para o seu nível e destaque os resultados específicos que você entregou em experiências passadas. Lembre-se: negociação não é cabo de guerra, é sobre valor mútuo.',
      language: Language.PYTHON,
      code_snippet:
        '# Calcule seu valor de mercado baseado em faixa salarial\ndef calcula_faixa(cargo, nivel):\n    # ... lógica de mercado',
      view_count: 99,
    },
    {
      title: 'Como transicionar de desenvolvedor pleno para sênior em 1 ano',
      body: 'Ser sênior não é só programar mais rápido, é sobre mentoria, ownership de ponta a ponta e alinhamento de decisões técnicas com objetivos de negócio. Foque em melhorar os processos do time e assumir liderança técnica de tarefas complexas.',
      language: Language.RUST,
      code_snippet: '// Habilidades sênior:\n// 1. Arquitetura\n// 2. Mentoria\n// 3. Negócio',
      view_count: 115,
    },
  ];

  console.log(`Creating ${postsToCreate.length} posts...`);

  for (let i = 0; i < postsToCreate.length; i++) {
    const postData = postsToCreate[i];
    // Assign to users round-robin
    const author = users[i % users.length];

    // Check if post already exists
    const existing = await prisma.post.findFirst({
      where: { title: postData.title },
    });

    if (!existing) {
      const created = await prisma.post.create({
        data: {
          author_id: author.id,
          title: postData.title,
          body: postData.body,
          language: postData.language,
          code_snippet: postData.code_snippet,
          view_count: postData.view_count,
        },
      });
      console.log(`  ✅ Post created: "${created.title}" by @${author.username}`);
    } else {
      console.log(`  ⚠️ Post already exists, skipping: "${postData.title}"`);
    }
  }

  console.log('\n🎉 Extra posts added successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Failed to add extra posts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
