/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LanguageTag } from './LanguageTag';
import { Flag, Heart, MessageSquare, BarChart2, Trash2 } from 'lucide-react';
import { ExpandedReactionButton } from './motion/ExpandedReactions';
import { BookmarkButton } from './motion/BookmarkButton';
import { RepostMenu } from './motion/RepostMenu';
import { AuthorAvatar } from '@/components/AuthorAvatar';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '@/lib/cn';
import { formatRelativeTime } from '@/lib/date';

interface PostAuthor {
  username: string;
  avatar_url?: string | null;
  total_xp?: number;
}

interface Post {
  id: string;
  title: string;
  body: string;
  language?: string | null;
  code_snippet?: string | null;
  image_url?: string | null;
  created_at: string;
  view_count: number;
  author: PostAuthor;
  _count: {
    answers: number;
  };
  votes?: Array<{ value: number }>;
  bookmarks?: Array<{ id: string }>;
  reactions?: Array<{ type: string }>;
  upvotes?: number;
}

interface PostCardProps {
  post: Post;
  isOwner?: boolean;
  onDelete?: (postId: string) => void;
}


export function PostCard({ post, isOwner = false, onDelete }: PostCardProps) {
  const router = useRouter();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('select') ||
      target.closest('input') ||
      target.closest('textarea') ||
      window.getSelection()?.toString()
    ) {
      return;
    }
    router.push(`/post/${post.id}`);
  };

  // Estados interativos locais
  const EMOJI_TO_TYPE: Record<string, string> = {
    '🔥': 'FIRE',
    '❤️': 'HEART',
    '😂': 'LAUGH',
    '👏': 'CLAP',
    '💡': 'BULB',
  };

  const TYPE_TO_EMOJI: Record<string, string> = {
    FIRE: '🔥',
    HEART: '❤️',
    LAUGH: '😂',
    CLAP: '👏',
    BULB: '💡',
  };

  const getInitialReaction = () => {
    if (post.reactions && post.reactions.length > 0) {
      return TYPE_TO_EMOJI[post.reactions[0].type] || null;
    }
    if (post.votes && post.votes.length > 0 && post.votes[0].value === 1) {
      return '❤️';
    }
    return null;
  };

  const initialReaction = getInitialReaction();
  const [activeReaction, setActiveReaction] = useState<string | null>(initialReaction);
  const [liked, setLiked] = useState<boolean>(!!initialReaction);
  const [likesCount, setLikesCount] = useState(post.upvotes ?? 0);
  const [bookmarked, setBookmarked] = useState<boolean>(
    !!(post.bookmarks && post.bookmarks.length > 0)
  );
  const [repostsCount, setRepostsCount] = useState(0);
  const [reposted, setReposted] = useState(false);

  const handleReact = async (reactionEmoji?: string | null) => {
    let targetEmoji: string | null = null;
    if (reactionEmoji === undefined || reactionEmoji === null) {
      targetEmoji = activeReaction ? null : '❤️';
    } else {
      targetEmoji = reactionEmoji;
    }

    const previousReaction = activeReaction;
    const wasActive = !!previousReaction;
    const isNowActive = !!targetEmoji;

    setActiveReaction(targetEmoji);
    setLiked(isNowActive);

    let countDiff = 0;
    if (wasActive && !isNowActive) {
      countDiff = -1;
    } else if (!wasActive && isNowActive) {
      countDiff = 1;
    }
    setLikesCount((prev) => Math.max(0, prev + countDiff));

    try {
      const typeToSend = targetEmoji ? EMOJI_TO_TYPE[targetEmoji] : null;
      const res = await fetch(`/api/posts/${post.id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: typeToSend }),
      });

      if (!res.ok) {
        throw new Error('Falha ao registrar reação');
      }

      const data = await res.json();
      const serverEmoji = data.reaction ? TYPE_TO_EMOJI[data.reaction] : null;

      setActiveReaction(serverEmoji);
      setLiked(!!serverEmoji);
    } catch (err) {
      console.error('Error toggling reaction:', err);
      setActiveReaction(previousReaction);
      setLiked(wasActive);
      setLikesCount(likesCount);
    }
  };

  const handleBookmarkToggle = async () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    try {
      const res = await fetch(`/api/posts/${post.id}/bookmark`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Falha ao salvar bookmark');
      }
    } catch (err) {
      console.error(err);
      setBookmarked(!newBookmarked);
    }
  };

  const handleRepostToggle = () => {
    const newReposted = !reposted;
    setReposted(newReposted);
    setRepostsCount((prev) => (newReposted ? prev + 1 : Math.max(0, prev - 1)));
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason.trim() }),
      });
      if (res.ok) {
        setReported(true);
        setTimeout(() => {
          setReportModalOpen(false);
          setReported(false);
          setReportReason('');
        }, 1500);
      } else {
        alert('Falha ao enviar denúncia.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReporting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        onDelete?.(post.id);
      } else {
        alert('Falha ao deletar post.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar post.');
    } finally {
      setDeleting(false);
    }
  };

  const highlightCode = (code: string) => {
    if (!code) return null;
    const lines = code.split('\n');
    return (
      <pre className="font-mono text-[11px] leading-relaxed text-dd-text">
        <code>
          {lines.map((line, idx) => {
            let html = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            // Highlight keywords
            const keywords =
              /\b(const|let|var|function|return|fn|impl|pub|use|import|from|def|class|async|await|struct|enum|if|else|for|while|match)\b/g;
            html = html.replace(keywords, '<span class="text-orange-400 font-semibold">$1</span>');

            // Highlight types
            const types =
              /\b(string|number|boolean|any|void|User|Post|Language|int|float|str|char)\b/g;
            html = html.replace(types, '<span class="text-cyan-400 font-medium">$1</span>');

            // Highlight comments
            if (html.includes('//')) {
              const parts = html.split('//');
              html =
                parts[0] +
                '<span class="text-dd-muted italic">//' +
                parts.slice(1).join('//') +
                '</span>';
            } else if (html.startsWith('#') || html.includes(' #')) {
              const parts = html.split('#');
              html =
                parts[0] +
                '<span class="text-dd-muted italic">#' +
                parts.slice(1).join('#') +
                '</span>';
            }

            return (
              <div key={idx} className="table-row">
                <span className="table-cell text-right pr-4 select-none opacity-20 text-[9px] w-6">
                  {idx + 1}
                </span>
                <span className="table-cell" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            );
          })}
        </code>
      </pre>
    );
  };

  return (
    <div onClick={handleCardClick} className="block group cursor-pointer">
      <article className="bg-dd-card border border-dd-border rounded-xl p-5 hover:border-orange-500/30 transition-colors relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <AuthorAvatar username={post.author.username} avatar_url={post.author.avatar_url} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-dd-text text-xs font-bold truncate">
                @{post.author.username}
              </span>
              <span className="text-[9px] bg-dd-surface border border-dd-border px-1.5 py-0.5 rounded text-dd-muted font-mono font-semibold">
                Lvl {Math.max(1, Math.floor((post.author.total_xp ?? 0) / 1000) + 1)}
              </span>
            </div>
            <span className="text-dd-muted text-[10px] block mt-0.5 font-medium">
              {formatRelativeTime(post.created_at) === 'agora'
                ? 'Postado há pouco'
                : `Postado ${formatRelativeTime(post.created_at)}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5" onClick={(e) => e.preventDefault()}>
            {post.language && <LanguageTag language={post.language} size="sm" />}
          </div>
        </div>

        {/* Body preview */}
        <div className="mb-3 text-dd-muted">
          <MarkdownRenderer content={post.body} compact />
        </div>

        {/* Image preview */}
        {post.image_url && (
          <div className="mt-3 mb-3 relative rounded-xl overflow-hidden border border-dd-border max-h-80 bg-dd-surface/20">
            <img
              src={post.image_url}
              alt={`Post de @${post.author.username}`}
              className="w-full h-full object-cover max-h-80"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Code snippet preview */}
        {post.code_snippet && (
          <div className="rounded-lg border border-dd-border bg-dd-bg p-4 mb-3 overflow-x-auto max-h-60 shadow-inner">
            {highlightCode(post.code_snippet)}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3 border-t border-dd-border text-xs w-full select-none"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {/* 1. Comment bubble */}
          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-0.5 text-dd-muted hover:text-orange-400 transition-colors group/comment"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-500/10 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-dd-muted group-hover/comment:text-orange-400" />
            </div>
            <span className="px-1 font-semibold text-[10px] text-dd-muted group-hover/comment:text-orange-400">
              {post._count.answers}
            </span>
          </Link>

          {/* 2. Repost Menu */}
          <RepostMenu
            count={repostsCount}
            isReposted={reposted}
            onRepost={handleRepostToggle}
            onQuote={() => {}}
          />

          {/* 3. Reactions button */}
          <div className="flex items-center gap-0.5 text-dd-muted hover:text-orange-500 transition-colors group/likes shrink-0">
            <ExpandedReactionButton
              isActive={liked}
              activeReaction={activeReaction as any}
              onReact={handleReact}
              title="Reagir ao post"
            />
            <span
              className={cn(
                'px-1 font-semibold text-[10px] transition-colors',
                liked ? 'text-orange-500' : 'text-dd-muted group-hover/likes:text-orange-500'
              )}
            >
              {likesCount}
            </span>
          </div>

          {/* 4. Views BarChart */}
          <div className="flex items-center gap-0.5 text-dd-muted select-none group/views">
            <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-500/10 hover:text-orange-400 transition-colors">
              <BarChart2 className="w-4 h-4 text-dd-muted group-hover/views:text-orange-400" />
            </div>
            <span className="px-1 font-semibold text-[10px] text-dd-muted group-hover/views:text-orange-400">
              {post.view_count >= 1000
                ? `${(post.view_count / 1000).toFixed(0)}mil`
                : post.view_count}
            </span>
          </div>

          {/* 5. Report button */}
          <button
            onClick={() => setReportModalOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-dd-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
            title="Denunciar postagem"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>

          {/* 6. Delete button (if Owner) */}
          {isOwner && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-dd-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
              title="Deletar postagem"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 7. BookmarkButton */}
          <BookmarkButton isSaved={bookmarked} onToggle={handleBookmarkToggle} />
        </div>
      </article>

      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setReportModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`report-post-title-${post.id}`}
            className="w-full max-w-md bg-dd-surface border border-dd-border rounded-2xl p-5 space-y-4 text-left relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id={`report-post-title-${post.id}`} className="text-sm font-black text-dd-text">
              Denunciar Postagem
            </h3>
            <p className="text-xs text-dd-muted font-semibold leading-relaxed">
              Ajude-nos a entender o que há de errado com esta postagem. Ela viola alguma de nossas
              diretrizes de comunidade?
            </p>

            {reported ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold p-3 rounded-lg text-center animate-pulse">
                Denúncia enviada com sucesso. Obrigado por ajudar!
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-dd-muted font-bold uppercase tracking-wider block">
                    Motivo da denúncia
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                    className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg px-3 py-2.5 text-dd-text focus:border-red-500/50 focus:outline-none"
                  >
                    <option value="">Selecione um motivo...</option>
                    <option value="Spam / Propaganda enganosa">Spam / Propaganda enganosa</option>
                    <option value="Discurso de ódio / Ofensa">Discurso de ódio / Ofensa</option>
                    <option value="Assédio / Bullying">Assédio / Bullying</option>
                    <option value="Código / Conteúdo malicioso ou perigoso">
                      Código / Conteúdo malicioso ou perigoso
                    </option>
                    <option value="Outro motivo">Outro motivo</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-dd-border">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setReportModalOpen(false);
                    }}
                    className="text-xs font-bold text-dd-muted hover:text-dd-text py-2 px-4 rounded-lg hover:bg-dd-surface transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => e.stopPropagation()}
                    disabled={reporting || !reportReason}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {reporting ? 'Enviando...' : 'Denunciar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setDeleteModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-post-title-${post.id}`}
            className="w-full max-w-md bg-dd-surface border border-dd-border rounded-2xl p-5 space-y-4 text-left relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id={`delete-post-title-${post.id}`} className="text-sm font-black text-dd-text">
              Deletar Postagem
            </h3>
            <p className="text-xs text-dd-muted font-semibold leading-relaxed">
              Tem certeza que deseja deletar esta postagem? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-dd-border">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setDeleteModalOpen(false);
                }}
                className="text-xs font-bold text-dd-muted hover:text-dd-text py-2 px-4 rounded-lg hover:bg-dd-surface transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
