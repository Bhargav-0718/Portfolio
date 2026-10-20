"use client";

import { useRef, useState } from "react";
import { Download, Maximize2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { GiltFrame } from "./GiltFrame";
import { ResumeInspector } from "./ResumeInspector";
import type { ResumeExhibitVersion } from "./types";

type Props = {
  versions: ResumeExhibitVersion[];
  initialId: string;
  ownerName: string;
  roomIndex: string;
  roomName: string;
};

/**
 * The Record Room: the résumé hung in an antique gilt frame under a pendant
 * lamp, with a brass plaque on the wall. Visitor controls (version, inspect,
 * download) sit below the scene so the wall stays uncluttered.
 */
export function RecordRoomScene({ versions, initialId, ownerName, roomIndex, roomName }: Props) {
  const [activeId, setActiveId] = useState(initialId);
  const inspector = useRef<HTMLDialogElement>(null);
  const active = versions.find((v) => v.id === activeId) ?? versions[0];
  const openInspector = () => inspector.current?.showModal();

  function select(id: string) {
    setActiveId(id);
    // Keep the address shareable: /resume/<id> shows this version.
    window.history.replaceState(null, "", `/resume/${id}`);
  }

  return (
    <>
      <section className="rr-scene" aria-labelledby="record-room-title">
        <div aria-hidden className="rr-wall" />
        <div aria-hidden className="rr-pool" />
        <div aria-hidden className="rr-cone" />
        <div aria-hidden className="rr-skirting" />
        <div aria-hidden className="rr-floor">
          <div className="rr-floor-planks" />
        </div>

        <div aria-hidden className="rr-lamp">
          <span className="rr-lamp-canopy" />
          <span className="rr-lamp-rod" />
          <svg viewBox="0 0 120 62" className="rr-lamp-shade">
            <defs>
              <linearGradient id="rr-shade" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#151514" />
                <stop offset="0.38" stopColor="#3d3b38" />
                <stop offset="0.55" stopColor="#2a2927" />
                <stop offset="1" stopColor="#121211" />
              </linearGradient>
              <radialGradient id="rr-bulb" cx="0.5" cy="0.3" r="0.7">
                <stop offset="0" stopColor="#fffaf0" />
                <stop offset="0.6" stopColor="#ffe9c4" />
                <stop offset="1" stopColor="#e9b874" />
              </radialGradient>
            </defs>
            <rect x="53" y="0" width="14" height="12" fill="#2a2927" />
            <rect x="51" y="10" width="18" height="4" fill="#9c7b3c" />
            <path d="M8 54 C 12 30, 34 14, 60 14 C 86 14, 108 30, 112 54 Z" fill="url(#rr-shade)" />
            <ellipse className="rr-lamp-bulb" cx="60" cy="55" rx="26" ry="5" fill="url(#rr-bulb)" />
            <path d="M8 54 H 112" stroke="#b8924a" strokeWidth="2.5" />
          </svg>
        </div>

        <header className="rr-walltext">
          <p className="label text-fg-faint">Room {roomIndex}</p>
          <h1 id="record-room-title" className="mt-2 text-title text-fg">
            {roomName}
          </h1>
          <p className="mt-2 meta text-fg-muted">The paper trail, framed and hung.</p>
        </header>

        {/* The painting and its plaque */}
        <div className="relative flex flex-col items-center md:block" style={{ width: "var(--frame-w)" }}>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={openInspector}
            className="block w-full cursor-zoom-in"
          >
            <GiltFrame
              page={active.pages[0]}
              ownerName={ownerName}
              sizes="(min-width: 768px) 18rem, 55vw"
              priority
              versionKey={active.id}
            />
          </button>

          <div className="brass-plaque mt-8 w-[11rem] self-end md:absolute md:top-[58%] md:left-[calc(100%+clamp(2rem,5vw,4.5rem))] md:mt-0 md:w-[10.5rem]">
            <p className="font-mono text-[0.625rem] tracking-[0.12em] uppercase">Exhibit {active.exhibit}</p>
            <p className="mt-1 font-serif text-[1.05rem] leading-tight">Curriculum Vitae</p>
            <p className="text-[0.75rem] leading-snug">{ownerName}</p>
            <p className="mt-1.5 font-mono text-[0.625rem] tracking-[0.06em]">
              {active.label} · {active.updatedLabel}
            </p>
          </div>
        </div>
      </section>

      {/* Visitor controls */}
      <div className="border-b border-line bg-surface-sunken">
        <div className="frame grid items-center gap-x-10 gap-y-6 py-8 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div>
              <p className="label text-accent">Exhibit {active.exhibit} · Curriculum Vitae</p>
              <p className="mt-1 meta text-fg-muted" aria-live="polite">
                {active.label} version: {active.focus}. Updated {active.updatedLabel}.
              </p>
            </div>
            {versions.length > 1 ? (
              <div role="group" aria-label="Choose a résumé version" className="flex flex-wrap gap-2">
                {versions.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={v.id === active.id}
                    onClick={() => select(v.id)}
                    className={cx(
                      "min-h-10 border px-4 label transition-colors duration-(--duration-quick)",
                      v.id === active.id
                        ? "border-fg bg-fg text-surface"
                        : "border-line-strong text-fg hover:border-accent hover:text-accent",
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={openInspector}
              icon={<Maximize2 aria-hidden className="size-3.5" />}
              disabled={active.pages.length === 0}
            >
              Inspect
            </Button>
            <ButtonLink
              href={active.file}
              download={active.downloadName}
              icon={<Download aria-hidden className="size-3.5" />}
            >
              Download PDF
            </ButtonLink>
          </div>
        </div>
      </div>

      <ResumeInspector ref={inspector} version={active} ownerName={ownerName} />
    </>
  );
}
