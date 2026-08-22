import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getKnowledgeMapForUser } from '@/lib/learning/repository';
import { TrailsContent } from '@/app/trails/TrailsContent';

export const revalidate = 0;

export default async function TrailsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  const knowledgeMap = await getKnowledgeMapForUser(user.id);

  return (
    <TrailsContent
      user={{
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        total_xp: user.total_xp,
        streak: user.streak_days,
      }}
      knowledgeMap={knowledgeMap}
    />
  );
}
