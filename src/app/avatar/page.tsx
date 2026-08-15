import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';

export const revalidate = 0;

export default async function AvatarPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  redirect(`/profile/${encodeURIComponent(user.username)}`);
}
