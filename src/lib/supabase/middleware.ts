import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT remove getUser().
  // It is required to refresh the session and prevent random logouts.
  let user = null;
  try {
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();
    user = supabaseUser;
  } catch (error) {
    console.error('Supabase auth error in middleware:', error);
  }

  const pathname = request.nextUrl.pathname;

  // List of protected routes
  const isProtectedRoute =
    pathname.startsWith('/feed') ||
    pathname.startsWith('/post') ||
    pathname.startsWith('/quiz') ||
    pathname.startsWith('/duels') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/settings');

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users trying to access auth pages to the feed
  if (user && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/feed';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
