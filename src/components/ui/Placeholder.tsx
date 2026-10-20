import type { ReactNode } from "react";

/**
 * A visibly unfinished block. Used in MDX (<Placeholder>…</Placeholder>)
 * and anywhere real content hasn't been supplied. Never styled to look final.
 */
export function Placeholder({ children, label = "To be written" }: { children?: ReactNode; label?: string }) {
  return (
    <div className="my-6 border border-dashed border-line-strong p-5" role="note">
      <p className="label text-fg-faint">Placeholder · {label}</p>
      {children ? <div className="mt-2 text-[0.95rem] text-fg-muted">{children}</div> : null}
    </div>
  );
}
