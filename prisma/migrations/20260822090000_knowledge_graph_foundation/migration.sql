-- Knowledge Graph domain foundation

DO $$ BEGIN
    CREATE TYPE "KnowledgeNodeType" AS ENUM ('FOUNDATION', 'LANGUAGE', 'CONCEPT', 'FRAMEWORK', 'LIBRARY', 'TOOL', 'DATABASE', 'ARCHITECTURE', 'PROJECT', 'CHALLENGE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "KnowledgeRelation" AS ENUM ('REQUIRED', 'RECOMMENDED', 'RELATED', 'BUILDS_ON', 'COMBINES');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "KnowledgeProgressStatus" AS ENUM ('NOT_STARTED', 'AVAILABLE', 'RECOMMENDED', 'IN_PROGRESS', 'COMPLETED', 'MASTERED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "AssistanceMode" AS ENUM ('GUIDED', 'STANDARD', 'HARD', 'NO_ASSIST');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "ExerciseSubmissionStatus" AS ENUM ('PASSED', 'FAILED', 'ERROR');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "LearningEventType" AS ENUM ('HINT_OPENED', 'DOCUMENTATION_OPENED', 'EXERCISE_RUN', 'EXERCISE_SUBMIT', 'TEST_FAILED', 'TEST_PASSED', 'EXERCISE_COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "knowledge_nodes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "KnowledgeNodeType" NOT NULL,
    "category" TEXT NOT NULL,
    "language" "Language",
    "difficulty" INTEGER NOT NULL,
    "xp_reward" INTEGER NOT NULL,
    "estimated_minutes" INTEGER,
    "position_x" INTEGER NOT NULL,
    "position_y" INTEGER NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "knowledge_nodes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "knowledge_nodes_difficulty_check" CHECK ("difficulty" BETWEEN 1 AND 5),
    CONSTRAINT "knowledge_nodes_xp_reward_check" CHECK ("xp_reward" >= 0),
    CONSTRAINT "knowledge_nodes_position_check" CHECK ("position_x" >= 0 AND "position_y" >= 0)
);

CREATE TABLE IF NOT EXISTS "knowledge_edges" (
    "id" TEXT NOT NULL,
    "source_node_id" TEXT NOT NULL,
    "target_node_id" TEXT NOT NULL,
    "relation" "KnowledgeRelation" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "knowledge_edges_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "knowledge_edges_distinct_nodes_check" CHECK ("source_node_id" <> "target_node_id")
);

CREATE TABLE IF NOT EXISTS "learning_paths" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accent_color" TEXT NOT NULL,
    "estimated_minutes" INTEGER,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "learning_path_nodes" (
    "id" TEXT NOT NULL,
    "learning_path_id" TEXT NOT NULL,
    "knowledge_node_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "learning_path_nodes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "learning_path_nodes_position_check" CHECK ("position" >= 1)
);

CREATE TABLE IF NOT EXISTS "exercises" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "knowledge_node_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "base_xp" INTEGER NOT NULL,
    "estimated_minutes" INTEGER,
    "starter_code" TEXT NOT NULL,
    "function_name" TEXT NOT NULL,
    "constraints" TEXT[] NOT NULL,
    "hints" TEXT[] NOT NULL,
    "documentation_url" TEXT,
    "examples" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "exercises_difficulty_check" CHECK ("difficulty" BETWEEN 1 AND 5),
    CONSTRAINT "exercises_base_xp_check" CHECK ("base_xp" >= 0)
);

CREATE TABLE IF NOT EXISTS "exercise_test_cases" (
    "id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "input" JSONB,
    "invocation_code" TEXT,
    "expected_output" JSONB NOT NULL,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    CONSTRAINT "exercise_test_cases_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "exercise_test_cases_invocation_check" CHECK ("input" IS NOT NULL OR "invocation_code" IS NOT NULL),
    CONSTRAINT "exercise_test_cases_position_check" CHECK ("position" >= 1)
);

CREATE TABLE IF NOT EXISTS "user_node_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "knowledge_node_id" TEXT NOT NULL,
    "status" "KnowledgeProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "mastery" INTEGER NOT NULL DEFAULT 0,
    "completed_exercises" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMPTZ(3),
    "completed_at" TIMESTAMPTZ(3),
    "last_activity_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_node_progress_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_node_progress_mastery_check" CHECK ("mastery" BETWEEN 0 AND 100),
    CONSTRAINT "user_node_progress_completed_exercises_check" CHECK ("completed_exercises" >= 0)
);

CREATE TABLE IF NOT EXISTS "exercise_runs" (
    "id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assistance_mode" "AssistanceMode" NOT NULL,
    "code" TEXT NOT NULL,
    "passed_tests" INTEGER NOT NULL,
    "total_tests" INTEGER NOT NULL,
    "output" TEXT,
    "error_message" TEXT,
    "execution_ms" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exercise_runs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "exercise_runs_counts_check" CHECK ("passed_tests" >= 0 AND "total_tests" >= 0 AND "passed_tests" <= "total_tests")
);

CREATE TABLE IF NOT EXISTS "exercise_submissions" (
    "id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assistance_mode" "AssistanceMode" NOT NULL,
    "status" "ExerciseSubmissionStatus" NOT NULL,
    "code" TEXT NOT NULL,
    "passed_public" INTEGER NOT NULL,
    "total_public" INTEGER NOT NULL,
    "passed_hidden" INTEGER NOT NULL,
    "total_hidden" INTEGER NOT NULL,
    "xp_earned" INTEGER NOT NULL DEFAULT 0,
    "first_completion" BOOLEAN NOT NULL DEFAULT false,
    "error_message" TEXT,
    "execution_ms" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exercise_submissions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "exercise_submissions_public_counts_check" CHECK ("passed_public" >= 0 AND "total_public" >= 0 AND "passed_public" <= "total_public"),
    CONSTRAINT "exercise_submissions_hidden_counts_check" CHECK ("passed_hidden" >= 0 AND "total_hidden" >= 0 AND "passed_hidden" <= "total_hidden"),
    CONSTRAINT "exercise_submissions_xp_check" CHECK ("xp_earned" >= 0)
);

CREATE TABLE IF NOT EXISTS "learning_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_id" TEXT,
    "event_type" "LearningEventType" NOT NULL,
    "assistance_mode" "AssistanceMode",
    "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "learning_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "knowledge_nodes_slug_key" ON "knowledge_nodes"("slug");
CREATE INDEX IF NOT EXISTS "knowledge_nodes_published_category_idx" ON "knowledge_nodes"("is_published", "category");
CREATE INDEX IF NOT EXISTS "knowledge_nodes_language_idx" ON "knowledge_nodes"("language");
CREATE UNIQUE INDEX IF NOT EXISTS "knowledge_edges_source_target_relation_key" ON "knowledge_edges"("source_node_id", "target_node_id", "relation");
CREATE INDEX IF NOT EXISTS "knowledge_edges_source_idx" ON "knowledge_edges"("source_node_id");
CREATE INDEX IF NOT EXISTS "knowledge_edges_target_idx" ON "knowledge_edges"("target_node_id");
CREATE UNIQUE INDEX IF NOT EXISTS "learning_paths_slug_key" ON "learning_paths"("slug");
CREATE INDEX IF NOT EXISTS "learning_paths_published_featured_idx" ON "learning_paths"("is_published", "is_featured");
CREATE UNIQUE INDEX IF NOT EXISTS "learning_path_nodes_path_node_key" ON "learning_path_nodes"("learning_path_id", "knowledge_node_id");
CREATE UNIQUE INDEX IF NOT EXISTS "learning_path_nodes_path_position_key" ON "learning_path_nodes"("learning_path_id", "position");
CREATE INDEX IF NOT EXISTS "learning_path_nodes_node_idx" ON "learning_path_nodes"("knowledge_node_id");
CREATE UNIQUE INDEX IF NOT EXISTS "exercises_slug_key" ON "exercises"("slug");
CREATE INDEX IF NOT EXISTS "exercises_node_published_idx" ON "exercises"("knowledge_node_id", "is_published");
CREATE INDEX IF NOT EXISTS "exercises_language_difficulty_idx" ON "exercises"("language", "difficulty");
CREATE UNIQUE INDEX IF NOT EXISTS "exercise_test_cases_exercise_position_key" ON "exercise_test_cases"("exercise_id", "position");
CREATE INDEX IF NOT EXISTS "exercise_test_cases_exercise_hidden_idx" ON "exercise_test_cases"("exercise_id", "is_hidden");
CREATE UNIQUE INDEX IF NOT EXISTS "user_node_progress_user_node_key" ON "user_node_progress"("user_id", "knowledge_node_id");
CREATE INDEX IF NOT EXISTS "user_node_progress_user_status_idx" ON "user_node_progress"("user_id", "status");
CREATE INDEX IF NOT EXISTS "user_node_progress_node_idx" ON "user_node_progress"("knowledge_node_id");
CREATE INDEX IF NOT EXISTS "exercise_runs_user_exercise_created_idx" ON "exercise_runs"("user_id", "exercise_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "exercise_runs_exercise_idx" ON "exercise_runs"("exercise_id");
CREATE INDEX IF NOT EXISTS "exercise_submissions_user_exercise_created_idx" ON "exercise_submissions"("user_id", "exercise_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "exercise_submissions_exercise_status_idx" ON "exercise_submissions"("exercise_id", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "exercise_submissions_first_completion_key" ON "exercise_submissions"("user_id", "exercise_id") WHERE "first_completion" = true;
CREATE INDEX IF NOT EXISTS "learning_events_user_type_created_idx" ON "learning_events"("user_id", "event_type", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "learning_events_exercise_idx" ON "learning_events"("exercise_id");

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'knowledge_edges_source_node_id_fkey') THEN
        ALTER TABLE "knowledge_edges" ADD CONSTRAINT "knowledge_edges_source_node_id_fkey" FOREIGN KEY ("source_node_id") REFERENCES "knowledge_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'knowledge_edges_target_node_id_fkey') THEN
        ALTER TABLE "knowledge_edges" ADD CONSTRAINT "knowledge_edges_target_node_id_fkey" FOREIGN KEY ("target_node_id") REFERENCES "knowledge_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'learning_path_nodes_learning_path_id_fkey') THEN
        ALTER TABLE "learning_path_nodes" ADD CONSTRAINT "learning_path_nodes_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'learning_path_nodes_knowledge_node_id_fkey') THEN
        ALTER TABLE "learning_path_nodes" ADD CONSTRAINT "learning_path_nodes_knowledge_node_id_fkey" FOREIGN KEY ("knowledge_node_id") REFERENCES "knowledge_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercises_knowledge_node_id_fkey') THEN
        ALTER TABLE "exercises" ADD CONSTRAINT "exercises_knowledge_node_id_fkey" FOREIGN KEY ("knowledge_node_id") REFERENCES "knowledge_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_test_cases_exercise_id_fkey') THEN
        ALTER TABLE "exercise_test_cases" ADD CONSTRAINT "exercise_test_cases_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_node_progress_user_id_fkey') THEN
        ALTER TABLE "user_node_progress" ADD CONSTRAINT "user_node_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_node_progress_knowledge_node_id_fkey') THEN
        ALTER TABLE "user_node_progress" ADD CONSTRAINT "user_node_progress_knowledge_node_id_fkey" FOREIGN KEY ("knowledge_node_id") REFERENCES "knowledge_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_runs_exercise_id_fkey') THEN
        ALTER TABLE "exercise_runs" ADD CONSTRAINT "exercise_runs_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_runs_user_id_fkey') THEN
        ALTER TABLE "exercise_runs" ADD CONSTRAINT "exercise_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_submissions_exercise_id_fkey') THEN
        ALTER TABLE "exercise_submissions" ADD CONSTRAINT "exercise_submissions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_submissions_user_id_fkey') THEN
        ALTER TABLE "exercise_submissions" ADD CONSTRAINT "exercise_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'learning_events_user_id_fkey') THEN
        ALTER TABLE "learning_events" ADD CONSTRAINT "learning_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'learning_events_exercise_id_fkey') THEN
        ALTER TABLE "learning_events" ADD CONSTRAINT "learning_events_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- The catalog is idempotent so environments receive the same real learning graph.
INSERT INTO "knowledge_nodes" ("id", "slug", "title", "description", "type", "category", "language", "difficulty", "xp_reward", "estimated_minutes", "position_x", "position_y", "is_published") VALUES
('kn-foundations', 'programming-foundations', 'Fundamentos de Programação', 'Transforme requisitos em funções previsíveis, trate entradas irregulares e preserve contratos.', 'FOUNDATION', 'Fundamentos', 'JS', 3, 120, 90, 80, 100, true),
('kn-functions', 'functions-and-scope', 'Funções e Escopo', 'Projete closures com estado encapsulado e comportamento determinístico.', 'CONCEPT', 'JavaScript', 'JS', 3, 150, 110, 300, 100, true),
('kn-collections', 'collections-and-complexity', 'Coleções e Complexidade', 'Manipule estruturas com atenção a casos-limite e custo algorítmico.', 'CONCEPT', 'JavaScript', 'JS', 4, 180, 150, 520, 100, true),
('kn-async', 'async-control-flow', 'Fluxo Assíncrono', 'Controle concorrência, ordem de resultados e propagação de falhas.', 'CONCEPT', 'JavaScript', 'JS', 5, 220, 180, 740, 100, true),
('kn-http', 'http-resilient-apis', 'HTTP e APIs Resilientes', 'Interprete contratos HTTP e implemente políticas de recuperação sem heurísticas frágeis.', 'ARCHITECTURE', 'Web', 'TS', 4, 190, 140, 740, 320, true),
('kn-typescript', 'typescript-domain-modeling', 'Modelagem de Domínio com TypeScript', 'Modele uniões discriminadas e preserve inferência em transformações de dados.', 'LANGUAGE', 'TypeScript', 'TS', 4, 190, 150, 520, 320, true),
('kn-react-state', 'react-state-architecture', 'Arquitetura de Estado React', 'Reconcilie atualizações otimistas, confirmações e rollback de forma pura.', 'FRAMEWORK', 'Frontend', 'TS', 5, 230, 190, 300, 320, true),
('kn-graphs', 'graph-algorithms', 'Algoritmos em Grafos', 'Resolva dependências, detecte ciclos e produza ordens estáveis.', 'CONCEPT', 'Algoritmos', 'TS', 5, 240, 200, 520, 540, true),
('kn-postgres', 'postgres-data-access', 'Acesso Seguro a PostgreSQL', 'Construa consultas parametrizadas com filtros opcionais e ordenação controlada.', 'DATABASE', 'Backend', NULL, 4, 200, 160, 960, 320, true),
('kn-fullstack', 'fullstack-integration', 'Integração Fullstack', 'Implemente processamento idempotente que combina validação, deduplicação e resultados auditáveis.', 'PROJECT', 'Projetos', 'TS', 5, 280, 240, 850, 540, true)
ON CONFLICT ("slug") DO UPDATE SET
"title" = EXCLUDED."title", "description" = EXCLUDED."description", "type" = EXCLUDED."type", "category" = EXCLUDED."category", "language" = EXCLUDED."language", "difficulty" = EXCLUDED."difficulty", "xp_reward" = EXCLUDED."xp_reward", "estimated_minutes" = EXCLUDED."estimated_minutes", "position_x" = EXCLUDED."position_x", "position_y" = EXCLUDED."position_y", "is_published" = EXCLUDED."is_published", "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "knowledge_edges" ("id", "source_node_id", "target_node_id", "relation") VALUES
('ke-foundations-functions', 'kn-foundations', 'kn-functions', 'REQUIRED'),
('ke-functions-collections', 'kn-functions', 'kn-collections', 'RECOMMENDED'),
('ke-functions-async', 'kn-functions', 'kn-async', 'BUILDS_ON'),
('ke-collections-async', 'kn-collections', 'kn-async', 'RECOMMENDED'),
('ke-async-http', 'kn-async', 'kn-http', 'BUILDS_ON'),
('ke-functions-typescript', 'kn-functions', 'kn-typescript', 'RECOMMENDED'),
('ke-typescript-react', 'kn-typescript', 'kn-react-state', 'BUILDS_ON'),
('ke-http-react', 'kn-http', 'kn-react-state', 'RECOMMENDED'),
('ke-collections-graphs', 'kn-collections', 'kn-graphs', 'BUILDS_ON'),
('ke-http-postgres', 'kn-http', 'kn-postgres', 'RELATED'),
('ke-react-fullstack', 'kn-react-state', 'kn-fullstack', 'COMBINES'),
('ke-http-fullstack', 'kn-http', 'kn-fullstack', 'COMBINES'),
('ke-postgres-fullstack', 'kn-postgres', 'kn-fullstack', 'COMBINES')
ON CONFLICT ("source_node_id", "target_node_id", "relation") DO NOTHING;

INSERT INTO "learning_paths" ("id", "slug", "title", "description", "accent_color", "estimated_minutes", "is_featured", "is_published") VALUES
('lp-javascript-systems', 'javascript-systems', 'JavaScript para Sistemas', 'Do contrato de uma função ao controle de concorrência e APIs resilientes.', '#3b82f6', 770, true, true),
('lp-frontend-react', 'frontend-react', 'Frontend React', 'Um caminho recomendado para modelar dados, estado e integração HTTP.', '#8b5cf6', 830, true, true),
('lp-backend-data', 'backend-data', 'Backend e Dados', 'Construa serviços resilientes, acesso seguro a dados e integração idempotente.', '#14b8a6', 940, false, true),
('lp-algorithms', 'algorithms', 'Algoritmos Aplicados', 'Evolua de coleções para dependências complexas e detecção de ciclos.', '#f59e0b', 550, false, true)
ON CONFLICT ("slug") DO UPDATE SET
"title" = EXCLUDED."title", "description" = EXCLUDED."description", "accent_color" = EXCLUDED."accent_color", "estimated_minutes" = EXCLUDED."estimated_minutes", "is_featured" = EXCLUDED."is_featured", "is_published" = EXCLUDED."is_published", "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "learning_path_nodes" ("id", "learning_path_id", "knowledge_node_id", "position") VALUES
('lpn-js-1', 'lp-javascript-systems', 'kn-foundations', 1), ('lpn-js-2', 'lp-javascript-systems', 'kn-functions', 2), ('lpn-js-3', 'lp-javascript-systems', 'kn-collections', 3), ('lpn-js-4', 'lp-javascript-systems', 'kn-async', 4), ('lpn-js-5', 'lp-javascript-systems', 'kn-http', 5),
('lpn-fe-1', 'lp-frontend-react', 'kn-foundations', 1), ('lpn-fe-2', 'lp-frontend-react', 'kn-functions', 2), ('lpn-fe-3', 'lp-frontend-react', 'kn-typescript', 3), ('lpn-fe-4', 'lp-frontend-react', 'kn-http', 4), ('lpn-fe-5', 'lp-frontend-react', 'kn-react-state', 5), ('lpn-fe-6', 'lp-frontend-react', 'kn-fullstack', 6),
('lpn-be-1', 'lp-backend-data', 'kn-foundations', 1), ('lpn-be-2', 'lp-backend-data', 'kn-functions', 2), ('lpn-be-3', 'lp-backend-data', 'kn-async', 3), ('lpn-be-4', 'lp-backend-data', 'kn-http', 4), ('lpn-be-5', 'lp-backend-data', 'kn-postgres', 5), ('lpn-be-6', 'lp-backend-data', 'kn-fullstack', 6),
('lpn-algo-1', 'lp-algorithms', 'kn-foundations', 1), ('lpn-algo-2', 'lp-algorithms', 'kn-functions', 2), ('lpn-algo-3', 'lp-algorithms', 'kn-collections', 3), ('lpn-algo-4', 'lp-algorithms', 'kn-graphs', 4)
ON CONFLICT ("learning_path_id", "knowledge_node_id") DO UPDATE SET "position" = EXCLUDED."position";

INSERT INTO "exercises" ("id", "slug", "knowledge_node_id", "title", "summary", "problem", "objective", "language", "difficulty", "base_xp", "estimated_minutes", "starter_code", "function_name", "constraints", "hints", "documentation_url", "examples", "is_published") VALUES
('ex-normalize-identifier', 'normalize-identifier', 'kn-foundations', 'Normalizador de identificadores', 'Converta entradas humanas irregulares em identificadores camelCase válidos.', 'Uma ferramenta de importação recebe rótulos com espaços, hífens, sublinhados, acentos e números. Implemente normalizeIdentifier(input) para remover diacríticos, separar palavras, produzir camelCase e prefixar um sublinhado quando o resultado começar por número. Entradas sem caracteres alfanuméricos devem produzir uma string vazia.', 'Produzir identificadores determinísticos sem depender de uma lista fixa de separadores.', 'JS', 3, 120, 25, 'function normalizeIdentifier(input) {\n  // Escreva sua solução aqui\n}', 'normalizeIdentifier', ARRAY['Não altere a entrada original.', 'Considere separadores consecutivos.', 'Preserve números dentro das palavras.'], ARRAY['String.prototype.normalize ajuda a decompor diacríticos.', 'Separe primeiro; aplique camelCase depois de limpar cada parte.'], 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/normalize', '[{"input":["  relatório-de VENDAS_2026  "],"output":"relatorioDeVendas2026"}]'::jsonb, true),
('ex-rate-limiter', 'closure-rate-limiter', 'kn-functions', 'Limitador por chave', 'Crie uma closure que mantenha contadores independentes sem expor estado mutável.', 'Implemente createRateLimiter(limit). A função retornada recebe uma chave e devolve true enquanto aquela chave ainda estiver dentro do limite; chamadas excedentes devolvem false. Chaves diferentes não compartilham contagem e limites menores que 1 bloqueiam todas as chamadas.', 'Demonstrar encapsulamento de estado e isolamento entre chaves.', 'JS', 3, 150, 30, 'function createRateLimiter(limit) {\n  // Retorne a função de verificação\n}', 'createRateLimiter', ARRAY['Não use variáveis globais.', 'Cada instância deve possuir estado próprio.', 'A complexidade média por chamada deve ser O(1).'], ARRAY['Um Map pode associar cada chave à quantidade de chamadas.', 'Normalize o limite uma única vez ao criar a closure.'], 'https://developer.mozilla.org/docs/Web/JavaScript/Closures', '[{"input":[2,["api","api","jobs","api"]],"output":[true,true,true,false]}]'::jsonb, true),
('ex-merge-intervals', 'merge-intervals', 'kn-collections', 'Mesclar janelas de execução', 'Normalize intervalos sobrepostos sem mutar a coleção recebida.', 'Implemente mergeIntervals(intervals). Cada intervalo é [inicio, fim], inclusivo. Intervalos sobrepostos ou adjacentes devem ser mesclados. A entrada pode estar fora de ordem e conter cópias. Retorne uma nova lista ordenada.', 'Escolher uma estratégia com complexidade O(n log n) e cobrir adjacência, duplicatas e entrada vazia.', 'JS', 4, 180, 35, 'function mergeIntervals(intervals) {\n  // Retorne os intervalos normalizados\n}', 'mergeIntervals', ARRAY['Não altere intervals nem seus itens.', 'Considere [1, 2] e [3, 4] adjacentes.', 'Retorne os limites em ordem crescente.'], ARRAY['Ordene uma cópia pelo início.', 'Compare cada intervalo com o último intervalo já consolidado.'], 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort', '[{"input":[[[5,7],[1,3],[2,4],[10,10]]],"output":[[1,7],[10,10]]}]'::jsonb, true),
('ex-map-concurrency', 'map-with-concurrency', 'kn-async', 'Mapeamento com concorrência limitada', 'Execute tarefas assíncronas sem exceder o limite e preserve a ordem do resultado.', 'Implemente async mapWithConcurrency(items, limit, worker). No máximo limit chamadas de worker podem permanecer ativas ao mesmo tempo. O array final deve manter a ordem de items, mesmo quando tarefas terminarem fora de ordem. Rejeições devem propagar e impedir o agendamento de novas tarefas.', 'Coordenar concorrência real sem processar tudo em série nem usar Promise.all diretamente sobre todos os itens.', 'JS', 5, 220, 45, 'async function mapWithConcurrency(items, limit, worker) {\n  // Retorne uma Promise com os resultados na ordem original\n}', 'mapWithConcurrency', ARRAY['limit deve ser inteiro positivo; caso contrário, lance TypeError.', 'Não inicie mais que limit workers simultâneos.', 'Preserve a ordem do array de entrada.'], ARRAY['Compartilhe um índice entre um número limitado de executores.', 'Armazene cada resultado na posição original.'], 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise', '[{"input":[[30,5,15],2],"output":[60,10,30]}]'::jsonb, true),
('ex-retry-after', 'parse-retry-after', 'kn-http', 'Interpretar Retry-After', 'Converta as duas formas do cabeçalho HTTP em atraso seguro.', 'Implemente parseRetryAfter(value, nowMs). O cabeçalho pode conter segundos inteiros ou uma data HTTP. Retorne o atraso em milissegundos, limitado ao intervalo de 0 a 300000. Valores ausentes, inválidos ou negativos retornam null.', 'Tratar corretamente números, datas, limites e relógio de referência sem depender de Date.now nos testes.', 'TS', 4, 190, 30, 'function parseRetryAfter(value: string | null, nowMs: number): number | null {\n  // Escreva sua solução aqui\n}', 'parseRetryAfter', ARRAY['Não use Date.now().', 'Atrasos acima de cinco minutos devem ser limitados.', 'Espaços externos são permitidos.'], ARRAY['Teste primeiro o formato inteiro completo.', 'Date.parse retorna NaN para datas inválidas.'], 'https://developer.mozilla.org/docs/Web/HTTP/Reference/Headers/Retry-After', '[{"input":["120",0],"output":120000}]'::jsonb, true),
('ex-index-events', 'index-discriminated-events', 'kn-typescript', 'Indexar eventos discriminados', 'Agrupe uma união discriminada sem perder ordem ou referência dos objetos.', 'Implemente indexEvents(events). Cada evento possui kind, entityId e occurredAt, além de campos específicos. Retorne um objeto cujas chaves são kind e cujos valores agrupam eventos por entityId. Dentro de cada grupo, ordene por occurredAt crescente sem mutar a entrada.', 'Combinar modelagem genérica, agrupamento e ordenação imutável.', 'TS', 4, 190, 40, 'type DomainEvent = { kind: string; entityId: string; occurredAt: string; [key: string]: unknown };\n\nfunction indexEvents(events: DomainEvent[]) {\n  // Escreva sua solução aqui\n}', 'indexEvents', ARRAY['Não altere o array nem os eventos.', 'Omita grupos vazios.', 'Datas estão em ISO 8601.'], ARRAY['Construa os níveis do índice de forma incremental.', 'Ordene cópias apenas depois de agrupar.'], 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions', '[{"input":[[{"kind":"updated","entityId":"a","occurredAt":"2026-01-02"},{"kind":"updated","entityId":"a","occurredAt":"2026-01-01"}]],"output":{"updated":{"a":[{"kind":"updated","entityId":"a","occurredAt":"2026-01-01"},{"kind":"updated","entityId":"a","occurredAt":"2026-01-02"}]}}}]'::jsonb, true),
('ex-optimistic-reducer', 'optimistic-state-reducer', 'kn-react-state', 'Reducer otimista resiliente', 'Reconcilie atualizações locais com confirmações e falhas fora de ordem.', 'Implemente optimisticReducer(state, action). O estado contém confirmedValue e pending, uma lista de {id, delta}. APPLY adiciona uma operação se o id ainda não existir. CONFIRM incorpora o delta em confirmedValue e remove a operação. REJECT apenas remove a operação. A propriedade value retornada deve ser confirmedValue mais todos os deltas pendentes.', 'Manter o reducer puro, idempotente e correto quando confirmações chegam fora de ordem.', 'TS', 5, 230, 45, 'function optimisticReducer(state, action) {\n  // Retorne um novo estado com confirmedValue, pending e value\n}', 'optimisticReducer', ARRAY['Não altere state, action ou pending.', 'APPLY repetido com o mesmo id é idempotente.', 'CONFIRM e REJECT desconhecidos não alteram valores.'], ARRAY['Calcule primeiro a nova lista pending.', 'Derive value no final em vez de atualizá-lo incrementalmente.'], 'https://react.dev/reference/react/useOptimistic', '[{"input":[{"confirmedValue":10,"pending":[],"value":10},{"type":"APPLY","id":"a","delta":3}],"output":{"confirmedValue":10,"pending":[{"id":"a","delta":3}],"value":13}}]'::jsonb, true),
('ex-topological-sort', 'stable-topological-sort', 'kn-graphs', 'Ordenação topológica estável', 'Ordene dependências e reporte ciclos sem perder nós isolados.', 'Implemente topologicalSort(nodes, edges). Cada aresta [from, to] indica que from deve vir antes de to. Quando mais de um nó estiver disponível, use a ordem original de nodes. Retorne {order, hasCycle}; se houver ciclo, order deve conter apenas a parte resolvível.', 'Aplicar o algoritmo de Kahn com desempate estável, nós isolados e arestas duplicadas.', 'TS', 5, 240, 50, 'function topologicalSort(nodes, edges) {\n  // Retorne { order, hasCycle }\n}', 'topologicalSort', ARRAY['Ignore arestas duplicadas.', 'Nós das arestas que não aparecem em nodes devem ser ignorados.', 'Não altere as entradas.'], ARRAY['Mantenha o grau de entrada de cada nó.', 'Use a posição original como critério da fila de disponíveis.'], 'https://en.wikipedia.org/wiki/Topological_sorting#Kahn%27s_algorithm', '[{"input":[["build","test","deploy"],[["build","test"],["test","deploy"]]],"output":{"order":["build","test","deploy"],"hasCycle":false}}]'::jsonb, true),
('ex-parameterized-query', 'build-parameterized-query', 'kn-postgres', 'Consulta parametrizada por filtros', 'Produza SQL e parâmetros sem interpolar valores controlados pelo usuário.', 'Implemente buildUserQuery(filters). Suporte active boolean, role string e createdAfter string. A ordenação aceita apenas newest ou oldest. Retorne {text, values}. Use placeholders PostgreSQL sequenciais e uma ordem determinística de filtros: active, role, createdAfter.', 'Separar valores do texto SQL e controlar identificadores que não podem ser parametrizados.', 'TS', 4, 200, 40, 'function buildUserQuery(filters) {\n  // Retorne { text, values }\n}', 'buildUserQuery', ARRAY['Nunca concatene valores no SQL.', 'Use SELECT id, username FROM "User".', 'A ordenação padrão é newest por created_at.'], ARRAY['Acumule cláusulas e valores em arrays separados.', 'Mapeie a ordenação para duas strings constantes.'], 'https://node-postgres.com/features/queries#parameterized-query', '[{"input":[{"active":true,"role":"ADMIN","sort":"oldest"}],"output":{"text":"SELECT id, username FROM \"User\" WHERE active = $1 AND role = $2 ORDER BY created_at ASC","values":[true,"ADMIN"]}}]'::jsonb, true),
('ex-idempotent-batch', 'process-idempotent-batch', 'kn-fullstack', 'Processamento idempotente de lote', 'Deduplicate comandos e preserve um resultado auditável por item recebido.', 'Implemente processBatch(commands, processedIds). Cada comando possui id e amount. IDs já processados ou repetidos no lote não alteram o saldo. Amount deve ser inteiro diferente de zero. Retorne {balanceDelta, accepted, rejected}; rejected contém {id, reason} usando duplicate ou invalid. Preserve a ordem original em accepted e rejected.', 'Combinar validação, idempotência, deduplicação e resultado determinístico.', 'TS', 5, 280, 55, 'function processBatch(commands, processedIds) {\n  // Retorne { balanceDelta, accepted, rejected }\n}', 'processBatch', ARRAY['Não altere as entradas.', 'Uma ocorrência inválida não reserva o id.', 'A primeira ocorrência válida reserva o id para o restante do lote.'], ARRAY['Inicialize um Set com processedIds.', 'Valide antes de adicionar o id ao Set.'], 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set', '[{"input":[[{"id":"a","amount":5},{"id":"a","amount":5},{"id":"b","amount":0}],[]],"output":{"balanceDelta":5,"accepted":["a"],"rejected":[{"id":"a","reason":"duplicate"},{"id":"b","reason":"invalid"}]}}]'::jsonb, true)
ON CONFLICT ("slug") DO UPDATE SET
"knowledge_node_id" = EXCLUDED."knowledge_node_id", "title" = EXCLUDED."title", "summary" = EXCLUDED."summary", "problem" = EXCLUDED."problem", "objective" = EXCLUDED."objective", "language" = EXCLUDED."language", "difficulty" = EXCLUDED."difficulty", "base_xp" = EXCLUDED."base_xp", "estimated_minutes" = EXCLUDED."estimated_minutes", "starter_code" = EXCLUDED."starter_code", "function_name" = EXCLUDED."function_name", "constraints" = EXCLUDED."constraints", "hints" = EXCLUDED."hints", "documentation_url" = EXCLUDED."documentation_url", "examples" = EXCLUDED."examples", "is_published" = EXCLUDED."is_published", "updated_at" = CURRENT_TIMESTAMP;

INSERT INTO "exercise_test_cases" ("id", "exercise_id", "label", "input", "invocation_code", "expected_output", "is_hidden", "position") VALUES
('tc-normalize-1', 'ex-normalize-identifier', 'Acentos e separadores mistos', '[["unused"]]'::jsonb, 'normalizeIdentifier("  relatório-de VENDAS_2026  ")', '"relatorioDeVendas2026"'::jsonb, false, 1),
('tc-normalize-2', 'ex-normalize-identifier', 'Identificador iniciado por número', '[["unused"]]'::jsonb, 'normalizeIdentifier("42 respostas prontas")', '"_42RespostasProntas"'::jsonb, false, 2),
('tc-normalize-3', 'ex-normalize-identifier', 'Somente separadores', '[["unused"]]'::jsonb, 'normalizeIdentifier("___---   ")', '""'::jsonb, true, 3),
('tc-normalize-4', 'ex-normalize-identifier', 'Separadores consecutivos e diacríticos', '[["unused"]]'::jsonb, 'normalizeIdentifier("  ação___HTTP--2 ")', '"acaoHttp2"'::jsonb, true, 4),
('tc-limiter-1', 'ex-rate-limiter', 'Limite isolado por chave', NULL, '(() => { const allow = createRateLimiter(2); return [allow("api"), allow("api"), allow("jobs"), allow("api")]; })()', '[true,true,true,false]'::jsonb, false, 1),
('tc-limiter-2', 'ex-rate-limiter', 'Instâncias independentes', NULL, '(() => { const a = createRateLimiter(1); const b = createRateLimiter(1); return [a("x"), a("x"), b("x")]; })()', '[true,false,true]'::jsonb, false, 2),
('tc-limiter-3', 'ex-rate-limiter', 'Limite zero', NULL, '(() => { const allow = createRateLimiter(0); return [allow("a"), allow("b")]; })()', '[false,false]'::jsonb, true, 3),
('tc-limiter-4', 'ex-rate-limiter', 'Chaves numéricas e string não colidem', NULL, '(() => { const allow = createRateLimiter(1); return [allow(1), allow("1"), allow(1), allow("1")]; })()', '[true,true,false,false]'::jsonb, true, 4),
('tc-intervals-1', 'ex-merge-intervals', 'Sobreposição fora de ordem', '[[[5,7],[1,3],[2,4],[10,10]]]'::jsonb, NULL, '[[1,7],[10,10]]'::jsonb, false, 1),
('tc-intervals-2', 'ex-merge-intervals', 'Adjacência e duplicata', '[[[1,2],[3,4],[3,4],[8,9]]]'::jsonb, NULL, '[[1,4],[8,9]]'::jsonb, false, 2),
('tc-intervals-3', 'ex-merge-intervals', 'Entrada vazia', '[[]]'::jsonb, NULL, '[]'::jsonb, true, 3),
('tc-intervals-4', 'ex-merge-intervals', 'Imutabilidade da entrada', NULL, '(() => { const input = [[5,6],[1,2]]; const before = JSON.stringify(input); const result = mergeIntervals(input); return {result, unchanged: before === JSON.stringify(input)}; })()', '{"result":[[1,2],[5,6]],"unchanged":true}'::jsonb, true, 4),
('tc-concurrency-1', 'ex-map-concurrency', 'Preserva ordem com conclusões fora de ordem', NULL, 'await mapWithConcurrency([30,5,15], 2, async value => { await new Promise(resolve => setTimeout(resolve, value)); return value * 2; })', '[60,10,30]'::jsonb, false, 1),
('tc-concurrency-2', 'ex-map-concurrency', 'Respeita concorrência máxima', NULL, 'await (async () => { let active = 0; let peak = 0; const values = await mapWithConcurrency([1,2,3,4,5], 2, async value => { active += 1; peak = Math.max(peak, active); await new Promise(resolve => setTimeout(resolve, 4)); active -= 1; return value; }); return {values, peak}; })()', '{"values":[1,2,3,4,5],"peak":2}'::jsonb, false, 2),
('tc-concurrency-3', 'ex-map-concurrency', 'Rejeita limite inválido', NULL, 'await (async () => { try { await mapWithConcurrency([1], 0, async x => x); return "no-error"; } catch (error) { return error instanceof TypeError; } })()', 'true'::jsonb, true, 3),
('tc-concurrency-4', 'ex-map-concurrency', 'Não agenda novas tarefas após falha', NULL, 'await (async () => { const started = []; try { await mapWithConcurrency([1,2,3,4], 1, async value => { started.push(value); if (value === 2) throw new Error("stop"); return value; }); } catch {} return started; })()', '[1,2]'::jsonb, true, 4),
('tc-retry-1', 'ex-retry-after', 'Segundos inteiros', '["120",0]'::jsonb, NULL, '120000'::jsonb, false, 1),
('tc-retry-2', 'ex-retry-after', 'Data HTTP relativa', '["Wed, 21 Oct 2015 07:28:00 GMT",1445412420000]'::jsonb, NULL, '60000'::jsonb, false, 2),
('tc-retry-3', 'ex-retry-after', 'Valor inválido ou negativo', NULL, '([parseRetryAfter("-2", 0), parseRetryAfter("later", 0), parseRetryAfter(null, 0)])', '[null,null,null]'::jsonb, true, 3),
('tc-retry-4', 'ex-retry-after', 'Limite de cinco minutos', '["999",0]'::jsonb, NULL, '300000'::jsonb, true, 4),
('tc-events-1', 'ex-index-events', 'Ordena dentro do agrupamento', '[[{"kind":"updated","entityId":"a","occurredAt":"2026-01-02"},{"kind":"updated","entityId":"a","occurredAt":"2026-01-01"}]]'::jsonb, NULL, '{"updated":{"a":[{"kind":"updated","entityId":"a","occurredAt":"2026-01-01"},{"kind":"updated","entityId":"a","occurredAt":"2026-01-02"}]}}'::jsonb, false, 1),
('tc-events-2', 'ex-index-events', 'Separa tipo e entidade', '[[{"kind":"created","entityId":"a","occurredAt":"2026-01-01"},{"kind":"updated","entityId":"b","occurredAt":"2026-01-01"}]]'::jsonb, NULL, '{"created":{"a":[{"kind":"created","entityId":"a","occurredAt":"2026-01-01"}]},"updated":{"b":[{"kind":"updated","entityId":"b","occurredAt":"2026-01-01"}]}}'::jsonb, false, 2),
('tc-events-3', 'ex-index-events', 'Entrada vazia', '[[]]'::jsonb, NULL, '{}'::jsonb, true, 3),
('tc-events-4', 'ex-index-events', 'Não muta a coleção', NULL, '(() => { const events = [{kind:"x",entityId:"1",occurredAt:"2026-02-02"},{kind:"x",entityId:"1",occurredAt:"2026-01-01"}]; const before = JSON.stringify(events); indexEvents(events); return before === JSON.stringify(events); })()', 'true'::jsonb, true, 4),
('tc-optimistic-1', 'ex-optimistic-reducer', 'Aplica atualização pendente', '[{"confirmedValue":10,"pending":[],"value":10},{"type":"APPLY","id":"a","delta":3}]'::jsonb, NULL, '{"confirmedValue":10,"pending":[{"id":"a","delta":3}],"value":13}'::jsonb, false, 1),
('tc-optimistic-2', 'ex-optimistic-reducer', 'Confirma fora de ordem', '[{"confirmedValue":10,"pending":[{"id":"a","delta":3},{"id":"b","delta":-2}],"value":11},{"type":"CONFIRM","id":"b"}]'::jsonb, NULL, '{"confirmedValue":8,"pending":[{"id":"a","delta":3}],"value":11}'::jsonb, false, 2),
('tc-optimistic-3', 'ex-optimistic-reducer', 'Aplicação idempotente', NULL, '(() => { const state = {confirmedValue:1,pending:[{id:"x",delta:2}],value:3}; return optimisticReducer(state,{type:"APPLY",id:"x",delta:9}); })()', '{"confirmedValue":1,"pending":[{"id":"x","delta":2}],"value":3}'::jsonb, true, 3),
('tc-optimistic-4', 'ex-optimistic-reducer', 'Rollback desconhecido e imutabilidade', NULL, '(() => { const state = {confirmedValue:4,pending:[{id:"x",delta:2}],value:6}; const before = JSON.stringify(state); const result = optimisticReducer(state,{type:"REJECT",id:"missing"}); return {result,unchanged:before===JSON.stringify(state)}; })()', '{"result":{"confirmedValue":4,"pending":[{"id":"x","delta":2}],"value":6},"unchanged":true}'::jsonb, true, 4),
('tc-graph-1', 'ex-topological-sort', 'Caminho simples', '[["build","test","deploy"],[["build","test"],["test","deploy"]]]'::jsonb, NULL, '{"order":["build","test","deploy"],"hasCycle":false}'::jsonb, false, 1),
('tc-graph-2', 'ex-topological-sort', 'Desempate pela ordem original', '[["lint","build","test","deploy"],[["build","deploy"],["test","deploy"]]]'::jsonb, NULL, '{"order":["lint","build","test","deploy"],"hasCycle":false}'::jsonb, false, 2),
('tc-graph-3', 'ex-topological-sort', 'Ciclo parcial', '[["a","b","c","free"],[["a","b"],["b","a"],["b","c"]]]'::jsonb, NULL, '{"order":["free"],"hasCycle":true}'::jsonb, true, 3),
('tc-graph-4', 'ex-topological-sort', 'Ignora duplicatas e nós externos', '[["a","b"],[["a","b"],["a","b"],["outside","a"]]]'::jsonb, NULL, '{"order":["a","b"],"hasCycle":false}'::jsonb, true, 4),
('tc-query-1', 'ex-parameterized-query', 'Filtros e ordem ascendente', '[{"active":true,"role":"ADMIN","sort":"oldest"}]'::jsonb, NULL, '{"text":"SELECT id, username FROM \"User\" WHERE active = $1 AND role = $2 ORDER BY created_at ASC","values":[true,"ADMIN"]}'::jsonb, false, 1),
('tc-query-2', 'ex-parameterized-query', 'Sem filtros', '[{}]'::jsonb, NULL, '{"text":"SELECT id, username FROM \"User\" ORDER BY created_at DESC","values":[]}'::jsonb, false, 2),
('tc-query-3', 'ex-parameterized-query', 'Ordem determinística e tentativa de injeção', '[{"active":false,"role":"ADMIN'' OR 1=1 --","createdAfter":"2026-01-01","sort":"drop table"}]'::jsonb, NULL, '{"text":"SELECT id, username FROM \"User\" WHERE active = $1 AND role = $2 AND created_at >= $3 ORDER BY created_at DESC","values":[false,"ADMIN'' OR 1=1 --","2026-01-01"]}'::jsonb, true, 3),
('tc-query-4', 'ex-parameterized-query', 'Filtro único usa primeiro placeholder', '[{"createdAfter":"2025-12-31"}]'::jsonb, NULL, '{"text":"SELECT id, username FROM \"User\" WHERE created_at >= $1 ORDER BY created_at DESC","values":["2025-12-31"]}'::jsonb, true, 4),
('tc-batch-1', 'ex-idempotent-batch', 'Duplicata e valor inválido', '[[{"id":"a","amount":5},{"id":"a","amount":5},{"id":"b","amount":0}],[]]'::jsonb, NULL, '{"balanceDelta":5,"accepted":["a"],"rejected":[{"id":"a","reason":"duplicate"},{"id":"b","reason":"invalid"}]}'::jsonb, false, 1),
('tc-batch-2', 'ex-idempotent-batch', 'IDs processados anteriormente', '[[{"id":"old","amount":7},{"id":"new","amount":-3}],["old"]]'::jsonb, NULL, '{"balanceDelta":-3,"accepted":["new"],"rejected":[{"id":"old","reason":"duplicate"}]}'::jsonb, false, 2),
('tc-batch-3', 'ex-idempotent-batch', 'Inválido não reserva ID', '[[{"id":"x","amount":1.5},{"id":"x","amount":2}],[]]'::jsonb, NULL, '{"balanceDelta":2,"accepted":["x"],"rejected":[{"id":"x","reason":"invalid"}]}'::jsonb, true, 3),
('tc-batch-4', 'ex-idempotent-batch', 'Imutabilidade e IDs vazios', NULL, '(() => { const commands=[{id:"",amount:2},{id:"ok",amount:4}]; const processed=["z"]; const before=JSON.stringify([commands,processed]); const result=processBatch(commands,processed); return {result,unchanged:before===JSON.stringify([commands,processed])}; })()', '{"result":{"balanceDelta":4,"accepted":["ok"],"rejected":[{"id":"","reason":"invalid"}]},"unchanged":true}'::jsonb, true, 4)
ON CONFLICT ("exercise_id", "position") DO UPDATE SET
"label" = EXCLUDED."label", "input" = EXCLUDED."input", "invocation_code" = EXCLUDED."invocation_code", "expected_output" = EXCLUDED."expected_output", "is_hidden" = EXCLUDED."is_hidden";

-- New public-schema tables are protected even though the application reads them through Prisma.
ALTER TABLE "knowledge_nodes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "knowledge_edges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learning_paths" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learning_path_nodes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exercises" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exercise_test_cases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_node_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exercise_runs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "exercise_submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learning_events" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE POLICY "knowledge_nodes_authenticated_read" ON "knowledge_nodes" FOR SELECT TO authenticated USING ("is_published" = true);
        CREATE POLICY "knowledge_edges_authenticated_read" ON "knowledge_edges" FOR SELECT TO authenticated USING (true);
        CREATE POLICY "learning_paths_authenticated_read" ON "learning_paths" FOR SELECT TO authenticated USING ("is_published" = true);
        CREATE POLICY "learning_path_nodes_authenticated_read" ON "learning_path_nodes" FOR SELECT TO authenticated USING (true);
        CREATE POLICY "exercises_authenticated_read" ON "exercises" FOR SELECT TO authenticated USING ("is_published" = true);
        CREATE POLICY "exercise_test_cases_public_read" ON "exercise_test_cases" FOR SELECT TO authenticated USING ("is_hidden" = false);
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') AND to_regprocedure('auth.uid()') IS NOT NULL THEN
        CREATE POLICY "user_node_progress_owner_read" ON "user_node_progress" FOR SELECT TO authenticated USING ((SELECT auth.uid())::text = "user_id");
        CREATE POLICY "user_node_progress_owner_insert" ON "user_node_progress" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid())::text = "user_id");
        CREATE POLICY "user_node_progress_owner_update" ON "user_node_progress" FOR UPDATE TO authenticated USING ((SELECT auth.uid())::text = "user_id") WITH CHECK ((SELECT auth.uid())::text = "user_id");
        CREATE POLICY "exercise_runs_owner_read" ON "exercise_runs" FOR SELECT TO authenticated USING ((SELECT auth.uid())::text = "user_id");
        CREATE POLICY "exercise_runs_owner_insert" ON "exercise_runs" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid())::text = "user_id");
        CREATE POLICY "exercise_submissions_owner_read" ON "exercise_submissions" FOR SELECT TO authenticated USING ((SELECT auth.uid())::text = "user_id");
        CREATE POLICY "exercise_submissions_owner_insert" ON "exercise_submissions" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid())::text = "user_id");
        CREATE POLICY "learning_events_owner_read" ON "learning_events" FOR SELECT TO authenticated USING ((SELECT auth.uid())::text = "user_id");
        CREATE POLICY "learning_events_owner_insert" ON "learning_events" FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid())::text = "user_id");
    END IF;
END $$;
