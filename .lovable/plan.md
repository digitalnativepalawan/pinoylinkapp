## Redesign the 6 existing templates

Refactor the 6 legacy templates (`classic-pinoy`, `seller`, `creator`, `business`, `resort`, `patriotic-pinoy`) to share the same renderer pattern already used by `pinoy-fitness` and `isla-creator`. This gives every surface (landing gallery, editor picker, live preview, full preview, public profile) one visually-consistent, upgraded design per slug — instead of today's split between phone-only mockups and a generic public renderer.

No changes to Supabase, auth, storage, analytics, link CRUD, routes, or slugs.

### Visual direction (per template)

Each gets a strong Filipino identity, richer backgrounds, and category-appropriate composition. All use CSS gradients + inline SVG accents (no image files).

- **classic-pinoy** — Warm cream base (`#faf6ec`) with faint hand-woven banig pattern (SVG), Philippine sun watermark top-right, thin navy `#0a2e6b` and red `#c92030` accent ribbons. Serif display name (Playfair via existing font stack) with navy underline flourish. Rounded-2xl white link cards with soft shadow, colored icon tile per link. Feels editorial and premium.
- **seller** — Sunny amber-to-cream vertical gradient with subtle diagonal price-tag SVG stripes. "TRUSTED SELLER" ribbon badge under avatar. Feature-product card (kept, but restyled with brand color-block header). Bold uppercase title, orange `#f97316` primary buttons with white icon circles, GCash/Maya/BPI/COD pay row on cream chips. Feels marketplace-fresh.
- **creator** — Deep aurora background (`#0d0824 → #2a1055 → #4b1264`) with animated-looking SVG starfield + soft gold glow behind avatar. Gradient chrome ring on avatar, verified badge, name in bold display. Featured-content card gets a real gradient thumbnail with `Play`. Glass link buttons (`bg-white/8 backdrop-blur border-white/10`) with brand-color icon glow. Icon strip of socials at bottom. Feels premium content-creator.
- **business** — Deep emerald `#064e3b → #052e1b` background with cream `#f5efe0` info panels, gold `#c9a84c` divider hairlines, subtle art-deco corner ornaments (SVG). Logo mark in a cream circle, "OPEN NOW" pill in gold. Menu / booking / location cards use cream backgrounds with emerald text and gold icons. Feels hospitality-grade.
- **resort** — Sky-to-teal gradient (`#7dd3fc → #0284c7 → #0f766e`) with layered SVG wave shapes at bottom and a subtle palm-frond silhouette. Cream circular avatar frame, sun/anchor icon. "PARADISE AWAITS" small-caps kicker. Semi-transparent white glass cards with teal icons. Yellow "Book Your Stay" primary button stands out. Feels travel-luxury.
- **patriotic-pinoy** — Split composition: deep navy `#0038a8` left, red `#cc1f2d` right triangle, big yellow sun SVG behind avatar with 8 rays, 3 stars top. Bold uppercase italic display name with white/yellow drop shadow. Link buttons alternate navy/white/red with yellow chevrons, small English+Tagalog subtitle. Footer stripe "🇵🇭 PROUDLY PINOY". Feels flag-forward and confident.

Shared refinements across all six:
- Circular avatar with per-template border treatment; `Active now` / `Away` pill positioned consistently.
- Bio uses per-template accent color for one highlighted phrase.
- Link cards use `getIcon(l.icon)`, host domain shown as subtitle when `url` is parseable, `ChevronRight` at right.
- Mobile-first: `max-w-md mx-auto px-5 py-10`, comfortable at 320-desktop.
- Consistent footer with `katwa.link/{username}` mark styled per palette.

### Refactor

Move all six into the shared template system so every surface renders the same visual:

**New files** in `src/components/templates/`:
- `ClassicPinoyTemplate.tsx`
- `SellerTemplate.tsx`
- `CreatorTemplate.tsx`
- `BusinessTemplate.tsx`
- `ResortTemplate.tsx`
- `PatrioticPinoyTemplate.tsx`

Each exports a default component accepting the existing `TemplateProps` (`{ profile, links, onLinkClick? }`) from `PinoyFitnessTemplate.tsx`.

**Edit** `src/components/templates/index.tsx`:
- Register all 8 templates in a unified `TEMPLATES` array (existing 2 + new 6) with `{ slug, label, desc, swatch, Component }`.
- Keep `isNewTemplate`, `renderNewTemplate`, `NewTemplatePhonePreview` names but broaden them to cover all 8 slugs (rename internally to `isKnownTemplate` / `renderTemplate` with a back-compat alias to avoid a wide import churn).
- Replace the 6 phone-preview components (`ClassicPinoyPhone`, `SellerPhone`, `CreatorPhone`, `BusinessPhone`, `ResortPhone`, `PatrioticPhone`) with scaled previews built from the new full templates (same pattern as `PinoyFitnessPhone` / `IslaCreatorPhone`), using seed sample data so the landing gallery still shows filled cards.

**Edit** `src/routes/index.tsx`:
- Import the 6 new phone previews from `@/components/templates` and delete the old inline phone components + `LinkRow`/`PayRow`/`PayBadge` helpers they used. Keep `PhoneFrame` export (still consumed by `claim.$username.tsx`'s `MiniPreview` fallback path — or move `PhoneFrame` into `src/components/templates/PhoneFrame.tsx` and re-export to avoid circular import; whichever is cleaner).
- The `templates` array continues to drive `TemplatesSection`, now pointing at the new preview components. Labels, colors, and descriptions updated to reflect the redesign.
- Hero preview switches from `ClassicPinoyPhone` (old) to the new `ClassicPinoyPhone` preview.

**Edit** `src/routes/$username.tsx`:
- Delete the inline `TEMPLATE_BG` + hand-rolled renderer. Route all templates through `renderTemplate(p.template, { profile, links, onLinkClick })`. Fallback to `classic-pinoy` when slug is unknown so no live profile breaks.
- Analytics (`page_view` on mount, `link_click` via `onLinkClick`) unchanged.

**Edit** `src/routes/claim.$username.tsx`:
- `MiniPreview` becomes a thin wrapper that calls the shared phone-scale preview for every template (no more generic pink/violet fallback).
- Full-screen `PreviewMode` calls `renderTemplate(profile.template, …)` for all 8 slugs (currently only new templates).
- Template picker grid: keep the 8 tiles, refresh the 6 old swatches to match the new palettes.

### Not changing
- Database schema, RLS, templates stored on profiles (all 6 slugs preserved verbatim).
- Auth flow, avatar upload, link CRUD, drag-and-drop reorder, publish flow.
- Landing page structure outside `TemplatesSection` (features section, dashboard section, footer).

### Verify
- `bun run lint` — 0 errors
- `bun run build` — production build succeeds
- Manual visual check of all 6 slugs on:
  1. Landing `/#templates` gallery
  2. Editor `/claim/<name>` template picker + right-side live preview
  3. Editor "Open full preview" mode
  4. Public `/{username}` route with a real profile per slug

### Files touched
**New (6)**: `src/components/templates/{ClassicPinoy,Seller,Creator,Business,Resort,PatrioticPinoy}Template.tsx`
**Edited (4)**: `src/components/templates/index.tsx`, `src/routes/index.tsx`, `src/routes/$username.tsx`, `src/routes/claim.$username.tsx`
