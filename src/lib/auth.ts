import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ConnectionError, ForbiddenError, UnauthorizedError } from '@/lib/errors';
import { getJwtUser } from '@/lib/jwt';
import { logger } from '@/lib/logger';
import { getErrorSummary, isTransientConnectionError } from '@/lib/connection-errors';
import { isTemporaryAuthFailure } from '@/lib/supabase/auth-errors';

/** Fetch a user through the direct PostgreSQL connection. */
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
 * Fetch a user through the Supabase Data API on port 443. This is the fallback
 * for networks that temporarily cannot reach the PostgreSQL pooler.
 */
async function fetchUserViaRest(userId: string) {
  const { data: user, error } = await supabaseAdmin
    .from('User')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!user) return null;

  const [badgesRes, trailsRes] = await Promise.all([
    supabaseAdmin.from('UserBadge').select('*, badge:Badge(*)').eq('user_id', userId),
    supabaseAdmin.from('LanguageTrail').select('*').eq('user_id', userId),
  ]);

  // The core user record is enough to keep the session alive. Related data can
  // degrade to an empty list and recover on the next request.
  if (badgesRes.error) {
    logger.warn('Could not load badges through Supabase REST fallback', {
      userId,
      ...getErrorSummary(badgesRes.error),
    });
  }
  if (trailsRes.error) {
    logger.warn('Could not load trails through Supabase REST fallback', {
      userId,
      ...getErrorSummary(trailsRes.error),
    });
  }

  const trails = (trailsRes.data || []).map((trail: any) => ({
    ...trail,
    last_activity_at: trail.last_activity_at ? new Date(trail.last_activity_at) : null,
  }));

  return {
    ...user,
    created_at: user.created_at ? new Date(user.created_at) : new Date(),
    last_active_at: user.last_active_at ? new Date(user.last_active_at) : null,
    birthday: user.birthday ? new Date(user.birthday) : null,
    badges: (badgesRes.data || []).map((userBadge: any) => ({
      ...userBadge,
      earned_at: userBadge.earned_at ? new Date(userBadge.earned_at) : new Date(),
    })),
    trails,
  };
}

/** Try PostgreSQL first and fail over to HTTPS only for transient errors. */
async function findUserWithFallback(userId: string) {
  try {
    return await fetchUserViaPrisma(userId);
  } catch (prismaError) {
    if (!isTransientConnectionError(prismaError)) throw prismaError;

    logger.warn('Prisma connection failed, falling back to Supabase REST API', {
      userId,
      ...getErrorSummary(prismaError),
    });

    try {
      return await fetchUserViaRest(userId);
    } catch (restError) {
      logger.error('Both user data connections failed', {
        userId,
        prisma: getErrorSummary(prismaError),
        rest: getErrorSummary(restError),
      });
      throw new ConnectionError(
        'USER_DATA_UNAVAILABLE',
        'Conexão temporariamente indisponível. Sua sessão continua ativa.'
      );
    }
  }
}

/**
 * Resolve the authenticated application user.
 *
 * Supabase verified claims remain authoritative and keep refresh-token rotation
 * working. The secondary JWT is accepted only for a temporary Auth/network
 * failure, never for an invalid, missing, expired or revoked session.
 */
export const getAuthUser = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    let userId = typeof data?.claims?.sub === 'string' ? data.claims.sub : null;

    if (!userId && error && isTemporaryAuthFailure(error)) {
      const jwtPayload = await getJwtUser();
      userId = jwtPayload?.sub ?? null;

      logger.warn('Temporary Supabase auth failure while resolving user', {
        ...getErrorSummary(error),
        usedJwtFallback: Boolean(userId),
      });

      if (!userId) {
        throw new ConnectionError(
          'AUTH_TEMPORARILY_UNAVAILABLE',
          'Não foi possível renovar sua sessão agora. Tente novamente em instantes.'
        );
      }
    } else if (!userId && error) {
      logger.debug('Supabase session is invalid while resolving user', getErrorSummary(error));
    }

    if (!userId) return null;

    const dbUser = await findUserWithFallback(userId);
    if (!dbUser) {
      logger.warn('Authenticated user does not exist in the application database', { userId });
      return null;
    }

    syncUserStreaks(dbUser);
    return dbUser;
  } catch (error) {
    logger.error('Error in getAuthUser', getErrorSummary(error));

    if (error instanceof ConnectionError) throw error;
    if (isTransientConnectionError(error)) {
      throw new ConnectionError(
        'CONNECTION_ERROR',
        'Conexão temporariamente indisponível. Sua sessão continua ativa.'
      );
    }
    throw error;
  }
});

/** Keep aggregate streak fields synchronized without blocking the request. */
function syncUserStreaks(dbUser: any) {
  const maxTrailStreak = (dbUser.trails || []).reduce(
    (max: number, trail: any) => Math.max(max, trail.streak),
    0
  );
  const latestTrailActivity = (dbUser.trails || []).reduce((latest: Date | null, trail: any) => {
    if (!trail.last_activity_at) return latest;
    if (!latest) return trail.last_activity_at;
    return trail.last_activity_at.getTime() > latest.getTime() ? trail.last_activity_at : latest;
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
    prisma.user.update({ where: { id: dbUser.id }, data: updateData }).catch(() => {
      supabaseAdmin
        .from('User')
        .update(updateData)
        .eq('id', dbUser.id)
        .then(({ error }) => {
          if (error) {
            logger.error('Failed to auto-heal user streak/activity via REST', {
              error: String(error),
            });
          }
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
