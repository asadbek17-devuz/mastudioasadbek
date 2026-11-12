import type { StartupStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

const styles: Record<StartupStatus, { chip: string; dot: string }> = {
  Active: { chip: "bg-accent-soft text-accent", dot: "bg-accent" },
  Growing: { chip: "bg-accent-2/10 text-accent-2", dot: "bg-accent-2" },
  Building: { chip: "bg-sage/30 text-ink-soft", dot: "bg-sage" },
  Exited: { chip: "bg-cream-100 text-muted", dot: "bg-muted" },
  Paused: { chip: "bg-cream-100 text-muted", dot: "bg-muted" },
};

interface StatusBadgeProps {
  /** Picks the colors. */
  status: StartupStatus;
  /** Translated text to show; defaults to the English status. */
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[13px] font-medium",
        s.chip,
        className
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", s.dot)} />
      {label ?? status}
    </span>
  );
}

export default StatusBadge;
