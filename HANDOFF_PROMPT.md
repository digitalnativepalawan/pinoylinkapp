# AI Handoff Prompt — Finish katwa.link Backend & Endpoints

Copy everything below the line into your AI coding agent.

---

## Context

You are working in the repo `digitalnativepalawan/pinoylinkapp` — **katwa.link**, a Filipino-first
link-in-bio app (Linktree for the PH market). Users claim a username, pick a theme, add links
(Messenger, Shopee, Lazada, TikTok, GCash), and get a public profile with click analytics.

**Stack:** TanStack Start v1 (SSR) + TanStack Router (file-based routing) · React 19 ·
Tailwind CSS v4 · shadcn/ui on Radix · Supabase (Postgres + Auth + Storage) ·
TanStack Query v5 · Vite via `@lovable.dev/vite-tanstack-config` · Nitro → Cloudflare · Bun/npm

**Important:** Server logic uses TanStack Start **server functions** (`createServerFn`), NOT
Supabase Edge Functions and NOT Next.js API routes. Follow the existing pattern in
`src/lib/profile.functions.ts`.

### Current file layout

```
src/
├─ routes/                          # file-based routing ONLY (no src/pages/, no app/)
│  ├─ __root.tsx                    # shell: QueryClientProvider + AuthProvider + <Outlet/>
│  ├─ index.tsx                     # marketing landing + interactive theme switcher
│  ├─ claim.$username.tsx           # the editor (profile, theme, links, publish)
│  └─ $username.tsx                 # public profile renderer
├─ components/
│  ├─ kit.tsx                       # SHARED UI KIT — Card, Section, Button, Field, Pill,
│  │                                #   EmptyState, inputClass. USE THESE FOR ALL NEW UI.
│  ├─ ThemePicker.tsx               # one-tap theme chooser
│  ├─ templates/
│  │  ├─ theme.ts                   # 5 themes + resolveTheme() + legacy slug map
│  │  ├─ LinkTreeTemplate.tsx       # the single public-profile renderer
│  │  ├─ Pattern.tsx                # SVG/CSS background patterns
│  │  └─ index.tsx                  # TEMPLATES, renderTemplate, demoProps, ThemePhone
│  └─ ui/                           # ~50 shadcn primitives
├─ integrations/supabase/
│  ├─ client.ts                     # browser client
│  ├─ client.server.ts              # server client
│  ├─ auth-middleware.ts            # requireSupabaseAuth (GENERATED — do not edit)
│  ├─ auth-attacher.ts              # attachSupabaseAuth (GENERATED — do not edit)
│  └─ types.ts                      # generated DB types (GENERATED — do not edit)
├─ lib/
│  ├─ profile.functions.ts          # getPublicProfile, getMyAnalytics
│  ├─ api/example.functions.ts      # reference createServerFn pattern
│  ├─ auth.tsx                      # AuthProvider + useAuth (signInWithOtp, signOut)
│  └─ icons.ts                      # ICONS, getIcon, ICON_OPTIONS
supabase/config.toml                # project ref only — NO migrations checked in
```

### Database (3 tables, live in Supabase, no migrations in repo)

- **profiles** — `id`, `user_id`, `username` (unique), `display_name`, `bio`, `status`,
  `template`, `avatar_url`, `published`, `created_at`, `updated_at`
- **links** — `id`, `profile_id` (FK), `label`, `url`, `icon`, `color`, `position`, `enabled`
- **click_events** — `id`, `profile_id`, `link_id`, `event_type` (`page_view` | `link_click`),
  `referrer`, `user_agent`, `created_at`

### What already works

- Public profile rendering with 5 themes and legacy-slug fallback
- The editor: profile fields, theme picker, link CRUD, drag-reorder, avatar upload, publish
- `getPublicProfile` server fn (anon, published-only)
- `getMyAnalytics` server fn (auth-gated, fully written — **but nothing calls it**)
- Auth plumbing exists (`AuthProvider`, `useAuth`, bearer-token middleware)

---

## Your job

Finish the backend and endpoints. Work through the tasks **in order** — they are ranked by
severity. Task 1 is a live security hole; do not skip it.

---

### TASK 1 — Close the security hole: move all writes behind server functions 🔴 CRITICAL

**The problem.** Every mutation currently runs from the browser with the anon key:

- `src/routes/claim.$username.tsx` lines ~197, 244, 253, 296, 312–316, 324 —
  profile updates, link update/delete/upsert, avatar upload, publish
- `src/routes/$username.tsx` line ~78 — `click_events` insert

There is no server-side ownership check anywhere. Unless Supabase RLS is perfectly locked down,
**anyone can edit or delete anyone else's profile and links** by calling Supabase directly with
the publishable key that ships in the client bundle. The `click_events` insert is also trivially
spammable, which corrupts analytics.

**What to do.** Create `src/lib/profile.mutations.ts` and move every write into auth-gated server
functions. Follow the exact pattern in `getMyAnalytics` — `.middleware([requireSupabaseAuth])`
gives you `{ supabase, userId }` in context.

Implement:

| Server fn | Notes |
|---|---|
| `updateProfile` | zod-validate; verify the row's `user_id === userId` before updating |
| `updateUsername` | validate `/^[a-z0-9-]{3,30}$/`, reject a reserved-word list, handle `23505` |
| `checkUsername` | public; returns `{ available: boolean }` |
| `createLink` | verify profile ownership; enforce a max of 50 links per profile |
| `updateLink` | verify ownership **via the parent profile**, not just the link id |
| `deleteLink` | same ownership check |
| `reorderLinks` | accept an ordered `string[]` of link ids; renormalize `position` to 0..n-1 |
| `publishProfile` | require `display_name` and ≥1 link, else return a friendly error |
| `trackEvent` | public, rate-limited — see Task 2 |

Rules:
- Validate **every** input with zod. Never trust a client-supplied `profile_id`.
- Always re-derive the owning profile from `userId` server-side.
- Return typed, friendly errors (`{ error: string }`), never raw Postgres messages.
- Then delete the direct `supabase.from(...)` write calls from the route components and call
  these server functions instead. Keep the existing optimistic UI and debounced autosave —
  the "Saving…/Saved" indicator must keep working.

**Verify:** signed out, or signed in as user A, you cannot mutate user B's data.

---

### TASK 2 — Harden analytics ingestion

`trackEvent` is public by necessity (visitors aren't logged in), so it needs its own protection:

- Accept only `event_type: "page_view" | "link_click"`, a valid `profile_id`, and an optional
  `link_id` that must actually belong to that profile.
- Only record events for **published** profiles.
- Rate-limit per IP + profile (e.g. 1 page_view per IP per profile per 30 min) so a refresh loop
  can't inflate numbers. Derive the IP from request headers server-side.
- Truncate `user_agent` to 300 chars and strip query strings from `referrer`.
- Do not let a bot-looking user agent count toward totals.
- Fire-and-forget: the tracking call must never block or break the page render if it fails.

---

### TASK 3 — Build the auth flow (there is no sign-in UI at all) 🔴 BLOCKER

`AuthProvider` and `useAuth` exist and expose `signInWithOtp` / `signOut`, but **no route ever
calls `signInWithOtp`**. Users literally cannot sign in, which means nothing they build in the
editor is durably theirs. Today, an unauthenticated visitor to `/claim/foo` silently gets an
in-memory demo profile with `id: "local"` that is never persisted — they can do a full editing
session and lose everything.

Build:

1. **`src/routes/login.tsx`** — email magic-link form using the `kit.tsx` components.
   States: idle → sending → "Check your email" → error. Support a `?redirect=` param.
2. **Auth callback handling** so the magic link returns to the right place.
3. **Fix the editor's anonymous path.** Either require login before `/claim/$username`, or keep
   the local draft but show a persistent, honest banner: *"You're not signed in — sign in to save
   this page."* Save the draft to `localStorage` and hydrate it after login so nothing is lost.
   Never let someone spend 10 minutes editing and silently lose it.
4. **Sign-out control** and the user's avatar/email in the header when authenticated.
5. Landing nav: swap the CTA to "Log in" / "Dashboard" based on auth state.

---

### TASK 4 — Dashboard route (`getMyAnalytics` is written but orphaned)

There is a fully-implemented `getMyAnalytics` server function returning `pageViews`, `linkClicks`,
`ctr`, `topLink`, `topLinks`, and `series7d` — and **no route calls it**. The landing page has a
`DashboardSection` that is a static mockup.

Create **`src/routes/dashboard.tsx`** (auth-required):

- Stat cards: page views, link clicks, CTR, top link
- 7-day views chart (`recharts` is already a dependency)
- Top links list with click counts
- Quick links to edit and to view the live page
- Loading skeletons and a real empty state ("No visits yet — share your link")
- Use TanStack Query (`useQuery`) for fetching, and `kit.tsx` for all UI

Add a 30-day range toggle if `getMyAnalytics` is easy to parameterize.

---

### TASK 5 — Check in the database schema

`supabase/` contains only `config.toml`. The schema exists **solely in the hosted project** —
if it is ever lost, it is unreproducible, and nobody can review the RLS policies that Task 1
depends on.

- Add `supabase/migrations/0001_init.sql` reconstructing `profiles`, `links`, `click_events`
  (match `src/integrations/supabase/types.ts` exactly), including indexes on
  `profiles.username`, `links.profile_id`, `click_events.profile_id`, `click_events.created_at`.
- Add explicit **RLS policies**: public read of published profiles and their enabled links;
  writes restricted to `auth.uid() = user_id`; `click_events` insert-only for anon, readable
  only by the profile owner.
- Add the `avatars` storage bucket definition and its policies.
- Document in the README how to apply migrations.

---

### TASK 6 — Fix committed secrets

`.env` is **committed to the repo** with `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and the
`VITE_*` mirrors. Publishable keys are low-risk by design, but this is the wrong habit and will
leak a service key the moment someone adds one.

- Add `.env` to `.gitignore`, `git rm --cached .env`
- Commit a `.env.example` with empty placeholder values
- Document required env vars in the README

---

### TASK 7 — Ship the promised features that are currently fake

- **QR code** — the share modal has a QR button that does nothing. Generate a real QR for the
  profile URL with a download-as-PNG option.
- **Link enable/disable** — the `links.enabled` column exists and `getPublicProfile` filters on
  it, but the editor has no toggle. Add a switch per link row.
- **404 / not-found** — `$username.tsx` renders the not-found view with an HTTP **200**. Return a
  real 404 status for unclaimed usernames so search engines don't index them.
- **`getGreeting`** in `src/lib/api/example.functions.ts` is scaffold cruft — delete it.

---

### TASK 8 — Tests and CI (none exist)

- Add Vitest. Unit-test `resolveTheme` (including every legacy slug mapping), username
  validation, and the analytics aggregation in `getMyAnalytics`.
- Add integration tests for the Task 1 ownership checks — assert that user A **cannot** mutate
  user B's profile or links. These are the tests that matter most.
- Add `.github/workflows/ci.yml` running `tsc --noEmit`, `eslint`, `vitest`, and `npm run build`
  on PRs.

---

## Constraints

- **Do not edit generated files:** `src/integrations/supabase/types.ts`,
  `auth-middleware.ts`, `auth-attacher.ts`, `src/routeTree.gen.ts`.
- **Do not add Next.js or Remix conventions.** No `src/pages/`, no `app/`. Routing is
  file-based under `src/routes/` — see `src/routes/README.md`.
- **Do not add Supabase Edge Functions.** Use `createServerFn`.
- **Reuse `src/components/kit.tsx`** for all new UI so the design language stays consistent.
  Do not hand-roll new button or card styles.
- Preserve the 5 themes and the legacy slug mapping in `theme.ts` — existing published
  profiles depend on it.
- Keep it mobile-first. Most users are on phones on mobile data.
- `vite.config.ts` wraps `@lovable.dev/vite-tanstack-config`, which already bundles
  tanstackStart, React, Tailwind, tsconfig-paths and Nitro. Do not add those plugins manually.

## Definition of done

- `npx tsc --noEmit` clean
- `npx eslint src` — no new errors (168 pre-existing errors in the generated `types.ts` are
  expected and out of scope)
- `npm run build` passes
- No `supabase.from(...)` **write** calls remain in any component under `src/routes/`
- A signed-out user cannot mutate any data; user A cannot mutate user B's data
- A new user can: sign up → claim a username → add links → pick a theme → publish →
  view their live page → see analytics in the dashboard, without losing work at any step

Work task by task. Commit after each with a clear message explaining the reasoning, not just
the change.
