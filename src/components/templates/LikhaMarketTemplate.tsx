import { ChevronRight, Mail, ShoppingBag, Sparkles, Sun } from "lucide-react";
import { getIcon } from "@/lib/icons";
import type { TemplateProps } from "./PinoyFitnessTemplate";

const BLUE = "#063f8f";
const BLUE_DARK = "#032c66";
const RED = "#d61f2c";
const YELLOW = "#f8c62c";
const CREAM = "#fff7e8";
const INK = "#10254b";

const BUTTONS = [
  { bg: BLUE, fg: "#ffffff", sub: "#ffd84f" },
  { bg: RED, fg: "#ffffff", sub: "#ffd84f" },
  { bg: YELLOW, fg: INK, sub: "#17325f" },
  { bg: BLUE, fg: "#ffffff", sub: "#ffd84f" },
  { bg: RED, fg: "#ffffff", sub: "#ffd84f" },
];

const SUBTITLES = [
  "Discover handmade and proudly Pinoy finds",
  "Best sellers and curated favorites",
  "Meet the makers behind the brand",
  "Events, pop-ups, and collaborations",
  "Ask a question or place an order",
];

export default function LikhaMarketTemplate({
  profile,
  links,
  onLinkClick,
}: TemplateProps) {
  const handle = (id: string, url: string) => {
    if (onLinkClick) onLinkClick(id, url);
    else window.location.href = url;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: CREAM, color: INK }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[310px]"
        style={{
          background:
            "radial-gradient(circle at 20% 35%, rgba(255,255,255,.24), transparent 24%), linear-gradient(180deg, #0b6dc6 0%, #0a82c5 46%, #0a5a9b 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-2 px-4 pt-3">
        {[RED, YELLOW, BLUE, RED, YELLOW, BLUE, RED].map((color, index) => (
          <div
            key={index}
            className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent"
            style={{ borderTopColor: color }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-md px-3 pb-10 pt-24">
        <div
          className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full border-[10px] border-white shadow-2xl"
          style={{ background: CREAM }}
        >
          <div
            className="absolute inset-1 rounded-full border-[6px]"
            style={{ borderColor: BLUE }}
          />
          <div
            className="absolute inset-3 rounded-full border-[5px] border-dashed"
            style={{ borderColor: RED }}
          />

          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="relative h-28 w-28 rounded-full object-cover"
            />
          ) : (
            <div className="relative text-center">
              <div
                className="mx-auto grid h-14 w-14 place-items-center rounded-full"
                style={{ background: YELLOW }}
              >
                <Sun className="h-8 w-8" style={{ color: BLUE }} />
              </div>
              <div
                className="mt-2 text-xl font-black tracking-[0.16em]"
                style={{ color: BLUE }}
              >
                LIKHA
              </div>
              <div
                className="text-xs font-bold tracking-[0.3em]"
                style={{ color: RED }}
              >
                MARKET
              </div>
            </div>
          )}
        </div>

        <div
          className="relative -mt-4 overflow-hidden rounded-t-[4rem] border-x-[8px] border-t-[8px] bg-[#fffaf0] px-5 pb-8 pt-10 shadow-2xl"
          style={{ borderColor: BLUE }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(45deg, rgba(193,151,88,.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(193,151,88,.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(193,151,88,.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(193,151,88,.12) 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          />

          <div className="relative text-center">
            <div
              className="text-[3rem] font-black leading-none tracking-tight"
              style={{ color: BLUE }}
            >
              Kumusta!
            </div>

            <div className="mx-auto mt-3 flex items-center justify-center gap-1.5">
              {[BLUE, YELLOW, RED, BLUE].map((color, index) => (
                <span
                  key={index}
                  className="h-2.5 w-2.5 rotate-45"
                  style={{ background: color }}
                />
              ))}
            </div>

            <h1
              className="mt-4 text-xl font-black uppercase tracking-wide"
              style={{ color: RED }}
            >
              {profile.display_name}
            </h1>

            {profile.bio && (
              <p
                className="mx-auto mt-3 max-w-xs text-sm font-medium leading-relaxed"
                style={{ color: INK }}
              >
                {profile.bio}
              </p>
            )}

            <p className="mt-3 text-sm font-bold" style={{ color: RED }}>
              Para sa Bayan. Para sa Komunidad. Para sa Lahat.
            </p>

            <div className="mt-5 flex justify-center gap-3">
              {[ShoppingBag, Sparkles, Mail].map((Icon, index) => (
                <div
                  key={index}
                  className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-md ring-2"
                  style={{
                    color: [BLUE, RED, BLUE][index],
                    boxShadow: "0 6px 12px rgba(15,37,75,.12)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-6 space-y-3">
            {links.map((link, index) => {
              const Icon = getIcon(link.icon);
              const scheme = BUTTONS[index % BUTTONS.length];

              return (
                <button
                  key={link.id}
                  onClick={() => handle(link.id, link.url)}
                  className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border-2 px-3 py-3 text-left shadow-[0_7px_0_rgba(30,35,65,.18)] transition hover:-translate-y-0.5"
                  style={{
                    background: scheme.bg,
                    borderColor: "rgba(255,255,255,.82)",
                    color: scheme.fg,
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,.26) 0 2px, transparent 2px 12px)",
                    }}
                  />

                  <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/95 shadow-sm">
                    <Icon
                      className="h-6 w-6"
                      style={{ color: scheme.bg === YELLOW ? BLUE : scheme.bg }}
                    />
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <div className="truncate text-[15px] font-black uppercase tracking-wide">
                      {link.label}
                    </div>
                    <div
                      className="mt-0.5 truncate text-[11px] font-semibold"
                      style={{ color: scheme.sub }}
                    >
                      {SUBTITLES[index] ?? "Open this link"}
                    </div>
                  </div>

                  <ChevronRight className="relative h-7 w-7 shrink-0 transition group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-b-[2rem] px-5 py-5 text-center shadow-xl"
          style={{ background: BLUE_DARK, color: "white" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,.2) 0 2px, transparent 2px 14px)",
            }}
          />
          <div className="relative text-lg font-black tracking-wide">
            Isang Bayan. Isang Puso.
          </div>
          <div
            className="relative mt-1 text-xs font-semibold"
            style={{ color: YELLOW }}
          >
            Proudly Filipino. Proudly local.
          </div>
        </div>
      </div>
    </div>
  );
}
