import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { getBlogPosts, type BlogPost } from "@/lib/blog";
import { cx } from "@/lib/cx";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * "The writing desk": essays from Through My Mind's Eye, fetched from the
 * blog. Each card links out to the full essay; the blog stays its home.
 */
export async function WritingDesk() {
  const posts = await getBlogPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="border border-dashed border-line-strong p-8">
        <p className="text-fg-muted">
          The essays couldn&apos;t be fetched just now. They live on the blog itself.
        </p>
        <ButtonLink
          href={site.blog.url}
          className="mt-5"
          icon={<ArrowUpRight aria-hidden className="size-3.5" />}
        >
          Read {site.blog.name}
        </ButtonLink>
      </div>
    );
  }

  const [latest, ...rest] = posts;

  return (
    <div>
      <ul className="grid gap-6 lg:grid-cols-2">
        <li className="lg:col-span-2">
          <Reveal>
            <EssayCard post={latest} lead />
          </Reveal>
        </li>
        {rest.map((post, i) => (
          <li key={post.id} className={cx(rest.length % 2 === 1 && i === rest.length - 1 && "lg:col-span-2")}>
            <Reveal delay={(i % 2) * 100} className="h-full">
              <EssayCard post={post} />
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif text-[1.1rem] text-fg-muted italic">{site.blog.signature}</p>
        <ButtonLink
          href={site.blog.url}
          variant="primary"
          icon={<ArrowUpRight aria-hidden className="size-3.5" />}
        >
          Visit {site.blog.name}
        </ButtonLink>
      </div>
    </div>
  );
}

/** A typed manuscript page. The whole card links to the essay on the blog. */
function EssayCard({ post, lead }: { post: BlogPost; lead?: boolean }) {
  return (
    <article
      className={cx(
        "surface-paper group relative flex h-full flex-col gap-4 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.9)] transition-transform duration-(--duration-slow) ease-(--ease-archive) hover:-translate-y-1",
        lead ? "p-7 sm:p-10" : "p-6 sm:p-8",
      )}
    >
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 label text-fg-faint">
        <time dateTime={post.published} className="text-accent">
          {dateFormat.format(new Date(`${post.published}T00:00:00`))}
        </time>
        <span>·</span>
        <span>{post.minutes} min read</span>
        {lead ? (
          <>
            <span>·</span>
            <span>Latest</span>
          </>
        ) : null}
      </p>
      <h3 className={lead ? "text-headline" : "text-title"}>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[var(--focus)]"
        >
          {post.title}
          <span className="sr-only"> (opens the essay on {site.blog.name} in a new tab)</span>
        </a>
      </h3>
      {post.deck && post.deck !== post.title ? (
        <p className={cx("font-serif text-fg italic", lead ? "text-lede" : "text-[1.1rem]")}>{post.deck}</p>
      ) : null}
      <p className={cx("text-fg-muted", lead && "measure text-[1.05rem]")}>{post.excerpt}</p>
      <p className="mt-auto inline-flex items-center gap-1 pt-2 label text-fg group-hover:text-accent">
        Read the essay
        <ArrowUpRight aria-hidden className="size-3.5" />
      </p>
    </article>
  );
}
