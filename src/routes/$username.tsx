import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { getPublicProfile } from "@/lib/profile.functions";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/icons";
import { isNewTemplate, renderNewTemplate } from "@/components/templates";

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const res = await getPublicProfile({ data: { username: params.username } });
    return { data: res };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.data?.profile;
    if (!p) return { meta: [{ title: "Not found — katwa.link" }] };
    return {
      meta: [
        { title: `${p.display_name} — katwa.link` },
        { name: "description", content: p.bio || `${p.display_name} on katwa.link` },
        { property: "og:title", content: p.display_name },
        { property: "og:description", content: p.bio || "" },
        { property: "og:type", content: "profile" },
        ...(p.avatar_url ? [{ property: "og:image", content: p.avatar_url }] : []),
      ],
    };
  },
  component: PublicProfile,
  errorComponent: () => <NotFoundView />,
  notFoundComponent: () => <NotFoundView />,
});

function NotFoundView() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
      <div className="max-w-sm">
        <div className="text-6xl">🔗</div>
        <h1 className="mt-4 text-2xl font-semibold">This page doesn't exist yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The link isn't published — or the username is up for grabs.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Claim your katwa.link
        </Link>
      </div>
    </div>
  );
}

const TEMPLATE_BG: Record<string, string> = {
  "classic-pinoy": "bg-gradient-to-b from-white via-white to-zinc-50 text-zinc-900",
  "seller": "bg-[#fff6e3] text-zinc-900",
  "creator": "bg-gradient-to-b from-[#1a103d] via-[#2d1654] to-[#0e0a26] text-white",
  "business": "bg-gradient-to-b from-emerald-900 via-emerald-950 to-black text-white",
  "resort": "bg-gradient-to-b from-sky-400 via-sky-600 to-teal-900 text-white",
  "patriotic-pinoy": "bg-gradient-to-b from-[#0038a8] via-[#0b1d52] to-[#0b1d52] text-white",
};

function PublicProfile() {
  const { data } = Route.useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!data?.profile) return;
    supabase.from("click_events").insert({
      profile_id: data.profile.id,
      event_type: "page_view",
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    }).then(() => {});
  }, [data?.profile?.id]);

  if (!data?.profile) {
    return <NotFoundView />;
  }

  const p = data.profile;
  const bgClass = TEMPLATE_BG[p.template] ?? TEMPLATE_BG["classic-pinoy"];
  const isDark = bgClass.includes("text-white");

  const handleClick = async (linkId: string, url: string) => {
    try {
      await supabase.from("click_events").insert({
        profile_id: p.id,
        link_id: linkId,
        event_type: "link_click",
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });
    } catch {}
    window.location.href = url;
  };

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="mx-auto max-w-md px-5 pb-16 pt-14">
        <div className="flex flex-col items-center text-center">
          <div className={`h-28 w-28 overflow-hidden rounded-full border-4 ${isDark ? "border-white/80" : "border-white"} shadow-xl`}>
            {p.avatar_url ? (
              <img src={p.avatar_url} alt={p.display_name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-pink-200 to-pink-400" />
            )}
          </div>
          <div className={`mt-3 inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold text-white ${p.status === "online" ? "bg-emerald-500" : "bg-zinc-500"}`}>
            ● {p.status === "online" ? "Active now" : "Away"}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{p.display_name}</h1>
          {p.bio && <p className={`mt-1 whitespace-pre-line text-sm ${isDark ? "text-white/80" : "text-zinc-600"}`}>{p.bio}</p>}
        </div>

        <div className="mt-8 space-y-3">
          {data.links.map((l: { id: string; label: string; url: string; icon: string | null; color: string | null }) => {
            const Icon = getIcon(l.icon);
            return (
              <button
                key={l.id}
                onClick={() => handleClick(l.id, l.url)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left shadow-sm transition hover:-translate-y-0.5 ${isDark ? "bg-white/10 backdrop-blur hover:bg-white/15" : "bg-white hover:shadow-md"}`}
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isDark ? "bg-white/10" : "bg-zinc-50"}`}>
                  <Icon className={`h-5 w-5 ${l.color || (isDark ? "text-white" : "text-zinc-700")}`} />
                </div>
                <div className="min-w-0 flex-1 truncate text-sm font-semibold">{l.label}</div>
                <ChevronRight className={`h-4 w-4 ${isDark ? "text-white/60" : "text-zinc-400"}`} />
              </button>
            );
          })}
        </div>

        <div className={`mt-10 text-center text-xs ${isDark ? "text-white/60" : "text-zinc-500"}`}>
          <button onClick={() => navigate({ to: "/" })} className="hover:underline">
            🔗 katwa.link
          </button>
        </div>
      </div>
    </div>
  );
}
