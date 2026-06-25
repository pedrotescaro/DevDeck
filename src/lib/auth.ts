import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { cache } from 'react';
import { ForbiddenError, UnauthorizedError } from './errors';
import { getJwtUser } from './jwt';
import { logger } from '@/lib/logger';

/**
 * Fetch user from database via Prisma (direct PostgreSQL connection).
 * Returns null if the connection fails.
 */
async function fetchUserViaPrisma(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: { include: { badge: true } },
      trails: true,
    },
  });
}

/**
 * Fetch user via Supabase REST API (HTTPS, port 443).
 * Used as fallback when PostgreSQL port is blocked by the network.
 */
async function fetchUserViaRest(userId: string) {
  const { data: user, error } = await supabaseAdmin
    .from('User')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) return null;

  // Fetch related data
  const [badgesRes, trailsRes] = await Promise.all([
    supabaseAdmin.from('UserBadge').select('*, badge:Badge(*)').eq('user_id', userId),
    supabaseAdmin.from('LanguageTrail').select('*').eq('user_id', userId),
  ]);

  // Normalize dates for compatibility with Prisma-style objects
  const trails = (trailsRes.data || []).map((t: any) => ({
    ...t,
    last_activity_at: t.last_activity_at ? new Date(t.last_activity_at) : null,
  }));

  return {
    ...user,
    created_at: user.created_at ? new Date(user.created_at) : new Date(),
    last_active_at: user.last_active_at ? new Date(user.last_active_at) : null,
    birthday: user.birthday ? new Date(user.birthday) : null,
    badges: (badgesRes.data || []).map((ub: any) => ({
      ...ub,
      earned_at: ub.earned_at ? new Date(ub.earned_at) : new Date(),
    })),
    trails,
  };
}

/**
 * Try Prisma first; if it times out, fall back to Supabase REST API.
 */
async function findUserWithFallback(userId: string) {
  try {
    const user = await fetchUserViaPrisma(userId);
    return user;
  } catch (prismaError: any) {
    if (
      prismaError?.code === 'ETIMEDOUT' ||
      prismaError?.code === 'ENETUNREACH' ||
      prismaError?.code === 'ECONNREFUSED'
    ) {
      logger.warn('Prisma connection failed, falling back to Supabase REST API', {
        code: prismaError.code,
      });
      return fetchUserViaRest(userId);
    }
    throw prismaError;
  }
}

/**
 * Get the authenticated user.
 *
 * Authentication strategy (in order of priority):
 * 1. JWT cookie — fast, no external service call
 * 2. Supabase session — fallback when JWT is missing/expired
 *
 * Database strategy:
 * 1. Prisma (direct PostgreSQL) — fast, full ORM
 * 2. Supabase REST API (HTTPS) — fallback when PostgreSQL ports are blocked
 *
 * After Supabase auth succeeds, a JWT is set for subsequent requests.
 */
export const getAuthUser = cache(async () => {
  try {
    // ── Strategy 1: JWT verification (fast path) ──────────────
    const jwtPayload = await getJwtUser();
    if (jwtPayload?.sub) {
      const dbUser = await findUserWithFallback(jwtPayload.sub);

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

    const dbUser = await findUserWithFallback(supabaseUser.id);

    if (!dbUser) {
      logger.warn('Orphaned Supabase session, signing out', {
        userId: supabaseUser.id,
      });
      await supabase.auth.signOut();
      return null;
    }

    // NOTE: JWT issuance happens in Route Handlers only (callback, register),
    // where Next.js allows cookie modification.

    syncUserStreaks(dbUser);
    return dbUser;
  } catch (error) {
    const errObj = error as any;
    logger.error('Error in getAuthUser', {
      error: String(error),
      code: errObj?.code,
      meta: JSON.stringify(errObj?.meta),
      message: errObj?.message,
    });
    return null;
  }
});

/**
 * Background streak sync — fire and forget.
 * Extracted to avoid duplicating the logic.
 */
function syncUserStreaks(dbUser: any) {
  const maxTrailStreak = (dbUser.trails || []).reduce(
    (max: number, t: any) => Math.max(max, t.streak),
    0
  );
  const latestTrailActivity = (dbUser.trails || []).reduce((latest: Date | null, t: any) => {
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
    // Try Prisma first, fall back to REST API
    prisma.user.update({ where: { id: dbUser.id }, data: updateData }).catch(() => {
      supabaseAdmin
        .from('User')
        .update(updateData)
        .eq('id', dbUser.id)
        .then(({ error }) => {
          if (error)
            logger.error('Failed to auto-heal user streak/activity via REST', {
              error: String(error),
            });
        });
    });
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
