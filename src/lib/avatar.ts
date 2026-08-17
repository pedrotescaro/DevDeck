import { z } from 'zod';

export const SKIN_TONES = [
  '#7f493f',
  '#935347',
  '#a65c3a',
  '#ae604d',
  '#b96b3f',
  '#bd704e',
  '#c8784f',
  '#cf8168',
  '#df9274',
  '#eaa66d',
  '#f3aa86',
  '#ffc09b',
  '#ffd0ba',
  '#ffdccb',
  '#ffe4d7',
] as const;

export const HAIR_COLORS = [
  '#2c1b18',
  '#4a2b22',
  '#6a3b2c',
  '#9a5d33',
  '#d4933d',
  '#17191f',
  '#6f7787',
  '#c85d69',
] as const;

export const OUTFIT_COLORS = [
  '#30343b',
  '#1677d2',
  '#6846c7',
  '#008f73',
  '#cf4b53',
  '#e58d23',
  '#48546a',
  '#8f3f78',
] as const;

export const AVATAR_BACKGROUNDS = [
  '#2f6bb2',
  '#8e63ce',
  '#2b9c86',
  '#d96168',
  '#d28a2c',
  '#435d9d',
  '#82507d',
  '#56636f',
] as const;

export const avatarConfigSchema = z.object({
  skin: z
    .number()
    .int()
    .min(0)
    .max(SKIN_TONES.length - 1),
  hair: z.number().int().min(0).max(5),
  hairColor: z
    .number()
    .int()
    .min(0)
    .max(HAIR_COLORS.length - 1),
  eyes: z.number().int().min(0).max(3),
  mouth: z.number().int().min(0).max(3),
  glasses: z.number().int().min(0).max(3),
  outfit: z.number().int().min(0).max(4),
  outfitColor: z
    .number()
    .int()
    .min(0)
    .max(OUTFIT_COLORS.length - 1),
  background: z
    .number()
    .int()
    .min(0)
    .max(AVATAR_BACKGROUNDS.length - 1),
  name: z.string().max(50).optional(),
  displayName: z.string().max(50).optional(),
});

export type AvatarConfig = z.infer<typeof avatarConfigSchema>;

function hashUsername(username: string) {
  let hash = 2166136261;
  for (const char of username.toLowerCase()) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

export function getDefaultAvatarConfig(username: string): AvatarConfig {
  const seed = hashUsername(username || 'stacklyst');
  return {
    skin: seed % SKIN_TONES.length,
    hair: (seed >>> 2) % 6,
    hairColor: (seed >>> 5) % HAIR_COLORS.length,
    eyes: (seed >>> 8) % 4,
    mouth: (seed >>> 10) % 4,
    glasses: (seed >>> 12) % 4,
    outfit: (seed >>> 14) % 5,
    outfitColor: (seed >>> 17) % OUTFIT_COLORS.length,
    background: (seed >>> 20) % AVATAR_BACKGROUNDS.length,
  };
}

export function normalizeAvatarConfig(value: unknown, username: string): AvatarConfig {
  const fallback = getDefaultAvatarConfig(username);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;

  const parsed = avatarConfigSchema.safeParse({ ...fallback, ...value });
  return parsed.success ? parsed.data : fallback;
}
