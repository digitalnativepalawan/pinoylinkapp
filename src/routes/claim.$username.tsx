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
  LogOut,
  GripVertical,
} from "lucide-react";
import { PhoneFrame } from "./index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { getIcon, ICON_OPTIONS, type IconName } from "@/lib/icons";
import {
  NEW_TEMPLATES,
  NewTemplatePhonePreview,
  isNewTemplate,
  renderNewTemplate,
} from "@/components/templates";

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

function ClaimPage() {
  const { username } = Route.useParams();
  const { template } = Route.useSearch();
  const { user, loading: authLoading, signOut } = useAuth();
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

  // Redirect unauth users to /auth
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({
        to: "/auth",
        search: { next: `/claim/${username}`, pendingUsername: username },
        replace: true,
      });
    }
  }, [authLoading, user, username, navigate]);

  // Load profile + links
  useEffect(() => {
    if (!user) return;
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

      if (p && p.user_id !== user.id) {
        setError("This link belongs to someone else.");
        setLoading(false);
        return;
      }

      let prof = p as Profile | null;
      if (!prof) {
        // Try to create; user is signed in, username is free.
        const { data: created, error: insErr } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            username,
            display_name: username,
            template: template ?? "classic-pinoy",
          })
          .select()
          .single();
        if (insErr) {
          if (insErr.code === "23505") setError("That username is already taken.");
          else setError(insErr.message);
          setLoading(false);
          return;
        }
        prof = created as Profile;
      }

      setProfile(prof);
      setSlugDraft(prof.username);

      const { data: ls } = await supabase
        .from("links")
        .select("*")
        .eq("profile_id", prof.id)
        .order("position");
      if (!cancelled) {
        setLinks((ls ?? []) as LinkRow[]);
        setLoading(false);
      }
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
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const { error } = await supabase.from("profiles").update(patch).eq("id", profile.id);
        if (error && error.code === "23505") setError("That username is already taken.");
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
  const addLink = async () => {
    if (!profile) return;
    const position = (links[links.length - 1]?.position ?? -1) + 1;
    const { data, error } = await supabase
      .from("links")
      .insert({
        profile_id: profile.id,
        label: "New Link",
        url: "https://",
        icon: "Globe",
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
    const t = setTimeout(async () => {
      await supabase.from("links").update(patch).eq("id", id);
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="hidden flex-1 items-center justify-center sm:flex">
            <div className="rounded-lg border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="text-foreground font-medium">{liveUrl}</span>
              {profile.published && (
                <span className="ml-2 inline-flex items-center gap-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-400">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" /> live
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => signOut().then(() => navigate({ to: "/" }))}
              className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline-flex sm:items-center sm:gap-1"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted"
            >
              <Eye className="h-4 w-4" /> <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Rocket className="h-4 w-4" /> {profile.published ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-auto max-w-7xl px-4 pt-3">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/50 p-5">
            <h2 className="text-lg font-medium">Profile</h2>

            <div className="mt-4 grid gap-4">
              <Field label="Avatar">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-border bg-muted">
                    {profile.avatar_url && (
                      <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted">
                    {uploading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Upload className="h-3 w-3" />
                    )}
                    {uploading ? "Uploading…" : "Change"}
                    <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
                  </label>
                </div>
              </Field>

              <Field label="Username">
                <div className="flex items-center rounded-lg border border-border bg-background">
                  <span className="px-3 text-sm text-muted-foreground">katwa.link/</span>
                  <input
                    value={slugDraft}
                    onChange={(e) =>
                      setSlugDraft(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                    }
                    onBlur={commitUsername}
                    className="flex-1 bg-transparent py-2.5 pr-3 text-sm outline-none"
                  />
                  <span
                    className={`pr-3 text-xs ${usernameStatus === "ok" ? "text-emerald-400" : usernameStatus === "taken" ? "text-red-400" : "text-muted-foreground"}`}
                  >
                    {usernameStatus === "checking" && "checking…"}
                    {usernameStatus === "ok" && "available ✓"}
                    {usernameStatus === "taken" && "taken"}
                    {usernameStatus === "idle" && "✓"}
                  </span>
                </div>
              </Field>
              <Field label="Display name">
                <input
                  value={profile.display_name}
                  onChange={(e) => patchProfile({ display_name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Bio">
                <textarea
                  value={profile.bio ?? ""}
                  onChange={(e) => patchProfile({ bio: e.target.value })}
                  rows={3}
                  maxLength={120}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                <div className="mt-1 text-right text-[10px] text-muted-foreground">
                  {(profile.bio ?? "").length}/120
                </div>
              </Field>
              <Field label="Status">
                <div className="flex gap-2">
                  {(["online", "offline"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => patchProfile({ status: s })}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize ${
                        profile.status === s
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${s === "online" ? "bg-emerald-400" : "bg-zinc-500"}`}
                      />
                      {s === "online" ? "Active now" : "Away"}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Template">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[
                    {
                      slug: "classic-pinoy",
                      label: "Classic Pinoy",
                      swatch: ["#ffffff", "#ffd23a", "#0038a8", "#cc1f2d"],
                    },
                    {
                      slug: "seller",
                      label: "Seller",
                      swatch: ["#fff6e3", "#fb923c", "#ee4d2d", "#10b981"],
                    },
                    {
                      slug: "creator",
                      label: "Creator",
                      swatch: ["#1a103d", "#2d1654", "#e1306c", "#ff0000"],
                    },
                    {
                      slug: "business",
                      label: "Business",
                      swatch: ["#064e3b", "#0d7a5f", "#f5f0e0", "#c9a84c"],
                    },
                    {
                      slug: "resort",
                      label: "Resort",
                      swatch: ["#38bdf8", "#0369a1", "#5eead4", "#fef3c7"],
                    },
                    {
                      slug: "patriotic-pinoy",
                      label: "Patriotic Pinoy",
                      swatch: ["#0038a8", "#cc1f2d", "#ffd23a", "#ffffff"],
                    },
                    ...NEW_TEMPLATES.map((t) => ({
                      slug: t.slug,
                      label: t.label,
                      swatch: t.swatch as unknown as string[],
                    })),
                  ].map((t) => {
                    const active = profile.template === t.slug;
                    return (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() => patchProfile({ template: t.slug })}
                        className={`flex flex-col items-start gap-2 rounded-lg border p-2.5 text-left transition ${active ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-background hover:bg-muted"}`}
                      >
                        <div className="flex h-6 w-full overflow-hidden rounded-md">
                          {t.swatch.map((c, i) => (
                            <div key={i} className="h-full flex-1" style={{ background: c }} />
                          ))}
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wide">
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Links</h2>
                <p className="text-sm text-muted-foreground">Add, edit, and reorder your links.</p>
              </div>
              <button
                onClick={addLink}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                <Plus className="h-3 w-3" /> Add Link
              </button>
            </div>
            <ul className="mt-4 space-y-2">
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
                    className={`grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border bg-background p-3 ${
                      dragOverId === l.id && dragId && dragId !== l.id
                        ? "border-primary"
                        : "border-border"
                    } ${dragId === l.id ? "opacity-50" : ""}`}
                  >
                    <span
                      className="cursor-grab text-muted-foreground active:cursor-grabbing"
                      aria-label="Drag to reorder"
                    >
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <select
                      value={(l.icon ?? "Globe") as IconName}
                      onChange={(e) => patchLink(l.id, { icon: e.target.value })}
                      className="h-9 w-9 appearance-none rounded-lg bg-muted text-transparent"
                      style={{ backgroundImage: "none" }}
                      aria-label="Icon"
                    >
                      {ICON_OPTIONS.map((o) => (
                        <option key={o.name} value={o.name}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <div className="-ml-12 pointer-events-none grid h-9 w-9 place-items-center">
                      <Icon className={`h-4 w-4 ${l.color || "text-zinc-500"}`} />
                    </div>
                    <div className="min-w-0">
                      <input
                        value={l.label}
                        onChange={(e) => patchLink(l.id, { label: e.target.value })}
                        className="w-full truncate bg-transparent text-sm font-medium outline-none"
                      />
                      <input
                        value={l.url}
                        onChange={(e) => patchLink(l.id, { url: e.target.value })}
                        className="mt-0.5 w-full truncate bg-transparent text-[11px] text-muted-foreground outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removeLink(l.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
              {links.length === 0 && (
                <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No links yet. Add your first one.
                </li>
              )}
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Live Preview</div>
                <div className="text-xs text-muted-foreground">How your page looks.</div>
              </div>
            </div>
            <div className="flex justify-center">
              <MiniPreview profile={profile} links={links} />
            </div>
            <button
              onClick={() => setPreviewMode(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-sm hover:bg-muted"
            >
              <Eye className="h-4 w-4" /> Open full preview
            </button>
            {profile.published && (
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-xs text-muted-foreground hover:bg-muted"
              >
                <Globe className="h-3 w-3" /> View live page
              </a>
            )}
          </div>
        </aside>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function MiniPreview({ profile, links }: { profile: Profile; links: LinkRow[] }) {
  if (isNewTemplate(profile.template)) {
    return (
      <PhoneFrame>
        <NewTemplatePhonePreview
          slug={profile.template}
          props={{ profile, links, onLinkClick: () => {} }}
        />
      </PhoneFrame>
    );
  }
  return (
    <PhoneFrame>
      <div className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-pink-50 to-violet-50">
        <div className="pt-10 px-3 pb-4">
          <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-pink-200 to-pink-400 shadow-lg">
            {profile.avatar_url && (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="mt-2 text-center">
            <div
              className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-semibold text-white ${profile.status === "online" ? "bg-emerald-500" : "bg-zinc-400"}`}
            >
              ● {profile.status === "online" ? "Active now" : "Away"}
            </div>
            <h3 className="mt-1 text-sm font-semibold tracking-tight text-zinc-900">
              {profile.display_name}
            </h3>
            <p className="mt-0.5 whitespace-pre-line text-[9px] text-zinc-600">{profile.bio}</p>
          </div>
          <div className="mt-3 space-y-1.5">
            {links.map((l) => {
              const Icon = getIcon(l.icon);
              return (
                <div
                  key={l.id}
                  className="flex items-center gap-2.5 rounded-xl bg-white px-2.5 py-2 shadow-sm"
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-50">
                    <Icon className={`h-4 w-4 ${l.color || "text-zinc-700"}`} />
                  </div>
                  <div className="min-w-0 flex-1 truncate text-[11px] font-semibold leading-tight text-zinc-900">
                    {l.label}
                  </div>
                  <ChevronRight className="h-3 w-3 text-zinc-400" />
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-center text-[9px] text-zinc-500">
            🔗 katwa.link/{profile.username}
          </div>
        </div>
      </div>
    </PhoneFrame>
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
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0e1226] to-[#1a0e26]">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/50 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Eye className="h-4 w-4" /> Preview mode
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
          >
            <X className="mr-1 inline h-3 w-3" /> Exit
          </button>
          <button
            onClick={onPublish}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            <Rocket className="h-3 w-3" /> {profile.published ? "Update" : "Publish"}
          </button>
        </div>
      </div>
      {isNewTemplate(profile.template) ? (
        <div className="mx-auto max-w-md">
          {renderNewTemplate(profile.template, { profile, links, onLinkClick: () => {} })}
        </div>
      ) : (
        <div className="flex justify-center py-10">
          <MiniPreview profile={profile} links={links} />
        </div>
      )}
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
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
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

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-background p-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary">
            <Globe className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 truncate text-sm">{url}</div>
          <button
            onClick={copy}
            className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
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
            className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background py-3 text-xs hover:bg-muted"
          >
            <Share2 className="h-4 w-4 text-primary" /> Share
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={onView}
            className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background py-3 text-xs hover:bg-muted"
          >
            <Eye className="h-4 w-4 text-primary" /> View page
          </a>
          <button className="flex flex-col items-center gap-1 rounded-lg border border-border bg-background py-3 text-xs hover:bg-muted">
            <QrCode className="h-4 w-4 text-primary" /> QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
