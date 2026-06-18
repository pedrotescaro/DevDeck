/**
 * Em alguns ambientes Windows (antivírus, proxy corporativo), o Node.js
 * não confia no certificado HTTPS do Supabase e o auth retorna "fetch failed".
 * Ative com SUPABASE_SSL_INSECURE=true no .env.local apenas em desenvolvimento.
 */
if (
  process.env.NODE_ENV === 'development' &&
  process.env.SUPABASE_SSL_INSECURE === 'true'
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
