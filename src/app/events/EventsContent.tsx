'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Trophy,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Building2,
  Zap,
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  status: string;
  banner_url: string | null;
  min_level: number;
  max_participants: number | null;
  xp_reward: number;
  start_date: string;
  end_date: string;
  creator: { username: string };
  company: { name: string; is_verified: boolean } | null;
  _count: { participants: number };
}

export function EventsContent({ user }: { user: any }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinedMap, setJoinedMap] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        setEvents(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    setJoiningId(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/participate`, {
        method: 'POST',
      });
      if (res.ok) {
        setJoinedMap((prev) => ({ ...prev, [eventId]: true }));
        setMessage('Inscrição no evento realizada com sucesso!');
        loadEvents();
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="dd-platform-shell">
      <Sidebar user={user} />

      <main className="flex-1 min-w-0 max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="border-b border-dd-border pb-5">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
              Competições & Comunidade
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-dd-text mt-2">
            Eventos, Hackathons & Campeonatos
          </h1>
          <p className="text-sm text-dd-muted font-medium mt-1">
            Participe de desafios ao vivo, hackathons patrocinados por empresas e ganhe XP e badges
            exclusivas.
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-xs text-dd-muted font-bold">
            Carregando eventos...
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-dd-surface border border-dd-border space-y-3">
            <Trophy className="w-10 h-10 text-purple-400 mx-auto" />
            <h3 className="text-base font-black text-dd-text">Nenhum evento no momento</h3>
            <p className="text-xs text-dd-muted font-medium max-w-sm mx-auto">
              Fique atento! Novos hackathons e campeonatos semanais são anunciados periodicamente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => {
              const isJoined = joinedMap[ev.id];
              return (
                <div
                  key={ev.id}
                  className="p-6 rounded-3xl bg-dd-surface border border-dd-border flex flex-col justify-between gap-4 hover:border-purple-500/40 transition-all shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                        {ev.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-current" />+{ev.xp_reward} XP
                      </span>
                    </div>

                    <h3 className="text-base font-black text-dd-text">{ev.title}</h3>
                    <p className="text-xs text-dd-muted font-medium line-clamp-3">
                      {ev.description}
                    </p>

                    <div className="pt-2 border-t border-dd-border/60 flex items-center justify-between text-[11px] text-dd-muted font-medium">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {ev._count.participants} inscritos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(ev.start_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinEvent(ev.id)}
                    disabled={isJoined || joiningId === ev.id}
                    className={`w-full py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                      isJoined
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                        : 'bg-purple-500 hover:bg-purple-600 text-white active:scale-95'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Inscrito no Evento
                      </>
                    ) : joiningId === ev.id ? (
                      'Inscrevendo...'
                    ) : (
                      <>
                        <span>Inscrever-se no Evento</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
