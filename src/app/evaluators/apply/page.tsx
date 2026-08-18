import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { EvaluatorApplyContent } from './EvaluatorApplyContent';

export const metadata = {
  title: 'Torne-se um Avaliador de Código | Stacklyst',
  description: 'Candidate-se para avaliar soluções e atuar na governança técnica do Stacklyst.',
};

export default async function EvaluatorApplyPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return <EvaluatorApplyContent user={user} />;
}
