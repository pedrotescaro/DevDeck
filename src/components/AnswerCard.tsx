'use client';

import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, AlertTriangle } from 'lucide-react';

interface AnswerAuthor {
  username: string;
}

interface Answer {
  id: string;
  body: string;
  code_snippet?: string | null;
  is_accepted: boolean;
  upvotes: number;
  created_at: string;
  author: AnswerAuthor;
  votes?: { value: number }[];
}

interface AnswerCardProps {
  answer: Answer;
  isPostAuthor: boolean;
  onAccept?: (id: string) => void;
}

export function AnswerCard({ answer, isPostAuthor, onAccept }: AnswerCardProps) {
  const initialUserVote = answer.votes?.[0]?.value === 1 ? 'up' : answer.votes?.[0]?.value === -1 ? 'down' : null;
  const [voteCount, setVoteCount] = useState(answer.upvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote);
  const [accepting, setAccepting] = useState(false);

  const handleVote = async (type: 'up' | 'down') => {
    const currentVote = userVote;
    const currentCount = voteCount;
    let newValue = 0;

    if (type === 'up') {
      newValue = currentVote === 'up' ? 0 : 1;
    } else {
      newValue = currentVote === 'down' ? 0 : -1;
    }

    if (newValue === -1) {
      const justification = prompt(
        "No DevDeck, o downvote exige uma justificativa construtiva. Escreva seu motivo para o autor melhorar:"
      );
      if (!justification || justification.trim().length <= 3) {
        alert("O downvote foi cancelado. É necessária uma justificativa construtiva de pelo menos 4 caracteres.");
        return;
      }
    }

    // Optimistic UI update
    let diff = 0;
    let newUserVote: 'up' | 'down' | null = null;
    if (type === 'up') {
      if (currentVote === 'up') {
        diff = -1;
        newUserVote = null;
      } else if (currentVote === 'down') {
        diff = 2;
        newUserVote = 'up';
      } else {
        diff = 1;
        newUserVote = 'up';
      }
    } else {
      if (currentVote === 'down') {
        diff = 1;
        newUserVote = null;
      } else if (currentVote === 'up') {
        diff = -2;
        newUserVote = 'down';
      } else {
        diff = -1;
        newUserVote = 'down';
      }
    }

    setVoteCount(currentCount + diff);
    setUserVote(newUserVote);

    try {
      const res = await fetch(`/api/answers/${answer.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar voto");
      }

      const data = await res.json();
      setVoteCount(data.upvotes);
    } catch (err) {
      console.error(err);
      setVoteCount(currentCount);
      setUserVote(currentVote);
    }
  };

  const handleAccept = async () => {
    if (!onAccept || accepting) return;
    setAccepting(true);
    try {
      onAccept(answer.id);
    } finally {
      setAccepting(false);
    }
  };

  const relativeTime = formatRelativeTime(answer.created_at);

  return (
    <article
      className={`bg-dd-card border rounded-xl p-5 ${
        answer.is_accepted
          ? 'border-dd-green/40'
          : 'border-dd-border'
      }`}
    >
      {/* Accepted badge */}
      {answer.is_accepted && (
        <div className="flex items-center gap-1.5 text-dd-green text-xs font-medium mb-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Resposta aceita
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-semibold">
          {answer.author.username.slice(0, 2).toUpperCase()}
        </div>
        <span className="text-dd-text text-sm font-medium">
          {answer.author.username}
        </span>
        <span className="text-dd-muted text-xs">{relativeTime}</span>
      </div>

      {/* Body */}
      <div className="text-dd-text text-sm leading-relaxed mb-3 whitespace-pre-wrap">
        {answer.body}
      </div>

      {/* Code snippet */}
      {answer.code_snippet && (
        <div className="bg-dd-bg rounded-lg p-3 mb-3 overflow-x-auto">
          <pre className="text-dd-text text-xs font-mono whitespace-pre">
            {answer.code_snippet}
          </pre>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-dd-border">
        <div className="flex items-center gap-1 bg-dd-bg rounded-lg p-0.5 border border-dd-border">
          <button
            onClick={() => handleVote('up')}
            className={`p-1 rounded-md transition-colors cursor-pointer hover:bg-dd-surface/60 ${
              userVote === 'up' ? 'text-orange-500' : 'text-dd-muted hover:text-dd-text'
            }`}
            title="Resposta útil"
          >
            <ArrowBigUp className="w-4 h-4 fill-current" />
          </button>
          <span className="px-1 font-mono font-semibold text-[10px] text-dd-text">{voteCount}</span>
          <button
            onClick={() => handleVote('down')}
            className={`p-1 rounded-md transition-colors cursor-pointer hover:bg-dd-surface/60 ${
              userVote === 'down' ? 'text-red-500' : 'text-dd-muted hover:text-dd-text'
            }`}
            title="Downvote exige justificativa"
          >
            <ArrowBigDown className="w-4 h-4 fill-current" />
          </button>
          <span className="p-1 text-[9px] text-slate-650 flex items-center justify-center" title="Feedback negativo exige justificativa construtiva">
            <AlertTriangle className="w-3.5 h-3.5 text-dd-muted" />
          </span>
        </div>

        {isPostAuthor && !answer.is_accepted && (
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="flex items-center gap-1.5 text-xs text-dd-green bg-dd-green/10 hover:bg-dd-green/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Aceitar resposta
          </button>
        )}
      </div>
    </article>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}m atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 30) return `${diffDays}d atrás`;
  return date.toLocaleDateString('pt-BR');
}
