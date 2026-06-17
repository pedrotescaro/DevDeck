'use client';

import { useState } from 'react';
import { AlertTriangle, MessageSquare, BarChart2, Share } from 'lucide-react';
import { LikeButton } from '@/components/motion/LikeButton';
import { BookmarkButton } from '@/components/motion/BookmarkButton';
import { RepostMenu } from '@/components/motion/RepostMenu';

interface AnswerAuthor {
  username: string;
  total_xp?: number;
}

interface Answer {
  id: string;
  post_id?: string;
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
  currentUser?: { username: string; avatar_url?: string | null };
  onAnswerAdded?: (newAnswer: any) => void;
  postId?: string;
}

export function AnswerCard({
  answer,
  isPostAuthor,
  onAccept,
  currentUser,
  onAnswerAdded,
  postId,
}: AnswerCardProps) {
  const initialUserVote = answer.votes?.[0]?.value === 1 ? 'up' : answer.votes?.[0]?.value === -1 ? 'down' : null;
  const [voteCount, setVoteCount] = useState(answer.upvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(0);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState(`@${answer.author.username} `);
  const [replySubmitting, setReplySubmitting] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetPostId = answer.post_id || postId;
    if (replySubmitting || !replyText.trim() || !targetPostId) return;

    setReplySubmitting(true);

    try {
      const res = await fetch(`/api/posts/${targetPostId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyText }),
      });

      if (!res.ok) {
        throw new Error("Erro ao responder comentário");
      }

      const data = await res.json();
      if (onAnswerAdded) {
        onAnswerAdded(data.answer);
      }

      setReplyText(`@${answer.author.username} `);
      setShowReplyBox(false);
    } catch (err) {
      console.error(err);
      alert("Não foi possível enviar sua resposta agora.");
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleShare = () => {
    const link = `${window.location.origin}/post/${answer.post_id || ''}#answer-${answer.id}`;
    navigator.clipboard.writeText(link);
    alert("Link da resposta copiado para a área de transferência!");
  };

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
      <div className="flex items-center justify-between pt-3 border-t border-dd-border w-full select-none text-xs gap-3">
        <div className="flex items-center justify-between flex-grow max-w-xl">
          {/* 1. Comment bubble */}
          <button
            type="button"
            onClick={() => {
              setShowReplyBox(!showReplyBox);
              if (!showReplyBox) {
                setReplyText(`@${answer.author.username} `);
              }
            }}
            className="flex items-center gap-0.5 text-dd-muted select-none hover:text-orange-400 cursor-pointer group/comment border-none bg-transparent active:scale-[0.95] transition-transform"
            title="Responder a este comentário"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-500/10 transition-colors animate-none">
              <MessageSquare className="w-3.5 h-3.5 text-dd-muted group-hover/comment:text-orange-400" />
            </div>
          </button>

          {/* 2. Repost Menu */}
          <RepostMenu
            count={repostCount}
            isReposted={reposted}
            onRepost={() => {
              setReposted(!reposted);
              setRepostCount(prev => reposted ? prev - 1 : prev + 1);
            }}
            onQuote={() => alert("Citação de resposta mockada!")}
          />

          {/* 3. Heart/Like button */}
          <LikeButton
            count={voteCount}
            isActive={userVote === 'up'}
            onToggle={() => handleVote('up')}
            title="Curtir resposta"
          />

          {/* 4. Views BarChart */}
          <div className="flex items-center gap-0.5 text-dd-muted select-none group/views">
            <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-500/10 hover:text-orange-400 transition-colors animate-none">
              <BarChart2 className="w-4 h-4 text-dd-muted group-hover/views:text-orange-400" />
            </div>
            <span className="px-1 font-semibold text-[10px] text-dd-muted group-hover/views:text-orange-400">
              {(Math.abs(voteCount) * 4) + 12}
            </span>
          </div>

          {/* 5. BookmarkButton */}
          <BookmarkButton
            isSaved={isBookmarked}
            onToggle={() => setIsBookmarked(!isBookmarked)}
          />

          {/* 6. Share button */}
          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-full flex items-center justify-center text-dd-muted hover:text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer shrink-0"
            title="Compartilhar"
          >
            <Share className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7. Accept Button */}
        {isPostAuthor && !answer.is_accepted && (
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="flex items-center gap-1 text-[10px] font-bold text-dd-green bg-dd-green/10 hover:bg-dd-green/20 px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-50 shrink-0"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Aceitar
          </button>
        )}
      </div>
      {showReplyBox && (
        <form onSubmit={handleReplySubmit} className="mt-4 pt-4 border-t border-dd-border/60 flex gap-3">
          <div className="shrink-0">
            {currentUser?.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.username}
                className="w-8 h-8 rounded-full object-cover border border-dd-border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/10">
                {currentUser?.username?.slice(0, 2).toUpperCase() || "ME"}
              </div>
            )}
          </div>
          <div className="flex-grow space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Responder a @${answer.author.username}...`}
              className="w-full bg-dd-surface border border-dd-border focus:border-orange-500/50 text-sm rounded-lg p-2.5 text-dd-text placeholder-dd-muted focus:outline-none focus:ring-1 focus:ring-orange-500/30 resize-none h-20"
              maxLength={280}
              required
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyText(`@${answer.author.username} `);
                }}
                className="px-3 py-1.5 rounded-lg border border-dd-border text-xs font-bold text-dd-muted hover:text-dd-text hover:bg-dd-border/30 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={replySubmitting || !replyText.trim() || replyText.trim() === `@${answer.author.username}`}
                className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white transition-all duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-50"
              >
                {replySubmitting ? "Enviando..." : "Responder"}
              </button>
            </div>
          </div>
        </form>
      )}
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
