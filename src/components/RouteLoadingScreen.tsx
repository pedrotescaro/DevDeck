import Loader from '@/components/Loader';

interface RouteLoadingScreenProps {
  title?: string;
  subtitle?: string;
}

export function RouteLoadingScreen({
  title = 'Carregando sua experiência...',
  subtitle = 'Só um instante enquanto preparamos a próxima página',
}: RouteLoadingScreenProps) {
  return (
    <main
      data-testid="route-loading-screen"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#08090b] px-6"
      aria-busy="true"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,131,254,0.13),transparent_38%)]"
        aria-hidden="true"
      />
      <Loader title={title} subtitle={subtitle} size="md" className="relative" />
    </main>
  );
}
