'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { LanguageTag } from '@/components/LanguageTag';
import { QuizWidget } from '@/components/QuizWidget';
import { AnswerThread } from '@/components/AnswerThread';
import type { AnswerNode } from '@/components/answer-types';
import { MarkdownEditor, type NotionEditorRef } from '@/components/MarkdownEditor';
import { Footer } from '@/components/Footer';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Sparkles, MessageSquare, ArrowLeft, Flag, MapPin, X } from 'lucide-react';
import { RepostMenu } from '@/components/motion/RepostMenu';
import { BookmarkButton } from '@/components/motion/BookmarkButton';
import { LikeButton } from '@/components/motion/LikeButton';
import { PostComposerExtras } from '@/components/PostComposerExtras';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { AuthorAvatar } from '@/components/AuthorAvatar';
import { ReplyAudience } from '@/lib/post-composer';
import { cn } from '@/lib/cn';

interface PostDetailContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
    streak?: number;
  };
  post: any;
  initialIsSaved?: boolean;
}

/**
 * Recursively inserts a new reply into the answer tree under the answer whose
 * id matches `parentId`. Returns a new tree (does not mutate the input).
 * If the parent cannot be found (e.g. its level wasn't fetched from the server
 * because it was beyond the include depth), the reply is appended to the
 * nearest ancestor that was found, so it still surfaces in the UI.
 */
function insertReplyIntoTree(
  answers: AnswerNode[],
  parentId: string,
  newReply: AnswerNode
): AnswerNode[] {
  const insert = (node: AnswerNode): AnswerNode => {
    if (node.id === parentId) {
      return { ...node, replies: [...(node.replies ?? []), newReply] };
    }
    if (node.replies && node.replies.length > 0) {
      return { ...node, replies: node.replies.map(insert) };
    }
    return node;
  };

  const next = answers.map(insert);
  return next.some((node) => node.id === parentId || containsId(node.replies, parentId))
    ? next
    : [...next, newReply];
}

/** Returns true if the given id exists anywhere in the answer subtree. */
function containsId(answers: AnswerNode[] | undefined, id: string): boolean {
  if (!answers) return false;
  return answers.some((node) => node.id === id || containsId(node.replies, id));
}

export function PostDetailContent({
  user,
  post: initialPost,
  initialIsSaved = false,
}: PostDetailContentProps) {
  const router = useRouter();
  const [post, setPost] = useState<any>(initialPost);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const updateSoundState = () => {
      setSoundEnabled(localStorage.getItem('devdeck-sound') !== 'false');
    };

    updateSoundState();

    window.addEventListener('storage', updateSoundState);
    window.addEventListener('devdeck-sound-changed', updateSoundState);

    return () => {
      window.removeEventListener('storage', updateSoundState);
      window.removeEventListener('devdeck-sound-changed', updateSoundState);
    };
  }, []);

  const { playSound } = useSoundEffects(soundEnabled);
  const [isExpanded, setIsExpanded] = useState(false);
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastXp, setToastXp] = useState<{ amount: number; language: string } | null>(null);

  // States to match the main post composer extra options
  const [replyAudience, setReplyAudience] = useState<ReplyAudience>('everyone');
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [answerLocation, setAnswerLocation] = useState('');
  const [isSensitive, setIsSensitive] = useState(false);
  const [answerImage, setAnswerImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const answerBodyEditorRef = useRef<NotionEditorRef>(null);

  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [repostState, setRepostState] = useState({
    count: post.reposts_count ?? 0,
    reposted: false,
  });

  const handleBookmarkToggle = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      const res = await fetch(`/api/posts/${post.id}/bookmark`, {
        method: 'POST',
      });
      if (!res.ok) {
        setIsSaved(!nextSaved);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      setIsSaved(!nextSaved);
    }
  };

  // Report post state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [showQuiz, setShowQuiz] = useState(true);

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

  const handleRepost = () => {
    setRepostState((prev) => ({
      count: prev.reposted ? Math.max(0, prev.count - 1) : prev.count + 1,
      reposted: !prev.reposted,
    }));
  };

  const handleQuotePost = () => {
    alert('Citação mockada no detalhe do post!');
  };

  const postUserVote =
    post.votes?.[0]?.value === 1 ? 'up' : post.votes?.[0]?.value === -1 ? 'down' : null;
  const postVotesCount = post.upvotes;

  const handlePostVote = async (type: 'up' | 'down') => {
    const currentVote = postUserVote;
    const currentCount = postVotesCount;
    let newValue = 0;

    if (type === 'up') {
      newValue = currentVote === 'up' ? 0 : 1;
    } else {
      newValue = currentVote === 'down' ? 0 : -1;
    }

    if (newValue === -1) {
      const justification = prompt(
        'No DevDeck, o downvote exige uma justificativa construtiva. Escreva seu motivo para o autor melhorar:'
      );
      if (!justification || justification.trim().length <= 3) {
        alert(
          'O downvote foi cancelado. É necessária uma justificativa construtiva de pelo menos 4 caracteres.'
        );
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

    setPost((prev: any) => ({
      ...prev,
      upvotes: currentCount + diff,
      votes: newUserVote ? [{ value: newUserVote === 'up' ? 1 : -1 }] : [],
    }));

    try {
      const res = await fetch(`/api/posts/${post.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue }),
      });

      if (!res.ok) {
        throw new Error('Erro ao registrar voto');
      }

      const data = await res.json();
      setPost((prev: any) => ({
        ...prev,
        upvotes: data.upvotes,
      }));
    } catch (err) {
      console.error(err);
      setPost((prev: any) => ({
        ...prev,
        upvotes: currentCount,
        votes: currentVote ? [{ value: currentVote === 'up' ? 1 : -1 }] : [],
      }));
    }
  };

  // Recarregar os dados do post
  const reloadPost = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
    } catch (err) {
      console.error('Error reloading post:', err);
    }
  };

  const showXPToast = (amount: number, language: string) => {
    setToastXp({ amount, language });
    playSound('xpgain');
    setTimeout(() => {
      setToastXp(null);
    }, 4000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAnswerImage(data.url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${post.id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: answerBody,
          code_snippet: null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnswerBody('');
        setAnswerImage('');
        setReplyAudience('everyone');
        setScheduledAt(null);
        setAnswerLocation('');
        setIsSensitive(false);
        setIsExpanded(false);
        await reloadPost();

        if (data.xpResult?.xpEarned) {
          showXPToast(data.xpResult.xpEarned, data.xpResult.language);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      const res = await fetch(`/api/answers/${answerId}/accept`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        await reloadPost();

        if (data.xpResult?.xpEarned) {
          showXPToast(data.xpResult.xpEarned, data.xpResult.language);
        }
      }
    } catch (err) {
      console.error('Error accepting answer:', err);
    }
  };

  // Simulated syntax highlighter for code snippets
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

  const isPostAuthor = post.author_id === user.id;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased selection:bg-orange-500/35 selection:text-white">
      {/* XP Toast */}
      {toastXp && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in-right rounded-xl border border-emerald-500/30 bg-dd-surface/90 backdrop-blur-xl p-4 shadow-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-base ring-1 ring-emerald-500/30">
            +{toastXp.amount}
          </div>
          <div>
            <p className="font-bold text-sm text-dd-text">XP Concedido!</p>
            <p className="text-xs text-dd-muted">Você progrediu na trilha de {toastXp.language}</p>
          </div>
        </div>
      )}

      <Sidebar user={user} />

      <div className="flex-grow flex flex-col md:flex-row min-w-0">
        <main className="flex-grow max-w-2xl w-full border-r border-dd-border/80 min-h-screen bg-dd-bg pb-24 md:pb-8 flex flex-col">
          {/* Header (Twitter style: Back arrow + Title) */}
          <div className="sticky top-0 z-30 bg-dd-bg/95 backdrop-blur-md border-b border-dd-border/60 px-4 py-3 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-dd-muted hover:text-dd-text transition-colors cursor-pointer"
              style={{ background: 'transparent', border: 'none', padding: '4px' }}
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-dd-text text-base font-extrabold tracking-tight">Post</h1>
            </div>
          </div>

          {/* Post Detail Card */}
          <article className="bg-transparent border-b border-dd-border/50 p-4 sm:p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dd-border/50 pb-3">
              <Link
                href={`/profile/${post.author.username}`}
                className="flex items-center gap-2 hover:opacity-85 transition-opacity"
              >
                <AuthorAvatar
                  username={post.author.username}
                  avatar_url={post.author.avatar_url}
                  size="md"
                />
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-dd-text">@{post.author.username}</p>
                  <span className="text-[9px] bg-dd-surface border border-dd-border px-2 py-0.5 rounded text-dd-muted font-mono font-semibold">
                    Lvl {Math.max(1, Math.floor(post.author.total_xp / 1000) + 1)}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2 flex-wrap">
                <LanguageTag language={post.language} size="sm" />
              </div>
            </div>

            <MarkdownRenderer content={post.body} compact={false} />

            {post.code_snippet && !post.body.includes('```') && (
              <div className="rounded-lg border border-dd-border bg-dd-bg p-4 overflow-x-auto shadow-inner">
                {highlightCode(post.code_snippet)}
              </div>
            )}

            {/* Metadata Row: Time, Date, Views (Twitter style) */}
            <div className="text-[11px] text-dd-muted font-medium pt-3 border-t border-dd-border/30 flex flex-wrap items-center gap-1.5 select-none">
              <span>
                {new Date(post.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>·</span>
              <span>
                {new Date(post.created_at).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              {post.location && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-dd-muted" />
                    {post.location}
                  </span>
                </>
              )}
              <span>·</span>
              <span className="text-dd-text font-bold">
                {post.view_count >= 1000
                  ? `${(post.view_count / 1000).toFixed(0)} mil`
                  : post.view_count}
              </span>
              <span>Visualizações</span>
            </div>

            {/* Post bottom actions section */}
            <div
              className="flex items-center justify-between pt-3 border-t border-dd-border text-xs w-full select-none"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {/* 1. Comment Bubble */}
              <div className="flex items-center gap-0.5 text-dd-muted select-none hover:text-orange-400 cursor-pointer group/comment">
                <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-500/10 transition-colors animate-none">
                  <MessageSquare className="w-3.5 h-3.5 text-dd-muted group-hover/comment:text-orange-400" />
                </div>
                <span className="px-1 font-semibold text-[10px] text-dd-muted group-hover/comment:text-orange-400">
                  {post.answers?.length || 0}
                </span>
              </div>

              {/* 2. Repost Menu */}
              <RepostMenu
                count={repostState.count}
                isReposted={repostState.reposted}
                onRepost={handleRepost}
                onQuote={handleQuotePost}
              />

              {/* 3. Heart/Like button */}
              <LikeButton
                count={postVotesCount}
                isActive={postUserVote === 'up'}
                onToggle={() => handlePostVote('up')}
                title="Curtir post"
              />

              {/* 4. Report button */}
              <button
                onClick={() => setReportModalOpen(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-dd-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                title="Denunciar postagem"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>

              {/* 5. BookmarkButton */}
              <BookmarkButton isSaved={isSaved} onToggle={handleBookmarkToggle} />
            </div>
          </article>

          {/* Resolver como Quiz button outside/below the post box */}
          {post.quizzes && post.quizzes.length > 0 && (
            <div className="px-4 sm:px-6 py-4 border-b border-dd-border/50 flex flex-col gap-4">
              {/* Card mimicking the Feed layout */}
              <div
                onClick={() => setShowQuiz(!showQuiz)}
                className="p-3.5 rounded-xl border border-dd-border bg-dd-surface/30 backdrop-blur-sm flex items-center justify-between gap-4 hover:bg-dd-surface/50 hover:border-orange-500/20 transition-all duration-200 group/quiz cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover/quiz:scale-105 transition-transform duration-200">
                    <Sparkles className="w-4.5 h-4.5 text-orange-400" />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-black text-dd-text truncate">
                      Quiz de Aprendizado
                    </h4>
                    <p className="text-[10px] text-dd-muted font-medium mt-0.5 truncate">
                      {Boolean(post.quizzes[0].attempts && post.quizzes[0].attempts.length > 0)
                        ? 'Você já respondeu a este desafio!'
                        : 'Coloque seus conhecimentos em prática e ganhe +15 XP.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={cn(
                    'inline-flex items-center justify-center gap-1 px-4 py-1.5 rounded-full font-bold text-[10px] leading-tight transition-all duration-200 shrink-0 shadow-sm border cursor-pointer',
                    Boolean(post.quizzes[0].attempts && post.quizzes[0].attempts.length > 0)
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-orange-500 border-transparent hover:bg-orange-600 text-white'
                  )}
                >
                  <span>
                    {showQuiz
                      ? 'Ocultar Quiz'
                      : Boolean(post.quizzes[0].attempts && post.quizzes[0].attempts.length > 0)
                        ? 'Ver Resultados'
                        : 'Resolver Quiz'}
                  </span>
                </button>
              </div>

              {showQuiz && (
                <div className="bg-dd-card border border-dd-border rounded-xl p-5 backdrop-blur-sm shadow-sm">
                  <QuizWidget
                    quiz={post.quizzes[0]}
                    postId={post.id}
                    attempted={post.quizzes[0].attempts && post.quizzes[0].attempts.length > 0}
                    userAnswer={post.quizzes[0].attempts?.[0]?.selected_index}
                  />
                </div>
              )}
            </div>
          )}

          {/* Write Answer Form */}
          {!isExpanded ? (
            <div
              onClick={() => setIsExpanded(true)}
              className="flex items-center justify-between gap-4 p-4 border-b border-dd-border/50 bg-transparent cursor-pointer hover:bg-dd-surface/5 transition-colors"
            >
              <div className="flex items-center gap-3 flex-grow">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-9 h-9 rounded-full object-cover border border-dd-border shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/10 shrink-0">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-dd-muted select-none">Postar sua resposta</span>
              </div>
              <button
                type="button"
                className="bg-dd-surface border border-dd-border/60 hover:bg-dd-border/30 text-dd-muted text-xs font-bold px-4 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                Responder
              </button>
            </div>
          ) : (
            <div className="relative z-10 bg-transparent border-b border-dd-border/50 p-4 sm:p-6 transition-colors duration-200">
              {/* Header row to match modal layout */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dd-border/30">
                <button
                  type="button"
                  onClick={() => {
                    setAnswerBody('');
                    setAnswerImage('');
                    setReplyAudience('everyone');
                    setScheduledAt(null);
                    setAnswerLocation('');
                    setIsSensitive(false);
                    setIsExpanded(false);
                  }}
                  className="p-1 text-dd-muted hover:text-dd-text hover:bg-dd-border/30 rounded-full transition-colors cursor-pointer"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => alert('Rascunhos salvos localmente (Mock)! ')}
                  className="text-xs font-bold text-orange-500 hover:text-orange-400 cursor-pointer"
                >
                  Rascunhos
                </button>
              </div>

              <form onSubmit={handlePostAnswer} className="flex gap-4">
                <div className="shrink-0 pt-1">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover border border-dd-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-bold border border-orange-500/10">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0 space-y-4">
                  <div className="relative">
                    <MarkdownEditor
                      ref={answerBodyEditorRef}
                      value={answerBody}
                      onChange={setAnswerBody}
                      minHeight="6rem"
                      placeholder="Escreva sua resposta... Digite / para inserir blocos"
                    />
                  </div>

                  {answerImage && (
                    <div className="relative rounded-xl overflow-hidden border border-dd-border max-h-40">
                      <img src={answerImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAnswerImage('')}
                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <PostComposerExtras
                    section="meta"
                    postBody={answerBody}
                    setPostBody={setAnswerBody}
                    editorRef={answerBodyEditorRef}
                    replyAudience={replyAudience}
                    setReplyAudience={setReplyAudience}
                    scheduledAt={scheduledAt}
                    setScheduledAt={setScheduledAt}
                    location={answerLocation}
                    setLocation={setAnswerLocation}
                    isSensitive={isSensitive}
                    setIsSensitive={setIsSensitive}
                  />

                  {/* Bottom Row Divider */}
                  <div className="border-t border-dd-border/50 pt-3 flex items-center justify-between">
                    {/* Left tools (Icons) */}
                    <div className="flex items-center gap-1.5 text-orange-500">
                      {/* Image input trigger */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="answer-image-upload"
                      />
                      <label
                        htmlFor="answer-image-upload"
                        className="p-2 hover:bg-orange-500/10 rounded-full transition-colors cursor-pointer"
                        title="Adicionar imagem"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4.5 h-4.5 fill-none stroke-current"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </label>

                      <PostComposerExtras
                        section="tools"
                        postBody={answerBody}
                        setPostBody={setAnswerBody}
                        editorRef={answerBodyEditorRef}
                        replyAudience={replyAudience}
                        setReplyAudience={setReplyAudience}
                        scheduledAt={scheduledAt}
                        setScheduledAt={setScheduledAt}
                        location={answerLocation}
                        setLocation={setAnswerLocation}
                        isSensitive={isSensitive}
                        setIsSensitive={setIsSensitive}
                      />
                    </div>

                    {/* Right submit button */}
                    <div className="flex items-center gap-3">
                      {uploadingImage && (
                        <span className="text-[10px] text-dd-muted animate-pulse font-semibold">
                          Enviando...
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={submitting || !answerBody.trim() || uploadingImage}
                        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold px-5 py-2 rounded-full transition-colors cursor-pointer shadow-md shadow-orange-500/10"
                      >
                        {submitting ? 'Postando...' : 'Postar'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Answers List Section */}
          <AnswerThread
            answers={post.answers ?? []}
            isPostAuthor={isPostAuthor}
            currentUser={{
              id: user.id,
              username: user.username,
              avatar_url: user.avatar_url,
            }}
            postId={post.id}
            onAccept={handleAcceptAnswer}
            onAnswerAdded={(parentAnswerId, newAnswer) => {
              setPost((prev: any) => {
                const roots: AnswerNode[] = prev.answers ?? [];
                const next = parentAnswerId
                  ? insertReplyIntoTree(roots, parentAnswerId, newAnswer)
                  : [...roots, newAnswer];
                return { ...prev, answers: next };
              });
            }}
          />
        </main>
      </div>

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
    </div>
  );
}
