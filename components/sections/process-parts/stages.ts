/** The four stages of the scrubber, in order. Text comes from `t.process.stages[id]`. */
export const stageIds = ["idea", "wireframe", "code", "live"] as const;
export type StageId = (typeof stageIds)[number];

export const lastStage = stageIds.length - 1;

/** Address pill of the browser frame at each stage. */
export const stageAddress: Record<StageId, string> = {
  idea: "napkin-sketch",
  wireframe: "wireframe-v2",
  code: "localhost:3000",
  live: "yourproduct.com",
};

/**
 * One shared layout, in % of the screen. Every stage draws the same blocks in
 * the same places, so wiping between stages reads as one screen changing.
 */
export const slot = {
  nav: "absolute inset-x-[6%] top-[6%] h-[7%]",
  title: "absolute left-[6%] top-[19%] h-[7%] w-[40%]",
  sub: "absolute left-[6%] top-[28.5%] h-[3%] w-[30%]",
  card: "absolute left-[6%] top-[37%] h-[51%] w-[40%]",
  rows: [
    "absolute left-[50%] top-[37%] h-[14%] w-[44%]",
    "absolute left-[50%] top-[55.5%] h-[14%] w-[44%]",
    "absolute left-[50%] top-[74%] h-[14%] w-[44%]",
  ],
} as const;

/** Heights of the sparkline bars in the stat card (% of the chart area). */
export const bars = [34, 52, 44, 68, 58, 82, 100] as const;

/** Values shown in the three list rows of the live screen. */
export const rowValues = ["+24", "1.2s", "4.9"] as const;
