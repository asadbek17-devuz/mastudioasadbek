"use client";

import { ChevronLeft, ChevronRight, Pause, Play, type LucideIcon } from "lucide-react";
import { darkFocusRing } from "@/components/sections/story-parts/chapters";
import { cn } from "@/lib/utils";

interface ControlButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function ControlButton({ icon: Icon, label, onClick, disabled }: ControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-11 place-items-center rounded-full border border-cream-50/15 bg-cream-50/[0.06] text-cream-50 transition-[background-color,border-color,opacity,scale] duration-300 ease-ios hover:border-cream-50/30 hover:bg-cream-50/15 active:scale-95 disabled:opacity-35 disabled:hover:border-cream-50/15 disabled:hover:bg-cream-50/[0.06]",
        darkFocusRing
      )}
    >
      <Icon className="size-[18px]" aria-hidden="true" />
    </button>
  );
}

interface ControlsProps {
  labels: { play: string; pause: string; previous: string; next: string };
  paused: boolean;
  /** No clock to control: reduced motion, or the closing frame (it has its own replay button). */
  manual: boolean;
  canPrevious: boolean;
  canNext: boolean;
  onToggle: () => void;
  onStep: (delta: number) => void;
}

export function Controls({ labels, paused, manual, canPrevious, canNext, onToggle, onStep }: ControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      {manual ? (
        <span />
      ) : (
        <ControlButton icon={paused ? Play : Pause} label={paused ? labels.play : labels.pause} onClick={onToggle} />
      )}
      <div className="flex items-center gap-2">
        <ControlButton icon={ChevronLeft} label={labels.previous} disabled={!canPrevious} onClick={() => onStep(-1)} />
        <ControlButton icon={ChevronRight} label={labels.next} disabled={!canNext} onClick={() => onStep(1)} />
      </div>
    </div>
  );
}

export default Controls;
