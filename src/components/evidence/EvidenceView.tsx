import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Evidence, Provenance } from "@/lib/content/schema";
import { cx } from "@/lib/cx";
import { ExternalLinkOrPending } from "@/components/ui/ExternalLinkOrPending";

/**
 * Renders any evidence artifact. `thumb` is the small preview on a gallery
 * card; `full` is the drawer view. Pure and serialisable-props only, so it
 * works in both server and client components.
 */
export function EvidenceView({ evidence, size }: { evidence: Evidence; size: "thumb" | "full" }) {
  const full = size === "full";

  switch (evidence.type) {
    case "image":
      return (
        <Image
          src={evidence.src}
          width={evidence.width}
          height={evidence.height}
          alt={full ? evidence.alt : ""}
          sizes={full ? "(min-width: 64rem) 44rem, 100vw" : "(min-width: 64rem) 22rem, 90vw"}
          className={cx(
            "h-auto w-full",
            full ? "shadow-[0_10px_30px_rgb(0_0_0/0.35)]" : "max-h-full object-contain",
          )}
        />
      );

    case "svg": {
      const image = (
        <Image
          src={evidence.src}
          width={evidence.width}
          height={evidence.height}
          alt={full ? evidence.alt : ""}
          unoptimized
          className={cx("h-auto w-full", full && "min-w-[42rem]")}
        />
      );
      if (!full) return image;
      // Diagrams keep a readable size on phones and scroll sideways inside the drawer.
      return (
        <div>
          <div className="overflow-x-auto overscroll-x-contain">{image}</div>
          <p className="mt-3 meta text-fg-faint md:hidden">Scroll sideways to read the whole diagram.</p>
        </div>
      );
    }

    case "table": {
      const rows = full ? evidence.rows : evidence.rows.slice(0, 5);
      return (
        <table className={cx("w-full border-collapse text-left", full ? "" : "text-[0.8rem]")}>
          {full ? (
            <thead>
              <tr className="border-b border-line-strong">
                {evidence.columns.map((c) => (
                  <th key={c} scope="col" className="py-2 pr-4 label font-normal text-fg-faint">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("|")} className="border-b border-line">
                <th scope="row" className="py-1.5 pr-4 meta font-normal text-fg-muted">
                  {row[0]}
                </th>
                {row.slice(1).map((cell, i) => (
                  <td key={i} className="py-1.5 text-right meta text-fg">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    case "comparison":
      return (
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          {[evidence.before, evidence.after].map((side, i) => (
            <div key={side.label} className={cx("border border-line p-4", i === 1 && "border-finding")}>
              <p className={cx("label", i === 1 ? "text-finding" : "text-fg-faint")}>{side.label}</p>
              {side.src ? (
                <Image
                  src={side.src}
                  alt={side.alt ?? ""}
                  width={800}
                  height={600}
                  className="mt-3 h-auto w-full"
                />
              ) : null}
              {side.body ? (
                <p className={cx("mt-2 font-serif", full ? "text-title" : "text-[1.15rem]")}>{side.body}</p>
              ) : null}
            </div>
          ))}
          <ArrowRight aria-hidden className="mx-auto hidden size-5 text-fg-faint sm:block" />
        </div>
      );

    case "note":
      return (
        <p
          className={cx(
            "font-serif whitespace-pre-line text-fg",
            full ? "text-lede" : "line-clamp-6 text-[0.95rem]",
          )}
        >
          {evidence.body}
        </p>
      );

    case "code":
      return (
        <pre
          className={cx(
            "overflow-x-auto bg-[#191919] p-4 text-[0.8rem] leading-relaxed text-[#e9e2d5]",
            !full && "max-h-40 overflow-hidden",
          )}
        >
          <code className="font-mono">{evidence.code}</code>
        </pre>
      );

    case "link":
      return (
        <div className="flex flex-col gap-2">
          <p className="font-serif text-[1.1rem]">{evidence.label}</p>
          <ExternalLinkOrPending link={{ label: "Open", href: evidence.href }} />
        </div>
      );
  }
}

const provenanceText: Record<Provenance, string> = {
  actual: "Actual artifact",
  illustrative: "Illustrative · drawn for this site",
  placeholder: "Placeholder",
};

/** Where an artifact came from. Always shown next to evidence. */
export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 label",
        provenance === "actual" && "text-finding",
        provenance === "illustrative" && "text-accent",
        provenance === "placeholder" && "border border-dashed border-line-strong px-1.5 text-fg-faint",
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {provenanceText[provenance]}
    </span>
  );
}

export const evidenceTypeLabel: Record<Evidence["type"], string> = {
  image: "Image",
  svg: "Diagram",
  table: "Table",
  comparison: "Before / after",
  note: "Note",
  code: "Code",
  link: "Link",
};

/** "A", "B", … for exhibit numbering within a case. */
export const exhibitLetter = (i: number) => String.fromCharCode(65 + i);
