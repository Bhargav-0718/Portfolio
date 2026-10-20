import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordRoom } from "@/components/resume/RecordRoom";
import { getResume, getResumes } from "@/lib/resumes";

export function generateStaticParams() {
  return getResumes().map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/resume/[id]">): Promise<Metadata> {
  const { id } = await params;
  const resume = getResume(id);
  if (!resume) return {};
  return {
    title: `Résumé · ${resume.label}`,
    description: `Bhargav Bidkar's résumé (${resume.label} version): ${resume.focus}.`,
    // Hidden versions are shared by direct link only.
    ...(resume.public ? {} : { robots: { index: false } }),
  };
}

export default async function ResumeVersionPage({ params }: PageProps<"/resume/[id]">) {
  const { id } = await params;
  if (!getResume(id)) notFound();
  return <RecordRoom activeId={id} />;
}
