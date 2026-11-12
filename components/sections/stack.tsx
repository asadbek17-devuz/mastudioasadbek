"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { StackPlayground } from "@/components/sections/stack-parts/playground";
import { useT } from "@/lib/i18n";

/**
 * Tools & Stack as a playground: every tool is a pill in a physics pile that
 * can be dragged, thrown, shaken and filtered by category.
 */
export function Stack() {
  const t = useT();

  return (
    <section id="stack" className="overflow-x-clip py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading {...t.stack.heading} />
        <StackPlayground />
      </div>
    </section>
  );
}

export default Stack;
