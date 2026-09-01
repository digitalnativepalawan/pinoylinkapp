import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Check,
  Copy,
  Eye,
  Share2,
  Rocket,
  ArrowLeft,
  Globe,
  QrCode,
  X,
  Plus,
  Trash2,
  Loader2,
  Upload,
  GripVertical,
  Link2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { getIcon, ICON_OPTIONS, type IconName } from "@/lib/icons";
import { TemplatePhonePreview, renderTemplate } from "@/components/templates";
import { ThemePicker } from "@/components/ThemePicker";
import { resolveTheme } from "@/components/templates/theme";
import { Button, Card, Section, Field, Pill, EmptyState, inputClass } from "@/components/kit";

type Profile = {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string | null;
  status: string;
  template: string;
  avatar_url: string | null;
  published: boolean;
};
type LinkRow = {
  id: string;
  profile_id: string;
  label: string;
  url: string;
  icon: string | null;
  color: string | null;
  position: number;
  enabled: boolean;
};

type Search = { template?: string };

export const Route = createFileRoute("/claim/$username")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    template: typeof s.template === "string" ? s.template : undefined,
  }),
  head: ({ params }) => ({
    meta: [{ title: `katwa.link/${params.username} — Customize` }],
  }),
  component: ClaimPage,
});

/** One-tap link shortcuts — the fastest route to a finished page. */
const QUICK_ADD: { label: string; icon: string; url: string }[] = [
  { label: "Messenger", icon: "MessageCircle", url: "https://m.me/" },
  { label: "Facebook", icon: "Facebook", url: "https://facebook.com/" },
  { label: "Instagram", icon: "Instagram", url: "https://instagram.com/" },
  { label: "TikTok", icon: "Music2", url: "https://tiktok.com/@" },
  { label: "Shopee", icon: "ShoppingBag", url: "https://shopee.ph/" },
  { label: "Lazada", icon: "Store", url: "https://lazada.com.ph/" },
  { label: "YouTube", icon: "Youtube", url: "https://youtube.com/@" },
  { label: "WhatsApp", icon: "MessageCircle", url: "https://wa.me/63" },
  { label: "Email", icon: "Mail", url: "mailto:" },
  { label: "Website", icon: "Globe", url: "https://" },
];

function ClaimPage() {
  const { username } = Route.useParams();
  const { template } = Route.useSearch();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "ok" | "taken">(
    "idle",
  );
  const [slugDraft, setSlugDraft] = useState(username);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  // Load profile + links (no auth required — falls back to a local-only demo profile)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (cancelled) return;

      let prof = p as Profile | null;

      // If signed in and no profile exists, create one. Otherwise use an in-memory demo profile.
      if (!prof && user) {
        const { data: created, error: insErr } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            username,
            display_name: username,
            template: template ?? "araw",
          })
          .select()
          .single();
        if (insErr) {
          if (insErr.code === "23505") setError("That username is already taken.");
          else setError(insErr.message);
        } else {
          prof = created as Profile;
        }
      }

      if (!prof) {
        prof = {
          id: "local",
          user_id: "local",
          username,
          display_name: username,
          bio: "",
          status: "online",
          template: template ?? "araw",
          avatar_url: null,
          published: false,
        };
      }

      setProfile(prof);
      setSlugDraft(prof.username);

      if (prof.id !== "local") {
        const { data: ls } = await supabase
          .from("links")
          .select("*")
          .eq("profile_id", prof.id)
          .order("position");
        if (!cancelled) setLinks((ls ?? []) as LinkRow[]);
      } else {
        setLinks([]);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, username, template]);

  // Debounced username availability
  useEffect(() => {
    if (!profile) return;
    if (slugDraft === profile.username) {
      setUsernameStatus("idle");
      return;
    }
    if (!/^[a-z0-9-]{2,30}$/.test(slugDraft)) {
      setUsernameStatus("taken");
      return;
    }
    setUsernameStatus("checking");
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", slugDraft)
        .maybeSingle();
      setUsernameStatus(data ? "taken" : "ok");
    }, 400);
    return () => clearTimeout(t);
  }, [slugDraft, profile]);

  // Debounced autosave for profile fields
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const patchProfile = useCallback(
    async (patch: Partial<Profile>) => {
      if (!profile) return;
      setProfile({ ...profile, ...patch });
      setSaveState("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const { error } = await supabase.from("profiles").update(patch).eq("id", profile.id);
        if (error && error.code === "23505") setError("That username is already taken.");
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1600);
      }, 500);
    },
    [profile],
  );

  const commitUsername = async () => {
    if (!profile || usernameStatus !== "ok") return;
    const { error } = await supabase
      .from("profiles")
      .update({ username: slugDraft })
      .eq("id", profile.id);
    if (error) {
      if (error.code === "23505") {
        setUsernameStatus("taken");
        setError("That username is already taken.");
      } else setError(error.message);
      return;
    }
    setProfile({ ...profile, username: slugDraft });
    navigate({ to: "/claim/$username", params: { username: slugDraft }, replace: true });
  };

  // Links CRUD
  const addLink = async (preset?: { label: string; icon: string; url: string }) => {
    if (!profile) return;
    const position = (links[links.length - 1]?.position ?? -1) + 1;
    const { data, error } = await supabase
      .from("links")
      .insert({
        profile_id: profile.id,
        label: preset?.label ?? "New Link",
        url: preset?.url ?? "https://",
        icon: preset?.icon ?? "Globe",
        color: "text-zinc-700",
        position,
        enabled: true,
      })
      .select()
      .single();
    if (!error && data) setLinks([...links, data as LinkRow]);
  };
  const removeLink = async (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
    await supabase.from("links").delete().eq("id", id);
  };
  const linkTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const patchLink = (id: string, patch: Partial<LinkRow>) => {
    setLinks((cur) => cur.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    const existing = linkTimers.current.get(id);
    if (existing) clearTimeout(existing);
    setSaveState("saving");
    const t = setTimeout(async () => {
      await supabase.from("links").update(patch).eq("id", id);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1600);
    }, 400);
    linkTimers.current.set(id, t);
  };

  // Drag and drop reorder — batch-update every row whose position changed
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const reorderLinks = async (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const fromIdx = links.findIndex((l) => l.id === fromId);
    const toIdx = links.findIndex((l) => l.id === toId);
    if (fromIdx < 0 || toIdx < 0) return;

    const next = [...links];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);

    // Compute rows whose position actually changed and renormalize to 0..n-1
    const changed = next
      .map((l, i) => ({ row: l, newPos: i }))
      .filter(({ row, newPos }) => row.position !== newPos);

    // Optimistic UI: apply normalized positions to every row
    const optimistic = next.map((l, i) => ({ ...l, position: i }));
    setLinks(optimistic);

    if (changed.length === 0) return;

    // Batch upsert — one round-trip, updates every affected row
    const payload = changed.map(({ row, newPos }) => ({
      id: row.id,
      profile_id: row.profile_id,
      label: row.label,
      url: row.url,
      icon: row.icon,
      color: row.color,
      enabled: row.enabled,
      position: newPos,
    }));
    const { error: upErr } = await supabase.from("links").upsert(payload, { onConflict: "id" });
    if (upErr) {
      // Roll back on failure
      setLinks(links);
      setError(upErr.message);
    }
  };

  // Avatar upload
  const [uploading, setUploading] = useState(false);
  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (!upErr) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await patchProfile({ avatar_url: data.publicUrl });
    }
    setUploading(false);
  };

  const handlePublish = async () => {
    if (!profile) return;
    await supabase.from("profiles").update({ published: true }).eq("id", profile.id);
    setProfile({ ...profile, published: true });
    setShareOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (error && !profile) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <div>
          <p className="text-lg font-semibold">{error}</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }
  if (!profile) return null;

  const liveUrl = `katwa.link/${profile.username}`;
  const fullUrl = `${typeof window !== "undefined" ? window.location.origin : "https://katwa.link"}/${profile.username}`;

  const themeLabel = resolveTheme(profile.template).label;
  const steps = [
    { label: "Name", done: !!profile.display_name && profile.display_name !== profile.username },
    { label: "Photo", done: !!profile.avatar_url },
    { label: "Links", done: links.length > 0 },
    { label: "Publish", done: profile.published },
  ];

  if (previewMode) {
    return (
      <PreviewMode
        profile={profile}
        links={links}
        onExit={() => setPreviewMode(false)}
        onPublish={handlePublish}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* ---------- Top bar ---------- */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 sm:flex">
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-xs backdrop-blur">
              <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium text-foreground">{liveUrl}</span>
              {profile.published ? (
                <Pill tone="live">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </Pill>
              ) : (
                <Pill>Draft</Pill>
              )}
            </div>
            <SaveIndicator state={saveState} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPreviewMode(true)}
              className="hidden sm:inline-flex"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden md:inline">Preview</span>
            </Button>
            <Button size="sm" onClick={handlePublish}>
              <Rocket className="h-4 w-4" />
              {profile.published ? "Update" : "Publish"}
            </Button>
          </div>
        </div>

        {/* Step rail — tells people exactly what's left to do */}
        <div className="mx-auto max-w-7xl px-4 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={s.label} className="flex shrink-0 items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    s.done ? "bg-emerald-500/15 text-emerald-300" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.done ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-current text-[8px]">
                      {i + 1}
                    </span>
                  )}
                  {s.label}
                </span>
                {i < steps.length - 1 && <span className="h-px w-3 bg-border" aria-hidden />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-auto max-w-7xl px-4 pt-3">
          <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* ---------- Profile ---------- */}
          <Section title="Your profile" desc="This is what visitors see at the top of your page.">
            <div className="grid gap-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-muted ring-2 ring-primary/20">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      {(profile.display_name || "K").slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted">
                    {uploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    {uploading ? "Uploading…" : "Upload photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
                  </label>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Square image works best. JPG or PNG.
                  </p>
                </div>
              </div>

              <Field
                label="Your link"
                hint={
                  <span
                    className={`text-[11px] font-medium ${
                      usernameStatus === "ok"
                        ? "text-emerald-400"
                        : usernameStatus === "taken"
                          ? "text-red-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {usernameStatus === "checking" && "checking…"}
                    {usernameStatus === "ok" && "available ✓"}
                    {usernameStatus === "taken" && "not available"}
                  </span>
                }
              >
                <div className="flex items-center rounded-xl border border-border bg-background/60 transition-colors focus-within:border-primary">
                  <span className="py-2.5 pl-3.5 text-sm text-muted-foreground">katwa.link/</span>
                  <input
                    value={slugDraft}
                    onChange={(e) =>
                      setSlugDraft(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                    }
                    onBlur={commitUsername}
                    className="min-w-0 flex-1 bg-transparent py-2.5 pr-3.5 text-sm font-medium outline-none"
                  />
                </div>
              </Field>

              <Field label="Display name">
                <input
                  value={profile.display_name}
                  onChange={(e) => patchProfile({ display_name: e.target.value })}
                  placeholder="e.g. Katwa Finds"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Bio"
                hint={
                  <span className="text-[11px] text-muted-foreground">
                    {(profile.bio ?? "").length}/120
                  </span>
                }
              >
                <textarea
                  value={profile.bio ?? ""}
                  onChange={(e) => patchProfile({ bio: e.target.value })}
                  rows={3}
                  maxLength={120}
                  placeholder="Tell visitors what you do in one line."
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <Field label="Availability">
                <div className="flex gap-2">
                  {(["online", "offline"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => patchProfile({ status: s })}
                      aria-pressed={profile.status === s}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                        profile.status === s
                          ? "border-primary bg-primary/12 text-primary"
                          : "border-border bg-background/60 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${s === "online" ? "bg-emerald-400" : "bg-zinc-500"}`}
                      />
                      {s === "online" ? "Active now" : "Away"}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </Section>

          {/* ---------- Theme ---------- */}
          <Section title="Theme" desc="One tap to restyle your whole page.">
            <ThemePicker
              value={profile.template}
              onChange={(slug) => patchProfile({ template: slug })}
            />
          </Section>

          {/* ---------- Links ---------- */}
          <Section
            title="Your links"
            desc="Drag to reorder. The first link is highlighted on your page."
            action={
              <Button size="sm" onClick={() => addLink()}>
                <Plus className="h-3.5 w-3.5" /> Add link
              </Button>
            }
          >
            {/* Quick-add presets — the fastest path to a finished page */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {QUICK_ADD.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => addLink(q)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground"
                >
                  <Plus className="h-3 w-3" />
                  {q.label}
                </button>
              ))}
            </div>

            <ul className="space-y-2">
              {links.map((l) => {
                const Icon = getIcon(l.icon);
                return (
                  <li
                    key={l.id}
                    draggable
                    onDragStart={(e) => {
                      setDragId(l.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOverId !== l.id) setDragOverId(l.id);
                    }}
                    onDragLeave={() => {
                      if (dragOverId === l.id) setDragOverId(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragId) reorderLinks(dragId, l.id);
                      setDragId(null);
                      setDragOverId(null);
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setDragOverId(null);
                    }}
                    className={`grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border bg-background/60 p-3 transition-all ${
                      dragOverId === l.id && dragId && dragId !== l.id
                        ? "border-primary ring-1 ring-primary/40"
                        : "border-border"
                    } ${dragId === l.id ? "opacity-40" : "hover:border-border/60 hover:bg-muted/40"}`}
                  >
                    <span
                      className="cursor-grab text-muted-foreground/60 transition-colors hover:text-foreground active:cursor-grabbing"
                      aria-label="Drag to reorder"
                    >
                      <GripVertical className="h-4 w-4" />
                    </span>

                    <div className="relative">
                      <select
                        value={(l.icon ?? "Globe") as IconName}
                        onChange={(e) => patchLink(l.id, { icon: e.target.value })}
                        className="h-9 w-9 cursor-pointer appearance-none rounded-lg bg-primary/12 text-transparent"
                        aria-label="Choose icon"
                      >
                        {ICON_OPTIONS.map((o) => (
                          <option key={o.name} value={o.name} className="text-foreground">
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-0 grid place-items-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <input
                        value={l.label}
                        onChange={(e) => patchLink(l.id, { label: e.target.value })}
                        placeholder="Link title"
                        className="w-full truncate bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground/60"
                      />
                      <input
                        value={l.url}
                        onChange={(e) => patchLink(l.id, { url: e.target.value })}
                        placeholder="https://"
                        className="mt-0.5 w-full truncate bg-transparent text-[11px] text-muted-foreground outline-none"
                      />
                    </div>

                    <button
                      onClick={() => removeLink(l.id)}
                      aria-label={`Delete ${l.label}`}
                      className="rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>

            {links.length === 0 && (
              <EmptyState
                icon={<Link2 className="h-5 w-5" />}
                title="No links yet"
                desc="Tap a shortcut above, or add a link from scratch."
                action={
                  <Button size="sm" onClick={() => addLink()}>
                    <Plus className="h-3.5 w-3.5" /> Add your first link
                  </Button>
                }
              />
            )}
          </Section>
        </div>

        {/* ---------- Live preview ---------- */}
        <aside className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Live preview</div>
                <div className="text-xs text-muted-foreground">Updates as you type.</div>
              </div>
              <Pill tone="accent">{themeLabel}</Pill>
            </div>
            <div className="flex justify-center">
              <MiniPreview profile={profile} links={links} />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPreviewMode(true)}
              className="mt-4 w-full"
            >
              <Eye className="h-4 w-4" /> Open full preview
            </Button>
            {profile.published && (
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-background/60 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Globe className="h-3 w-3" /> View live page
              </a>
            )}
          </Card>
        </aside>
      </div>

      {/* ---------- Mobile action bar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <SaveIndicator state={saveState} className="mr-auto" />
          <Button variant="secondary" size="sm" onClick={() => setPreviewMode(true)}>
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Rocket className="h-4 w-4" /> {profile.published ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      {shareOpen && (
        <ShareModal
          url={fullUrl}
          onClose={() => setShareOpen(false)}
          onView={() => {
            setShareOpen(false);
            setPreviewMode(true);
          }}
        />
      )}
    </div>
  );
}

function SaveIndicator({
  state,
  className = "",
}: {
  state: "idle" | "saving" | "saved";
  className?: string;
}) {
  if (state === "idle") return <span className={className} />;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground ${className}`}
    >
      {state === "saving" ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Check className="h-3 w-3 text-emerald-400" /> Saved
        </>
      )}
    </span>
  );
}

function MiniPreview({ profile, links }: { profile: Profile; links: LinkRow[] }) {
  return (
    <div className="relative mx-auto w-[260px] shrink-0">
      <div className="relative rounded-[2.5rem] border-[6px] border-[#0a0a0a] bg-black p-1 shadow-2xl shadow-black/60">
        <div className="relative overflow-hidden rounded-[2rem] aspect-[9/19.5] text-zinc-900">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          <TemplatePhonePreview
            slug={profile.template}
            props={{ profile, links, onLinkClick: () => {} }}
          />
        </div>
      </div>
    </div>
  );
}

function PreviewMode({
  profile,
  links,
  onExit,
  onPublish,
}: {
  profile: Profile;
  links: LinkRow[];
  onExit: () => void;
  onPublish: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border/80 bg-background/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" /> Preview
          <Pill tone="accent" className="ml-1">
            {resolveTheme(profile.template).label}
          </Pill>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onExit}>
            <X className="h-3.5 w-3.5" /> Exit
          </Button>
          <Button size="sm" onClick={onPublish}>
            <Rocket className="h-3.5 w-3.5" /> {profile.published ? "Update" : "Publish"}
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-md">
        {renderTemplate(profile.template, { profile, links, onLinkClick: () => {} })}
      </div>
    </div>
  );
}

function ShareModal({
  url,
  onClose,
  onView,
}: {
  url: string;
  onClose: () => void;
  onView: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My katwa.link", url });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl duration-200 animate-in fade-in zoom-in-95"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-medium">You're live! 🎉</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your katwa.link page is published. Share it everywhere.
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary">
            <Globe className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 truncate text-sm">{url}</div>
          <button
            onClick={copy}
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
          >
            {copied ? (
              <>
                <Check className="mr-1 inline h-3 w-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="mr-1 inline h-3 w-3" /> Copy
              </>
            )}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={share}
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background/60 py-3 text-xs font-medium transition-all hover:-translate-y-0.5 hover:bg-muted"
          >
            <Share2 className="h-4 w-4 text-primary" /> Share
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={onView}
            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background/60 py-3 text-xs font-medium transition-all hover:-translate-y-0.5 hover:bg-muted"
          >
            <Eye className="h-4 w-4 text-primary" /> View page
          </a>
          <button className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background/60 py-3 text-xs font-medium transition-all hover:-translate-y-0.5 hover:bg-muted">
            <QrCode className="h-4 w-4 text-primary" /> QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
