/** Serializable résumé version passed from the server to the Record Room. */
export type ResumeExhibitVersion = {
  id: string;
  exhibit: string;
  label: string;
  focus: string;
  file: string;
  downloadName: string;
  updatedLabel: string;
  pages: { src: string; width: number; height: number }[];
};
