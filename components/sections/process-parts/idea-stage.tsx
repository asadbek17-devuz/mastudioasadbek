import { slot } from "@/components/sections/process-parts/stages";
import { cn } from "@/lib/utils";

/** Uneven corner radii: the classic "drawn by hand" box. */
const sketch = "rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[1.5px] border-dashed border-ink/45";

/** A wobbly pen line that stretches to its box. */
function Scribble({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 10" preserveAspectRatio="none" className={cn("overflow-visible", className)}>
      <path
        d="M1 6 C 9 1, 15 9, 24 5 S 40 2, 49 6 S 66 9, 75 4 S 92 3, 99 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Stage 1: the screen as a pencil sketch on dotted paper, with a sticky note. */
export function IdeaStage({ note }: { note: string }) {
  return (
    <div className="absolute inset-0 bg-cream-50 bg-[radial-gradient(circle,rgb(22_24_26/0.14)_1px,transparent_1.2px)] bg-size-[1.1em_1.1em] text-ink/55">
      <div className={cn(slot.nav, "flex -rotate-[0.6deg] items-center gap-[4%]")}>
        <span className={cn(sketch, "aspect-square h-full")} />
        <Scribble className="h-1/2 w-[12%]" />
        <Scribble className="h-1/2 w-[12%]" />
        <span className={cn(sketch, "ml-auto aspect-square h-full rounded-full")} />
      </div>

      <Scribble className={cn(slot.title, "rotate-[0.8deg] text-ink/70")} />
      <Scribble className={cn(slot.sub, "-rotate-[0.5deg]")} />

      {/* Stat card: a crossed placeholder box. */}
      <div className={cn(slot.card, sketch, "-rotate-1")}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          <path
            d="M4 5 L96 95 M96 6 L5 94"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {slot.rows.map((row, i) => (
        <div
          key={row}
          className={cn(row, sketch, "flex items-center gap-[6%] px-[4%]", i === 1 ? "rotate-[0.7deg]" : "-rotate-[0.5deg]")}
        >
          <span className="aspect-square h-[46%] rounded-full border-[1.5px] border-dashed border-ink/45" />
          <Scribble className="h-[40%] w-0 min-w-0 flex-1" />
        </div>
      ))}

      {/* Sticky note with an arrow to the card it is about. */}
      <div className="absolute top-[15%] right-[5%] w-[30%] rotate-3 rounded-[0.2em] bg-accent-soft px-[0.8em] py-[0.7em] text-[0.95em] leading-snug font-medium text-accent italic shadow-soft">
        {note}
      </div>
      <svg viewBox="0 0 60 40" className="absolute top-[27%] left-[48%] w-[13%] text-accent/70">
        <path
          d="M56 4 C 38 4, 22 12, 8 30 M8 30 l1 -10 M8 30 l10 -2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default IdeaStage;
