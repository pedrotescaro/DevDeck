'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Sidebar } from '@/components/Sidebar';
import { LanguageTag } from '@/components/LanguageTag';
import { ArrowLeft, Users, UserPlus, LogOut, Calendar, Crown, Shield, Globe } from 'lucide-react';
import { Language } from '@prisma/client';

interface GuildDetailProps {
  params: Promise<{ slug: string }>;
}

export default function GuildDetailPage({ params }: GuildDetailProps) {
  const router = useRouter();
  const [guild, setGuild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/guilds/by-slug/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Guilda não encontrada');
        return r.json();
      })
      .then((data) => {
        setGuild(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    fetch('/api/users/me')
      .then((r) => r.ok && r.json())
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  // If we don't have the guild by-slug API yet, fetch from guilds list and find by slug
  useEffect(() => {
    if (!slug || guild) return;
    fetch('/api/guilds')
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (!data.guilds) return;
        const found = data.guilds.find((g: any) => g.slug === slug);
        if (found) {
          fetch(`/api/guilds/${found.id}`)
            .then((r) => r.ok && r.json())
            .then((g) => {
              setGuild(g);
              setLoading(false);
            });
        }
      });
  }, [slug, guild]);

  const handleJoin = async () => {
    if (!guild) return;
    try {
      const res = await fetch(`/api/guilds/${guild.id}/members`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setGuild((prev: any) => ({
          ...prev,
          isMember: true,
          userRole: 'MEMBER',
          members: [
            ...prev.members,
            {
              id: data.membership.id,
              role: 'MEMBER',
              joined_at: data.membership.joined_at,
              user: data.membership.user,
            },
          ],
          memberCount: prev.memberCount + 1,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async () => {
    if (!guild) return;
    try {
      const res = await fetch(`/api/guilds/${guild.id}/members`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/guilds');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const roleIcon: Record<string, any> = {
    OWNER: Crown,
    ADMIN: Shield,
    MEMBER: Users,
  };

  const roleLabel: Record<string, string> = {
    OWNER: 'Líder',
    ADMIN: 'Admin',
    MEMBER: 'Membro',
  };

  const roleColor: Record<string, string> = {
    OWNER: 'text-amber-400',
    ADMIN: 'text-blue-400',
    MEMBER: 'text-dd-muted',
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-dd-bg items-center justify-center">
        <div className="text-xs text-dd-muted animate-pulse font-semibold">Carregando...</div>
      </div>
    );
  }

  if (error || !guild) {
    return (
      <div className="flex flex-col min-h-screen bg-dd-bg items-center justify-center gap-4">
        <p className="text-sm text-dd-muted">{error || 'Guilda não encontrada'}</p>
        <Link
          href="/guilds"
          className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors"
        >
          ← Voltar para Guildas
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />
      <div className="flex-grow flex flex-col md:flex-row min-w-0">
        <main className="flex-grow max-w-2xl w-full border-r border-dd-border/80 min-h-screen pb-24 md:pb-8">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-dd-bg/95 backdrop-blur-md border-b border-dd-border/60 px-5 py-4 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-dd-surface rounded-full transition-colors text-dd-text cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-dd-text">{guild.name}</h1>
              <p className="text-[10px] text-dd-muted uppercase font-bold tracking-wider">
                {guild.memberCount} {guild.memberCount === 1 ? 'membro' : 'membros'}
              </p>
            </div>
          </div>

          {/* Guild Banner/Info */}
          <div className="h-32 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border-b border-dd-border/40 flex items-end px-5 pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-orange-500/20">
              {guild.name[0].toUpperCase()}
            </div>
          </div>

          {/* Guild Details */}
          <div className="px-5 pt-4 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold">{guild.name}</h2>
                  {guild.language && <LanguageTag language={guild.language as Language} />}
                </div>
                <p className="text-xs text-dd-muted mt-1">
                  Criada em {formatDate(guild.created_at)} por{' '}
                  <span className="text-orange-400 font-semibold">@{guild.owner.username}</span>
                </p>
              </div>
              <div>
                {!guild.isMember ? (
                  <button
                    onClick={handleJoin}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Entrar
                  </button>
                ) : guild.userRole !== 'OWNER' ? (
                  <button
                    onClick={handleLeave}
                    className="border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair
                  </button>
                ) : null}
              </div>
            </div>

            {guild.description && (
              <div className="bg-dd-surface/30 border border-dd-border/60 rounded-xl p-4">
                <p className="text-xs text-dd-text leading-relaxed">{guild.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-dd-surface/40 border border-dd-border/60 rounded-xl p-4 text-center">
                <Users className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-black text-dd-text">{guild.memberCount}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-dd-muted">
                  Membros
                </div>
              </div>
              <div className="bg-dd-surface/40 border border-dd-border/60 rounded-xl p-4 text-center">
                <Calendar className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-black text-dd-text">
                  {new Date(guild.created_at).toLocaleDateString('pt-BR', { month: 'short' })}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-dd-muted">
                  Criada em
                </div>
              </div>
              <div className="bg-dd-surface/40 border border-dd-border/60 rounded-xl p-4 text-center">
                <Globe className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-black text-dd-text">
                  {guild.is_public ? 'Pública' : 'Privada'}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-dd-muted">
                  Tipo
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="pt-2">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-dd-muted mb-3 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-orange-500" />
                Membros ({guild.memberCount})
              </h3>
              <div className="space-y-1">
                {guild.members?.map((member: any) => {
                  const RoleIcon = roleIcon[member.role] || Users;
                  return (
                    <Link
                      key={member.id}
                      href={`/profile/${member.user.username}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-dd-surface/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {member.user.avatar_url ? (
                          <Image
                            src={member.user.avatar_url}
                            alt={member.user.username}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full object-cover border border-dd-border shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-sm font-bold shrink-0">
                            {member.user.username[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-dd-text truncate group-hover:text-orange-400 transition-colors">
                              {member.user.username}
                            </p>
                            <RoleIcon
                              className={`w-3 h-3 ${roleColor[member.role] || 'text-dd-muted'}`}
                            />
                          </div>
                          <p className="text-[10px] text-dd-muted">
                            {roleLabel[member.role] || 'Membro'} · Entrou em{' '}
                            {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-dd-muted font-bold">
                        {member.user.total_xp?.toLocaleString() || 0} XP
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
