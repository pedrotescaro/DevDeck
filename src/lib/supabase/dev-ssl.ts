import dns from 'dns';

/**
 * Em alguns ambientes Windows (antivírus, proxy corporativo), o Node.js
 * não confia no certificado HTTPS do Supabase e o auth retorna "fetch failed".
 * Ative com SUPABASE_SSL_INSECURE=true no .env.local apenas em desenvolvimento.
 */
if (process.env.NODE_ENV === 'development' && process.env.SUPABASE_SSL_INSECURE === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Force Node.js to prefer IPv4 over IPv6. This prevents ENETUNREACH / ETIMEDOUT errors
// when connecting to Supabase database/API hosts that resolve to IPv6 on networks/machines
// that do not support IPv6 routing.
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}
