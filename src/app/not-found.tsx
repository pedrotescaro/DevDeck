import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dd-bg px-4">
      <div className="text-center">
        <h1 className="font-display text-8xl font-bold text-dd-accent">404</h1>
        <h2 className="mt-4 font-heading text-2xl font-semibold text-dd-text">
          Página não encontrada
        </h2>
        <p className="mt-2 text-dd-muted">
          O código que você procura não existe neste repositório.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-dd-accent px-6 py-3 font-heading font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
