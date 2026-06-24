'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { LanguageTag } from '@/components/LanguageTag';
import { Users, Plus, X, Sparkles, Search } from 'lucide-react';
import { Language } from '@prisma/client';

interface GuildData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  language: string | null;
  memberCount: number;
  owner: { username: string; avatar_url: string | null };
  createdAt: string;
}

interface GuildsClientProps {
  initialGuilds?: GuildData[];
  initialMyGuilds?: GuildData[];
}

export function GuildsClient({ initialGuilds = [], initialMyGuilds = [] }: GuildsClientProps) {
  const router = useRouter();
  const [guilds, setGuilds] = useState<GuildData[]>(initialGuilds);
  const [myGuilds, setMyGuilds] = useState<GuildData[]>(initialMyGuilds);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createLanguage, setCreateLanguage] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/users/me')
      .then((r) => r.ok && r.json())
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Only re-fetch if no initial data was provided
    if (initialGuilds.length === 0 && initialMyGuilds.length === 0) {
      fetch('/api/guilds')
        .then((r) => r.ok && r.json())
        .then((data) => {
          if (data.guilds) setGuilds(data.guilds);
          if (data.myGuilds) setMyGuilds(data.myGuilds);
        })
        .catch(() => {});
    }
  }, [initialGuilds.length, initialMyGuilds.length]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim() || createName.trim().length < 3) {
      setCreateError('O nome deve ter pelo menos 3 caracteres');
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch('/api/guilds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName.trim(),
          description: createDescription.trim() || null,
          language: createLanguage || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreateName('');
        setCreateDescription('');
        setCreateLanguage('');
        setShowCreateForm(false);
        router.push(`/guilds/${data.slug}`);
      } else {
        const err = await res.json();
        setCreateError(err.message || 'Erro ao criar guilda');
      }
    } catch {
      setCreateError('Erro de conexão');
    } finally {
      setCreating(false);
    }
  };

  const filteredGuilds = guilds.filter(
    (g) =>
      !searchQuery.trim() ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />
      <div className="flex-grow flex flex-col md:flex-row min-w-0">
        <main className="flex-grow max-w-2xl w-full border-r border-dd-border/80 min-h-screen pb-24 md:pb-8">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-dd-bg/95 backdrop-blur-md border-b border-dd-border/60 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-extrabold text-dd-text flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  Guildas
                </h1>
                <p className="text-xs text-dd-muted mt-0.5">
                  Grupos de estudo por linguagem ou interesse
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                {showCreateForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showCreateForm ? 'Cancelar' : 'Criar Guilda'}
              </button>
            </div>

            {/* Search */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dd-muted" />
              <input
                type="text"
                placeholder="Buscar guildas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-dd-search-bg border border-dd-search-border rounded-full text-xs text-dd-text placeholder-dd-muted focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="mx-5 mt-5 p-5 rounded-xl border border-orange-500/30 bg-dd-surface/80 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-dd-text mb-4">Nova Guilda</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-dd-muted block mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Ex: Rustaceans BR"
                    className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg px-3 py-2.5 text-dd-text placeholder-slate-600 focus:border-orange-500/60 focus:outline-none"
                    required
                    minLength={3}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-dd-muted block mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={createDescription}
                    onChange={(e) => setCreateDescription(e.target.value)}
                    placeholder="Qual o foco da sua guilda?"
                    rows={2}
                    className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg px-3 py-2.5 text-dd-text placeholder-slate-600 focus:border-orange-500/60 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-dd-muted block mb-1">
                    Linguagem (opcional)
                  </label>
                  <select
                    value={createLanguage}
                    onChange={(e) => setCreateLanguage(e.target.value)}
                    className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg px-3 py-2.5 text-dd-text focus:border-orange-500/60 focus:outline-none cursor-pointer"
                  >
                    <option value="">Todas as linguagens</option>
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
                {createError && (
                  <p className="text-[11px] font-semibold text-red-400">{createError}</p>
                )}
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {creating ? 'Criando...' : 'Criar Guilda'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Guilds */}
          {myGuilds.length > 0 && (
            <div className="px-5 pt-5">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-dd-muted mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-orange-500" />
                Minhas Guildas
              </h2>
              <div className="space-y-2">
                {myGuilds.map((g) => (
                  <Link
                    key={g.id}
                    href={`/guilds/${g.slug}`}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {g.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-dd-text truncate">{g.name}</p>
                        <p className="text-[10px] text-dd-muted">{g.memberCount} membros</p>
                      </div>
                    </div>
                    <Users className="w-4 h-4 text-dd-muted group-hover:text-orange-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Guilds */}
          <div className="px-5 pt-5 pb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-dd-muted mb-3">
              {searchQuery.trim() ? `Resultados para "${searchQuery}"` : 'Todas as Guildas'}
            </h2>
            {filteredGuilds.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-dd-muted/40 mx-auto mb-3" />
                <p className="text-xs text-dd-muted">
                  {searchQuery.trim()
                    ? 'Nenhuma guilda encontrada para esta busca.'
                    : 'Nenhuma guilda ainda. Crie a primeira!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredGuilds.map((g) => (
                  <Link
                    key={g.id}
                    href={`/guilds/${g.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-dd-border bg-dd-surface/30 hover:bg-dd-surface/60 hover:border-orange-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-400 flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                        {g.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-dd-text truncate">{g.name}</p>
                          {g.language && (
                            <LanguageTag language={g.language as Language} size="sm" />
                          )}
                        </div>
                        {g.description && (
                          <p className="text-[11px] text-dd-muted line-clamp-1 mt-0.5">
                            {g.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-dd-muted mt-1">
                          <span>
                            {g.memberCount} {g.memberCount === 1 ? 'membro' : 'membros'}
                          </span>
                          <span>·</span>
                          <span>Criado por @{g.owner.username}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
