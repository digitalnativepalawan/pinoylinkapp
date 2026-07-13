import { ChevronRight, Dumbbell } from "lucide-react";
import { getIcon } from "@/lib/icons";

export type TemplateProfile = {
  display_name: string;
  bio: string | null;
  status: string;
  avatar_url: string | null;
  username?: string;
};
export type TemplateLink = {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  color: string | null;
};
export type TemplateProps = {
  profile: TemplateProfile;
  links: TemplateLink[];
  onLinkClick?: (id: string, url: string) => void;
};

const NAVY = "#0a1c5c";
const NAVY_DARK = "#061138";
const RED = "#d21f2d";
const YELLOW = "#ffcf2a";

const ROW_COLORS = [
  { bg: NAVY, text: "text-white", sub: "text-[#ffcf2a]", chev: "text-white" },
  { bg: "#ffffff", text: "text-[#0a1c5c]", sub: "text-[#d21f2d]", chev: "text-[#0a1c5c]" },
  { bg: RED, text: "text-white", sub: "text-[#ffcf2a]", chev: "text-white" },
  { bg: YELLOW, text: "text-[#0a1c5c]", sub: "text-[#0a1c5c]/80", chev: "text-[#0a1c5c]" },
  { bg: NAVY, text: "text-white", sub: "text-[#ffcf2a]", chev: "text-white" },
];

function SunburstBadge({ size = 48 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-md">
      <circle cx="50" cy="50" r="18" fill={YELLOW} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const x1 = 50 + Math.cos(angle) * 24;
        const y1 = 50 + Math.sin(angle) * 24;
        const x2 = 50 + Math.cos(angle) * 40;
        const y2 = 50 + Math.sin(angle) * 40;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={YELLOW}
            strokeWidth={5}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function BigSunburst() {
  return (
    <svg viewBox="0 0 200 200" className="h-56 w-56">
      <g fill={YELLOW}>
        <circle cx="100" cy="100" r="32" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const x = 100 + Math.cos(angle) * 60;
          const y = 100 + Math.sin(angle) * 60;
          return (
            <polygon
              key={i}
              points={`${x - 6},${y - 6} ${100 + Math.cos(angle) * 100},${100 + Math.sin(angle) * 100} ${x + 6},${y + 6}`}
            />
          );
        })}
      </g>
    </svg>
  );
}

export default function PinoyFitnessTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  const bio = profile.bio ?? "";
  // Bold last phrase before final punctuation as yellow-highlighted
  const bioWords = bio.split(" ");
  const highlightIdx = bioWords.findIndex((w) => /pinaka|strong|laban|bayan|maging/i.test(w));

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)` }}
    >
      {/* Corner sunburst - top left */}
      <div className="pointer-events-none absolute -left-24 -top-24 opacity-95">
        <BigSunburst />
      </div>
      {/* Red diagonal ribbon - top right */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-72 w-1/2"
        style={{ background: RED, clipPath: "polygon(30% 0, 100% 0, 100% 60%, 0 0)" }}
      />
      {/* Red diagonal ribbon - bottom left */}
      <div
        className="pointer-events-none absolute -left-8 bottom-40 h-64 w-1/2"
        style={{
          background: RED,
          clipPath: "polygon(0 40%, 100% 0, 80% 100%, 0 100%)",
          opacity: 0.9,
        }}
      />
      {/* Baybayin-style side pattern */}
      <div
        className="pointer-events-none absolute left-0 top-1/3 h-64 w-10 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.6) 6px 8px)",
        }}
      />
      {/* Slogan top-right corner */}
      <div className="absolute right-4 top-6 z-10 text-right leading-none">
        <div className="text-2xl font-black italic tracking-tight text-white [text-shadow:_2px_2px_0_#061138]">
          STRONG
        </div>
        <div
          className="text-2xl font-black italic tracking-tight"
          style={{ color: YELLOW, textShadow: "2px 2px 0 #061138" }}
        >
          PINOY.
        </div>
        <div className="text-2xl font-black italic tracking-tight text-white [text-shadow:_2px_2px_0_#061138]">
          STRONG
        </div>
        <div
          className="text-2xl font-black italic tracking-tight"
          style={{ color: RED, textShadow: "2px 2px 0 #061138" }}
        >
          BAYAN.
        </div>
        <div className="mt-1 text-[10px] font-bold italic text-white/90">
          KATAWAN. DISIPLINA. <span style={{ color: YELLOW }}>PUSO.</span>
        </div>
      </div>

      <div className="relative mx-auto max-w-md px-5 pb-24 pt-12">
        {/* Avatar */}
        <div className="mx-auto mt-16 flex flex-col items-center">
          <div
            className="relative grid h-36 w-36 place-items-center rounded-full"
            style={{
              background: `conic-gradient(${RED} 0 33%, ${NAVY} 33% 66%, ${YELLOW} 66% 100%)`,
              padding: 4,
            }}
          >
            <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-[#0a1c5c]">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-white/60">
                  <Dumbbell className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
              <SunburstBadge size={44} />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mt-8 text-center">
          <div className="text-5xl font-black italic tracking-tight text-white [text-shadow:_3px_3px_0_#061138]">
            {profile.display_name.toUpperCase()}
          </div>
          <div
            className="mx-auto mt-2 inline-block -rotate-1 rounded-md px-4 py-1"
            style={{ background: YELLOW }}
          >
            <span className="text-sm font-black italic tracking-widest" style={{ color: NAVY }}>
              {profile.status === "online" ? "ACTIVE NOW" : "AWAY"}
            </span>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="mx-auto mt-5 max-w-sm text-center text-sm font-medium leading-relaxed text-white/95">
            {bioWords.map((w, i) => (
              <span
                key={i}
                className={i === highlightIdx ? "font-black" : ""}
                style={i === highlightIdx ? { color: YELLOW } : undefined}
              >
                {w}{" "}
              </span>
            ))}
          </p>
        )}

        {/* Links */}
        <div className="mt-8 space-y-3">
          {links.map((l, i) => {
            const Icon = getIcon(l.icon);
            const scheme = ROW_COLORS[i % ROW_COLORS.length];
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
                className="group flex w-full items-center gap-3 rounded-2xl border-2 border-white/10 px-4 py-3.5 text-left shadow-[4px_4px_0_rgba(6,17,56,0.6)] transition hover:-translate-y-0.5"
                style={{ background: scheme.bg }}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur">
                  <Icon className={`h-6 w-6 ${scheme.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate text-base font-black italic uppercase tracking-wide ${scheme.text}`}
                  >
                    {l.label}
                  </div>
                  {host && (
                    <div
                      className={`truncate text-[10px] font-bold uppercase tracking-wider ${scheme.sub}`}
                    >
                      {host}
                    </div>
                  )}
                </div>
                <ChevronRight className={`h-5 w-5 shrink-0 ${scheme.chev}`} />
              </button>
            );
          })}
        </div>

        {/* Footer ribbon */}
        <div className="mt-10 flex items-center justify-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
          <span className="text-lg">🇵🇭</span>
          <span className="text-xs font-black italic tracking-wider text-white">
            I AM FILIPINO. <span style={{ color: YELLOW }}>I TRAIN.</span> I WIN.
          </span>
          <span className="text-lg">☀️</span>
        </div>
      </div>
    </div>
  );
}
