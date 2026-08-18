import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { AdminContent } from './AdminContent';

export const metadata = {
  title: 'Painel Administrativo | Stacklyst',
  description: 'Gestão de usuários, moderação, empresas e avaliadores no Stacklyst.',
};

export default async function AdminPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'ADMIN') {
    redirect('/feed');
  }

  return <AdminContent user={user} />;
}
