import { motion, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

const kw = "text-sage";
const tag = "text-accent-soft";
const str = "text-[#e6c98f]";
const dim = "text-cream-50/45";

/** The component being written. Indent is in `ch`. */
const lines: { indent: number; code: ReactNode }[] = [
  { indent: 0, code: <><span className={kw}>export function</span> StatCard{"({ value })"} {"{"}</> },
  { indent: 2, code: <><span className={kw}>return</span> (</> },
  { indent: 4, code: <><span className={tag}>{"<Card"}</span> tone=<span className={str}>&quot;accent&quot;</span><span className={tag}>{">"}</span></> },
  { indent: 6, code: <><span className={tag}>{"<Label>"}</span>Shipped<span className={tag}>{"</Label>"}</span></> },
  { indent: 6, code: <><span className={tag}>{"<CountUp"}</span> to={"{value}"} <span className={tag}>{"/>"}</span></> },
  { indent: 6, code: <><span className={tag}>{"<Sparkline"}</span> data={"{week}"} <span className={tag}>{"/>"}</span></> },
  { indent: 4, code: <span className={tag}>{"</Card>"}</span> },
  { indent: 2, code: <>);</> },
  { indent: 0, code: <>{"}"}</> },
];

/** One line of code hidden by a cover that retreats to the right, as if typed. */
function Line({ typed, index, indent, children }: { typed: MotionValue<number>; index: number; indent: number; children: ReactNode }) {
  const start = index / lines.length;
  const scaleX = useTransform(typed, [start, start + 1 / lines.length], [1, 0], { clamp: true });
  return (
    <div className="relative flex gap-[1.2em] whitespace-pre">
      <span className={`w-[1.2em] shrink-0 text-right ${dim}`}>{index + 1}</span>
      <span style={{ paddingLeft: `${indent}ch` }}>{children}</span>
      <motion.span style={{ scaleX }} className="absolute inset-y-0 right-0 left-[2.2em] origin-right bg-ink" />
    </div>
  );
}

interface CodePanelProps {
  /** 0 -> 1: the panel slides in from the right edge. */
  open: MotionValue<number>;
  /** 0 -> 1: how much of the file has been typed. */
  typed: MotionValue<number>;
}

/** Stage 3: a dark editor that slides over the right half of the wireframe. */
export function CodePanel({ open, typed }: CodePanelProps) {
  const x = useTransform(open, (v) => `${(1 - v) * 104}%`);
  return (
    <motion.div
      style={{ x }}
      className="absolute inset-y-0 right-0 flex w-[51%] flex-col overflow-hidden rounded-l-[0.9em] bg-ink text-cream-50 shadow-lift will-change-transform"
    >
      <div className="flex h-[11%] shrink-0 items-center gap-[0.6em] border-b border-cream-50/10 px-[1em] text-[0.8em]">
        <span className="size-[0.55em] rounded-full bg-sage" />
        <span className="text-cream-50/80">stat-card.tsx</span>
        <span className={`ml-auto ${dim}`}>TSX</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-[0.35em] px-[0.9em] font-mono text-[0.8em] leading-normal">
        {lines.map((line, i) => (
          <Line key={i} typed={typed} index={i} indent={line.indent}>
            {line.code}
          </Line>
        ))}
      </div>
    </motion.div>
  );
}

export default CodePanel;
