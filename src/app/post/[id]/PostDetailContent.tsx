"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { LanguageTag } from "@/components/LanguageTag";
import { QuizWidget } from "@/components/QuizWidget";
import { AnswerCard } from "@/components/AnswerCard";
import { CodeEditor } from "@/components/CodeEditor";
import { Footer } from "@/components/Footer";
import { 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  ArrowLeft, 
  Clock, 
  Eye, 
  Plus, 
  Send,
  ArrowBigUp,
  ArrowBigDown,
  AlertTriangle,
  Flag,
  Heart,
  BarChart2
} from "lucide-react";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { RepostMenu } from "@/components/motion/RepostMenu";
import { BookmarkButton } from "@/components/motion/BookmarkButton";

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

export function PostDetailContent({ user, post: initialPost, initialIsSaved = false }: PostDetailContentProps) {
  const [post, setPost] = useState<any>(initialPost);
  const [answerBody, setAnswerBody] = useState("");
  const [answerCode, setAnswerCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastXp, setToastXp] = useState<{ amount: number; language: string } | null>(null);

  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [repostState, setRepostState] = useState({ count: post.reposts_count ?? 0, reposted: false });

  const handleBookmarkToggle = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      const res = await fetch(`/api/posts/${post.id}/bookmark`, {
        method: "POST",
      });
      if (!res.ok) {
        setIsSaved(!nextSaved);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      setIsSaved(!nextSaved);
    }
  };

  // Report post state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [showQuiz, setShowQuiz] = useState(true);

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

  const handleRepost = () => {
    setRepostState((prev) => ({
      count: prev.reposted ? Math.max(0, prev.count - 1) : prev.count + 1,
      reposted: !prev.reposted,
    }));
  };

  const handleQuotePost = () => {
    alert("Citação mockada no detalhe do post!");
  };

  const postUserVote = post.votes?.[0]?.value === 1 ? 'up' : post.votes?.[0]?.value === -1 ? 'down' : null;
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

    setPost((prev: any) => ({
      ...prev,
      upvotes: currentCount + diff,
      votes: newUserVote
        ? [{ value: newUserVote === 'up' ? 1 : -1 }]
        : []
    }));

    try {
      const res = await fetch(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar voto");
      }

      const data = await res.json();
      setPost((prev: any) => ({
        ...prev,
        upvotes: data.upvotes
      }));
    } catch (err) {
      console.error(err);
      setPost((prev: any) => ({
        ...prev,
        upvotes: currentCount,
        votes: currentVote
          ? [{ value: currentVote === 'up' ? 1 : -1 }]
          : []
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
      console.error("Error reloading post:", err);
    }
  };

  const showXPToast = (amount: number, language: string) => {
    setToastXp({ amount, language });
    setTimeout(() => {
      setToastXp(null);
    }, 4000);
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${post.id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: answerBody,
          code_snippet: answerCode || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnswerBody("");
        setAnswerCode("");
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
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        await reloadPost();

        if (data.xpResult?.xpEarned) {
          showXPToast(data.xpResult.xpEarned, data.xpResult.language);
        }
      }
    } catch (err) {
      console.error("Error accepting answer:", err);
    }
  };

  // Simulated syntax highlighter for code snippets
  const highlightCode = (code: string) => {
    if (!code) return null;
    const lines = code.split("\n");
    return (
      <pre className="font-mono text-[11px] leading-relaxed text-dd-text">
        <code>
          {lines.map((line, idx) => {
            let html = line
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            
            // Highlight keywords
            const keywords = /\b(const|let|var|function|return|fn|impl|pub|use|import|from|def|class|async|await|struct|enum|if|else|for|while|match)\b/g;
            html = html.replace(keywords, '<span class="text-orange-400 font-semibold">$1</span>');

            // Highlight types
            const types = /\b(string|number|boolean|any|void|User|Post|Language|int|float|str|char)\b/g;
            html = html.replace(types, '<span class="text-cyan-400 font-medium">$1</span>');

            // Highlight comments
            if (html.includes("//")) {
              const parts = html.split("//");
              html = parts[0] + '<span class="text-dd-muted italic">//' + parts.slice(1).join("//") + '</span>';
            } else if (html.startsWith("#") || html.includes(" #")) {
              const parts = html.split("#");
              html = parts[0] + '<span class="text-dd-muted italic">#' + parts.slice(1).join("#") + '</span>';
            }

            return (
              <div key={idx} className="table-row">
                <span className="table-cell text-right pr-4 select-none opacity-20 text-[9px] w-6">{idx + 1}</span>
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

      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col min-w-0 space-y-6">
        {/* Back Link */}
        <Link 
          href="/feed"
          className="inline-flex items-center gap-2 text-xs font-semibold text-dd-muted hover:text-dd-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Feed
        </Link>

        {/* Post Detail Card */}
        <article className="bg-dd-surface border border-dd-border rounded-xl p-6 space-y-6 backdrop-blur-sm shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dd-border/50 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-dd-surface text-dd-text flex items-center justify-center font-bold text-xs select-none">
                {post.author.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-dd-text">@{post.author.username}</p>
                <div className="flex items-center gap-3 text-[10px] text-dd-muted font-semibold mt-0.5">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Postado há pouco</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] bg-dd-surface border border-dd-border px-2 py-0.5 rounded text-dd-muted font-mono font-semibold">
                Lvl {Math.max(1, Math.floor(post.author.total_xp / 1000) + 1)}
              </span>
              <LanguageTag language={post.language} size="sm" />
            </div>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-dd-text leading-snug">{post.title}</h1>

          <p className="text-xs text-dd-text leading-relaxed whitespace-pre-wrap">{post.body}</p>

          {post.code_snippet && (
            <div className="rounded-lg border border-dd-border bg-dd-bg p-4 overflow-x-auto shadow-inner">
              {highlightCode(post.code_snippet)}
            </div>
          )}

          {/* Post bottom actions section */}
          <div className="flex items-center justify-between pt-3 border-t border-dd-border text-xs font-sans">
            <div className="flex items-center gap-4">
              {/* Comment Bubble */}
              <div className="flex items-center gap-1.5 text-dd-muted select-none">
                <MessageSquare className="w-3.5 h-3.5 text-dd-muted" />
                <span>{post.answers?.length || 0}</span>
              </div>

              {/* Like/Heart button */}
              <button
                onClick={() => handlePostVote('up')}
                className="flex items-center gap-1 text-dd-muted hover:text-orange-500 transition-colors"
                title="Curtir post"
              >
                <Heart className={`w-4 h-4 transition-colors ${postUserVote === "up" ? "fill-orange-500 text-orange-500" : "text-dd-muted"}`} />
                <AnimatedCounter
                  value={postVotesCount}
                  className="px-1 font-semibold text-[10px] text-dd-text"
                />
              </button>

              {/* Repost Menu */}
              <RepostMenu
                count={repostState.count}
                isReposted={repostState.reposted}
                onRepost={handleRepost}
                onQuote={handleQuotePost}
              />

              {/* Views BarChart */}
              <div className="flex items-center gap-1.5 text-dd-muted select-none">
                <BarChart2 className="w-4 h-4 text-dd-muted" />
                <span className="text-[10px] font-semibold text-dd-text">
                  {post.view_count >= 1000 ? `${(post.view_count / 1000).toFixed(0)}mil` : post.view_count}
                </span>
              </div>

              {/* Report button */}
              <button
                onClick={() => setReportModalOpen(true)}
                className="p-1 rounded-md text-dd-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer flex items-center justify-center"
                title="Denunciar postagem"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>

            <BookmarkButton
              isSaved={isSaved}
              onToggle={handleBookmarkToggle}
            />
          </div>
        </article>

        {/* Resolver como Quiz button outside/below the post box */}
        {post.quizzes && post.quizzes.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-start">
              <button
                onClick={() => setShowQuiz(!showQuiz)}
                className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-1.5 font-bold text-white transition-colors hover:bg-orange-600 shadow-sm cursor-pointer text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{showQuiz ? "Ocultar Quiz" : "Resolver como Quiz"}</span>
              </button>
            </div>

            {showQuiz && (
              <div className="bg-dd-surface border border-dd-border rounded-xl p-5 backdrop-blur-sm shadow-sm">
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

        {/* Answers List Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4.5 h-4.5 text-orange-500/85" />
            <h2 className="text-sm font-extrabold text-dd-text">
              Respostas ({post.answers?.length || 0})
            </h2>
          </div>

          {post.answers?.length === 0 ? (
            <div className="rounded-xl border border-dd-border bg-dd-surface/10 p-8 text-center text-dd-muted text-xs">
              Nenhuma resposta publicada ainda. Seja o primeiro a ajudar o autor!
            </div>
          ) : (
            <div className="space-y-4">
              {post.answers.map((answer: any) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  isPostAuthor={isPostAuthor}
                  onAccept={handleAcceptAnswer}
                />
              ))}
            </div>
          )}
        </div>

        {/* Write Answer Form */}
        <div className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-dd-text">Escreva sua resposta</h2>
          <form onSubmit={handlePostAnswer} className="space-y-4">
            <div>
              <textarea
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                required
                rows={4}
                placeholder="Explique sua solução de forma clara para ajudar o autor e acumular XP..."
                className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg/80 px-4 py-2.5 text-dd-text placeholder-slate-650 focus:border-orange-500/60 focus:outline-none resize-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-dd-muted uppercase tracking-wider">
                Código de Suporte (opcional)
              </label>
              <CodeEditor
                value={answerCode}
                onChange={setAnswerCode}
                language={post.language}
                height="180px"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-900">
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors hover:bg-orange-600 disabled:opacity-50 cursor-pointer shadow-md shadow-orange-500/10 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? "Enviando..." : "Enviar Resposta (+15 XP)"}
              </button>
            </div>
          </form>
        </div>
        </main>
        <Footer />
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
    </div>
  );
}
