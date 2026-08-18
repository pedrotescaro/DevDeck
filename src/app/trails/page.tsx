import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { TRAIL_LANGUAGE_CODES } from '@/app/trails/TrailLanguageLogo';
import {
  parseTrailCoursePreferences,
  TRAIL_COURSE_PREFERENCES_COOKIE,
} from '@/app/trails/trailCoursePreferences';
import { TrailsContent } from './TrailsContent';

export const revalidate = 0; // Desabilitar cache para refletir XP ganho instantaneamente

const TRAIL_ACTIVITY_ID_PATTERN = /^(js|ts|py|python|rust|go|java)-(?:l\d+-q\d+|u\d+-checkpoint)$/i;

const SUPPORTED_TRAIL_LANGUAGES = new Set<string>(TRAIL_LANGUAGE_CODES);

function getAttemptLanguage(quizId: string) {
  const match = quizId.match(TRAIL_ACTIVITY_ID_PATTERN);
  if (!match) return null;

  const language = match[1].toUpperCase();
  return language === 'PY' ? 'PYTHON' : language;
}

interface TrailsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TrailsPage({ searchParams }: TrailsPageProps) {
  const resolvedSearchParams = await searchParams;
  const viewParam = Array.isArray(resolvedSearchParams.view)
    ? resolvedSearchParams.view[0]
    : resolvedSearchParams.view;
  const sectionParam = Array.isArray(resolvedSearchParams.section)
    ? resolvedSearchParams.section[0]
    : resolvedSearchParams.section;
  const parsedSectionNumber = Number.parseInt(sectionParam ?? '', 10);
  const initialSectionNumber =
    Number.isInteger(parsedSectionNumber) && parsedSectionNumber > 0 ? parsedSectionNumber : null;
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  const cookieStore = await cookies();
  const savedCoursePreferences = parseTrailCoursePreferences(
    cookieStore.get(TRAIL_COURSE_PREFERENCES_COOKIE)?.value,
    user.id
  );

  // Buscar todas as trilhas do usuário atual
  const dbTrailsPromise = prisma.languageTrail.findMany({
    where: { user_id: user.id },
  });

  // Buscar todas as tentativas de quiz feitas pelo usuário
  const dbAttemptsPromise = prisma.quizAttempt.findMany({
    where: { user_id: user.id },
    select: {
      quiz_id: true,
      is_correct: true,
      selected_index: true,
      xp_earned: true,
      created_at: true,
    },
  });

  const usersAheadPromise = prisma.user.count({
    where: { total_xp: { gt: user.total_xp } },
  });
  const totalParticipantsPromise = prisma.user.count();

  // Mapear tentativas para serialização fácil no cliente
  const [dbTrails, dbAttempts, usersAhead, totalParticipants] = await Promise.all([
    dbTrailsPromise,
    dbAttemptsPromise,
    usersAheadPromise,
    totalParticipantsPromise,
  ]);

  const attemptsMap: Record<string, boolean> = {};
  const attemptSelectionsMap: Record<string, number> = {};
  dbAttempts.forEach((att) => {
    attemptsMap[att.quiz_id] = att.is_correct;
    attemptSelectionsMap[att.quiz_id] = att.selected_index;
  });

  const startedLanguages = new Set<string>(
    dbTrails
      .filter((trail) => trail.xp > 0 || trail.last_activity_at !== null)
      .map((trail) => trail.language)
  );

  dbAttempts.forEach((attempt) => {
    const language = getAttemptLanguage(attempt.quiz_id);
    if (language) startedLanguages.add(language);
  });

  savedCoursePreferences.startedLanguages.forEach((language) => startedLanguages.add(language));

  if (![...startedLanguages].some((language) => SUPPORTED_TRAIL_LANGUAGES.has(language))) {
    startedLanguages.add('JS');
  }

  const initialActiveLanguage =
    savedCoursePreferences.activeLanguage &&
    startedLanguages.has(savedCoursePreferences.activeLanguage)
      ? savedCoursePreferences.activeLanguage
      : (TRAIL_LANGUAGE_CODES.find((language) => startedLanguages.has(language)) ?? 'JS');

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayAttempts = dbAttempts.filter((attempt) => attempt.created_at >= todayStart);
  const todayTrailAttempts = todayAttempts.filter((attempt) =>
    TRAIL_ACTIVITY_ID_PATTERN.test(attempt.quiz_id)
  );
  const initialDailyProgress = {
    xpEarned: todayTrailAttempts.reduce(
      (total, attempt) => total + Math.max(0, attempt.xp_earned),
      0
    ),
    correctAnswers: todayTrailAttempts.filter((attempt) => attempt.is_correct).length,
    trailActivities: todayTrailAttempts.length,
  };

  // Serializar usuário
  const serializedUser = {
    id: user.id,
    username: user.username,
    avatar_url: user.avatar_url,
    total_xp: user.total_xp,
    streak: user.streak_days,
  };

  // Mapear trilhas
  const serializedTrails = dbTrails.map((t) => ({
    language: t.language,
    xp: t.xp,
    level: t.level,
    started: startedLanguages.has(t.language),
  }));

  return (
    <TrailsContent
      user={serializedUser}
      initialTrails={serializedTrails}
      initialActiveLanguage={initialActiveLanguage}
      initialAttempts={attemptsMap}
      initialAttemptSelections={attemptSelectionsMap}
      initialGlobalRank={usersAhead + 1}
      initialTotalParticipants={totalParticipants}
      initialDailyProgress={initialDailyProgress}
      initialView={viewParam === 'sections' ? 'sections' : 'trail'}
      initialSectionNumber={initialSectionNumber}
    />
  );
}
