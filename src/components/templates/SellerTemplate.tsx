import { ChevronRight, Star } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const CREAM = "#fff6e3";
const AMBER = "#f97316";
const AMBER_DARK = "#c2410c";
const GREEN = "#10b981";
const NAVY = "#1f2544";

const ROW_COLORS = [
  { bg: "#ffffff", text: "text-[#1f2544]", accent: AMBER, sub: "text-zinc-500" },
  { bg: AMBER, text: "text-white", accent: "#ffffff", sub: "text-white/85" },
  { bg: "#ffffff", text: "text-[#1f2544]", accent: "#ee4d2d", sub: "text-zinc-500" },
  { bg: "#ffffff", text: "text-[#1f2544]", accent: "#a020f0", sub: "text-zinc-500" },
  { bg: "#ffffff", text: "text-[#1f2544]", accent: "#0084ff", sub: "text-zinc-500" },
];

const PAY = [
  { label: "GCash", bg: "#007cf0" },
  { label: "Maya", bg: "#00b16a" },
  { label: "BPI", bg: "#cc1f2d" },
  { label: "COD", bg: "#f07a1e" },
];

export default function SellerTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #ffe9b8 0%, ${CREAM} 45%, #fff 100%)`,
        color: NAVY,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(249,115,22,0.12) 0 10px, transparent 10px 40px)",
        }}
      />

      {/* Diagonal ribbon */}
      <div
        className="absolute -left-10 top-16 rotate-[-14deg] rounded-md px-6 py-1.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg"
        style={{ background: AMBER, boxShadow: `4px 4px 0 ${AMBER_DARK}` }}
      >
        Trusted Seller ⭐
      </div>

      <div className="relative mx-auto max-w-md px-5 pb-16 pt-16">
        <div className="mx-auto flex flex-col items-center">
          <div
            className="relative grid h-32 w-32 place-items-center rounded-full border-4 border-white shadow-xl"
            style={{ background: `linear-gradient(135deg, ${AMBER}, ${AMBER_DARK})` }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl">🛍️</span>
            )}
            <div className="absolute -bottom-2 right-0 grid h-8 w-8 place-items-center rounded-full bg-white shadow-md">
              <Star className="h-4 w-4 fill-current" style={{ color: AMBER }} />
            </div>
          </div>

          <div
            className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ background: profile.status === "online" ? GREEN : "#71717a" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {profile.status === "online" ? "Open • Fast Reply" : "Away"}
          </div>

          <h1
            className="mt-3 text-center text-3xl font-black uppercase tracking-tight"
            style={{ color: NAVY }}
          >
            {profile.display_name}
          </h1>
          {profile.bio && (
            <p
              className="mt-2 max-w-xs text-center text-sm leading-relaxed"
              style={{ color: "#4a4a55" }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Featured product card */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-lg">
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{ background: AMBER }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              🔥 Best Seller
            </span>
            <span className="text-[10px] font-bold text-white/90">Limited stock</span>
          </div>
          <div className="flex items-center gap-3 p-3">
            <div
              className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-white"
              style={{ background: `linear-gradient(135deg, #fb923c, #f97316)` }}
            >
              <span className="text-2xl">📦</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold" style={{ color: NAVY }}>
                Curated Picks
              </div>
              <div className="text-[11px]" style={{ color: "#6b6b78" }}>
                ✓ Trusted quality &nbsp;·&nbsp; ✓ Ships fast
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
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
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left shadow-md transition hover:-translate-y-0.5 ${scheme.text}`}
                style={{ background: scheme.bg }}
              >
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                  style={{ background: `${scheme.accent}22` }}
                >
                  <Icon className="h-5 w-5" style={{ color: scheme.accent }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold uppercase tracking-wide">
                    {l.label}
                  </div>
                  {host && <div className={`truncate text-[10px] ${scheme.sub}`}>{host}</div>}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
              </button>
            );
          })}
        </div>

        {/* Payment strip */}
        <div className="mt-6 rounded-2xl bg-white/70 p-3 shadow-sm backdrop-blur">
          <div
            className="text-center text-[10px] font-black uppercase tracking-widest"
            style={{ color: NAVY }}
          >
            💳 We Accept
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {PAY.map((p) => (
              <div
                key={p.label}
                className="grid h-8 place-items-center rounded-lg text-[10px] font-bold text-white shadow-sm"
                style={{ background: p.bg }}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: NAVY }}
        >
          🛒 katwa.link
        </div>
      </div>
    </div>
  );
}
