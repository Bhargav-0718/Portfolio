import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseFile } from "@/components/casefile/CaseFile";
import { Room } from "@/components/rooms/Room";
import { getCase, getCases } from "@/lib/content";

export function generateStaticParams() {
  return getCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/museum/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCase(slug);
  if (!entry) return {};
  return {
    title: `${entry.id} · ${entry.title}`,
    description: `${entry.question} ${entry.premise}`,
  };
}

/** A case file, filed in the Museum of Unfinished Questions. */
export default async function CasePage({ params }: PageProps<"/museum/[slug]">) {
  const { slug } = await params;
  const entry = getCase(slug);
  if (!entry) notFound();

  return (
    <Room id="museum">
      <CaseFile entry={entry} />
    </Room>
  );
}
