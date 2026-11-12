"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Classes for a direct child of `SnapCarousel`. Below 640px the card takes most
 * of the row, so the next one peeks in; from 640px up they do nothing.
 */
export const snapItem =
  "max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start max-sm:min-[430px]:w-[70%]";

interface SnapCarouselProps {
  children: ReactNode;
  /** Extra classes for the outer wrapper (it is `display: contents` from 640px up). */
  className?: string;
}

/**
 * Phones only: a native horizontal scroll-snap row with dot indicators.
 * From 640px up both wrappers become `display: contents`, so the children take
 * part in the parent grid exactly as if this component was not there.
 *
 * - Native overflow scrolling gives the iOS momentum, no JS drives the motion.
 * - The row bleeds to the screen edges (`-mx-4 px-4`), so cards slide under the
 *   edge instead of being cut at the page gutter. The page itself never scrolls
 *   sideways.
 * - `touch-action: pan-x pan-y` keeps vertical page scrolling alive when the
 *   swipe starts on a card.
 */
export function SnapCarousel({ children, className }: SnapCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const items = Array.from(el.children) as HTMLElement[];
      if (!items.length) return;
      // At the very end the last card cannot reach the snap line: count it as active.
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
        setActive(items.length - 1);
        return;
      }
      const origin = items[0].offsetLeft;
      let nearest = 0;
      let best = Infinity;
      items.forEach((item, i) => {
        const distance = Math.abs(item.offsetLeft - origin - el.scrollLeft);
        if (distance < best) {
          best = distance;
          nearest = i;
        }
      });
      setActive(nearest);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={cn("min-w-0 sm:contents", className)}>
      <div
        ref={ref}
        data-carousel
        className="-mx-4 -my-4 flex touch-pan-x touch-pan-y snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 py-4 [scrollbar-width:none] sm:contents [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {count > 1 ? (
        <div aria-hidden="true" className="mt-4 flex items-center justify-center gap-1.5 sm:hidden">
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-ios",
                i === active ? "w-5 bg-ink" : "w-1.5 bg-ink/20"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SnapCarousel;
