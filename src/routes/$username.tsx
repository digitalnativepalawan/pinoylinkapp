import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Link2 } from "lucide-react";
import { getPublicProfile } from "@/lib/profile.functions";
import { supabase } from "@/integrations/supabase/client";
import { renderTemplate } from "@/components/templates";

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
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Link2 className="h-7 w-7 -rotate-45" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">This page is still up for grabs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nobody has published here yet. Want the name?
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-110 hover:shadow-md hover:shadow-primary/20 active:scale-[0.98]"
        >
          Claim your katwa.link
        </Link>
      </div>
    </div>
  );
}

function PublicProfile() {
  const { data } = Route.useLoaderData();

  useEffect(() => {
    if (!data?.profile) return;
    supabase
      .from("click_events")
      .insert({
        profile_id: data.profile.id,
        event_type: "page_view",
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      })
      .then(() => {});
  }, [data?.profile?.id]);

  if (!data?.profile) {
    return <NotFoundView />;
  }

  const p = data.profile;

  const handleClick = async (linkId: string, url: string) => {
    try {
      await supabase.from("click_events").insert({
        profile_id: p.id,
        link_id: linkId,
        event_type: "link_click",
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });
    } catch {
      /* ignore */
    }
    window.location.href = url;
  };

  return renderTemplate(p.template, {
    profile: p,
    links: data.links,
    onLinkClick: handleClick,
  });
}
