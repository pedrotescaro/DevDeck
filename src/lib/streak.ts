const DAY_IN_MS = 24 * 60 * 60 * 1000;

function utcDayTimestamp(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getCalendarDayDifference(previous: Date, current: Date) {
  return Math.floor((utcDayTimestamp(current) - utcDayTimestamp(previous)) / DAY_IN_MS);
}

export function calculateNextStreak(
  currentStreak: number,
  lastActiveAt: Date | null | undefined,
  now = new Date()
) {
  if (!lastActiveAt) return 1;

  const dayDifference = getCalendarDayDifference(lastActiveAt, now);
  if (dayDifference <= 0) return Math.max(1, currentStreak);
  if (dayDifference === 1) return Math.max(1, currentStreak) + 1;
  return 1;
}

export function getEffectiveStreak(
  storedStreak: number,
  lastActiveAt: Date | null | undefined,
  now = new Date()
) {
  if (!lastActiveAt || storedStreak <= 0) return 0;

  const dayDifference = getCalendarDayDifference(lastActiveAt, now);
  return dayDifference >= 0 && dayDifference <= 1 ? storedStreak : 0;
}

export function getRecentStreakDayIndexes(
  storedStreak: number,
  lastActiveAt: Date | null | undefined,
  now: Date | null | undefined
) {
  if (!now || !lastActiveAt) return new Set<number>();

  const effectiveStreak = getEffectiveStreak(storedStreak, lastActiveAt, now);
  const finalDayIndex = lastActiveAt.getUTCDay();

  return new Set(
    Array.from(
      { length: Math.min(7, effectiveStreak) },
      (_, offset) => (finalDayIndex - offset + 7) % 7
    )
  );
}
