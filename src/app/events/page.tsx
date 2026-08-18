import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { EventsContent } from './EventsContent';

export const metadata = {
  title: 'Eventos & Hackathons | Stacklyst',
  description: 'Participe de competições e hackathons semanais de programação.',
};

export default async function EventsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return <EventsContent user={user} />;
}
