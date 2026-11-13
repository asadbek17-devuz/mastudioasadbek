import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import type { LocalizedProject } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Two-digit index: 0 -> "01". */
export const pad = (n: number) => String(n + 1).padStart(2, "0");

/** Text of the address pill: the real domain for live links, the slug otherwise. */
export function addressOf(project: Pick<LocalizedProject, "href" | "slug">) {
  try {
    const { href } = project;
    if (href && /^https?:\/\//.test(href)) return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    /* fall through to the slug */
  }
  return project.slug;
}

interface BrowserFrameProps {
  /** Shown in the address pill. */
  address: string;
  /** The screenshot: usually a `fill` image, optionally inside `<Parallax>`. */
  children: ReactNode;
  className?: string;
  /** Classes for the screenshot area. It sets the aspect ratio. */
  screenClassName?: string;
}

/**
 * Minimal browser window around a project screenshot: a top bar with three
 * dots in the site's own colors (never red/yellow/green) and a small address
 * pill. The bar is decoration, so it is hidden from assistive tech.
 */
export function BrowserFrame({ address, children, className, screenClassName }: BrowserFrameProps) {
  return (
    <div className={cn("overflow-hidden rounded-[14px] border border-ink/10 bg-cream-50", className)}>
      <div aria-hidden="true" className="flex h-8 items-center gap-2 border-b border-line bg-cream-50 px-3">
        <span className="flex w-9 shrink-0 items-center gap-1.5">
          <span className="size-2 rounded-full bg-ink/15" />
          <span className="size-2 rounded-full bg-sage" />
          <span className="size-2 rounded-full bg-accent" />
        </span>
        <span className="mx-auto flex h-[22px] min-w-0 items-center gap-1.5 rounded-pill bg-cream-100 px-2 text-[13px] leading-none text-muted">
          <Lock className="size-2.5 shrink-0" strokeWidth={2.4} />
          <span className="truncate">{address}</span>
        </span>
        <span className="w-9 shrink-0" />
      </div>
      <div className={cn("relative aspect-[16/10] w-full overflow-hidden bg-cream-100", screenClassName)}>{children}</div>
    </div>
  );
}

export default BrowserFrame;
