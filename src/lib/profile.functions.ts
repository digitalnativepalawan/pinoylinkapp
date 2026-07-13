import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function makePublicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getPublicProfile = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ username: z.string() }).parse(i))
  .handler(async ({ data }) => {
    const sb = makePublicClient();
    const { data: profile } = await sb
      .from("profiles")
      .select("id, username, display_name, bio, status, template, avatar_url, published")
      .eq("username", data.username)
      .eq("published", true)
      .maybeSingle();
    if (!profile) return null;
    const { data: links } = await sb
      .from("links")
      .select("id, label, url, icon, color, position, enabled")
      .eq("profile_id", profile.id)
      .eq("enabled", true)
      .order("position", { ascending: true });
    return { profile, links: links ?? [] };
  });

export const getMyAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!profile) return null;

    const [viewsRes, clicksRes, eventsRes] = await Promise.all([
      supabase
        .from("click_events")
        .select("id", { count: "exact", head: true })
        .eq("profile_id", profile.id)
        .eq("event_type", "page_view"),
      supabase
        .from("click_events")
        .select("id", { count: "exact", head: true })
        .eq("profile_id", profile.id)
        .eq("event_type", "link_click"),
      supabase
        .from("click_events")
        .select("link_id, event_type, created_at")
        .eq("profile_id", profile.id)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()),
    ]);

    const pageViews = viewsRes.count ?? 0;
    const linkClicks = clicksRes.count ?? 0;
    const ctr = pageViews > 0 ? Math.round((linkClicks / pageViews) * 1000) / 10 : 0;

    // top link
    const clickCounts = new Map<string, number>();
    for (const e of eventsRes.data ?? []) {
      if (e.event_type === "link_click" && e.link_id) {
        clickCounts.set(e.link_id, (clickCounts.get(e.link_id) ?? 0) + 1);
      }
    }
    let topLink: { label: string; clicks: number } | null = null;
    if (clickCounts.size > 0) {
      const [topId, topCount] = [...clickCounts.entries()].sort((a, b) => b[1] - a[1])[0];
      const { data: link } = await supabase.from("links").select("label").eq("id", topId).maybeSingle();
      if (link) topLink = { label: link.label, clicks: topCount };
    }

    // top links list (up to 4)
    const topLinkIds = [...clickCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    const topLinks: { id: string; label: string; icon: string | null; clicks: number }[] = [];
    if (topLinkIds.length) {
      const { data: linkRows } = await supabase
        .from("links")
        .select("id, label, icon")
        .in("id", topLinkIds.map(([id]) => id));
      for (const [id, clicks] of topLinkIds) {
        const l = linkRows?.find((r) => r.id === id);
        if (l) topLinks.push({ id, label: l.label, icon: l.icon, clicks });
      }
    }

    // 7-day series
    const days: { date: string; views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() - i);
      days.push({ date: d.toISOString().slice(0, 10), views: 0 });
    }
    for (const e of eventsRes.data ?? []) {
      if (e.event_type !== "page_view") continue;
      const day = e.created_at.slice(0, 10);
      const bucket = days.find((x) => x.date === day);
      if (bucket) bucket.views += 1;
    }

    return { pageViews, linkClicks, ctr, topLink, topLinks, series7d: days };
  });
