import { ArrowUpRight } from "lucide-react";
import type { ExternalLink } from "@/lib/content/schema";

/**
 * Renders a real external link, or — when the URL hasn't been supplied
 * (`href: null`) — a plain, clearly-labelled "pending" text. Never a dead link.
 */
export function ExternalLinkOrPending({ link }: { link: ExternalLink }) {
  if (!link.href) {
    return (
      <span className="inline-flex items-center gap-2 meta text-fg-faint">
        {link.label}
        <span className="border border-dashed border-line px-1.5 label">link pending</span>
      </span>
    );
  }
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 meta text-fg decoration-accent underline-offset-4 hover:underline"
    >
      {link.label}
      <ArrowUpRight aria-hidden className="size-3.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
