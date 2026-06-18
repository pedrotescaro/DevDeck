'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import {
  Settings,
  User,
  GraduationCap,
  FileText,
  LogOut,
  Check,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [institution, setInstitution] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Theme preference state & handler
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const changeTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Sound preference state & handler
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(localStorage.getItem('devdeck-sound') !== 'false');
  }, []);

  const toggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    localStorage.setItem('devdeck-sound', String(newVal));
    window.dispatchEvent(new Event('devdeck-sound-changed'));
  };

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

        const res = await fetch(
          `/api/profile/${authUser.user_metadata?.username || authUser.email?.split('@')[0]}`
        );
        if (res.ok) {
          const profileData = await res.json();
          setUser({
            ...profileData.user,
            id: authUser.id,
          });
          setBio(profileData.user.bio || '');
          setInstitution(profileData.user.institution || '');
          setGithubUsername(profileData.user.github_username || '');
        }
      } catch (err) {
        console.error('Error fetching settings user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio, institution, github_username: githubUsername }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Erro ao atualizar dados.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro interno no servidor.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-dd-bg items-center justify-center text-dd-text antialiased">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="text-xs text-dd-muted">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow max-w-2xl w-full mx-auto px-4 py-8 pb-24 md:pb-8 flex flex-col min-w-0 space-y-6">
          {/* Title Banner */}
          <div className="bg-dd-surface border border-dd-border rounded-xl p-5 backdrop-blur-sm shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-dd-text">Configurações da Conta</h1>
              <p className="text-dd-muted text-xs mt-0.5">
                Atualize os dados públicos do seu perfil ou encerre sua sessão.
              </p>
            </div>
          </div>

          {/* Profile Info Form */}
          <div className="bg-dd-surface border border-dd-border rounded-xl p-6 space-y-6 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 border-b border-dd-border pb-3">
              <User className="w-4 h-4 text-orange-500/85" />
              <h2 className="text-xs font-bold text-dd-muted uppercase tracking-wider">
                Informações Públicas
              </h2>
            </div>

            {success && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Perfil atualizado com sucesso!</span>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label
                  className="block text-[11px] font-bold text-dd-muted uppercase tracking-wider mb-2"
                  htmlFor="username"
                >
                  Nome de Usuário (Não pode ser alterado)
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    disabled
                    value={user?.username || ''}
                    className="w-full rounded-lg border border-dd-border bg-dd-bg/40 px-4 py-2 text-xs text-dd-muted cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-[11px] font-bold text-dd-muted uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  htmlFor="institution"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-dd-muted" />
                  Instituição / Empresa
                </label>
                <input
                  id="institution"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full rounded-lg border border-dd-border bg-dd-bg/80 px-4 py-2.5 text-xs text-dd-text focus:border-orange-500/60 focus:outline-none transition-colors"
                  placeholder="Ex: USP, Vercel, Freelancer"
                />
              </div>

              <div>
                <label
                  className="block text-[11px] font-bold text-dd-muted uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  htmlFor="githubUsername"
                >
                  <svg className="h-3.5 w-3.5 text-dd-muted fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Nome de Usuário do GitHub
                </label>
                <input
                  id="githubUsername"
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                  className="w-full rounded-lg border border-dd-border bg-dd-bg/80 px-4 py-2.5 text-xs text-dd-text focus:border-orange-500/60 focus:outline-none transition-colors"
                  placeholder="Ex: seu-usuario-github"
                />
              </div>

              <div>
                <label
                  className="block text-[11px] font-bold text-dd-muted uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  htmlFor="bio"
                >
                  <FileText className="w-3.5 h-3.5 text-dd-muted" />
                  Biografia / Sobre Mim
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs rounded-lg border border-dd-border bg-dd-bg/80 px-4 py-2.5 text-dd-text placeholder-slate-600 focus:border-orange-500/60 focus:outline-none resize-none transition-colors"
                  placeholder="Fale um pouco sobre você, tecnologias favoritas..."
                />
              </div>

              <div className="flex justify-end pt-2 border-t border-dd-border">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-orange-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors hover:bg-orange-600 disabled:opacity-50 cursor-pointer shadow-md shadow-orange-500/10"
                >
                  {updating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>

          {/* Appearance Settings */}
          <div className="bg-dd-surface border border-dd-border rounded-xl p-6 space-y-4 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 border-b border-dd-border pb-3">
              <Sun className="w-4 h-4 text-orange-500/85" />
              <h2 className="text-xs font-bold text-dd-muted uppercase tracking-wider">
                Aparência da Plataforma
              </h2>
            </div>
            <p className="text-dd-muted text-xs leading-relaxed">
              Escolha a sua preferência de exibição visual para navegar na rede.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Dark Theme Card */}
              <button
                type="button"
                onClick={() => changeTheme('dark')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                  theme === 'dark'
                    ? 'border-orange-500 bg-orange-500/[0.03] text-dd-text shadow-[0_0_15px_rgba(249,115,22,0.05)]'
                    : 'border-dd-border bg-dd-bg/40 text-dd-muted hover:border-dd-border/80 hover:text-dd-text'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Moon
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-orange-400' : 'text-dd-muted'}`}
                  />
                  {theme === 'dark' && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                </div>
                <div className="w-full">
                  <p className="text-xs font-bold">Modo Escuro</p>
                  <p className="text-[10px] text-dd-muted mt-0.5 font-semibold">
                    Foco no código e menor fadiga ocular.
                  </p>
                </div>
              </button>

              {/* Light Theme Card */}
              <button
                type="button"
                onClick={() => changeTheme('light')}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                  theme === 'light'
                    ? 'border-orange-500 bg-orange-500/[0.03] text-dd-text shadow-[0_0_15px_rgba(249,115,22,0.05)]'
                    : 'border-dd-border bg-dd-bg/40 text-dd-muted hover:border-dd-border/80 hover:text-dd-text'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Sun
                    className={`w-5 h-5 ${theme === 'light' ? 'text-amber-500' : 'text-dd-muted'}`}
                  />
                  {theme === 'light' && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                </div>
                <div className="w-full">
                  <p className="text-xs font-bold">Modo Claro</p>
                  <p className="text-[10px] text-dd-muted mt-0.5 font-semibold">
                    Estilo limpo e alto contraste de leitura.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Sound Settings */}
          <div className="bg-dd-surface border border-dd-border rounded-xl p-6 space-y-4 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 border-b border-dd-border pb-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-orange-500/85"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <h2 className="text-xs font-bold text-dd-muted uppercase tracking-wider">
                Efeitos Sonoros
              </h2>
            </div>
            <p className="text-dd-muted text-xs leading-relaxed">
              Ative ou desative os sons de interações (curtidas, notificações e recompensas).
            </p>

            <div className="flex justify-between items-center bg-dd-surface border border-dd-border rounded-xl p-4 text-sm backdrop-blur-sm shadow-sm select-none">
              <span className="text-dd-text font-bold tracking-wide flex items-center gap-2">
                {soundEnabled ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-orange-500 animate-pulse"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-dd-muted"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                )}
                Efeitos Sonoros da Plataforma
              </span>
              <button
                type="button"
                onClick={toggleSound}
                className={`px-4 py-2 rounded-lg border text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-[0.97] cursor-pointer ${
                  soundEnabled
                    ? 'bg-orange-500 border-orange-600 text-white shadow-md shadow-orange-500/10 hover:bg-orange-600'
                    : 'bg-dd-surface border-dd-border text-dd-muted hover:text-dd-text hover:bg-dd-border/30'
                }`}
              >
                {soundEnabled ? 'LIGADO' : 'DESLIGADO'}
              </button>
            </div>
          </div>

          {/* Security / Logout Panel */}
          <div className="bg-dd-surface border border-dd-border rounded-xl p-6 space-y-4 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 border-b border-dd-border pb-3">
              <LogOut className="w-4 h-4 text-red-400" />
              <h2 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Ações da Conta
              </h2>
            </div>

            <p className="text-dd-muted text-xs leading-relaxed">
              Encerre sua sessão de desenvolvimento atual no dispositivo.
            </p>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/15 text-xs font-bold px-5 py-2.5 transition-colors cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair da Conta (Logout)
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
