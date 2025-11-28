import React, { useEffect, useState } from 'react';
import { auth, firebaseConfig } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function EnvDiagnostics() {
  const [envVars, setEnvVars] = useState({});
  const [pass, setPass] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  const expectedPass = import.meta.env.VITE_DIAG_PASS || 'devdiag';

  useEffect(() => {
    const vars = {
      VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ SET' : '❌ MISSING',
      VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ SET' : '❌ MISSING',
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ SET' : '❌ MISSING',
      VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ SET' : '❌ MISSING',
      VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ SET' : '❌ MISSING',
      VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ SET' : '❌ MISSING',
    };
    setEnvVars(vars);
    console.log('Firebase Env Vars:', vars);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub && unsub();
  }, []);

  const trySignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error('Sign-in failed', e);
      alert('Sign-in failed: ' + (e.message || e.code));
    }
  };

  if (!authorized) {
    return (
      <div style={{ padding: '24px', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
        <h2>Diagnostics - Enter passcode</h2>
        <p>This page is protected. Enter the diagnostics passcode to view Firebase config and auth state.</p>
        <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Enter passcode" style={{padding:8,fontSize:16}} />
        <button className="btn" onClick={() => setAuthorized(pass === expectedPass)} style={{marginLeft:12}}>Unlock</button>
        <p style={{marginTop:12,color:'#666'}}>Set `VITE_DIAG_PASS` in Vercel environment variables to change the passcode (default: <code>devdiag</code>).</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Roboto, sans-serif', minHeight: '100vh', background: '#0b1220', color: '#e6f0ff' }}>
      <h2>🔍 Firebase Diagnostics (Protected)</h2>
      <p>Current Environment: {import.meta.env.MODE} | Base URL: {import.meta.env.BASE_URL}</p>
      <hr />
      <h3>Loaded Environment Variables</h3>
      <pre style={{background:'#071020',padding:12,borderRadius:8}}>
        {Object.entries(envVars).map(([key, value]) => (`${key}: ${value}\n`))}
      </pre>

      <h3 style={{marginTop:12}}>firebaseConfig (from `src/firebase.js`)</h3>
      <pre style={{background:'#071020',padding:12,borderRadius:8}}>{JSON.stringify(firebaseConfig, null, 2)}</pre>

      <h3 style={{marginTop:12}}>Firebase Auth State</h3>
      <div style={{background:'#071020',padding:12,borderRadius:8}}>
        <p>Signed-in user: {user ? `${user.displayName || user.email} (${user.uid})` : 'Not signed in'}</p>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={trySignIn}>Sign in with Google (popup)</button>
          <button className="btn outline" onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </div>

      <hr style={{marginTop:20}} />
      <h4>Notes</h4>
      <ul>
        <li>To change the diagnostics passcode set `VITE_DIAG_PASS` in Vercel environment variables and redeploy.</li>
        <li>If `firebaseConfig` does not match your Firebase Console project, check Vercel env vars or fallback config in `src/firebase.js`.</li>
      </ul>
    </div>
  );
}
