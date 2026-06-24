'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function isConnectionError(error: Error): boolean {
  const msg = error.message?.toLowerCase() || '';
  const name = error.name?.toLowerCase() || '';
  return (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('connection') ||
    msg.includes('failed to fetch') ||
    msg.includes('loadchunk') ||
    msg.includes('chunkloaderror') ||
    msg.includes('loading chunk') ||
    msg.includes('failed to load') ||
    name === 'networkerror' ||
    name === 'typeerror'
  );
}

function isSessionError(error: Error): boolean {
  const msg = error.message?.toLowerCase() || '';
  return (
    msg.includes('session') ||
    msg.includes('unauthorized') ||
    msg.includes('auth') ||
    msg.includes('401') ||
    msg.includes('invalid_refresh_token') ||
    msg.includes('jwt') ||
    msg.includes('token')
  );
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  const connectionErr = isConnectionError(error);
  const sessionErr = isSessionError(error);

  if (connectionErr) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dd-bg px-4">
        <div className="max-w-md text-center">
          <div className="mb-6 text-6xl">📡</div>
          <h1 className="font-heading text-2xl font-bold text-dd-text">Problema de conexão</h1>
          <p className="mt-3 text-dd-muted">
            Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente
            novamente.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <button
              onClick={reset}
              className="rounded-lg bg-dd-accent px-6 py-3 font-heading font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Tentar novamente
            </button>
            <Link
              href="/"
              className="rounded-lg border border-dd-border px-6 py-3 font-heading font-semibold text-dd-text transition-colors hover:bg-dd-surface"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sessionErr) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-dd-bg px-4">
        <div className="max-w-md text-center">
          <div className="mb-6 text-6xl">🔐</div>
          <h1 className="font-heading text-2xl font-bold text-dd-text">Sessão expirada</h1>
          <p className="mt-3 text-dd-muted">
            Sua sessão encerrou ou sua autenticação é inválida. Faça login novamente para continuar.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link
              href="/login"
              className="rounded-lg bg-dd-accent px-6 py-3 font-heading font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Fazer login
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-dd-border px-6 py-3 font-heading font-semibold text-dd-text transition-colors hover:bg-dd-surface"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dd-bg px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">💥</div>
        <h1 className="font-heading text-2xl font-bold text-dd-text">Algo deu errado</h1>
        <p className="mt-3 text-dd-muted">Ocorreu um erro inesperado. Tente recarregar a página.</p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-dd-muted">Error ID: {error.digest}</p>
        )}
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-dd-accent px-6 py-3 font-heading font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="rounded-lg border border-dd-border px-6 py-3 font-heading font-semibold text-dd-text transition-colors hover:bg-dd-surface"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
