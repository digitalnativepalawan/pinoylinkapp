import { ChevronRight } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const CREAM = "#faf6ec";
const NAVY = "#0a2e6b";
const RED = "#c92030";
const GOLD = "#c9a84c";

function BanigPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.09]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, #b8956a 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, #b8956a 0 1px, transparent 1px 12px)",
      }}
    />
  );
}

function SunWatermark() {
  return (
    <svg viewBox="0 0 200 200" className="h-64 w-64" aria-hidden>
      <g fill={GOLD} opacity="0.35">
        <circle cx="100" cy="100" r="28" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * Math.PI) / 8;
          const x = 100 + Math.cos(a) * 60;
          const y = 100 + Math.sin(a) * 60;
          return (
            <polygon
              key={i}
              points={`${x - 4},${y - 4} ${100 + Math.cos(a) * 92},${100 + Math.sin(a) * 92} ${x + 4},${y + 4}`}
            />
          );
        })}
      </g>
    </svg>
  );
}

export default function ClassicPinoyTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: CREAM, color: NAVY }}
    >
      <BanigPattern />
      <div className="pointer-events-none absolute -right-16 -top-14 opacity-90">
        <SunWatermark />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2"
        style={{ background: `linear-gradient(90deg, ${NAVY} 0 50%, ${RED} 50% 100%)` }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2"
        style={{ background: `linear-gradient(90deg, ${RED} 0 50%, ${NAVY} 50% 100%)` }}
      />

      <div className="relative mx-auto max-w-md px-6 pb-16 pt-14">
        <div className="mx-auto flex flex-col items-center">
          <div
            className="relative h-32 w-32 rounded-full p-[3px] shadow-xl"
            style={{ background: `linear-gradient(135deg, ${NAVY}, ${RED})` }}
          >
            <div className="h-full w-full overflow-hidden rounded-full border-[3px] border-white bg-white">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="grid h-full w-full place-items-center text-4xl"
                  style={{ color: NAVY }}
                >
                  ✦
                </div>
              )}
            </div>
          </div>

          <div
            className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white"
            style={{ background: profile.status === "online" ? "#10b981" : "#71717a" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {profile.status === "online" ? "Active now" : "Away"}
          </div>

          <h1
            className="mt-3 text-center text-4xl font-semibold leading-tight"
            style={{
              fontFamily: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
              color: NAVY,
            }}
          >
            {profile.display_name}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-px w-6" style={{ background: GOLD }} />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: RED }}
            >
              Proudly Filipino
            </span>
            <span className="h-px w-6" style={{ background: GOLD }} />
          </div>

          {profile.bio && (
            <p
              className="mt-4 max-w-xs text-center text-sm leading-relaxed"
              style={{ color: "#3f3a2f" }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-3">
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
                className="group flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left shadow-[0_2px_10px_rgba(10,46,107,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(10,46,107,0.12)]"
                style={{ borderColor: "rgba(10,46,107,0.08)" }}
              >
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                  style={{ background: `${NAVY}12` }}
                >
                  <Icon className="h-5 w-5" style={{ color: NAVY }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold" style={{ color: NAVY }}>
                    {l.label}
                  </div>
                  {host && (
                    <div className="truncate text-[11px]" style={{ color: "#8a7f5f" }}>
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
          <div className="mx-auto h-px w-16" style={{ background: GOLD }} />
          <div
            className="mt-3 text-[10px] font-semibold uppercase tracking-[0.35em]"
            style={{ color: NAVY }}
          >
            🇵🇭 katwa.link
          </div>
        </div>
      </div>
    </div>
  );
}
