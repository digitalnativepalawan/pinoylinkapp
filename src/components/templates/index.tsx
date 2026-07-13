import PinoyFitnessTemplate, { type TemplateProps } from "./PinoyFitnessTemplate";
import IslaCreatorTemplate from "./IslaCreatorTemplate";

export const NEW_TEMPLATES = [
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

export type NewTemplateSlug = (typeof NEW_TEMPLATES)[number]["slug"];

export function isNewTemplate(slug: string | null | undefined): slug is NewTemplateSlug {
  return !!slug && NEW_TEMPLATES.some((t) => t.slug === slug);
}

export function renderNewTemplate(slug: string, props: TemplateProps) {
  const t = NEW_TEMPLATES.find((x) => x.slug === slug);
  if (!t) return null;
  const C = t.Component;
  return <C {...props} />;
}

/**
 * Renders a new template scaled to fit inside a PhoneFrame (260×~563 inner).
 * The full template renders at its natural width (~430px) and scale-transforms.
 */
export function NewTemplatePhonePreview({ slug, props }: { slug: string; props: TemplateProps }) {
  const el = renderNewTemplate(slug, props);
  if (!el) return null;
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

/** Small standalone phone-frame preview for the landing gallery. */
import { PhoneFrame } from "@/routes/index";

export function PinoyFitnessPhone() {
  return (
    <PhoneFrame>
      <NewTemplatePhonePreview
        slug="pinoy-fitness"
        props={{
          profile: {
            display_name: "Coach Jay",
            bio: "Pinoy fitness coach helping you build strength, discipline, and confidence. Tara, maging pinakamalakas na ikaw!",
            status: "online",
            avatar_url: null,
          },
          links: [
            { id: "1", label: "Train With Me", url: "https://example.com/train", icon: "Calendar", color: null },
            { id: "2", label: "Programs", url: "https://example.com/programs", icon: "FileText", color: null },
            { id: "3", label: "Stories", url: "https://example.com/stories", icon: "Star", color: null },
            { id: "4", label: "Message Coach", url: "https://example.com/msg", icon: "MessageCircle", color: null },
            { id: "5", label: "Laban Lang!", url: "https://example.com/laban", icon: "Sun", color: null },
          ],
          onLinkClick: () => {},
        }}
      />
    </PhoneFrame>
  );
}

export function IslaCreatorPhone() {
  return (
    <PhoneFrame>
      <NewTemplatePhonePreview
        slug="isla-creator"
        props={{
          profile: {
            display_name: "Isla Reyes",
            bio: "Sharing bits of everyday life, travels, fashion, and the things that make me happy.",
            status: "online",
            avatar_url: null,
          },
          links: [
            { id: "1", label: "Shop My Picks", url: "https://example.com/shop", icon: "ShoppingBag", color: null },
            { id: "2", label: "Watch My Vlog", url: "https://example.com/vlog", icon: "Youtube", color: null },
            { id: "3", label: "Message Me", url: "https://example.com/msg", icon: "MessageCircle", color: null },
            { id: "4", label: "Collab Tayo", url: "https://example.com/collab", icon: "Briefcase", color: null },
            { id: "5", label: "Support Me", url: "https://example.com/support", icon: "Star", color: null },
          ],
          onLinkClick: () => {},
        }}
      />
    </PhoneFrame>
  );
}
