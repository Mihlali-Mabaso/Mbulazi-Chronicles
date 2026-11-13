const crypto = require('node:crypto');
const COOKIE = 'mbulazi_session';
function secret() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters');
  return process.env.SESSION_SECRET;
}
function signature(value) { return crypto.createHmac('sha256', secret()).update(value).digest('base64url'); }
function makeToken() { const payload = Buffer.from(JSON.stringify({exp: Date.now() + 24 * 60 * 60 * 1000})).toString('base64url'); return `${payload}.${signature(payload)}`; }
function valid(req) {
  const token = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
  if (!token) return false;
  const [payload, sig] = token.split('.'); if (!payload || !sig) return false;
  const expected = signature(payload); const a = Buffer.from(sig); const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}
function cookie(token, maxAge) { return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`; }
function json(res, status, data) { res.status(status).setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); }
function requireSession(req, res) { if (!valid(req)) { json(res, 401, {error:'Passcode required'}); return false; } return true; }
async function supabase(path, options={}) {
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.');
  const response=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=representation',...(options.headers||{})}});
  const text=await response.text();if(!response.ok)throw new Error(text||`Supabase request failed (${response.status})`);return text?JSON.parse(text):null;
}
module.exports={COOKIE,secret,makeToken,cookie,json,requireSession,supabase};
