export type LessonPurchaseTheme = {
  /** Tailwind gradient: from-* via-* to-* (no bg-gradient-to-br prefix) */
  gradient: string;
  icon: string;
  tagline: string;
  /** Dekoratif desen kimliği */
  pattern: "grid" | "dots" | "waves" | "hex";
};

export const LESSON_PURCHASE_THEMES: Record<string, LessonPurchaseTheme> = {
  coulomb: {
    gradient: "from-violet-600/95 via-purple-950/90 to-slate-950",
    icon: "⚡",
    tagline: "Elektrik kuvveti & Coulomb",
    pattern: "grid",
  },
  "ivmeli-hareket": {
    gradient: "from-blue-600/95 via-indigo-950/90 to-slate-950",
    icon: "📈",
    tagline: "Kinematik & grafikler",
    pattern: "waves",
  },
  "enerji-is": {
    gradient: "from-amber-600/95 via-orange-950/85 to-slate-950",
    icon: "🔋",
    tagline: "Enerji, iş ve güç",
    pattern: "dots",
  },
  "elektrik-alan": {
    gradient: "from-fuchsia-600/95 via-violet-950/90 to-slate-950",
    icon: "🧲",
    tagline: "Alan & potansiyel",
    pattern: "hex",
  },
  "dalga-hareketi": {
    gradient: "from-cyan-600/95 via-teal-950/90 to-slate-950",
    icon: "〰️",
    tagline: "Dalga ve SHM",
    pattern: "waves",
  },
  momentum: {
    gradient: "from-rose-600/95 via-red-950/90 to-slate-950",
    icon: "💥",
    tagline: "Momentum & çarpışma",
    pattern: "grid",
  },
  optik: {
    gradient: "from-sky-500/95 via-blue-950/90 to-slate-950",
    icon: "🔭",
    tagline: "Işık, mercek, ayna",
    pattern: "dots",
  },
};

export const LESSON_PURCHASE_DEFAULT: LessonPurchaseTheme = {
  gradient: "from-emerald-600/90 via-slate-900 to-slate-950",
  icon: "📚",
  tagline: "Fizik dersleri",
  pattern: "grid",
};

export function getLessonPurchaseTheme(lessonId: string): LessonPurchaseTheme {
  return LESSON_PURCHASE_THEMES[lessonId] ?? LESSON_PURCHASE_DEFAULT;
}
