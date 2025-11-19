# 🚀 Vercel Deployment Guide

## Step 1: Visit Vercel & Connect GitHub

1. Go to **https://vercel.com/new**
2. Click **"Continue with GitHub"** (sign in if needed)
3. Authorize Vercel to access your GitHub account
4. You'll see your repositories list

## Step 2: Import Your Portfolio Repository

1. Search for **`portfolio`** in the list
2. Click **"Import"** next to your portfolio repo
3. Vercel will auto-detect it's a Vite + React project

## Step 3: Configure Build Settings

On the Import Project page, verify:

- **Project Name:** `portfolio` (or your preferred name)
- **Framework Preset:** React (auto-detected)
- **Build Command:** `npm run build` ✅ (already set)
- **Output Directory:** `dist` ✅ (already set)
- **Install Command:** `npm install` ✅ (default, good)

## Step 4: Add Environment Variables ⚠️ IMPORTANT

Scroll down to **"Environment Variables"** section and add these 6 variables:

| Variable Name | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBl2QtWefSQgwIlbmg2uLJttg5ap3fw38w` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `pranavportfolio-1b517.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `pranavportfolio-1b517` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `pranavportfolio-1b517.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `203675250878` |
| `VITE_FIREBASE_APP_ID` | `1:203675250878:web:d822a4dbaa1afaca78eeef` |

**How to add them:**
- For each variable, click **"Add"** → Enter key → Enter value → Repeat

## Step 5: Deploy

1. Click the **"Deploy"** button
2. Vercel will start building (takes ~2-3 minutes)
3. You'll see a progress log
4. Once complete, you'll get a live URL like: `https://portfolio-xxxxx.vercel.app`

## Step 6: Configure GitHub OAuth (for GitHub Sign-in)

After deployment, update your GitHub OAuth App settings:

1. Go to **https://github.com/settings/developers** → **OAuth Apps**
2. Click your **PranavPortfolio** app
3. Update **Authorization callback URL** to:
   ```
   https://pranavportfolio-1b517.firebaseapp.com/__/auth/handler
   ```
4. Save

## Step 7: Firebase Console - Add Your Vercel URL

1. Go to **https://console.firebase.google.com/**
2. Select **pranavportfolio-1b517** project
3. Go to **Project Settings** (gear icon) → **Authentication** tab
4. Under **"Authorized JavaScript origins"**, click **"Add URI"**
5. Add your Vercel deployment URL (e.g., `https://portfolio-xxxxx.vercel.app`)
6. Click **"Save"**

## Step 8: Test Your Live Portfolio

1. Visit your Vercel URL
2. Test **"Sign in with Google"** ✅
3. Test **"Sign in with GitHub"** ✅
4. Test **"Download Resume"** button
5. Verify GitHub repos load

## Troubleshooting

### Issue: "Firebase config is missing"
- **Solution:** Check that all 6 environment variables are set in Vercel's project settings
- Redeploy if needed: Go to Vercel → Deployments → "Redeploy" (latest)

### Issue: "GitHub sign-in fails"
- **Solution:** Ensure your GitHub OAuth App callback URL matches Firebase settings
- Also add your Vercel URL to Firebase's Authorized Origins

### Issue: "Resume download not working"
- **Solution:** Ensure `public/Pranav_Mahajan_Resume.docx` is committed and pushed to GitHub

## Your Live Portfolio

Once deployed and tested, share your Vercel URL with:
- ✅ Recruiters
- ✅ LinkedIn (add link to your profile)
- ✅ Resume
- ✅ Email signature

---

**Next Steps:**
- Custom domain? Go to Vercel → Domains → Add your domain
- Auto-deploys? Every push to GitHub automatically redeploys to Vercel ✨

