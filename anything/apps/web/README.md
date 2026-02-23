# SalonBooker Web App

Multi-salon booking flow: **Select Salon → Choose Service → Pick Time → Confirm**.

## Run the app

From this directory (`apps/web`):

```bash
npm install
npm run dev
```

If the dev script fails, run the CLI directly:

```bash
npx @react-router/dev dev
```

Open the URL shown (usually http://localhost:5173).

## Google sign-in

To enable “Sign in with Google”, set these in your environment (e.g. `.env`):

- `AUTH_GOOGLE_ID` – Google OAuth client ID  
- `AUTH_GOOGLE_SECRET` – Google OAuth client secret  

Create credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and set the redirect URI to your app’s auth callback (e.g. `http://localhost:4000/api/auth/callback/google` for dev).

## If `npm install` fails

- Run from **`apps/web`**, not the monorepo root.
- Use Node 18+ (`node -v`).
- Clear cache and retry: `npm cache clean --force` then `npm install`.
- On Windows PowerShell use `;` instead of `&&` between commands.
