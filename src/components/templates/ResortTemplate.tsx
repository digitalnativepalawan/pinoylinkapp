import { ChevronRight, Sun } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const TEAL_DARK = "#0f766e";
const YELLOW = "#fde047";
const CREAM = "#fef9e7";

function Waves() {
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full"
      aria-hidden
    >
      <path
        d="M0,140 C60,120 120,160 200,140 C280,120 340,160 400,140 L400,200 L0,200 Z"
        fill="rgba(255,255,255,0.14)"
      />
      <path
        d="M0,160 C60,140 140,180 220,160 C300,140 360,180 400,160 L400,200 L0,200 Z"
        fill="rgba(255,255,255,0.2)"
      />
      <path
        d="M0,180 C80,160 160,200 240,180 C320,160 360,190 400,180 L400,200 L0,200 Z"
        fill={TEAL_DARK}
        opacity="0.55"
      />
    </svg>
  );
}

function PalmFrond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" className={className} aria-hidden>
      <g fill="rgba(15,118,110,0.35)">
        <path d="M60,200 Q30,150 20,80 Q45,120 60,140 Q75,120 100,80 Q90,150 60,200 Z" />
        <path d="M60,140 Q50,100 30,60 Q55,90 60,110 Q65,90 90,60 Q70,100 60,140 Z" opacity="0.7" />
      </g>
    </svg>
  );
}

export default function ResortTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        background: "linear-gradient(180deg, #7dd3fc 0%, #38bdf8 30%, #0284c7 65%, #0f766e 100%)",
      }}
    >
      {/* Sun */}
      <div
        className="pointer-events-none absolute -top-16 right-8 h-40 w-40 rounded-full opacity-90 blur-2xl"
        style={{ background: "radial-gradient(circle, #fde68a, transparent 65%)" }}
      />
      <div className="pointer-events-none absolute right-14 top-6">
        <Sun className="h-10 w-10" style={{ color: YELLOW }} strokeWidth={2.5} />
      </div>

      {/* Palm silhouette */}
      <PalmFrond className="pointer-events-none absolute -left-6 bottom-10 h-64 w-40 -rotate-12" />
      <PalmFrond className="pointer-events-none absolute -right-8 bottom-16 h-56 w-36 rotate-12" />

      <Waves />

      <div className="relative mx-auto max-w-md px-5 pb-16 pt-14">
        <div className="mx-auto flex flex-col items-center">
          <div
            className="grid h-28 w-28 place-items-center rounded-full border-4 shadow-xl"
            style={{ background: CREAM, borderColor: "#ffffff" }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <Sun className="h-10 w-10" style={{ color: "#0284c7" }} />
            )}
          </div>

          <div
            className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur"
            style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: profile.status === "online" ? "#4ade80" : "#e5e7eb" }}
            />
            Paradise Awaits
          </div>

          <h1
            className="mt-3 text-center text-3xl font-semibold tracking-wide"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {profile.display_name}
          </h1>
          {profile.bio && (
            <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-white/90">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Primary CTA */}
        {links[0] && (
          <button
            onClick={() => handle(links[0].id, links[0].url)}
            className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left font-black uppercase tracking-wider shadow-xl transition hover:-translate-y-0.5"
            style={{ background: YELLOW, color: "#0c4a6e" }}
          >
            <span>{links[0].label}</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div className="mt-3 space-y-2.5">
          {links.slice(1).map((l) => {
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
                className="flex w-full items-center gap-3 rounded-2xl border border-white/25 bg-white/15 px-4 py-3 text-left backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/90">
                  <Icon className="h-5 w-5" style={{ color: TEAL_DARK }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-white">{l.label}</div>
                  {host && <div className="truncate text-[11px] text-white/75">{host}</div>}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/80" />
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-white/90">
          🌴 katwa.link
        </div>
      </div>
    </div>
  );
}
