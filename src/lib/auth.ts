import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { ForbiddenError, UnauthorizedError } from './errors';
import { getJwtUser, signJwt, setJwtCookie } from './jwt';
import { logger } from '@/lib/logger';

/**
 * Get the authenticated user.
 *
 * Authentication strategy (in order of priority):
 * 1. JWT cookie — fast, no external service call
 * 2. Supabase session — fallback when JWT is missing/expired
 *
 * After Supabase auth succeeds, a JWT is set for subsequent requests.
 */
export const getAuthUser = cache(async () => {
  try {
    // ── Strategy 1: JWT verification (fast path) ──────────────
    const jwtPayload = await getJwtUser();
    if (jwtPayload?.sub) {
      const dbUser = await prisma.user.findUnique({
        where: { id: jwtPayload.sub },
        include: {
          badges: { include: { badge: true } },
          trails: true,
        },
      });

      if (dbUser) {
        syncUserStreaks(dbUser);
        return dbUser;
      }
      // JWT points to a user that no longer exists — fall through to Supabase
      logger.warn('JWT user not found in DB, falling back to Supabase', {
        userId: jwtPayload.sub,
      });
    }

    // ── Strategy 2: Supabase session (fallback) ───────────────
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) return null;

    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      include: {
        badges: { include: { badge: true } },
        trails: true,
      },
    });

    if (!dbUser) {
      logger.warn('Orphaned Supabase session, signing out', {
        userId: supabaseUser.id,
      });
      await supabase.auth.signOut();
      return null;
    }

    // ── Issue JWT for future requests ─────────────────────────
    try {
      const token = signJwt({
        userId: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
      });
      await setJwtCookie(token);
    } catch (err) {
      logger.error('Failed to issue JWT after Supabase auth', {
        error: String(err),
      });
      // Non-fatal — Supabase session still works
    }

    syncUserStreaks(dbUser);
    return dbUser;
  } catch (error) {
    logger.error('Error in getAuthUser', { error: String(error) });
    return null;
  }
});

/**
 * Background streak sync — fire and forget.
 * Extracted to avoid duplicating the logic.
 */
function syncUserStreaks(dbUser: any) {
  const maxTrailStreak = dbUser.trails.reduce((max: number, t: any) => Math.max(max, t.streak), 0);
  const latestTrailActivity = dbUser.trails.reduce((latest: Date | null, t: any) => {
    if (!t.last_activity_at) return latest;
    if (!latest) return t.last_activity_at;
    return t.last_activity_at.getTime() > latest.getTime() ? t.last_activity_at : latest;
  }, null);

  let needsUpdate = false;
  const updateData: any = {};

  if (dbUser.streak_days < maxTrailStreak) {
    dbUser.streak_days = maxTrailStreak;
    updateData.streak_days = maxTrailStreak;
    needsUpdate = true;
  }

  if (
    latestTrailActivity &&
    (!dbUser.last_active_at || dbUser.last_active_at.getTime() < latestTrailActivity.getTime())
  ) {
    dbUser.last_active_at = latestTrailActivity;
    updateData.last_active_at = latestTrailActivity;
    needsUpdate = true;
  }

  if (needsUpdate) {
    prisma.user
      .update({ where: { id: dbUser.id }, data: updateData })
      .catch((e) => logger.error('Failed to auto-heal user streak/activity', { error: String(e) }));
  }
}

export async function requireAuth(_req?: Request) {
  const user = await getAuthUser();
  if (!user) {
    throw new UnauthorizedError('UNAUTHORIZED', 'Autenticação necessária');
  }
  return user;
}

export async function requireOwnership(userId: string, resourceUserId: string): Promise<void> {
  if (userId !== resourceUserId) {
    throw new ForbiddenError('FORBIDDEN', 'Você não tem permissão para esta ação');
  }
}
