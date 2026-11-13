import { LogoMark } from "@/components/ui/logo";

/**
 * The "//" mark as a large, quiet graphic cropped by the card's corner. It
 * drifts a few pixels against the cursor: the card sets --mx / --my (-1..1)
 * on pointer move, and they stay 0 for touch and reduced motion.
 */
export function BackdropMark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-10 -bottom-16 -z-10 transition-transform duration-700 ease-ios [transform:translate3d(calc(var(--mx,0)*-14px),calc(var(--my,0)*-10px),0)] motion-reduce:transform-none motion-reduce:transition-none sm:-right-6 sm:-bottom-24"
    >
      <LogoMark className="h-56 w-auto text-accent/50 sm:h-80 lg:h-96" />
    </div>
  );
}

export default BackdropMark;
