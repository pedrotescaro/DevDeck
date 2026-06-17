"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { QuizWidget } from "@/components/QuizWidget";
import { DuelCard } from "@/components/DuelCard";
import { LanguageTag } from "@/components/LanguageTag";
import { Footer } from "@/components/Footer";
import { BadgeEmblem } from "@/components/BadgeGrid";
import { PostComposerExtras } from "@/components/PostComposerExtras";
import { appendPostExtras, ReplyAudience, resetPostComposerExtras } from "@/lib/post-composer";
import { PostSkeletonList } from "@/components/motion/PostSkeleton";
import { NewPostsPill } from "@/components/motion/NewPostsPill";
import { PublishButton, PublishState } from "@/components/motion/PublishButton";
import { XPProgressBar } from "@/components/motion/XPProgressBar";
import { CharCounter } from "@/components/motion/CharCounter";
import { MentionDropdown } from "@/components/motion/MentionDropdown";
import { ExpandedReactionButton } from "@/components/motion/ExpandedReactions";
import { BookmarkButton } from "@/components/motion/BookmarkButton";
import { RepostMenu } from "@/components/motion/RepostMenu";
import { EmptyState } from "@/components/motion/EmptyState";
import { LevelUpOverlay } from "@/components/motion/LevelUpOverlay";
import { TabSwitcher } from "@/components/motion/TabSwitcher";
import { POST_CHAR_LIMIT, crossfadeVariants, springGentle } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSearchWithDebounce } from "@/hooks/useSearchWithDebounce";
import { Language } from "@prisma/client";
import { 
  Flame, 
  Award, 
  Swords, 
  MessageSquare, 
  Trophy, 
  ChevronRight, 
  ArrowBigDown, 
  AlertTriangle, 
  Code, 
  Plus, 
  Sparkles,
  BookOpen,
  Calendar,
  TrendingUp,
  X,
  Search
} from "lucide-react";

interface LanguageTrail {
  id: string;
  user_id: string;
  language: Language;
  xp: number;
  level: number;
  streak: number;
}

interface Badge {
  id: string;
  slug: string;
  label: string;
  description: string;
  icon: string;
  color: string;
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
        <mark key={`${part}-${index}`} className="dd-search-highlight text-inherit">
          {part}
        </mark>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

interface FeedContentProps {
  initialUser: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
    streak?: number;
    trails: LanguageTrail[];
    badges: Badge[];
  };
  initialPosts: any[];
  initialDuels: any[];
}

export function FeedContent({ initialUser, initialPosts, initialDuels }: FeedContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"feed" | "quizzes" | "duels" | "ranking">("feed");
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [duels, setDuels] = useState<any[]>(initialDuels);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardLanguage, setLeaderboardLanguage] = useState<string>("GLOBAL");
  
  // Post Form state
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postLanguage, setPostLanguage] = useState<string>("TS");
  const [postCode, setPostCode] = useState("");
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [composeFocused, setComposeFocused] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const FEED_PAGE_SIZE = 10;
  const [postType, setPostType] = useState<'question' | 'discussion'>('question');
  const [postImage, setPostImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quotePost, setQuotePost] = useState<any | null>(null);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Record<string, boolean>>({});
  const [repostState, setRepostState] = useState<Record<string, { count: number; reposted: boolean }>>({});
  const [activeReactions, setActiveReactions] = useState<Record<string, string | null>>({});
  const [currentXp, setCurrentXp] = useState(initialUser.total_xp);
  const [currentLevel, setCurrentLevel] = useState(getLevelFromXp(initialUser.total_xp));
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [firstPostToastVisible, setFirstPostToastVisible] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  // Daily Quiz state
  const [dailyQuiz, setDailyQuiz] = useState<any>(null);
  const [dailyAttempt, setDailyAttempt] = useState<any>(null);

  // Mention Suggestions state
  const [mentionUsers, setMentionUsers] = useState<any[]>([]);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'inline' | 'modal' | null>(null);
  const postBodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [replyAudience, setReplyAudience] = useState<ReplyAudience>("everyone");
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [postLocation, setPostLocation] = useState("");
  const [isSensitive, setIsSensitive] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setLoadingSearch(false);
      setFeedError(null);
      return;
    }
    setLoadingSearch(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(searchQuery)}&limit=${FEED_PAGE_SIZE}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
          setHasMore(false);
          setFeedError(null);
        }
      } catch (err) {
        console.error("Search posts error:", err);
        setFeedError("Nao foi possivel atualizar a busca agora.");
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore || searchQuery.trim()) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/posts?page=${nextPage}&limit=${FEED_PAGE_SIZE}`);
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const fresh = data.filter((p: { id: string }) => !ids.has(p.id));
          return [...prev, ...fresh];
        });
        setPage(nextPage);
        setHasMore(data.length >= FEED_PAGE_SIZE);
      }
    } catch (err) {
      console.error("Load more posts error:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, searchQuery, page]);

  const scrollSentinelRef = useInfiniteScroll({
    onLoadMore: loadMorePosts,
    hasMore: hasMore && !searchQuery.trim(),
    loading: loadingMore,
  });

  useEffect(() => {
    if (activeTab !== "feed" || searchQuery.trim()) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/posts?limit=5`);
        if (!res.ok) return;
        const latest: { id: string; created_at: string }[] = await res.json();
        const topPost = posts.find((p) => !p._pending && !String(p.id).startsWith("temp-"));
        if (!topPost || latest.length === 0) return;
        const topTime = new Date(topPost.created_at).getTime();
        const newer = latest.filter(
          (p) => new Date(p.created_at).getTime() > topTime && p.id !== topPost.id
        );
        setNewPostsCount(newer.length);
      } catch {
        /* silent */
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [posts, activeTab, searchQuery]);

  const handleLoadNewPosts = async () => {
    try {
      const res = await fetch(`/api/posts?limit=10`);
      if (!res.ok) return;
      const latest = await res.json();
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const fresh = latest.filter((p: { id: string }) => !ids.has(p.id));
        return [...fresh, ...prev];
      });
      setNewPostsCount(0);
    } catch (err) {
      console.error("Load new posts error:", err);
    }
  };

  useEffect(() => {
    const fetchDailyQuiz = async () => {
      try {
        const res = await fetch("/api/quiz/daily");
        if (res.ok) {
          const data = await res.json();
          setDailyQuiz(data.quiz);
          setDailyAttempt(data.attempt);
        }
      } catch (err) {
        console.error("Error loading daily quiz:", err);
      }
    };
    fetchDailyQuiz();
  }, []);

  const handleBodyChange = async (val: string, inputType: 'inline' | 'modal') => {
    setPostBody(val);
    const words = val.split(/\s+/);
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith("@") && lastWord.length >= 1) {
      const q = lastWord.slice(1);
      try {
        const res = await fetch(`/api/users/search?q=${q}`);
        if (res.ok) {
          const data = await res.json();
          setMentionUsers(data);
          setShowMentionSuggestions(true);
          setFocusedInput(inputType);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowMentionSuggestions(false);
      setMentionUsers([]);
    }
  };

  const handleSelectMention = (username: string) => {
    const words = postBody.split(/\s+/);
    words[words.length - 1] = `@${username} `;
    setPostBody(words.join(" "));
    setShowMentionSuggestions(false);
    setMentionUsers([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setPostImage(data.url);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Duel Form state
  const [duelTitle, setDuelTitle] = useState("");
  const [duelBody, setDuelBody] = useState("");
  const [duelLanguage, setDuelLanguage] = useState<Language>("TS");
  const [creatingDuel, setCreatingDuel] = useState(false);
  const [showDuelForm, setShowDuelForm] = useState(false);

  // XP Toast state
  const [toastXp, setToastXp] = useState<{ amount: number; language: string } | null>(null);

  // Thumbs state for posts
  const [votes, setVotes] = useState<Record<string, { up: number; userVote: 'up' | 'down' | null }>>(() => {
    const initialVotes: Record<string, { up: number; userVote: 'up' | 'down' | null }> = {};
    initialPosts.forEach((post) => {
      const userPostVote = post.votes?.[0];
      let userVote: 'up' | 'down' | null = null;
      if (userPostVote) {
        userVote = userPostVote.value === 1 ? 'up' : userPostVote.value === -1 ? 'down' : null;
      }
      initialVotes[post.id] = {
        up: post.upvotes,
        userVote,
      };
    });
    return initialVotes;
  });

  useEffect(() => {
    const newVotes = { ...votes };
    let changed = false;
    posts.forEach((post) => {
      const userPostVote = post.votes?.[0];
      let userVote: 'up' | 'down' | null = null;
      if (userPostVote) {
        userVote = userPostVote.value === 1 ? 'up' : userPostVote.value === -1 ? 'down' : null;
      }
      if (!votes[post.id] || votes[post.id].up !== post.upvotes || votes[post.id].userVote !== userVote) {
        newVotes[post.id] = {
          up: post.upvotes,
          userVote,
        };
        changed = true;
      }
    });
    if (changed) {
      setVotes(newVotes);
    }
  }, [posts]);

  // Helper to format language name
  const formatLangName = (lang: string) => {
    const map: Record<string, string> = {
      TS: "TypeScript",
      JS: "JavaScript",
      PYTHON: "Python",
      RUST: "Rust",
      GO: "Go",
      CPP: "C++",
      JAVA: "Java",
      KOTLIN: "Kotlin",
      SWIFT: "Swift",
    };
    return map[lang] || lang;
  };

  // Helper to get language specific progress bar color
  const getLangColor = (lang: string) => {
    const map: Record<string, string> = {
      TS: "bg-blue-500",
      JS: "bg-amber-500",
      PYTHON: "bg-emerald-500",
      RUST: "bg-orange-500",
      GO: "bg-cyan-500",
      CPP: "bg-blue-600",
      JAVA: "bg-red-500",
      KOTLIN: "bg-purple-500",
      SWIFT: "bg-orange-600",
    };
    return map[lang] || "bg-slate-500";
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

  // Fetch posts helper
  const refreshPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch duels helper
  const refreshDuels = async () => {
    try {
      const res = await fetch("/api/duels");
      if (res.ok) {
        const data = await res.json();
        setDuels(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch leaderboard ranking
  const fetchRankings = async (lang: string) => {
    try {
      const url = lang === "GLOBAL" ? "/api/leaderboard" : `/api/leaderboard?language=${lang}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "ranking") {
      fetchRankings(leaderboardLanguage);
    }
  }, [activeTab, leaderboardLanguage]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postBody.trim()) return;

    setPublishState("submitting");
    setPostError(null);

    const isFirstPost = initialPosts.length === 0;
    const titleToSubmit = postTitle.trim() || (postBody.trim().substring(0, 40) || "Discussao Geral");
    const tempId = `temp-${Date.now()}`;
    const optimisticPost = {
      id: tempId,
      title: titleToSubmit,
      body: postBody,
      language: postType === "question" ? postLanguage : postLanguage === "" ? null : postLanguage,
      code_snippet: postType === "question" ? postCode || null : null,
      image_url: postType === "discussion" ? postImage || null : null,
      created_at: new Date().toISOString(),
      view_count: 0,
      upvotes: 0,
      author: {
        username: initialUser.username,
        avatar_url: initialUser.avatar_url,
        total_xp: initialUser.total_xp,
      },
      _count: { answers: 0 },
      _pending: true,
      votes: [],
      quoted_post: quotePost,
    };

    setPosts((prev) => [optimisticPost, ...prev]);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleToSubmit,
          body: appendPostExtras(postBody, {
            location: postLocation,
            scheduledAt,
            replyAudience,
            isSensitive,
          }),
          language: postType === "question" ? postLanguage : postLanguage === "" ? null : postLanguage,
          code_snippet: postType === "question" ? postCode || null : null,
          image_url: postType === "discussion" ? postImage || null : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === tempId
              ? {
                  ...data.post,
                  created_at: data.post.created_at || new Date().toISOString(),
                  author: optimisticPost.author,
                  _count: { answers: 0 },
                  upvotes: 0,
                  view_count: 0,
                  votes: [],
                  quoted_post: quotePost,
                  _pending: false,
                }
              : p
          )
        );
        setPostTitle("");
        setPostBody("");
        setPostCode("");
        setPostImage("");
        setPostType("question");
        setQuotePost(null);
        setComposeFocused(false);
        const resetExtras = resetPostComposerExtras();
        setReplyAudience(resetExtras.replyAudience);
        setScheduledAt(resetExtras.scheduledAt);
        setPostLocation(resetExtras.location);
        setIsSensitive(resetExtras.isSensitive);
        setPublishState("success");
        setTimeout(() => setPublishState("idle"), 1500);

        if (data.xpResult?.xpEarned) {
          showXPToast(data.xpResult.xpEarned, data.xpResult.language);
        }
        if (isFirstPost) {
          setFirstPostToastVisible(true);
          showXPToast(50, "Primeira postagem");
          setTimeout(() => setFirstPostToastVisible(false), 3000);
        }
      } else {
        throw new Error("Erro ao postar");
      }
    } catch (err) {
      console.error(err);
      setPosts((prev) => prev.filter((p) => p.id !== tempId));
      setPostError("Algo deu errado. Seu rascunho foi salvo automaticamente.");
      setPublishState("idle");
      // Auto-dismiss error after 4s
      setTimeout(() => setPostError(null), 4000);
    }
  };

  const handleCreateDuel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingDuel(true);

    try {
      const res = await fetch("/api/duels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_title: duelTitle,
          problem_body: duelBody,
          language: duelLanguage,
        }),
      });

      if (res.ok) {
        setDuelTitle("");
        setDuelBody("");
        setShowDuelForm(false);
        await refreshDuels();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingDuel(false);
    }
  };

  const showXPToast = (amount: number, language: string) => {
    setToastXp({ amount, language });
    setCurrentXp((prevXp) => prevXp + amount);
    setTimeout(() => {
      setToastXp(null);
    }, 4000);
  };

  useEffect(() => {
    const nextLevel = getLevelFromXp(currentXp);
    if (nextLevel > currentLevel) {
      setCurrentLevel(nextLevel);
      setLevelUpVisible(true);
    } else if (nextLevel !== currentLevel) {
      setCurrentLevel(nextLevel);
    }
  }, [currentXp, currentLevel]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFeedError(null);
    }
  }, [searchQuery]);

  const filteredCommunityQuizPosts = useMemo(
    () => posts.filter((post) => post.quizzes && post.quizzes.length > 0),
    [posts]
  );

  const handleReactionSelect = async (postId: string, reaction?: string | null) => {
    const hasUpvote = votes[postId]?.userVote === "up";

    if (!hasUpvote) {
      setActiveReactions((prev) => ({ ...prev, [postId]: reaction ?? null }));
      await handleVote(postId, "up");
      return;
    }

    if (reaction) {
      setActiveReactions((prev) => ({ ...prev, [postId]: reaction }));
      return;
    }

    setActiveReactions((prev) => ({ ...prev, [postId]: null }));
    await handleVote(postId, "up");
  };

  const handleBookmarkToggle = (postId: string) => {
    setBookmarkedPostIds((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleRepost = (post: any) => {
    setRepostState((prev) => {
      const current = prev[post.id] ?? { count: post.reposts_count ?? 0, reposted: false };
      return {
        ...prev,
        [post.id]: {
          count: current.reposted ? Math.max(0, current.count - 1) : current.count + 1,
          reposted: !current.reposted,
        },
      };
    });
  };

  const handleQuotePost = (post: any) => {
    setQuotePost(post);
    setComposeFocused(true);
    setActiveTab("feed");
    requestAnimationFrame(() => {
      postBodyTextareaRef.current?.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // Upvote/Downvote handling with API
  const handleVote = async (postId: string, type: 'up' | 'down') => {
    const current = votes[postId] || { up: 0, userVote: null };
    let newValue = 0;
    
    if (type === 'up') {
      newValue = current.userVote === 'up' ? 0 : 1;
    } else {
      newValue = current.userVote === 'down' ? 0 : -1;
    }

    if (newValue === -1) {
      const justification = prompt("No DevDeck, o downvote exige uma justificativa construtiva. Escreva seu motivo para o autor melhorar:");
      if (!justification || justification.trim().length <= 3) {
        alert("O downvote foi cancelado. É necessária uma justificativa construtiva de pelo menos 4 caracteres.");
        return;
      }
    }

    // Optimistic UI update
    let diff = 0;
    let newUserVote: 'up' | 'down' | null = null;
    if (type === 'up') {
      if (current.userVote === 'up') {
        diff = -1;
        newUserVote = null;
      } else if (current.userVote === 'down') {
        diff = 2;
        newUserVote = 'up';
      } else {
        diff = 1;
        newUserVote = 'up';
      }
    } else {
      if (current.userVote === 'down') {
        diff = 1;
        newUserVote = null;
      } else if (current.userVote === 'up') {
        diff = -2;
        newUserVote = 'down';
      } else {
        diff = -1;
        newUserVote = 'down';
      }
    }

    setVotes(prev => ({
      ...prev,
      [postId]: {
        up: current.up + diff,
        userVote: newUserVote
      }
    }));

    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue })
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar voto");
      }

      const data = await res.json();
      setVotes(prev => ({
        ...prev,
        [postId]: {
          up: data.upvotes,
          userVote: newUserVote
        }
      }));
    } catch (err) {
      console.error(err);
      setVotes(prev => ({
        ...prev,
        [postId]: current
      }));
    }
  };

  const getTrendingPosts = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    let filtered = posts.filter(post => new Date(post.created_at) >= sevenDaysAgo);
    if (filtered.length === 0) {
      filtered = posts;
    }

    return filtered
      .map(post => {
        const score = (post.view_count * 1) + ((post._count?.answers || 0) * 5) + (post.upvotes * 2);
        return { ...post, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const trendingPosts = getTrendingPosts();

  const activeDuels = duels.filter(d => d.status === "ACTIVE").slice(0, 2);

  const charRatio = postBody.length / POST_CHAR_LIMIT;
  const xpReward = postType === "question" ? 10 : 5;
  const currentLevelBaseXp = (currentLevel - 1) * 1000;
  const currentLevelPercent = Math.min(100, Math.max(0, ((currentXp - currentLevelBaseXp) / 1000) * 100));

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased selection:bg-orange-500/35 selection:text-white">
      <LevelUpOverlay
        visible={levelUpVisible}
        level={currentLevel}
        onDone={() => setLevelUpVisible(false)}
      />
      <NewPostsPill
        count={newPostsCount}
        onClick={handleLoadNewPosts}
        visible={activeTab === "feed" && !searchQuery.trim()}
      />
      {/* XP Toast Notification */}
      {toastXp && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in-right rounded-xl border border-emerald-500/30 bg-dd-surface/90 backdrop-blur-xl p-4 shadow-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-base ring-1 ring-emerald-500/30">
            +{toastXp.amount}
          </div>
          <div>
            <p className="font-bold text-sm text-dd-text">XP Concedido!</p>
            <p className="text-xs text-dd-muted">Voce progrediu na trilha de {toastXp.language}</p>
          </div>
        </div>
      )}
      {firstPostToastVisible && (
        <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-full bg-dd-accent px-4 py-2 text-xs font-black text-white shadow-xl shadow-orange-500/25 dd-soft-bounce">
          +50 XP - Primeira postagem! Bem-vindo ao DevDeck.
        </div>
      )}

      <Sidebar user={initialUser} />

      <div className="flex-grow flex flex-col min-w-0">
        <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col min-w-0">
        {/* Main Grid Layout - 2 Columns on desktop (8 + 4) instead of 3, collapses on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ========================================================================= */}
          {/* COLUNA CENTRAL: O Feed Principal e PostCard */}
          {/* ========================================================================= */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Seletor de Abas Feed / Quizzes */}
            <div className="flex border-b border-dd-border select-none">
              <button
                onClick={() => setActiveTab("feed")}
                className={`relative flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "feed"
                    ? "text-dd-text"
                    : "text-dd-muted hover:text-dd-text hover:bg-dd-surface/30"
                }`}
              >
                Duvidas & Discussoes
                {activeTab === "feed" && (
                  <motion.div
                    layoutId="feedTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("quizzes")}
                className={`relative flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "quizzes"
                    ? "text-dd-text"
                    : "text-dd-muted hover:text-dd-text hover:bg-dd-surface/30"
                }`}
              >
                Quiz Diario & Community Quizzes
                {activeTab === "quizzes" && (
                  <motion.div
                    layoutId="feedTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </div>

             {/* Feed Tab View */}
            {activeTab === "feed" && (
              <>
                <motion.div
                  layout
                  className="relative z-30 rounded-2xl border border-dd-border bg-dd-surface p-5 shadow-sm transition-[border-color,box-shadow] duration-200 focus-within:border-orange-500/40 focus-within:shadow-md focus-within:shadow-orange-500/5"
                >
                  <form onSubmit={handleCreatePost} className="flex gap-4">
                    <div className="shrink-0 pt-1">
                      {initialUser.avatar_url ? (
                        <img
                          src={initialUser.avatar_url}
                          alt={initialUser.username}
                          className="w-10 h-10 rounded-full object-cover border border-dd-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-bold border border-orange-500/10">
                          {initialUser.username.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-4">
                      <motion.div
                        className="relative"
                        animate={composeFocused ? { scale: 1 } : { scale: 1 }}
                        transition={springGentle}
                      >
                        <textarea
                          ref={postBodyTextareaRef}
                          value={postBody}
                          onChange={(e) => handleBodyChange(e.target.value, "inline")}
                          onFocus={() => setComposeFocused(true)}
                          onBlur={() => {
                            if (!postBody.trim() && !quotePost) {
                              setComposeFocused(false);
                            }
                          }}
                          required
                          rows={composeFocused ? 5 : 2}
                          maxLength={POST_CHAR_LIMIT}
                          placeholder={
                            postType === "question"
                              ? "Qual a sua duvida tecnica? Compartilhe o contexto e o codigo abaixo..."
                              : "O que esta acontecendo? Compartilhe ideias, artigos ou links..."
                          }
                          className="w-full resize-none rounded-md bg-transparent text-sm text-dd-text placeholder-dd-muted focus:outline-none dd-focus-ring"
                        />
                        <div className="absolute bottom-0 right-0">
                          <CharCounter text={postBody} limit={POST_CHAR_LIMIT} />
                        </div>
                        <MentionDropdown
                          query={postBody.split(/\s+/).at(-1)?.replace(/^@/, "") || ""}
                          visible={showMentionSuggestions && focusedInput === "inline"}
                          onSelect={handleSelectMention}
                          onClose={() => {
                            setShowMentionSuggestions(false);
                            setMentionUsers([]);
                          }}
                        />
                      </motion.div>

                      {quotePost && (
                        <div className="dd-quote-card rounded-2xl border border-dd-border bg-dd-bg/60 p-3">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-dd-muted">
                              Citando @{quotePost.author.username}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuotePost(null)}
                              className="dd-touch rounded-full p-1 text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="line-clamp-2 text-xs font-semibold text-dd-text">{quotePost.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-dd-muted">{quotePost.body}</p>
                        </div>
                      )}

                      {postError && (
                        <p className="text-[11px] font-medium text-red-400">{postError}</p>
                      )}

                      <AnimatePresence initial={false}>
                        {postType === "question" && (
                          <motion.div
                            key="question-compose"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-3"
                          >
                            <div className="rounded-2xl border border-dd-border bg-dd-bg p-3">
                              <textarea
                                value={postCode}
                                onChange={(e) => setPostCode(e.target.value)}
                                rows={4}
                                placeholder="// Cole seu codigo aqui..."
                                className="w-full resize-none bg-transparent font-mono text-xs text-dd-text placeholder-dd-muted focus:outline-none"
                              />
                            </div>
                            <select
                              value={postLanguage}
                              onChange={(e) => setPostLanguage(e.target.value)}
                              className="text-[10px] rounded-lg border border-dd-border bg-dd-bg px-2 py-1 text-dd-text focus:border-orange-500/65 focus:outline-none cursor-pointer font-medium"
                            >
                              <option value="TS">TypeScript</option>
                              <option value="JS">JavaScript</option>
                              <option value="PYTHON">Python</option>
                              <option value="RUST">Rust</option>
                              <option value="GO">Go</option>
                              <option value="CPP">C++</option>
                              <option value="JAVA">Java</option>
                              <option value="KOTLIN">Kotlin</option>
                              <option value="SWIFT">Swift</option>
                            </select>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {postImage && (
                        <div className="relative rounded-xl overflow-hidden border border-dd-border max-h-60 bg-dd-bg">
                          <img src={postImage} alt="Preview" className="w-full h-full object-cover max-h-60" />
                          <button
                            type="button"
                            onClick={() => setPostImage("")}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/85 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <PostComposerExtras
                        section="meta"
                        postBody={postBody}
                        setPostBody={setPostBody}
                        textareaRef={postBodyTextareaRef}
                        replyAudience={replyAudience}
                        setReplyAudience={setReplyAudience}
                        scheduledAt={scheduledAt}
                        setScheduledAt={setScheduledAt}
                        location={postLocation}
                        setLocation={setPostLocation}
                        isSensitive={isSensitive}
                        setIsSensitive={setIsSensitive}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dd-border/50 pt-3">
                        <div className="flex items-center gap-1.5 text-orange-500">
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="inline-file-upload"
                            />
                            <label
                              htmlFor="inline-file-upload"
                              className="dd-touch inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-orange-500/10 cursor-pointer"
                              title="Adicionar imagem"
                            >
                              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            </label>
                          </div>

                          <button
                            type="button"
                            onClick={() => setPostType(postType === "question" ? "discussion" : "question")}
                            className="dd-pill-glide rounded-full border border-dd-border bg-dd-bg hover:bg-dd-border/30 hover:text-dd-text px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-dd-muted transition-colors cursor-pointer"
                          >
                            {postType === "question" ? "Duvida tecnica +10 XP" : "Discussao geral +5 XP"}
                          </button>

                          <PostComposerExtras
                            section="tools"
                            postBody={postBody}
                            setPostBody={setPostBody}
                            textareaRef={postBodyTextareaRef}
                            replyAudience={replyAudience}
                            setReplyAudience={setReplyAudience}
                            scheduledAt={scheduledAt}
                            setScheduledAt={setScheduledAt}
                            location={postLocation}
                            setLocation={setPostLocation}
                            isSensitive={isSensitive}
                            setIsSensitive={setIsSensitive}
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          {uploadingImage && (
                            <span className="text-[10px] text-dd-muted animate-pulse font-semibold">Enviando imagem...</span>
                          )}
                          <PublishButton
                            disabled={!postBody.trim() || uploadingImage || postBody.length >= POST_CHAR_LIMIT}
                            state={publishState}
                            xpReward={xpReward}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </motion.div>

                {feedError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs font-semibold text-red-300">
                    {feedError}
                  </div>
                )}

                <div className="space-y-4">
                  {loadingSearch ? (
                    <PostSkeletonList count={3} />
                  ) : posts.length === 0 ? (
                    <EmptyState type={searchQuery.trim() ? "search" : "feed"} searchTerm={searchQuery} className="rounded-2xl border border-dd-border bg-dd-surface/20" />
                  ) : (
                    <LayoutGroup>
                      {posts.map((post) => {
                        const vote = votes[post.id] || { up: post.upvotes ?? 0, userVote: null };
                        const repostMeta = repostState[post.id] ?? { count: post.reposts_count ?? 0, reposted: false };
                        return (
                          <motion.article
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={springGentle}
                            className={cn(
                              "dd-card-hover rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm space-y-4 transition-[border-color] duration-300",
                              post._pending && "dd-optimistic-post"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 text-dd-text flex items-center justify-center font-bold text-xs select-none">
                                  {post.author.username.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <Link href={`/profile/${post.author.username}`} className="text-xs font-bold text-dd-text hover:text-orange-400 transition-colors">
                                      @{post.author.username}
                                    </Link>
                                    <span className="text-[9px] bg-slate-800 border border-slate-700/80 px-1 py-0.5 rounded text-dd-muted font-mono font-semibold">
                                      Lvl {Math.max(1, Math.floor(post.author.total_xp / 1000) + 1)}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-dd-muted font-medium">
                                    {post._pending ? "Sincronizando..." : "Postado ha pouco"}
                                  </span>
                                </div>
                              </div>

                              {post.language && <LanguageTag language={post.language} size="sm" />}
                            </div>

                            <div className="space-y-3">
                              <Link href={`/post/${post.id}`} className="block">
                                <h2 className="text-sm font-bold text-dd-text hover:text-orange-400 transition-colors leading-snug">
                                  {highlightMatches(post.title, searchQuery)}
                                </h2>
                              </Link>
                              <p className="text-xs text-dd-muted leading-relaxed">
                                {searchQuery.trim() ? highlightMatches(post.body, searchQuery) : parseMentions(post.body)}
                              </p>

                              {post.quoted_post && (
                                <div className="rounded-2xl border border-dd-border bg-dd-bg/50 p-3">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dd-muted">
                                    Citando @{post.quoted_post.author.username}
                                  </p>
                                  <p className="mt-2 text-xs font-semibold text-dd-text">{post.quoted_post.title}</p>
                                  <p className="mt-1 line-clamp-2 text-xs text-dd-muted">{post.quoted_post.body}</p>
                                </div>
                              )}

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

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dd-border pt-3 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 bg-dd-bg/60 rounded-lg p-0.5 border border-dd-border">
                                  <ExpandedReactionButton
                                    count={vote.up}
                                    isActive={vote.userVote === "up"}
                                    activeReaction={activeReactions[post.id] as any}
                                    onReact={(reaction) => void handleReactionSelect(post.id, reaction)}
                                    title="Reagir ao post"
                                  />
                                  <button
                                    onClick={() => handleVote(post.id, "down")}
                                    className={`dd-touch dd-focus-ring p-1.5 rounded-md transition-colors cursor-pointer hover:bg-dd-surface hover:scale-[1.03] ${
                                      vote.userVote === "down" ? "text-red-500" : "text-dd-muted hover:text-dd-text"
                                    }`}
                                    title="Downvote exige justificativa"
                                  >
                                    <ArrowBigDown className="w-4 h-4 fill-current" />
                                  </button>
                                  <span className="p-1 text-[9px] flex items-center justify-center" title="Feedback negativo deve ser construtivo">
                                    <AlertTriangle className="w-3.5 h-3.5 text-dd-muted" />
                                  </span>
                                </div>

                                <RepostMenu
                                  count={repostMeta.count}
                                  isReposted={repostMeta.reposted}
                                  onRepost={() => handleRepost(post)}
                                  onQuote={() => handleQuotePost(post)}
                                />

                                <BookmarkButton
                                  isSaved={!!bookmarkedPostIds[post.id]}
                                  onToggle={() => handleBookmarkToggle(post.id)}
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/post/${post.id}`}
                                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-dd-muted transition-colors hover:bg-dd-surface hover:text-dd-text"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-dd-muted" />
                                  <span>{post._count?.answers || 0} respostas</span>
                                </Link>

                                <Link
                                  href={`/post/${post.id}`}
                                  className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-1.5 font-bold text-white transition-colors hover:bg-orange-600 shadow-sm cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Resolver como Quiz</span>
                                </Link>
                              </div>
                            </div>
                          </motion.article>
                        );
                      })}
                    </LayoutGroup>
                  )}
                  {loadingMore && <PostSkeletonList count={2} />}
                  {!searchQuery.trim() && hasMore && <div ref={scrollSentinelRef} className="h-1" aria-hidden />}
                </div>
              </>
            )}

            {/* TAB DE QUIZZES */}
            {activeTab === "quizzes" && (
              <motion.div
                initial="enter"
                animate="center"
                variants={crossfadeVariants}
                className="space-y-6 dd-tab-crossfade"
              >
                <div className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm">
                  <h2 className="font-bold text-lg text-dd-text flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    🧩 DevDeck Quizzes
                  </h2>
                  <p className="text-dd-muted text-xs mt-1">Responda aos quizzes diários e da comunidade para ganhar bônus de +15 XP!</p>
                </div>

                {/* Quiz Diário do Dia */}
                {dailyQuiz && (
                  <div className="dd-glow-ring rounded-xl border border-orange-500/35 bg-dd-surface p-5 backdrop-blur-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-dd-border pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/25 rounded-md uppercase tracking-wider">
                          Oficial
                        </span>
                        <span className="text-xs font-bold text-dd-text">Quiz Diário do Dia (+15 XP)</span>
                      </div>
                      <span className="text-[10px] text-dd-muted flex items-center gap-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" /> Rotativo Diário
                      </span>
                    </div>
                    <QuizWidget
                      quiz={dailyQuiz}
                      postId=""
                      attempted={!!dailyAttempt}
                      userAnswer={dailyAttempt?.selected_index}
                      onAttemptSuccess={(selectedIndex: number, isCorrect: boolean, xpResult: any) => {
                        setDailyAttempt({
                          quiz_id: dailyQuiz.id,
                          selected_index: selectedIndex,
                          is_correct: isCorrect
                        });
                        if (isCorrect) {
                          showXPToast(15, "Global");
                        }
                      }}
                    />
                  </div>
                )}

                {/* Quizzes da Comunidade */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-dd-muted px-1">
                    Quizzes da Comunidade
                  </h3>

                  <div className="grid grid-cols-1 gap-6">
                    {filteredCommunityQuizPosts.length === 0 ? (
                      <EmptyState
                        type="generic"
                        className="rounded-xl border border-dd-border bg-dd-surface/10"
                      />
                    ) : (
                      filteredCommunityQuizPosts.map((post) => {
                          const quiz = post.quizzes[0];
                          const attempt = quiz.attempts?.find((a: any) => a.user_id === initialUser.id);
                          return (
                            <div key={quiz.id} className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm space-y-4">
                              <div className="flex justify-between items-center border-b border-dd-border pb-3">
                                <span className="text-[10px] text-dd-muted font-medium">Post por @{post.author.username}</span>
                                {post.language && <LanguageTag language={post.language} size="sm" />}
                              </div>
                              <QuizWidget
                                quiz={quiz}
                                postId={post.id}
                                attempted={!!attempt}
                                userAnswer={attempt?.selected_index}
                              />
                            </div>
                          );
                      })
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB DE DUELOS */}
            {activeTab === "duels" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm">
                  <div>
                    <h2 className="font-bold text-lg text-dd-text flex items-center gap-2">
                      <Swords className="w-5 h-5 text-orange-500" />
                      ⚔️ Arena de Duelos
                    </h2>
                    <p className="text-dd-muted text-xs mt-1">Crie um duelo e aguarde matchmaking, ou entre em duelos abertos criados pela comunidade.</p>
                  </div>
                  <button
                    onClick={() => setShowDuelForm(!showDuelForm)}
                    className="bg-orange-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition-colors hover:bg-orange-600 whitespace-nowrap cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    {showDuelForm ? "Fechar Formulário" : "Criar Novo Duelo"}
                  </button>
                </div>

                {showDuelForm && (
                  <div className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm">
                    <h3 className="font-bold text-sm text-dd-text mb-4">Lançar Novo Desafio</h3>
                    <form onSubmit={handleCreateDuel} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={duelTitle}
                            onChange={(e) => setDuelTitle(e.target.value)}
                            required
                            placeholder="Título do problema (Ex: Inverter String sem Built-ins)..."
                            className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg/80 px-4 py-2.5 text-dd-text placeholder-slate-600 focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>
                        <div>
                          <select
                            value={duelLanguage}
                            onChange={(e) => setDuelLanguage(e.target.value as Language)}
                            className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg/80 px-3 py-2.5 text-dd-text focus:border-orange-500/60 focus:outline-none cursor-pointer"
                          >
                            <option value="TS">TypeScript</option>
                            <option value="JS">JavaScript</option>
                            <option value="PYTHON">Python</option>
                            <option value="RUST">Rust</option>
                            <option value="GO">Go</option>
                            <option value="CPP">C++</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <textarea
                          value={duelBody}
                          onChange={(e) => setDuelBody(e.target.value)}
                          required
                          rows={4}
                          placeholder="Descreva o problema de algoritmo, formatos de entradas/saídas e exemplos..."
                          className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg/80 px-4 py-2.5 text-dd-text placeholder-slate-600 focus:border-orange-500/60 focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={creatingDuel}
                          className="bg-orange-500 text-white text-xs font-bold px-6 py-2 rounded-lg transition-all hover:bg-orange-600 disabled:opacity-50 cursor-pointer"
                        >
                          {creatingDuel ? "Enviando..." : "Publicar Duelo"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {duels.length === 0 ? (
                    <div className="col-span-2 rounded-xl border border-dd-border bg-dd-surface/10 p-12 text-center text-dd-muted text-sm">
                      Nenhum duelo de código ocorrendo no momento. Inicie um novo duelo acima!
                    </div>
                  ) : (
                    duels.map((duel) => (
                      <DuelCard key={duel.id} duel={duel} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB DE RANKINGS */}
            {activeTab === "ranking" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="font-bold text-lg text-dd-text flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-orange-500" />
                      🏆 Quadro de Líderes
                    </h2>
                    <p className="text-dd-muted text-xs mt-1">Os desenvolvedores lendários com maior XP na comunidade DevDeck.</p>
                  </div>
                  <div>
                    <select
                      value={leaderboardLanguage}
                      onChange={(e) => setLeaderboardLanguage(e.target.value)}
                      className="text-xs rounded-lg border border-dd-border bg-dd-bg/80 px-3 py-2 text-dd-text focus:border-orange-500/60 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="GLOBAL">Leaderboard Global</option>
                      <option value="TS">TypeScript</option>
                      <option value="JS">JavaScript</option>
                      <option value="PYTHON">Python</option>
                      <option value="RUST">Rust</option>
                      <option value="GO">Go</option>
                      <option value="CPP">C++</option>
                      <option value="JAVA">Java</option>
                      <option value="KOTLIN">Kotlin</option>
                      <option value="SWIFT">Swift</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-dd-border bg-dd-surface backdrop-blur-sm overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-dd-border bg-dd-surface text-dd-muted font-bold uppercase tracking-wider">
                        <th className="py-4 px-6 text-center w-20">Rank</th>
                        <th className="py-4 px-6">Desenvolvedor</th>
                        <th className="py-4 px-6 text-center">Nível</th>
                        <th className="py-4 px-6 text-right">XP Acumulado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-dd-muted font-medium">
                            Carregando ranking de líderes...
                          </td>
                        </tr>
                      ) : (
                        leaderboard.map((row) => (
                          <tr key={row.username} className={`border-b border-dd-border hover:bg-dd-surface transition-colors ${
                            row.rank === 1 ? "bg-amber-500/5 border-l-2 border-l-amber-400" :
                            row.rank === 2 ? "bg-slate-300/5 border-l-2 border-l-slate-400" :
                            row.rank === 3 ? "bg-orange-700/5 border-l-2 border-l-orange-700" : ""
                          }`}>
                            <td className="py-4 px-6 text-center font-extrabold text-sm text-dd-text">
                              {row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : `#${row.rank}`}
                            </td>
                            <td className="py-4 px-6 font-bold text-dd-text">
                              <Link href={`/profile/${row.username}`} className="flex items-center gap-3 hover:text-orange-400 transition-colors w-fit">
                                <div className="w-7 h-7 rounded-full bg-slate-800 text-dd-text flex items-center justify-center font-bold text-xs select-none">
                                  {row.username.slice(0, 2).toUpperCase()}
                                </div>
                                {row.username}
                              </Link>
                            </td>
                            <td className="py-4 px-6 text-center text-orange-400 font-mono font-bold">
                              Nível {row.level}
                            </td>
                            <td className="py-4 px-6 text-right font-mono font-bold text-dd-text">
                              {row.xp.toLocaleString()} XP
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </main>

          {/* ========================================================================= */}
          {/* COLUNA DIREITA: GamificationWidget (Engajamento e Streak) */}
          {/* ========================================================================= */}
          <aside className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
            
            {/* Search Bar */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-dd-muted" />
              </div>
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-dd-surface hover:bg-dd-surface/80 focus:bg-dd-bg border border-dd-border focus:border-orange-500/50 text-sm rounded-full text-dd-text placeholder-dd-muted focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-all duration-200"
              />
            </div>
            {searchQuery.trim() && (
              <div className="rounded-xl border border-dd-border bg-dd-surface/70 p-3 text-xs text-dd-muted">
                {loadingSearch
                  ? "Filtrando o feed em tempo real..."
                  : `Termo ativo: "${searchQuery}".`}
              </div>
            )}

            {/* Streak & User Stats Card */}
            <div className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-dd-muted text-[10px] font-bold uppercase tracking-wider">Engajamento</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              </div>
              
              {/* Flame streak */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-orange-500/0 border border-orange-500/20 rounded-xl p-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(249,115,22,0.15)] animate-pulse">
                  🔥
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-dd-text font-sans tracking-tight">
                    {initialUser.streak || 14} Dias de Ofensiva
                  </h4>
                  <p className="text-[10px] text-dd-muted leading-none mt-1">Resolva quizzes para manter a chama!</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-dd-border pt-3 text-dd-muted">
                <span>XP Acumulado</span>
                <span className="font-bold text-dd-text font-mono">{currentXp.toLocaleString()} XP</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-dd-muted">
                  <span>Progresso do nivel</span>
                  <span>Lvl {currentLevel}</span>
                </div>
                <XPProgressBar percent={currentLevelPercent} colorClass="bg-dd-accent" level={currentLevel} />
              </div>
            </div>

            {/* Badges Grid (showing 3 latest badges) */}
            <div className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-dd-muted text-[10px] font-bold uppercase tracking-wider block">Conquistas</span>
                <Award className="w-4 h-4 text-orange-500" />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                {initialUser.badges.slice(0, 3).map((badge) => (
                  <div 
                    key={badge.id}
                    className="flex flex-col items-center justify-center p-1 group cursor-help"
                    title={`${badge.label}: ${badge.description}`}
                  >
                    <BadgeEmblem slug={badge.slug} icon={badge.icon} label={badge.label} size="sm" earned={true} />
                    <span className="text-[8px] font-bold text-dd-muted block truncate w-full mt-2 text-center">{badge.label}</span>
                  </div>
                ))}

                {/* Placeholders if less than 3 badges */}
                {Array.from({ length: Math.max(0, 3 - initialUser.badges.length) }).map((_, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col items-center justify-center p-1"
                  >
                    <BadgeEmblem slug="" icon="" label="" size="sm" earned={false} />
                    <span className="text-[8px] font-bold text-dd-muted block mt-2 text-center">Bloqueado</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Trail Progress bar */}
            <div className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-dd-muted text-[10px] font-bold uppercase tracking-wider block">Minhas Trilhas</span>
                <Sparkles className="w-3.5 h-3.5 text-orange-500/80" />
              </div>
              
              {initialUser.trails.length === 0 ? (
                <p className="text-xs text-dd-muted italic py-2">Nenhuma trilha ativa ainda.</p>
              ) : (
                <div className="space-y-4">
                  {initialUser.trails.map((trail) => {
                    const nextLevelXp = Math.ceil((trail.level * 1000) * 1.5);
                    const currentLvlBaseXp = Math.ceil(((trail.level - 1) * 1000) * 1.5);
                    const relativeXpEarned = Math.max(0, trail.xp - currentLvlBaseXp);
                    const relativeNextLvlXp = nextLevelXp - currentLvlBaseXp;
                    const percent = Math.min(100, Math.floor((relativeXpEarned / relativeNextLvlXp) * 100));

                    return (
                      <div key={trail.id} className="space-y-1.5 group">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-dd-text group-hover:text-orange-400 transition-colors">
                            {formatLangName(trail.language)}
                          </span>
                          <span className="text-[10px] bg-slate-800 border border-slate-700/60 text-dd-text font-bold px-1.5 py-0.5 rounded font-mono">
                            Lvl {trail.level}
                          </span>
                        </div>
                        {/* Horizontal thin progress bar */}
                        <XPProgressBar
                          percent={percent}
                          colorClass={getLangColor(trail.language)}
                          level={trail.level}
                        />
                        <div className="flex justify-between items-center text-[10px] text-dd-muted font-mono">
                          <span>{trail.xp.toLocaleString()} XP</span>
                          <span>{percent}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tópicos em Alta (Trending Widget) */}
            <div className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-dd-muted text-[10px] font-bold uppercase tracking-wider block">Tópicos em Alta</span>
                <TrendingUp className="w-4 h-4 text-orange-500" />
              </div>
              
              {trendingPosts.length === 0 ? (
                <p className="text-xs text-dd-muted italic py-1">Nenhum post em alta no momento.</p>
              ) : (
                <div className="space-y-3">
                  {trendingPosts.map((post, idx) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => {
                        setSearchQuery(post.title);
                        setActiveTab("feed");
                      }}
                      className="group relative block w-full pl-4 border-l-2 border-orange-500/20 text-left transition-colors hover:border-orange-500"
                    >
                      <span className="block">
                        <div className="flex items-center gap-1.5 text-[9px] text-dd-muted">
                          <span className="font-mono text-orange-500 font-bold"># {idx + 1}</span>
                          <span>·</span>
                          {post.language ? (
                            <span className="font-semibold text-orange-400">{formatLangName(post.language)}</span>
                          ) : (
                            <span>Geral</span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-dd-text group-hover:text-orange-400 transition-colors line-clamp-1 leading-snug mt-0.5">
                          {post.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[9px] text-dd-muted mt-0.5">
                          <span>{post.view_count} visualizações</span>
                          <span>·</span>
                          <span>{post._count?.answers || 0} respostas</span>
                        </div>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Duels (votar em resoluções) */}
            <div className="rounded-xl border border-dd-border bg-dd-surface p-5 backdrop-blur-sm shadow-sm space-y-3.5">
              <span className="text-dd-muted text-[10px] font-bold uppercase tracking-wider block">Duelos em Destaque</span>
              
              {activeDuels.length === 0 ? (
                <p className="text-xs text-dd-muted italic py-1">Nenhum duelo ativo no momento.</p>
              ) : (
                <div className="space-y-3">
                  {activeDuels.map((duel) => (
                    <div key={duel.id} className="rounded-lg border border-dd-border/60 bg-dd-bg/40 p-3 space-y-2 hover:border-slate-850 transition-colors">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-orange-400 font-bold tracking-tight">DUELO DE CÓDIGO</span>
                        <LanguageTag language={duel.language} size="sm" />
                      </div>
                      <h5 className="text-xs font-bold text-dd-text line-clamp-1 leading-snug">
                        {duel.problem_title}
                      </h5>
                      <div className="flex items-center justify-between text-[10px] text-dd-muted font-semibold pt-1 border-t border-dd-border">
                        <span>@{duel.challenger.username} vs @{duel.opponent?.username || "match..."}</span>
                        <Link 
                          href={`/duels/${duel.id}`}
                          className="text-orange-500 hover:text-orange-400 flex items-center font-bold"
                        >
                          Votar
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </aside>

        </div>
      </div>
      <Footer />
      </div>
    </div>
  );
}
