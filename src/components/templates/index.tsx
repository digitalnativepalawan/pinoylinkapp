import PinoyFitnessTemplate, { type TemplateProps } from "./PinoyFitnessTemplate";
import IslaCreatorTemplate from "./IslaCreatorTemplate";
import ClassicPinoyTemplate from "./ClassicPinoyTemplate";
import SellerTemplate from "./SellerTemplate";
import CreatorTemplate from "./CreatorTemplate";
import BusinessTemplate from "./BusinessTemplate";
import ResortTemplate from "./ResortTemplate";
import PatrioticPinoyTemplate from "./PatrioticPinoyTemplate";

export const TEMPLATES = [
  {
    slug: "classic-pinoy",
    label: "CLASSIC PINOY",
    color: "text-[#c9a84c]",
    desc: "Editorial cream aesthetic with quiet Filipino flourishes.",
    swatch: ["#faf6ec", "#0a2e6b", "#c92030", "#c9a84c"],
    Component: ClassicPinoyTemplate,
  },
  {
    slug: "seller",
    label: "SELLER",
    color: "text-amber-500",
    desc: "Marketplace-ready for online sellers and resellers.",
    swatch: ["#ffe9b8", "#f97316", "#c2410c", "#1f2544"],
    Component: SellerTemplate,
  },
  {
    slug: "creator",
    label: "CREATOR",
    color: "text-fuchsia-400",
    desc: "Aurora-glass premium look for content creators.",
    swatch: ["#0d0824", "#4b1264", "#ec4899", "#f7c948"],
    Component: CreatorTemplate,
  },
  {
    slug: "business",
    label: "BUSINESS",
    color: "text-[#c9a84c]",
    desc: "Hospitality-grade emerald and gold for cafes and shops.",
    swatch: ["#064e3b", "#052e1b", "#c9a84c", "#f5efe0"],
    Component: BusinessTemplate,
  },
  {
    slug: "resort",
    label: "RESORT",
    color: "text-sky-300",
    desc: "Tropical luxury for resorts, hotels, and travel.",
    swatch: ["#7dd3fc", "#0284c7", "#0f766e", "#fde047"],
    Component: ResortTemplate,
  },
  {
    slug: "patriotic-pinoy",
    label: "PATRIOTIC PINOY",
    color: "text-[#ffd23a]",
    desc: "Flag-forward statement with the Philippine sun.",
    swatch: ["#0038a8", "#cc1f2d", "#ffd23a", "#ffffff"],
    Component: PatrioticPinoyTemplate,
  },
  {
    slug: "pinoy-fitness",
    label: "PINOY FITNESS",
    color: "text-[#ffcf2a]",
    desc: "Bold flag-color design for coaches and athletes.",
    swatch: ["#0a1c5c", "#d21f2d", "#ffcf2a", "#ffffff"],
    Component: PinoyFitnessTemplate,
  },
  {
    slug: "isla-creator",
    label: "ISLA CREATOR",
    color: "text-[#c92030]",
    desc: "Warm cream aesthetic for lifestyle creators.",
    swatch: ["#f7f1e6", "#0a2e6b", "#c92030", "#e8b93a"],
    Component: IslaCreatorTemplate,
  },
] as const;

export type TemplateSlug = (typeof TEMPLATES)[number]["slug"];

export function isKnownTemplate(slug: string | null | undefined): slug is TemplateSlug {
  return !!slug && TEMPLATES.some((t) => t.slug === slug);
}

export function renderTemplate(slug: string, props: TemplateProps) {
  const t = TEMPLATES.find((x) => x.slug === slug) ?? TEMPLATES[0];
  const C = t.Component;
  return <C {...props} />;
}

// Back-compat aliases (some callers still import the old names)
export const NEW_TEMPLATES = TEMPLATES;
export const isNewTemplate = isKnownTemplate;
export const renderNewTemplate = renderTemplate;

/**
 * Renders any template scaled to fit inside a PhoneFrame (260×~563 inner).
 * The full template renders at its natural width (~430px) and scale-transforms.
 */
export function TemplatePhonePreview({ slug, props }: { slug: string; props: TemplateProps }) {
  const el = renderTemplate(slug, props);
  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <div
        style={{
          width: 430,
          transform: "scale(0.605)",
          transformOrigin: "top left",
        }}
      >
        {el}
      </div>
    </div>
  );
}
export const NewTemplatePhonePreview = TemplatePhonePreview;

function LocalPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[260px] shrink-0">
      <div className="relative rounded-[2.5rem] border-[6px] border-[#0a0a0a] bg-black p-1 shadow-2xl shadow-black/60">
        <div className="relative overflow-hidden rounded-[2rem] aspect-[9/19.5] text-zinc-900">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- Seed data for landing gallery previews ---------- */

type SeedSpec = {
  display_name: string;
  bio: string;
  links: { label: string; icon: string }[];
};

const SEED: Record<TemplateSlug, SeedSpec> = {
  "classic-pinoy": {
    display_name: "Katwa Finds",
    bio: "Trusted deals. Fast replies. Proudly Filipino ❤️",
    links: [
      { label: "Message on Messenger", icon: "MessageCircle" },
      { label: "Shopee Store", icon: "ShoppingBag" },
      { label: "TikTok Shop", icon: "Music2" },
      { label: "Facebook Page", icon: "Facebook" },
      { label: "Instagram", icon: "Instagram" },
    ],
  },
  seller: {
    display_name: "Katwa Finds",
    bio: "Budol finds • Fast response • Trusted seller ⭐",
    links: [
      { label: "Message on Messenger", icon: "MessageCircle" },
      { label: "Shopee Store", icon: "ShoppingBag" },
      { label: "TikTok Shop", icon: "Music2" },
      { label: "Lazada Store", icon: "Store" },
      { label: "WhatsApp", icon: "MessageCircle" },
    ],
  },
  creator: {
    display_name: "Juan Vlogs",
    bio: "Creating videos that inspire. Vlogs • Travel • Lifestyle",
    links: [
      { label: "YouTube Channel", icon: "Youtube" },
      { label: "TikTok", icon: "Music2" },
      { label: "Instagram", icon: "Instagram" },
      { label: "Facebook Page", icon: "Facebook" },
      { label: "Business Inquiries", icon: "Mail" },
    ],
  },
  business: {
    display_name: "Bean & Brew",
    bio: "Good coffee. Good food. Good vibes.",
    links: [
      { label: "View Our Menu", icon: "FileText" },
      { label: "Book a Table", icon: "Calendar" },
      { label: "Message Us", icon: "MessageCircle" },
      { label: "Directions", icon: "MapPin" },
      { label: "Customer Reviews", icon: "Star" },
    ],
  },
  resort: {
    display_name: "Azul Beach Resort",
    bio: "Your escape. Your paradise. San Vicente, Palawan.",
    links: [
      { label: "Book Your Stay", icon: "Calendar" },
      { label: "Island Hopping Tours", icon: "Sun" },
      { label: "WhatsApp Concierge", icon: "MessageCircle" },
      { label: "Directions", icon: "MapPin" },
      { label: "Instagram", icon: "Instagram" },
    ],
  },
  "patriotic-pinoy": {
    display_name: "Pinoy Creatives",
    bio: "Designs that stand out. Proudly Filipino 🇵🇭",
    links: [
      { label: "View My Portfolio", icon: "Briefcase" },
      { label: "Book a Call", icon: "Phone" },
      { label: "Services", icon: "FileText" },
      { label: "Email Me", icon: "Mail" },
      { label: "LinkedIn", icon: "Linkedin" },
    ],
  },
  "pinoy-fitness": {
    display_name: "Coach Jay",
    bio: "Pinoy fitness coach helping you build strength, discipline, and confidence. Tara, maging pinakamalakas na ikaw!",
    links: [
      { label: "Train With Me", icon: "Calendar" },
      { label: "Programs", icon: "FileText" },
      { label: "Stories", icon: "Star" },
      { label: "Message Coach", icon: "MessageCircle" },
      { label: "Laban Lang!", icon: "Sun" },
    ],
  },
  "isla-creator": {
    display_name: "Isla Reyes",
    bio: "Sharing bits of everyday life, travels, fashion, and the things that make me happy.",
    links: [
      { label: "Shop My Picks", icon: "ShoppingBag" },
      { label: "Watch My Vlog", icon: "Youtube" },
      { label: "Message Me", icon: "MessageCircle" },
      { label: "Collab Tayo", icon: "Briefcase" },
      { label: "Support Me", icon: "Star" },
    ],
  },
};

function buildSeed(slug: TemplateSlug): TemplateProps {
  const s = SEED[slug];
  return {
    profile: {
      display_name: s.display_name,
      bio: s.bio,
      status: "online",
      avatar_url: null,
    },
    links: s.links.map((l, i) => ({
      id: String(i + 1),
      label: l.label,
      url: `https://example.com/${l.label.toLowerCase().replace(/\s+/g, "-")}`,
      icon: l.icon,
      color: null,
    })),
    onLinkClick: () => {},
  };
}

function makePhone(slug: TemplateSlug) {
  const Phone = function TemplatePhone() {
    return (
      <LocalPhoneFrame>
        <TemplatePhonePreview slug={slug} props={buildSeed(slug)} />
      </LocalPhoneFrame>
    );
  };
  Phone.displayName = `${slug}-phone`;
  return Phone;
}

export const ClassicPinoyPhone = makePhone("classic-pinoy");
export const SellerPhone = makePhone("seller");
export const CreatorPhone = makePhone("creator");
export const BusinessPhone = makePhone("business");
export const ResortPhone = makePhone("resort");
export const PatrioticPhone = makePhone("patriotic-pinoy");
export const PinoyFitnessPhone = makePhone("pinoy-fitness");
export const IslaCreatorPhone = makePhone("isla-creator");
