import { site } from "@/config/site";

/** Contact channels that are actually configured. Unset (null) channels are left out. */
export function getContactLinks() {
  return [
    { label: "Email", href: `mailto:${site.contact.email}`, display: site.contact.email },
    { label: "LinkedIn", href: site.links.linkedin, display: "in/bhargav-bidkar" },
    { label: "GitHub", href: site.links.github, display: "Bhargav-0718" },
    site.links.huggingface
      ? { label: "Hugging Face", href: site.links.huggingface, display: "Hugging Face" }
      : null,
    { label: "Blog", href: site.blog.url, display: site.blog.name },
  ].filter((l): l is { label: string; href: string; display: string } => l !== null && Boolean(l.href));
}
