import { getAuthUser } from '@/lib/auth';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getAuthUser();

  return <HomeClient initialUser={user} />;
}
