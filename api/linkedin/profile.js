import { openSession, readCookie, sendJson } from './_session.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');
  const cookie = readCookie(req, 'linkedin_session');
  if (!cookie) return sendJson(res, 401, { connected: false });
  try {
    const session = openSession(cookie);
    if (!session.accessToken || session.expiresAt <= Date.now()) {
      res.setHeader('Set-Cookie', 'linkedin_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
      return sendJson(res, 401, { connected: false, reason: 'expired' });
    }
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: 'Bearer ' + session.accessToken }
    });
    if (!response.ok) return sendJson(res, 502, { connected: false, reason: 'linkedin_profile_unavailable' });
    const profile = await response.json();
    return sendJson(res, 200, {
      connected: true,
      profile: {
        name: profile.name || [profile.given_name, profile.family_name].filter(Boolean).join(' '),
        picture: profile.picture || null,
        email: profile.email || null,
        expiresAt: session.expiresAt
      }
    });
  } catch (error) {
    console.error('LinkedIn profile session failed:', error);
    return sendJson(res, 401, { connected: false, reason: 'invalid_session' });
  }
}
