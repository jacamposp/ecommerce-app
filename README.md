# Elite Soccer — Ecommerce App

A Next.js storefront selling soccer jerseys, with Google sign-in, Stripe checkout, and an admin panel for managing products, stock, and orders.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 + shadcn/ui · Prisma 7 + PostgreSQL · Auth.js v5 (Google OAuth) · Stripe Checkout · Vercel Blob (image uploads)

> **Note:** This project runs on a pre-release Next.js 16 build with breaking changes vs. the stable docs you may know — see `AGENTS.md` if you're touching routing/config code.

## Prerequisites

- Node.js 20+
- A PostgreSQL database (any provider works — [Prisma Postgres](https://www.prisma.io/postgres), [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app), or local Postgres)
- A [Google Cloud](https://console.cloud.google.com/) OAuth client (for sign-in)
- A [Stripe](https://dashboard.stripe.com/register) account (test mode is fine)
- The [Stripe CLI](https://docs.stripe.com/stripe-cli) (for forwarding webhooks to your local machine)
- A [Vercel](https://vercel.com) account with a Blob store (for the admin panel's product image uploads)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then fill in `.env`:

| Variable | Where to get it |
| --- | --- |
| `DATABASE_URL` | Your Postgres connection string. |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev. |
| `AUTH_SECRET` | Run `npx auth secret` (or `openssl rand -base64 32`). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → **APIs & Services → Credentials → Create Credentials → OAuth client ID** (Web application). Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → **Developers → API keys** (use the test mode secret key). |
| `STRIPE_WEBHOOK_SECRET` | See [Stripe webhooks](#stripe-webhooks) below. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Dashboard → **Storage → Create Database → Blob**, connect it to this project, then copy the token from the store's ".env.local" tab (or run `vercel env pull` if the project is linked with the Vercel CLI). |

### 3. Set up the database

Apply migrations (this also generates the Prisma client):

```bash
npx prisma migrate dev
```

Seed sample products:

```bash
npm run db:seed
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Stripe webhooks

Checkout relies on Stripe webhooks to mark orders paid and to release stock reserved by abandoned checkouts. In a separate terminal, forward events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe --events checkout.session.completed,checkout.session.expired
```

Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET` in `.env` and restart `npm run dev`.

In production, create a webhook endpoint in the Stripe Dashboard pointing at `https://<your-domain>/api/webhooks/stripe`, subscribed to the same two events, and use the signing secret it gives you.

### 6. Access the admin panel

The seed script doesn't create an admin account — sign in with Google once first (so your user row exists), then promote yourself via Prisma Studio:

```bash
npx prisma studio
```

Open the `User` table and set your user's `role` to `ADMIN`. The admin panel is then available at [http://localhost:3000/admin](http://localhost:3000/admin), also linked from the account menu (top-right avatar) once you're an admin.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack). |
| `npm run build` | Production build. |
| `npm run start` | Start the production server (after `build`). |
| `npm run lint` | Run ESLint. |
| `npm run db:seed` | Seed sample products. |
| `npx prisma studio` | Browse/edit the database in a GUI. |
| `npx prisma migrate dev` | Apply schema migrations and regenerate the Prisma client. |
