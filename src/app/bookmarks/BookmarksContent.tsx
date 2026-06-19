'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { PostCard } from '@/components/PostCard';
import { springGentle } from '@/lib/motion';
import { ArrowLeft, Search, Bookmark, Sparkles } from 'lucide-react';

interface BookmarksContentProps {
  user: {
    id: string;
    username: string;
    avatar_url?: string | null;
    total_xp: number;
  };
  initialPosts: any[];
}

export function BookmarksContent({ user, initialPosts }: BookmarksContentProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');

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
        method: 'POST',
      });
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
      // Caso dê erro, re-adicionar o post
      const originalPost = initialPosts.find((p) => p.id === postId);
      if (originalPost) {
        setPosts((prev) => [originalPost, ...prev].sort((a, b) => b.id.localeCompare(a.id)));
      }
    }
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
                {posts.length} {posts.length === 1 ? 'publicação salva' : 'publicações salvas'}
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
          <div className="flex flex-col">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 px-6 bg-dd-surface/20 border border-dd-border border-dashed rounded-2xl space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-dd-text">
                    {searchQuery.trim()
                      ? 'Nenhum resultado encontrado'
                      : 'Salvar publicações para depois'}
                  </h3>
                  <p className="text-[11px] text-dd-muted leading-relaxed">
                    {searchQuery.trim()
                      ? 'Experimente buscar por outros termos de título, tags ou conteúdo.'
                      : 'Não deixe posts interessantes passarem! Salve-os em sua barra de ações para ler ou estudar com calma mais tarde.'}
                  </p>
                </div>
              </div>
            ) : (
              <LayoutGroup>
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={springGentle}
                      className="border-b border-dd-border/50 last:border-b-0"
                    >
                      <PostCard
                        post={post}
                        isOwner={post.author.username === user.username}
                        flat={true}
                        onBookmarkToggle={(postId, isBookmarked) => {
                          if (!isBookmarked) {
                            handleBookmarkToggle(postId);
                          }
                        }}
                      />
                      {post.quizzes && post.quizzes.length > 0 && (
                        <div className="pl-4 pb-4 sm:pl-5 sm:pb-5 bg-transparent flex justify-start">
                          <Link
                            href={`/post/${post.id}`}
                            className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-1.5 font-bold text-white transition-colors hover:bg-orange-600 shadow-sm cursor-pointer text-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Resolver como Quiz</span>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  ))}
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
