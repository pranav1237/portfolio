// reCAPTCHA verification endpoint
// Supports both reCAPTCHA Enterprise and standard reCAPTCHA v3

export default async function handler(req, res) {
  // Set CORS headers for Vercel deployments
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { token, action } = req.body || {};
    if (!token) return res.status(400).json({ success: false, error: 'Missing token' });

    // Check for Enterprise API key first, then fall back to standard secret
    const enterpriseApiKey = process.env.RECAPTCHA_ENTERPRISE_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.RECAPTCHA_PROJECT_ID || 'pranavportfolio-1b517';
    const siteKey = process.env.RECAPTCHA_SITE_KEY || '6Le3hBosAAAAAAXviyuaKfyF6ZWHKRyW8rgLz0aK';
    const standardSecret = process.env.RECAPTCHA_SECRET || process.env.VERCEL_RECAPTCHA_SECRET;

    // Try Enterprise verification first if API key is available
    if (enterpriseApiKey) {
      console.log('[verify-recaptcha] Using reCAPTCHA Enterprise verification');
      
      const enterpriseUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${enterpriseApiKey}`;
      
      const enterpriseBody = {
        event: {
          token: token,
          siteKey: siteKey,
          expectedAction: action || 'login'
        }
      };

      const r = await fetch(enterpriseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enterpriseBody)
      });

      const data = await r.json();

      if (data.error) {
        console.error('[verify-recaptcha] Enterprise API error:', data.error);
        // Fall through to standard verification or pass-through
      } else {
        const tokenValid = data.tokenProperties?.valid === true;
        const score = data.riskAnalysis?.score;
        const actionMatch = data.tokenProperties?.action === (action || 'login');

        console.log('[verify-recaptcha] Enterprise result:', {
          valid: tokenValid,
          score: score,
          action: data.tokenProperties?.action,
          actionMatch: actionMatch
        });

        if (tokenValid) {
          return res.status(200).json({
            success: true,
            score: score,
            action: data.tokenProperties?.action,
            valid: tokenValid,
            enterprise: true
          });
        } else {
          return res.status(200).json({
            success: false,
            reason: data.tokenProperties?.invalidReason || 'Token invalid',
            enterprise: true
          });
        }
      }
    }

    // Fall back to standard reCAPTCHA v3 verification
    if (standardSecret) {
      console.log('[verify-recaptcha] Using standard reCAPTCHA v3 verification');
      
      const params = new URLSearchParams();
      params.append('secret', standardSecret);
      params.append('response', token);

      const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: params
      });
      const data = await r.json();

      if (data.success) {
        console.log('[verify-recaptcha] ✅ Token verified. Score:', data.score || 'N/A');
      } else {
        console.warn('[verify-recaptcha] ⚠️ Token verification failed:', data);
      }

      return res.status(200).json({ ...data, enterprise: false });
    }

    // No secrets configured - pass through with warning
    console.warn('[verify-recaptcha] ⚠️ No RECAPTCHA secrets configured in env vars');
    return res.status(200).json({
      success: true,
      message: 'Verification skipped: No reCAPTCHA secrets configured',
      skipped: true
    });

  } catch (e) {
    console.error('[verify-recaptcha] error', e?.message || e);
    return res.status(500).json({ success: false, error: e?.message || String(e) });
  }
}
