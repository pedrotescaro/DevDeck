import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { ForbiddenError, UnauthorizedError } from './errors';

export async function getAuthUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) return null;

    // Find the user in our database
    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
        trails: true,
      },
    });

    if (!dbUser) {
      console.warn(
        `Orphaned Supabase session detected for user ${supabaseUser.id}. Signing out...`
      );
      await supabase.auth.signOut();
      return null;
    }

    // Auto-healing logic: sync overall user streak_days and last_active_at from language trails if out of sync
    const maxTrailStreak = dbUser.trails.reduce((max, t) => Math.max(max, t.streak), 0);
    const latestTrailActivity = dbUser.trails.reduce((latest: Date | null, t) => {
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
      try {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: updateData,
        });
      } catch (e) {
        console.error('Failed to auto-heal user streak/activity:', e);
      }
    }

    return dbUser;
  } catch (error) {
    console.error('Error in getAuthUser:', error);
    return null;
  }
}

export async function requireAuth(req?: Request) {
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
