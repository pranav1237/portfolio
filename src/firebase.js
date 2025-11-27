import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

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
  console.log('[firebase] ✅ Firebase initialized successfully');
} catch (err) {
  initError = err;
  console.error('[firebase] ❌ Failed to initialize Firebase:', err.message);
}

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Configure providers
googleProvider.setCustomParameters({ prompt: 'select_account' });

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

export async function signInWithGitHub() {
  if (!auth) {
    const msg = `Firebase Auth not initialized. Error: ${initError?.message || 'Unknown'}`;
    console.error('[firebase]', msg);
    alert('❌ Authentication unavailable: ' + msg);
    return;
  }
  try {
    console.log('[firebase] Attempting GitHub sign-in...');
    console.log('[firebase] GitHub Provider configured:', githubProvider);
    console.log('[firebase] Auth domain:', firebaseConfig.authDomain);
    const result = await signInWithPopup(auth, githubProvider);
    console.log('[firebase] ✅ GitHub sign-in successful:', result.user.email);
    alert('✅ GitHub sign-in successful! Welcome ' + result.user.displayName);
  } catch (e) {
    console.error('[firebase] GitHub sign-in error:', e.code, e.message);
    console.error('[firebase] Full error object:', e);
    
    // Handle account-exists-with-different-credential error
    if (e.code === 'auth/account-exists-with-different-credential') {
      console.log('[firebase] Account exists with different provider. Attempting to link accounts...');
      try {
        // Get the pending credential from the error
        const pendingCred = e.credential;
        const email = e.email;
        
        // Sign in with the current user's provider (Google)
        const result = await signInWithPopup(auth, googleProvider);
        
        // Link the GitHub credential to the existing account
        await result.user.linkWithCredential(pendingCred);
        console.log('[firebase] ✅ Successfully linked GitHub account to existing user');
        alert('✅ GitHub account linked successfully! Welcome ' + result.user.displayName);
        return;
      } catch (linkError) {
        console.error('[firebase] Failed to link accounts:', linkError.message);
        alert('❌ Could not link GitHub account. Please try signing out first and then signing in with GitHub.');
        return;
      }
    }
    
    const errorMap = {
      'auth/operation-not-supported-in-this-environment': 'Popups are blocked or not supported. Enable popups in browser settings.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.',
      'auth/unauthorized-domain': `⚠️ Your domain is not authorized in Firebase. Contact admin. (Domain: ${window.location.hostname})`,
      'auth/configuration-not-found': 'GitHub provider configuration is missing in Firebase Console.',
      'auth/cancelled-popup-request': 'GitHub OAuth popup request was cancelled. Check if GitHub credentials are saved in Firebase Console and the callback URL is correct.',
      'auth/network-request-failed': 'Network error. Check your internet connection.',
    };
    
    const userMsg = errorMap[e.code] || e.message;
    console.warn('[firebase] Showing alert:', userMsg);
    alert('❌ GitHub sign-in failed:\n\n' + userMsg);
  }
}

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
