import { cacheLife } from "next/cache";
import { site } from "@/config/site";

/**
 * Essays from Bhargav's Blogger blog, read from its public JSON feed.
 *
 * - Cached for hours: new posts appear on the site automatically, with no
 *   redeploy, the next time the cache refreshes.
 * - Only plain text is extracted. Blog HTML is never rendered on this site.
 * - Returns null if the blog can't be reached; the UI then links to the blog.
 */

export type BlogPost = {
  id: string;
  title: string;
  /** The heading each essay opens with, e.g. "Nationalism is a Drug." */
  deck: string | null;
  excerpt: string;
  url: string;
  published: string;
  words: number;
  minutes: number;
};

const FEED_URL = new URL("feeds/posts/default?alt=json&max-results=50", site.blog.url).toString();
const EXCERPT_WORDS = 48;
const WORDS_PER_MINUTE = 220;

export async function getBlogPosts(): Promise<BlogPost[] | null> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(FEED_URL, { headers: { accept: "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as BloggerFeed;
    return (data.feed?.entry ?? [])
      .map(toPost)
      .filter((p): p is BlogPost => p !== null)
      .sort((a, b) => b.published.localeCompare(a.published));
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */

type BloggerFeed = {
  feed?: {
    entry?: {
      id?: { $t?: string };
      title?: { $t?: string };
      published?: { $t?: string };
      content?: { $t?: string };
      summary?: { $t?: string };
      link?: { rel?: string; href?: string }[];
    }[];
  };
};

type Entry = NonNullable<NonNullable<BloggerFeed["feed"]>["entry"]>[number];

function toPost(e: Entry): BlogPost | null {
  const html = e.content?.$t ?? e.summary?.$t ?? "";
  const url = e.link?.find((l) => l.rel === "alternate")?.href ?? "";
  const title = (e.title?.$t ?? "").trim().replace(/\.$/, "");
  const published = e.published?.$t ?? "";

  // Only link to posts on the blog itself, over https.
  if (!title || !published || !url.startsWith(site.blog.url.replace(/^http:/, "https:"))) return null;

  // Each essay opens with a heading (its "deck"), then the body.
  const headingMatch = html.match(/^\s*<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
  const deck = headingMatch ? toText(headingMatch[1]).trim() || null : null;
  const bodyHtml = headingMatch ? html.slice(headingMatch[0].length) : html;

  const lines = toText(bodyHtml)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !isSignature(l));

  const allWords = lines.join(" ").split(/\s+/).filter(Boolean);
  const excerptWords = allWords.slice(0, EXCERPT_WORDS);
  const excerpt = excerptWords.join(" ") + (allWords.length > EXCERPT_WORDS ? "…" : "");

  return {
    id: e.id?.$t ?? url,
    title,
    deck,
    excerpt,
    url,
    published: published.slice(0, 10),
    words: allWords.length,
    minutes: Math.max(1, Math.round(allWords.length / WORDS_PER_MINUTE)),
  };
}

/** The sign-off at the end of every post. */
function isSignature(line: string) {
  return /^~\s*Bhargav/i.test(line) || /^If thoughts were followers/i.test(line);
}

/** HTML → plain text, keeping paragraph breaks. Never returns markup. */
function toText(html: string) {
  return decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h\d|li|blockquote)>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/\n\s*\n+/g, "\n");
}

const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  mdash: "—",
  ndash: "–",
  hellip: "…",
};

function decodeEntities(s: string) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isInteger(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m;
    }
    return NAMED[code.toLowerCase()] ?? m;
  });
}
