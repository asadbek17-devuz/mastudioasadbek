import type { Dictionary } from "@/lib/i18n";

export type ChapterId = keyof Dictionary["story"]["chapters"];

/** Play order. The text of each chapter comes from `t.story.chapters[id]`. */
export const chapterIds = [
  "start",
  "marsIntern",
  "navi",
  "studio",
  "teaching",
  "today",
] as const satisfies readonly ChapterId[];

export const chapterCount = chapterIds.length;

/** Index of the closing frame, which comes after the last chapter and is not timed. */
export const outroIndex = chapterCount;

/** How long one chapter stays on screen. */
export const CHAPTER_MS = 5000;

/** Focus ring for controls on the dark screen. */
export const darkFocusRing =
  "focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none";
