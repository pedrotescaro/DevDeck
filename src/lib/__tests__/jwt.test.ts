import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: { user: { findUnique: vi.fn(), update: vi.fn() } },
}));
vi.mock('@/services/notification.service', () => ({
  NotificationService: { create: vi.fn() },
}));
vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { signJwt, verifyJwt } from '../jwt';
import { calculateLevel } from '@/services/xp.service';
import {
  XP_LEVEL_THRESHOLDS,
  XP_LEVEL_6_BASE,
  XP_LEVEL_6_INCREMENT,
  XP_LEVEL_INCREMENT_GROWTH,
  XP_PER_LEVEL_DISPLAY,
  DEFAULT_LANGUAGE_TRAILS,
  PISTON_LANGUAGES,
  FALLBACK_QUIZZES,
} from '../config';

describe('JWT', () => {
  const testPayload = {
    userId: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
  };

  it('should sign and verify a valid token', () => {
    const token = signJwt(testPayload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const decoded = verifyJwt(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.sub).toBe(testPayload.userId);
    expect(decoded!.username).toBe(testPayload.username);
    expect(decoded!.email).toBe(testPayload.email);
  });

  it('should return null for an invalid token', () => {
    const result = verifyJwt('invalid.token.here');
    expect(result).toBeNull();
  });

  it('should return null for an empty string', () => {
    const result = verifyJwt('');
    expect(result).toBeNull();
  });

  it('should return null for a token signed with wrong secret', () => {
    const jwt = require('jsonwebtoken');
    const wrongToken = jwt.sign(
      { sub: 'user-1', username: 'test', email: 'test@test.com' },
      'wrong-secret',
      { expiresIn: '1h' }
    );
    const result = verifyJwt(wrongToken);
    expect(result).toBeNull();
  });

  it('should include iat and exp in the token', () => {
    const token = signJwt(testPayload);
    const decoded = verifyJwt(token);
    expect(decoded!.iat).toBeDefined();
    expect(decoded!.exp).toBeDefined();
    expect(decoded!.exp).toBeGreaterThan(decoded!.iat);
  });
});

describe('calculateLevel', () => {
  it('should return level 1 for 0 XP', () => {
    const result = calculateLevel(0);
    expect(result.level).toBe(1);
    expect(result.nextLevelXp).toBe(500);
    expect(result.prevLevelXp).toBe(0);
  });

  it('should return level 1 for XP below first threshold', () => {
    const result = calculateLevel(499);
    expect(result.level).toBe(1);
    expect(result.nextLevelXp).toBe(500);
  });

  it('should return level 2 at exactly 500 XP', () => {
    const result = calculateLevel(500);
    expect(result.level).toBe(2);
    expect(result.nextLevelXp).toBe(800);
    expect(result.prevLevelXp).toBe(500);
  });

  it('should return level 5 at 1999 XP', () => {
    const result = calculateLevel(1999);
    expect(result.level).toBe(5);
    expect(result.nextLevelXp).toBe(2000);
  });

  it('should calculate level 6+ dynamically', () => {
    const result = calculateLevel(2500);
    expect(result.level).toBe(6);
    expect(result.nextLevelXp).toBe(XP_LEVEL_6_BASE + XP_LEVEL_6_INCREMENT);
    expect(result.prevLevelXp).toBe(XP_LEVEL_6_BASE);
  });

  it('should increment level threshold growth correctly', () => {
    // Level 7: threshold = 2000 + 600 = 2600, next = 2600 + 700 = 3300
    const result = calculateLevel(3000);
    expect(result.level).toBe(7);
    expect(result.nextLevelXp).toBe(2600 + 700);
  });
});

describe('Config constants', () => {
  it('should have XP_LEVEL_THRESHOLDS with 5 entries', () => {
    expect(XP_LEVEL_THRESHOLDS).toHaveLength(5);
  });

  it('should have XP_PER_LEVEL_DISPLAY set to 1000', () => {
    expect(XP_PER_LEVEL_DISPLAY).toBe(1000);
  });

  it('should have DEFAULT_LANGUAGE_TRAILS with 9 languages', () => {
    expect(DEFAULT_LANGUAGE_TRAILS).toHaveLength(9);
    expect(DEFAULT_LANGUAGE_TRAILS).toContain('TS');
    expect(DEFAULT_LANGUAGE_TRAILS).toContain('PYTHON');
    expect(DEFAULT_LANGUAGE_TRAILS).toContain('RUST');
  });

  it('should have PISTON_LANGUAGES for all supported languages', () => {
    const supportedLangs = ['python', 'rust', 'go', 'cpp', 'java', 'kotlin', 'swift'];
    supportedLangs.forEach((lang) => {
      expect(PISTON_LANGUAGES[lang]).toBeDefined();
      expect(PISTON_LANGUAGES[lang].language).toBeTruthy();
      expect(PISTON_LANGUAGES[lang].version).toBeTruthy();
    });
  });

  it('should have FALLBACK_QUIZZES for all default languages', () => {
    const langs = ['TS', 'JS', 'PYTHON', 'JAVA', 'RUST', 'GO', 'KOTLIN', 'SWIFT', 'CPP'];
    langs.forEach((lang) => {
      expect(FALLBACK_QUIZZES[lang]).toBeDefined();
      expect(FALLBACK_QUIZZES[lang].question).toBeTruthy();
      expect(FALLBACK_QUIZZES[lang].options).toHaveLength(4);
      expect(FALLBACK_QUIZZES[lang].correct_index).toBeGreaterThanOrEqual(0);
      expect(FALLBACK_QUIZZES[lang].correct_index).toBeLessThan(4);
    });
  });
});
