/**
 * JWT utility module for DevDeck.
 *
 * Provides token signing, verification, and cookie management.
 * This serves as a secondary authentication layer on top of Supabase Auth.
 *
 * Flow:
 * 1. User authenticates via Supabase (OAuth or email/password)
 * 2. After successful auth, we sign a JWT with user data
 * 3. JWT is stored as an httpOnly cookie
 * 4. On each request, we verify the JWT as a secondary check
 * 5. If JWT is invalid/expired, we fall back to Supabase session verification
 */

import jwt, { type SignOptions } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { JWT_SECRET, JWT_COOKIE_NAME, JWT_COOKIE_OPTIONS } from '@/lib/config';
import { logger } from '@/lib/logger';

export interface JwtPayload {
  sub: string; // user ID
  username: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Sign a new JWT token for the given user.
 */
export function signJwt(payload: { userId: string; username: string; email: string }): string {
  const options: SignOptions = {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
  };

  return jwt.sign(
    {
      sub: payload.userId,
      username: payload.username,
      email: payload.email,
    },
    JWT_SECRET,
    options
  );
}

/**
 * Verify and decode a JWT token.
 * Returns the decoded payload if valid, null otherwise.
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (err) {
    logger.debug('JWT verification failed', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * Set the JWT token as an httpOnly cookie.
 * Call this after successful authentication.
 */
export async function setJwtCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(JWT_COOKIE_NAME, token, JWT_COOKIE_OPTIONS);
}

/**
 * Remove the JWT cookie (used during logout).
 */
export async function removeJwtCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(JWT_COOKIE_NAME);
}

/**
 * Get the JWT token from the cookie.
 * Returns null if not found.
 */
export async function getJwtFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME);
  return token?.value ?? null;
}

/**
 * Extract and verify JWT from cookies.
 * Returns the decoded payload if valid, null otherwise.
 */
export async function getJwtUser(): Promise<JwtPayload | null> {
  const token = await getJwtFromCookie();
  if (!token) return null;
  return verifyJwt(token);
}
