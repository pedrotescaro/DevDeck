'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Braces,
  Check,
  Circle,
  Code2,
  Database,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type {
  KnowledgeMapEdge,
  KnowledgeMapNode,
  KnowledgeNodeType,
  KnowledgeProgressStatus,
  KnowledgeRelation,
} from '@/lib/learning/types';

interface TrailMapProps {
  nodes: KnowledgeMapNode[];
  edges: KnowledgeMapEdge[];
  selectedNodeId: string;
  activePathNodeIds: string[];
  onSelectNode: (nodeId: string) => void;
}

const NODE_WIDTH = 176;
const NODE_HEIGHT = 104;
const GRAPH_PADDING = 72;

const TYPE_ICON: Record<KnowledgeNodeType, LucideIcon> = {
  FOUNDATION: Layers3,
  LANGUAGE: Braces,
  CONCEPT: Code2,
  FRAMEWORK: Network,
  LIBRARY: Layers3,
  TOOL: Wrench,
  DATABASE: Database,
  ARCHITECTURE: GitBranch,
  PROJECT: Route,
  CHALLENGE: ShieldCheck,
};

const STATUS_LABEL: Record<KnowledgeProgressStatus, string> = {
  NOT_STARTED: 'Requisito pendente',
  AVAILABLE: 'Disponível',
  RECOMMENDED: 'Recomendado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
  MASTERED: 'Dominado',
};

const RELATION_STYLE: Record<KnowledgeRelation, { stroke: string; dash?: string }> = {
  REQUIRED: { stroke: '#64748b' },
  RECOMMENDED: { stroke: '#60a5fa', dash: '7 7' },
  RELATED: { stroke: '#94a3b8', dash: '3 8' },
  BUILDS_ON: { stroke: '#8b5cf6' },
  COMBINES: { stroke: '#14b8a6' },
};

function StatusIcon({ status }: { status: KnowledgeProgressStatus }) {
  if (status === 'MASTERED') return <Sparkles className="h-4 w-4" aria-hidden="true" />;
  if (status === 'COMPLETED') return <Check className="h-4 w-4" aria-hidden="true" />;
  if (status === 'NOT_STARTED') {
    return <LockKeyhole className="h-4 w-4" aria-hidden="true" />;
  }
  return <Circle className="h-3.5 w-3.5 fill-current" aria-hidden="true" />;
}

function getNodeClasses(status: KnowledgeProgressStatus, selected: boolean) {
  return cn(
    'dd-focus-ring group absolute flex flex-col rounded-2xl border bg-dd-card p-3 text-left shadow-sm transition duration-200',
    'hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0',
    status === 'NOT_STARTED' && 'border-dd-border text-dd-muted opacity-80',
    status === 'AVAILABLE' && 'border-dd-border hover:border-blue-400/70',
    status === 'RECOMMENDED' &&
      'border-blue-500/70 bg-blue-500/[0.06] shadow-[0_0_0_1px_rgba(59,130,246,0.08)]',
    status === 'IN_PROGRESS' && 'border-amber-500/70 bg-amber-500/[0.06]',
    status === 'COMPLETED' && 'border-emerald-500/60 bg-emerald-500/[0.05]',
    status === 'MASTERED' && 'border-violet-500/70 bg-violet-500/[0.07]',
    selected && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-dd-bg'
  );
}

function KnowledgeNodeCard({
  node,
  selected,
  onSelect,
  className,
  style,
}: {
  node: KnowledgeMapNode;
  selected: boolean;
  onSelect: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = TYPE_ICON[node.type];

  return (
    <button
      type="button"
      data-testid={`knowledge-node-${node.slug}`}
      aria-label={`${node.title}. ${STATUS_LABEL[node.status]}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(getNodeClasses(node.status, selected), className)}
      style={style}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-dd-muted">
          <StatusIcon status={node.status} />
          {STATUS_LABEL[node.status]}
        </span>
      </div>

      <span className="mt-2 line-clamp-2 text-sm font-black leading-tight text-dd-text">
        {node.title}
      </span>
      <span className="mt-auto flex items-center justify-between pt-2 text-[10px] font-semibold text-dd-muted">
        <span>{node.category}</span>
        <span aria-label={`Dificuldade ${node.difficulty} de 5`}>{node.difficulty}/5</span>
      </span>
    </button>
  );
}

export function TrailMap({
  nodes,
  edges,
  selectedNodeId,
  activePathNodeIds,
  onSelectNode,
}: TrailMapProps) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const pathNodeIds = new Set(activePathNodeIds);
  const width = Math.max(960, ...nodes.map((node) => node.position.x + NODE_WIDTH + GRAPH_PADDING));
  const height = Math.max(
    700,
    ...nodes.map((node) => node.position.y + NODE_HEIGHT + GRAPH_PADDING)
  );

  return (
    <section aria-labelledby="knowledge-map-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-500">
            Exploração livre
          </p>
          <h2 id="knowledge-map-title" className="mt-1 text-xl font-black text-dd-text">
            Mapa de Conhecimento
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-dd-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-6 bg-slate-500" /> Obrigatório
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-6 border-t-2 border-dashed border-blue-400" /> Recomendado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-6 bg-violet-500" /> Aprofunda
          </span>
        </div>
      </div>

      <div className="space-y-3 md:hidden" data-testid="knowledge-map-mobile-list">
        {nodes.map((node) => (
          <KnowledgeNodeCard
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onSelect={() => onSelectNode(node.id)}
            className="relative min-h-[112px] w-full"
          />
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-3xl border border-dd-border bg-dd-surface/50 md:block">
        <div
          className="relative bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.07),transparent_58%)]"
          style={{ width, height }}
          data-testid="knowledge-map-graph"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Conexões entre conhecimentos"
          >
            <defs>
              <marker
                id="knowledge-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
              </marker>
            </defs>
            {edges.map((edge) => {
              const source = nodesById.get(edge.sourceNodeId);
              const target = nodesById.get(edge.targetNodeId);
              if (!source || !target) return null;

              const relationStyle = RELATION_STYLE[edge.relation];
              const highlighted =
                pathNodeIds.has(edge.sourceNodeId) && pathNodeIds.has(edge.targetNodeId);
              const startX = source.position.x + NODE_WIDTH;
              const startY = source.position.y + NODE_HEIGHT / 2;
              const endX = target.position.x;
              const endY = target.position.y + NODE_HEIGHT / 2;
              const curve = Math.max(36, Math.abs(endX - startX) * 0.42);

              return (
                <path
                  key={edge.id}
                  data-relation={edge.relation}
                  d={`M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke={highlighted ? relationStyle.stroke : '#64748b'}
                  strokeWidth={highlighted ? 3 : 1.5}
                  strokeDasharray={relationStyle.dash}
                  opacity={highlighted ? 0.92 : 0.32}
                  markerEnd="url(#knowledge-arrow)"
                />
              );
            })}
          </svg>

          {nodes.map((node) => (
            <KnowledgeNodeCard
              key={node.id}
              node={node}
              selected={selectedNodeId === node.id}
              onSelect={() => onSelectNode(node.id)}
              style={{
                left: node.position.x,
                top: node.position.y,
                width: NODE_WIDTH,
                minHeight: NODE_HEIGHT,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
