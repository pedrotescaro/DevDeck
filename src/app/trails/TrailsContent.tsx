'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Code2,
  Gauge,
  GitBranch,
  LockKeyhole,
  MapPinned,
  Route,
  Sparkles,
  Target,
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { TrailMap } from '@/app/trails/TrailMap';
import { cn } from '@/lib/cn';
import type {
  KnowledgeMapData,
  KnowledgeMapNode,
  KnowledgeProgressStatus,
  KnowledgeRelation,
  LearningPathSummary,
} from '@/lib/learning/types';

interface TrailsContentProps {
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
    total_xp: number;
    streak: number;
  };
  knowledgeMap: KnowledgeMapData;
}

const STATUS_LABEL: Record<KnowledgeProgressStatus, string> = {
  NOT_STARTED: 'Requisito pendente',
  AVAILABLE: 'Disponível',
  RECOMMENDED: 'Recomendado agora',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
  MASTERED: 'Dominado',
};

const RELATION_LABEL: Record<KnowledgeRelation, string> = {
  REQUIRED: 'Obrigatório',
  RECOMMENDED: 'Recomendado',
  RELATED: 'Relacionado',
  BUILDS_ON: 'Aprofunda',
  COMBINES: 'Combina',
};

function PathCard({
  path,
  active,
  onSelect,
}: {
  path: LearningPathSummary;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        'dd-focus-ring min-w-[250px] flex-1 rounded-2xl border p-4 text-left transition',
        active
          ? 'border-blue-500 bg-blue-500/[0.06] shadow-sm'
          : 'border-dd-border bg-dd-card hover:border-blue-400/60'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${path.accentColor}18`, color: path.accentColor }}
        >
          <Route className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <span className="text-xs font-black text-dd-muted">{path.progressPercent}%</span>
      </div>
      <h3 className="mt-3 text-sm font-black text-dd-text">{path.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-dd-muted">{path.description}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-dd-border">
        <div
          className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${path.progressPercent}%`, backgroundColor: path.accentColor }}
        />
      </div>
      <p className="mt-2 text-[11px] font-semibold text-dd-muted">
        {path.completedNodes} de {path.totalNodes} conhecimentos
      </p>
    </button>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-dd-border bg-dd-card p-3">
      <div className="flex items-center gap-2 text-dd-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="text-[10px] font-black uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-2 text-xl font-black text-dd-text">{value}</p>
    </div>
  );
}

function NodeDetail({
  node,
  onSelectNode,
}: {
  node: KnowledgeMapNode;
  onSelectNode: (nodeId: string) => void;
}) {
  const missingRequired = node.prerequisites.filter(
    (prerequisite) => prerequisite.relation === 'REQUIRED' && !prerequisite.completed
  );
  const missingRecommended = node.prerequisites.filter(
    (prerequisite) => prerequisite.relation !== 'REQUIRED' && !prerequisite.completed
  );
  const firstExercise = node.exercises[0];

  return (
    <aside
      aria-labelledby="selected-knowledge-title"
      className="rounded-3xl border border-dd-border bg-dd-card p-5 shadow-sm xl:sticky xl:top-4"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-blue-500">
          {node.category}
        </span>
        <span className="text-xs font-bold text-dd-muted">{STATUS_LABEL[node.status]}</span>
      </div>

      <h2 id="selected-knowledge-title" className="mt-4 text-xl font-black text-dd-text">
        {node.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-dd-muted">{node.description}</p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-dd-surface p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-dd-muted">
            Domínio
          </p>
          <p className="mt-1 text-lg font-black text-dd-text">{node.mastery}%</p>
        </div>
        <div className="rounded-xl bg-dd-surface p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-dd-muted">
            Dificuldade
          </p>
          <p className="mt-1 text-lg font-black text-dd-text">{node.difficulty}/5</p>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-xs font-black uppercase tracking-[0.12em] text-dd-muted">
          Conexões anteriores
        </h3>
        {node.prerequisites.length === 0 ? (
          <p className="mt-2 text-sm text-dd-muted">Este conhecimento inicia o mapa.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {node.prerequisites.map((prerequisite) => (
              <li key={`${prerequisite.nodeId}-${prerequisite.relation}`}>
                <button
                  type="button"
                  onClick={() => onSelectNode(prerequisite.nodeId)}
                  className="dd-focus-ring flex w-full items-center gap-2 rounded-xl bg-dd-surface px-3 py-2 text-left transition hover:bg-blue-500/10"
                >
                  {prerequisite.completed ? (
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  ) : prerequisite.relation === 'REQUIRED' ? (
                    <LockKeyhole className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                  ) : (
                    <GitBranch className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-xs font-bold text-dd-text">
                    {prerequisite.title}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wide text-dd-muted">
                    {RELATION_LABEL[prerequisite.relation]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {missingRequired.length > 0 && (
        <div className="mt-5 rounded-2xl border border-slate-400/30 bg-slate-500/[0.06] p-4">
          <div className="flex gap-2">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
            <div>
              <p className="text-xs font-black text-dd-text">Conhecimento necessário</p>
              <p className="mt-1 text-xs leading-relaxed text-dd-muted">
                Este é um dos poucos vínculos obrigatórios porque o exercício usa esse contrato
                diretamente.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectNode(missingRequired[0].nodeId)}
            className="dd-focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-dd-text px-3 py-2.5 text-xs font-black text-dd-bg"
          >
            Estudar requisito
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {missingRequired.length === 0 && missingRecommended.length > 0 && (
        <div className="mt-5 rounded-2xl border border-blue-500/25 bg-blue-500/[0.06] p-4">
          <div className="flex gap-2">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
            <div>
              <p className="text-xs font-black text-dd-text">Recomendação, não bloqueio</p>
              <p className="mt-1 text-xs leading-relaxed text-dd-muted">
                {missingRecommended.map((item) => item.title).join(', ')} pode facilitar este
                conhecimento, mas você decide o caminho.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectNode(missingRecommended[0].nodeId)}
            className="dd-focus-ring mt-3 w-full rounded-xl border border-blue-500/30 px-3 py-2.5 text-xs font-black text-blue-500 transition hover:bg-blue-500/10"
          >
            Estudar conhecimento recomendado
          </button>
        </div>
      )}

      <div className="mt-5 border-t border-dd-border pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-black uppercase tracking-[0.12em] text-dd-muted">
            Exercícios práticos
          </h3>
          <span className="text-xs font-bold text-dd-muted">{node.exercises.length}</span>
        </div>

        {node.exercises.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-dd-border p-4 text-sm text-dd-muted">
            Este conhecimento ainda não foi publicado porque não possui exercício avaliável.
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {node.exercises.map((exercise, index) => (
              <li key={exercise.id}>
                <Link
                  href={missingRequired.length > 0 ? '#' : `/lesson/${exercise.slug}`}
                  aria-disabled={missingRequired.length > 0}
                  onClick={(event) => {
                    if (missingRequired.length > 0) event.preventDefault();
                  }}
                  className={cn(
                    'dd-focus-ring flex items-center gap-3 rounded-2xl border border-dd-border p-3 transition',
                    missingRequired.length > 0
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:border-blue-500/50 hover:bg-blue-500/[0.04]'
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Code2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-black text-dd-text">
                      {exercise.title}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-semibold text-dd-muted">
                      Dificuldade {exercise.difficulty}/5 · {exercise.baseXp} XP base
                    </span>
                  </span>
                  {index === 0 && missingRequired.length === 0 && (
                    <ChevronRight className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {firstExercise && missingRequired.length === 0 && (
          <Link
            href={`/lesson/${firstExercise.slug}`}
            className="dd-focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-black text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-600"
          >
            {missingRecommended.length > 0 ? 'Começar mesmo assim' : 'Começar exercício'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </aside>
  );
}

export function TrailsContent({ user, knowledgeMap }: TrailsContentProps) {
  const initialPath = knowledgeMap.paths.find((path) => path.featured) ?? knowledgeMap.paths[0];
  const [selectedPathId, setSelectedPathId] = useState(initialPath?.id ?? '');
  const initialNodeId =
    initialPath?.nextRecommendedNodeId ??
    initialPath?.nodeIds[0] ??
    knowledgeMap.nodes[0]?.id ??
    '';
  const [selectedNodeId, setSelectedNodeId] = useState(initialNodeId);

  const selectedPath = knowledgeMap.paths.find((path) => path.id === selectedPathId) ?? initialPath;
  const selectedNode =
    knowledgeMap.nodes.find((node) => node.id === selectedNodeId) ?? knowledgeMap.nodes[0];

  const visibleNodes = useMemo(() => {
    if (!selectedPath) return knowledgeMap.nodes;
    const activeIds = new Set(selectedPath.nodeIds);
    return [...knowledgeMap.nodes].sort((a, b) => {
      const aActive = activeIds.has(a.id) ? 0 : 1;
      const bActive = activeIds.has(b.id) ? 0 : 1;
      return aActive - bActive;
    });
  }, [knowledgeMap.nodes, selectedPath]);

  const selectPath = (path: LearningPathSummary) => {
    setSelectedPathId(path.id);
    setSelectedNodeId(path.nextRecommendedNodeId ?? path.nodeIds[0] ?? selectedNodeId);
  };

  return (
    <div className="dd-platform-shell dd-platform-shell--fullscreen">
      <Sidebar user={user} />

      <div className="mx-auto flex w-full min-w-0 flex-grow items-start justify-center xl:max-w-[1540px] xl:justify-start">
        <main className="min-w-0 w-full flex-grow bg-dd-bg pb-24 md:pb-10">
          <div className="mx-auto max-w-[1120px] space-y-7 p-4 sm:p-6">
            <header className="overflow-hidden rounded-3xl border border-dd-border bg-dd-card p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-500">
                    <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
                    Aprendizado por conhecimento
                  </span>
                  <h1 className="mt-4 text-2xl font-black tracking-tight text-dd-text sm:text-3xl">
                    Explore o mapa. Escolha um caminho. Escreva código.
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-dd-muted">
                    As trilhas agora recomendam uma rota dentro do mesmo mapa. O conhecimento que
                    você domina vale em todos os caminhos que o reutilizam.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 lg:min-w-[360px]">
                  <MetricCard
                    icon={Target}
                    label="Concluídos"
                    value={`${knowledgeMap.totals.completedNodes}/${knowledgeMap.totals.totalNodes}`}
                  />
                  <MetricCard
                    icon={Sparkles}
                    label="Dominados"
                    value={String(knowledgeMap.totals.masteredNodes)}
                  />
                  <MetricCard
                    icon={Gauge}
                    label="Mastery"
                    value={`${knowledgeMap.totals.overallMastery}%`}
                  />
                </div>
              </div>
            </header>

            {knowledgeMap.paths.length > 0 && (
              <section aria-labelledby="learning-paths-title">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-500">
                      Trilhas
                    </p>
                    <h2 id="learning-paths-title" className="mt-1 text-lg font-black text-dd-text">
                      Caminhos recomendados
                    </h2>
                  </div>
                  {selectedPath?.estimatedMinutes && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-dd-muted">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      {Math.round(selectedPath.estimatedMinutes / 60)} h estimadas
                    </span>
                  )}
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {knowledgeMap.paths.map((path) => (
                    <PathCard
                      key={path.id}
                      path={path}
                      active={selectedPath?.id === path.id}
                      onSelect={() => selectPath(path)}
                    />
                  ))}
                </div>
              </section>
            )}

            {knowledgeMap.nodes.length === 0 ? (
              <section className="rounded-3xl border border-dashed border-dd-border bg-dd-card p-10 text-center">
                <MapPinned className="mx-auto h-8 w-8 text-dd-muted" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-black text-dd-text">Catálogo não publicado</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-dd-muted">
                  O mapa está sem conhecimentos publicados. Execute a migração do catálogo antes de
                  disponibilizar esta área.
                </p>
              </section>
            ) : (
              <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <TrailMap
                  nodes={visibleNodes}
                  edges={knowledgeMap.edges}
                  selectedNodeId={selectedNode?.id ?? ''}
                  activePathNodeIds={selectedPath?.nodeIds ?? []}
                  onSelectNode={setSelectedNodeId}
                />
                {selectedNode && (
                  <NodeDetail node={selectedNode} onSelectNode={setSelectedNodeId} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
