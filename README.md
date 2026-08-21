# RM EV Services — Website

Informational and lead-generation website for RM EV Services Private
Limited: station directory, services/technology showcase, franchise lead
capture, customer feedback, and an admin dashboard to manage it all.
Bilingual (English/Telugu) on public pages.

This project does **not** handle payments, charging sessions, or charger
control — customers charge through their existing third-party EV apps.

## Stack

- Next.js (App Router) + TypeScript + React
- Tailwind CSS + Radix primitives (shadcn/ui-style components)
- Supabase (Postgres + Auth + Storage)
- next-intl (English + Telugu)
- Cloudflare Turnstile (bot protection on public forms)
- Zod validation
- Hosting: Vercel (app) + Supabase (data)

## 1. Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) account (free tier is enough to start)
- A [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
  site (free)
- A [Vercel](https://vercel.com) account for deployment

No Supabase or Vercel project exists yet for this app — create them
following the steps below.

## 2. Create the Supabase project

1. In the Supabase dashboard, create a new project (pick a region close to
   your users, e.g. Mumbai/`ap-south-1`).
2. Once it's provisioned, go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**server-only, never
     expose to the browser**)
3. Apply the schema. Either:
   - **Using the Supabase CLI** (recommended):
     ```bash
     npm install -g supabase
     supabase login
     supabase link --project-ref <your-project-ref>
     supabase db push          # applies everything in supabase/migrations
     ```
   - **Or paste manually**: open the SQL editor in the Supabase dashboard
     and run each file in `supabase/migrations/` in filename order, then
     `supabase/seed/seed.sql`.
4. Seed initial content (Sri Sai Restaurant station, amenities catalog,
   services catalog, site settings) by running `supabase/seed/seed.sql` in
   the SQL editor, or `supabase db reset` locally if using the CLI.
5. Create your first admin user:
   - In the dashboard, go to **Authentication → Users → Add user** and
     create an account with an email/password.
   - Then in the SQL editor, insert a matching row into `admins` so that
     user is recognized as an admin:
     ```sql
     insert into public.admins (id, email, full_name)
     values ('<the auth user''s UUID>', 'you@example.com', 'Your Name');
     ```
6. Create the storage bucket policies (already included in
   `supabase/migrations/20260821000004_storage.sql`, applied automatically
   with the rest of the migrations) — this creates a public `media` bucket
   with admin-only write access.

## 3. Configure Cloudflare Turnstile

1. Create a Turnstile widget for your domain (and `localhost` for local
   dev) in the Cloudflare dashboard.
2. Copy the **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
3. Copy the **Secret Key** → `TURNSTILE_SECRET_KEY`.

## 4. Local development

```bash
npm install
cp .env.example .env.local   # fill in the values from steps 2–3
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/en`. Admin panel
is at `http://localhost:3000/admin/login`.

## 5. Environment variables

See `.env.example` for the full list. Notably:

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — fallback WhatsApp click-to-chat number
  (E.164, no `+`). Can also be set/overridden from `/admin/settings` →
  `whatsapp_number` once the app is running.
- `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, sitemap.xml, and OG
  tags. No production domain has been assigned yet — update this once one
  exists.

## 6. Deploying to Vercel

1. Push this repo to GitHub (or another Vercel-supported Git provider).
2. In Vercel, "Add New Project" → import the repo.
3. Add all variables from `.env.example` under **Settings → Environment
   Variables** (use the real Supabase/Turnstile values from steps 2–3, and
   your production `NEXT_PUBLIC_SITE_URL` once a domain is picked).
4. Deploy. Vercel will auto-deploy on every push to the default branch.
5. Point your custom domain at the Vercel project once one is decided
   (Section 18 of the project brief — not yet assigned).

## 7. Project structure

```
src/
  app/
    [locale]/(public)/   Public marketing site (bilingual, locale-prefixed)
    admin/                Admin dashboard (English-only)
  actions/                Server actions (all backend writes go through here)
  components/             UI (shadcn-style primitives + feature components)
  lib/                    Supabase clients, validation schemas, constants
  types/database.ts       Hand-maintained Supabase Database type
supabase/
  migrations/             SQL schema + RLS policies, in apply order
  seed/seed.sql            Seed data (Sri Sai Restaurant station, etc.)
messages/
  en.json / te.json        Static UI strings for next-intl
```

## 8. Known open items

Carried over from the project brief (Section 18) — these need real-world
input before they can be finalized:

- Production domain name
- WhatsApp business number
- Franchise investment-range buckets (form currently uses free text)
- Whether additional stations beyond Sri Sai Restaurant exist/are planned
- Real station/equipment photography (seed data ships with no images)
- Some equipment electrical specs (transformer, cabling, earthing, surge
  protection) are not in the schema yet — the `equipment` table only
  models the fields listed in the project brief (Section 8); add columns
  in a follow-up migration if these need to be tracked.

## 9. Scope

Out of scope for this build (see project brief Section 1): payment
gateway, wallet, charging session management, real-time charger
control/reservation, OCPP server, user charging accounts, subscriptions.
