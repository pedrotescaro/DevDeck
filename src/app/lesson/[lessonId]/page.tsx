import { notFound, redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getLessonById } from '@/lib/lessons/registry';
import { LessonClient } from './LessonClient';

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  const user = await getAuthUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <LessonClient
      lesson={lesson}
      user={{
        id: user.id,
        username: user.username,
        total_xp: user.total_xp,
        streak: user.streak_days,
      }}
    />
  );
}
