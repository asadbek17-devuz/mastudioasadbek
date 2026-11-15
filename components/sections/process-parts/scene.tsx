import { motion, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { CodePanel } from "@/components/sections/process-parts/code-panel";
import { IdeaStage } from "@/components/sections/process-parts/idea-stage";
import { LiveStage } from "@/components/sections/process-parts/live-stage";
import { WireStage } from "@/components/sections/process-parts/wire-stage";
import type { Dictionary } from "@/lib/i18n";

/** Progress of one stretch of the 0..3 progress, clamped to 0..1. */
function useSpan(progress: MotionValue<number>, from: number, to: number) {
  return useTransform(progress, [from, to], [0, 1], { clamp: true });
}

/** Reveals its children from the left edge, with a thin accent line on the seam. */
function Wipe({ amount, children }: { amount: MotionValue<number>; children: ReactNode }) {
  const clipPath = useTransform(amount, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`);
  const x = useTransform(amount, (v) => `${v * 100}%`);
  const opacity = useTransform(amount, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  return (
    <>
      <motion.div style={{ clipPath }} className="absolute inset-0">
        {children}
      </motion.div>
      <motion.div style={{ x, opacity }} className="pointer-events-none absolute inset-0">
        <span className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-accent shadow-[0_0_0_3px_rgb(31_77_63/0.12)]" />
      </motion.div>
    </>
  );
}

interface SceneProps {
  /** 0 (idea) .. 3 (live). Every layer derives its state from this one value. */
  progress: MotionValue<number>;
  text: Dictionary["process"]["mock"];
  /** The live stage is the selected one. */
  live: boolean;
  reduce: boolean;
}

/**
 * The product screen. Four layers share one layout: the wireframe wipes over
 * the sketch, the editor slides in over the wireframe, the live UI wipes over both.
 * Type scales with the frame (`cqw`), so the mock looks the same at any width.
 */
export function Scene({ progress, text, live, reduce }: SceneProps) {
  const toWire = useSpan(progress, 0, 1);
  const editorOpen = useSpan(progress, 1, 1.55);
  const typed = useSpan(progress, 1.3, 2);
  const toLive = useSpan(progress, 2, 3);

  return (
    <div className="absolute inset-0 overflow-hidden text-[2.3cqw] leading-none select-none">
      <IdeaStage note={text.note} />
      <Wipe amount={toWire}>
        <WireStage focus={typed} />
      </Wipe>
      <CodePanel open={editorOpen} typed={typed} />
      <Wipe amount={toLive}>
        <LiveStage text={text} active={live} reduce={reduce} />
      </Wipe>
    </div>
  );
}

export default Scene;
