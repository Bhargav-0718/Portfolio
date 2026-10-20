import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: {
    default: `${site.name} — ${site.archiveName}`,
    template: `%s · ${site.name}`,
  },
  description: `${site.hero.headline} ${site.descriptor}.`,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    siteName: site.archiveName,
    title: `${site.name} — ${site.archiveName}`,
    description: site.hero.supporting,
  },
};

export const viewport: Viewport = {
  themeColor: "#191919",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${fontVariables} antialiased`}>
      <body>
        <a href="#main" className="sr-only-focusable fixed top-3 left-3 z-50 bg-surface px-3 py-2 label">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
