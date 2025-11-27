# Firebase Domain Authorization Fix

## Your Current Vercel Domain
```
pranavportfolio-ok82sq9f2-pranav1237s-projects.vercel.app
```

## Error You're Seeing
```
❌ Your domain is not authorized in Firebase.
Contact admin. (Domain: pranavportfolio-ok82sq9f2-pranav1237s-projects.vercel.app)
```

## Immediate Fix (2 minutes)

### Step 1: Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Select your project: `pranavportfolio-1b517`
- Navigate to: **Authentication** → **Settings** → **Authorized domains**

### Step 2: Add Your Vercel Domain
- Click **Add domain** button
- Enter: `pranavportfolio-ok82sq9f2-pranav1237s-projects.vercel.app`
- Click **Add**

### Step 3: Verify All Domains Are Present
You should have these authorized domains:
- ✅ `localhost`
- ✅ `127.0.0.1`
- ✅ `pranavportfolio-1b517.firebaseapp.com` (Firebase hosting domain - must be here)
- ✅ `pranavportfolio-ok82sq9f2-pranav1237s-projects.vercel.app` (Your Vercel domain - ADD THIS NOW)
- ✅ Any custom domains you use

### Step 4: Verify Sign-in Methods Are Enabled
- Still in **Authentication** → **Sign-in method**
- Confirm these are **Enabled** (green checkmarks):
  - ✅ Google
  - ✅ GitHub
  - ✅ Email/Password (optional)

### Step 5: Check GitHub OAuth Configuration (If GitHub Sign-in Enabled)
- In **Authentication** → **Sign-in method** → **GitHub**
- Verify:
  - ✅ GitHub OAuth Client ID is set (shown as ••••••)
  - ✅ GitHub OAuth Client Secret is set (shown as ••••••)

### Step 6: GitHub OAuth App Callback URL
- Go to your GitHub OAuth App: https://github.com/settings/developers
- Select your app
- Set **Authorization callback URL** to:
  ```
  https://pranavportfolio-1b517.firebaseapp.com/__/auth/handler
  ```
  (This is the Firebase auth handler endpoint)

## After Making These Changes

1. Wait 30-60 seconds for Firebase to propagate the domain
2. Go to your live Vercel URL: `https://pranavportfolio-ok82sq9f2-pranav1237s-projects.vercel.app`
3. Click **Google** or **GitHub** button
4. Auth popup should appear (no more "unauthorized-domain" alert)
5. If it works → celebrate! 🎉
6. If it still fails → check console (press F12 → Console tab) for error codes and paste them here

## Troubleshooting If Auth Still Fails

### If you see: `auth/configuration-not-found`
- GitHub: Check that Client ID and Client Secret are both set in Firebase Console
- Google: Check that Google provider is enabled in Firebase Console
- Then refresh the page and try again

### If you see: `auth/unauthorized-domain`
- Double-check the domain spelling (copy-paste from the error alert)
- Wait 1-2 minutes for Firebase to propagate
- Clear browser cache (Ctrl+Shift+Delete) and refresh
- Try in a different browser or incognito window

### If popup doesn't open (but no error)
- Check browser console for blocked popups (ads/popup blockers)
- Click the popup blocker icon in the address bar → Allow popups for this site
- Try again

## Your Site URL (Save This)
```
https://pranavportfolio-ok82sq9f2-pranav1237s-projects.vercel.app
```

## Your Firebase Project Details
- **Firebase Project ID:** pranavportfolio-1b517
- **Firebase Auth Domain:** pranavportfolio-1b517.firebaseapp.com
- **Firebase App ID:** 1:203675250878:web:d822a4dbaa1afaca78eeef

---

**Questions?** Check the browser console (F12 → Console) for error codes and share them here.
