import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Focus ring for controls sitting on the cream page background. */
export const focusRing =
  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:outline-none";

/**
 * Shared hoverable card surface: soft shadow that lifts, border that darkens a
 * touch, press feedback. Pair with `motion.*` + `whileHover={cardHover}`
 * (lib/motion) for the -3px spring lift and `whileTap={cardTap}` for press, and `group` for children.
 */
export const cardSurface =
  "group rounded-card border border-line bg-cream-50 shadow-soft transition-[box-shadow,border-color] duration-300 ease-ios hover:border-ink/15 hover:shadow-lift";

/** Same surface for a card that is not a link: no hover lift, no `group` effects. */
export const cardStatic = "rounded-card border border-line bg-cream-50 shadow-soft";

/**
 * "↗" that slides out to the top-right and back in from the bottom-left on
 * `group` hover. Clipped, so only one arrow is ever visible. Never rotates.
 */
export function ArrowSwap({ className }: { className?: string }) {
  const move = "transition-transform duration-[450ms] ease-ios motion-reduce:transition-none";
  return (
    <span aria-hidden="true" className={cn("relative inline-flex size-4 shrink-0 overflow-hidden", className)}>
      <ArrowUpRight
        className={cn(move, "size-full group-hover:translate-x-full group-hover:-translate-y-full")}
      />
      <ArrowUpRight
        className={cn(
          move,
          "absolute inset-0 size-full -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0"
        )}
      />
    </span>
  );
}

/** Round arrow button used on every card: fills ink on `group` hover. */
export function ArrowButton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full border border-line bg-cream text-ink transition-colors duration-300 ease-ios group-hover:border-ink group-hover:bg-ink group-hover:text-cream sm:size-10",
        className
      )}
    >
      <ArrowSwap />
    </span>
  );
}
