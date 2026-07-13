import { ChevronRight } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const NAVY = "#0038a8";
const RED = "#cc1f2d";
const YELLOW = "#ffd23a";

const ROW_COLORS = [
  { bg: NAVY, text: "text-white", chev: YELLOW },
  { bg: "#ffffff", text: `text-[${NAVY}]`, chev: RED },
  { bg: RED, text: "text-white", chev: YELLOW },
  { bg: NAVY, text: "text-white", chev: YELLOW },
  { bg: "#ffffff", text: `text-[${NAVY}]`, chev: RED },
];

function SunSVG({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden>
      <circle cx="100" cy="100" r="32" fill={YELLOW} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <polygon
            key={i}
            fill={YELLOW}
            points={`${100 + Math.cos(a) * 40 - 8},${100 + Math.sin(a) * 40} ${100 + Math.cos(a) * 90},${100 + Math.sin(a) * 90} ${100 + Math.cos(a) * 40 + 8},${100 + Math.sin(a) * 40}`}
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4 + Math.PI / 8;
        return (
          <line
            key={`s${i}`}
            x1={100 + Math.cos(a) * 46}
            y1={100 + Math.sin(a) * 46}
            x2={100 + Math.cos(a) * 78}
            y2={100 + Math.sin(a) * 78}
            stroke={YELLOW}
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function Star({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <polygon fill={YELLOW} points="12,2 15,9 22,9.5 17,14 18.5,21 12,17 5.5,21 7,14 2,9.5 9,9" />
    </svg>
  );
}

export default function PatrioticPinoyTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Split flag base */}
      <div className="absolute inset-0" style={{ background: NAVY }} />
      <div
        className="absolute inset-y-0 right-0 w-3/4"
        style={{
          background: RED,
          clipPath: "polygon(30% 0, 100% 0, 100% 100%, 100% 100%, 0 100%)",
        }}
      />
      {/* White triangle from left */}
      <div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ background: "#ffffff", clipPath: "polygon(0 0, 60% 50%, 0 100%)" }}
      />

      {/* Sun behind white triangle */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <SunSVG size={180} />
      </div>

      {/* Three stars on white area */}
      <div className="absolute left-6 top-8">
        <Star size={18} />
      </div>
      <div className="absolute right-8 top-14">
        <Star size={14} />
      </div>
      <div className="absolute left-10 bottom-24">
        <Star size={16} />
      </div>

      {/* Dark overlay for content readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,60,0.6) 55%, rgba(0,0,60,0.85) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-md px-5 pb-16 pt-14">
        <div className="mx-auto flex flex-col items-center">
          <div
            className="h-32 w-32 overflow-hidden rounded-full border-[5px] shadow-2xl"
            style={{ borderColor: YELLOW, background: NAVY }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)" }}
              />
            )}
          </div>

          <div
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
            style={{ background: YELLOW, color: NAVY }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: profile.status === "online" ? "#10b981" : "#71717a" }}
            />
            {profile.status === "online" ? "Active Now" : "Away"}
          </div>

          <h1
            className="mt-3 text-center text-4xl font-black italic uppercase tracking-tight"
            style={{ color: "#ffffff", textShadow: `3px 3px 0 ${NAVY}, 3px 3px 0 rgba(0,0,0,0.4)` }}
          >
            {profile.display_name}
          </h1>
          <div
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.4em]"
            style={{ color: YELLOW }}
          >
            🇵🇭 Proudly Pinoy
          </div>

          {profile.bio && (
            <p className="mt-4 max-w-xs text-center text-sm leading-relaxed text-white/95">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-2.5">
          {links.map((l, i) => {
            const Icon = getIcon(l.icon);
            const scheme = ROW_COLORS[i % ROW_COLORS.length];
            let host = "";
            try {
              host = new URL(l.url).hostname.replace(/^www\./, "");
            } catch {
              /* ignore */
            }
            const isLight = scheme.bg === "#ffffff";
            return (
              <button
                key={l.id}
                onClick={() => handle(l.id, l.url)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left shadow-lg transition hover:-translate-y-0.5 ${scheme.text}`}
                style={{
                  background: scheme.bg,
                  borderColor: isLight ? `${NAVY}22` : "rgba(255,255,255,0.15)",
                }}
              >
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                  style={{ background: isLight ? `${NAVY}12` : "rgba(255,255,255,0.15)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: isLight ? NAVY : YELLOW }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate text-sm font-black uppercase tracking-wide ${scheme.text}`}
                  >
                    {l.label}
                  </div>
                  {host && (
                    <div
                      className={`truncate text-[10px] font-semibold uppercase tracking-widest ${isLight ? `text-[${NAVY}]/60` : "text-white/70"}`}
                    >
                      {host}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 shrink-0" style={{ color: scheme.chev }} />
              </button>
            );
          })}
        </div>

        <div
          className="mt-10 flex items-center justify-center gap-2 rounded-full border-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em]"
          style={{ background: NAVY, borderColor: YELLOW, color: YELLOW }}
        >
          🇵🇭 katwa.link
        </div>
      </div>
    </div>
  );
}
