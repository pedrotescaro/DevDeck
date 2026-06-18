'use client';

import { LanguageTag, getLanguageColor } from './LanguageTag';

interface DuelUser {
  username: string;
}

interface DuelSolution {
  user_id: string;
  vote_count: number;
}

interface Duel {
  id: string;
  problem_title: string;
  language: string;
  status: 'PENDING' | 'ACTIVE' | 'VOTING' | 'FINISHED';
  challenger: DuelUser;
  opponent?: DuelUser | null;
  solutions: DuelSolution[];
  created_at: string;
}

interface DuelCardProps {
  duel: Duel;
}

export function DuelCard({ duel }: DuelCardProps) {
  const totalVotes = duel.solutions.reduce((s, sol) => s + sol.vote_count, 0);

  const challengerVotes = duel.solutions[0]?.vote_count ?? 0;
  const opponentVotes = duel.solutions[1]?.vote_count ?? 0;

  const challengerPercent = totalVotes > 0 ? Math.round((challengerVotes / totalVotes) * 100) : 50;
  const opponentPercent = totalVotes > 0 ? 100 - challengerPercent : 50;

  const langColor = getLanguageColor(duel.language);

  const statusLabel: Record<Duel['status'], string> = {
    PENDING: 'Aguardando oponente',
    ACTIVE: 'Em andamento',
    VOTING: 'Em votação',
    FINISHED: 'Finalizado',
  };

  const statusColor: Record<Duel['status'], string> = {
    PENDING: 'text-dd-amber',
    ACTIVE: 'text-dd-blue',
    VOTING: 'text-orange-400',
    FINISHED: 'text-dd-green',
  };

  return (
    <article className="bg-dd-card border border-orange-500/30 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-dd-muted text-xs font-semibold uppercase tracking-wider">
            Duelo de Código
          </span>
          <span className="text-dd-muted text-xs">·</span>
          <LanguageTag language={duel.language} size="sm" />
        </div>
        <span className={`text-xs font-medium ${statusColor[duel.status]}`}>
          {statusLabel[duel.status]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-dd-text font-semibold text-base mb-4">{duel.problem_title}</h3>

      {/* Competitors */}
      <div className="space-y-3">
        {/* Challenger */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-semibold shrink-0">
            {duel.challenger.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-dd-text text-sm font-medium truncate">
                {duel.challenger.username}
              </span>
              <span className="text-dd-muted text-xs">
                {challengerVotes} {challengerVotes === 1 ? 'voto' : 'votos'} ({challengerPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-dd-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${challengerPercent}%`,
                  backgroundColor: langColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* VS divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-dd-border" />
          <span className="text-dd-muted text-xs font-bold">VS</span>
          <div className="flex-1 border-t border-dd-border" />
        </div>

        {/* Opponent */}
        {duel.opponent ? (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-dd-amber/20 text-dd-amber flex items-center justify-center text-[10px] font-semibold shrink-0">
              {duel.opponent.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-dd-text text-sm font-medium truncate">
                  {duel.opponent.username}
                </span>
                <span className="text-dd-muted text-xs">
                  {opponentVotes} {opponentVotes === 1 ? 'voto' : 'votos'} ({opponentPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-dd-bg rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${opponentPercent}%`,
                    backgroundColor: '#f5a623',
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border border-dashed border-dd-border flex items-center justify-center shrink-0">
              <span className="text-dd-muted text-lg leading-none">?</span>
            </div>
            <span className="text-dd-muted text-sm italic">Aguardando oponente...</span>
          </div>
        )}
      </div>
    </article>
  );
}
