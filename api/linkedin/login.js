import crypto from 'node:crypto';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end('Method not allowed');
  const { LINKEDIN_CLIENT_ID, LINKEDIN_REDIRECT_URI, LINKEDIN_SESSION_SECRET } = process.env;
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_REDIRECT_URI || !LINKEDIN_SESSION_SECRET) {
    return res.status(503).send('LinkedIn is not configured yet. Add LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI and LINKEDIN_SESSION_SECRET in Vercel project environment variables, then redeploy.');
  }
  const state = crypto.randomBytes(32).toString('hex');
  res.setHeader('Set-Cookie', `linkedin_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    state,
    scope: 'openid profile email'
  });
  return res.redirect(302, `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`);
}
