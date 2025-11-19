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
  console.warn('[firebase] Using fallback config (env vars not set). To use env vars, set them in Vercel dashboard or .env file.');
}

// Helper to check for missing env vars and provide clearer diagnostics
export function checkFirebaseConfig() {
  const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) {
    console.error('[firebase] Missing Firebase env vars:', missing.join(', '));
    return { ok: false, missing };
  }
  return { ok: true };
}

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (err) {
  // initialization error (likely invalid config)
  console.error('[firebase] initializeApp error:', err && err.message ? err.message : err);
}

export const auth = app ? getAuth(app) : null;

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export async function signInWithGoogle() {
  if (!auth) {
    const msg = 'Firebase Auth not initialized. Check environment variables and initialization.';
    console.error('[firebase] ' + msg);
    alert(msg);
    return;
  }
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (e) {
    console.error('Google sign-in error', e);
    alert('Google sign-in failed: ' + (e && e.message ? e.message : e));
  }
}

export async function signInWithGitHub() {
  if (!auth) {
    const msg = 'Firebase Auth not initialized. Check environment variables and initialization.';
    console.error('[firebase] ' + msg);
    alert(msg);
    return;
  }
  try {
    await signInWithPopup(auth, githubProvider);
  } catch (e) {
    console.error('GitHub sign-in error', e);
    alert('GitHub sign-in failed: ' + (e && e.message ? e.message : e));
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (e) {
    console.error('Sign out error', e);
  }
}

export default app;
