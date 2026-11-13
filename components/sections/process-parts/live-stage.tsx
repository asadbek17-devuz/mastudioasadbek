import { animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { bars, rowValues, slot } from "@/components/sections/process-parts/stages";
import type { Dictionary } from "@/lib/i18n";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SHIPPED = 1284;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Counts up when the live stage is reached, then keeps ticking like a real metric. */
function ShippedCount({ active, reduce }: { active: boolean; reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active || reduce) {
      if (el) el.textContent = fmt(SHIPPED);
      return;
    }
    let value = SHIPPED;
    let timer: ReturnType<typeof setInterval> | undefined;
    const intro = animate(SHIPPED - 240, SHIPPED, {
      duration: 1.4,
      ease,
      onUpdate: (v) => (el.textContent = fmt(v)),
      onComplete: () => {
        timer = setInterval(() => {
          value += 1;
          el.textContent = fmt(value);
        }, 1600);
      },
    });
    return () => {
      intro.stop();
      clearInterval(timer);
    };
  }, [active, reduce]);

  return <span ref={ref}>{fmt(SHIPPED)}</span>;
}

interface LiveStageProps {
  text: Dictionary["process"]["mock"];
  active: boolean;
  reduce: boolean;
}

/** Stage 4: the finished screen in the site's own cream and green. */
export function LiveStage({ text, active, reduce }: LiveStageProps) {
  return (
    <div className="absolute inset-0 bg-cream">
      <div className={cn(slot.nav, "flex items-center gap-[4%] text-[0.85em] text-ink-soft")}>
        <span className="grid aspect-square h-full place-items-center rounded-[0.5em] bg-accent">
          <span className="size-[35%] rounded-full bg-cream-50" />
        </span>
        <span className="font-medium text-ink">{text.nav[0]}</span>
        <span>{text.nav[1]}</span>
        <span className="ml-auto aspect-square h-full rounded-full border border-line bg-sage" />
      </div>

      <p className={cn(slot.title, "flex w-[60%] items-center font-heading text-[1.75em] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap text-ink")}>
        {text.greeting}
      </p>
      <p className={cn(slot.sub, "flex w-[60%] items-center text-[0.85em] whitespace-nowrap text-muted")}>{text.sub}</p>

      <div className={cn(slot.card, "flex flex-col overflow-hidden rounded-[1em] bg-accent p-[7%] text-cream-50 shadow-lift")}>
        <div className="flex items-center justify-between gap-[0.5em] text-[0.8em]">
          <span className="truncate text-cream-50/75">{text.metric}</span>
          <span className="inline-flex shrink-0 items-center gap-[0.4em] rounded-full bg-cream-50/10 px-[0.6em] py-[0.15em]">
            <span className="size-[0.45em] animate-pulse rounded-full bg-sage" />
            {text.live}
          </span>
        </div>
        <p className="mt-[5%] font-heading text-[2.6em] leading-none font-bold tracking-tight tabular-nums">
          <ShippedCount active={active} reduce={reduce} />
        </p>
        <div className="mt-auto flex h-[38%] items-end gap-[4%]">
          {bars.map((h, i) => (
            <span
              key={i}
              className={cn("flex-1 rounded-[0.2em]", i === bars.length - 1 ? "bg-cream-50" : "bg-sage/60")}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {slot.rows.map((row, i) => (
        <div
          key={row}
          className={cn(row, "flex items-center gap-[5%] rounded-[0.8em] border border-line bg-cream-50 px-[4%] text-[0.85em] shadow-soft")}
        >
          <span className="grid aspect-square h-[46%] shrink-0 place-items-center rounded-full bg-accent-soft">
            <span className="size-[35%] rounded-full bg-accent" />
          </span>
          <span className="truncate text-ink-soft">{text.rows[i]}</span>
          <span className="ml-auto font-medium text-ink tabular-nums">{rowValues[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default LiveStage;
