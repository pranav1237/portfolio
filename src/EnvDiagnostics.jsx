import React, { useEffect, useState } from 'react';

export default function EnvDiagnostics() {
  const [envVars, setEnvVars] = useState({});

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

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', background: '#1a1a1a', color: '#00ff00', minHeight: '100vh' }}>
      <h2>🔍 Firebase Environment Variables Diagnostic</h2>
      <p>Current Environment: {import.meta.env.MODE}</p>
      <p>Base URL: {import.meta.env.BASE_URL}</p>
      <hr />
      <h3>Loaded Variables:</h3>
      <pre>
        {Object.entries(envVars).map(([key, value]) => (
          `${key}: ${value}\n`
        ))}
      </pre>
      <hr />
      <h3>Raw Config Check:</h3>
      <pre>
        {JSON.stringify({
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'undefined',
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'undefined',
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'undefined',
        }, null, 2)}
      </pre>
      <hr />
      <p>
        <strong>If all show ❌ MISSING:</strong> Environment variables are NOT set in Vercel dashboard.
      </p>
      <p>
        <strong>Next steps:</strong>
      </p>
      <ol>
        <li>Go to Vercel dashboard → Settings → Environment Variables</li>
        <li>Add all 6 Firebase keys (see VERCEL_ENV_SETUP.txt in repo)</li>
        <li>Redeploy</li>
        <li>Refresh this page</li>
      </ol>
    </div>
  );
}
