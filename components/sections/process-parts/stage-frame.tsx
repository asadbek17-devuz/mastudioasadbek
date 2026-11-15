import type { MotionValue } from "framer-motion";
import { Scene } from "@/components/sections/process-parts/scene";
import { stageAddress, stageIds } from "@/components/sections/process-parts/stages";
import { BrowserFrame } from "@/components/sections/projects-parts/browser-frame";
import type { Dictionary } from "@/lib/i18n";

interface StageFrameProps {
  /** 0 (sketch) .. 3 (launch). */
  progress: MotionValue<number>;
  /** Index of the stage the frame is at: picks the address and starts the live counter. */
  stage: number;
  /** The launch stage is on screen, so its counter may run. */
  live: boolean;
  text: Dictionary["process"]["mock"];
  reduce: boolean;
}

/**
 * The product screen in a hairline browser frame. Decoration only: the steps next to it
 * say the same thing in text, so the whole frame is hidden from assistive tech.
 */
export function StageFrame({ progress, stage, live, text, reduce }: StageFrameProps) {
  return (
    <div aria-hidden="true">
      <BrowserFrame address={stageAddress[stageIds[stage]]} screenClassName="@container aspect-[4/3]">
        <div className="absolute inset-0">
          <Scene progress={progress} text={text} live={live} reduce={reduce} />
        </div>
      </BrowserFrame>
    </div>
  );
}

export default StageFrame;
