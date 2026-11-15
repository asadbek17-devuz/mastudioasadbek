"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2 } from "lucide-react";
import Image from "next/image";
import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { ArrowSwap, focusRing } from "@/components/sections/shared/hover";
import { gsap, useScrollFx } from "@/components/sections/shared/scroll-fx";
import { linkTarget } from "@/components/sections/shared/social-icons";
import { format, useT, type LocalizedProject } from "@/lib/i18n";
import { ease } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { addressOf, BrowserFrame, pad } from "./browser-frame";

/*
 * Geometry. The row is a CSS size container, so the two panel widths are known
 * in pure CSS (`cqw`), without measuring. Everything inside a panel is laid
 * out at one of these fixed widths and clipped by the panel while it resizes,
 * which is why no text ever reflows during the transition.
 */
const GROW = 6;
const GAP = 12;
const track = (count: number) => `(100cqw - ${(count - 1) * GAP}px)`;
const activeWidth = (count: number) => `calc(${track(count)} * ${GROW} / ${GROW + count - 1})`;
const slimWidth = (count: number) => `calc(${track(count)} / ${GROW + count - 1})`;

const panelSpring = { type: "spring", stiffness: 210, damping: 30, mass: 0.9 } as const;
const instant = { duration: 0 } as const;

const detailVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.14 } },
  exit: { opacity: 0, transition: { duration: 0.14 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const subscribePointer = (onChange: () => void) => {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
/** True for a mouse or trackpad. False on touch screens and on the server. */
const useFinePointer = () =>
  useSyncExternalStore(
    subscribePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false
  );

/** Round control under the row (previous / next). */
const roundButton =
  "grid size-10 place-items-center rounded-full border border-line bg-cream-50 text-ink transition-colors duration-300 ease-ios hover:border-ink hover:bg-ink hover:text-cream disabled:pointer-events-none disabled:opacity-40";

interface PanelProps {
  project: LocalizedProject;
  index: number;
  count: number;
  active: boolean;
  /** Pointer position over the row, -1..1 on both axes. Drives the frame tilt. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** Mouse parallax and entrance animations are allowed. */
  animated: boolean;
  detailId: string;
  onActivate: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}

function Detail({
  project,
  index,
  count,
  pointerX,
  pointerY,
  animated,
  id,
}: Pick<PanelProps, "project" | "index" | "count" | "pointerX" | "pointerY" | "animated"> & { id: string }) {
  const t = useT();
  const { href } = project;
  const tilt = { stiffness: 120, damping: 18, mass: 0.6 };
  const x = useSpring(useTransform(pointerX, (v) => v * 8), tilt);
  const y = useSpring(useTransform(pointerY, (v) => v * 8), tilt);
  const rotateY = useSpring(useTransform(pointerX, (v) => v * 3), tilt);
  const rotateX = useSpring(useTransform(pointerY, (v) => v * -3), tilt);

  return (
    <motion.div
      id={id}
      variants={detailVariants}
      initial={animated ? "hidden" : false}
      animate="show"
      exit={animated ? "exit" : undefined}
      className="pointer-events-none absolute inset-y-0 left-0 z-20 flex flex-col p-2"
      style={{ width: activeWidth(count) }}
    >
      {/* Mouse-only shortcut: the whole panel opens the project. Keyboard and
          screen-reader users get the real "View project" link below. */}
      {href ? (
        <a
          href={href}
          {...linkTarget(href)}
          aria-hidden="true"
          tabIndex={-1}
          data-bubble-zone=""
          className="pointer-events-auto absolute inset-0"
        />
      ) : null}

      <motion.div
        variants={itemVariants}
        className="relative h-[304px] shrink-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-accent-soft via-cream-100 to-cream-100 [perspective:900px]"
      >
        <div className="absolute top-6 left-6 flex flex-col">
          <span className="font-heading text-[5.5rem] leading-[0.85] font-semibold tracking-tighter text-ink tabular-nums">
            {pad(index)}
          </span>
          <span className="mt-3 text-sm font-medium text-muted tabular-nums">
            / {pad(count - 1)}
          </span>
        </div>
        <span className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-pill border border-ink/10 bg-cream-50/80 px-3 py-1 text-[13px] font-medium text-ink-soft tabular-nums">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {project.year}
        </span>

        <motion.div
          className="absolute top-10 -right-8 w-[70%]"
          style={animated ? { x, y, rotateX, rotateY, rotate: -2 } : { rotate: -2 }}
        >
          <BrowserFrame address={addressOf(project)} className="shadow-[0_30px_60px_-28px_rgb(22_24_26/0.45)]">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="480px"
              className="object-cover"
            />
          </BrowserFrame>
        </motion.div>
      </motion.div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pt-5 pb-3">
        <motion.h3
          variants={itemVariants}
          className="truncate font-heading text-[1.75rem] leading-9 font-semibold tracking-tight text-ink"
        >
          {project.title}
        </motion.h3>
        <motion.p
          variants={itemVariants}
          className="mt-1.5 line-clamp-3 text-[15px] leading-[1.55] text-pretty text-ink-soft"
        >
          {project.description}
        </motion.p>
        <motion.ul
          variants={itemVariants}
          className="mt-3 flex flex-wrap gap-1.5"
          aria-label={t.projects.technologiesAria}
        >
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-pill border border-line bg-cream px-2.5 py-1 text-[13px] font-medium text-ink-soft"
            >
              {tag}
            </li>
          ))}
        </motion.ul>

        <motion.div variants={itemVariants} className="mt-auto flex items-center gap-2 pt-3">
          {href ? (
          <a
            href={href}
            {...linkTarget(href)}
            data-no-bubble
            aria-label={`${t.projects.viewProject}: ${project.title}`}
            className={cn(
              "group pointer-events-auto relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-pill bg-ink pr-4 pl-5 text-[15px] font-medium text-cream transition-colors duration-300 ease-ios hover:bg-accent focus-visible:ring-offset-cream-50",
              focusRing
            )}
          >
            {t.projects.viewProject}
            <ArrowSwap />
          </a>
          ) : null}
          {project.repo ? (
            <a
              href={project.repo}
              {...linkTarget(project.repo)}
              data-no-bubble
              aria-label={`${t.projects.code}: ${project.title}`}
              className={cn(
                "pointer-events-auto relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-pill border border-line bg-cream-50 px-4 text-[15px] font-medium text-ink transition-colors duration-300 ease-ios hover:border-ink focus-visible:ring-offset-cream-50",
                focusRing
              )}
            >
              <Code2 aria-hidden="true" className="size-4" />
              {t.projects.code}
            </a>
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  );
}

function Panel({
  project,
  index,
  count,
  active,
  pointerX,
  pointerY,
  animated,
  detailId,
  onActivate,
  buttonRef,
}: PanelProps) {
  const t = useT();

  return (
    <motion.div
      initial={false}
      animate={{ flexGrow: active ? GROW : 1 }}
      transition={animated ? panelSpring : instant}
      onMouseEnter={onActivate}
      className="relative h-full min-w-0 basis-0"
    >
      {/* GSAP moves this layer on scroll; Framer Motion only sizes the parent. */}
      <div
        data-panel
        className={cn(
          "absolute inset-0 overflow-hidden rounded-[28px] border border-line bg-cream-50 transition-shadow duration-500 ease-ios",
          active ? "shadow-lift" : "shadow-soft"
        )}
      >
        {/* Slim face: screenshot under an ink veil, index, vertical title, year. */}
        <motion.div
          initial={false}
          animate={{ opacity: active ? 0 : 1 }}
          transition={animated ? { duration: active ? 0.3 : 0.5, ease } : instant}
          className="absolute inset-0 bg-ink"
        >
          <div
            aria-hidden="true"
            className="absolute inset-y-0"
            style={{ width: activeWidth(count), left: `calc((${slimWidth(count)} - ${activeWidth(count)}) / 2)` }}
          >
            <Image src={project.image} alt="" fill sizes="640px" className="object-cover" />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/45 to-ink/90"
          />
        </motion.div>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={active}
          aria-controls={detailId}
          data-bubble-zone=""
          aria-label={format(t.projects.itemAria, { n: index + 1, total: count, title: project.title })}
          onFocus={onActivate}
          onClick={onActivate}
          className="absolute inset-0 rounded-[28px] text-cream outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
        >
          <motion.span
            initial={false}
            animate={{ opacity: active ? 0 : 1 }}
            transition={animated ? { duration: active ? 0.2 : 0.5, ease } : instant}
            className="absolute inset-y-0 left-0 flex flex-col items-center justify-between py-6"
            style={{ width: slimWidth(count) }}
          >
            <span className="font-heading text-[2rem] leading-none font-semibold tracking-tight tabular-nums">
              {pad(index)}
            </span>
            <span className="rotate-180 font-heading text-lg font-medium whitespace-nowrap [writing-mode:vertical-rl]">
              {project.title}
            </span>
            <span className="text-[13px] font-medium text-cream/75 tabular-nums">{project.year}</span>
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {active ? (
            <Detail
              key="detail"
              id={detailId}
              project={project}
              index={index}
              count={count}
              pointerX={pointerX}
              pointerY={pointerY}
              animated={animated}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface ShowcaseProps {
  projects: LocalizedProject[];
  className?: string;
}

/**
 * Desktop "expanding showcase": one row of tall panels. The active panel is
 * wide and shows the project in a browser window with its details; the others
 * are slim spines. Hover, focus, the arrow keys, the segments and the
 * previous / next buttons all change the active panel.
 */
export function Showcase({ projects, className }: ShowcaseProps) {
  const t = useT();
  const reduce = useReducedMotion();
  const finePointer = useFinePointer();
  const animated = !reduce;
  const count = projects.length;
  const baseId = useId();

  const [active, setActive] = useState(0);
  // The "View" cursor bubble only makes sense over a project that opens somewhere.
  const withBubble = animated && finePointer && Boolean(projects[active]?.href);
  const [bubble, setBubble] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // Cursor position in px (bubble) and normalized to -1..1 (frame tilt).
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const lag = { stiffness: 260, damping: 26, mass: 0.5 };
  const bubbleX = useSpring(cursorX, lag);
  const bubbleY = useSpring(cursorY, lag);

  const follow = (event: MouseEvent<HTMLDivElement>, jump = false) => {
    const row = rowRef.current;
    if (!row) return;
    const rect = row.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cursorX.set(x);
    cursorY.set(y);
    if (jump) {
      bubbleX.jump(x);
      bubbleY.jump(y);
    }
    pointerX.set((x / rect.width - 0.5) * 2);
    pointerY.set((y / rect.height - 0.5) * 2);
    setBubble(!(event.target as Element).closest("[data-no-bubble]"));
  };
  const leave = () => {
    setBubble(false);
    pointerX.set(0);
    pointerY.set(0);
  };

  const go = (index: number, focus = false) => {
    const next = Math.min(count - 1, Math.max(0, index));
    setActive(next);
    if (focus) buttons.current[next]?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target =
      event.key === "ArrowRight"
        ? active + 1
        : event.key === "ArrowLeft"
          ? active - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? count - 1
              : null;
    if (target === null) return;
    event.preventDefault();
    go(target, true);
  };

  // Panels rise one after another as the row scrolls in (desktop only).
  useScrollFx(rootRef, ({ isDesktop }) => {
    const row = rowRef.current;
    if (!isDesktop || !row) return;
    gsap.fromTo(
      gsap.utils.toArray<HTMLElement>("[data-panel]", row),
      { y: (i: number) => 48 + i * 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: row,
          start: "clamp(top 96%)",
          end: "clamp(top 58%)",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  if (!count) return null;

  return (
    <div ref={rootRef} className={className}>
      <div className="relative">
        <div
          ref={rowRef}
          role="group"
          aria-label={t.projects.showcaseAria}
          onKeyDown={onKeyDown}
          onMouseEnter={(event) => follow(event, true)}
          onMouseMove={(event) => follow(event)}
          onMouseLeave={leave}
          className={cn("@container flex h-[560px]", withBubble && "cursor-none [&_[data-bubble-zone]]:cursor-none")}
          style={{ gap: GAP }}
        >
          {projects.map((project, i) => (
            <Panel
              key={project.slug}
              project={project}
              index={i}
              count={count}
              active={i === active}
              pointerX={pointerX}
              pointerY={pointerY}
              animated={animated}
              detailId={`${baseId}-detail-${i}`}
              onActivate={() => setActive(i)}
              buttonRef={(el) => {
                buttons.current[i] = el;
              }}
            />
          ))}
        </div>

        {/* Cursor bubble. Mouse only, never with reduced motion, never clickable. */}
        {withBubble ? (
          <div aria-hidden="true" className="pointer-events-none absolute -inset-x-6 -inset-y-9 z-30 overflow-hidden">
            <motion.div className="absolute top-9 left-6" style={{ x: bubbleX, y: bubbleY }}>
              <motion.div
                initial={false}
                animate={{ scale: bubble ? 1 : 0, opacity: bubble ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.6 }}
                className="-mt-9 -ml-9 flex size-[72px] flex-col items-center justify-center gap-0.5 rounded-full bg-ink text-cream shadow-lift"
              >
                <ArrowUpRight className="size-4" />
                <span className="text-[13px] leading-none font-medium">{t.projects.cursor}</span>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </div>

      {/* Index strip: counter, one segment per project, previous / next. */}
      <div className="mt-6 flex items-center gap-6">
        <p className="font-heading text-sm font-semibold text-ink tabular-nums">
          {pad(active)} <span className="font-medium text-muted">/ {pad(count - 1)}</span>
        </p>
        <div className="flex flex-1 items-center gap-1.5">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              aria-current={i === active ? "true" : undefined}
              aria-label={format(t.projects.itemAria, { n: i + 1, total: count, title: project.title })}
              onClick={() => go(i)}
              className={cn(
                "group flex h-8 items-center rounded-full transition-[flex-grow] duration-500 ease-ios motion-reduce:transition-none",
                i === active ? "grow-[3]" : "grow",
                "basis-0",
                focusRing
              )}
            >
              <span
                className={cn(
                  "h-[3px] w-full rounded-full transition-colors duration-300 ease-ios",
                  i === active ? "bg-accent" : "bg-line group-hover:bg-ink/30"
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t.projects.previous}
            disabled={active === 0}
            onClick={() => go(active - 1)}
            className={cn(roundButton, focusRing)}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            aria-label={t.projects.next}
            disabled={active === count - 1}
            onClick={() => go(active + 1)}
            className={cn(roundButton, focusRing)}
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Showcase;
