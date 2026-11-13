"use client";

import { motion } from "framer-motion";
import { Panel } from "@/components/sections/story-parts/panel";
import { rise } from "@/components/sections/story-parts/scene";
import { Typed } from "@/components/sections/story-parts/typed";

export interface VisualProps {
  /** The chapter is on screen: typing and other one-shot effects may start. */
  active: boolean;
  reduce: boolean;
}

const prompt = { text: "$ ", className: "text-sage" };

/** Chapter 1: the first line of HTML being typed, and what it renders. */
export function StartVisual({ active, reduce, hello }: VisualProps & { hello: string }) {
  return (
    <Panel title="index.html">
      <p>
        <span className="mr-3 text-cream-50/30 select-none">1</span>
        <Typed
          key={String(active)}
          run={active}
          instant={reduce}
          segments={[
            { text: "<h1>", className: "text-sage" },
            { text: hello },
            { text: "</h1>", className: "text-sage" },
          ]}
        />
      </p>
      <motion.p
        variants={rise(2.1)}
        className="mt-3 border-t border-dashed border-cream-50/15 pt-3 font-heading text-3xl font-semibold tracking-tight text-cream-50 sm:text-4xl"
      >
        {hello}
      </motion.p>
    </Panel>
  );
}

/** Chapter 3: a new branch for a new team. */
export function NaviVisual({ active, reduce }: VisualProps) {
  return (
    <Panel title="~/navi-global">
      <p>
        <Typed
          key={String(active)}
          run={active}
          instant={reduce}
          stepMs={55}
          segments={[prompt, { text: "git checkout -b navi-global" }]}
        />
      </p>
      <motion.p variants={rise(2.4)} className="mt-1 text-cream-50/55">
        Switched to a new branch <span className="text-sage">&apos;navi-global&apos;</span>
      </motion.p>
    </Panel>
  );
}

/** Chapter 6: who he is today, as chips and one terminal answer. */
export function TodayVisual({ active, reduce, chips }: VisualProps & { chips: readonly string[] }) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <motion.li
            key={chip}
            variants={rise(0.5 + i * 0.12)}
            className="rounded-full border border-cream-50/15 bg-cream-50/[0.06] px-3 py-1 text-[13px] font-medium text-cream-50 first:border-sage/50 first:bg-sage/15 sm:text-sm"
          >
            {chip}
          </motion.li>
        ))}
      </ul>
      <Panel title="asadbek@tashkent">
        <p>
          <Typed
            key={String(active)}
            run={active}
            instant={reduce}
            delayMs={900}
            segments={[prompt, { text: "uname -s" }]}
          />
        </p>
        <motion.p variants={rise(2)} className="mt-1 text-sage">
          Linux
        </motion.p>
      </Panel>
    </div>
  );
}
