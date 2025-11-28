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
  // Ensure auth persistence is local so sessions survive long idle periods
  try {
    setPersistence(auth, browserLocalPersistence).then(() => {
      console.log('[firebase] Auth persistence set to browserLocalPersistence');
    }).catch((pErr) => {
      console.warn('[firebase] Could not set auth persistence:', pErr?.message || pErr);
    });
  } catch (pErr) {
    console.warn('[firebase] setPersistence unavailable:', pErr?.message || pErr);
  }
  // Quick runtime validation: try fetching the project's OpenID configuration
  // from the configured authDomain to detect misconfigured authDomain or blocked requests.
  (async () => {
    try {
      const openidUrl = `https://${firebaseConfig.authDomain}/.well-known/openid-configuration`;
      const resp = await fetch(openidUrl, { method: 'GET' });
      if (!resp.ok) {
        console.warn('[firebase] Could not fetch OpenID configuration from', openidUrl, 'status=', resp.status);
        console.warn('[firebase] This often indicates the `authDomain` is incorrect or the domain is blocked.');
        console.warn('[firebase] Ensure the Firebase project `authDomain` is the Firebase provided value (example: pr' +
          'anavportfolio-1b517.firebaseapp.com) and that your Vercel domain is listed under Firebase Authorized domains.');
      } else {
        console.log('[firebase] OpenID configuration fetched successfully from', openidUrl);
      }
    } catch (e) {
      console.warn('[firebase] Runtime authDomain check failed:', e?.message || e);
      console.warn('[firebase] If this is a CORS or network issue, check browser console and ensure the authDomain is correct and reachable from the client.');
    }
  })();
  // Disable app check for development/preview deployments to avoid domain restrictions
  if (window.location.hostname.includes('vercel.app')) {
    console.log('[firebase] Running on Vercel preview; allowing cross-domain auth.');
  }
  console.log('[firebase] ✅ Firebase initialized successfully');
} catch (err) {
  initError = err;
  console.error('[firebase] ❌ Failed to initialize Firebase:', err.message);
}

const googleProvider = new GoogleAuthProvider();
// Configure providers
googleProvider.setCustomParameters({ prompt: 'select_account' });
// Allow redirect on Vercel preview URLs
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  console.log('[firebase] Vercel preview detected; configuring for preview domain.');
}

export { auth };

export async function signInWithGoogle() {
  if (!auth) {
    const msg = `Firebase Auth not initialized. Error: ${initError?.message || 'Unknown'}`;
    console.error('[firebase]', msg);
    alert('❌ Authentication unavailable: ' + msg);
    return;
  }
  try {
    console.log('[firebase] Attempting Google sign-in...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('[firebase] ✅ Google sign-in successful:', result.user.email);
  } catch (e) {
    console.error('[firebase] Google sign-in error:', e.code, e.message);
    // Common Firebase errors
    const errorMap = {
      'auth/operation-not-supported-in-this-environment': 'Popups are blocked or not supported. Enable popups in browser settings.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.',
      'auth/unauthorized-domain': `⚠️ Your domain is not authorized in Firebase. Contact admin. (Domain: ${window.location.hostname})`,
      'auth/configuration-not-found': 'Firebase configuration not found. Please ensure Firebase is properly configured.',
    };
    const userMsg = errorMap[e.code] || e.message;
    alert('Google sign-in failed: ' + userMsg);
    // If the domain isn't authorized, provide clear instructions
    if (e.code === 'auth/unauthorized-domain') {
      // Firebase requires exact authorized domains; it does NOT accept wildcard entries.
      // Show the exact domain to add and recommend long-term options.
      const domain = window.location.hostname || 'your domain';
      alert(
        `Domain not authorized: ${domain}\n\n` +
        'Important: Firebase Authorized Domains requires exact domains (wildcards like *.vercel.app are not supported).\n\n' +
        'Immediate fixes:\n' +
        `1) In Firebase Console -> Authentication -> Settings -> Authorized domains, click "Add domain" and paste: ${domain}\n` +
        '2) Wait ~1 minute for propagation, then refresh this page and try signing in again.\n\n' +
        'Recommended long-term solutions:\n' +
        '- Add your stable production/custom domain (e.g. yoursite.example.com) to Firebase and use that for production deployments.\n' +
        "- For many preview URLs: either add each preview domain shown in errors, or connect a single custom domain in Vercel so the deployed site uses a stable domain that you can add to Firebase.\n\n" +
        'If you want, add the exact domain shown in the popup to the project now.'
      );
      return;
    }

    if (e.code === 'auth/configuration-not-found') {
      alert(
        'Google sign-in failed: Firebase configuration for this provider is missing.\n\n' +
        'Fix: In the Firebase Console -> Authentication -> Sign-in method, open Google and ensure the provider is configured. ' +
        'Also confirm your deployment domain is present under Authorized domains.'
      );
      return;
    }
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

  // Verify token server-side via our serverless endpoint (recommended)
  try {
    const resp = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      console.warn('[firebase] reCAPTCHA verification endpoint returned non-OK:', resp.status, txt);
      alert('reCAPTCHA verification failed (server error). Try again later.');
      return;
    }
    const body = await resp.json();
    // Google returns { success: boolean, score?: number, action?: string }
    const passed = body.success === true && (typeof body.score === 'undefined' || Number(body.score) >= 0.3);
    if (!passed) {
      console.warn('[firebase] reCAPTCHA verification failed:', body);
      alert('reCAPTCHA check did not pass. Please try again.');
      return;
    }
  } catch (e) {
    console.error('[firebase] reCAPTCHA verification request failed:', e?.message || e);
    alert('Could not verify reCAPTCHA token. Please try again.');
    return;
  }

  // Proceed with Google sign-in flow (popup) now that token is verified.
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
