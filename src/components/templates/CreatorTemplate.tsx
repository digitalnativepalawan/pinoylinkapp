import { ChevronRight, BadgeCheck, Play } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const GOLD = "#f7c948";

function Starfield() {
  const stars = Array.from({ length: 44 }).map((_, i) => ({
    cx: (i * 137.5) % 100,
    cy: (i * 89.3) % 100,
    r: (i % 5) * 0.3 + 0.4,
    o: ((i % 7) + 3) / 10,
  }));
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.o} />
      ))}
    </svg>
  );
}

export default function CreatorTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        background: "radial-gradient(120% 80% at 50% 0%, #4b1264 0%, #2a1055 45%, #0d0824 100%)",
      }}
    >
      <Starfield />
      {/* Aurora glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(247,201,72,0.45), transparent 60%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(219,39,119,0.4), transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-md px-5 pb-16 pt-14">
        <div className="mx-auto flex flex-col items-center">
          <div
            className="relative h-32 w-32 rounded-full p-[3px]"
            style={{
              background: `conic-gradient(from 180deg, ${GOLD}, #ec4899, #8b5cf6, ${GOLD})`,
            }}
          >
            <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#150a30] bg-[#150a30]">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{ background: "linear-gradient(135deg, #fbbf24, #f472b6)" }}
                />
              )}
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: profile.status === "online" ? "#34d399" : "#a1a1aa" }}
            />
            {profile.status === "online" ? "Live now" : "Away"}
          </div>

          <h1 className="mt-3 flex items-center gap-2 text-center text-3xl font-black tracking-tight">
            {profile.display_name}
            <BadgeCheck className="h-6 w-6" style={{ color: "#38bdf8" }} />
          </h1>
          {profile.bio && (
            <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-white/80">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Featured video card */}
        <div
          className="relative mt-6 h-28 overflow-hidden rounded-2xl border border-white/10"
          style={{
            background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 45%, #6366f1 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 12px)",
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white/20 backdrop-blur">
              <Play className="h-6 w-6 fill-white text-white" />
            </div>
          </div>
          <div className="absolute bottom-2 left-3 text-[10px] font-black uppercase tracking-widest text-white/95">
            ✨ Featured Drop
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          {links.map((l) => {
            const Icon = getIcon(l.icon);
            let host = "";
            try {
              host = new URL(l.url).hostname.replace(/^www\./, "");
            } catch {
              /* ignore */
            }
            return (
              <button
                key={l.id}
                onClick={() => handle(l.id, l.url)}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
              >
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10"
                  style={{ background: `${GOLD}22` }}
                >
                  <Icon className="h-5 w-5" style={{ color: GOLD }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{l.label}</div>
                  {host && <div className="truncate text-[11px] text-white/60">{host}</div>}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/50" />
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <div className="mx-auto inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
            ✦ katwa.link
          </div>
        </div>
      </div>
    </div>
  );
}
