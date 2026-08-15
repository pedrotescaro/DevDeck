import { describe, expect, it } from 'vitest';
import {
  calculateNextStreak,
  getCalendarDayDifference,
  getEffectiveStreak,
  getRecentStreakDayIndexes,
} from '@/lib/streak';

describe('streak helpers', () => {
  const today = new Date('2026-08-14T18:00:00.000Z');

  it('mantém, incrementa e reinicia a ofensiva por dia UTC', () => {
    expect(calculateNextStreak(7, new Date('2026-08-14T01:00:00.000Z'), today)).toBe(7);
    expect(calculateNextStreak(7, new Date('2026-08-13T23:00:00.000Z'), today)).toBe(8);
    expect(calculateNextStreak(7, new Date('2026-08-12T23:00:00.000Z'), today)).toBe(1);
  });

  it('não usa diferença absoluta para uma data futura', () => {
    expect(calculateNextStreak(7, new Date('2026-08-15T01:00:00.000Z'), today)).toBe(7);
    expect(getCalendarDayDifference(new Date('2026-08-15T01:00:00.000Z'), today)).toBe(-1);
  });

  it('expira ofensivas antigas e mantém a janela de ontem', () => {
    expect(getEffectiveStreak(7, new Date('2026-08-13T12:00:00.000Z'), today)).toBe(7);
    expect(getEffectiveStreak(7, new Date('2026-08-12T12:00:00.000Z'), today)).toBe(0);
  });

  it('mapeia no máximo os sete dias consecutivos mais recentes', () => {
    expect(
      [...getRecentStreakDayIndexes(7, new Date('2026-08-14T12:00:00.000Z'), today)].sort()
    ).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});
