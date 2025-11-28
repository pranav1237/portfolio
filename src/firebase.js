import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Firebase config: Try env vars first, fall back to hardcoded values for Vercel deployment
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Fallback hardcoded config (for Vercel deployment when env vars are not set)
const fallbackConfig = {
  apiKey: 'AIzaSyBl2QtWefSQgwIlbmg2uLJttg5ap3fw38w',
  authDomain: 'pranavportfolio-1b517.firebaseapp.com',
  projectId: 'pranavportfolio-1b517',
  storageBucket: 'pranavportfolio-1b517.firebasestorage.app',
  messagingSenderId: '203675250878',
  appId: '1:203675250878:web:d822a4dbaa1afaca78eeef',
};

// Use env vars if all present, otherwise use fallback
const hasAllEnvVars = Object.values(envConfig).every(v => v);
const firebaseConfig = hasAllEnvVars ? envConfig : fallbackConfig;

export { firebaseConfig };

if (!hasAllEnvVars) {
  console.warn('[firebase] ⚠️ Not all VITE_FIREBASE_* env vars were present; using fallback config.');
}

let app;
let auth;
let initError = null;

console.log('[firebase] Initializing with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // CRITICAL: Set auth persistence to local BEFORE any auth operations
  // This ensures sessions survive page reloads and long idle periods
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('[firebase] ✅ Auth persistence set to browserLocalPersistence');
    })
    .catch((pErr) => {
      console.warn('[firebase] Could not set auth persistence:', pErr?.message || pErr);
    });

  // Get the current deployment domain
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  console.log('[firebase] Deployment domain:', currentDomain);
  console.log('[firebase] Firebase authDomain:', firebaseConfig.authDomain);
  
  // Quick runtime validation
  (async () => {
    try {
      const openidUrl = `https://${firebaseConfig.authDomain}/.well-known/openid-configuration`;
      const resp = await fetch(openidUrl, { method: 'GET' });
      if (resp.ok) {
        console.log('[firebase] ✅ OpenID config reachable');
      } else {
        console.warn('[firebase] ⚠️ OpenID config returned status', resp.status);
      }
    } catch (e) {
      console.warn('[firebase] ⚠️ OpenID config check failed:', e?.message);
    }
  })();
  
  console.log('[firebase] ✅ Firebase initialized successfully');
} catch (err) {
  initError = err;
  console.error('[firebase] ❌ Failed to initialize Firebase:', err.message);
}

const googleProvider = new GoogleAuthProvider();
// Configure Google provider
googleProvider.setCustomParameters({ 
  prompt: 'select_account'
});
if (typeof window !== 'undefined') {
  const domain = window.location.hostname;
  console.log('[firebase] Google provider configured for domain:', domain);
}

export { auth };

export async function signInWithGoogle() {
  if (!auth) {
    const msg = `Firebase Auth not initialized. Error: ${initError?.message || 'Unknown'}`;
    console.error('[firebase]', msg);
    alert('❌ Authentication unavailable: ' + msg);
    return;
  }
  const currentDomain = window.location.hostname;
  try {
    console.log('[firebase] Attempting Google sign-in from domain:', currentDomain);
    const result = await signInWithPopup(auth, googleProvider);
    console.log('[firebase] ✅ Google sign-in successful:', result.user.email);
    return result;
  } catch (e) {
    console.error('[firebase] Google sign-in error:', e.code, e.message);
    
    // Detailed error handling
    if (e.code === 'auth/unauthorized-domain') {
      console.error('[firebase] Domain error - current domain:', currentDomain);
      console.error('[firebase] authDomain:', firebaseConfig.authDomain);
      alert(
        `❌ Sign-in failed: Domain not authorized.\n` +
        `Current domain: ${currentDomain}\n\n` +
        `To fix:\n` +
        `1) Go to Firebase Console → Authentication → Settings\n` +
        `2) Add this exact domain to "Authorized domains": ${currentDomain}\n` +
        `3) Wait 1-2 minutes and try again.\n\n` +
        `Note: Firebase requires EXACT domain matching (no wildcards).`
      );
      return;
    }
    
    if (e.code === 'auth/configuration-not-found') {
      alert(
        '❌ Sign-in failed: Google provider not configured in Firebase.\n\n' +
        'Fix: In Firebase Console → Authentication → Sign-in method → Enable Google provider.'
      );
      return;
    }
    
    if (e.code === 'auth/operation-not-supported-in-this-environment') {
      alert('❌ Popups are blocked. Enable popups in your browser settings and try again.');
      return;
    }
    
    if (e.code === 'auth/popup-closed-by-user') {
      console.log('[firebase] User closed sign-in popup');
      return;
    }
    
    // Generic error
    alert('❌ Sign-in failed: ' + (e.message || e.code || 'Unknown error'));
  }
}

// Run reCAPTCHA first (enterprise) and then sign in with Google.
// This function tries to execute grecaptcha.enterprise if available and then proceeds
// to call the regular Google sign-in flow. The token is logged for diagnostic
// purposes — verifying the token requires a backend call to Google/recaptcha API.
export async function signInWithGoogleWithRecaptcha(token) {
  // If a token is passed (from grecaptcha callback), log it (do NOT send to client logs in production).
  if (token) {
    console.log('[firebase] Received reCAPTCHA token (len=' + String(token?.length) + ')');
  } else if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.enterprise) {
    try {
      // Execute reCAPTCHA Enterprise with action 'login'
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Le3hBosAAAAAAXviyuaKfyF6ZWHKRyW8rgLz0aK';
      const tok = await window.grecaptcha.enterprise.execute(siteKey, { action: 'login' });
      console.log('[firebase] Obtained reCAPTCHA token (len=' + String(tok?.length) + ')');
      token = tok;
    } catch (e) {
      console.warn('[firebase] grecaptcha.execute failed:', e?.message || e);
    }
  } else if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.execute) {
    // Fallback to standard grecaptcha if enterprise isn't present
    try {
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Le3hBosAAAAAAXviyuaKfyF6ZWHKRyW8rgLz0aK';
      const tok = await window.grecaptcha.execute(siteKey, { action: 'login' });
      console.log('[firebase] Obtained reCAPTCHA token (len=' + String(tok?.length) + ')');
      token = tok;
    } catch (e) {
      console.warn('[firebase] grecaptcha.execute fallback failed:', e?.message || e);
    }
  }

  // Attempt server-side reCAPTCHA verification (optional; if not configured, proceed anyway)
  if (token) {
    try {
      console.log('[firebase] Verifying reCAPTCHA token server-side...');
      const resp = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (resp.ok) {
        const body = await resp.json();
        const passed = body.success === true && (typeof body.score === 'undefined' || Number(body.score) >= 0.3);
        if (passed) {
          console.log('[firebase] ✅ reCAPTCHA verification passed');
        } else {
          console.warn('[firebase] ⚠️ reCAPTCHA score low:', body.score);
        }
      } else {
        console.warn('[firebase] ⚠️ reCAPTCHA verification endpoint error (status=' + resp.status + '). Proceeding anyway.');
      }
    } catch (e) {
      console.warn('[firebase] ⚠️ reCAPTCHA verification request failed:', e?.message || e, '. Proceeding with sign-in.');
    }
  }

  // Proceed with Google sign-in flow (popup)
  return await signInWithGoogle();
}

// GitHub sign-in removed per user request to avoid OAuth/runtime issues in production.
// If you later want to re-enable GitHub sign-in, re-add the provider and the
// signInWithGitHub() helper, and ensure you configure the OAuth callback URL
// and authorized domain in Firebase Console.

export async function signOutUser() {
  if (!auth) return;
  try {
    await signOut(auth);
    console.log('[firebase] ✅ User signed out');
  } catch (e) {
    console.error('[firebase] Sign out error:', e.message);
  }
}

export default app;
