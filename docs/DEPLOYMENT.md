# Deployment Guide — DevDeck

This guide details steps to deploy DevDeck to Vercel (Front-end & API) and Supabase (PostgreSQL Database).

---

## 1. Database Setup (Supabase)

1. Create a new project on the [Supabase Dashboard](https://supabase.com).
2. Go to **Project Settings > Database** to copy your connection strings:
   - **Transaction Connection String:** (Session pooling, port 6543) for application runs.
   - **Direct Connection String:** (Direct connection, port 5432) for running migrations.

---

## 2. Environment Variables

Create your environment variables on Vercel. Ensure to supply:

| Variable Name                   | Description                                        | Example / Recommended Value                            |
| ------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`                  | Supabase transaction connection string             | `postgres://postgres.xxx:6543/postgres?pgbouncer=true` |
| `DIRECT_URL`                    | Supabase direct connection string                  | `postgres://postgres.xxx:5432/postgres`                |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                               | `https://xxxx.supabase.co`                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key                                  | `<anon_key>`                                           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (secure API access)      | `<service_role_key>`                                   |
| `UPSTASH_REDIS_REST_URL`        | Upstash Redis REST endpoint for rate limiting      | `https://xxxx.upstash.io`                              |
| `UPSTASH_REDIS_REST_TOKEN`      | Upstash Redis authorization token                  | `<redis_token>`                                        |
| `OPENAI_API_KEY`                | API Key for daily quiz generation                  | `sk-proj-xxxx`                                         |
| `CRON_SECRET`                   | Authorization header token for daily cron requests | `super-secret-guid`                                    |
| `SEED_DEFAULT_PASSWORD`         | Fallback user password for database seeding        | `ChangeMe123!`                                         |

---

## 3. Deployment Steps

### Step 1: Initialize Database Schema

From your local terminal, point to the production database and run:

```bash
npx prisma db push
```

This syncs the Prisma models (including `User`, `Post`, `Reaction`, `QuizLibrary`) to PostgreSQL without losing existing data.

### Step 2: Seed Static Data

Execute the seed script to populate 20 tech quizzes inside `QuizLibrary`:

```bash
npx prisma db seed
```

### Step 3: Deploy to Vercel

1. Link your repository to Vercel.
2. Configure the Build Command:
   ```bash
   npx prisma generate && next build
   ```
3. Set the Environment Variables.
4. Click **Deploy**.

---

## 4. Automating Daily Quiz Generation

To generate a new tech quiz every day:

1. The endpoint `/api/admin/quiz/generate-daily` processes daily generation requests.
2. In production, configure a cron scheduler (such as Vercel Cron Jobs, GitHub Actions, or Upstash QStash) to send a POST request:
   - **URL:** `https://your-domain.vercel.app/api/admin/quiz/generate-daily`
   - **Headers:** `Authorization: Bearer <CRON_SECRET>`
   - **Schedule:** `0 6 * * *` (Every day at 06:00 UTC)
