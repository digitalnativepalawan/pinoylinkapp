/**
 * katwa.link theme system
 * ------------------------------------------------------------------
 * One Linktree-style layout, five Filipino color themes.
 *
 * Every public profile renders through `LinkTreeTemplate`. A theme only
 * supplies colour tokens + a background pattern, so adding a new look is
 * ~15 lines here instead of a new 300-line component.
 */

export type PatternKind = "sunrays" | "grid" | "waves" | "banig" | "confetti";

export type ThemeVars = {
  /** page background (any CSS background value) */
  bg: string;
  /** primary text */
  text: string;
  /** secondary text */
  muted: string;
  /** brand accent */
  accent: string;
  /** text that sits on the accent */
  accentText: string;
  /** link button surface */
  btnBg: string;
  btnText: string;
  btnBorder: string;
  /** icon tile inside a link button */
  tileBg: string;
  tileText: string;
  /** avatar ring */
  ring: string;
  /** true when the background is dark (drives shadows / overlays) */
  dark: boolean;
};

export type Theme = {
  slug: string;
  label: string;
  desc: string;
  /** 4 colors shown in the picker swatch */
  swatch: [string, string, string, string];
  pattern: PatternKind;
  /** highlight color for the first link button */
  featured: boolean;
  vars: ThemeVars;
};

export const THEMES: Theme[] = [
  {
    slug: "araw",
    label: "Araw",
    desc: "Bright cream & navy. Clean, friendly, works for anything.",
    swatch: ["#fffaf0", "#0b2a6b", "#f8c62c", "#d61f2c"],
    pattern: "sunrays",
    featured: true,
    vars: {
      bg: "linear-gradient(180deg,#fffdf6 0%,#fff6e3 55%,#ffeecd 100%)",
      text: "#0b2a6b",
      muted: "#5b6b8c",
      accent: "#f8c62c",
      accentText: "#0b2a6b",
      btnBg: "#ffffff",
      btnText: "#0b2a6b",
      btnBorder: "rgba(11,42,107,0.12)",
      tileBg: "rgba(11,42,107,0.07)",
      tileText: "#0b2a6b",
      ring: "#f8c62c",
      dark: false,
    },
  },
  {
    slug: "gabi",
    label: "Gabi",
    desc: "Deep midnight glass with a gold glow. Premium and quiet.",
    swatch: ["#070d1f", "#132349", "#f8c62c", "#ffffff"],
    pattern: "grid",
    featured: true,
    vars: {
      bg: "radial-gradient(120% 80% at 50% 0%,#16295c 0%,#0a1330 45%,#05091a 100%)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.62)",
      accent: "#f8c62c",
      accentText: "#0b2a6b",
      btnBg: "rgba(255,255,255,0.07)",
      btnText: "#ffffff",
      btnBorder: "rgba(255,255,255,0.14)",
      tileBg: "rgba(248,198,44,0.16)",
      tileText: "#f8c62c",
      ring: "#f8c62c",
      dark: true,
    },
  },
  {
    slug: "bandila",
    label: "Bandila",
    desc: "Flag-forward blue, red and gold. Bold and proudly Pinoy.",
    swatch: ["#0038a8", "#ce1126", "#fcd116", "#ffffff"],
    pattern: "confetti",
    featured: false,
    vars: {
      bg: "linear-gradient(165deg,#0038a8 0%,#00287a 52%,#8f0f1c 100%)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.7)",
      accent: "#fcd116",
      accentText: "#0038a8",
      btnBg: "rgba(255,255,255,0.1)",
      btnText: "#ffffff",
      btnBorder: "rgba(255,255,255,0.22)",
      tileBg: "#fcd116",
      tileText: "#0038a8",
      ring: "#fcd116",
      dark: true,
    },
  },
  {
    slug: "dagat",
    label: "Dagat",
    desc: "Palawan water — sky to teal. Perfect for travel and resorts.",
    swatch: ["#7dd3fc", "#0284c7", "#0f766e", "#fef3c7"],
    pattern: "waves",
    featured: true,
    vars: {
      bg: "linear-gradient(180deg,#8ee0fb 0%,#22a5da 45%,#0b6f72 100%)",
      text: "#ffffff",
      muted: "rgba(255,255,255,0.78)",
      accent: "#fde047",
      accentText: "#0b4f52",
      btnBg: "rgba(255,255,255,0.16)",
      btnText: "#ffffff",
      btnBorder: "rgba(255,255,255,0.3)",
      tileBg: "rgba(255,255,255,0.9)",
      tileText: "#0b6f72",
      ring: "#ffffff",
      dark: true,
    },
  },
  {
    slug: "tindahan",
    label: "Tindahan",
    desc: "Warm amber market energy. Built for sellers and shops.",
    swatch: ["#fff7e8", "#f97316", "#c2410c", "#1f2544"],
    pattern: "banig",
    featured: true,
    vars: {
      bg: "linear-gradient(180deg,#fff8ec 0%,#ffe9c6 60%,#ffd9a1 100%)",
      text: "#1f2544",
      muted: "#7a6a54",
      accent: "#f97316",
      accentText: "#ffffff",
      btnBg: "#ffffff",
      btnText: "#1f2544",
      btnBorder: "rgba(31,37,68,0.1)",
      tileBg: "rgba(249,115,22,0.14)",
      tileText: "#c2410c",
      ring: "#f97316",
      dark: false,
    },
  },
];

export const DEFAULT_THEME = THEMES[0];

/** Old template slugs kept working after the consolidation. */
const LEGACY: Record<string, string> = {
  "classic-pinoy": "araw",
  "isla-creator": "araw",
  creator: "gabi",
  business: "gabi",
  "patriotic-pinoy": "bandila",
  "pinoy-fitness": "bandila",
  resort: "dagat",
  seller: "tindahan",
  "likha-market": "tindahan",
};

export function resolveTheme(slug: string | null | undefined): Theme {
  if (!slug) return DEFAULT_THEME;
  const direct = THEMES.find((t) => t.slug === slug);
  if (direct) return direct;
  const mapped = LEGACY[slug];
  return THEMES.find((t) => t.slug === mapped) ?? DEFAULT_THEME;
}

export function isKnownTheme(slug: string | null | undefined): boolean {
  return !!slug && (THEMES.some((t) => t.slug === slug) || slug in LEGACY);
}
