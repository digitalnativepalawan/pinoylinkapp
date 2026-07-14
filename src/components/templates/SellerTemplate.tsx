import { ChevronRight, MessageCircle, ShoppingBag, Music2, Facebook, Instagram, Youtube, Mail, Globe } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const BLUE = "#0038a8";
const RED = "#ce1126";
const GOLD = "#fcd116";
const CREAM = "#f5f0e6";
const NAVY = "#1a2744";

const BUTTON_COLORS = [BLUE, RED, GOLD, BLUE, RED];

const SOCIAL_ICONS = [
  { icon: Facebook, color: "#1877f2", label: "Facebook" },
  { icon: Instagram, color: "#e1306c", label: "Instagram" },
  { icon: Music2, color: "#000000", label: "TikTok" },
  { icon: Youtube, color: "#ff0000", label: "YouTube" },
  { icon: Mail, color: "#ea4335", label: "Email" },
];

function TribalBorder() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-2 z-10"
      style={{
        background: `repeating-linear-gradient(90deg, ${BLUE} 0 8px, ${RED} 8px 16px, ${GOLD} 16px 24px, ${BLUE} 24px 32px)`
      }}
    />
  );
}

function FestiveBunting() {
  const colors = [RED, BLUE, GOLD, RED, BLUE, GOLD, RED, BLUE, GOLD, RED, BLUE];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-0 overflow-hidden h-8 z-10">
      {colors.map((c, i) => (
        <div
          key={i}
          className="h-0 w-0"
          style={{
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: `20px solid ${c}`,
            marginTop: i % 2 === 0 ? 0 : 6,
          }}
        />
      ))}
    </div>
  );
}

function ParolDecoration() {
  return (
    <svg viewBox="0 0 60 80" className="absolute left-2 top-24 h-16 w-12 opacity-80 z-10">
      {/* Star shape */}
      <polygon points="30,5 35,25 55,25 38,37 45,58 30,45 15,58 22,37 5,25 25,25" fill={GOLD} stroke={RED} strokeWidth="1" />
      {/* Tassels */}
      <line x1="30" y1="45" x2="25" y2="75" stroke={RED} strokeWidth="2" />
      <line x1="30" y1="45" x2="30" y2="78" stroke={BLUE} strokeWidth="2" />
      <line x1="30" y1="45" x2="35" y2="75" stroke={GOLD} strokeWidth="2" />
    </svg>
  );
}

function FloralDecoration() {
  return (
    <svg viewBox="0 0 60 80" className="absolute right-2 top-32 h-16 w-12 opacity-80 z-10">
      {/* Hibiscus */}
      <circle cx="30" cy="30" r="12" fill={RED} opacity="0.8" />
      <circle cx="30" cy="30" r="6" fill={GOLD} />
      {/* Leaves */}
      <ellipse cx="15" cy="50" rx="8" ry="4" fill="#228b22" transform="rotate(-30 15 50)" />
      <ellipse cx="45" cy="50" rx="8" ry="4" fill="#228b22" transform="rotate(30 45 50)" />
      <ellipse cx="20" cy="60" rx="6" ry="3" fill="#228b22" transform="rotate(-20 20 60)" />
      <ellipse cx="40" cy="60" rx="6" ry="3" fill="#228b22" transform="rotate(20 40 60)" />
    </svg>
  );
}

function CircularBadge({ name }: { name: string }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="relative mx-auto h-28 w-28">
      {/* Outer tribal ring */}
      <div className="absolute inset-0 rounded-full" style={{
        background: `conic-gradient(${BLUE}, ${RED}, ${GOLD}, ${BLUE}, ${RED}, ${GOLD}, ${BLUE})`,
        padding: 4,
      }}>
        <div className="flex h-full w-full items-center justify-center rounded-full" style={{ background: CREAM }}>
          {/* Inner content */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 40 40" className="h-8 w-8">
              {/* Bahay kubo */}
              <rect x="12" y="20" width="16" height="12" fill={NAVY} />
              <polygon points="10,20 20,10 30,20" fill={NAVY} />
              <rect x="17" y="24" width="6" height="8" fill={CREAM} />
              {/* Sun */}
              <circle cx="32" cy="12" r="5" fill={GOLD} />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <line
                  key={i}
                  x1={32 + Math.cos(deg * Math.PI / 180) * 7}
                  y1={12 + Math.sin(deg * Math.PI / 180) * 7}
                  x2={32 + Math.cos(deg * Math.PI / 180) * 9}
                  y2={12 + Math.sin(deg * Math.PI / 180) * 9}
                  stroke={GOLD}
                  strokeWidth="1.5"
                />
              ))}
            </svg>
            <span className="mt-0.5 text-[8px] font-black" style={{ color: NAVY }}>
              {initials || "KATWA"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WovenPattern() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 w-3 z-10 opacity-40"
      style={{
        background: `repeating-linear-gradient(0deg, ${GOLD} 0 4px, transparent 4px 8px),
                     repeating-linear-gradient(90deg, ${RED}22 0 4px, transparent 4px 8px)`
      }}
    />
  );
}

function WovenPatternRight() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 w-3 z-10 opacity-40"
      style={{
        background: `repeating-linear-gradient(0deg, ${GOLD} 0 4px, transparent 4px 8px),
                     repeating-linear-gradient(90deg, ${BLUE}22 0 4px, transparent 4px 8px)`
      }}
    />
  );
}

export default function SellerTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: BLUE }}>
      {/* Tropical gradient background */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, #1a6fb5 0%, #0e5a9e 30%, #0a4a8a 60%, ${BLUE} 100%)`
      }} />

      {/* Clouds */}
      <div className="absolute top-8 left-8 h-6 w-16 rounded-full bg-white/20 blur-sm" />
      <div className="absolute top-12 left-24 h-4 w-10 rounded-full bg-white/15 blur-sm" />
      <div className="absolute top-6 right-12 h-5 w-14 rounded-full bg-white/20 blur-sm" />

      {/* Decorative elements */}
      <FestiveBunting />
      <TribalBorder />
      <WovenPattern />
      <WovenPatternRight />
      <ParolDecoration />
      <FloralDecoration />

      {/* Main content card */}
      <div className="relative mx-auto max-w-md px-4 pt-12 pb-8">
        <div className="rounded-3xl overflow-hidden" style={{ background: `${CREAM}ee` }}>
          {/* Top decorative arch */}
          <div className="h-16 w-full" style={{
            background: `linear-gradient(180deg, ${BLUE}44 0%, transparent 100%)`
          }} />

          <div className="px-5 pb-6 -mt-6">
            {/* Badge */}
            <CircularBadge name={profile.display_name} />

            {/* Kumusta greeting */}
            <div className="mt-4 text-center">
              <h2 className="text-4xl font-bold" style={{
                fontFamily: "'Pacifico', cursive",
                color: GOLD,
                textShadow: `1px 1px 0 ${BLUE}, 2px 2px 0 ${BLUE}`,
              }}>
                Kumusta!
              </h2>
              <div className="mt-1 flex justify-center gap-1">
                {[GOLD, RED, BLUE, RED, GOLD].map((c, i) => (
                  <span key={i} className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: c }} />
                ))}
              </div>
            </div>

            {/* Tagline */}
            <p className="mt-3 text-center text-xs font-semibold" style={{ color: RED }}>
              {profile.bio || "Proudly Filipino goods, stories, and everyday finds."}
            </p>

            {/* Description */}
            <p className="mt-2 text-center text-[11px] leading-relaxed" style={{ color: NAVY }}>
              {profile.display_name} celebrates local makers, shares meaningful products, and connects people with proudly Filipino craft and culture.
            </p>

            {/* Para sa... */}
            <p className="mt-2 text-center text-xs font-bold" style={{ color: RED }}>
              Para sa Bayan. Para sa Komunidad. Para sa Lahat.
            </p>

            {/* Social icons */}
            <div className="mt-4 flex justify-center gap-3">
              {SOCIAL_ICONS.map((s) => (
                <div
                  key={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition hover:scale-110"
                  style={{ background: s.color }}
                >
                  <s.icon className="h-4 w-4" />
                </div>
              ))}
            </div>

            {/* Separator */}
            <div className="mt-4 flex justify-center gap-1">
              {[BLUE, RED, GOLD, RED, BLUE].map((c, i) => (
                <span key={i} className="inline-block h-1 w-1 rounded-full" style={{ background: c }} />
              ))}
            </div>

            {/* Link buttons */}
            <div className="mt-4 space-y-2.5">
              {links.slice(0, 5).map((l, i) => {
                const Icon = getIcon(l.icon);
                const bg = BUTTON_COLORS[i % BUTTON_COLORS.length];
                let host = "";
                try {
                  host = new URL(l.url).hostname.replace(/^www\./, "");
                } catch { /* ignore */ }

                return (
                  <button
                    key={l.id}
                    onClick={() => handle(l.id, l.url)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${bg} 0%, ${bg}dd 100%)`,
                      boxShadow: `0 4px 12px ${bg}44`,
                    }}
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/20">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold">{l.label}</div>
                      {host && <div className="truncate text-[10px] text-white/70">{host}</div>}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-white/70" />
                  </button>
                );
              })}
            </div>

            {/* Extra links (if more than 5) */}
            {links.length > 5 && (
              <div className="mt-3 space-y-2">
                {links.slice(5).map((l, i) => {
                  const Icon = getIcon(l.icon);
                  return (
                    <button
                      key={l.id}
                      onClick={() => handle(l.id, l.url)}
                      className="flex w-full items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left transition hover:-translate-y-0.5"
                      style={{ borderColor: `${BLUE}44`, color: NAVY }}
                    >
                      <Icon className="h-4 w-4" style={{ color: BLUE }} />
                      <span className="text-xs font-bold">{l.label}</span>
                      <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm italic text-white/80" style={{
            fontFamily: "'Pacifico', cursive",
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
          }}>
            Isang Bayan. Isang Puso.
          </p>
          <div className="mt-1 flex justify-center">
            <span className="text-lg">❤️</span>
          </div>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            katwa.link
          </p>
        </div>
      </div>

      {/* Google Font for script text */}
      <link
        href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
