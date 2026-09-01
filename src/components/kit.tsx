import { cn } from "@/lib/utils";

/**
 * Shared design language for the katwa.link app interface.
 * Every app surface (editor, modals, landing) composes these so spacing,
 * radius, borders and focus states stay identical everywhere.
 */

/* ---------------- Surfaces ---------------- */

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-2xl border border-border bg-card/60 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  title,
  desc,
  action,
  children,
  className,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

/* ---------------- Buttons ---------------- */

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const BTN_VARIANT: Record<string, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:brightness-110 hover:shadow-md hover:shadow-primary/20",
  secondary: "border border-border bg-background/60 text-foreground hover:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "border border-red-500/25 bg-red-500/10 text-red-300 hover:bg-red-500/20",
};

const BTN_SIZE: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

export function Button({ variant = "primary", size = "md", className, ...rest }: BtnProps) {
  return (
    <button {...rest} className={cn(BTN_BASE, BTN_VARIANT[variant], BTN_SIZE[size], className)} />
  );
}

/* ---------------- Form controls ---------------- */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {hint}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background";

/* ---------------- Feedback ---------------- */

export function Pill({
  tone = "muted",
  className,
  children,
}: {
  tone?: "muted" | "live" | "accent";
  className?: string;
  children: React.ReactNode;
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    live: "bg-emerald-500/15 text-emerald-300",
    accent: "bg-primary/15 text-primary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 px-6 py-10 text-center">
      {icon && (
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold">{title}</p>
      {desc && <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">{desc}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
