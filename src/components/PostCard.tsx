'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LanguageTag } from './LanguageTag';
import { Flag } from 'lucide-react';

interface PostAuthor {
  username: string;
  avatar_url?: string | null;
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
}

interface PostCardProps {
  post: Post;
  isOwner?: boolean;
  onDelete?: (postId: string) => void;
}

function AuthorAvatar({ author }: { author: PostAuthor }) {
  const initials = author.username.slice(0, 2).toUpperCase();

  if (author.avatar_url) {
    return (
      <img
        src={author.avatar_url}
        alt={author.username}
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
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

function parseMentions(text: string) {
  if (!text) return "";
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const username = part.slice(1);
      return (
        <Link
          key={index}
          href={`/profile/${username}`}
          className="text-orange-500 hover:underline font-semibold"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}

export function PostCard({ post, isOwner = false, onDelete }: PostCardProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason.trim() }),
      });
      if (res.ok) {
        setReported(true);
        setTimeout(() => {
          setReportModalOpen(false);
          setReported(false);
          setReportReason("");
        }, 1500);
      } else {
        alert("Falha ao enviar denúncia.");
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
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        onDelete?.(post.id);
      } else {
        alert("Falha ao deletar post.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar post.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Link href={`/post/${post.id}`} className="block group">
      <article className="bg-dd-card border border-dd-border rounded-xl p-5 hover:border-orange-500/30 transition-colors relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <AuthorAvatar author={post.author} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-dd-text text-sm font-medium truncate">
                {post.author.username}
              </span>
              <span className="text-dd-muted text-xs">
                {formatRelativeTime(post.created_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5" onClick={(e) => e.preventDefault()}>
            {post.language && <LanguageTag language={post.language} size="sm" />}
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setDeleteModalOpen(true);
                }}
                className="p-1.5 rounded-lg text-dd-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Deletar postagem"
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
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setReportModalOpen(true);
              }}
              className="p-1.5 rounded-lg text-dd-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Denunciar postagem"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-dd-text font-semibold text-base mb-2 group-hover:text-orange-400 transition-colors">
          {post.title}
        </h3>

        {/* Body preview */}
        <p className="text-dd-muted text-sm leading-relaxed line-clamp-2 mb-3">
          {parseMentions(post.body)}
        </p>

        {/* Image preview */}
        {post.image_url && (
          <div className="mt-3 mb-3 relative rounded-xl overflow-hidden border border-dd-border max-h-80 bg-dd-surface/20">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover max-h-80"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Code snippet preview */}
        {post.code_snippet && (
          <div className="bg-dd-bg rounded-lg p-3 mb-3 overflow-hidden">
            <pre className="text-dd-muted text-xs font-mono line-clamp-3 whitespace-pre-wrap">
              {post.code_snippet}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-dd-border">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-dd-muted text-xs">
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {post._count.answers} {post._count.answers === 1 ? 'resposta' : 'respostas'}
            </span>
            <span className="flex items-center gap-1.5 text-dd-muted text-xs">
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
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {post.view_count}
            </span>
          </div>
          <span className="text-xs text-dd-green bg-dd-green/10 px-2 py-0.5 rounded-full font-medium">
            +15 xp ao responder
          </span>
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
            className="w-full max-w-md bg-dd-surface border border-dd-border rounded-2xl p-5 space-y-4 text-left relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-black text-dd-text">Denunciar Postagem</h3>
            <p className="text-xs text-dd-muted font-semibold leading-relaxed">
              Ajude-nos a entender o que há de errado com esta postagem. Ela viola alguma de nossas diretrizes de comunidade?
            </p>
            
            {reported ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold p-3 rounded-lg text-center animate-pulse">
                Denúncia enviada com sucesso. Obrigado por ajudar!
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-dd-muted font-bold uppercase tracking-wider block">Motivo da denúncia</label>
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
                    <option value="Código / Conteúdo malicioso ou perigoso">Código / Conteúdo malicioso ou perigoso</option>
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
                    {reporting ? "Enviando..." : "Denunciar"}
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
            className="w-full max-w-md bg-dd-surface border border-dd-border rounded-2xl p-5 space-y-4 text-left relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-black text-dd-text">Deletar Postagem</h3>
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
                {deleting ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
