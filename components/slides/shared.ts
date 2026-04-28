export const PAL = {
  cream:    "#FFF7E4",
  ink:      "#1F2544",
  inkSoft:  "#5A6088",
  green:    "#38C76B",
  greenDk:  "#2CA555",
  blue:     "#2DADE8",
  orange:   "#FF8A3D",
  orangeDk: "#DB6D22",
  red:      "#EF5A5A",
  yellow:   "#FFD23F",
  purple:   "#A86CE4",
  accent:   "#3B5BDB",
};

export const FONT = '"Inter", ui-sans-serif, system-ui, sans-serif';
export const MONO = '"DM Mono", var(--font-dm-mono), ui-monospace, monospace';

export type PillColor = "blue" | "orange" | "purple" | "green";

export const PILL_COLORS: Record<PillColor, { bg: string; text: string }> = {
  blue:   { bg: PAL.accent,  text: "#fff" },
  orange: { bg: PAL.orange,  text: "#fff" },
  purple: { bg: PAL.purple,  text: "#fff" },
  green:  { bg: PAL.green,   text: "#fff" },
};

export type OptionState = "idle" | "correct" | "wrong" | "dim";

export const OPTION_STYLES: Record<OptionState, { bg: string; border: string; text: string; badgeBg: string; badgeText: string }> = {
  idle:    { bg: "#fff",    border: "rgba(31,37,68,0.12)", text: PAL.ink,     badgeBg: "#FFEAB8",  badgeText: PAL.ink },
  correct: { bg: "#E7F8EC", border: PAL.green,             text: PAL.ink,     badgeBg: PAL.green,  badgeText: "#fff" },
  wrong:   { bg: "#FDECEC", border: PAL.red,               text: PAL.inkSoft, badgeBg: PAL.red,    badgeText: "#fff" },
  dim:     { bg: "#fff",    border: "rgba(31,37,68,0.07)", text: "rgba(31,37,68,0.35)", badgeBg: "rgba(31,37,68,0.07)", badgeText: "rgba(31,37,68,0.3)" },
};
