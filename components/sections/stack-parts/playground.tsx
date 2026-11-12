"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CodeXml,
  Layers,
  MousePointer2,
  Palette,
  Pointer,
  RotateCcw,
  Server,
  Vibrate,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrubScale } from "@/components/sections/shared/scroll-fx";
import { createPile, type Pile } from "@/components/sections/stack-parts/pile";
import type { SkillLevel, StackCategoryId } from "@/lib/data";
import { format, useData, useT } from "@/lib/i18n";
import { ease, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MatterLib = typeof import("matter-js");
type Filter = "all" | StackCategoryId;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const categoryIcon: Record<StackCategoryId, LucideIcon> = {
  frontend: CodeXml,
  backend: Server,
  tools: Wrench,
  design: Palette,
};

/** Solid fills only: pills overlap while they fly, so nothing may be see-through. */
const tone: Record<StackCategoryId, { fill: string; outline: string; swatch: string }> = {
  frontend: {
    fill: "bg-accent text-cream-50",
    outline: "border-accent text-accent",
    swatch: "bg-accent",
  },
  backend: {
    fill: "bg-ink text-cream",
    outline: "border-ink text-ink",
    swatch: "bg-ink",
  },
  tools: {
    fill: "bg-accent-2 text-cream-50",
    outline: "border-accent-2 text-accent-2",
    swatch: "bg-accent-2",
  },
  design: {
    fill: "bg-[color-mix(in_srgb,var(--color-sage)_60%,var(--color-cream-50))] text-ink",
    outline: "border-sage text-ink",
    swatch: "bg-[color-mix(in_srgb,var(--color-sage)_60%,var(--color-cream-50))]",
  },
};

const levelOrder: SkillLevel[] = ["Expert", "Advanced", "Comfortable", "Learning"];

/** Level mark, drawn in the pill's own text color. */
function LevelMark({ level, className }: { level?: SkillLevel; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-2 shrink-0 rounded-full",
        level === "Expert" && "bg-current ring-2 ring-current/35",
        level === "Advanced" && "bg-current",
        level === "Comfortable" && "border-[1.5px] border-current",
        level === "Learning" && "border-[1.5px] border-dashed border-current",
        !level && "bg-current opacity-50",
        className
      )}
    />
  );
}

const iconButton =
  "group/btn relative grid size-11 place-items-center rounded-full border border-line bg-cream-50 text-ink-soft shadow-soft transition-[color,border-color,scale,box-shadow] duration-200 ease-ios hover:border-ink/20 hover:text-ink hover:shadow-lift active:scale-92 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-10";

const tooltip =
  "pointer-events-none absolute top-full right-0 mt-2 hidden rounded-lg bg-ink px-2.5 py-1 text-xs font-medium whitespace-nowrap text-cream opacity-0 transition-opacity duration-150 group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 [@media(hover:hover)]:block";

export function StackPlayground() {
  const t = useT();
  const p = t.stack.playground;
  const { stack } = useData();
  const reduce = useReducedMotion();

  const [filter, setFilter] = useState<Filter>("all");
  const [matter, setMatter] = useState<MatterLib | null>(null);
  const [touched, setTouched] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const pileRef = useRef<Pile | null>(null);

  const physics = matter !== null && !reduce;
  const total = stack.reduce((sum, c) => sum + c.items.length, 0);

  // Load matter-js only when the arena is about to scroll into view.
  useEffect(() => {
    const card = cardRef.current;
    if (reduce !== false || !card) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("matter-js")
          .then((mod) => {
            if (!cancelled) setMatter(() => (mod.default ?? mod) as MatterLib);
          })
          .catch(() => undefined); // Offline or blocked: the static layout stays.
      },
      { rootMargin: "700px 0px" }
    );
    observer.observe(card);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [reduce]);

  const onInteract = useCallback(() => setTouched(true), []);

  // Runs before paint, right after the pills switch to absolute positioning,
  // so the static layout is never seen collapsing into the corner.
  useIsoLayoutEffect(() => {
    const arena = arenaRef.current;
    if (!physics || !matter || !arena) return;
    const pile = createPile(matter, arena, onInteract);
    pileRef.current = pile;
    return () => {
      pile.destroy();
      pileRef.current = null;
    };
  }, [physics, matter, onInteract]);

  const select = (next: Filter, target: HTMLElement) => {
    setFilter(next);
    setTouched(true);
    target.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    if (next !== "all") pileRef.current?.lift(next);
  };

  const filters: { id: Filter; label: string; icon: LucideIcon; count: number }[] = [
    { id: "all", label: p.all, icon: Layers, count: total },
    ...stack.map((c) => ({
      id: c.id as Filter,
      label: c.title,
      icon: categoryIcon[c.id],
      count: c.items.length,
    })),
  ];
  const active = stack.find((c) => c.id === filter);
  const info = active
    ? { count: active.items.length, text: active.description }
    : { count: total, text: p.allInfo };

  return (
    <div className="mt-8 sm:mt-12">
      {/* Filters + info line */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div
            role="group"
            aria-label={p.filterAria}
            className="inline-flex gap-1 rounded-pill border border-line bg-cream-100/70 p-1"
          >
            {filters.map(({ id, label, icon: Icon, count }) => {
              const on = filter === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={(e) => select(id, e.currentTarget)}
                  className={cn(
                    "relative inline-flex h-11 shrink-0 items-center gap-2 rounded-pill px-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-ios focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-10 sm:px-4",
                    on ? "text-cream-50" : "text-ink-soft hover:text-ink"
                  )}
                >
                  {on ? (
                    <motion.span
                      layoutId="stack-filter-pill"
                      transition={reduce ? { duration: 0 } : spring}
                      className="absolute inset-0 rounded-pill bg-ink shadow-soft"
                    />
                  ) : null}
                  <Icon className="relative size-4" aria-hidden="true" />
                  <span className="relative">{label}</span>
                  <span
                    className={cn(
                      "relative grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums transition-colors duration-200",
                      on ? "bg-cream-50/15 text-cream-50" : "bg-ink/6 text-muted"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div aria-live="polite" className="min-h-10 sm:min-h-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={filter}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease }}
              className="text-sm leading-5 text-pretty text-ink-soft sm:text-[15px] sm:leading-6"
            >
              <span className="font-semibold text-ink">{format(p.toolCount, { count: info.count })}</span>
              <span aria-hidden="true" className="mx-2 text-line">
                /
              </span>
              {info.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Arena */}
      <div className="mt-4 sm:mt-5">
        <ScrubScale from={0.97}>
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-card border border-line bg-cream-50 shadow-soft"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1.5px)] bg-size-[20px_20px] opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            />

            <div
              ref={arenaRef}
              aria-hidden="true"
              data-physics={physics ? "" : undefined}
              className={cn(
                "relative flex min-h-[440px] flex-wrap content-center justify-center gap-1.5 px-3 pt-16 pb-5 sm:min-h-[430px] sm:flex-col sm:flex-nowrap sm:content-normal sm:items-center sm:gap-3.5 sm:px-8 sm:pb-8",
                physics && "h-[440px] touch-pan-y select-none sm:h-[430px]"
              )}
            >
              {stack.map((category) => (
                <div
                  key={category.id}
                  className="contents sm:flex sm:max-w-3xl sm:flex-wrap sm:justify-center sm:gap-2"
                >
                  {category.items.map((item, i) => {
                    const dim = filter !== "all" && filter !== category.id;
                    const picked = filter === category.id;
                    const learning = item.level === "Learning";
                    return (
                      <span
                        key={i}
                        data-pill={`${category.id}-${i}`}
                        data-cat={category.id}
                        className={cn(
                          "block w-max",
                          physics && "absolute top-0 left-0 cursor-grab will-change-transform",
                          picked && "z-10"
                        )}
                      >
                        <span
                          className={cn(
                            "flex items-center gap-1.5 rounded-pill font-sans font-medium whitespace-nowrap transition-[opacity,filter,scale,box-shadow] duration-300 ease-ios sm:gap-2 [[data-flip]>&]:rotate-180",
                            item.level === "Expert"
                              ? "h-9 px-3.5 text-sm sm:h-10 sm:px-4 sm:text-[15px] lg:h-11 lg:px-5"
                              : "h-8 px-3 text-[13px] sm:h-9 sm:px-3.5 sm:text-sm lg:h-10 lg:px-4.5",
                            learning
                              ? cn("border-[1.5px] border-dashed bg-cream-50", tone[category.id].outline)
                              : tone[category.id].fill,
                            dim && "opacity-35 grayscale",
                            picked && "scale-105 shadow-lift",
                            !dim && !picked && physics && "hover:scale-[1.06] hover:shadow-lift"
                          )}
                        >
                          <LevelMark level={item.level} />
                          {item.name}
                        </span>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            {physics ? (
              <>
                <div className="absolute top-3 right-3 z-20 flex gap-2 sm:top-4 sm:right-4">
                  <button
                    type="button"
                    aria-label={p.shake}
                    onClick={() => pileRef.current?.shake()}
                    className={iconButton}
                  >
                    <Vibrate className="size-[18px]" aria-hidden="true" />
                    <span aria-hidden="true" className={tooltip}>
                      {p.shake}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={p.reset}
                    onClick={() => pileRef.current?.drop()}
                    className={iconButton}
                  >
                    <RotateCcw className="size-[18px]" aria-hidden="true" />
                    <span aria-hidden="true" className={tooltip}>
                      {p.reset}
                    </span>
                  </button>
                </div>

                <p
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute bottom-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-pill border border-line bg-cream-50/95 px-3 py-1.5 text-[13px] font-medium text-muted shadow-soft transition-opacity duration-500 ease-ios sm:bottom-4 sm:left-4",
                    touched && "opacity-0"
                  )}
                >
                  <MousePointer2 className="size-3.5 [@media(hover:none)]:hidden" />
                  <span className="[@media(hover:none)]:hidden">{p.hintPointer}</span>
                  <Pointer className="hidden size-3.5 [@media(hover:none)]:block" />
                  <span className="hidden [@media(hover:none)]:inline">{p.hintTouch}</span>
                </p>
              </>
            ) : null}
          </div>
        </ScrubScale>
      </div>

      {/* Screen readers and crawlers get the same content as a plain list. */}
      <div className="sr-only">
        <ul aria-label={p.listAria}>
          {stack.map((category) => (
            <li key={category.id}>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <ul>
                {category.items.map((item, i) => (
                  <li key={i}>
                    {item.name}
                    {item.levelLabel ? `, ${item.levelLabel}` : null}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Legend */}
      <div
        className="mt-4 flex flex-col gap-x-8 gap-y-2.5 text-[13px] font-medium text-muted sm:mt-5 lg:flex-row lg:items-center lg:justify-between"
      >
        <ul aria-label={p.legendCategories} className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {stack.map((category) => (
            <li key={category.id} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2.5 w-4 rounded-full", tone[category.id].swatch)} />
              {category.title}
            </li>
          ))}
        </ul>
        <ul aria-label={p.legendLevels} className="flex flex-wrap items-center gap-x-4 gap-y-2 text-ink-soft">
          {levelOrder.map((level) => (
            <li key={level} className="inline-flex items-center gap-1.5">
              {level === "Learning" ? (
                <span className="h-2.5 w-4 rounded-full border-[1.5px] border-dashed border-current" />
              ) : (
                <LevelMark level={level} />
              )}
              <span className="text-muted">{t.stack.levels[level]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StackPlayground;
