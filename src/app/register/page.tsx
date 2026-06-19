'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-dd-bg px-6 py-12 text-dd-text">
      <div className="w-full max-w-md rounded-xl border border-dd-border bg-dd-surface p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/logo.png"
              alt="DevDeck Logo"
              className="w-6 h-6 object-contain hidden dark:block"
            />
            <img
              src="/logo-light.png"
              alt="DevDeck Logo"
              className="w-6 h-6 object-contain block dark:hidden"
            />
            <span className="font-sans text-2xl font-bold tracking-tight">DevDeck</span>
          </div>
          <p className="text-dd-muted text-sm">Crie sua conta para começar a subir de nível</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="username">
              Nome de Usuário (Ex: dev_pedro)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-dd-border bg-dd-bg px-4 py-2 text-sm text-dd-text placeholder-dd-muted focus:border-orange-500 focus:outline-none"
              placeholder="seu_username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-dd-border bg-dd-bg px-4 py-2 text-sm text-dd-text placeholder-dd-muted focus:border-orange-500 focus:outline-none"
              placeholder="seu-email@dev.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="password">
              Senha (Mínimo 6 caracteres)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-dd-border bg-dd-bg px-4 py-2 text-sm text-dd-text placeholder-dd-muted focus:border-orange-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-600 shadow-md shadow-orange-500/10 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Criando Conta...' : 'Cadastrar-se'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dd-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-dd-surface px-2 text-dd-muted font-semibold">Ou continue com</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGithubLogin}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-lg border border-dd-border bg-dd-bg px-4 py-2.5 text-sm font-semibold text-dd-text transition-all hover:bg-dd-border/30 hover:border-orange-500/30 active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
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
            className="flex flex-1 items-center justify-center gap-2.5 rounded-lg border border-dd-border bg-dd-bg px-4 py-2.5 text-sm font-semibold text-dd-text transition-all hover:bg-dd-border/30 hover:border-[#5865F2]/40 active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-5 w-5 fill-current text-[#5865F2]" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65.62,77.53a107.4,107.4,0,0,0,32,16.29,80.1,80.1,0,0,0,6.72-11,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.65-2.1a77,77,0,0,0,74.5,0c.84.73,1.74,1.43,2.65,2.1a68.6,68.6,0,0,1-10.64,5.12,80.1,80.1,0,0,0,6.72,11,107.4,107.4,0,0,0,32-16.29C130.41,47.55,123.57,24.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.16-12.72,11.43-12.72S53.9,46,53.9,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53s5.16-12.72,11.45-12.72S96.14,46,96.14,53,91,65.69,84.69,65.69Z" />
            </svg>
            Discord
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-dd-muted">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-orange-400 hover:underline font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
