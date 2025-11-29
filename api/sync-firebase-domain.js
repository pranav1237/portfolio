/**
 * Vercel Deployment Hook: Auto-add domain to Firebase Authorized Domains
 * 
 * This serverless function runs after every Vercel deployment and automatically
 * adds the new deployment domain to Firebase's authorized domains list.
 * 
 * Setup:
 * 1. Set these env vars in Vercel:
 *    - FIREBASE_PROJECT_ID
 *    - FIREBASE_API_KEY (from Firebase Console → Project Settings → API Keys, Web API Key)
 *    - FIREBASE_AUTH_DOMAIN
 * 
 * 2. Add this URL to Vercel Deployment Hooks:
 *    Project Settings → Git → Deployment Hooks
 *    Create hook pointing to: https://your-site/api/sync-firebase-domain
 *    Trigger on: Production Deployments
 */

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const vercelUrl = process.env.VERCEL_URL;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const apiKey = process.env.FIREBASE_API_KEY;
    const authDomain = process.env.FIREBASE_AUTH_DOMAIN;

    if (!vercelUrl || !projectId || !apiKey || !authDomain) {
      console.error('❌ Missing required env vars:', {
        VERCEL_URL: !!vercelUrl,
        FIREBASE_PROJECT_ID: !!projectId,
        FIREBASE_API_KEY: !!apiKey,
        FIREBASE_AUTH_DOMAIN: !!authDomain,
      });
      return res.status(400).json({ error: 'Missing environment configuration' });
    }

    console.log(`📋 Adding domain to Firebase: ${vercelUrl}`);

    // Get current authorized domains from Firebase REST API
    const configUrl = `https://identitytoolkit.googleapis.com/v1/projects/${projectId}?key=${apiKey}`;
    
    const configResp = await fetch(configUrl, { method: 'GET' });
    if (!configResp.ok) {
      throw new Error(`Firebase API error: ${configResp.status} ${await configResp.text()}`);
    }

    const configData = await configResp.json();
    const currentDomains = configData.authorizedDomains || [];

    console.log('Current authorized domains:', currentDomains);

    // Check if already added
    if (currentDomains.includes(vercelUrl)) {
      console.log(`✓ Domain ${vercelUrl} already authorized.`);
      return res.status(200).json({ 
        message: 'Domain already authorized',
        domain: vercelUrl,
        domains: currentDomains
      });
    }

    // Add new domain
    const newDomains = [...currentDomains, vercelUrl];

    const updateResp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}?key=${apiKey}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorizedDomains: newDomains,
        }),
      }
    );

    if (!updateResp.ok) {
      throw new Error(`Firebase update failed: ${updateResp.status} ${await updateResp.text()}`);
    }

    console.log(`✅ Successfully added ${vercelUrl} to Firebase authorized domains!`);

    return res.status(200).json({
      message: 'Domain added successfully',
      domain: vercelUrl,
      domains: newDomains,
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to sync domain',
      details: error.message 
    });
  }
}
