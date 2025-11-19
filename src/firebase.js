import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Firebase config is read from Vite env vars. Create these in a .env or in Vercel's dashboard:
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
// VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

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
