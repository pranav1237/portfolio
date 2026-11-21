import crypto from 'node:crypto';
import { clearSessionCookie, readCookie, sealSession, sessionCookie } from './_session.js';

function redirectError(res, reason) {
  res.setHeader('Set-Cookie', clearSessionCookie());
  return res.redirect(302, '/?linkedin=error&reason=' + encodeURIComponent(reason));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');
  const { code, state, error } = req.query || {};
  if (error) return redirectError(res, 'authorization_denied');
  const expectedState = readCookie(req, 'linkedin_oauth_state');
  res.setHeader('Set-Cookie', 'linkedin_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectError(res, 'invalid_oauth_state');
  }

  const { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI } = process.env;
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET || !LINKEDIN_REDIRECT_URI) {
    return redirectError(res, 'missing_server_configuration');
  }

  try {
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: String(code),
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: LINKEDIN_REDIRECT_URI
      })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return redirectError(res, 'token_exchange_failed');
    }

    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: 'Bearer ' + tokenData.access_token }
    });
    if (!profileResponse.ok) return redirectError(res, 'profile_fetch_failed');
    const profile = await profileResponse.json();
    const expiresIn = Math.max(60, Number(tokenData.expires_in || 5184000));
    const cookie = sealSession({
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + expiresIn * 1000
    });
    res.setHeader('Set-Cookie', [
      sessionCookie(cookie, Math.min(expiresIn, 60 * 60 * 24 * 60)),
      'linkedin_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    ]);
    return res.redirect(302, '/?linkedin=connected');
  } catch (error) {
    console.error('LinkedIn OAuth callback failed:', error);
    return redirectError(res, 'oauth_callback_failed');
  }
}
