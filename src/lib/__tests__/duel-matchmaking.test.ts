import { describe, expect, it } from 'vitest';
import {
  getUserRankTier,
  MAX_DUEL_REJECTIONS,
  DUEL_COOLDOWN_MINUTES,
  DUEL_REQUEST_TIMEOUT_SECONDS,
} from '@/services/duel.service';

describe('Duel Matchmaking and Rank System', () => {
  it('classifies user into correct rank tier based on XP', () => {
    expect(getUserRankTier(100)).toEqual({ tier: 'BRONZE', level: 1, label: 'Bronze' });
    expect(getUserRankTier(600)).toEqual({ tier: 'SILVER', level: 2, label: 'Prata' });
    expect(getUserRankTier(1500)).toEqual({ tier: 'GOLD', level: 3, label: 'Ouro' });
    expect(getUserRankTier(3000)).toEqual({ tier: 'PLATINUM', level: 4, label: 'Platina' });
    expect(getUserRankTier(6000)).toEqual({ tier: 'DIAMOND', level: 5, label: 'Diamante' });
  });

  it('has consistent rules for rejection limits and request timers', () => {
    expect(MAX_DUEL_REJECTIONS).toBe(3);
    expect(DUEL_COOLDOWN_MINUTES).toBe(5);
    expect(DUEL_REQUEST_TIMEOUT_SECONDS).toBe(30);
  });
});
