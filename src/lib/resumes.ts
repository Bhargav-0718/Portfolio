import fs from "node:fs";
import path from "node:path";
import { resumes, type ResumeVersion } from "@content/resumes";
import previews from "@/generated/resume-previews.json";

export type ResumePage = { src: string; width: number; height: number };

export type Resume = Required<ResumeVersion> & {
  /** "R-01", "R-02" … in registry order. */
  exhibit: string;
  /** Stable exhibit page for this version. */
  href: string;
  /** Rendered page images. Empty until `npm run resume:previews` has run. */
  pages: ResumePage[];
};

/**
 * Validates content/resumes.ts once per process. Throws with a readable
 * message so a bad edit fails the build instead of shipping a broken link.
 */
function validate(list: ResumeVersion[]): Resume[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const r of list) {
    if (!/^[a-z0-9-]+$/.test(r.id)) errors.push(`"${r.id}": id must be lowercase letters, digits or hyphens`);
    if (ids.has(r.id)) errors.push(`"${r.id}": duplicate id`);
    ids.add(r.id);
    if (!fs.existsSync(path.join(process.cwd(), "public", r.file))) {
      errors.push(`"${r.id}": ${r.file} does not exist in public/`);
    }
  }

  const primaries = list.filter((r) => r.primary);
  if (primaries.length !== 1) errors.push(`exactly one version must be primary (found ${primaries.length})`);
  if (primaries[0] && primaries[0].public === false) errors.push(`the primary version must be public`);

  if (errors.length) {
    throw new Error(`Invalid content/resumes.ts\n${errors.map((e) => `  • ${e}`).join("\n")}`);
  }

  const manifest = previews as Record<string, { pages: ResumePage[] } | undefined>;

  return list.map((r, i) => ({
    ...r,
    primary: r.primary ?? false,
    public: r.public ?? true,
    exhibit: `R-${String(i + 1).padStart(2, "0")}`,
    href: `/resume/${r.id}`,
    pages: manifest[r.id]?.pages ?? [],
  }));
}

const all = validate(resumes);

export const getResumes = () => all;
export const getPublicResumes = () => all.filter((r) => r.public);
export const getPrimaryResume = () => all.find((r) => r.primary)!;
export const getResume = (id: string) => all.find((r) => r.id === id);

/**
 * Versions to show on an exhibit: every public version, plus `focusId`
 * if it's a hidden version reached by direct link.
 */
export function getExhibitVersions(focusId?: string) {
  return all
    .filter((r) => r.public || r.id === focusId)
    .map((r) => ({
      id: r.id,
      exhibit: r.exhibit,
      label: r.label,
      focus: r.focus,
      file: r.file,
      downloadName: r.downloadName,
      updatedLabel: formatUpdated(r.updated),
      pages: r.pages,
    }));
}

/** "2026-10" → "Oct 2026", "2026" → "2026". */
export function formatUpdated(value: string) {
  const [year, month] = value.split("-");
  if (!month) return year;
  const name = new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-GB", { month: "short" });
  return `${name} ${year}`;
}
