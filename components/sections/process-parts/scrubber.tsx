import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { ChevronsLeftRight } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import { lastStage, stageIds } from "@/components/sections/process-parts/stages";
import { cn } from "@/lib/utils";

interface ScrubberProps {
  progress: MotionValue<number>;
  /** Index of the selected stage. */
  active: number;
  /** Accessible name of the slider. */
  label: string;
  /** Name of the selected stage, read as the slider's value. */
  valueText: string;
  /** Stages only, no in-between positions (reduced motion). */
  discrete: boolean;
  onScrub: (value: number) => void;
  /** Dragging ended: settle on the nearest stage. */
  onCommit: () => void;
  onStep: (delta: number) => void;
  onJump: (index: number) => void;
}

const steps: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, PageUp: 1, ArrowLeft: -1, ArrowDown: -1, PageDown: -1 };

/**
 * The slider under the frame. A native range input does the work (mouse, touch,
 * keyboard, screen readers); it is invisible and sits on top of a drawn rail
 * whose fill and handle follow `progress` with transforms only.
 */
export function Scrubber({ progress, active, label, valueText, discrete, onScrub, onCommit, onStep, onJump }: ScrubberProps) {
  const input = useRef<HTMLInputElement>(null);
  const scaleX = useTransform(progress, (v) => v / lastStage);
  const x = useTransform(progress, (v) => `${(v / lastStage) * 100}%`);

  // Keep the native thumb where the drawn handle is (tab clicks, snapping).
  useMotionValueEvent(progress, "change", (v) => {
    if (input.current) input.current.value = String(v);
  });

  // Arrows move a whole stage, not one tiny step of the range.
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key in steps) onStep(steps[e.key]);
    else if (e.key === "Home") onJump(0);
    else if (e.key === "End") onJump(lastStage);
    else return;
    e.preventDefault();
  };

  return (
    <div className="relative h-11 touch-pan-y">
      <input
        ref={input}
        type="range"
        min={0}
        max={lastStage}
        step={discrete ? 1 : 0.01}
        defaultValue={0}
        aria-label={label}
        aria-valuetext={valueText}
        onChange={(e) => onScrub(Number(e.target.value))}
        onKeyDown={onKeyDown}
        onPointerDown={() => {
          // The pointer may be released outside the input, so listen on the window.
          window.addEventListener("pointerup", onCommit, { once: true });
          window.addEventListener("pointercancel", onCommit, { once: true });
        }}
        onBlur={onCommit}
        className="peer absolute inset-0 z-10 m-0 size-full cursor-grab appearance-none opacity-0 active:cursor-grabbing [&::-moz-range-thumb]:size-11 [&::-webkit-slider-thumb]:size-11 [&::-webkit-slider-thumb]:appearance-none"
      />

      {/* Rail: inset by half a handle, so the handle never leaves the box. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[22px] top-1/2 h-1 -translate-y-1/2 rounded-full bg-line">
        <motion.span style={{ scaleX }} className="absolute inset-0 origin-left rounded-full bg-accent" />
        {stageIds.map((id, i) => (
          <span
            key={id}
            style={{ left: `${(i / lastStage) * 100}%` }}
            className={cn(
              "absolute top-1/2 size-2.5 -translate-1/2 rounded-full border-2 border-cream transition-colors duration-300 ease-ios",
              i <= active ? "bg-accent" : "bg-ink/20"
            )}
          />
        ))}
      </div>

      <motion.div
        aria-hidden="true"
        style={{ x }}
        className="pointer-events-none absolute inset-x-[22px] inset-y-0 will-change-transform peer-focus-visible:[&>span]:ring-2 peer-active:[&>span]:scale-95"
      >
        <span className="absolute top-1/2 left-0 grid size-11 -translate-1/2 place-items-center rounded-full bg-accent text-cream-50 shadow-lift ring-accent ring-offset-2 ring-offset-cream transition-transform duration-300 ease-ios">
          <ChevronsLeftRight className="size-4" strokeWidth={2.2} />
        </span>
      </motion.div>
    </div>
  );
}

export default Scrubber;
