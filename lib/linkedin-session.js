import crypto from 'node:crypto';

export function sessionCookie(value, maxAge) {
  return `linkedin_session=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return 'linkedin_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}

export function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  const item = raw.split(';').map(part => part.trim()).find(part => part.startsWith(name + '='));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

function encryptionKey() {
  const secret = process.env.LINKEDIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('LINKEDIN_SESSION_SECRET must be at least 32 characters.');
  return crypto.createHash('sha256').update(secret).digest();
}

export function sealSession(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map(part => part.toString('base64url')).join('.');
}

export function openSession(value) {
  const [ivPart, tagPart, dataPart] = (value || '').split('.');
  if (!ivPart || !tagPart || !dataPart) throw new Error('Invalid LinkedIn session.');
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(ivPart, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagPart, 'base64url'));
  const clear = Buffer.concat([decipher.update(Buffer.from(dataPart, 'base64url')), decipher.final()]);
  return JSON.parse(clear.toString('utf8'));
}

export function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}
