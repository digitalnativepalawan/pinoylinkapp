import { ChevronRight, Heart } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const NAVY = "#0a2e6b";
const RED = "#c92030";
const YELLOW = "#e8b93a";
const CREAM = "#f7f1e6";

const ROW_COLORS = [
  {
    bg: NAVY,
    text: "text-white",
    sub: "text-[#e8b93a]",
    iconBg: "bg-white",
    iconText: `text-[${NAVY}]`,
    chev: "text-white",
  },
  {
    bg: RED,
    text: "text-white",
    sub: "text-[#e8b93a]",
    iconBg: "bg-white",
    iconText: `text-[${RED}]`,
    chev: "text-white",
  },
  {
    bg: YELLOW,
    text: "text-[#0a2e6b]",
    sub: "text-[#0a2e6b]/70",
    iconBg: "bg-white",
    iconText: `text-[${NAVY}]`,
    chev: "text-[#0a2e6b]",
  },
  {
    bg: NAVY,
    text: "text-white",
    sub: "text-[#e8b93a]",
    iconBg: "bg-white",
    iconText: `text-[${NAVY}]`,
    chev: "text-white",
  },
  {
    bg: "#ffffff",
    text: "text-[#c92030]",
    sub: "text-[#0a2e6b]/70",
    iconBg: `bg-[${RED}]`,
    iconText: "text-white",
    chev: "text-[#0a2e6b]",
  },
];

function BrushCornerNavy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={className} preserveAspectRatio="none">
      <path d="M0,0 L300,0 Q260,40 210,50 Q140,65 80,90 Q30,110 0,150 Z" fill={NAVY} />
      <g fill={YELLOW}>
        <circle cx="50" cy="55" r="24" />
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * Math.PI) / 5;
          const x1 = 50 + Math.cos(angle) * 30;
          const y1 = 55 + Math.sin(angle) * 30;
          const x2 = 50 + Math.cos(angle) * 46;
          const y2 = 55 + Math.sin(angle) * 46;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={YELLOW}
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
      </g>
      <g fill={YELLOW} opacity="0.95">
        <polygon points="130,25 134,35 144,35 136,42 140,52 130,46 120,52 124,42 116,35 126,35" />
        <polygon points="170,10 173,18 181,18 175,23 178,31 170,26 162,31 165,23 159,18 167,18" />
      </g>
    </svg>
  );
}

function BrushCornerRed({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={className} preserveAspectRatio="none">
      <path d="M300,0 L300,180 Q260,150 220,120 Q170,80 130,40 Q100,10 60,0 Z" fill={RED} />
    </svg>
  );
}

function WeavePattern({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(201,160,90,0.14) 0 2px, transparent 2px 10px), repeating-linear-gradient(-45deg, rgba(201,160,90,0.14) 0 2px, transparent 2px 10px)",
      }}
    />
  );
}

function Sampaguita({ size = 60 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <g>
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const cx = 50 + Math.cos(angle) * 18;
          const cy = 50 + Math.sin(angle) * 18;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={14}
              ry={20}
              fill="white"
              stroke="#e8dfd0"
              strokeWidth={0.8}
              transform={`rotate(${i * 72 - 90} ${cx} ${cy})`}
            />
          );
        })}
        <circle cx="50" cy="50" r="8" fill={YELLOW} />
      </g>
      <g fill="#4a7a3d" opacity="0.85">
        <ellipse cx="82" cy="78" rx="14" ry="7" transform="rotate(30 82 78)" />
        <ellipse cx="20" cy="80" rx="12" ry="6" transform="rotate(-30 20 80)" />
      </g>
    </svg>
  );
}

export default function IslaCreatorTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: CREAM, color: NAVY }}
    >
      {/* Weave background */}
      <WeavePattern className="pointer-events-none absolute inset-0" />
      {/* Corners */}
      <BrushCornerNavy className="pointer-events-none absolute -left-2 -top-2 h-56 w-3/5" />
      <BrushCornerRed className="pointer-events-none absolute -right-2 -top-2 h-56 w-3/5" />
      <div className="pointer-events-none absolute -left-2 -bottom-2 h-56 w-3/5 rotate-180">
        <BrushCornerRed className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute -right-2 -bottom-2 h-56 w-3/5 rotate-180">
        <BrushCornerNavy className="h-full w-full" />
      </div>

      {/* Flower accents */}
      <div className="pointer-events-none absolute left-4 bottom-6 opacity-95">
        <Sampaguita size={80} />
      </div>
      <div className="pointer-events-none absolute right-6 bottom-24 opacity-90">
        <Sampaguita size={64} />
      </div>

      <div className="relative mx-auto max-w-md px-6 pb-20 pt-20">
        {/* Avatar with sunburst ring */}
        <div className="mx-auto flex flex-col items-center">
          <div className="relative">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
              <g stroke={YELLOW} strokeWidth={2} fill="none">
                {Array.from({ length: 32 }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 32;
                  const x1 = 100 + Math.cos(angle) * 78;
                  const y1 = 100 + Math.sin(angle) * 78;
                  const x2 = 100 + Math.cos(angle) * (i % 2 === 0 ? 92 : 86);
                  const y2 = 100 + Math.sin(angle) * (i % 2 === 0 ? 92 : 86);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" />;
                })}
              </g>
            </svg>
            <div
              className="relative m-3 h-32 w-32 overflow-hidden rounded-full border-[3px]"
              style={{ borderColor: YELLOW, background: CREAM }}
            >
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
                  ✿
                </div>
              )}
            </div>
            {/* Star sparkles */}
            <div className="absolute -left-2 top-6 text-lg" style={{ color: YELLOW }}>
              ✦
            </div>
            <div className="absolute -right-1 bottom-8 text-base" style={{ color: YELLOW }}>
              ✦
            </div>
          </div>
        </div>

        {/* Name script */}
        <div className="mt-6 text-center">
          <h1
            className="text-5xl italic leading-none"
            style={{
              fontFamily: '"Brush Script MT", "Snell Roundhand", "Dancing Script", cursive',
              color: NAVY,
            }}
          >
            {profile.display_name}
            <span className="ml-2 text-xl" style={{ color: YELLOW }}>
              ☀
            </span>
          </h1>
          <div
            className="mt-3 text-[11px] font-bold uppercase tracking-[0.35em]"
            style={{ color: RED }}
          >
            {profile.status === "online" ? "Active Creator" : "Away"}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p
            className="mx-auto mt-4 max-w-xs text-center text-sm leading-relaxed"
            style={{ color: NAVY }}
          >
            {profile.bio}
            <br />
            <span
              className="italic"
              style={{ color: NAVY, fontFamily: '"Brush Script MT", cursive' }}
            >
              Likha. Lakbay. Lived with Love.
            </span>
          </p>
        )}

        {/* Social icons (rendered from first 5 icon-only reference — reuse first 5 links as social row visually already covered by main links; skip separate social row) */}

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
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left shadow-md transition hover:-translate-y-0.5"
                style={{ background: scheme.bg }}
              >
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${scheme.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${scheme.iconText}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate text-[15px] font-extrabold uppercase tracking-wide ${scheme.text}`}
                  >
                    {l.label}
                  </div>
                  <div className={`truncate text-xs ${scheme.sub}`}>{host || "Tap to open"}</div>
                </div>
                <ChevronRight className={`h-5 w-5 shrink-0 ${scheme.chev}`} />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <div className="text-xl" style={{ color: YELLOW }}>
            ♥
          </div>
          <div
            className="text-4xl italic"
            style={{ fontFamily: '"Brush Script MT", "Snell Roundhand", cursive', color: NAVY }}
          >
            Salamat!
          </div>
          <div
            className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: NAVY }}
          >
            Thank you for being here!
          </div>
          <Heart className="mx-auto mt-2 h-4 w-4" style={{ color: RED }} />
        </div>
      </div>
    </div>
  );
}
