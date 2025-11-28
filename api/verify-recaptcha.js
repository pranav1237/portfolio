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
      console.error('[verify-recaptcha] missing RECAPTCHA_SECRET env var');
      return res.status(500).json({ success: false, error: 'Server not configured: RECAPTCHA_SECRET missing' });
    }

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: params });
    const data = await r.json();

    // Return Google's response as-is so the client can make decisions
    return res.status(200).json(data);
  } catch (e) {
    console.error('[verify-recaptcha] error', e?.message || e);
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
}
