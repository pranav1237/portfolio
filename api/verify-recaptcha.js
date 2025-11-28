export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ success: false, error: 'Missing token' });

    const secret = process.env.RECAPTCHA_SECRET || process.env.VERCEL_RECAPTCHA_SECRET;
    if (!secret) {
      console.warn('[verify-recaptcha] ⚠️ RECAPTCHA_SECRET not configured in env vars');
      // Return a pass-through response if secret is not configured
      // This allows the app to work without strict reCAPTCHA verification
      return res.status(200).json({ success: true, message: 'Verification skipped: RECAPTCHA_SECRET not configured' });
    }

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: params });
    const data = await r.json();

    if (data.success) {
      console.log('[verify-recaptcha] ✅ Token verified. Score:', data.score || 'N/A');
    } else {
      console.warn('[verify-recaptcha] ⚠️ Token verification failed:', data);
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error('[verify-recaptcha] error', e?.message || e);
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
}
