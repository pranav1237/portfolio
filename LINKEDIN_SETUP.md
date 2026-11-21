# LinkedIn connection setup

This project uses LinkedIn OpenID Connect for a secure, read-only basic profile connection.

## Vercel environment variables

Add these under Project Settings → Environment Variables for Production (and Preview if desired):

- `LINKEDIN_CLIENT_ID`: Client ID from the LinkedIn Developer app.
- `LINKEDIN_CLIENT_SECRET`: Primary Client Secret from the LinkedIn Developer app.
- `LINKEDIN_REDIRECT_URI`: `https://pranavmahajanportfolio.vercel.app/api/linkedin/callback`
- `LINKEDIN_SESSION_SECRET`: a unique random secret of at least 32 characters. Generate one locally with `openssl rand -hex 32`.
- `LINKEDIN_OWNER_EMAIL`: the primary email returned by your LinkedIn OpenID Connect account; the callback rejects other LinkedIn accounts.

Never put the Client Secret or session secret in frontend code, GitHub, chat, or a committed .env file.

After saving the variables, redeploy the project. The callback URL must exactly match the Authorized redirect URL in LinkedIn's Auth tab.

## Endpoints

- `GET /api/linkedin/login`: starts OAuth and creates a short-lived CSRF state cookie.
- `GET /api/linkedin/callback`: exchanges the authorization code server-side, reads the OpenID Connect userinfo endpoint, and stores the access token in an encrypted, HttpOnly, Secure, SameSite=Lax cookie.
- `GET /api/linkedin/profile`: returns only basic profile fields to the portfolio; never returns the access token.
- `POST /api/linkedin/disconnect`: clears the local encrypted session cookie.

The token cookie is encrypted with AES-256-GCM using `LINKEDIN_SESSION_SECRET`. OAuth state is validated before token exchange.

## LinkedIn API limits

The app requests only `openid profile email`. This permits authentication and basic OIDC profile fields. It does not grant access to personal post history, full work experience, certificates, or the activity feed. `w_member_social` is a separate publishing permission and is not requested by the login flow.

## Content maintenance

Experience dates and certificate metadata should be maintained as portfolio content until LinkedIn grants an API scope that legitimately exposes those fields. A role is marked current only when its end date is absent; setting an end date makes it completed. Do not add credentials that have not been earned or verified.
