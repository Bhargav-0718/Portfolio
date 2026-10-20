import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import { CaseFrontmatter, CuriosityFrontmatter, FieldNoteFrontmatter, LeadershipFrontmatter } from "./schema";

/**
 * File-based content loader.
 *
 * Reads are synchronous on purpose: with `cacheComponents` enabled, sync I/O is
 * prerendered into the static shell, so every content page stays static.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");
const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

export type Entry<T> = T & {
  slug: string;
  /** Raw MDX body, rendered by the page that needs it. */
  body: string;
};

function loadCollection<S extends z.ZodType<{ draft: boolean }>>(
  dir: string,
  schema: S,
): Entry<z.output<S>>[] {
  const folder = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(folder)) return [];

  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(folder, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n");
        throw new Error(`Invalid frontmatter in content/${dir}/${file}\n${issues}`);
      }
      const entry: Entry<z.output<S>> = Object.assign({}, parsed.data, {
        slug: file.replace(/\.mdx?$/, ""),
        body: content,
      });
      return entry;
    })
    .filter((entry) => SHOW_DRAFTS || !entry.draft);
}

const byOrder = (a: { order: number; id: string }, b: { order: number; id: string }) =>
  a.order - b.order || a.id.localeCompare(b.id);

const byDateDesc = (a: { date?: string; id: string }, b: { date?: string; id: string }) =>
  (b.date ?? "").localeCompare(a.date ?? "") || a.id.localeCompare(b.id);

export const getCases = () => loadCollection("cases", CaseFrontmatter).sort(byOrder);
export const getCase = (slug: string) => getCases().find((c) => c.slug === slug);
export const getFeaturedCases = () => getCases().filter((c) => c.featured);

export const getCuriosities = () => loadCollection("curiosity", CuriosityFrontmatter).sort(byDateDesc);
export const getLeadership = () => loadCollection("leadership", LeadershipFrontmatter).sort(byOrder);
export const getFieldNotes = () => loadCollection("field-notes", FieldNoteFrontmatter).sort(byDateDesc);

export type CaseEntry = ReturnType<typeof getCases>[number];
export type CuriosityEntry = ReturnType<typeof getCuriosities>[number];
export type LeadershipEntry = ReturnType<typeof getLeadership>[number];
export type FieldNoteEntry = ReturnType<typeof getFieldNotes>[number];
