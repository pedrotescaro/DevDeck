'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('lp-landing-page');
    return () => {
      document.documentElement.classList.remove('lp-landing-page');
    };
  }, []);

  const handleGithubLogin = async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao autenticar com o GitHub. Tente novamente.');
    }
  };

  const handleDiscordLogin = async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao autenticar com o Discord. Tente novamente.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Chamar nossa API customizada de cadastro (valida, cria no auth e sincroniza no Prisma)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao tentar cadastrar.');
        setLoading(false);
        return;
      }

      // 2. Realizar login automático no Supabase
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(
          'Conta criada com sucesso, mas ocorreu um erro ao entrar automaticamente. Faça login manualmente.'
        );
        setLoading(false);
        router.push('/login');
        return;
      }

      router.push('/feed');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro no servidor. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--lp-bg)] text-[var(--lp-fg)] antialiased px-6 py-12 relative overflow-hidden select-none">
      {/* Subtle background glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none select-none opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, #F5762B 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Top Left back link */}
      <div className="absolute top-6 left-6 z-30">
        <Link
          href="/"
          className="flex items-center gap-2 group lp-font-heading text-xs tracking-wider uppercase text-[var(--lp-muted)] hover:text-[var(--lp-fg)] transition-colors"
        >
          <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Voltar para a Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md rounded-2xl p-8 bg-[var(--lp-bg-card)] border border-[var(--lp-border)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 mb-3.5 group">
            <Image
              src="/logo.png"
              alt="DevDeck Logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="lp-font-heading font-semibold text-lg tracking-wide text-[var(--lp-fg)]">
              DevDeck
            </span>
          </Link>
          <h2 className="lp-font-heading text-2xl font-bold tracking-tight text-[var(--lp-fg)] mb-1">
            Criar Conta
          </h2>
          <p className="text-xs font-medium text-[var(--lp-muted)]">
            Crie sua conta para começar a subir de nível.
          </p>
        </div>

        {error && (
          <div
            className="mb-5 rounded-lg border p-3 text-xs lp-font-mono leading-relaxed"
            style={{
              backgroundColor: 'rgba(239,68,68,0.06)',
              borderColor: 'rgba(239,68,68,0.2)',
              color: '#FCA5A5',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label
              className="lp-font-mono text-[10px] tracking-wider uppercase text-[var(--lp-muted)] mb-1.5 block"
              htmlFor="username"
            >
              Nome de Usuário (Ex: dev_pedro)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 py-3 text-sm lp-font-mono text-[var(--lp-fg)] placeholder-[var(--lp-muted-2)] focus:border-[var(--lp-accent)] focus:ring-1 focus:ring-[var(--lp-accent)] focus:outline-none transition-all duration-200"
              placeholder="seu_username"
            />
          </div>

          <div>
            <label
              className="lp-font-mono text-[10px] tracking-wider uppercase text-[var(--lp-muted)] mb-1.5 block"
              htmlFor="email"
            >
              Endereço de E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 py-3 text-sm lp-font-mono text-[var(--lp-fg)] placeholder-[var(--lp-muted-2)] focus:border-[var(--lp-accent)] focus:ring-1 focus:ring-[var(--lp-accent)] focus:outline-none transition-all duration-200"
              placeholder="seu-email@dev.com"
            />
          </div>

          <div>
            <label
              className="lp-font-mono text-[10px] tracking-wider uppercase text-[var(--lp-muted)] mb-1.5 block"
              htmlFor="password"
            >
              Sua Senha (Mínimo 6 caracteres)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 py-3 text-sm lp-font-mono text-[var(--lp-fg)] placeholder-[var(--lp-muted-2)] focus:border-[var(--lp-accent)] focus:ring-1 focus:ring-[var(--lp-accent)] focus:outline-none transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--lp-accent)] hover:bg-[var(--lp-accent-bright)] text-[var(--lp-bg)] font-semibold tracking-wider uppercase text-xs py-3.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? 'Criando Conta...' : 'Cadastrar na Arena'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--lp-border)]"></div>
          </div>
          <div className="relative flex justify-center text-[10px] lp-font-mono tracking-wider uppercase">
            <span className="bg-[var(--lp-bg)] px-3 text-[var(--lp-muted)] font-medium">
              Ou continue com
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGithubLogin}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-lg border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 py-3 text-xs lp-font-heading font-semibold tracking-wide uppercase text-[var(--lp-fg)] transition-all hover:bg-[var(--lp-bg-card)] hover:border-[var(--lp-accent)] hover:text-white active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            GitHub
          </button>

          <button
            type="button"
            onClick={handleDiscordLogin}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-lg border border-[var(--lp-border)] bg-[var(--lp-bg)] px-4 py-3 text-xs lp-font-heading font-semibold tracking-wide uppercase text-[var(--lp-fg)] transition-all hover:bg-[var(--lp-bg-card)] hover:border-[#5865F2] hover:text-white active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4.5 w-4.5 fill-current text-[#5865F2]" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65.62,77.53a107.4,107.4,0,0,0,32,16.29,80.1,80.1,0,0,0,6.72-11,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.65-2.1a77,77,0,0,0,74.5,0c.84.73,1.74,1.43,2.65,2.1a68.6,68.6,0,0,1-10.64,5.12,80.1,80.1,0,0,0,6.72,11,107.4,107.4,0,0,0,32-16.29C130.41,47.55,123.57,24.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.16-12.72,11.43-12.72S53.9,46,53.9,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53s5.16-12.72,11.45-12.72S96.14,46,96.14,53,91,65.69,84.69,65.69Z" />
            </svg>
            Discord
          </button>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-[var(--lp-muted)]">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="text-[var(--lp-accent)] hover:text-[var(--lp-accent-bright)] hover:underline font-semibold transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
