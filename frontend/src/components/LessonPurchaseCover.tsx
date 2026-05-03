import { useId, type ReactNode } from "react";
import { getLessonPurchaseTheme } from "./lessonPurchaseThemes";

type Props = {
  lessonId: string;
  title?: string;
  subtitle?: string;
  /** 'banner' dikdörtgen kapak • 'square' küçük kart */
  variant?: "banner" | "square";
  rightSlot?: ReactNode;
};

function PatternOverlay({
  pattern,
  patternIdSuffix,
  className = "",
}: {
  pattern: "grid" | "dots" | "waves" | "hex";
  patternIdSuffix: string;
  className?: string;
}) {
  const gid = `lp-grid-${patternIdSuffix}`;
  const did = `lp-dots-${patternIdSuffix}`;

  if (pattern === "grid") {
    return (
      <svg
        className={`pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] ${className}`}
        aria-hidden
      >
        <defs>
          <pattern id={gid} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gid})`} />
      </svg>
    );
  }
  if (pattern === "dots") {
    return (
      <svg
        className={`pointer-events-none absolute inset-0 h-full w-full opacity-[0.18] ${className}`}
        aria-hidden
      >
        <defs>
          <pattern id={did} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${did})`} />
      </svg>
    );
  }
  if (pattern === "waves") {
    return (
      <svg
        className={`pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 opacity-25 ${className}`}
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
        aria-hidden
      >
        <path
          fill="white"
          d="M0,60 C200,20 400,100 600,55 C800,10 1000,90 1200,50 L1200,120 L0,120 Z"
        />
      </svg>
    );
  }
  return (
    <svg
      className={`pointer-events-none absolute -right-8 -top-8 h-48 w-48 opacity-10 ${className}`}
      aria-hidden
      viewBox="0 0 100 100"
    >
      <polygon fill="white" points="50,5 90,25 90,75 50,95 10,75 10,25" />
    </svg>
  );
}

export function LessonPurchaseCover({
  lessonId,
  title,
  subtitle,
  variant = "banner",
  rightSlot,
}: Props) {
  const theme = getLessonPurchaseTheme(lessonId);
  const isSquare = variant === "square";
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br shadow-lg ${theme.gradient} ${
        isSquare ? "aspect-[4/3] min-h-[140px]" : "min-h-[140px] sm:min-h-[160px] md:aspect-[2.4/1] md:min-h-0"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(255,255,255,0.15),transparent)]" />
      <PatternOverlay pattern={theme.pattern} patternIdSuffix={uid} />

      <div
        className={`relative z-[1] flex h-full flex-col justify-between gap-4 p-4 text-white md:flex-row md:items-end ${
          isSquare ? "md:flex-col md:items-start md:justify-end" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex shrink-0 items-center justify-center rounded-2xl bg-black/25 ring-2 ring-white/15 backdrop-blur-sm ${
              isSquare ? "h-14 w-14 text-2xl" : "h-16 w-16 text-3xl md:h-[4.25rem] md:w-[4.25rem] md:text-4xl"
            }`}
            aria-hidden
          >
            {theme.icon}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">{theme.tagline}</p>
            {title ? (
              <h3
                className={`font-black leading-tight tracking-tight text-white drop-shadow ${
                  isSquare ? "mt-1 text-base" : "mt-1 text-lg sm:text-xl md:text-2xl"
                }`}
              >
                {title}
              </h3>
            ) : null}
            {subtitle ? (
              <p className={`mt-1 text-white/85 ${isSquare ? "line-clamp-2 text-xs" : "max-w-xl text-xs sm:text-sm"}`}>
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {rightSlot ? <div className="flex shrink-0 items-center gap-3 md:self-end">{rightSlot}</div> : null}
      </div>
    </div>
  );
}

export function InstructorAvatar({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase() || "?";

  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/90 to-teal-600/90 text-sm font-bold text-slate-950 shadow-md ring-2 ring-white/20"
      aria-hidden
    >
      {initials}
    </span>
  );
}
