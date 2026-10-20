import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { involvementLabel, type Involvement, type Status } from "@/lib/content/schema";

/** Mono exhibit identifier: "CF-001", "EXHIBIT R-01". */
export function ExhibitLabel({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: "accent" | "muted" | "faint" | "finding";
  className?: string;
}) {
  const tones = {
    accent: "text-accent",
    muted: "text-fg-muted",
    faint: "text-fg-faint",
    finding: "text-finding",
  };
  return <span className={cx("label", tones[tone], className)}>{children}</span>;
}

/** Topic tag. Not interactive. */
export function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-block border border-line px-2 py-0.5 meta text-fg-muted">{children}</span>;
}

/**
 * Flags content that isn't verified yet. Verified content shows nothing,
 * so the badge only appears where a reader should be cautious.
 */
export function StatusBadge({ status }: { status: Status }) {
  if (status === "verified") return null;
  const text = status === "placeholder" ? "Placeholder" : "Details pending";
  return (
    <span className="inline-flex items-center gap-1.5 border border-dashed border-line-strong px-2 py-0.5 label text-fg-muted">
      <span aria-hidden className="size-1.5 rounded-full bg-fg-faint" />
      {text}
    </span>
  );
}

/** How Bhargav was involved. Always shown on case files. */
export function InvolvementBadge({ involvement }: { involvement: Involvement }) {
  return (
    <span className="inline-flex items-center gap-1.5 label text-finding">
      <span aria-hidden className="size-1.5 bg-finding" />
      <span className="sr-only">Involvement: </span>
      {involvementLabel[involvement]}
    </span>
  );
}
