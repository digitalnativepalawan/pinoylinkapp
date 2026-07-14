import { ChevronRight, Star, MessageCircle, Truck, Shield, Clock, ShoppingBag, Zap } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const CREAM = "#fff6e3";
const AMBER = "#f97316";
const AMBER_DARK = "#c2410c";
const GREEN = "#10b981";
const NAVY = "#1f2544";
const RED = "#ef4444";

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

const FEATURES = [
  { icon: Truck, label: "Fast Shipping", sub: "1-3 days" },
  { icon: Shield, label: "Trusted Seller", sub: "Since 2020" },
  { icon: Clock, label: "Quick Reply", sub: "< 5 mins" },
];

const REVIEWS = [
  { name: "Maria S.", text: "Legit seller! Fast shipping and nice quality 👍", stars: 5 },
  { name: "Joy C.", text: "Maganda yung item, worth it sa price! ❤️", stars: 5 },
  { name: "Anna P.", text: "Recommended! Reorder na ako 😊", stars: 5 },
];

function FloatingMessenger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#0084ff] px-4 py-3 text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
      style={{ boxShadow: "0 4px 20px rgba(0,132,255,0.4)" }}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-bold">Message Us!</span>
    </button>
  );
}

function BudolBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-red-500 p-3 text-center">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-2 -top-2 h-16 w-16 rounded-full bg-white blur-xl" />
        <div className="absolute -right-2 -bottom-2 h-16 w-16 rounded-full bg-white blur-xl" />
      </div>
      <div className="relative flex items-center justify-center gap-2">
        <Zap className="h-4 w-4 fill-yellow-300 text-yellow-300" />
        <span className="text-xs font-black uppercase tracking-widest text-white">
          🔥 BUDOL ALERT — Limited Stocks Only!
        </span>
        <Zap className="h-4 w-4 fill-yellow-300 text-yellow-300" />
      </div>
    </div>
  );
}

function HowToOrder() {
  const steps = [
    { num: "1", text: "Message us your order" },
    { num: "2", text: "We'll send payment details" },
    { num: "3", text: "Confirm & we ship! 📦" },
  ];
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="mb-3 text-center text-xs font-black uppercase tracking-widest" style={{ color: NAVY }}>
        📋 How to Order
      </div>
      <div className="flex justify-between gap-2">
        {steps.map((s) => (
          <div key={s.num} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white"
              style={{ background: AMBER }}
            >
              {s.num}
            </div>
            <div className="text-center text-[9px] font-semibold" style={{ color: "#4a4a55" }}>
              {s.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerReviews() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="mb-3 text-center text-xs font-black uppercase tracking-widest" style={{ color: NAVY }}>
        ⭐ Customer Reviews
      </div>
      <div className="space-y-2">
        {REVIEWS.map((r, i) => (
          <div key={i} className="rounded-lg bg-gray-50 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold" style={{ color: NAVY }}>
                {r.name}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="mt-1 text-[10px]" style={{ color: "#4a4a55" }}>
              {r.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductShowcase() {
  const products = [
    { name: "Trending Now", price: "₱299", original: "₱599", badge: "50% OFF", emoji: "🔥" },
    { name: "Best Seller", price: "₱199", original: "₱399", badge: "SOLD 1K+", emoji: "⭐" },
    { name: "New Arrival", price: "₱149", original: "₱299", badge: "NEW", emoji: "✨" },
  ];
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <div className="mb-3 text-center text-xs font-black uppercase tracking-widest" style={{ color: NAVY }}>
        🛒 Featured Products
      </div>
      <div className="grid grid-cols-3 gap-2">
        {products.map((p) => (
          <div key={p.name} className="relative overflow-hidden rounded-lg bg-gray-50 p-2 text-center">
            <div
              className="absolute right-0 top-0 rounded-bl-lg px-1 py-0.5 text-[7px] font-black text-white"
              style={{ background: RED }}
            >
              {p.badge}
            </div>
            <div className="text-2xl">{p.emoji}</div>
            <div className="mt-1 text-[9px] font-bold" style={{ color: NAVY }}>
              {p.name}
            </div>
            <div className="text-xs font-black" style={{ color: AMBER }}>
              {p.price}
            </div>
            <div className="text-[8px] text-zinc-400 line-through">{p.original}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SellerTemplate({ profile, links, onLinkClick }: TemplateProps) {
  const messengerLink = links.find((l) => l.label.toLowerCase().includes("messenger"));
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  const handleMessenger = () => {
    if (messengerLink) {
      handle(messengerLink.id, messengerLink.url);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden pb-20"
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

      <div className="relative mx-auto max-w-md px-5 pb-8 pt-16">
        {/* Budol Alert Banner */}
        <BudolBanner />

        <div className="mx-auto mt-6 flex flex-col items-center">
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

        {/* Trust badges */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 shadow-sm">
              <div className="grid h-8 w-8 place-items-center rounded-full" style={{ background: `${AMBER}22` }}>
                <f.icon className="h-4 w-4" style={{ color: AMBER }} />
              </div>
              <div className="text-[9px] font-bold" style={{ color: NAVY }}>{f.label}</div>
              <div className="text-[8px]" style={{ color: "#6b6b78" }}>{f.sub}</div>
            </div>
          ))}
        </div>

        {/* Product Showcase */}
        <div className="mt-4">
          <ProductShowcase />
        </div>

        {/* Featured product card */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-lg">
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

        {/* How to Order */}
        <div className="mt-4">
          <HowToOrder />
        </div>

        {/* Main Messenger CTA */}
        {messengerLink && (
          <button
            onClick={handleMessenger}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0084ff] px-4 py-4 text-white shadow-lg transition hover:-translate-y-0.5"
            style={{ boxShadow: "0 4px 20px rgba(0,132,255,0.3)" }}
          >
            <MessageCircle className="h-6 w-6" />
            <div className="text-left">
              <div className="text-sm font-black uppercase">Message on Messenger</div>
              <div className="text-[10px] text-white/80">Quick response guaranteed!</div>
            </div>
            <ChevronRight className="ml-auto h-5 w-5" />
          </button>
        )}

        {/* Other links */}
        <div className="mt-3 space-y-2">
          {links
            .filter((l) => !l.label.toLowerCase().includes("messenger"))
            .map((l, i) => {
              const Icon = getIcon(l.icon);
              const scheme = ROW_COLORS[(i + 1) % ROW_COLORS.length];
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

        {/* Customer Reviews */}
        <div className="mt-4">
          <CustomerReviews />
        </div>

        {/* Payment strip */}
        <div className="mt-4 rounded-2xl bg-white/70 p-3 shadow-sm backdrop-blur">
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

      {/* Floating Messenger Button */}
      {messengerLink && <FloatingMessenger onClick={handleMessenger} />}
    </div>
  );
}
