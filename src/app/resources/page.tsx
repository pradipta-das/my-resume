import type { Metadata } from "next";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import AnimatedPage from "../components/AnimatedPage";
import BlogCta from "../components/BlogCta";
import ResourceCard from "../components/ResourceCard";
import { RESOURCES } from "../lib/resources";
import { siteConfig } from "../lib/seo";

export const metadata: Metadata = {
  title: "Free WordPress, Shopify & Next.js Resources",
  description:
    "Free starters, plugins, themes and checklists from 15+ years of web development: a headless WordPress starter, a Shopify app, a block theme and more.",
  alternates: { canonical: "/resources" },
};

// For search engines: a collection of free resources by one author.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free Web Development Resources",
  url: `${siteConfig.url}/resources`,
  author: { "@type": "Person", name: siteConfig.name, url: `${siteConfig.url}/about` },
  hasPart: RESOURCES.map((resource) => ({
    "@type": resource.kind === "code" ? "SoftwareSourceCode" : "DigitalDocument",
    name: resource.title,
    description: resource.description,
    url: `${siteConfig.url}/resources/${resource.slug}`,
    isAccessibleForFree: true,
  })),
};

export default function ResourcesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <HomeHeader />

      <AnimatedPage>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="blog-hero">
          <span data-reveal="fade-up" className="eyebrow">
            Free Resources
          </span>

          <h1 data-split="words" className="blog-hero-title">
            From my workbench, free to take.
          </h1>

          <div data-reveal="fade-up" className="blog-hero-meta">
            <p className="body-copy max-w-[560px]">
              Most of what&apos;s here started as something I needed on a real project and kept
              reaching for afterwards: WordPress and Next.js starters, Shopify extensions,
              checklists and notes. Use them, change them, ship something with them.
            </p>
            <span className="blog-hero-count">
              {RESOURCES.length} {RESOURCES.length === 1 ? "resource" : "resources"}
            </span>
          </div>
        </section>

        {/* =====================================================
            RESOURCES
        ====================================================== */}

        <ul data-reveal="stagger" className="resource-grid">
          {RESOURCES.map((resource) => (
            <li key={resource.slug}>
              <ResourceCard resource={resource} as="h2" />
            </li>
          ))}
        </ul>

        <BlogCta />
      </AnimatedPage>

      <HomeFooter />
    </>
  );
}
