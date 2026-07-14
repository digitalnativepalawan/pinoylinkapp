import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Link2,
  MessageCircle,
  Music2,
  Facebook,
  Instagram,
  Youtube,
  Briefcase,
  BadgeCheck,
  Sun,
  QrCode,
  BarChart3,
  CreditCard,
  Store,
  Check,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { getIcon } from "@/lib/icons";
import {
  ClassicPinoyPhone,
  SellerPhone,
  CreatorPhone,
  BusinessPhone,
  ResortPhone,
  PatrioticPhone,
  PinoyFitnessPhone,
  IslaCreatorPhone,
} from "@/components/templates";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "katwa.link — One Link. All Your Channels. Made for Filipinos." },
      {
        name: "description",
        content:
          "Filipino-first link-in-bio. Connect Messenger, WhatsApp, Shopee, Lazada, TikTok, GCash and more in one beautiful page.",
      },
      { property: "og:title", content: "katwa.link — Beautiful Templates, Filipino Style" },
      {
        property: "og:description",
        content:
          "Built for Filipino creators, sellers and businesses. Simple. Fast. Pinoy-friendly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "katwa.link — Beautiful Templates, Filipino Style" },
      {
        name: "twitter:description",
        content: "Built for Filipino creators, sellers and businesses.",
      },
    ],
  }),
  component: Landing,
});

function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.55_0.24_290)]">
        <Link2 className="h-4 w-4 -rotate-45 text-white" />
      </div>
      <span className="text-xl font-medium tracking-tight">
        <span className="text-[oklch(0.6_0.22_265)]">katwa</span>
        <span className="text-foreground">.link</span>
      </span>
    </Link>
  );
}

function ClaimInline({ size = "md" }: { size?: "md" | "lg" }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const slug = () =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") || "yourname";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/claim/$username", params: { username: slug() } });
  };

  const pad = size === "lg" ? "p-2" : "p-1.5";

  return (
    <form
      onSubmit={submit}
      className={`flex items-center gap-2 rounded-xl border border-border bg-background/80 backdrop-blur ${pad}`}
    >
      <span className="pl-2 text-sm text-muted-foreground whitespace-nowrap">katwa.link/</span>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        placeholder="yourname"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Claim
      </button>
    </form>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#templates" className="hover:text-foreground">
            Templates
          </a>
          <a href="#dashboard" className="hover:text-foreground">
            Dashboard
          </a>
          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/claim/$username"
            params={{ username: "yourname" }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Claim your link
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- Phone mockup primitives ---------- */
export function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto w-[260px] shrink-0 ${className}`}>
      <div className="relative rounded-[2.5rem] border-[6px] border-[#0a0a0a] bg-black p-1 shadow-2xl shadow-black/60">
        <div className="relative overflow-hidden rounded-[2rem] aspect-[9/19.5] text-zinc-900">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */

const templates = [
  {
    Comp: ClassicPinoyPhone,
    name: "CLASSIC PINOY",
    color: "text-white",
    desc: "Clean, simple and proudly Pinoy.",
  },
  {
    Comp: SellerPhone,
    name: "SELLER",
    color: "text-amber-400",
    desc: "Perfect for online sellers and resellers.",
  },
  {
    Comp: CreatorPhone,
    name: "CREATOR",
    color: "text-fuchsia-400",
    desc: "Made for content creators and influencers.",
  },
  {
    Comp: BusinessPhone,
    name: "BUSINESS",
    color: "text-emerald-400",
    desc: "Great for cafes, restaurants and local shops.",
  },
  {
    Comp: ResortPhone,
    name: "RESORT",
    color: "text-sky-400",
    desc: "Built for resorts, hotels and travel businesses.",
  },
  {
    Comp: PatrioticPhone,
    name: "PATRIOTIC PINOY",
    color: "text-[#ff6464]",
    desc: "Show your pride with Philippine colors and sun.",
  },
  {
    Comp: PinoyFitnessPhone,
    name: "PINOY FITNESS",
    color: "text-[#ffcf2a]",
    desc: "Bold flag-color design for coaches and athletes.",
  },
  {
    Comp: IslaCreatorPhone,
    name: "ISLA CREATOR",
    color: "text-[#c92030]",
    desc: "Warm cream aesthetic for lifestyle creators.",
  },
];

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute right-10 top-20 text-[#ffd23a] hidden sm:block">
        <Sun className="h-16 w-16" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Built for the Philippine
            market 🇵🇭
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            One Link.
            <br />
            <span className="text-primary">All Your Channels.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Built for the way Filipinos connect, chat, and shop online. Messenger, WhatsApp, Shopee,
            Lazada, TikTok Shop, GCash — all in one beautiful page.
          </p>

          <div className="mt-8 max-w-md">
            <ClaimInline size="lg" />
            <p className="mt-2 text-xs text-muted-foreground">Free forever.</p>
          </div>

          <ul className="mt-10 grid gap-3 text-sm sm:grid-cols-2">
            {[
              "Made for Filipino creators & businesses",
              "Connect what matters most",
              "Get more clicks and customers",
              "Simple. Fast. Pinoy-friendly.",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 text-muted-foreground">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Check className="h-3 w-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-start justify-center">
          <ClassicPinoyPhone />
        </div>
      </div>
    </section>
  );
}

function TemplatesSection() {
  return (
    <section id="templates" className="relative border-t border-border/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <Logo className="justify-center" />
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Beautiful Templates, <span className="text-[#60a5fa]">Filipino</span>{" "}
            <span className="text-[#ef4444]">Style</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Choose a template that fits your vibe. 🇵🇭</p>
        </div>

        <div className="mt-16 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map(({ Comp, name, color, desc }) => (
            <Link
              key={name}
              to="/claim/$username"
              params={{ username: "yourname" }}
              search={{ template: name.toLowerCase().replace(/\s+/g, "-") }}
              className="group flex flex-col items-center"
            >
              <div className="transition group-hover:-translate-y-1">
                <Comp />
              </div>
              <div className="mt-5 text-center">
                <div className={`text-base font-semibold tracking-wider ${color}`}>{name}</div>
                <p className="mt-1 max-w-[16rem] text-xs text-muted-foreground">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-16 flex max-w-md items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-4 w-4 text-primary" />
          All templates are fully customizable.
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const feats = [
    { Icon: MessageCircle, title: "Messenger First", desc: "Prioritize chat with one tap." },
    { Icon: CreditCard, title: "Local Payments", desc: "Show your accepted payment methods." },
    { Icon: Store, title: "Marketplace Links", desc: "Shopee, Lazada, TikTok Shop ready." },
    { Icon: BadgeCheck, title: "Online Status", desc: "Let customers know you're active." },
    { Icon: BarChart3, title: "Analytics", desc: "Track clicks and grow your audience." },
    { Icon: QrCode, title: "QR Code", desc: "Share offline, get more customers." },
  ];
  return (
    <section id="features" className="relative border-t border-border/50 bg-card/30 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Filipino-First Features
          </h2>
          <p className="mt-3 text-muted-foreground">
            Designed for how Pinoys actually do business online.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feats.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border/60 bg-background/60 p-6 backdrop-blur transition hover:border-primary/40 hover:bg-background"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  const stats: Array<[string, string, string | null]> = [
    ["Profile Views", "—", null],
    ["Link Clicks", "—", null],
    ["Click Through Rate", "—", null],
    ["Top Link", "—", null],
  ];

  return (
    <section id="dashboard" className="relative border-t border-border/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Your dashboard, your data.
          </h2>
          <p className="mt-3 text-muted-foreground">Track every click and grow your reach.</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="grid lg:grid-cols-[220px_1fr]">
            <aside className="hidden border-r border-border bg-card/50 p-4 lg:block">
              <Logo />
              <nav className="mt-6 space-y-1 text-sm">
                {[
                  ["Overview", BarChart3, true],
                  ["Links", Link2, false],
                  ["Appearance", Sparkles, false],
                  ["Analytics", BarChart3, false],
                  ["QR Code", QrCode, false],
                  ["Settings", Briefcase, false],
                ].map(([n, I, active]) => {
                  const Icon = I as typeof BarChart3;
                  return (
                    <div
                      key={n as string}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{n as string}</span>
                    </div>
                  );
                })}
              </nav>
            </aside>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">Overview</h3>
                <div className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground">
                  Last 7 Days
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-dashed border-border bg-card/40 p-4 text-center text-sm text-muted-foreground">
                Publish your page and share it to start collecting clicks.
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(([label, val, sub]) => (
                  <div key={label} className="rounded-xl border border-border bg-card/50 p-4">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="mt-1 truncate text-2xl font-semibold tracking-tight">{val}</div>
                    {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Top Links</h4>
                    <span className="text-xs text-muted-foreground">Clicks</span>
                  </div>
                  <ul className="mt-3 space-y-3 text-sm">
                    <li className="text-xs text-muted-foreground">No link clicks yet.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-card/50 p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Views Over Time</h4>
                    <span className="text-xs text-muted-foreground">Last 7 days</span>
                  </div>
                  <svg viewBox="0 0 300 120" className="mt-3 h-32 w-full">
                    <defs>
                      <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.62 0.22 265)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="oklch(0.62 0.22 265)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,90 C40,80 60,70 90,65 C130,58 160,55 190,40 C220,28 250,25 300,15"
                      fill="none"
                      stroke="oklch(0.62 0.22 265)"
                      strokeWidth="2"
                      strokeOpacity="0.3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="pricing" className="relative border-t border-border/50 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-background p-8 sm:p-10">
          <h2 className="relative text-3xl font-semibold tracking-tight sm:text-5xl">
            Para sa mga Pinoy, <span className="text-[#60a5fa]">para sa</span>{" "}
            <span className="text-[#ef4444]">Pilipino</span>. 🇵🇭
          </h2>
          <p className="relative mt-4 text-muted-foreground">
            Claim your katwa.link before someone else does.
          </p>
          <div className="relative mx-auto mt-8 max-w-md">
            <ClaimInline size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
        <Logo />
        <p className="text-xs text-muted-foreground">
          © 2026 katwa.link — Built with ❤️ in the Philippines.
        </p>
        <div className="flex gap-4 text-muted-foreground">
          <Facebook className="h-4 w-4" />
          <Instagram className="h-4 w-4" />
          <Music2 className="h-4 w-4" />
          <Youtube className="h-4 w-4" />
        </div>
      </div>
    </footer>
  );
}

// suppress unused imports warning for icons kept for future use
void getIcon;

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <TemplatesSection />
        <FeaturesSection />
        <DashboardSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
