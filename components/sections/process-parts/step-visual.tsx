import { animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { StageFrame } from "@/components/sections/process-parts/stage-frame";
import { lastStage } from "@/components/sections/process-parts/stages";
import type { Dictionary } from "@/lib/i18n";
import { ease } from "@/lib/motion";

interface StepVisualProps {
  /** Index of the step this frame belongs to. */
  index: number;
  text: Dictionary["process"]["mock"];
  reduce: boolean;
}

/**
 * The frame of one step in the stacked layout (phones, tablets, reduced motion).
 * It rests at its own stage; when motion is allowed it plays the change from the
 * previous stage once, as the step scrolls into view. Nothing is pinned or scrubbed.
 */
export function StepVisual({ index, text, reduce }: StepVisualProps) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(index);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const plays = !reduce && index > 0;

  useEffect(() => {
    if (!plays) {
      progress.set(index);
      return;
    }
    if (!inView) {
      progress.set(index - 1);
      return;
    }
    const tween = animate(progress, index, { duration: 1.4, ease, delay: 0.15 });
    return () => tween.stop();
  }, [plays, inView, index, progress]);

  return (
    <div ref={ref}>
      <StageFrame progress={progress} stage={index} live={index === lastStage && inView} text={text} reduce={reduce} />
    </div>
  );
}

export default StepVisual;
