# Firebase Domain Auto-Sync Setup

## Problem
Vercel creates a new preview domain on each deploy, but Firebase OAuth requires exact domain matching in "Authorized domains". This causes `auth/unauthorized-domain` errors.

## Solution
**Automatically add new Vercel deployment domains to Firebase with zero manual steps.**

## Setup (One-time, 5 minutes)

### Step 1: Get Firebase API Key
1. Go to **Firebase Console** → **Project Settings** → **API Keys**
2. Find your **Web API Key** (looks like `AIzaSy...`)
3. Copy it

### Step 2: Set Vercel Environment Variables
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add these variables (set for **Production** deployments):
   - `FIREBASE_PROJECT_ID` = `pranavportfolio-1b517`
   - `FIREBASE_API_KEY` = (paste your Web API Key from Step 1)
   - `FIREBASE_AUTH_DOMAIN` = `pranavportfolio-1b517.firebaseapp.com`

### Step 3: Create Vercel Deployment Hook
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Git**
2. Scroll to **Deployment Hooks**
3. Click **Create Hook**
4. Name: `Sync Firebase Domain`
5. Branch: `main`
6. URL: `https://your-vercel-url.vercel.app/api/sync-firebase-domain`
   - Replace `your-vercel-url` with your actual Vercel domain
7. Click **Create**

### Step 4: Redeploy
Push a new commit to trigger a deployment:
```bash
git commit --allow-empty -m "Trigger Firebase domain sync"
git push origin main
```

**That's it!** Now every time you deploy, your new Vercel domain is automatically added to Firebase's authorized domains.

## How It Works
1. You deploy to Vercel → new preview domain is created
2. Vercel triggers the deployment hook → calls `/api/sync-firebase-domain`
3. The API fetches Firebase's current authorized domains
4. It adds the new Vercel domain to the list
5. Firebase is updated within seconds
6. Sign-in works immediately on the new domain ✅

## Manual Alternative (if you don't want automation)
If you prefer to add domains manually once:

```bash
node add-domain-to-firebase.js
```

This requires:
1. `npm install --save-dev firebase-admin`
2. Download service account key from Firebase Console → Project Settings → Service Accounts
3. Save as `service-account-key.json` (add to .gitignore)
4. Run the script

## Troubleshooting

**Script fails with "Firebase API error":**
- Check your API Key is valid (Web API Key, not Server Key)
- Ensure env vars are set correctly in Vercel

**Domain still not working after 2 minutes:**
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear localStorage: Open DevTools → Application → Local Storage → Clear All

**Want to verify domains were added?**
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Your new Vercel domain should appear in the list
