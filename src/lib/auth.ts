import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

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
