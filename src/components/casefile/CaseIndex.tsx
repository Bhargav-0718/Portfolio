"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";

/** Sticky table of contents for a case file; highlights the section in view. */
export function CaseIndex({ caseId, items }: { caseId: string; items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={`Contents of case file ${caseId}`} className="sticky top-24">
      <p className="label text-fg-faint">Case index · {caseId}</p>
      <ol className="mt-4 border-l border-line">
        {items.map((item, i) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cx(
                  "-ml-px flex min-h-9 items-baseline gap-3 border-l py-1.5 pl-4 text-[0.92rem] transition-colors",
                  isActive ? "border-accent-mark text-fg" : "border-transparent text-fg-muted hover:text-fg",
                )}
              >
                <span className={cx("label", isActive ? "text-accent" : "text-fg-faint")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
