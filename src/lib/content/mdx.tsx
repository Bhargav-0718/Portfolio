import { evaluateSync } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * MDX for content bodies. Compiled synchronously so content pages stay fully
 * prerendered under Cache Components (no uncached async work during render).
 */

const components: MDXComponents = {
  Placeholder,
  p: (props) => <p className="mt-5 measure text-body text-fg first:mt-0" {...props} />,
  em: (props) => <em className="font-serif text-[1.08em]" {...props} />,
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  ul: (props) => (
    <ul className="mt-5 measure list-disc space-y-2 pl-5 text-fg marker:text-accent-mark" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-5 measure list-decimal space-y-2 pl-5 text-fg marker:text-accent-mark" {...props} />
  ),
  a: (props) => (
    <a className="text-fg underline decoration-accent underline-offset-4 hover:text-accent" {...props} />
  ),
  h3: (props) => <h3 className="mt-10 text-title" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 measure border-l-2 border-accent-mark pl-5 font-serif text-lede italic"
      {...props}
    />
  ),
  code: (props) => <code className="meta text-accent" {...props} />,
};

/**
 * `overrides` replaces individual elements, e.g. demoting `##` headings to
 * <h4> when the body sits inside a card that already has its own heading.
 */
export function renderMdx(source: string, overrides?: MDXComponents) {
  const { default: Content } = evaluateSync(source, { ...runtime, baseUrl: import.meta.url });
  return <Content components={{ ...components, ...overrides }} />;
}

/** For bodies nested under an <h3>: `##` becomes a small <h4> label. */
export const nestedHeadings: MDXComponents = {
  h2: (props) => <h4 className="mt-6 label text-accent first:mt-0" {...props} />,
};

export type Section = { id: string; title: string; body: string };

/** "The Open Questions" → "open-questions" */
const sectionId = (title: string) =>
  title
    .replace(/^the\s+/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Splits a body on its `## ` headings. Each case-file section is rendered
 * separately so the layout can place evidence between them and build the index.
 * Text before the first heading becomes an untitled "intro" section.
 */
export function splitSections(body: string): Section[] {
  const parts = body.split(/^##\s+(.+)$/m);
  const sections: Section[] = [];
  const intro = parts[0].trim();
  if (intro) sections.push({ id: "intro", title: "", body: intro });
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i].trim();
    sections.push({ id: sectionId(title), title, body: (parts[i + 1] ?? "").trim() });
  }
  return sections;
}
