'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { BadgeGrid } from '@/components/BadgeGrid';
import { PostCard } from '@/components/PostCard';
import { ProfileReplyThread } from '@/components/ProfileReplyThread';
import { FollowersModal } from '@/components/motion/FollowersModal';
import { LanguageTrailBar } from '@/components/LanguageTrailBar';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { FollowButton } from '@/components/motion/FollowButton';
import { EditProfileModal } from '@/components/EditProfileModal';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Award,
  Check,
  Sparkles,
  Tag,
  Cake,
  Calendar,
} from 'lucide-react';

interface ProfileContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
  };
  profileUser: {
    id: string;
    username: string;
    avatar_url?: string | null;
    bio?: string | null;
    institution?: string | null;
    github_username?: string | null;
    discord_username?: string | null;
    banner_url?: string | null;
    pronouns?: string | null;
    birthday?: string | null;
    created_at: string;
    total_xp: number;
    badges: any[];
  };
  stats: {
    answers_count: number;
    accuracy: number;
    accepted_count: number;
  };
  trails: any[];
  allBadges: any[];
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

const formatBirthday = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatJoinedDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.toLocaleDateString('pt-BR', { month: 'long' });
  const year = date.getFullYear();
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  return `Ingressou em ${capitalizedMonth} de ${year}`;
};

export function ProfileContent({
  user,
  profileUser,
  stats,
  trails,
  allBadges,
  isFollowing,
  followersCount,
  followingCount,
}: ProfileContentProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<{ tab: string; items: any[] }>({ tab: 'posts', items: [] });
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [following, setFollowing] = useState(isFollowing);
  const [followers, setFollowers] = useState(followersCount);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>('followers');
  const [activeTab, setActiveTab] = useState<
    'posts' | 'replies' | 'likes' | 'stats' | 'trails' | 'badges'
  >('posts');
  const itemsToRender = posts.tab === activeTab ? posts.items : [];
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [localProfileUser, setLocalProfileUser] = useState(profileUser);

  const showFollowersModal = () => {
    setModalType('followers');
    setModalOpen(true);
  };

  const showFollowingModal = () => {
    setModalType('following');
    setModalOpen(true);
  };

  const handleFollowToggle = async () => {
    const previousFollowing = following;
    const newFollowing = !previousFollowing;

    setFollowing(newFollowing);
    setFollowers((prev) => (newFollowing ? prev + 1 : prev - 1));

    try {
      const res = await fetch(`/api/users/${profileUser.id}/follow`, {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Erro ao seguir/deixar de seguir usuário');
      }
      const data = await res.json();
      setFollowing(data.following);

      if (data.following !== newFollowing) {
        setFollowers((prev) => (data.following ? prev + 1 : prev - 1));
      }
    } catch (err) {
      console.error('Erro no follow/unfollow:', err);
      setFollowing(previousFollowing);
      setFollowers(followersCount);
      throw err;
    }
  };

  const fetchUserPosts = async (
    currentCursor: string | null,
    isInitial: boolean,
    targetTab: 'posts' | 'likes' | 'replies'
  ) => {
    setLoading(true);
    try {
      let url: string;
      if (targetTab === 'replies') {
        url = `/api/profile/${profileUser.username}/replies?limit=10${currentCursor ? `&cursor=${currentCursor}` : ''}`;
      } else {
        const paramName = targetTab === 'likes' ? 'likedBy' : 'author';
        url = `/api/posts?${paramName}=${profileUser.username}&useCursor=true&limit=10${currentCursor ? `&cursor=${currentCursor}` : ''}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];
        if (isInitial) {
          setPosts({ tab: targetTab, items });
        } else {
          setPosts((prev) => ({
            tab: targetTab,
            items: [...prev.items, ...items],
          }));
        }
        setNextCursor(data.nextCursor || null);
        setHasMore(!!data.nextCursor);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'posts' || activeTab === 'likes' || activeTab === 'replies') {
      setPosts({ tab: activeTab, items: [] });
      setNextCursor(null);
      setHasMore(true);
      fetchUserPosts(null, true, activeTab);
    }
  }, [profileUser.username, activeTab]);

  const loadMorePosts = () => {
    if (loading || !hasMore) return;
    if (activeTab === 'posts' || activeTab === 'likes' || activeTab === 'replies') {
      fetchUserPosts(nextCursor, false, activeTab);
    }
  };

  const userEarnedSlugs = new Map<string, string>(
    profileUser.badges.map((ub) => [ub.slug, ub.earned_at])
  );

  const mappedBadges = allBadges.map((badge) => {
    const earnedAt = userEarnedSlugs.get(badge.slug);
    return {
      slug: badge.slug,
      label: badge.label,
      description: badge.description,
      icon: badge.icon,
      color: badge.color,
      earned_at: earnedAt ? earnedAt : null,
    };
  });

  const mappedTrails = trails.map((t) => {
    let nextXpThreshold = 500;
    if (t.level === 2) nextXpThreshold = 800;
    else if (t.level === 3) nextXpThreshold = 1100;
    else if (t.level === 4) nextXpThreshold = 1500;
    else if (t.level === 5) nextXpThreshold = 2000;
    else if (t.level >= 6) nextXpThreshold = 2000 + (t.level - 5) * 600;

    return {
      language: t.language,
      xp: t.xp,
      level: t.level,
      maxXp: nextXpThreshold,
    };
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

      <div className="flex-grow flex flex-col md:flex-row min-w-0">
        <main className="flex-grow max-w-2xl w-full border-r border-dd-border/80 min-h-screen bg-dd-bg pb-24 md:pb-8 flex flex-col">
          {/* Header (Twitter style: Back arrow + User name + post count) */}
          <div className="sticky top-0 z-30 bg-dd-bg/95 backdrop-blur-md border-b border-dd-border/60 px-4 py-3 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-dd-surface rounded-full transition-colors text-dd-text cursor-pointer"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-dd-text text-base font-extrabold tracking-tight">
                {profileUser.username}
              </h1>
              <p className="text-dd-muted text-[10px] uppercase font-bold tracking-wider">
                {itemsToRender.length} {itemsToRender.length === 1 ? 'publicação' : 'publicações'}
              </p>
            </div>
          </div>

          {/* Profile Banner (Twitter style gradient) */}
          {localProfileUser.banner_url ? (
            <div className="h-32 sm:h-44 relative border-b border-dd-border/40 overflow-hidden">
              <img
                src={localProfileUser.banner_url}
                alt="Banner do perfil"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-32 sm:h-44 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent relative border-b border-dd-border/40" />
          )}

          {/* Avatar and Edit Profile/Follow Button flex alignment */}
          <div className="flex justify-between items-end px-4">
            <div className="-mt-12 sm:-mt-16 relative">
              {profileUser.avatar_url ? (
                <img
                  src={profileUser.avatar_url}
                  alt={profileUser.username}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-dd-bg object-cover bg-dd-surface ring-2 ring-slate-800/10"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-dd-bg bg-orange-500/10 text-orange-400 flex items-center justify-center text-3xl font-black shadow-[0_0_15px_rgba(249,115,22,0.05)]">
                  {profileUser.username.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="pb-3 flex gap-2">
              {user.id === profileUser.id ? (
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="px-4.5 py-2 border border-dd-border bg-dd-surface hover:bg-dd-border/60 text-dd-text rounded-full text-xs font-black transition-all cursor-pointer active:scale-95"
                >
                  Editar perfil
                </button>
              ) : (
                <FollowButton isFollowing={following} onToggle={handleFollowToggle} />
              )}
            </div>
          </div>

          {/* User Bio and Info section */}
          <div className="px-4 mt-3 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-dd-text text-lg sm:text-xl font-extrabold tracking-tight">
                  {profileUser.username}
                </h2>
                <span className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  {profileUser.total_xp.toLocaleString('pt-BR')} XP Total
                </span>
              </div>
              <p className="text-xs text-dd-muted">@{profileUser.username}</p>
            </div>

            {/* Provider badges (Twitter "Automatizado por" style) */}
            {(localProfileUser.github_username || localProfileUser.discord_username) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                {localProfileUser.github_username && (
                  <a
                    href={`https://github.com/${localProfileUser.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-dd-muted hover:text-dd-text transition-colors cursor-pointer group"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span className="text-[11px] font-semibold">
                      @{localProfileUser.github_username}
                    </span>
                  </a>
                )}
                {localProfileUser.discord_username && (
                  <div className="flex items-center gap-1.5 text-dd-muted">
                    <svg
                      className="h-3.5 w-3.5 fill-current text-[#5865F2]"
                      viewBox="0 0 127.14 96.36"
                    >
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65.62,77.53a107.4,107.4,0,0,0,32,16.29,80.1,80.1,0,0,0,6.72-11,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.65-2.1a77,77,0,0,0,74.5,0c.84.73,1.74,1.43,2.65,2.1a68.6,68.6,0,0,1-10.64,5.12,80.1,80.1,0,0,0,6.72,11,107.4,107.4,0,0,0,32-16.29C130.41,47.55,123.57,24.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.16-12.72,11.43-12.72S53.9,46,53.9,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53s5.16-12.72,11.45-12.72S96.14,46,96.14,53,91,65.69,84.69,65.69Z" />
                    </svg>
                    <span className="text-[11px] font-semibold text-[#5865F2]">
                      {localProfileUser.discord_username}
                    </span>
                  </div>
                )}
              </div>
            )}

            {localProfileUser.bio ? (
              <div className="text-xs text-dd-text leading-relaxed">
                <MarkdownRenderer content={localProfileUser.bio} compact />
              </div>
            ) : (
              <p className="text-xs text-dd-muted italic">Sem biografia fornecida.</p>
            )}

            {/* Institution, Github, Pronouns, Birthday and Joined counters with icons */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-dd-muted uppercase tracking-wider">
              {localProfileUser.institution && (
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-orange-500/80" />
                  <span>{localProfileUser.institution}</span>
                </div>
              )}
              {localProfileUser.pronouns && (
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-orange-500/80" />
                  <span>{localProfileUser.pronouns}</span>
                </div>
              )}
              {localProfileUser.birthday && (
                <div className="flex items-center gap-1.5">
                  <Cake className="w-4 h-4 text-orange-500/80" />
                  <span>Nascido(a) em {formatBirthday(localProfileUser.birthday)}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500/80" />
                <span>{formatJoinedDate(profileUser.created_at)}</span>
              </div>
            </div>

            {/* Followers and Following counters (Twitter style) */}
            <div className="flex items-center gap-4 text-xs">
              <span onClick={showFollowingModal} className="hover:underline cursor-pointer">
                <strong className="text-dd-text font-bold">{followingCount}</strong>{' '}
                <span className="text-dd-muted">Seguindo</span>
              </span>
              <span onClick={showFollowersModal} className="hover:underline cursor-pointer">
                <strong className="text-dd-text font-bold">{followers}</strong>{' '}
                <span className="text-dd-muted">Seguidores</span>
              </span>
            </div>
          </div>

          {/* Tab Selector (Twitter/X style) */}
          <div className="border-b border-dd-border/60 flex select-none mt-5">
            {[
              { id: 'posts', label: 'Postagens' },
              { id: 'replies', label: 'Respostas' },
              { id: 'likes', label: 'Curtidas' },
              { id: 'stats', label: 'Estatísticas' },
              { id: 'trails', label: 'Trilhas' },
              { id: 'badges', label: 'Conquistas' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex-1 py-3 text-xs font-bold transition-colors cursor-pointer text-center ${
                    isSelected
                      ? 'text-dd-text'
                      : 'text-dd-muted hover:text-dd-text hover:bg-dd-surface/30'
                  }`}
                >
                  {tab.label}
                  {isSelected && (
                    <motion.div
                      layoutId="profileTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Conditional Content Rendering */}
          <div className="flex-grow flex flex-col">
            {(activeTab === 'posts' || activeTab === 'likes' || activeTab === 'replies') && (
              <div className="flex flex-col">
                {itemsToRender.length === 0 && !loading ? (
                  <p className="text-xs text-dd-muted italic py-12 text-center border-b border-dd-border/40">
                    {activeTab === 'likes'
                      ? 'Nenhuma curtida encontrada.'
                      : activeTab === 'replies'
                        ? 'Nenhuma resposta encontrada.'
                        : 'Nenhuma publicação encontrada.'}
                  </p>
                ) : (
                  itemsToRender.map((item) => {
                    if (activeTab === 'replies') {
                      return (
                        <div key={item.id} className="border-b border-dd-border/50 last:border-b-0">
                          <ProfileReplyThread reply={item} currentUser={user} />
                        </div>
                      );
                    }
                    return (
                      <div key={item.id} className="border-b border-dd-border/50 last:border-b-0">
                        <PostCard
                          post={item}
                          isOwner={item.author_id === user.id}
                          flat={true}
                          onDelete={(postId) => {
                            setPosts((prev) => ({
                              ...prev,
                              items: prev.items.filter((p) => p.id !== postId),
                            }));
                          }}
                          onEdit={(postId, updatedPost) => {
                            setPosts((prev) => ({
                              ...prev,
                              items: prev.items.map((p) =>
                                p.id === postId ? { ...p, ...updatedPost } : p
                              ),
                            }));
                          }}
                        />
                      </div>
                    );
                  })
                )}

                {loading && (
                  <div className="text-center py-6 border-b border-dd-border/40">
                    <span className="text-xs text-dd-muted animate-pulse font-semibold">
                      Carregando...
                    </span>
                  </div>
                )}

                {hasMore && !loading && (
                  <div className="flex justify-center py-6 border-b border-dd-border/40">
                    <button
                      onClick={loadMorePosts}
                      className="px-5 py-2.5 bg-dd-surface hover:bg-dd-border border border-dd-border text-dd-text rounded-full text-xs font-bold transition-all cursor-pointer hover:border-orange-500/20 active:scale-95"
                    >
                      Carregar Mais
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="p-6 space-y-6 animate-fade-in">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-dd-surface/40 border border-dd-border/60 rounded-2xl p-5 text-center shadow-sm">
                    <div className="text-dd-text text-2xl font-black font-mono">
                      {stats.answers_count}
                    </div>
                    <div className="text-dd-muted text-[10px] uppercase font-bold tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                      <span>Respostas</span>
                    </div>
                  </div>
                  <div className="bg-dd-surface/40 border border-dd-border/60 rounded-2xl p-5 text-center shadow-sm">
                    <div className="text-dd-text text-2xl font-black font-mono">
                      {stats.accuracy}%
                    </div>
                    <div className="text-dd-muted text-[10px] uppercase font-bold tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-orange-500" />
                      <span>Precisão</span>
                    </div>
                  </div>
                  <div className="bg-dd-surface/40 border border-dd-border/60 rounded-2xl p-5 text-center shadow-sm">
                    <div className="text-dd-text text-2xl font-black font-mono">
                      {stats.accepted_count}
                    </div>
                    <div className="text-dd-muted text-[10px] uppercase font-bold tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-orange-500" />
                      <span>Aceitas</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trails' && (
              <div className="p-6 space-y-4 animate-fade-in">
                {mappedTrails.length === 0 ? (
                  <p className="text-xs text-dd-muted italic text-center py-6">
                    Nenhuma trilha iniciada.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mappedTrails.map((trail) => (
                      <LanguageTrailBar
                        key={trail.language}
                        language={trail.language}
                        xp={trail.xp}
                        level={trail.level}
                        maxXp={trail.maxXp}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="p-6 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-dd-border/60 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-dd-text uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-orange-500" />
                      Coleção de Conquistas
                    </h3>
                    <p className="text-dd-muted text-[11px] mt-0.5">
                      Tarefas concluídas na comunidade e emblemas desbloqueados.
                    </p>
                  </div>
                  <Sparkles className="w-4 h-4 text-orange-500/60" />
                </div>
                <BadgeGrid badges={mappedBadges} />
              </div>
            )}
          </div>
        </main>
      </div>

      <FollowersModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={profileUser.id}
        currentUserId={user.id}
        type={modalType}
        title={modalType === 'followers' ? 'Seguidores' : 'Seguindo'}
      />

      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profileUser={localProfileUser}
        onSaved={(updatedFields) => {
          setLocalProfileUser((prev) => ({ ...prev, ...updatedFields }));
        }}
      />
    </div>
  );
}
