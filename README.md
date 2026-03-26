# My BPM Mini

Single-operator BPM mini with lead management, Chrome extension capture, and a lightweight ATS/talent pool.

## Workspaces

- `apps/web`: Next.js operator app
- `apps/extension`: Chrome extension
- `packages/shared`: shared constants, schemas, and utilities
- `supabase/migrations`: Supabase SQL migrations

## Required environment variables

Copy `apps/web/.env.example` to `apps/web/.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
VITE_DEFAULT_APP_BASE_URL=...
```

`VITE_DEFAULT_APP_BASE_URL` is optional and only affects the Chrome extension build default.

## Development

```bash
pnpm install
pnpm dev
```

If your browser shows `HTTP ERROR 431` on `localhost`, use `http://127.0.0.1:3000` instead. `localhost` often accumulates oversized cookies from multiple local apps.

Build the extension separately during development with:

```bash
pnpm dev:extension
```

## Database

Apply all SQL files in `supabase/migrations/` through your Supabase migration workflow before using the app against a fresh project.

## Extension

Build the Chrome extension bundle with:

```bash
pnpm --filter extension build
```

Load the generated `apps/extension/dist` directory as an unpacked Chrome extension.
If you want the built extension to default to your deployed app instead of `http://127.0.0.1:3000`, set `VITE_DEFAULT_APP_BASE_URL` before building it.

## Vercel Deployment

For a GitHub-to-Vercel deployment:

1. Import the repository into Vercel.
2. Set the project Root Directory to `apps/web`.
3. Use the workspace package manager from the repo root (`pnpm` via the checked-in `packageManager` field).
4. Add these environment variables in Vercel Project Settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public client values and must be available to the web app.
- `OPENAI_API_KEY` is server-only and is used only by the authenticated extension OCR backend route.
- If `OPENAI_API_KEY` is missing, the OCR route fails cleanly, but the rest of the app still works.
- `VITE_DEFAULT_APP_BASE_URL` is optional and only affects the Chrome extension's default app URL during extension builds.
- If `VITE_DEFAULT_APP_BASE_URL` is not set, the Chrome extension defaults to `http://127.0.0.1:3000` for local development. After the web app is deployed, either rebuild the extension with `VITE_DEFAULT_APP_BASE_URL` set to your Vercel domain or update the extension's saved app base URL from the popup before using it against production.
