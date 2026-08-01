import { RouteLoadingScreen } from '@/components/RouteLoadingScreen';

export default function FeedLoading() {
  return (
    <RouteLoadingScreen
      title="Carregando seu feed..."
      subtitle="Buscando as novidades da comunidade"
    />
  );
}
