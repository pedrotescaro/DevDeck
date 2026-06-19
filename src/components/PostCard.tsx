/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LanguageTag } from './LanguageTag';
import {
  Flag,
  Heart,
  MessageSquare,
  BarChart2,
  Trash2,
  MoreHorizontal,
  Pencil,
  X,
  Sparkles,
} from 'lucide-react';
import { LikeButton } from './motion/LikeButton';
import { BookmarkButton } from './motion/BookmarkButton';
import { RepostMenu } from './motion/RepostMenu';
import { AuthorAvatar } from '@/components/AuthorAvatar';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '@/lib/cn';
import { formatRelativeTime } from '@/lib/date';
import { ComposeModal } from '@/components/motion/ComposeModal';
import { MarkdownEditor, type NotionEditorRef } from '@/components/MarkdownEditor';
import { CharCounter } from '@/components/motion/CharCounter';
import { POST_CHAR_LIMIT } from '@/lib/motion';

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
  quizzes?: any[];
}

interface PostCardProps {
  post: Post;
  isOwner?: boolean;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string, updatedPost: any) => void;
  flat?: boolean;
  onBookmarkToggle?: (postId: string, bookmarked: boolean) => void;
}

export function PostCard({
  post,
  isOwner = false,
  onDelete,
  onEdit,
  flat = false,
  onBookmarkToggle,
}: PostCardProps) {
  const router = useRouter();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Stateful copy of post fields for instant local updates
  const [postBody, setPostBody] = useState(post.body);
  const [postLanguage, setPostLanguage] = useState(post.language);
  const [postCodeSnippet, setPostCodeSnippet] = useState(post.code_snippet);
  const [editBody, setEditBody] = useState(post.body);

  const menuRef = useRef<HTMLDivElement>(null);
  const editBodyEditorRef = useRef<NotionEditorRef>(null);

  useEffect(() => {
    setPostBody(post.body);
    setPostLanguage(post.language);
    setPostCodeSnippet(post.code_snippet);
    setEditBody(post.body);
  }, [post.body, post.language, post.code_snippet]);

  // Click outside to close the dropdown menu
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

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

  const getInitialLikeState = () => {
    if (post.votes && post.votes.length > 0 && post.votes[0].value === 1) {
      return true;
    }
    return false;
  };

  const initialLiked = getInitialLikeState();
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likesCount, setLikesCount] = useState(post.upvotes ?? 0);
  const [bookmarked, setBookmarked] = useState<boolean>(
    !!(post.bookmarks && post.bookmarks.length > 0)
  );
  const [repostsCount, setRepostsCount] = useState(0);
  const [reposted, setReposted] = useState(false);

  const handleLikeToggle = async () => {
    const nextLiked = !liked;
    const newValue = nextLiked ? 1 : 0;
    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await fetch(`/api/posts/${post.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue }),
      });

      if (!res.ok) {
        throw new Error('Falha ao registrar curtida');
      }

      const data = await res.json();
      setLikesCount(data.upvotes);
    } catch (err) {
      console.error(err);
      setLiked(previousLiked);
      setLikesCount(previousCount);
    }
  };

  const handleBookmarkToggle = async () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    onBookmarkToggle?.(post.id, newBookmarked);

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
      onBookmarkToggle?.(post.id, !newBookmarked);
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBody.trim() || editBody.trim().length < 10) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: editBody.trim() }),
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setEditModalOpen(false);
        setPostBody(updatedPost.body);
        setPostLanguage(updatedPost.language);
        setPostCodeSnippet(updatedPost.code_snippet);
        onEdit?.(post.id, updatedPost);
      } else {
        const data = await res.json();
        alert(data.error || 'Falha ao editar post.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao editar post.');
    } finally {
      setSaving(false);
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
      <article
        className={cn(
          'transition-colors relative',
          flat
            ? 'bg-transparent border-b border-dd-border/50 rounded-none p-4 sm:p-5 hover:bg-dd-surface/20'
            : 'bg-dd-card border border-dd-border rounded-xl p-5 hover:border-orange-500/30'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Link
            href={`/profile/${post.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:opacity-85 transition-opacity shrink-0"
          >
            <AuthorAvatar username={post.author.username} avatar_url={post.author.avatar_url} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${post.author.username}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline truncate"
              >
                <span className="text-dd-text text-xs font-bold truncate">
                  @{post.author.username}
                </span>
              </Link>
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
            {postLanguage && <LanguageTag language={postLanguage} size="sm" />}

            {/* Top-Right Options Popover Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setMenuOpen(!menuOpen);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-dd-muted hover:text-dd-text hover:bg-dd-surface transition-colors cursor-pointer"
                title="Mais opções"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-1 w-40 rounded-xl border border-dd-border bg-dd-card p-1 shadow-xl z-30 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  {isOwner ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setEditModalOpen(true);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-dd-text hover:bg-dd-surface transition-colors cursor-pointer text-left"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setDeleteModalOpen(true);
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setReportModalOpen(true);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-dd-text hover:bg-dd-surface transition-colors cursor-pointer text-left"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Denunciar</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body preview */}
        <div className="mb-3 text-dd-muted">
          <MarkdownRenderer content={postBody} compact />
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
        {postCodeSnippet && !postBody.includes('```') && (
          <div className="rounded-lg border border-dd-border bg-dd-bg p-4 mb-3 overflow-x-auto max-h-60 shadow-inner">
            {highlightCode(postCodeSnippet)}
          </div>
        )}

        {/* Quiz challenge preview (Attachment card style like Twitter/X card preview) */}
        {post.quizzes && post.quizzes.length > 0 && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.push(`/post/${post.id}`);
            }}
            className="mt-3 mb-3 p-3.5 rounded-xl border border-dd-border bg-dd-surface/30 backdrop-blur-sm flex items-center justify-between gap-4 hover:bg-dd-surface/50 hover:border-orange-500/20 transition-all duration-200 group/quiz cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover/quiz:scale-105 transition-transform duration-200">
                <Sparkles className="w-4.5 h-4.5 text-orange-400" />
              </div>
              <div className="text-left min-w-0">
                <h4 className="text-xs font-black text-dd-text truncate">Quiz de Aprendizado</h4>
                <p className="text-[10px] text-dd-muted font-medium mt-0.5 truncate">
                  {Boolean(post.quizzes[0].attempts && post.quizzes[0].attempts.length > 0)
                    ? 'Você já respondeu a este desafio!'
                    : 'Coloque seus conhecimentos em prática e ganhe +15 XP.'}
                </p>
              </div>
            </div>

            <Link
              href={`/post/${post.id}`}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'inline-flex items-center justify-center gap-1 px-4 py-1.5 rounded-full font-bold text-[10px] leading-tight transition-all duration-200 shrink-0 shadow-sm border',
                Boolean(post.quizzes[0].attempts && post.quizzes[0].attempts.length > 0)
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-orange-500 border-transparent hover:bg-orange-600 text-white'
              )}
            >
              <span>
                {Boolean(post.quizzes[0].attempts && post.quizzes[0].attempts.length > 0)
                  ? 'Ver Resultados'
                  : 'Resolver Quiz'}
              </span>
            </Link>
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
              {post._count?.answers ?? 0}
            </span>
          </Link>

          {/* 2. Repost Menu */}
          <RepostMenu
            count={repostsCount}
            isReposted={reposted}
            onRepost={handleRepostToggle}
            onQuote={() => {}}
          />

          {/* 3. Heart/Like button */}
          <LikeButton
            count={likesCount}
            isActive={liked}
            onToggle={handleLikeToggle}
            title="Curtir post"
          />

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

          {/* 5. BookmarkButton */}
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

      {/* EDIT POST MODAL */}
      <ComposeModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        hasDraft={editBody !== postBody}
        onDiscard={() => setEditBody(postBody)}
      >
        <form
          onSubmit={handleEditSubmit}
          className="space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-3">
            <AuthorAvatar username={post.author.username} avatar_url={post.author.avatar_url} />

            <div className="flex-grow min-w-0 space-y-3 relative">
              <h3 className="text-sm font-black text-dd-text">Editar Publicação</h3>
              <MarkdownEditor
                ref={editBodyEditorRef}
                value={editBody}
                onChange={(val) => setEditBody(val)}
                maxLength={POST_CHAR_LIMIT}
                minHeight="8rem"
                placeholder="Editar conteúdo..."
              />
              <div className="flex justify-end">
                <CharCounter text={editBody} limit={POST_CHAR_LIMIT} />
              </div>
            </div>
          </div>

          <div className="border-t border-dd-border/50 pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setEditModalOpen(false);
              }}
              className="text-xs font-bold text-dd-muted hover:text-dd-text py-2 px-4 rounded-lg hover:bg-dd-surface transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              disabled={saving || !editBody.trim() || editBody.length >= POST_CHAR_LIMIT}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold py-2 px-5 rounded-lg transition-colors cursor-pointer"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </ComposeModal>
    </div>
  );
}
