# Wire katwa.link to the Backend

Connect the existing UI to the `profiles`, `links`, `click_events` tables and the `avatars` bucket. No visual redesign — only data wiring plus one new public route and an auth flow.

## 1. Magic-link auth

- Add `src/lib/auth.tsx`: React context wrapping `supabase.auth`. Listens to `onAuthStateChange`, exposes `user`, `signInWithOtp(email)`, `signOut()`. Mount provider in `src/routes/__root.tsx`.
- New route `src/routes/auth.tsx` (public): handles magic-link return. Reads `?next=/claim/<username>&pendingUsername=<name>` from URL; after session hydrates, if `pendingUsername` is set and no profile exists for `user_id`, insert a `profiles` row with that username, then navigate to `next`.
- Landing page `ClaimInline` (in `src/routes/index.tsx`): if logged out, open a small inline "Enter your email" step, call `signInWithOtp` with `emailRedirectTo = ${origin}/auth?next=/claim/<username>&pendingUsername=<username>`. If logged in, navigate straight to `/claim/<username>` (creating the row if missing).
- Add tiny header affordance driven by session (Sign in / Sign out link).

## 2. Editor `/claim/$username` — real reads/writes

Rewrite the data layer of `src/routes/claim.$username.tsx` (keep all JSX/design):

- On mount: require session (redirect to `/auth?next=...` if none). Fetch `profiles` by `username`; if not found and it matches the signed-in user's pending claim, create it; if found but `user_id !== auth.uid()`, redirect to `/` + toast.
- Load `links` where `profile_id = profile.id` ordered by `position`.
- Replace `useState` seeds with server data via TanStack Query (`profile`, `links` query keys).
- Username field: debounced 400ms availability check (`select id from profiles where username = ?`). On save, update `profiles.username`; catch unique-violation (`23505`) → "username already taken".
- Autosave (debounced 600ms) for `display_name`, `bio`, `status`, `template` via `update profiles`.
- Links CRUD: `insert` on add (position = max+1), `update` on edit, `delete` on remove, batch `update position` on reorder. Persist `label`, `url`, `icon` (store icon name string), `color`, `enabled`.
- Avatar upload input → `supabase.storage.from('avatars').upload('${user_id}/${crypto.randomUUID()}.<ext>', file, { upsert: true })`, then store public URL in `profiles.avatar_url`.
- Publish button → `update profiles set published = true`; badge reflects `profile.published`.
- Share modal URL becomes `${origin}/${profile.username}`.

Icon handling: keep the existing icon map in a shared module `src/lib/icons.ts` mapping string → lucide component, so DB stores a name and UI resolves the component.

## 3. New public route `/$username`

- File `src/routes/$username.tsx` (public, SSR on).
- Loader: call a public server fn `getPublicProfile({ username })` using the server publishable client that selects `profiles` (safe columns) + `links` where `published = true`. Returns null → route renders "This page doesn't exist yet" with CTA to `/`.
- Uses the existing template renderer components (not the phone-frame mockup) full-screen, switched on `profile.template`.
- Client effect on mount: `insert into click_events (profile_id, event_type) values (?, 'page_view')` via a public server fn `logEvent` (rate-limit-light, ignores errors).
- Each link click handler: `insert into click_events (profile_id, link_id, event_type) values (?, ?, 'link_click')` then `window.location.href = url` (fire-and-forget with `keepalive` fetch to not block navigation).
- `head()` sets title = display_name, description = bio, og:image = avatar_url.

## 4. Dashboard analytics (real data)

In `DashboardSection` (inside `src/routes/index.tsx`) — only when signed in:

- Server fn `getMyAnalytics` (`requireSupabaseAuth`) returns:
  - `pageViews` = count where `event_type='page_view'`
  - `linkClicks` = count where `event_type='link_click'`
  - `ctr` = clicks / views
  - `topLink` = group by `link_id` order by count desc limit 1, joined to `links.label`
  - `series7d` = per-day page_view counts for last 7 days
- All scoped by `profile_id in (select id from profiles where user_id = auth.uid())`.
- Swap hardcoded numbers + feed SVG chart from `series7d`. Show empty-state ("Publish your page to see stats") when no profile.

## 5. Safety & scale

- Wrap all inserts/updates that touch `username` in try/catch translating Postgres `23505` → user-friendly toast.
- Every query filters by `profile_id` or `user_id`; add index note only if needed (existing PK/unique cover current needs).
- Use TanStack Query for caching; invalidate `['profile', username]` / `['links', profileId]` after mutations.

## Files

**New**
- `src/lib/auth.tsx` — auth context + hook
- `src/lib/icons.ts` — icon name ↔ component map
- `src/lib/profile.functions.ts` — `getPublicProfile`, `logEvent` (public), `getMyAnalytics` (`requireSupabaseAuth`)
- `src/routes/auth.tsx` — magic-link email prompt + return handler
- `src/routes/$username.tsx` — public profile page

**Edited (data wiring only, no visual changes)**
- `src/routes/__root.tsx` — mount AuthProvider, session listener
- `src/routes/index.tsx` — `ClaimInline` email step, `DashboardSection` real stats, header session affordance
- `src/routes/claim.$username.tsx` — swap local state for Supabase reads/writes, avatar upload, publish

## Technical notes

- Public server fn uses the publishable-key server client pattern (opaque `sb_` key fetch shim), not `supabaseAdmin`.
- `getMyAnalytics` uses `requireSupabaseAuth`; called from a component with `useServerFn` + `useQuery` (never from a public loader).
- `click_events` insert from `/$username` uses a public `createServerFn` (RLS already allows anon insert), or direct `supabase.from('click_events').insert(...)` from the browser client — pick the latter to avoid an extra roundtrip.
- No schema migration required — all tables/policies already exist.
