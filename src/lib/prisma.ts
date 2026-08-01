import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dns from 'dns';

function readPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// Force Node.js to prefer IPv4 over IPv6. This prevents ENETUNREACH / ETIMEDOUT errors
// when connecting to Supabase database/API hosts that resolve to IPv6 on networks/machines
// that do not support IPv6 routing.
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const prismaClientSingleton = () => {
  // Prefer DIRECT_URL (session pooler / direct connection) because
  // PrismaPg uses prepared statements which are incompatible with
  // PgBouncer transaction mode (port 6543).
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: readPositiveInteger(process.env.DATABASE_POOL_MAX, 10),
    connectionTimeoutMillis: readPositiveInteger(
      process.env.DATABASE_CONNECTION_TIMEOUT_MS,
      10_000
    ),
    idleTimeoutMillis: readPositiveInteger(process.env.DATABASE_IDLE_TIMEOUT_MS, 30_000),
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });
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
