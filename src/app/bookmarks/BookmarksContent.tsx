"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { LanguageTag } from "@/components/LanguageTag";
import { BookmarkButton } from "@/components/motion/BookmarkButton";
import { RepostMenu } from "@/components/motion/RepostMenu";
import { ExpandedReactionButton } from "@/components/motion/ExpandedReactions";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { EmptyState } from "@/components/motion/EmptyState";
import { cn } from "@/lib/cn";
import { springGentle } from "@/lib/motion";
import { 
  ArrowLeft, 
  Search, 
  MessageSquare, 
  Flag, 
  Sparkles, 
  ArrowBigDown, 
  Bookmark,
  ChevronRight,
  Heart,
  BarChart2
} from "lucide-react";

interface BookmarksContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
  };
  initialPosts: any[];
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

function getLevelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 1000) + 1);
}

function highlightMatches(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark key={`${part}-${index}`} className="bg-orange-500/30 text-inherit rounded px-0.5">
          {part}
        </mark>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export function BookmarksContent({ user, initialPosts }: BookmarksContentProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estados para suportar interação de votos, reposts e reações no feed de bookmarks
  const [votes, setVotes] = useState<Record<string, { up: number; userVote: "up" | "down" | null }>>(() => {
    const initialVotes: Record<string, { up: number; userVote: "up" | "down" | null }> = {};
    initialPosts.forEach((post) => {
      const userVoteRecord = post.votes?.[0];
      initialVotes[post.id] = {
        up: post.upvotes ?? 0,
        userVote: userVoteRecord ? (userVoteRecord.value === 1 ? "up" : "down") : null,
      };
    });
    return initialVotes;
  });

  const [repostState, setRepostState] = useState<Record<string, { count: number; reposted: boolean }>>(() => {
    const initialReposts: Record<string, { count: number; reposted: boolean }> = {};
    initialPosts.forEach((post) => {
      initialReposts[post.id] = {
        count: post.reposts_count ?? 0,
        reposted: false,
      };
    });
    return initialReposts;
  });

  const [activeReactions, setActiveReactions] = useState<Record<string, string | null>>({});

  // Filtrar posts salvos com base na pesquisa
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query) ||
      post.author.username.toLowerCase().includes(query) ||
      (post.language && post.language.toLowerCase().includes(query))
    );
  });

  // Toggle salvar/remover bookmark com animação de saída (fade/exit)
  const handleBookmarkToggle = async (postId: string) => {
    // Remove do feed local imediatamente com saída suave
    setPosts((prev) => prev.filter((p) => p.id !== postId));

    try {
      await fetch(`/api/posts/${postId}/bookmark`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
      // Caso dê erro, re-adicionar o post
      const originalPost = initialPosts.find((p) => p.id === postId);
      if (originalPost) {
        setPosts((prev) => [originalPost, ...prev].sort((a, b) => b.id.localeCompare(a.id)));
      }
    }
  };

  const handleVote = async (postId: string, type: "up" | "down") => {
    const current = votes[postId] || { up: 0, userVote: null };
    let newValue: number;
    let newVoteType: "up" | "down" | null;

    if (current.userVote === type) {
      newValue = 0; // Cancelar voto
      newVoteType = null;
    } else {
      newValue = type === "up" ? 1 : -1;
      newVoteType = type;
    }

    // Calcular nova contagem de upvotes locais
    let diff = 0;
    if (current.userVote === "up") diff -= 1;
    if (current.userVote === "down") diff += 1;
    if (newVoteType === "up") diff += 1;
    if (newVoteType === "down") diff -= 1;

    setVotes((prev) => ({
      ...prev,
      [postId]: {
        up: Math.max(0, current.up + diff),
        userVote: newVoteType,
      },
    }));

    try {
      await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
      });
    } catch (err) {
      console.error("Failed to submit vote:", err);
    }
  };

  const handleReactionSelect = (postId: string, reaction: string | null) => {
    const currentVote = votes[postId] || { up: 0, userVote: null };
    const hasUpvote = currentVote.userVote === "up";

    if (!hasUpvote) {
      setActiveReactions((prev) => ({ ...prev, [postId]: reaction ?? null }));
      handleVote(postId, "up");
      return;
    }

    if (reaction) {
      setActiveReactions((prev) => ({ ...prev, [postId]: reaction }));
      return;
    }

    setActiveReactions((prev) => ({ ...prev, [postId]: null }));
    handleVote(postId, "up");
  };

  const handleRepost = (postId: string) => {
    setRepostState((prev) => {
      const current = prev[postId] ?? { count: 0, reposted: false };
      return {
        ...prev,
        [postId]: {
          count: current.reposted ? Math.max(0, current.count - 1) : current.count + 1,
          reposted: !current.reposted,
        },
      };
    });
  };

  const handleQuotePost = (post: any) => {
    router.push(`/feed?quote=${post.id}`);
  };

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
            
            const keywords = /\b(const|let|var|function|return|fn|impl|pub|use|import|from|def|class|async|await|struct|enum|if|else|for|while|match)\b/g;
            html = html.replace(keywords, '<span class="text-orange-400 font-semibold">$1</span>');

            const types = /\b(string|number|boolean|any|void|User|Post|Language|int|float|str|char)\b/g;
            html = html.replace(types, '<span class="text-cyan-400 font-medium">$1</span>');

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow max-w-2xl w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col min-w-0 space-y-6">
          
          {/* Header (Twitter style: Back arrow + Title + count) */}
          <div className="flex items-center gap-4 border-b border-dd-border/50 pb-4">
            <button
              onClick={() => router.back()}
              className="p-2 border border-dd-border bg-dd-surface hover:bg-dd-border/50 text-dd-muted hover:text-dd-text rounded-xl transition-all cursor-pointer"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-dd-text text-lg font-extrabold tracking-tight flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-orange-500 fill-orange-500/10" />
                Itens salvos
              </h1>
              <p className="text-dd-muted text-[10px] uppercase font-bold tracking-wider">
                {posts.length} {posts.length === 1 ? "publicação salva" : "publicações salvas"}
              </p>
            </div>
          </div>

          {/* Search bar (Twitter style) */}
          <div className="relative w-full">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dd-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar Itens salvos"
              className="w-full pl-11 pr-4 py-2.5 bg-dd-surface/40 hover:bg-dd-surface/60 focus:bg-dd-surface/80 border border-dd-border/60 focus:border-orange-500/50 rounded-full text-xs text-dd-text placeholder-dd-muted outline-0 transition-all shadow-inner"
            />
          </div>

          {/* Saved Posts Feed (exit/entrance animations) */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 px-6 bg-dd-surface/20 border border-dd-border border-dashed rounded-2xl space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-dd-text">
                    {searchQuery.trim() ? "Nenhum resultado encontrado" : "Salvar publicações para depois"}
                  </h3>
                  <p className="text-[11px] text-dd-muted leading-relaxed">
                    {searchQuery.trim()
                      ? "Experimente buscar por outros termos de título, tags ou conteúdo."
                      : "Não deixe posts interessantes passarem! Salve-os em sua barra de ações para ler ou estudar com calma mais tarde."}
                  </p>
                </div>
              </div>
            ) : (
              <LayoutGroup>
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post) => {
                    const vote = votes[post.id] || { up: post.upvotes ?? 0, userVote: null };
                    const repostMeta = repostState[post.id] ?? { count: post.reposts_count ?? 0, reposted: false };
                    
                    return (
                      <div key={post.id} className="space-y-2.5">
                        <motion.article
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, x: -30, transition: { duration: 0.2 } }}
                          transition={springGentle}
                          className="dd-card-hover rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm space-y-4 transition-[border-color] duration-300"
                        >
                          {/* Author info header */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dd-border/50 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-dd-surface text-dd-text flex items-center justify-center font-bold text-xs select-none">
                                {post.author.username.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <Link href={`/profile/${post.author.username}`} className="text-xs font-bold text-dd-text hover:text-orange-400 transition-colors">
                                    @{post.author.username}
                                  </Link>
                                  <span className="text-[9px] bg-dd-surface border border-dd-border px-1 py-0.5 rounded text-dd-muted font-mono font-semibold">
                                    Lvl {getLevelFromXp(post.author.total_xp)}
                                  </span>
                                </div>
                                <span className="text-[10px] text-dd-muted font-medium">
                                  Postado ha pouco
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.preventDefault()}>
                              {post.language && <LanguageTag language={post.language} size="sm" />}
                            </div>
                          </div>

                          {/* Title, Body, Code */}
                          <div className="space-y-3">
                            <Link href={`/post/${post.id}`} className="block">
                              <h2 className="text-sm font-bold text-dd-text hover:text-orange-400 transition-colors leading-snug">
                                {highlightMatches(post.title, searchQuery)}
                              </h2>
                            </Link>
                            <p className="text-xs text-dd-muted leading-relaxed">
                              {searchQuery.trim() ? highlightMatches(post.body, searchQuery) : parseMentions(post.body)}
                            </p>

                            {post.image_url && (
                              <div className="relative rounded-xl overflow-hidden border border-dd-border max-h-80 bg-dd-surface/20">
                                <img
                                  src={post.image_url}
                                  alt={post.title}
                                  className="w-full h-full object-cover max-h-80"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              </div>
                            )}

                            {post.code_snippet && (
                              <div className="rounded-lg border border-dd-border bg-dd-bg p-4 overflow-x-auto max-h-60 shadow-inner">
                                {highlightCode(post.code_snippet)}
                              </div>
                            )}
                          </div>

                          {/* Actions section */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dd-border pt-3 text-xs">
                            <div className="flex items-center gap-4" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                              {/* 1. Comment bubble */}
                              <Link
                                href={`/post/${post.id}`}
                                className="flex items-center gap-1.5 text-dd-muted hover:text-dd-text transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-dd-muted" />
                                <span>{post._count?.answers || 0}</span>
                              </Link>

                              {/* 2. Heart/Like button */}
                              <button
                                onClick={() => handleVote(post.id, "up")}
                                className="flex items-center gap-1 text-dd-muted hover:text-orange-500 transition-colors"
                                title="Curtir post"
                              >
                                <Heart className={cn("w-4 h-4 transition-colors", vote.userVote === "up" ? "fill-orange-500 text-orange-500" : "text-dd-muted")} />
                                <AnimatedCounter
                                  value={vote.up}
                                  className="px-1 font-semibold text-[10px] text-dd-text"
                                />
                              </button>

                              {/* 3. Repost Menu */}
                              <RepostMenu
                                count={repostMeta.count}
                                isReposted={repostMeta.reposted}
                                  onRepost={() => handleRepost(post.id)}
                                onQuote={() => handleQuotePost(post)}
                              />

                              {/* 4. Views BarChart */}
                              <div className="flex items-center gap-1.5 text-dd-muted select-none">
                                <BarChart2 className="w-4 h-4 text-dd-muted" />
                                <span className="text-[10px] font-semibold text-dd-text">{post.view_count >= 1000 ? `${(post.view_count / 1000).toFixed(0)}mil` : post.view_count}</span>
                              </div>

                              {/* 5. Report button */}
                              <button
                                onClick={() => alert("Denúncia enviada.")}
                                className="p-1 rounded-md text-dd-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer flex items-center justify-center"
                                title="Denunciar postagem"
                              >
                                <Flag className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Saved is true by default since they are on the Bookmarks page */}
                            <BookmarkButton
                              isSaved={true}
                              onToggle={() => handleBookmarkToggle(post.id)}
                            />
                          </div>
                        </motion.article>

                        {/* Resolver como Quiz outside/below the post box */}
                        {post.quizzes && post.quizzes.length > 0 && (
                          <div className="flex justify-start pl-1">
                            <Link
                              href={`/post/${post.id}`}
                              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-1.5 font-bold text-white transition-colors hover:bg-orange-600 shadow-sm cursor-pointer text-xs"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Resolver como Quiz</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </AnimatePresence>
              </LayoutGroup>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
