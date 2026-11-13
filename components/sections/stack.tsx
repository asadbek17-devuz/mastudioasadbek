"use client";

import dynamic from "next/dynamic";

import { SectionHeading } from "@/components/ui/section-heading";
import { useT } from "@/lib/i18n";

/** Below the fold: its own chunk, still prerendered on the server (the tool list stays in the HTML). */
const StackPlayground = dynamic(() =>
  import("@/components/sections/stack-parts/playground").then((m) => m.StackPlayground),
);

/**
 * Tools & Stack as a playground: every tool is a pill in a physics pile that
 * can be dragged, thrown, shaken and filtered by category.
 */
export function Stack() {
  const t = useT();

  return (
    <section id="stack" aria-labelledby="stack-heading" className="overflow-x-clip py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading id="stack-heading" {...t.stack.heading} />
        <StackPlayground />
      </div>
    </section>
  );
}

export default Stack;
