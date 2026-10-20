"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { PLAN_COLS, PLAN_ROWS, rooms } from "@/config/rooms";
import { cx } from "@/lib/cx";
import { roomForPath, travelTypes } from "@/lib/rooms";
import { FloorPlanDrawing } from "./FloorPlanDrawing";

type Props = {
  resumes: { id: string; label: string; href: string }[];
  contact: { label: string; href: string }[];
};

/**
 * The building's floor plan, opened from the header. Rooms on the drawing
 * are clickable for pointer users; the directory list beside it is the
 * keyboard and screen-reader route to the same places.
 */
export function FloorPlanMenu({ resumes, contact }: Props) {
  const pathname = usePathname();
  const here = roomForPath(pathname);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => dialogRef.current?.close();

  // Close after navigation (routes stay mounted under Cache Components).
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const directory = [...rooms].sort((a, b) => a.index.localeCompare(b.index));

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        className="group flex min-h-10 items-center gap-3 border border-line-strong px-3 transition-colors hover:border-accent"
      >
        <FloorPlanDrawing
          current={here.id}
          strokeWidth={1}
          className="h-4 w-8 text-fg-muted transition-colors group-hover:text-fg"
        />
        <span className="label text-fg">Floor plan</span>
      </button>

      <dialog
        ref={dialogRef}
        data-sheet=""
        aria-label="Floor plan of the archive"
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-surface p-0 text-fg"
      >
        <div className="flex min-h-full flex-col pt-[env(safe-area-inset-top)]">
          <div className="border-b border-line">
            <div className="frame flex h-16 items-center justify-between">
              <p className="label text-fg-muted">Floor plan · The Unfinished Archive</p>
              <button
                type="button"
                onClick={close}
                className="-mr-2 flex size-11 items-center justify-center text-fg"
                aria-label="Close floor plan"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
          </div>

          <div className="frame grid flex-1 gap-x-16 gap-y-12 py-10 lg:grid-cols-12 lg:py-16">
            {/* ---- The drawing ---- */}
            <div className="lg:col-span-7">
              <p className="label text-fg-faint">You are in</p>
              <p className="mt-2 font-serif text-title">{here.name}</p>

              <div className="relative mt-8 aspect-[4/3] text-fg-muted sm:aspect-[2/1]" aria-hidden>
                <FloorPlanDrawing current={here.id} strokeWidth={2} className="absolute inset-0 size-full" />
                {rooms.map((r) => {
                  const isHere = r.id === here.id;
                  return (
                    <Link
                      key={r.id}
                      href={r.href}
                      tabIndex={-1}
                      transitionTypes={travelTypes(here, r)}
                      onClick={close}
                      className={cx(
                        "group absolute flex flex-col justify-between p-2.5 transition-colors sm:p-4",
                        isHere ? "text-fg" : "hover:bg-fg/5",
                      )}
                      style={{
                        left: `${((r.plan.col - 1) / PLAN_COLS) * 100}%`,
                        top: `${((r.plan.row - 1) / PLAN_ROWS) * 100}%`,
                        width: `${(r.plan.w / PLAN_COLS) * 100}%`,
                        height: `${(r.plan.h / PLAN_ROWS) * 100}%`,
                      }}
                    >
                      <span className={cx("label", isHere ? "text-accent" : "text-fg-faint")}>{r.index}</span>
                      <span
                        className={cx(
                          "font-serif text-[0.95rem] leading-tight sm:text-[1.15rem]",
                          isHere ? "text-fg" : "text-fg-muted group-hover:text-fg",
                        )}
                      >
                        {r.short}
                      </span>
                      {isHere ? (
                        <span className="absolute top-2.5 right-2.5 flex items-center gap-1.5 sm:top-4 sm:right-4">
                          <span className="size-2 animate-pulse rounded-full bg-accent-mark" />
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
                <span className="absolute top-full left-[37.5%] mt-2 -translate-x-1/2 label text-fg-faint">
                  ↑ Entrance
                </span>
              </div>
            </div>

            {/* ---- The directory ---- */}
            <nav aria-label="All rooms" className="lg:col-span-5">
              <p className="label text-fg-faint">Directory</p>
              <ul className="mt-4 border-t border-line">
                {directory.map((r) => {
                  const isHere = r.id === here.id;
                  return (
                    <li key={r.id} className="border-b border-line">
                      <Link
                        href={r.href}
                        aria-current={isHere ? "page" : undefined}
                        transitionTypes={travelTypes(here, r)}
                        onClick={close}
                        className="group grid grid-cols-[2.5rem_1fr] gap-x-2 py-3.5"
                      >
                        <span className={cx("pt-1 label", isHere ? "text-accent" : "text-fg-faint")}>
                          {r.index}
                        </span>
                        <span>
                          <span
                            className={cx(
                              "block font-serif text-[1.2rem] leading-snug",
                              isHere ? "text-fg" : "text-fg-muted group-hover:text-fg",
                            )}
                          >
                            {r.name}
                            {isHere ? <span className="ml-2 label text-accent">You are here</span> : null}
                          </span>
                          <span className="meta text-fg-faint">{r.purpose}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-10 grid grid-cols-2 gap-6">
                <div>
                  <p className="label text-fg-faint">Résumé</p>
                  <ul className="mt-2">
                    {resumes.map((r) => (
                      <li key={r.id}>
                        <Link
                          href={r.href}
                          transitionTypes={travelTypes(
                            here,
                            rooms.find((x) => x.id === "record")!,
                          )}
                          onClick={close}
                          className="flex min-h-10 items-center text-fg hover:text-accent"
                        >
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label text-fg-faint">Correspondence</p>
                  <ul className="mt-2">
                    {contact.map((c) => (
                      <li key={c.label}>
                        <a
                          href={c.href}
                          className="flex min-h-10 items-center text-fg hover:text-accent"
                          {...(c.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </dialog>
    </>
  );
}
