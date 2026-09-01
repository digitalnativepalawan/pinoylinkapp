import { Check } from "lucide-react";
import { THEMES, resolveTheme } from "@/components/templates/theme";

/**
 * Fast theme chooser: 5 tappable cards, one tap to apply, instant visual feedback.
 * Replaces the old 9-template grid.
 */
export function ThemePicker({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (slug: string) => void;
  className?: string;
}) {
  const active = resolveTheme(value).slug;

  return (
    <div className={`grid grid-cols-2 gap-2.5 sm:grid-cols-3 ${className}`}>
      {THEMES.map((t) => {
        const on = active === t.slug;
        return (
          <button
            key={t.slug}
            type="button"
            onClick={() => onChange(t.slug)}
            aria-pressed={on}
            title={t.desc}
            className={`group relative overflow-hidden rounded-xl border p-0 text-left transition-all duration-200 ${
              on
                ? "border-primary ring-2 ring-primary/60"
                : "border-border hover:border-primary/40 hover:-translate-y-0.5"
            }`}
          >
            {/* live color preview */}
            <div className="relative h-16 w-full" style={{ background: t.vars.bg }} aria-hidden>
              <div className="absolute inset-0 flex flex-col justify-center gap-1 px-3">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: t.vars.ring }} />
                <div className="h-2 w-14 rounded-full" style={{ background: t.vars.accent }} />
                <div
                  className="h-2 w-20 rounded-full"
                  style={{ background: t.vars.btnBg, opacity: 0.9 }}
                />
              </div>
              {on && (
                <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>

            <div className="bg-background px-2.5 py-2">
              <div className="text-[12px] font-semibold leading-none">{t.label}</div>
              <div className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted-foreground">
                {t.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
