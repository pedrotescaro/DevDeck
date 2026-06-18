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
      },
    });

    if (!dbUser) {
      console.warn(
        `Orphaned Supabase session detected for user ${supabaseUser.id}. Signing out...`
      );
      await supabase.auth.signOut();
      return null;
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
