import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dns from 'dns';

/**
 * Runtime traffic must use the pooled URL when one is available. DIRECT_URL is
 * reserved for Prisma CLI workflows such as migrations and introspection.
 */
export function getDatabaseConnectionString() {
  return process.env.DATABASE_URL?.trim() || process.env.DIRECT_URL?.trim() || '';
}

const connectionString = getDatabaseConnectionString();

export function hasDatabaseConnection() {
  return Boolean(connectionString);
}

function createMissingDatabaseError() {
  return Object.assign(
    new Error('Set DIRECT_URL or DATABASE_URL before using the application database.'),
    { code: 'DATABASE_NOT_CONFIGURED' }
  );
}

function readPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getDatabasePoolMax() {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  return readPositiveInteger(process.env.DATABASE_POOL_MAX, isServerless ? 1 : 10);
}

// Force Node.js to prefer IPv4 over IPv6. This prevents ENETUNREACH / ETIMEDOUT errors
// when connecting to Supabase database/API hosts that resolve to IPv6 on networks/machines
// that do not support IPv6 routing.
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const prismaClientSingleton = () => {
  // Runtime traffic prefers the transaction pooler (DATABASE_URL). Each warm
  // serverless instance owns its own pg.Pool, so keep the per-instance default
  // deliberately small to avoid exhausting the provider's client limit.
  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: getDatabasePoolMax(),
    connectionTimeoutMillis: readPositiveInteger(
      process.env.DATABASE_CONNECTION_TIMEOUT_MS,
      10_000
    ),
    idleTimeoutMillis: readPositiveInteger(process.env.DATABASE_IDLE_TIMEOUT_MS, 30_000),
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

  // node-postgres defaults to localhost when no connection string is present.
  // Replace its I/O methods so a missing env never becomes a misleading
  // ECONNREFUSED against a database the user did not configure.
  if (!connectionString) {
    const rejectUnconfigured = () => Promise.reject(createMissingDatabaseError());
    pool.query = rejectUnconfigured as typeof pool.query;
    pool.connect = rejectUnconfigured as typeof pool.connect;
  }

  pool.on('error', (err) => {
    console.error('[pg.Pool] Unexpected error:', err.message);
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
