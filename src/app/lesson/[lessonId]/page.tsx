import { notFound, redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getExerciseWorkspaceForUser } from '@/lib/exercises/repository';
import { getLessonById } from '@/lib/lessons/registry';
import { ExerciseWorkspace } from './ExerciseWorkspace';
import { LessonClient } from './LessonClient';

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const user = await getAuthUser();
  if (!user) {
    redirect('/login');
  }

  const exercise = await getExerciseWorkspaceForUser(lessonId, user.id);
  if (exercise) {
    return <ExerciseWorkspace exercise={exercise} />;
  }

  const lesson = getLessonById(lessonId);
  if (!lesson) {
    notFound();
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
