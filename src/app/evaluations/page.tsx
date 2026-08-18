import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { EvaluationsContent } from './EvaluationsContent';

export const metadata = {
  title: 'Avaliação de Código | Stacklyst',
  description: 'Área exclusiva para avaliadores técnicos homologarem soluções de duelos.',
};

export default async function EvaluationsPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'EVALUATOR' && user.role !== 'ADMIN') {
    redirect('/evaluators/apply');
  }

  return <EvaluationsContent user={user} />;
}
