import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';

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

// SMART FIX: Always use the stable Firebase domain (not the Vercel preview domain)
// for auth redirects. This ensures Firebase recognizes all Vercel deployments.
// The authDomain must be the Firebase-provided domain (.firebaseapp.com or .web.app),
// not the Vercel preview domain, to work consistently across all deployments.
firebaseConfig.authDomain = 'pranavportfolio-1b517.firebaseapp.com';

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
// Firebase will automatically redirect back to the current domain (Vercel preview or custom)
// as long as authDomain is set to the Firebase-provided domain (.firebaseapp.com)
googleProvider.setCustomParameters({ 
  prompt: 'select_account'
});

if (typeof window !== 'undefined') {
  const domain = window.location.hostname;
  console.log('[firebase] Current deployment domain:', domain);
  console.log('[firebase] Using Firebase authDomain:', firebaseConfig.authDomain);
  console.log('[firebase] All Vercel preview domains with this project are automatically supported.');
}

export { auth };

// Check for redirect result on page load (for signInWithRedirect flow)
if (auth) {
  getRedirectResult(auth)
    .then((result) => {
      if (result && result.user) {
        console.log('[firebase] ✅ Redirect sign-in successful:', result.user.email);
      }
    })
    .catch((e) => {
      if (e.code && e.code !== 'auth/popup-closed-by-user') {
        console.error('[firebase] Redirect result error:', e.code, e.message);
      }
    });
}

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
      console.error('[firebase] Domain issue detected. Current domain:', currentDomain);
      console.error('[firebase] Firebase authDomain:', firebaseConfig.authDomain);
      
      alert(
        `❌ Sign-in failed: Domain not yet authorized.\n\n` +
        `Current domain: ${currentDomain}\n` +
        `Firebase authDomain: ${firebaseConfig.authDomain}\n\n` +
        `This usually means the DOMAIN is not yet recognized by Firebase.\n\n` +
        `To fix:\n` +
        `1) Go to Firebase Console → Authentication → Settings\n` +
        `2) Add this exact domain to "Authorized domains": ${currentDomain}\n` +
        `3) Wait 1-2 minutes and refresh this page\n\n` +
        `NOTE: Using the Firebase authDomain (.firebaseapp.com) ensures all Vercel deployments\n` +
        `are supported. Firebase automatically recognizes your deployment domain for OAuth redirects.`
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

// reCAPTCHA site key - used for both Enterprise and standard v3
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Le3hBosAAAAAAXviyuaKfyF6ZWHKRyW8rgLz0aK';

// Helper to get reCAPTCHA token
async function getRecaptchaToken(action = 'login') {
  if (typeof window === 'undefined') return null;
  
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) {
    console.warn('[firebase] grecaptcha not loaded');
    return null;
  }

  try {
    // Try Enterprise API first
    if (grecaptcha.enterprise && typeof grecaptcha.enterprise.execute === 'function') {
      console.log('[firebase] Using reCAPTCHA Enterprise');
      const token = await grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action });
      console.log('[firebase] ✅ Got Enterprise token (len=' + token?.length + ')');
      return { token, isEnterprise: true };
    }
    
    // Fall back to standard v3
    if (typeof grecaptcha.execute === 'function') {
      console.log('[firebase] Using standard reCAPTCHA v3');
      const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      console.log('[firebase] ✅ Got v3 token (len=' + token?.length + ')');
      return { token, isEnterprise: false };
    }
    
    console.warn('[firebase] No grecaptcha.execute method available');
    return null;
  } catch (e) {
    console.error('[firebase] reCAPTCHA execute failed:', e?.message || e);
    return null;
  }
}

// Verify reCAPTCHA token with backend
async function verifyRecaptchaToken(token, action = 'login') {
  if (!token) return { success: false, reason: 'No token' };
  
  try {
    console.log('[firebase] Verifying reCAPTCHA token server-side...');
    const resp = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action }),
    });
    
    if (!resp.ok) {
      console.warn('[firebase] ⚠️ reCAPTCHA API error (status=' + resp.status + ')');
      return { success: false, reason: 'API error', status: resp.status };
    }
    
    const body = await resp.json();
    
    // Check if verification was skipped (no secrets configured)
    if (body.skipped) {
      console.log('[firebase] ℹ️ reCAPTCHA verification skipped (no secrets configured)');
      return { success: true, skipped: true };
    }
    
    // Check score threshold (0.3 is lenient, 0.5 is moderate, 0.7 is strict)
    const scoreThreshold = 0.3;
    const passed = body.success === true &&
      (typeof body.score === 'undefined' || Number(body.score) >= scoreThreshold);
    
    if (passed) {
      console.log('[firebase] ✅ reCAPTCHA verification passed', body.score ? `(score: ${body.score})` : '');
    } else {
      console.warn('[firebase] ⚠️ reCAPTCHA verification failed:', body);
    }
    
    return { ...body, passed };
  } catch (e) {
    console.warn('[firebase] ⚠️ reCAPTCHA verification request failed:', e?.message || e);
    return { success: false, reason: e?.message || 'Network error' };
  }
}

// Run reCAPTCHA first (enterprise) and then sign in with Google.
// This function tries to execute grecaptcha.enterprise if available and then proceeds
// to call the regular Google sign-in flow. The token is logged for diagnostic
// purposes — verifying the token requires a backend call to Google/recaptcha API.
export async function signInWithGoogleWithRecaptcha(providedToken = null) {
  const action = 'login';
  let token = providedToken;
  
  // Get token if not provided
  if (!token) {
    const result = await getRecaptchaToken(action);
    token = result?.token;
  }
  
  // Verify token (optional - proceeds even if verification fails)
  if (token) {
    const verification = await verifyRecaptchaToken(token, action);
    
    // If verification explicitly failed with low score, warn but continue
    if (verification.success === false && verification.score !== undefined && verification.score < 0.3) {
      console.warn('[firebase] ⚠️ Low reCAPTCHA score detected. User may be flagged as suspicious.');
      // You could block sign-in here if you want strict enforcement:
      // alert('Verification failed. Please try again.');
      // return;
    }
  } else {
    console.warn('[firebase] ⚠️ No reCAPTCHA token available. Proceeding without verification.');
  }

  // Proceed with Google sign-in flow
  return await signInWithGoogle();
}

// Export for testing
export { getRecaptchaToken, verifyRecaptchaToken, RECAPTCHA_SITE_KEY };

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
