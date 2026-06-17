'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  BookOpen, 
  Swords, 
  Trophy, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  Plus, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Send,
  X,
  Sun,
  Moon,
  Home,
  Search,
  Bell,
  MessageCircle,
  Bookmark,
  BadgeCheck,
  MoreHorizontal
} from 'lucide-react';
import { PostComposerExtras } from '@/components/PostComposerExtras';
import { ComposeModal } from '@/components/motion/ComposeModal';
import { NotificationBellIcon } from '@/components/motion/NotificationBellIcon';
import { PublishButton, PublishState } from '@/components/motion/PublishButton';
import { CharCounter } from '@/components/motion/CharCounter';
import { MentionDropdown } from '@/components/motion/MentionDropdown';
import { appendPostExtras, ReplyAudience, resetPostComposerExtras } from '@/lib/post-composer';
import { POST_CHAR_LIMIT } from '@/lib/motion';

interface SidebarUser {
  id: string;
  username: string;
  avatar_url?: string | null;
  streak?: number;
  total_xp?: number;
}

interface SidebarProps {
  user: SidebarUser | null;
}

// Module-level cache to persist logged-in user across page navigation transitions
let inMemoryUser: SidebarUser | null = null;
let isInitiallyMounted = false;

if (typeof window !== 'undefined') {
  try {
    const cached = sessionStorage.getItem('devdeck_user');
    if (cached) {
      inMemoryUser = JSON.parse(cached);
    }
  } catch (e) {
    // ignore
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Local state for user with sessionStorage cache fallback
  const [activeUser, setActiveUser] = useState<SidebarUser | null>(() => {
    // If we're on the server or performing the very first client hydration render,
    // we must return the user prop to match the server HTML representation exactly.
    if (typeof window === 'undefined' || !isInitiallyMounted) {
      return user;
    }
    // Otherwise, we are rendering client-side (e.g. client-side page transition),
    // so we can immediately return the user prop or the in-memory cache to be instant.
    return user || inMemoryUser;
  });

  useEffect(() => {
    isInitiallyMounted = true;
    if (!activeUser) {
      try {
        const cached = sessionStorage.getItem('devdeck_user');
        if (cached) {
          const parsed = JSON.parse(cached);
          setActiveUser(parsed);
          inMemoryUser = parsed;
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (user) {
      setActiveUser(user);
      inMemoryUser = user;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('devdeck_user', JSON.stringify(user));
      }
    } else {
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem('devdeck_user');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setActiveUser(parsed);
            inMemoryUser = parsed;
          } catch (e) {
            // ignore
          }
        }
      }
      
      // Async background fetch
      fetch('/api/users/me')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Not logged in');
        })
        .then(data => {
          setActiveUser(data);
          inMemoryUser = data;
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('devdeck_user', JSON.stringify(data));
          }
        })
        .catch(() => {
          setActiveUser(null);
          inMemoryUser = null;
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('devdeck_user');
          }
        });
    }
  }, [user]);
  
  // Theme state & toggler
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!activeUser) return;
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch('/api/notifications/unread-count');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count);
        }
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [activeUser, pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Post creation modal state
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postLanguage, setPostLanguage] = useState("TS");
  const [postCode, setPostCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [postError, setPostError] = useState<string | null>(null);
  const [postType, setPostType] = useState<'question' | 'discussion'>('question');
  const [postImage, setPostImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const postBodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [replyAudience, setReplyAudience] = useState<ReplyAudience>('everyone');
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [postLocation, setPostLocation] = useState('');
  const [isSensitive, setIsSensitive] = useState(false);

  // Custom sidebar item states
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(21279); // 05:54:39 is 21279 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 21279;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (toast?.visible) {
      const timer = setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      inMemoryUser = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('devdeck_user');
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // Mention Suggestions state
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);

  const handleBodyChange = async (val: string) => {
    setPostBody(val);
    const words = val.split(/\s+/);
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith("@") && lastWord.length >= 1) {
      const q = lastWord.slice(1);
      try {
        const res = await fetch(`/api/users/search?q=${q}`);
        if (res.ok) {
          await res.json();
          setShowMentionSuggestions(true);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  };

  const handleSelectMention = (username: string) => {
    const words = postBody.split(/\s+/);
    words[words.length - 1] = `@${username} `;
    setPostBody(words.join(" "));
    setShowMentionSuggestions(false);
  };

  const resetCompose = () => {
    setPostTitle("");
    setPostBody("");
    setPostCode("");
    setPostImage("");
    setPostType("question");
    setShowMentionSuggestions(false);
    setPostError(null);
    const resetExtras = resetPostComposerExtras();
    setReplyAudience(resetExtras.replyAudience);
    setScheduledAt(resetExtras.scheduledAt);
    setPostLocation(resetExtras.location);
    setIsSensitive(resetExtras.isSensitive);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postBody.trim()) return;
    setSubmitting(true);
    setPublishState("submitting");
    setPostError(null);

    const titleToSubmit = postTitle.trim() || (postBody.trim().substring(0, 40) || "Discussão Geral");

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
          language: postType === 'question' ? postLanguage : (postLanguage === "" ? null : postLanguage),
          code_snippet: postType === 'question' ? (postCode || null) : null,
          image_url: postType === 'discussion' ? (postImage || null) : null,
        }),
      });

      if (res.ok) {
        resetCompose();
        setPublishState("success");
        setTimeout(() => {
          setPublishState("idle");
          setModalOpen(false);
        }, 1500);
        router.refresh();
        if (pathname !== "/feed") {
          router.push("/feed");
        }
      } else {
        throw new Error("Erro ao postar");
      }
    } catch (err) {
      console.error("Error creating post from sidebar:", err);
      setPostError("Algo deu errado ao postar. Seu texto foi salvo como rascunho.");
      setPublishState("idle");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPostError(null);
  };

  const hasDraft = Boolean(postBody.trim() || postCode.trim() || postImage);

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

  const initials = activeUser?.username.slice(0, 2).toUpperCase() || "DV";

  const DuckyIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <circle cx="15.5" cy="7.5" r="3" />
      {/* Eye */}
      <circle cx="16" cy="7" r="0.5" fill="currentColor" />
      {/* Beak */}
      <path d="M18.5 7.5 C19.5 7.5 21 7 21.5 8 C20.5 9 19.5 8.5 18.5 8.5" fill="currentColor" />
      {/* Body */}
      <path d="M13 10.5 C10 10.5 8 9.5 6 11 C4.5 12 4 14 4 15.5 C4 18.5 7.5 20 11.5 20 C16 20 18.5 17.5 18.5 14.5 C18.5 12.5 17 11 15 10.5 L13 10.5 Z" />
      {/* Wing */}
      <path d="M8.5 14 C10.5 13.5 12.5 14 13.5 15.5 C12.5 17 9.5 17 8.5 14 Z" />
    </svg>
  );

  const navItems = [
    {
      label: 'Página Inicial',
      href: '/feed',
      icon: Home,
      active: pathname === '/feed',
      badge: 'dot' as const
    },
    {
      label: 'Explorar',
      href: '/explore',
      icon: Search,
      active: pathname === '/explore'
    },
    {
      label: 'Trilhas',
      href: '/trails',
      icon: BookOpen,
      active: pathname.startsWith('/trails')
    },
    {
      label: 'Notificações',
      href: '/notifications',
      icon: Bell,
      active: pathname === '/notifications'
    },
    {
      label: 'Bate-papo',
      href: '/messages',
      icon: MessageCircle,
      active: pathname === '/messages'
    },
    {
      label: 'Ducky',
      href: '/ducky',
      icon: DuckyIcon,
      active: pathname === '/ducky'
    },
    {
      label: 'Itens salvos',
      href: '/bookmarks',
      icon: Bookmark,
      active: pathname === '/bookmarks'
    },
    {
      label: 'Premium',
      onClick: () => setPremiumModalOpen(true),
      icon: BadgeCheck,
      badge: 'timer' as const
    },
    {
      label: 'Perfil',
      href: activeUser ? `/profile/${activeUser.username}` : '#',
      icon: UserIcon,
      active: activeUser ? pathname === `/profile/${activeUser.username}` : false
    },
    {
      label: 'Mais',
      onClick: () => setMoreMenuOpen(!moreMenuOpen),
      icon: MoreHorizontal,
      isMore: true
    }
  ];

  return (
    <>
      {/* ========================================== */}
      {/* DESKTOP SIDEBAR (Twitter-like) */}
      {/* ========================================== */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 border-r border-dd-border bg-dd-bg p-5 z-40 select-none">
        <div className="space-y-5">
          {/* Logo */}
          <Link href="/feed" className="flex items-center gap-2.5 px-3 py-0 group w-fit">
            <img src="/logo.png" alt="DevDeck Logo" className="w-7 h-7 object-contain group-hover:scale-105 transition-transform duration-300 hidden dark:block" />
            <img src="/logo-light.png" alt="DevDeck Logo" className="w-7 h-7 object-contain group-hover:scale-105 transition-transform duration-300 block dark:hidden" />
            <span className="text-dd-text font-extrabold text-xl tracking-tight">
              DevDeck
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              // Standard link style (tightened padding)
              const linkClasses = `flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group border w-full text-left cursor-pointer ${
                item.active
                  ? 'bg-transparent text-dd-text font-black border-transparent'
                  : 'text-dd-muted border-transparent hover:bg-dd-surface/60 hover:text-dd-text'
              }`;

              // Icon container with relative for badges
              const iconEl = (
                <div className="relative flex items-center justify-center w-5 h-5">
                  {item.label === 'Notificações' ? (
                    <NotificationBellIcon unreadCount={unreadCount} active={item.active} />
                  ) : (
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 duration-200 ${item.active ? 'text-dd-text fill-current' : 'text-dd-muted'}`} />
                  )}
                  {item.badge === 'dot' && (
                    <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-orange-500 ring-2 ring-dd-bg animate-pulse" />
                  )}
                </div>
              );

              // Content of the link/button
              const contentEl = (
                <>
                  {iconEl}
                  <span>{item.label}</span>
                  {item.badge === 'timer' && (
                    <span className="ml-auto text-[9px] font-bold bg-[#f5a623] text-black px-1.5 py-0.5 rounded-full font-mono">
                      {formatTime(secondsLeft)}
                    </span>
                  )}
                </>
              );

              if (item.href) {
                return (
                  <Link key={item.label} href={item.href} className={linkClasses}>
                    {contentEl}
                  </Link>
                );
              }

              if (item.isMore) {
                return (
                  <div key={item.label} className="relative">
                    <button onClick={item.onClick} className={linkClasses}>
                      {contentEl}
                    </button>
                    {moreMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40 cursor-default" onClick={() => setMoreMenuOpen(false)} />
                        <div className="absolute bottom-full left-0 w-56 mb-2 rounded-xl border border-dd-border bg-dd-surface/95 backdrop-blur-xl shadow-2xl z-50 py-1.5 font-sans overflow-hidden animate-slide-up">
                          <Link
                             href="/duels"
                             className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-dd-text hover:bg-dd-surface hover:text-dd-text transition-colors border-b border-dd-border/40"
                             onClick={() => setMoreMenuOpen(false)}
                          >
                            <Swords className="w-4 h-4 text-dd-muted" />
                            Duelos de Código
                          </Link>
                          <Link
                            href="/leaderboard"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-dd-text hover:bg-dd-surface hover:text-dd-text transition-colors border-b border-dd-border/40"
                            onClick={() => setMoreMenuOpen(false)}
                          >
                            <Trophy className="w-4 h-4 text-dd-muted" />
                            Classificação Geral
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-dd-text hover:bg-dd-surface hover:text-dd-text transition-colors"
                            onClick={() => setMoreMenuOpen(false)}
                          >
                            <SettingsIcon className="w-4 h-4 text-dd-muted" />
                            Configurações
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <button key={item.label} onClick={item.onClick} className={linkClasses}>
                  {contentEl}
                </button>
              );
            })}
          </nav>

          {/* Post action button (tightened padding) */}
          {activeUser && (
            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-2.5 px-4 rounded-full text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Postar</span>
            </button>
          )}
        </div>

        {/* User profile dropdown widget */}
        {activeUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-dd-border hover:bg-dd-surface transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                {activeUser.avatar_url ? (
                  <img
                    src={activeUser.avatar_url}
                    alt={activeUser.username}
                    className="w-9 h-9 rounded-full object-cover border border-dd-border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/10">
                    {initials}
                  </div>
                )}
                <div className="text-left min-w-0 font-sans">
                  <p className="text-xs font-bold text-dd-text truncate leading-tight">
                    {activeUser.username}
                  </p>
                  <p className="text-[10px] text-dd-muted font-semibold truncate leading-none mt-1">
                    @{activeUser.username.toLowerCase()}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-dd-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-dd-border bg-dd-surface/95 backdrop-blur-xl shadow-2xl z-50 py-1.5 font-sans overflow-hidden animate-slide-up">
                  <Link
                    href={`/profile/${activeUser.username}`}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-dd-text hover:bg-dd-surface hover:text-dd-text transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserIcon className="w-4 h-4 text-dd-muted" />
                    Meu Perfil
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-dd-text hover:bg-dd-surface hover:text-dd-text transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <SettingsIcon className="w-4 h-4 text-dd-muted" />
                    Configurações
                  </Link>
                  <hr className="border-dd-border my-1" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleSignOut();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sair da Conta
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </aside>

      {/* ========================================== */}
      {/* MOBILE HEADER & BOTTOM NAV (Twitter mobile style) */}
      {/* ========================================== */}
      <div className="md:hidden flex flex-col w-full">
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full border-b border-dd-border bg-dd-bg/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="DevDeck Logo" className="w-6 h-6 object-contain hidden dark:block" />
            <img src="/logo-light.png" alt="DevDeck Logo" className="w-6 h-6 object-contain block dark:hidden" />
            <span className="text-dd-text font-extrabold text-base tracking-tight">
              DevDeck
            </span>
          </Link>
          
          <div className="flex items-center gap-2.5">
            {activeUser && (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  {activeUser.avatar_url ? (
                    <img
                      src={activeUser.avatar_url}
                      alt={activeUser.username}
                      className="w-7 h-7 rounded-full object-cover border border-dd-border"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold border border-orange-500/10">
                      {initials}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-dd-border bg-dd-surface/95 backdrop-blur-xl shadow-2xl z-50 py-1.5 font-sans overflow-hidden">
                      <Link
                        href={`/profile/${activeUser.username}`}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-dd-text hover:bg-dd-surface hover:text-dd-text transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <UserIcon className="w-3.5 h-3.5 text-dd-muted" />
                        Meu Perfil
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-dd-text hover:bg-dd-surface hover:text-dd-text transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <SettingsIcon className="w-3.5 h-3.5 text-dd-muted" />
                        Configurações
                      </Link>
                      <hr className="border-dd-border my-1" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-dd-bg/90 backdrop-blur-md border-t border-dd-border px-6 py-2.5 flex items-center justify-around">
          {navItems.filter(item => item.label === 'Página Inicial' || item.label === 'Explorar' || item.label === 'Trilhas' || item.label === 'Notificações' || item.label === 'Perfil').map((item) => {
            const Icon = item.icon;
            
            const iconEl = (
              <div className="relative flex items-center justify-center">
                {item.label === 'Notificações' ? (
                  <NotificationBellIcon unreadCount={unreadCount} active={item.active} />
                ) : (
                  <>
                    <Icon className={`w-5.5 h-5.5 ${item.active ? 'fill-current' : ''}`} />
                    {item.badge === 'dot' && (
                      <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-orange-500 ring-2 ring-dd-bg" />
                    )}
                  </>
                )}
              </div>
            );

            const classes = `flex flex-col items-center justify-center p-1.5 transition-colors duration-150 ${
              item.active ? 'text-dd-text font-black' : 'text-dd-muted hover:text-dd-text'
            }`;

            if (item.href) {
              return (
                <Link key={item.label} href={item.href} className={classes}>
                  {iconEl}
                </Link>
              );
            }

            return (
              <button key={item.label} onClick={item.onClick} className={classes}>
                {iconEl}
              </button>
            );
          })}
          
          {/* Floating post trigger */}
          {activeUser && (
            <button
              onClick={() => setModalOpen(true)}
              className="absolute -top-14 right-4 bg-orange-500 text-white rounded-full p-3.5 shadow-lg shadow-orange-500/25 active:scale-95 transition-all w-12 h-12 flex items-center justify-center cursor-pointer"
              aria-label="Postar"
            >
              <Plus className="w-5.5 h-5.5" />
            </button>
          )}
        </nav>
      </div>

      {/* GLOBAL TWEET/POST MODAL */}
      <ComposeModal
        open={modalOpen}
        onClose={handleCloseModal}
        hasDraft={hasDraft}
        onDiscard={resetCompose}
        headerExtra={
          <button
            type="button"
            onClick={() => showToast("Rascunhos salvos localmente!")}
            className="text-xs font-black text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
          >
            Rascunhos
          </button>
        }
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex gap-3">
                {/* Avatar */}
                {activeUser?.avatar_url ? (
                  <img
                    src={activeUser.avatar_url}
                    alt={activeUser.username}
                    className="w-10 h-10 rounded-full object-cover border border-dd-border shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/10 shrink-0">
                    {initials}
                  </div>
                )}

                {/* Textarea Area */}
                <div className="flex-grow min-w-0 space-y-3 relative">
                  <textarea
                    ref={postBodyTextareaRef}
                    value={postBody}
                    onChange={(e) => handleBodyChange(e.target.value)}
                    required
                    rows={4}
                    maxLength={POST_CHAR_LIMIT}
                    placeholder={postType === 'question' ? "Qual a sua duvida tecnica? Compartilhe seu codigo abaixo..." : "O que esta acontecendo? Compartilhe ideias, artigos ou links..."}
                    className="w-full bg-transparent text-sm text-dd-text placeholder-dd-muted/65 focus:outline-none resize-none"
                  />
                  <div className="flex justify-end">
                    <CharCounter text={postBody} limit={POST_CHAR_LIMIT} />
                  </div>
                  
                  {/* Mention Suggestions Popup */}
                  <MentionDropdown
                    query={postBody.split(/\s+/).at(-1)?.replace(/^@/, "") || ""}
                    visible={showMentionSuggestions}
                    onSelect={handleSelectMention}
                    onClose={() => {
                      setShowMentionSuggestions(false);
                    }}
                  />
                  
                  {/* Support fields for questions */}
                  {postType === 'question' && (
                    <div className="space-y-2 animate-slide-down">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-dd-muted uppercase">Linguagem da Dúvida:</span>
                        <select
                          value={postLanguage}
                          onChange={(e) => setPostLanguage(e.target.value)}
                          className="text-[10px] rounded-lg border border-dd-border bg-dd-surface px-2.5 py-1 text-dd-text focus:border-orange-500/60 focus:outline-none cursor-pointer"
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
                      </div>
                      
                      <textarea
                        value={postCode}
                        onChange={(e) => setPostCode(e.target.value)}
                        rows={3}
                        placeholder="// Cole seu código ou erro aqui..."
                        className="w-full font-mono text-[10px] leading-relaxed rounded-lg border border-dd-border bg-dd-surface px-3 py-2 text-dd-muted placeholder-dd-muted/50 focus:border-orange-500/50 focus:outline-none"
                      />
                    </div>
                  )}

                  {postImage && (
                    <div className="relative rounded-xl overflow-hidden border border-dd-border max-h-40">
                      <img src={postImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPostImage('')}
                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
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

                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dd-border/50 pt-3 flex items-center justify-between">
                
                {/* Left tools (Icons) */}
                <div className="flex items-center gap-1.5 text-orange-500">
                  {/* Image input trigger */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="sidebar-tweet-image-upload"
                  />
                  <label 
                    htmlFor="sidebar-tweet-image-upload"
                    className="p-2 hover:bg-orange-500/10 rounded-full transition-colors cursor-pointer"
                    title="Adicionar imagem"
                  >
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </label>
                  
                  {/* GIF/Toggle Mode */}
                  <button
                    type="button"
                    onClick={() => setPostType(postType === 'question' ? 'discussion' : 'question')}
                    className="rounded-full border border-dd-border bg-dd-bg hover:bg-dd-border/30 hover:text-dd-text px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-dd-muted transition-colors cursor-pointer"
                  >
                    {postType === 'question' ? "Duvida tecnica +10 XP" : "Discussao geral +5 XP"}
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

                {/* Right submit button */}
                <PublishButton
                  disabled={!postBody.trim() || uploadingImage || postBody.length >= POST_CHAR_LIMIT}
                  state={publishState}
                  xpReward={postType === "question" ? 10 : 5}
                />

              </div>
              {postError && (
                <p className="text-[11px] text-red-400 font-medium">{postError}</p>
              )}
            </form>
      </ComposeModal>

      {/* ========================================== */}
      {/* PREMIUM UPGRADE MODAL */}
      {/* ========================================== */}
      {premiumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-dd-bg/75 backdrop-blur-sm"
            onClick={() => setPremiumModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-dd-surface border border-dd-border rounded-2xl shadow-2xl p-6 overflow-hidden z-10 animate-scale-up font-sans text-center space-y-6">
            <button 
              onClick={() => setPremiumModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-dd-muted hover:text-dd-text hover:bg-dd-surface transition-all cursor-pointer"
            >
              <X className="w-4.5 h-4.5 animate-pulse" />
            </button>

            <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(249,115,22,0.15)] animate-pulse">
              ­ƒææ
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-dd-text">Upgrade para o Premium</h3>
              <p className="text-xs text-orange-500 font-bold uppercase tracking-wider bg-orange-500/10 py-1 px-3 rounded-full w-fit mx-auto animate-bounce">
                40% de Desconto Ativo
              </p>
              <p className="text-xs text-dd-muted leading-relaxed px-4">
                Participe da rede global mais incr├¡vel de conversas que estão moldando o futuro.
              </p>
            </div>

            <div className="border-t border-b border-dd-border py-4 text-left space-y-3.5 text-xs font-semibold text-dd-text">
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-lg">✓</span>
                <span>Selo verificado premium no perfil</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-lg">✓</span>
                <span>Acesso exclusivo ao Ducky AI para tirar dúvidas</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-lg">✓</span>
                <span>Ganho de XP em dobro (+100% XP em respostas)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-lg">✓</span>
                <span>Participação em Duelos e Quizzes exclusivos</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast("Assinatura premium processada com sucesso! Parabéns!");
                setPremiumModalOpen(false);
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-orange-500/10 cursor-pointer"
            >
              Atualizar Agora
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* FLOATING TOAST NOTIFICATION */}
      {/* ========================================== */}
      {toast && toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right rounded-xl border border-dd-border bg-dd-surface/90 backdrop-blur-xl p-4 shadow-2xl flex items-center gap-3 max-w-sm">
          <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm ring-1 ring-orange-500/20">
            i
          </div>
          <div>
            <p className="text-xs font-semibold text-dd-text">{toast.message}</p>
          </div>
        </div>
      )}
    </>
  );
}
