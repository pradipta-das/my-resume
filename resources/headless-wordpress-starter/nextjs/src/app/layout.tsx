import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { getSite } from "@/lib/wordpress";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: { siteName: site.name, type: "website" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();

  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-white focus:p-2">
          Skip to content
        </a>
        <SiteHeader name={site.name} />
        <main id="main" className="mx-auto max-w-5xl px-5 py-12">
          {children}
        </main>
        <footer className="border-t border-zinc-200">
          <p className="mx-auto max-w-5xl px-5 py-8 text-sm text-zinc-500">
            {site.name}
            {site.description ? ` · ${site.description}` : ""}
          </p>
        </footer>
      </body>
    </html>
  );
}
