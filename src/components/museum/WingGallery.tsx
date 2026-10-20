"use client";

import Link from "next/link";
import { startTransition, useEffect, useState, ViewTransition, type ReactNode } from "react";
import { cx } from "@/lib/cx";

export type Wing = { id: string; label: string };

export type HallExhibit = {
  slug: string;
  id: string;
  question: string;
  title: string;
  wing: string;
  wingLabel: string;
  involvementLabel: string;
  statusLabel: string | null;
  recognition: string[];
  evidenceCount: number;
};

const ALL = "all";

/**
 * The hall's wing filter and the hung exhibits. The chosen wing is kept in
 * the address (?wing=…) so a filtered view can be shared.
 */
export function WingGallery({
  wings,
  exhibits,
  emptyNote,
}: {
  wings: Wing[];
  exhibits: HallExhibit[];
  emptyNote: Record<string, ReactNode>;
}) {
  const [wing, setWing] = useState(ALL);

  // Read ?wing= once on arrival (kept out of render so the page stays static).
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("wing");
    if (fromUrl && wings.some((w) => w.id === fromUrl)) {
      startTransition(() => setWing(fromUrl));
    }
  }, [wings]);

  function choose(id: string) {
    startTransition(() => setWing(id));
    const url = id === ALL ? window.location.pathname : `${window.location.pathname}?wing=${id}`;
    window.history.replaceState(null, "", url);
  }

  const shown = wing === ALL ? exhibits : exhibits.filter((e) => e.wing === wing);
  const countFor = (id: string) =>
    id === ALL ? exhibits.length : exhibits.filter((e) => e.wing === id).length;
  const current = wings.find((w) => w.id === wing);

  return (
    <>
      <div role="group" aria-label="Filter exhibits by wing" className="flex flex-wrap gap-2">
        {[{ id: ALL, label: "All wings" }, ...wings].map((w) => {
          const active = w.id === wing;
          return (
            <button
              key={w.id}
              type="button"
              aria-pressed={active}
              onClick={() => choose(w.id)}
              className={cx(
                "inline-flex min-h-10 items-center gap-2 border px-3.5 label transition-colors duration-(--duration-quick)",
                active
                  ? "border-fg bg-fg text-surface"
                  : "border-line-strong text-fg-muted hover:border-accent hover:text-fg",
              )}
            >
              {w.label}
              <span className={active ? "text-surface/70" : "text-fg-faint"}>{countFor(w.id)}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "exhibit" : "exhibits"} shown
        {current ? ` in the ${current.label} wing` : ""}.
      </p>

      {shown.length === 0 ? (
        <div className="mt-14 border border-dashed border-line-strong p-8 sm:p-12">
          <p className="label text-fg-faint">Empty wing</p>
          <p className="mt-3 text-title">This wing is still being hung.</p>
          <div className="mt-4 measure text-fg-muted">{emptyNote[wing] ?? null}</div>
          <button
            type="button"
            onClick={() => choose(ALL)}
            className="mt-6 inline-flex min-h-10 items-center label text-fg underline decoration-accent underline-offset-4 hover:text-accent"
          >
            Show all wings
          </button>
        </div>
      ) : (
        <ul className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-12">
          {shown.map((e, i) => (
            <ViewTransition key={e.slug} enter="exhibit-in" exit="exhibit-out" default="none">
              <li className={cx(spans[i % spans.length], i % 2 === 1 && "lg:mt-20")}>
                <Exhibit exhibit={e} />
              </li>
            </ViewTransition>
          ))}
        </ul>
      )}
    </>
  );
}

/** A salon hang: alternating wide and narrow frames rather than a uniform grid. */
const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

function Exhibit({ exhibit: e }: { exhibit: HallExhibit }) {
  return (
    <Link href={`/museum/${e.slug}`} transitionTypes={["travel-in"]} className="exhibit group">
      <span aria-hidden className="exhibit-light" />
      <span className="exhibit-frame">
        <span className="exhibit-canvas surface-paper">
          <span className="label text-accent">{e.id}</span>
          <span className="block font-serif text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] leading-[1.12] text-fg">
            {e.question}
          </span>
        </span>
      </span>
      {/* Wall label */}
      <span className="mt-5 grid gap-1.5 border-l border-accent-mark pl-4">
        <span className="font-serif text-[1.1rem] leading-snug text-fg group-hover:text-accent">
          {e.title}
        </span>
        <span className="meta text-fg-muted">
          {e.wingLabel} wing · {e.involvementLabel}
          {e.evidenceCount > 0
            ? ` · ${e.evidenceCount} ${e.evidenceCount === 1 ? "artifact" : "artifacts"}`
            : ""}
        </span>
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {e.recognition.map((r) => (
            <span key={r} className="label text-finding">
              {r}
            </span>
          ))}
          {e.statusLabel ? <span className="label text-fg-faint">{e.statusLabel}</span> : null}
        </span>
      </span>
    </Link>
  );
}
