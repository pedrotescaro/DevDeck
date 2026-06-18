'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { PostCard } from '@/components/PostCard';
import { FollowButton } from '@/components/motion/FollowButton';
import { EmptyState } from '@/components/motion/EmptyState';
import {
  Search as SearchIcon,
  Settings,
  MoreHorizontal,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

interface SuggestedUser {
  id: string;
  username: string;
  avatar_url: string | null;
  total_xp: number;
}

export default function ExplorePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [activeTab, setActiveTab] = useState<
    'para_voce' | 'assuntos' | 'noticias' | 'open_source' | 'carreira'
  >('para_voce');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Follow action state
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/login');
          return;
        }

        const resUser = await fetch('/api/users/me');
        if (resUser.ok) {
          const userData = await resUser.json();
          setUser(userData);
        }

        // Fetch user suggestions
        const resSuggestions = await fetch('/api/users/suggestions');
        if (resSuggestions.ok) {
          const data = await resSuggestions.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error('Error fetching explore data:', err);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(async () => {
      setSearching(true);
      setHasSearched(true);
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/posts?search=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleFollowToggle = async (targetUserId: string) => {
    const isCurrentlyFollowing = !!followingMap[targetUserId];
    const newFollowing = !isCurrentlyFollowing;

    // Optimistic update
    setFollowingMap((prev) => ({
      ...prev,
      [targetUserId]: newFollowing,
    }));

    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Failed to toggle follow status');
      }
      const data = await res.json();
      setFollowingMap((prev) => ({
        ...prev,
        [targetUserId]: data.following,
      }));

      if (data.following) {
        // Refetch suggestions to fill spaces if followed
        setTimeout(async () => {
          const resSuggestions = await fetch('/api/users/suggestions');
          if (resSuggestions.ok) {
            const data = await resSuggestions.json();
            setSuggestions(data);
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
      // Rollback
      setFollowingMap((prev) => ({
        ...prev,
        [targetUserId]: isCurrentlyFollowing,
      }));
    }
  };

  const trends = [
    {
      rank: 1,
      language: 'TS',
      languageLabel: 'TypeScript',
      title: 'Server Components vs Client Components no Next.js 16',
      views: 91,
      answers: 0,
    },
    {
      rank: 2,
      language: 'RUST',
      languageLabel: 'Rust',
      title: "Ownership e lifetimes em Rust: quando usar &'static?",
      views: 55,
      answers: 1,
    },
    {
      rank: 3,
      language: 'TS',
      languageLabel: 'TypeScript',
      title: 'Como tipar corretamente generics com constraints em TypeScript?',
      views: 43,
      answers: 2,
    },
    {
      rank: 4,
      language: 'GO',
      languageLabel: 'Go',
      title: 'Goroutines vazando memória — como debugar?',
      views: 34,
      answers: 1,
    },
    {
      rank: 5,
      language: 'PYTHON',
      languageLabel: 'Python',
      title: 'Melhor forma de lidar com async generators em Python 3.12?',
      views: 38,
      answers: 0,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

      <div className="flex-grow flex flex-col md:flex-row min-w-0">
        {/* Left Side: Search Feed & Trends (Matching image 2) */}
        <main className="flex-grow max-w-2xl w-full border-r border-dd-border/80 min-h-screen bg-dd-bg pb-24 md:pb-8">
          {/* Header Search Bar */}
          <div className="sticky top-0 z-30 bg-dd-bg/95 backdrop-blur-md border-b border-dd-border/60 p-3 flex items-center gap-3">
            {hasSearched && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 hover:bg-dd-surface/60 rounded-full transition-colors text-dd-text"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <form onSubmit={handleSearch} className="flex-1 relative">
              <SearchIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dd-muted" />
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-dd-surface/85 border border-transparent focus:border-orange-500/50 focus:bg-dd-bg py-2.5 pl-12 pr-4 text-xs font-semibold text-dd-text placeholder-dd-muted/70 focus:outline-none transition-colors"
              />
            </form>

            <button className="p-2 text-dd-text hover:bg-dd-surface/60 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* If search results are showing */}
          {hasSearched ? (
            <div className="space-y-4 p-4">
              <h2 className="text-sm font-black text-dd-text">
                Resultados para &ldquo;{searchQuery}&rdquo;
              </h2>

              {searching ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                  <p className="text-xs text-dd-muted">Buscando postagens...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="space-y-3">
                  <EmptyState type="search" searchTerm={searchQuery} />
                  <div className="text-center">
                    <button
                      onClick={handleClearSearch}
                      className="text-xs text-orange-400 font-bold hover:underline"
                    >
                      Voltar para assuntos do momento
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isOwner={post.author_id === user?.id}
                      onDelete={(postId) => {
                        setSearchResults((prev) => prev.filter((p) => p.id !== postId));
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Standard Trends Feed
            <>
              {/* Navigation Tabs */}
              <div className="flex border-b border-dd-border/40 bg-dd-bg overflow-x-auto scrollbar-none">
                {(['para_voce', 'assuntos', 'noticias', 'open_source', 'carreira'] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="py-3.5 px-4 text-xs font-bold whitespace-nowrap relative hover:bg-dd-surface/30 transition-colors"
                    >
                      <span
                        className={
                          activeTab === tab ? 'text-dd-text font-black' : 'text-dd-muted font-bold'
                        }
                      >
                        {tab === 'para_voce'
                          ? 'Para você'
                          : tab === 'assuntos'
                            ? 'Assuntos do Momento'
                            : tab === 'noticias'
                              ? 'Notícias'
                              : tab === 'open_source'
                                ? 'Open Source'
                                : 'Carreira'}
                      </span>
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-orange-500" />
                      )}
                    </button>
                  )
                )}
              </div>

              {/* Trends List */}
              <div className="divide-y divide-dd-border/40">
                {trends.map((trend, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(trend.title);
                      setHasSearched(true);
                      setSearching(true);
                      fetch(`/api/posts?search=${encodeURIComponent(trend.title)}`)
                        .then((res) => res.json())
                        .then((data) => setSearchResults(data))
                        .catch((err) => console.error(err))
                        .finally(() => setSearching(false));
                    }}
                    className="p-4.5 flex justify-between hover:bg-dd-surface/25 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1 w-full pr-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-dd-muted font-bold">
                        <span className="font-mono text-orange-500 font-extrabold">
                          # {trend.rank}
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-orange-400">{trend.languageLabel}</span>
                      </div>
                      <p className="text-sm font-black text-dd-text leading-snug mt-0.5">
                        {trend.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-dd-muted mt-0.5">
                        <span>{trend.views} visualizações</span>
                        <span>·</span>
                        <span>
                          {trend.answers} {trend.answers === 1 ? 'resposta' : 'respostas'}
                        </span>
                      </div>
                    </div>
                    <button className="text-dd-muted hover:text-dd-text self-start p-1.5 rounded-full transition-colors">
                      <MoreHorizontal className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Right Side: Who to Follow Widget (Matching image 2) */}
        <aside className="hidden lg:block w-80 p-4 space-y-4 shrink-0">
          <div className="bg-dd-surface border border-dd-border rounded-2xl p-4 space-y-4">
            <h3 className="text-sm font-black text-dd-text">Quem seguir</h3>

            <div className="space-y-4">
              {suggestions.length === 0 ? (
                <p className="text-xs text-dd-muted">Nenhuma sugestão disponível no momento.</p>
              ) : (
                suggestions.map((sugUser) => (
                  <div key={sugUser.id} className="flex items-center justify-between gap-3">
                    <Link
                      href={`/profile/${sugUser.username}`}
                      className="flex items-center gap-3 min-w-0 group"
                    >
                      {sugUser.avatar_url ? (
                        <img
                          src={sugUser.avatar_url}
                          alt={sugUser.username}
                          className="w-10 h-10 rounded-full object-cover border border-dd-border group-hover:scale-105 transition-transform shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/10 group-hover:scale-105 transition-transform shrink-0">
                          {sugUser.username.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-black text-dd-text truncate group-hover:underline">
                            {sugUser.username}
                          </p>
                        </div>
                        <p className="text-[10px] text-dd-muted font-semibold truncate">
                          @{sugUser.username.toLowerCase()}
                        </p>
                      </div>
                    </Link>

                    <FollowButton
                      isFollowing={!!followingMap[sugUser.id]}
                      onToggle={() => handleFollowToggle(sugUser.id)}
                      size="sm"
                    />
                  </div>
                ))
              )}
            </div>

            <button className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors block pt-2">
              Mostrar mais
            </button>
          </div>

          {/* Subtle footer */}
          <div className="px-4 text-[10px] text-dd-muted leading-normal space-y-2">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <span className="hover:underline cursor-pointer">Termos de Serviço</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">Política de Privacidade</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">Política de cookies</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">Acessibilidade</span>
              <span>|</span>
              <span className="hover:underline cursor-pointer">Informações de anúncios</span>
            </div>
            <p>© {new Date().getFullYear()} DevDeck Corp.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
