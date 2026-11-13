import { motion, type MotionValue } from "framer-motion";
import { bars, slot } from "@/components/sections/process-parts/stages";
import { cn } from "@/lib/utils";

const block = "rounded-[0.5em] bg-ink/10";
const frame = "rounded-[0.7em] border border-ink/15 bg-cream-50";

interface WireStageProps {
  /** 0 -> 1 while the code panel is open: outlines the block being built. */
  focus: MotionValue<number>;
}

/** Stage 2: the same screen as a clean grey wireframe. */
export function WireStage({ focus }: WireStageProps) {
  return (
    <div className="absolute inset-0 bg-cream-100">
      <div className={cn(slot.nav, "flex items-center gap-[4%]")}>
        <span className={cn(block, "aspect-square h-full")} />
        <span className="h-[30%] w-[12%] rounded-full bg-ink/15" />
        <span className="h-[30%] w-[12%] rounded-full bg-ink/15" />
        <span className="ml-auto aspect-square h-full rounded-full bg-ink/10" />
      </div>

      <span className={cn(slot.title, "rounded-[0.4em] bg-ink/20")} />
      <span className={cn(slot.sub, "rounded-full bg-ink/10")} />

      <div className={cn(slot.card, frame, "flex flex-col gap-[6%] p-[7%]")}>
        <span className="h-[7%] w-[45%] rounded-full bg-ink/15" />
        <span className="h-[20%] w-[70%] rounded-[0.4em] bg-ink/20" />
        <div className="mt-auto flex h-[38%] items-end gap-[4%]">
          {bars.map((h, i) => (
            <span key={i} className="flex-1 rounded-[0.2em] bg-ink/10" style={{ height: `${h}%` }} />
          ))}
        </div>
        <motion.span
          style={{ opacity: focus }}
          className="absolute -inset-[0.35em] rounded-[1em] border-[1.5px] border-accent"
        >
          <span className="absolute -top-[1.1em] left-[0.6em] rounded-[0.4em] bg-accent px-[0.5em] py-[0.1em] font-mono text-[0.75em] leading-normal text-cream-50">
            {"<StatCard />"}
          </span>
        </motion.span>
      </div>

      {slot.rows.map((row) => (
        <div key={row} className={cn(row, frame, "flex items-center gap-[6%] px-[4%]")}>
          <span className="aspect-square h-[46%] rounded-full bg-ink/10" />
          <span className="h-[18%] w-[42%] rounded-full bg-ink/15" />
          <span className="ml-auto h-[34%] w-[16%] rounded-full bg-ink/10" />
        </div>
      ))}
    </div>
  );
}

export default WireStage;
