import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { JobsContent } from './JobsContent';

export const metadata = {
  title: 'Vagas & Processos Seletivos | Stacklyst',
  description:
    'Oportunidades profissionais para desenvolvedores integradas com desafios práticos de código.',
};

export default async function JobsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return <JobsContent user={user} />;
}
