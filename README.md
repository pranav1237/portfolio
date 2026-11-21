# Pranav Mahajan — Portfolio

A modern, animated React portfolio showcasing projects, resume, and professional information.

## Features

- **Animated UI** — Smooth animations with Framer Motion
- **GitHub Integration** — Fetches and displays public GitHub repositories through a Vercel API route
- **Responsive Design** — Works on desktop and mobile
- **Resume Download** — Link to download your resume
- **Social Links** — LinkedIn, GitHub, and email
- **Vercel Ready** — Deployment configuration included

## Local Setup

### 1. Clone the project

```bash
git clone https://github.com/pranav1237/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and configure the LinkedIn OAuth values only if the LinkedIn OAuth API endpoints are being used locally.

Never commit real credentials. Keep OAuth client secrets and session encryption secrets in environment variables.

### 4. Run the development server

```bash
npm run dev
```

Visit **http://localhost:4000**.

## Resume Download

Copy your resume file to the `public/` folder using the filename expected by the portfolio:

```
public/Pranav_Mahajan_Resume.docx
```

## Production Build

```bash
npm run build
```

The production output is generated in the `dist/` folder.

## Vercel Deployment

1. Import this GitHub repository into Vercel.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add only the required server-side OAuth environment variables in **Project Settings → Environment Variables**.
5. Deploy.

## Tech Stack

- React 18
- Vite
- Framer Motion
- Vercel Functions
- GitHub REST API

## Contact

- Email: pranavmahajan.4122005@gmail.com
- LinkedIn: https://www.linkedin.com/in/pranav-mahajan-673283323
- GitHub: https://github.com/pranav1237

## Security

- Browser responses are configured with Content Security Policy and other security headers in `vercel.json`.
- Vercel Firewall is enabled with bot protection and a per-IP API rate limit.
- GitHub Actions runs dependency vulnerability checks and a production build; CodeQL analyzes JavaScript/TypeScript.
- OAuth client secrets and session encryption secrets must be stored only as server-side environment variables. Never commit real credentials.
- This repository's current portfolio frontend does not integrate Firebase. Do not add Firebase API keys or Firebase configuration unless a Firebase feature is deliberately implemented and reviewed.

**Deployment note:** Keep Vercel's verified-commit protection enabled and merge repository changes through GitHub.
