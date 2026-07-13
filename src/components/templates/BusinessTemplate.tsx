import { ChevronRight, Coffee } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const EMERALD = "#064e3b";
const EMERALD_DARK = "#052e1b";
const GOLD = "#c9a84c";
const CREAM = "#f5efe0";

function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <g fill="none" stroke={GOLD} strokeWidth="1.2">
        <path d="M2 2 H30 M2 2 V30" />
        <path d="M8 8 H24 M8 8 V24" opacity="0.6" />
        <circle cx="2" cy="2" r="2.5" fill={GOLD} stroke="none" />
        <path d="M14 2 Q16 6 22 6" />
        <path d="M2 14 Q6 16 6 22" />
      </g>
    </svg>
  );
}

export default function BusinessTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        background: `linear-gradient(180deg, ${EMERALD} 0%, ${EMERALD_DARK} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(201,168,76,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <CornerOrnament className="pointer-events-none absolute left-4 top-4 h-14 w-14" />
      <div className="pointer-events-none absolute right-4 top-4 h-14 w-14 rotate-90">
        <CornerOrnament className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute left-4 bottom-4 h-14 w-14 -rotate-90">
        <CornerOrnament className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute right-4 bottom-4 h-14 w-14 rotate-180">
        <CornerOrnament className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-md px-6 pb-16 pt-16">
        <div className="mx-auto flex flex-col items-center">
          <div
            className="grid h-28 w-28 place-items-center rounded-full border-2 shadow-lg"
            style={{ background: CREAM, borderColor: GOLD }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <Coffee className="h-10 w-10" style={{ color: EMERALD }} />
            )}
          </div>

          <div
            className="mt-4 inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em]"
            style={{ background: GOLD, color: EMERALD_DARK }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: profile.status === "online" ? EMERALD_DARK : "#52525b" }}
            />
            {profile.status === "online" ? "Open Now" : "Closed"}
          </div>

          {/* Hairline divider */}
          <div className="mt-4 flex w-full items-center gap-3">
            <div className="h-px flex-1" style={{ background: `${GOLD}55` }} />
            <span className="text-[9px] uppercase tracking-[0.4em]" style={{ color: GOLD }}>
              Est.
            </span>
            <div className="h-px flex-1" style={{ background: `${GOLD}55` }} />
          </div>

          <h1
            className="mt-3 text-center text-3xl leading-tight"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', color: CREAM }}
          >
            {profile.display_name}
          </h1>
          {profile.bio && (
            <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-white/75">{profile.bio}</p>
          )}
        </div>

        <div className="mt-8 space-y-2.5">
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
                className="flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left shadow-sm transition hover:-translate-y-0.5"
                style={{ background: CREAM, borderColor: `${GOLD}66`, color: EMERALD_DARK }}
              >
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                  style={{ background: `${EMERALD}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color: EMERALD }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold" style={{ color: EMERALD_DARK }}>
                    {l.label}
                  </div>
                  {host && (
                    <div className="truncate text-[11px]" style={{ color: `${EMERALD}99` }}>
                      {host}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <div className="mx-auto h-px w-16" style={{ background: `${GOLD}88` }} />
          <div
            className="mt-3 text-[10px] font-semibold uppercase tracking-[0.4em]"
            style={{ color: GOLD }}
          >
            katwa.link
          </div>
        </div>
      </div>
    </div>
  );
}
