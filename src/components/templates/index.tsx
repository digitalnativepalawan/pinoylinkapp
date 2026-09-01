import LinkTreeTemplate, {
  type TemplateProps,
  type TemplateProfile,
  type TemplateLink,
} from "./LinkTreeTemplate";
import { THEMES, DEFAULT_THEME, resolveTheme, isKnownTheme, type Theme } from "./theme";

export type { TemplateProps, TemplateProfile, TemplateLink, Theme };
export { THEMES, DEFAULT_THEME, resolveTheme, isKnownTheme };
export { default as LinkTreeTemplate } from "./LinkTreeTemplate";

/** Picker metadata — one entry per theme. */
export const TEMPLATES = THEMES.map((t) => ({
  slug: t.slug,
  label: t.label,
  desc: t.desc,
  swatch: t.swatch,
}));

export type TemplateSlug = string;

export function isKnownTemplate(slug: string | null | undefined): boolean {
  return isKnownTheme(slug);
}

export function renderTemplate(slug: string, props: TemplateProps) {
  return <LinkTreeTemplate {...props} theme={resolveTheme(slug).slug} />;
}

/* Back-compat aliases used by older callers. */
export const NEW_TEMPLATES = TEMPLATES;
export const isNewTemplate = isKnownTemplate;
export const renderNewTemplate = renderTemplate;

/** Renders a full-width template scaled down to fit a phone frame. */
export function TemplatePhonePreview({
  slug,
  props,
  width = 430,
  scale = 0.605,
}: {
  slug: string;
  props: TemplateProps;
  width?: number;
  scale?: number;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div style={{ width, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {renderTemplate(slug, props)}
      </div>
    </div>
  );
}
export const NewTemplatePhonePreview = TemplatePhonePreview;

/** Chrome-only phone shell. */
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
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2rem] text-zinc-900">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Demo data for previews ---------------- */

const DEMO: Record<string, { display_name: string; bio: string; links: [string, string][] }> = {
  araw: {
    display_name: "Katwa Finds",
    bio: "Trusted deals, fast replies. Proudly Filipino ❤️",
    links: [
      ["Message on Messenger", "MessageCircle"],
      ["Shopee Store", "ShoppingBag"],
      ["TikTok Shop", "Music2"],
      ["Facebook Page", "Facebook"],
      ["Instagram", "Instagram"],
    ],
  },
  gabi: {
    display_name: "Juan Vlogs",
    bio: "Creating videos that inspire. Vlogs • Travel • Lifestyle",
    links: [
      ["Watch Latest Video", "Youtube"],
      ["TikTok", "Music2"],
      ["Instagram", "Instagram"],
      ["Business Inquiries", "Mail"],
      ["Support Me", "Star"],
    ],
  },
  bandila: {
    display_name: "Pinoy Creatives",
    bio: "Designs that stand out. Proudly Filipino 🇵🇭",
    links: [
      ["View My Portfolio", "Briefcase"],
      ["Book a Call", "Phone"],
      ["Services", "FileText"],
      ["Email Me", "Mail"],
      ["LinkedIn", "Linkedin"],
    ],
  },
  dagat: {
    display_name: "Azul Beach Resort",
    bio: "Your escape. Your paradise. San Vicente, Palawan.",
    links: [
      ["Book Your Stay", "Calendar"],
      ["Island Hopping Tours", "Sun"],
      ["WhatsApp Concierge", "MessageCircle"],
      ["Directions", "MapPin"],
      ["Instagram", "Instagram"],
    ],
  },
  tindahan: {
    display_name: "Likha Market",
    bio: "Proudly Filipino goods, stories, and everyday finds.",
    links: [
      ["Shop Local", "ShoppingBag"],
      ["Featured Products", "Sparkles"],
      ["Lazada Store", "Store"],
      ["Join the Community", "Users"],
      ["Message Us", "MessageCircle"],
    ],
  },
};

export function demoProps(slug: string): TemplateProps {
  const d = DEMO[resolveTheme(slug).slug] ?? DEMO.araw;
  return {
    profile: {
      display_name: d.display_name,
      bio: d.bio,
      status: "online",
      avatar_url: null,
      username: "yourname",
    },
    links: d.links.map(([label, icon], i) => ({
      id: String(i + 1),
      label,
      url: `https://example.com/${label.toLowerCase().replace(/\s+/g, "-")}`,
      icon,
      color: null,
    })),
    onLinkClick: () => {},
  };
}

/** Ready-made phone mockup for a theme (used on the landing gallery). */
export function ThemePhone({ slug }: { slug: string }) {
  return (
    <PhoneFrame>
      <TemplatePhonePreview slug={slug} props={demoProps(slug)} />
    </PhoneFrame>
  );
}
