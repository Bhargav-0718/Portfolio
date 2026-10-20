"use client";

import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { Evidence } from "@/lib/content/schema";
import { cx } from "@/lib/cx";
import { EvidenceView, ProvenanceBadge, evidenceTypeLabel, exhibitLetter } from "./EvidenceView";

/**
 * The evidence for a case, as cards. Opening one shows it in the drawer,
 * where ←/→ move between exhibits and Escape closes.
 */
export function EvidenceGallery({ evidence, caseId }: { evidence: Evidence[]; caseId: string }) {
  const drawer = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [index, setIndex] = useState(0);
  const current = evidence[index];
  const count = evidence.length;

  const open = (i: number) => {
    setIndex(i);
    drawer.current?.showModal();
  };
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {evidence.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => open(i)}
              className="group flex h-full w-full flex-col border border-line text-left transition-colors hover:border-line-strong"
            >
              <span className="surface-paper flex aspect-[4/3] items-center justify-center overflow-hidden p-4">
                <span className="block max-h-full w-full transition-transform duration-(--duration-slow) ease-(--ease-archive) group-hover:scale-[1.02]">
                  <EvidenceView evidence={item} size="thumb" />
                </span>
              </span>
              <span className="flex flex-1 flex-col gap-2 p-4">
                <span className="label text-accent">
                  Exhibit {exhibitLetter(i)} · {evidenceTypeLabel[item.type]}
                </span>
                <span className="font-serif text-[1.15rem] leading-snug text-fg">{item.title}</span>
                <span className="mt-auto pt-2">
                  <ProvenanceBadge provenance={item.provenance} />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={drawer}
        data-drawer=""
        aria-labelledby={titleId}
        className="bg-surface text-fg"
        onKeyDown={(e) => {
          if (count < 2) return;
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line px-4 sm:px-6">
              <p className="label text-fg-muted">
                <span className="text-accent">
                  {caseId} · Exhibit {exhibitLetter(index)}
                </span>{" "}
                of {count}
              </p>
              <div className="flex items-center gap-1">
                {count > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous exhibit"
                      className="flex size-11 items-center justify-center text-fg-muted hover:text-fg"
                    >
                      <ArrowLeft aria-hidden className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next exhibit"
                      className="flex size-11 items-center justify-center text-fg-muted hover:text-fg"
                    >
                      <ArrowRight aria-hidden className="size-4" />
                    </button>
                  </>
                ) : null}
                <form method="dialog">
                  <button
                    type="submit"
                    aria-label="Close evidence"
                    className="-mr-2 flex size-11 items-center justify-center text-fg"
                  >
                    <X aria-hidden className="size-5" />
                  </button>
                </form>
              </div>
            </div>

            <div
              key={current.id}
              className="grid flex-1 animate-develop overflow-y-auto lg:grid-cols-[1fr_22rem]"
            >
              <div className="surface-paper flex items-start justify-center p-5 sm:p-8 lg:min-h-full lg:items-center">
                <div className={cx("w-full", current.type === "image" ? "max-w-[34rem]" : "max-w-[46rem]")}>
                  <EvidenceView evidence={current} size="full" />
                </div>
              </div>

              <aside className="flex flex-col gap-6 border-t border-line p-5 sm:p-8 lg:border-t-0 lg:border-l">
                <div>
                  <p className="label text-fg-faint">{evidenceTypeLabel[current.type]}</p>
                  <h2 id={titleId} className="mt-2 text-title">
                    {current.title}
                  </h2>
                  <div className="mt-3">
                    <ProvenanceBadge provenance={current.provenance} />
                  </div>
                </div>
                <p className="text-fg-muted">{current.caption}</p>
                {current.relevance ? (
                  <div>
                    <p className="label text-accent">Why it matters</p>
                    <p className="mt-2 text-fg">{current.relevance}</p>
                  </div>
                ) : null}
                {current.annotations.length > 0 ? (
                  <div>
                    <p className="label text-fg-faint">Notes</p>
                    <ul className="mt-2 space-y-2">
                      {current.annotations.map((a) => (
                        <li key={a} className="border-l border-accent-mark pl-3 meta text-fg-muted">
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {current.source?.href ? (
                  <a
                    href={current.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 label text-fg hover:text-accent"
                  >
                    {current.source.label}
                    <ArrowUpRight aria-hidden className="size-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : null}
                {count > 1 ? (
                  <p className="mt-auto hidden meta text-fg-faint lg:block">← → to move · Esc to close</p>
                ) : null}
              </aside>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
