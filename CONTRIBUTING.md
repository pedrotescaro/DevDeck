# Como Contribuir para o DevDeck

Obrigado por se interessar em contribuir para o DevDeck! Este documento serve para orientar o processo de contribuição, garantindo que o código permaneça limpo, seguro e funcional.

## Diretrizes e Processos

### 1. Relatando Bugs (Bug Reports)

Se você encontrar algum bug ou comportamento inesperado, por favor abra uma issue utilizando nosso template de **Relatório de Bug (Bug Report)**. Certifique-se de incluir:

- Passos claros para reproduzir o problema.
- Comportamento esperado vs. comportamento observado.
- Informações sobre o ambiente (versão do Node.js, sistema operacional, navegador).
- Logs de console ou mensagens de erro relevantes.

### 2. Propondo Funcionalidades (Feature Requests)

Quer propor uma melhoria ou uma nova funcionalidade? Abra uma issue utilizando o template de **Solicitação de Funcionalidade (Feature Request)**. Explique:

- Qual é a dor ou o problema resolvido.
- A solução proposta detalhada.
- Possíveis alternativas consideradas.

### 3. Configuração Local (Setup Local)

Para configurar o ambiente de desenvolvimento localmente, siga estes passos:

1. Faça o clone do repositório:
   ```bash
   git clone https://github.com/pedrotescaro/DevDeck.git
   cd DevDeck
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo `.env.example` para `.env.local` e preencha as variáveis de ambiente necessárias (Supabase, Upstash, OpenAI, etc.):
   ```bash
   cp .env.example .env.local
   ```
4. Execute as migrações do banco de dados e o seed:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### 4. Padrões de Código (ESLint & Prettier)

Garantimos a consistência do código por meio de formatação e linting automatizados:

- **Prettier**: Usamos uma configuração padronizada (2 espaços de indentação, aspas duplas, ponto-e-vírgula). Execute `npm run format` para formatar todo o projeto.
- **ESLint**: O código deve passar em todas as regras sem avisos ou erros.
- **Pre-commit**: Usamos Husky e `lint-staged` para garantir que apenas códigos limpos e formatados sejam commitados.

### 5. Padrão de Commits (Conventional Commits)

Seus commits devem seguir a especificação [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/):

- `feat(componente):` para novas funcionalidades.
- `fix(componente):` para correções de bugs.
- `docs(docs):` para alterações na documentação.
- `style(estilos):` para mudanças de formatação e estilo visual sem alteração de comportamento.
- `refactor(codigo):` para alterações de código que não corrigem bugs nem adicionam funcionalidades.
- `test(testes):` para adicionar ou corrigir testes.
- `ci(fluxos):` para mudanças em configurações de CI/CD.

### 6. O que NÃO Aceitamos

- Código sem formatação adequada ou que quebre o build/lint.
- Commits com mensagens genéricas (ex: "ajustes", "fix").
- Alterações que exponham credenciais ou chaves de API reais.
- Modificações de escopo não discutidas previamente em issues.
- Pull Requests gigantescos e sem descrição clara.

### 7. Processo de Revisão (Review Process)

1. Crie uma branch específica para sua alteração: `git checkout -b feat/nome-da-feature` ou `git checkout -b fix/nome-do-bug`.
2. Certifique-se de que os testes locais passam (`npm test`) e o build também funciona (`npm run build`).
3. Abra um Pull Request utilizando o nosso template de Pull Request.
4. Aguarde a validação da CI e o review de pelo menos um mantenedor antes do merge.
