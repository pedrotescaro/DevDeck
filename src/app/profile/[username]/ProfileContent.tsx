'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ProfileHeader } from '@/components/ProfileHeader';
import { BadgeGrid } from '@/components/BadgeGrid';
import { PostCard } from '@/components/PostCard';
import { Footer } from '@/components/Footer';
import { FollowersModal } from '@/components/motion/FollowersModal';
import { Award, Sparkles } from 'lucide-react';

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
  const [posts, setPosts] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [following, setFollowing] = useState(isFollowing);
  const [followers, setFollowers] = useState(followersCount);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>('followers');

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

    // Atualização otimista do estado de seguindo e do número de seguidores
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

      // Sincroniza caso o resultado do servidor seja diferente do otimista
      if (data.following !== newFollowing) {
        setFollowers((prev) => (data.following ? prev + 1 : prev - 1));
      }
    } catch (err) {
      console.error('Erro no follow/unfollow:', err);
      // Reverte o estado em caso de erro
      setFollowing(previousFollowing);
      setFollowers(followersCount);
      throw err; // Permite que o FollowButton reverta seu estado otimista
    }
  };

  const fetchUserPosts = async (currentCursor: string | null, isInitial: boolean) => {
    setLoading(true);
    try {
      const url = `/api/posts?author=${profileUser.username}&useCursor=true&limit=10${currentCursor ? `&cursor=${currentCursor}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];
        if (isInitial) {
          setPosts(items);
        } else {
          setPosts((prev) => [...prev, ...items]);
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
    fetchUserPosts(null, true);
  }, [profileUser.username]);

  const loadMorePosts = () => {
    if (loading || !hasMore) return;
    fetchUserPosts(nextCursor, false);
  };

  // Mapear todas as conquistas do sistema marcando quais foram ganhas por este usuário
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

  // Mapear as trilhas para o formato esperado pelo ProfileHeader
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

      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col min-w-0 space-y-8">
          {/* Cabeçalho do Perfil (Com estatísticas e trilhas de XP) */}
          <ProfileHeader
            user={profileUser}
            stats={stats}
            trails={mappedTrails}
            isFollowing={following}
            onFollowToggle={handleFollowToggle}
            showFollowButton={user.id !== profileUser.id}
            followersCount={followers}
            followingCount={followingCount}
            onShowFollowers={showFollowersModal}
            onShowFollowing={showFollowingModal}
          />

          {/* Quadro de Badges/Conquistas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-dd-border pb-3">
              <div>
                <h2 className="text-base font-extrabold text-dd-text uppercase tracking-wider text-[11px] text-dd-muted flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  Coleção de Badges & Conquistas
                </h2>
                <p className="text-dd-muted text-xs mt-0.5">
                  Complete tarefas na comunidade para desbloquear conquistas exclusivas.
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-orange-500/60" />
            </div>

            <BadgeGrid badges={mappedBadges} />
          </div>

          {/* Histórico de Postagens */}
          <div className="space-y-4 pt-4 border-t border-dd-border">
            <div className="flex items-center justify-between border-b border-dd-border pb-3">
              <div>
                <h2 className="text-base font-extrabold text-dd-text uppercase tracking-wider text-[11px] text-dd-muted flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-500"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Postagens de @{profileUser.username}
                </h2>
                <p className="text-dd-muted text-xs mt-0.5">
                  Todas as dúvidas e discussões publicadas pelo desenvolvedor.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {posts.length === 0 && !loading ? (
                <p className="text-xs text-dd-muted italic py-4 text-center border border-dd-border border-dashed rounded-xl bg-dd-surface/5">
                  Nenhuma publicação encontrada.
                </p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isOwner={post.author_id === user.id}
                      onDelete={(postId) => {
                        setPosts((prev) => prev.filter((p) => p.id !== postId));
                      }}
                    />
                  ))}
                </div>
              )}

              {loading && (
                <div className="text-center py-4">
                  <span className="text-xs text-dd-muted animate-pulse font-semibold">
                    Carregando postagens...
                  </span>
                </div>
              )}

              {hasMore && !loading && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={loadMorePosts}
                    className="px-5 py-2.5 bg-dd-surface hover:bg-dd-border border border-dd-border text-dd-text rounded-xl text-xs font-bold transition-all cursor-pointer hover:border-orange-500/20 active:scale-95"
                  >
                    Carregar Mais
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <FollowersModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={profileUser.id}
        currentUserId={user.id}
        type={modalType}
        title={modalType === 'followers' ? 'Seguidores' : 'Seguindo'}
      />
    </div>
  );
}
