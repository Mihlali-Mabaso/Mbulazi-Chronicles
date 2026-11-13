# Mbulazi Chronicles

A private shared plans and wishlist app for two people. It supports notes, categories, optional dates, and marking plans complete. The app does not accept personal photo uploads; its mascot artwork is bundled locally.

## Local development

1. Install Node.js and the Vercel CLI (`npm i -g vercel`).
2. Create a Supabase project and run `supabase.sql` in its SQL Editor.
3. Copy `.env.example` to `.env.local`, fill in your values, and run `vercel dev` from this project folder.
4. Open the local URL shown by Vercel. Static file preview (`index.html`) alone does not include the server API.

Generate `SESSION_SECRET` with a secure random generator; it must be at least 32 characters. Keep all secrets out of Git. `APP_PASSCODE` is the shared passcode. After it is accepted, a signed, HttpOnly, Secure, SameSite=Strict cookie lasts 24 hours. The API validates the cookie on each request. The Supabase service role key remains server-side and is never sent to the browser.

## Deploy to Vercel

Import this folder as the project root. No build command is needed. Add `APP_PASSCODE`, `SESSION_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` as Vercel environment variables, then deploy. Keep RLS enabled; `supabase.sql` grants no table privileges to browser roles. The Vercel API is the only app path to the database.

## Repository contents

- `index.html`, `style.css`, `app.js`: responsive app interface.
- `api/`: passcode session and authenticated plan API routes.
- `supabase.sql`: schema and locked-down database setup.
- `mascots.png`: supplied mascot artwork.
