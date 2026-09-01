import type { PatternKind, ThemeVars } from "./theme";

/** Decorative, non-interactive background art for a theme. Pure SVG/CSS. */
export function Pattern({ kind, vars }: { kind: PatternKind; vars: ThemeVars }) {
  const tint = vars.accent;

  if (kind === "sunrays") {
    return (
      <svg
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 opacity-[0.16]"
        viewBox="0 0 200 200"
      >
        <g fill={tint}>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * Math.PI) / 8;
            return (
              <polygon
                key={i}
                points={`${100 + Math.cos(a) * 22 - 5},${100 + Math.sin(a) * 22 - 5} ${
                  100 + Math.cos(a) * 100
                },${100 + Math.sin(a) * 100} ${100 + Math.cos(a) * 22 + 5},${
                  100 + Math.sin(a) * 22 + 5
                }`}
              />
            );
          })}
          <circle cx="100" cy="100" r="26" />
        </g>
      </svg>
    );
  }

  if (kind === "grid") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `linear-gradient(${tint}33 1px,transparent 1px),linear-gradient(90deg,${tint}33 1px,transparent 1px)`,
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(70% 55% at 50% 0%,#000 0%,transparent 75%)",
            WebkitMaskImage: "radial-gradient(70% 55% at 50% 0%,#000 0%,transparent 75%)",
          }}
        />
        <div
          className="absolute left-1/2 top-6 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl opacity-25"
          style={{ background: tint }}
        />
      </div>
    );
  }

  if (kind === "waves") {
    return (
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full opacity-40"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
      >
        <path d="M0 90 Q100 50 200 90 T400 90 V160 H0Z" fill="rgba(255,255,255,0.18)" />
        <path d="M0 115 Q100 78 200 115 T400 115 V160 H0Z" fill="rgba(255,255,255,0.22)" />
        <path d="M0 138 Q100 108 200 138 T400 138 V160 H0Z" fill="rgba(255,255,255,0.3)" />
      </svg>
    );
  }

  if (kind === "banig") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg,${tint} 0 8px,transparent 8px 16px),repeating-linear-gradient(-45deg,${tint} 0 8px,transparent 8px 16px)`,
          backgroundSize: "22px 22px",
        }}
      />
    );
  }

  // confetti — soft floating stars for the flag theme
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22]"
      viewBox="0 0 400 800"
      preserveAspectRatio="xMidYMin slice"
    >
      {[
        [40, 90, 7],
        [350, 60, 9],
        [200, 30, 12],
        [70, 300, 5],
        [330, 260, 6],
        [150, 520, 6],
        [300, 620, 8],
        [60, 700, 5],
      ].map(([x, y, r], i) => (
        <polygon
          key={i}
          fill={tint}
          points={Array.from({ length: 10 })
            .map((_, k) => {
              const rad = k % 2 === 0 ? r : r / 2.4;
              const a = (k * Math.PI) / 5 - Math.PI / 2;
              return `${x + Math.cos(a) * rad},${y + Math.sin(a) * rad}`;
            })
            .join(" ")}
        />
      ))}
    </svg>
  );
}
