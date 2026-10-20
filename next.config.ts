import type { NextConfig } from "next";
import { resumes } from "./content/resumes";

const primaryResume = resumes.find((r) => r.primary);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // The Case Archive became the Museum of Unfinished Questions.
      { source: "/archive", destination: "/museum", permanent: true },
      { source: "/archive/:path*", destination: "/museum/:path*", permanent: true },
      // Stable, shareable link that always serves the current primary résumé.
      ...(primaryResume
        ? [{ source: "/resume.pdf", destination: primaryResume.file, permanent: false }]
        : []),
      // Direct PDF link per version: /resume/<id>.pdf
      ...resumes.map((r) => ({ source: `/resume/${r.id}.pdf`, destination: r.file, permanent: false })),
    ];
  },
};

export default nextConfig;
