# Firebase Authentication Setup - REQUIRED FIXES

## The Issue
Firebase is initialized, but authentication fails because:
1. ❌ Your Vercel domain is NOT authorized in Firebase Console
2. ❌ Firebase Auth providers (Google, GitHub) may not be fully enabled

## IMMEDIATE ACTION REQUIRED

### Step 1: Add Your Vercel Domain to Authorized Domains

1. Go to: https://console.firebase.google.com
2. Select project: **pranavportfolio-1b517**
3. Click: **Authentication** → **Settings** tab
4. Scroll to: **Authorized domains**
5. Click: **Add domain**
6. Enter your Vercel domain: 
   ```
   pranavmahajportfolio-fr9qlmf6n-pranav1237s-projects.vercel.app
   ```
7. Click: **Save**

### Step 2: Verify Sign-In Methods

1. Still in Firebase Console
2. Click: **Authentication** → **Sign-in method** tab
3. Ensure these are **ENABLED** (blue toggle):
   - ✅ **Google** - Must show "Enabled"
   - ✅ **GitHub** - Must show "Enabled"
4. If disabled, click them and toggle ON

### Step 3: Verify OAuth App Configuration

For **GitHub**, you need to set this up:
1. Go to: https://github.com/settings/developers
2. Click: **OAuth Apps**
3. Select your OAuth App (or create one if missing)
4. Copy: **Client ID** and **Client Secret**
5. Back in Firebase Console:
   - Go to: **Authentication** → **Sign-in method** → **GitHub**
   - Paste: Client ID and Client Secret
   - Click: **Save**

For **Google**, it should be auto-configured.

### Step 4: Test Authentication

1. Wait 2-3 minutes after saving changes
2. Visit your Vercel URL: https://pranavmahajportfolio-fr9qlmf6n-pranav1237s-projects.vercel.app/
3. Click: **Google Sign-in** or **GitHub Sign-in**
4. A popup should appear
5. Sign in with your account
6. After successful login, you should see your profile in the header

## If It Still Doesn't Work

**Open Browser Console (F12 → Console tab) and try signing in**

Look for errors like:
- `"auth/unauthorized-domain"` → Your domain wasn't added in Step 1
- `"auth/configuration-not-found"` → Firebase not properly initialized
- `"auth/operation-not-supported-in-this-environment"` → Popups blocked

**Screenshot the error and share it** — that will tell exactly what needs fixing.

## Quick Verification Checklist

```
[ ] Vercel domain added to Firebase Authorized Domains
[ ] Google Sign-in is ENABLED in Firebase
[ ] GitHub Sign-in is ENABLED in Firebase
[ ] GitHub OAuth App Client ID & Secret added to Firebase
[ ] No popups blocked in browser (check address bar icon)
[ ] Waited 2-3 minutes after saving Firebase changes
```

---

**This is the ONLY thing blocking authentication from working.**
Once these steps are done, sign-in will work immediately! ✅
