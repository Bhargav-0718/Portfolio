/**
 * Résumé versions on display in the archive.
 *
 * To add or update a version:
 *   1. Put the PDF in public/cv/  (e.g. public/cv/bhargav-bidkar-tech.pdf)
 *   2. Add or edit the entry below.
 *   3. Run `npm run resume:previews` to render the page images.
 *
 * Rules (checked at build time):
 *   - ids must be unique; they become URLs: /resume/<id>
 *   - exactly one version is `primary`. /resume and /resume.pdf point to it.
 *   - the primary version must be public.
 *   - `file` must exist in public/.
 */

export type ResumeVersion = {
  /** URL slug: /resume/<id>. Keep it stable once shared. */
  id: string;
  /** Short name shown on the switcher, e.g. "Product" or "Tech". */
  label: string;
  /** One line on who this version is for. */
  focus: string;
  /** Path under public/. */
  file: string;
  /** File name visitors get when they download. */
  downloadName: string;
  /** "YYYY-MM" or "YYYY". */
  updated: string;
  primary?: boolean;
  /** Hidden versions keep their direct /resume/<id> URL but don't appear in switchers. Default true. */
  public?: boolean;
};

export const resumes: ResumeVersion[] = [
  {
    id: "product",
    label: "Product",
    focus: "Product management, discovery and AI products",
    file: "/cv/bhargav-bidkar-product.pdf",
    downloadName: "Bhargav_Bidkar_CV_Product.pdf",
    updated: "2026",
    primary: true,
  },
  // {
  //   id: "tech",
  //   label: "Tech",
  //   focus: "AI/ML engineering and software development",
  //   file: "/cv/bhargav-bidkar-tech.pdf",
  //   downloadName: "Bhargav_Bidkar_CV_Tech.pdf",
  //   updated: "2026-10",
  // },
];
