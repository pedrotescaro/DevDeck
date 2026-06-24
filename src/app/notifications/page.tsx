'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { PostSkeletonList } from '@/components/motion/PostSkeleton';
import { EmptyState } from '@/components/motion/EmptyState';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Bell, MessageSquare, Sparkles, Swords, Settings, Heart, X } from 'lucide-react';
import Link from 'next/link';

interface UpvoterUser {
  username: string;
  avatar_url: string | null;
}

interface NotificationItem {
  id: string;
  user_id: string;
  type: 'ANSWER' | 'XP' | 'DUEL' | 'SYSTEM' | 'LIKE' | string;
  title: string;
  content: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
  postTitle?: string;
  postBody?: string;
  upvoters?: UpvoterUser[];
}

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tudo' | 'prioridade' | 'mencoes'>('tudo');
  const [showPushBanner, setShowPushBanner] = useState(true);

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

        // Fetch notifications
        const resNotifications = await fetch('/api/notifications');
        if (resNotifications.ok) {
          const notifs = await resNotifications.json();
          setNotifications(notifs);
        }
      } catch (err) {
        console.error('Error fetching notifications page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleMarkAllAsRead = useCallback(async () => {
    if (notifications.every((n) => n.is_read)) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        router.refresh();
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  }, [notifications, router]);

  useEffect(() => {
    if (notifications.length > 0 && notifications.some((n) => !n.is_read)) {
      const timer = setTimeout(() => {
        handleMarkAllAsRead();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifications, handleMarkAllAsRead]);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours} h`;
    return `Há ${diffDays} dias`;
  };

  // Filter notifications based on tab
  const getFilteredNotifications = () => {
    if (activeTab === 'mencoes') {
      // Return notifications that reference @username
      return notifications.filter((n) => n.content.includes(`@${user?.username}`));
    }
    if (activeTab === 'prioridade') {
      // Prioritize ANSWER and DUEL types
      return notifications.filter((n) => n.type === 'ANSWER' || n.type === 'DUEL');
    }
    return notifications; // 'tudo'
  };

  const getNotificationIcon = (type: string) => {
    const base = 'w-9 h-9 rounded-full flex items-center justify-center shrink-0';
    switch (type) {
      case 'LIKE':
        return (
          <div className={cn(base, 'text-dd-amber bg-dd-amber/10')}>
            <Heart className="w-4 h-4 fill-current" />
          </div>
        );
      case 'ANSWER':
        return (
          <div className={cn(base, 'text-dd-blue bg-dd-blue/10')}>
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case 'XP':
        return (
          <div className={cn(base, 'text-dd-green bg-dd-green/10')}>
            <Sparkles className="w-4 h-4" />
          </div>
        );
      case 'DUEL':
        return (
          <div className={cn(base, 'text-orange-500 bg-orange-500/10')}>
            <Swords className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className={cn(base, 'text-dd-purple bg-dd-purple/10')}>
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  const filteredNotifs = getFilteredNotifications();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

      <div className="flex-grow flex flex-col md:flex-row min-w-0">
        <main className="flex-grow max-w-2xl w-full border-r border-dd-border/80 min-h-screen bg-dd-bg pb-24 md:pb-8">
          {/* Header (Matching image 3 style) */}
          <div className="sticky top-0 z-30 bg-dd-bg/95 backdrop-blur-md border-b border-dd-border/60">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-lg font-black tracking-tight text-dd-text">Notificações</h1>
              <button className="p-2 text-dd-text hover:bg-dd-surface/60 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs (Tudo, Prioridade, Menções) */}
            <div className="flex border-t border-dd-border/40">
              {(['tudo', 'prioridade', 'mencoes'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-3.5 text-xs font-bold text-center relative hover:bg-dd-surface/30 transition-colors"
                >
                  <span
                    className={
                      activeTab === tab ? 'text-dd-text font-black' : 'text-dd-muted font-bold'
                    }
                  >
                    {tab === 'tudo' ? 'Tudo' : tab === 'prioridade' ? 'Prioridade' : 'Menções'}
                  </span>
                  {activeTab === tab && (
                    <motion.span
                      layoutId="notifTabIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-orange-500"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* List of Notifications */}
          <motion.div
            className="divide-y divide-dd-border/50"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="show"
          >
            {loading ? (
              <div className="p-4">
                <PostSkeletonList count={4} />
              </div>
            ) : filteredNotifs.length === 0 ? (
              <EmptyState type="notifications" className="p-12" />
            ) : (
              filteredNotifs.map((item) => {
                if (item.type === 'LIKE' && item.upvoters && item.upvoters.length > 0) {
                  // Aggregated Likes layout
                  const firstUpvoter = item.upvoters[0];
                  const otherCount = item.upvoters.length - 1;

                  return (
                    <motion.div
                      key={item.id}
                      variants={staggerItemVariants}
                      className="p-4 flex gap-3 hover:bg-dd-surface/20 transition-colors"
                    >
                      <div className="shrink-0 pt-0.5">{getNotificationIcon('LIKE')}</div>

                      {/* Right: Aggregated Details */}
                      <div className="flex-1 space-y-2">
                        {/* Avatar stack */}
                        <div className="flex items-center -space-x-2.5 overflow-hidden">
                          {item.upvoters.slice(0, 10).map((voter, idx) =>
                            voter.avatar_url ? (
                              <Image
                                key={idx}
                                src={voter.avatar_url}
                                alt={voter.username}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full border-2 border-black object-cover shrink-0"
                              />
                            ) : (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded-full border-2 border-black bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold shrink-0"
                              >
                                {voter.username.slice(0, 2).toUpperCase()}
                              </div>
                            )
                          )}
                        </div>

                        {/* Text */}
                        <div className="text-xs leading-relaxed text-dd-text">
                          <span className="font-extrabold">{firstUpvoter.username}</span>
                          {otherCount > 0 && (
                            <>
                              {' '}
                              e mais <span className="font-extrabold">{otherCount}</span>
                            </>
                          )}{' '}
                          curtiram seu post{' '}
                          <span className="text-dd-muted font-normal">
                            · {formatTimeAgo(item.created_at)}
                          </span>
                        </div>

                        {/* Snippet */}
                        {item.postBody && (
                          <Link
                            href={item.link || '#'}
                            className="block text-xs text-dd-muted leading-relaxed hover:text-dd-text transition-colors line-clamp-2"
                          >
                            {item.postBody}
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                }

                // Standard notification layout (for XP, Answer, Duel, System)
                return (
                  <motion.div
                    key={item.id}
                    variants={staggerItemVariants}
                    className="p-4 flex gap-3 hover:bg-dd-surface/20 transition-colors"
                  >
                    <div className="shrink-0 pt-0.5">{getNotificationIcon(item.type)}</div>

                    {/* Right text details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-dd-text">{item.title}</p>
                        <span className="text-[9.5px] text-dd-muted font-medium shrink-0">
                          {formatTimeAgo(item.created_at)}
                        </span>
                      </div>

                      <p className="text-xs text-dd-muted leading-relaxed">{item.content}</p>

                      {item.link && (
                        <div className="pt-1.5">
                          <Link
                            href={item.link}
                            className="text-[10px] font-black text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-0.5"
                          >
                            Ir para atividade →
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          {/* Push Notifications Banner (At bottom of viewport, matching image 3) */}
          {showPushBanner && (
            <div className="mx-4 mt-6 p-4 rounded-xl border border-dd-border bg-dd-surface/80 backdrop-blur-md relative space-y-2.5">
              <button
                onClick={() => setShowPushBanner(false)}
                className="absolute top-3 right-3 text-dd-muted hover:text-dd-text p-0.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="text-sm font-black text-dd-text">Notificações por push</h4>
              <p className="text-xs text-dd-muted leading-relaxed max-w-md">
                Ative as notificações por push para não perder nunca o que está acontecendo no
                DevDeck.
              </p>
              <button
                onClick={() => {
                  alert('Notificações por push ativadas com sucesso!');
                  setShowPushBanner(false);
                }}
                className="bg-white hover:bg-slate-100 text-black text-xs font-black py-2 px-4 rounded-full transition-all"
              >
                Ativar Notificações
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
