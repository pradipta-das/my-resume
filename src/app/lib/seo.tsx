import type { Metadata } from "next";

export const siteConfig = {
  name: "Pradipta Das",
  title: "Pradipta Das | Freelance WordPress, Shopify & Next.js Developer",
  description:
    "Notes and lessons from 15+ years as a freelance web developer and consultant, building WordPress sites, Shopify stores and Next.js web applications.",
  url: "https://pradipta.online",
  locale: "en_IN",
  // Public profiles: shown in the footer and listed as "sameAs" in structured data.
  profiles: {
    linkedin: "https://www.linkedin.com/in/pradipta-fullstack-dev",
    x: "https://x.com/pradipta_dev",
  },
};

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/*
 * A page's canonical URL, plus the journal's RSS feed so feed readers can find
 * it from any page. (Like openGraph, alternates merges shallowly: a page's own
 * block would otherwise drop the feed link.)
 */
export function pageAlternates(path?: string): Metadata["alternates"] {
  return {
    // Left out on the layout, so a page without its own never inherits one.
    ...(path && { canonical: path }),
    types: { "application/rss+xml": [{ url: "/feed.xml", title: "The Journal by Pradipta Das" }] },
  };
}

/*
 * A page's Open Graph block. Next.js merges metadata shallowly, so a page that
 * sets its own openGraph replaces the layout's entirely; building every page's
 * block here keeps the site name, locale and URL on all of them. Share images
 * come from the opengraph-image files, so they're not set here.
 */
export function pageOpenGraph(path?: string, extra: Partial<OpenGraph> = {}): OpenGraph {
  return {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    // Left out on the layout, so a page without its own never inherits one.
    ...(path && { url: path }),
    ...extra,
  } as OpenGraph;
}
