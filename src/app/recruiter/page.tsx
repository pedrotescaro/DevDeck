import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { RecruiterContent } from './RecruiterContent';

export const metadata = {
  title: 'Painel do Recrutador | Stacklyst',
  description: 'Publique vagas e crie processos seletivos práticos no Stacklyst.',
};

export default async function RecruiterPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'RECRUITER' && user.role !== 'ADMIN') {
    redirect('/jobs');
  }

  return <RecruiterContent user={user} />;
}
