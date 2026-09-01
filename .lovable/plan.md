# Make every button actually do something

## What's broken today

Removing the login flow left the editor with no signed-in user, so the app falls back to an in-memory "local" profile (id = `"local"`). Every database call in the editor targets that fake id, so it silently fails:

- Add link / edit link / delete link / drag reorder write to `links` with `profile_id = "local"` — rejected, nothing saves.
- Display name, bio, status, template autosave — rejected, nothing saves.
- Avatar upload is skipped entirely (it requires a user id).
- Publish sets `published = true` on a row that doesn't exist, then shows the share modal with a link to `/username` — that public page then shows "This page doesn't exist yet".
- QR Code button in the share modal has no handler at all.

Landing page links do navigate, but every template card and the nav button always go to `/claim/yourname` instead of a name the visitor chose, and the gallery is missing the new LIKHA MARKET template.

## The fix

### 1. Silent session so writes work with no login screen
Turn on anonymous sign-in on the backend. On first visit the app quietly gets a session in the background — no email, no magic link, no UI. Everything the editor does (save, add link, upload avatar, publish) then works and persists, and the profile belongs to that visitor so nobody else can edit it.

### 2. Editor buttons wired to real state
- Wait for the silent session before loading, then create/load the real profile row — drop the fake "local" profile entirely.
- Add / edit / delete / reorder links, autosave fields, avatar upload, and Publish all hit the real row. Show an inline error toast if a write fails instead of failing silently.
- Publish button reflects true DB state (Publish vs Update), and Unpublish is available once live.

### 3. Share modal
- QR Code button renders a scannable QR of the live URL with a download option.
- "View page" opens the real published URL on this domain (not the literal `katwa.link` string).

### 4. Landing page CTAs
- Nav "Claim your link" and each template card carry the username typed in the hero field when there is one, and pre-select that card's template.
- Add LIKHA MARKET to the gallery so all 9 templates are pickable.
- Footer social icons: link them to the project's channels or drop them if there are none.

## Technical notes

- Backend: enable anonymous sign-ins; existing RLS (`auth.uid() = user_id`) already covers anonymous users correctly, no policy changes.
- `src/lib/auth.tsx`: call `signInAnonymously()` when no session exists.
- `src/routes/claim.$username.tsx`: remove the `id: "local"` fallback branch; gate loading on session ready; surface write errors.
- `src/routes/index.tsx`: lift hero username state into the shared CTA links; add the missing template entry.
- No schema, storage, analytics, or template-visual changes.
