"use client";

import Image from "next/image";
import type { Ref } from "react";
import { ArrowUpRight, Download, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import type { ResumeExhibitVersion } from "./types";

/** Full-size view of every page of a résumé version. Native <dialog>: focus trap + Escape. */
export function ResumeInspector({
  ref,
  version,
  ownerName,
}: {
  ref: Ref<HTMLDialogElement>;
  version: ResumeExhibitVersion;
  ownerName: string;
}) {
  return (
    <dialog
      ref={ref}
      data-sheet=""
      aria-label={`Résumé, ${version.label} version`}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-surface-sunken p-0 text-fg"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-line pt-[env(safe-area-inset-top)]">
          <div className="frame flex h-16 items-center justify-between gap-4">
            <p className="truncate label text-fg-muted">
              <span className="text-accent">Exhibit {version.exhibit}</span> · Curriculum Vitae ·{" "}
              {version.label}
            </p>
            <div className="flex items-center gap-2">
              <ButtonLink
                href={version.file}
                target="_blank"
                size="sm"
                variant="text"
                className="hidden sm:inline-flex"
                icon={<ArrowUpRight aria-hidden className="size-3.5" />}
              >
                Open PDF
              </ButtonLink>
              <form method="dialog">
                <button
                  type="submit"
                  className="-mr-2 flex size-11 items-center justify-center text-fg"
                  aria-label="Close inspector"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto flex max-w-[60rem] flex-col gap-6 px-3 py-6 sm:px-6 sm:py-10">
            {version.pages.map((page, i) => (
              <Image
                key={page.src}
                src={page.src}
                width={page.width}
                height={page.height}
                alt={`Page ${i + 1} of ${version.pages.length} of ${ownerName}'s résumé (${version.label} version). Download the PDF for selectable text.`}
                sizes="(min-width: 64rem) 60rem, 100vw"
                className="h-auto w-full bg-white shadow-[0_10px_40px_rgb(0_0_0/0.6)]"
              />
            ))}
          </div>
        </div>

        <div className="border-t border-line pb-[env(safe-area-inset-bottom)]">
          <div className="frame flex min-h-16 items-center justify-between gap-4 py-3">
            <p className="hidden meta text-fg-faint sm:block">Esc to close</p>
            <ButtonLink
              href={version.file}
              download={version.downloadName}
              variant="primary"
              size="sm"
              icon={<Download aria-hidden className="size-3.5" />}
              className="ml-auto"
            >
              Download PDF
            </ButtonLink>
          </div>
        </div>
      </div>
    </dialog>
  );
}
