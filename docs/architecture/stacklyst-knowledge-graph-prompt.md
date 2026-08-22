# Stacklyst learning architecture implementation prompt

## Product intent

Restructure Stacklyst learning around the statement:

> Explore knowledge. Write code. Prove how you solve.

The learning experience must use a knowledge graph instead of a mandatory linear lesson chain. Trails remain in the product, but they become recommended paths through shared knowledge. Completing a knowledge node in one path must count in every path containing that node.

## Protected surfaces

- Preserve the current Stacklyst visual identity and design tokens.
- Do not redesign the application sidebar, move its items, or change its interaction model.
- Keep the existing `/trails` entry so current navigation remains valid.
- Do not add emoji to the new interface. Use the existing vector icon system.
- Preserve working non-learning features and legacy lesson URLs while the new domain is introduced.

## Delivery scope

### Foundation

Create explicit domain entities for:

- knowledge nodes and typed directed edges;
- learning paths and ordered path membership;
- exercises and public/hidden test cases;
- user progress per knowledge node;
- code runs and evaluated submissions as different records;
- learning behavior events for assistance usage and future badges.

The database is the source of truth. Add constraints, foreign-key indexes, ownership-aware row-level security for user records, and an idempotent curated catalog. Do not silently fabricate production data at request time.

### Knowledge map

Rebuild `/trails` as an interactive knowledge map:

- show connected nodes with status, difficulty, mastery, exercise count, and category;
- show trails as selectable recommended paths, not gates;
- calculate path progress from completed shared nodes;
- explain required and recommended prerequisites in the node detail panel;
- allow the learner to start an available node even when recommendations are incomplete;
- use explicit loading, empty, and error states;
- prioritize the desktop graph while retaining a usable mobile list/detail experience.

### Exercise engine

Use `/lesson/:exerciseId` as a full-page programming workspace with:

- problem, objective, examples, and constraints;
- the existing CodeMirror editor abstraction;
- console and per-test results;
- explicit `Run` and `Submit` actions;
- Guided, Standard, Hard, and No Assist modes;
- no XP advantage for No Assist over Hard;
- server-side evaluation in an external sandbox, never `eval` or `new Function` on the server;
- hidden tests that are never returned to the client;
- meaningful exercises with edge cases and difficulty beyond recall quizzes.

`Run` may be used freely and evaluates public tests. `Submit` is the only action counted as a submission and evaluates public plus hidden tests.

### Progression

On the first successful submission:

- award XP once according to assistance mode;
- update mastery for the exercise's knowledge node;
- update the node status to `COMPLETED` or `MASTERED` when appropriate;
- reflect the same progress in every learning path that contains that node.

The schema and events must allow future behavior badges, duels, Arena challenges, ELO, and reputation without coupling those future systems to the first delivery.

## Architecture boundaries

- Keep domain calculations in focused TypeScript modules, not JSX.
- Keep database access in server-only repositories/services.
- Validate every write payload with Zod.
- Keep code execution behind a reusable server service so learning, duels, Arena, and daily challenges can share it later.
- Use Prisma migrations because the current deployment runs `prisma migrate deploy`.
- Enable RLS on new public-schema tables; catalog reads and user-owned writes must follow their actual access model.
- Reuse the existing authenticated user and API error/rate-limit infrastructure.

## Initial curated graph

Ship a coherent JavaScript/TypeScript-centered graph that proves cross-path reuse:

- programming foundations;
- functions and scope;
- collections and complexity;
- asynchronous control flow;
- HTTP and resilient APIs;
- TypeScript domain modeling;
- React state architecture;
- graph algorithms;
- frontend and backend integration projects.

Include at least one practical exercise for the core executable nodes. Exercises must test edge cases with hidden cases and must not be answerable by selecting a card.

## Acceptance criteria

- `/trails` no longer depends on linear `nextLesson` or quiz-card progression.
- A learner can inspect any node and can start it when recommendations remain incomplete.
- Required prerequisites are rare and enforced only where technically necessary.
- Path percentages come from `user_node_progress` equivalents, not trail-local attempts.
- Run and Submit produce separate persisted records and visible counts.
- Hidden test inputs and expected outputs never reach the browser.
- XP cannot be earned twice by resubmitting the same completed exercise.
- No Assist awards no more XP than Hard.
- New UI contains no emoji and uses accessible labels/focus states.
- Sidebar markup, item order, positioning, and styling remain unchanged.
- Prisma validation, generation, typecheck, lint, tests, build, migration verification, and a focused browser smoke test pass before delivery.
- Changes are delivered from a feature branch through a pull request with small Conventional Commits written in English.

## Deferred work

Do not add non-functional Duel or Arena placeholders in this delivery. Their scoring, realtime lifecycle, voting, ELO, and reputation systems belong to later phases after the shared exercise engine and learning graph are stable.
