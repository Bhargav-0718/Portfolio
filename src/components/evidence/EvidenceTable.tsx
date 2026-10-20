import type { Evidence } from "@/lib/content/schema";

type TableEvidence = Extract<Evidence, { type: "table" }>;

const provenanceLabel = {
  actual: "Actual figures",
  illustrative: "Illustrative",
  placeholder: "Placeholder",
};

/** A table artifact presented as a paper document. Reused by case files (Phase 4). */
export function EvidenceTable({ evidence, label }: { evidence: TableEvidence; label?: string }) {
  return (
    <figure className="surface-paper p-5 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.9)] sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="label text-accent">{label ?? "Evidence"}</p>
        <p className="label text-finding">{provenanceLabel[evidence.provenance]}</p>
      </div>
      <p className="mt-2 font-serif text-[1.15rem] leading-snug">{evidence.title}</p>
      <table className="mt-4 w-full border-collapse text-left">
        <thead className="sr-only">
          <tr>
            {evidence.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {evidence.rows.map((row) => (
            <tr key={row.join("|")} className="border-t border-line">
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
      <figcaption className="mt-3 meta text-fg-faint">{evidence.caption}</figcaption>
    </figure>
  );
}
