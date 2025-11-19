# Pranav Mahajan — Portfolio

A modern, animated React portfolio showcasing projects, resume, and professional information. Features Firebase authentication (Google & GitHub), GitHub project listing, and deployment-ready configuration.

## ✨ Features

- **Animated UI** — Smooth animations with Framer Motion
- **GitHub Integration** — Auto-fetch and display your GitHub repositories
- **Firebase Auth** — Sign in with Google or GitHub
- **Responsive Design** — Works on desktop and mobile
- **Resume Download** — Link to download your resume
- **Social Links** — LinkedIn, GitHub, email integration
- **Vercel Ready** — Deployment config included

## 🚀 Local Setup

### 1. Clone or extract the project

```powershell
cd c:\Users\Lenovo\Downloads\PranavPortfolio
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Configure Firebase

Create a `.env` file in the project root with your Firebase config:

```
VITE_FIREBASE_API_KEY=AIzaSyBl2QtWefSQgwIlbmg2uLJttg5ap3fw38w
VITE_FIREBASE_AUTH_DOMAIN=pranavportfolio-1b517.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pranavportfolio-1b517
VITE_FIREBASE_STORAGE_BUCKET=pranavportfolio-1b517.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=203675250878
VITE_FIREBASE_APP_ID=1:203675250878:web:d822a4dbaa1afaca78eeef
```

(Or copy from `.env.example` and fill in your values)

### 4. Run dev server (port 4000)

```powershell
npm run dev
```

Visit **http://localhost:4000** in your browser.

## 📄 Resume Download

Copy your resume file to the `public/` folder:

```powershell
Copy-Item "c:\Users\Lenovo\Downloads\Pranav_Mahajan_Resume.docx" "public/Pranav_Mahajan_Resume.docx"
```

The "Download Resume" button will link to `/Pranav_Mahajan_Resume.docx`.

## 🔐 Firebase Authentication Setup

Your Firebase project (`pranavportfolio-1b517`) is already configured with:
- ✅ Google Sign-in
- ✅ GitHub Sign-in

**For GitHub auth to work**, ensure your GitHub OAuth App is set up:
1. Go to https://github.com/settings/developers → OAuth Apps
2. Create an app or edit existing one
3. Set Authorization callback URL to: `https://pranavportfolio-1b517.firebaseapp.com/__/auth/handler`
4. Client ID and Secret are configured in Firebase

## 🏗️ Build for Production

```powershell
npm run build
```

Output is in the `dist/` folder, ready for deployment.

## 🚀 Vercel Deployment

### Step 1: Push to GitHub

```powershell
git add .
git commit -m "Initial portfolio setup"
git push origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Add environment variables (under Settings → Environment Variables):
   ```
   VITE_FIREBASE_API_KEY=AIzaSyBl2QtWefSQgwIlbmg2uLJttg5ap3fw38w
   VITE_FIREBASE_AUTH_DOMAIN=pranavportfolio-1b517.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=pranavportfolio-1b517
   VITE_FIREBASE_STORAGE_BUCKET=pranavportfolio-1b517.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=203675250878
   VITE_FIREBASE_APP_ID=1:203675250878:web:d822a4dbaa1afaca78eeef
   ```
6. Click **Deploy**

### Step 3: Configure GitHub OAuth for Vercel URL

After deployment, you'll have a Vercel URL (e.g., `https://pranav-portfolio.vercel.app`).

Update your GitHub OAuth App:
1. Go to https://github.com/settings/developers → OAuth Apps → Your App
2. Update **Authorization callback URL** to:
   ```
   https://pranavportfolio-1b517.firebaseapp.com/__/auth/handler
   ```

Then add your Vercel URL to Firebase Console:
1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel URL to "Authorized JavaScript origins"

## 📝 Customization

- **Portfolio content** — Edit `src/Portfolio.jsx`
- **Styles** — Modify `src/styles.css` (CSS variables at the top)
- **Skills/Projects** — Update the About section in `src/Portfolio.jsx`
- **Social links** — Change URLs in header and footer

## 🛠️ Tech Stack

- React 18
- Vite
- Framer Motion (animations)
- Firebase (authentication)
- GitHub API (project listing)

## 📧 Contact

- Email: pranavmahajan.4122005@gmail.com
- LinkedIn: https://www.linkedin.com/in/pranav-mahajan-673283323
- GitHub: https://github.com/pranav1237

---

**Happy coding! 🎉**
