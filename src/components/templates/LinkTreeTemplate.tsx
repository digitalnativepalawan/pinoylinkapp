import { ChevronRight, BadgeCheck } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { Pattern } from "./Pattern";
import { resolveTheme, type Theme } from "./theme";

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
  /** theme slug — falls back to the profile default */
  theme?: string;
};

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function LinkButton({
  link,
  theme,
  featured,
  onClick,
}: {
  link: TemplateLink;
  theme: Theme;
  featured: boolean;
  onClick?: (id: string, url: string) => void;
}) {
  const v = theme.vars;
  const Icon = getIcon(link.icon);
  const host = hostOf(link.url);

  const surface = featured
    ? { background: v.accent, color: v.accentText, borderColor: "transparent" }
    : { background: v.btnBg, color: v.btnText, borderColor: v.btnBorder };

  const tile = featured
    ? { background: "rgba(0,0,0,0.12)", color: v.accentText }
    : { background: v.tileBg, color: v.tileText };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(link.id, link.url);
        }
      }}
      style={{
        ...surface,
        backdropFilter: v.dark ? "blur(10px)" : undefined,
        WebkitBackdropFilter: v.dark ? "blur(10px)" : undefined,
      }}
      className="group flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.99]"
    >
      <span
        style={tile}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105"
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-[15px] font-semibold leading-tight">{link.label}</span>
        {host && <span className="mt-0.5 block truncate text-[11px] opacity-60">{host}</span>}
      </span>

      <ChevronRight className="h-4 w-4 shrink-0 opacity-40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-80" />
    </a>
  );
}

/**
 * The single public-profile renderer. Layout is fixed (Linktree-style,
 * mobile-first); only colors and the background pattern change per theme.
 */
export default function LinkTreeTemplate({ profile, links, onLinkClick, theme }: TemplateProps) {
  const t = resolveTheme(theme);
  const v = t.vars;
  const online = profile.status === "online";

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: v.bg, color: v.text }}
    >
      <Pattern kind={t.pattern} vars={v} />

      <div className="relative mx-auto flex max-w-md flex-col items-center px-5 pb-14 pt-12">
        {/* Avatar */}
        <div className="relative">
          <div
            className="grid h-24 w-24 place-items-center overflow-hidden rounded-full"
            style={{
              boxShadow: `0 0 0 3px ${v.ring}, 0 0 0 7px ${v.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
              background: v.dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }}
          >
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-bold" style={{ color: v.text }}>
                {initials(profile.display_name || "K")}
              </span>
            )}
          </div>
          <span
            className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full"
            style={{ background: v.accent, color: v.accentText }}
          >
            <BadgeCheck className="h-4 w-4" />
          </span>
        </div>

        {/* Name + status */}
        <h1 className="mt-4 text-center text-[22px] font-bold leading-tight tracking-tight">
          {profile.display_name}
        </h1>

        <span
          className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            background: v.dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            color: v.muted,
          }}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${online ? "animate-pulse" : ""}`}
            style={{ background: online ? "#22c55e" : "#94a3b8" }}
          />
          {online ? "Active now" : "Away"}
        </span>

        {profile.bio && (
          <p
            className="mt-3 max-w-[19rem] text-center text-[13.5px] leading-relaxed"
            style={{ color: v.muted }}
          >
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div className="mt-7 flex w-full flex-col gap-2.5">
          {links.map((l, i) => (
            <LinkButton
              key={l.id}
              link={l}
              theme={t}
              featured={t.featured && i === 0}
              onClick={onLinkClick}
            />
          ))}
        </div>

        {links.length === 0 && (
          <p className="mt-10 text-center text-sm" style={{ color: v.muted }}>
            No links yet.
          </p>
        )}

        {/* Footer */}
        <div className="mt-10 flex items-center gap-1.5 text-[11px]" style={{ color: v.muted }}>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: v.accent }}
          />
          katwa.link{profile.username ? `/${profile.username}` : ""}
        </div>
      </div>
    </div>
  );
}
