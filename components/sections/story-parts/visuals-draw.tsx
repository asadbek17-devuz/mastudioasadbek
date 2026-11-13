"use client";

import { motion, type Variants } from "framer-motion";
import { rise } from "@/components/sections/story-parts/scene";
import { ease } from "@/lib/motion";

const pop = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0.4, transition: { duration: 0.2 } },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease, delay } },
});

const grow = (delay: number, duration = 0.9): Variants => ({
  hidden: { scaleX: 0, transition: { duration: 0.2 } },
  show: { scaleX: 1, transition: { duration, ease, delay } },
});

const stroke = (delay: number, duration = 0.9): Variants => ({
  hidden: { pathLength: 0, opacity: 0, transition: { duration: 0.2 } },
  show: { pathLength: 1, opacity: 1, transition: { duration, ease, delay } },
});

const commits = [0, 1, 2, 3, 4];

/** Chapter 2: a commit history that ends on the first real role. */
export function CommitsVisual({ from, to }: { from: string; to: string }) {
  return (
    <div className="w-full max-w-sm">
      <div className="relative flex h-6 items-center justify-between">
        <motion.span variants={grow(0.4, 1.4)} className="absolute inset-x-1 h-px origin-left bg-cream-50/30" />
        {commits.map((i) => {
          const last = i === commits.length - 1;
          return (
            <motion.span
              key={i}
              variants={pop(0.5 + i * 0.28)}
              className={
                last
                  ? "relative size-4 rounded-full bg-sage ring-4 ring-sage/25"
                  : "relative size-2.5 rounded-full border border-cream-50/50 bg-ink"
              }
            />
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-[13px] font-medium sm:text-sm">
        <motion.span variants={rise(0.5)} className="text-cream-50/55">
          {from}
        </motion.span>
        <motion.span variants={rise(1.7)} className="text-sage">
          {to}
        </motion.span>
      </div>
      <motion.p variants={rise(2)} className="mt-4 font-mono text-[12px] text-cream-50/55 sm:text-[13px]">
        <span className="text-sage">$</span> git commit -m &quot;Mars IT School&quot;
      </motion.p>
    </div>
  );
}

const fill: Variants = {
  hidden: { fillOpacity: 0, transition: { duration: 0.2 } },
  show: { fillOpacity: 1, transition: { duration: 0.6, ease, delay: 1.5 } },
};

/** Chapter 4: the studio's "//" mark, outlined bar by bar and then filled. */
export function StudioVisual({ name, address }: { name: string; address: string }) {
  const bars = ["395,232 529,232 414,632 280,632", "585,232 719,232 604,632 470,632"];
  return (
    <div className="flex w-full max-w-sm items-center gap-5 sm:flex-col sm:items-start sm:gap-6">
      <svg viewBox="270 222 460 420" className="h-24 w-auto shrink-0 sm:h-44 lg:h-52" fill="currentColor">
        {bars.map((points, i) => (
          <motion.g key={points} variants={fill} className="text-sage">
            <motion.polygon
              points={points}
              variants={stroke(0.4 + i * 0.35, 1.1)}
              stroke="currentColor"
              strokeWidth={6}
              strokeLinejoin="round"
            />
          </motion.g>
        ))}
      </svg>
      <motion.div variants={rise(1.7)} className="min-w-0">
        <p className="font-heading text-xl font-semibold tracking-tight text-cream-50 sm:text-2xl">{name}</p>
        <p className="mt-0.5 font-mono text-[12px] text-cream-50/55 sm:text-[13px]">{address}</p>
      </motion.div>
    </div>
  );
}

const node =
  "rounded-full border px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm";

/** Chapter 5: knowledge goes from mentor to student, and a chalk line comes back under it. */
export function TeachingVisual({ mentor, student }: { mentor: string; student: string }) {
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-2.5">
        <motion.span variants={pop(0.4)} className={`${node} border-sage/50 bg-sage/15 text-cream-50`}>
          {mentor}
        </motion.span>
        <span className="relative flex h-3 min-w-6 flex-1 items-center">
          <motion.span variants={grow(0.8, 0.8)} className="h-px w-full origin-left bg-cream-50/50" />
          <motion.span
            variants={rise(1.5)}
            className="absolute right-0 size-2 rotate-45 border-t border-r border-cream-50/60"
          />
        </span>
        <motion.span variants={pop(1.5)} className={`${node} border-cream-50/20 bg-cream-50/[0.06] text-cream-50`}>
          {student}
        </motion.span>
      </div>
      <svg viewBox="0 0 320 28" fill="none" className="mt-3 h-6 w-full text-sage sm:mt-4 sm:h-7">
        <motion.path
          variants={stroke(1.9, 1.1)}
          d="M316 8 C 250 2, 200 20, 150 12 S 60 4, 6 16"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <motion.path
          variants={stroke(2.8, 0.3)}
          d="M16 8 L5 16 L18 22"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
