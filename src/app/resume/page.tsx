import type { Metadata } from "next";
import { RecordRoom } from "@/components/resume/RecordRoom";
import { getPrimaryResume } from "@/lib/resumes";

export const metadata: Metadata = {
  title: "Résumé · Record Room",
  description: "Bhargav Bidkar's résumé: inspect it full size or download the PDF.",
};

export default function ResumePage() {
  return <RecordRoom activeId={getPrimaryResume().id} />;
}
