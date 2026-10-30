import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import AnimatedPage from "../../components/AnimatedPage";
import BlogCta from "../../components/BlogCta";
import { RESOURCES, getResource, type Resource } from "../../lib/resources";
import { pageAlternates, pageOpenGraph, siteConfig } from "../../lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Every resource is listed in lib/resources.ts; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return RESOURCES.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = getResource((await params).slug);
  if (!resource) return {};

  const title = resource.seoTitle;
  return {
    title,
    description: resource.description,
    alternates: pageAlternates(`/resources/${resource.slug}`),
    openGraph: pageOpenGraph(`/resources/${resource.slug}`, { type: "article" }),
  };
}

// For search engines: what the resource is, who made it, and where it sits
// in the site.
function structuredData(resource: Resource) {
  const url = `${siteConfig.url}/resources/${resource.slug}`;
  const external = resource.href?.startsWith("http");

  return [
    {
      "@context": "https://schema.org",
      "@type": resource.kind === "code" ? "SoftwareSourceCode" : "DigitalDocument",
      name: resource.title,
      description: resource.description,
      url,
      isAccessibleForFree: true,
      author: { "@type": "Person", name: siteConfig.name, url: `${siteConfig.url}/about` },
      ...(resource.version && { version: resource.version }),
      ...(resource.kind === "code" && external && { codeRepository: resource.href }),
      ...(resource.kind === "document" && { encodingFormat: "application/pdf" }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Free Resources", item: `${siteConfig.url}/resources` },
        { "@type": "ListItem", position: 3, name: resource.title, item: url },
      ],
    },
  ];
}

// The download button, or a note that the resource isn't ready yet.
function Download({ resource }: { resource: Resource }) {
  const { href } = resource;

  if (!href) {
    return (
      <section className="resource-download">
        <div>
          <p className="resource-download-title">Still on the workbench.</p>
          <p className="resource-download-note">
            This one isn&apos;t ready to download yet. It will appear right here as soon as it is.
          </p>
        </div>
        <Link href="/blog" data-magnetic className="resource-download-link link-redraw">
          Read The Journal meanwhile
        </Link>
      </section>
    );
  }

  const external = href.startsWith("http");
  return (
    <section className="resource-download">
      <div>
        <p className="resource-download-title">Free, with no sign-up.</p>
        <p className="resource-download-note">
          No email address needed. If it saves you some time, I&apos;d love to hear what you built with it.
        </p>
      </div>
      {external ? (
        <a href={href} target="_blank" rel="noopener" className="resource-download-btn">
          Get it <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <a href={href} download className="resource-download-btn">
          Download <span aria-hidden="true">↓</span>
        </a>
      )}
    </section>
  );
}

export default async function ResourcePage({ params }: Props) {
  const resource = getResource((await params).slug);
  if (!resource) notFound();

  // The next resource in listing order, wrapping round to the first (none
  // while this is the only one).
  const position = RESOURCES.indexOf(resource);
  const next = RESOURCES[(position + 1) % RESOURCES.length];

  const facts = [
    ["Format", resource.format],
    ["Works with", resource.worksWith],
    ["Licence", resource.licence],
    resource.version ? ["Version", resource.version] : ["Status", resource.href ? "Available" : "Coming soon"],
    ["Price", "Free"],
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(resource)).replace(/</g, "\\u003c") }}
      />

      <HomeHeader />

      <AnimatedPage>
        {/* =====================================================
            HERO
        ====================================================== */}

        <header className="post-hero">
          <Link href="/resources" className="post-back">
            <span className="link-sweep">← All resources</span>
          </Link>

          <p data-reveal="fade-up" className="eyebrow">
            Free Resource · {resource.type}
          </p>

          <h1 data-split="words" className="post-title">
            {resource.title}
          </h1>

          <p data-reveal="fade-up" className="post-standfirst">
            {resource.summary}
          </p>
        </header>

        {/* =====================================================
            FACTS AND DOWNLOAD
        ====================================================== */}

        <dl data-reveal="stagger" className="case-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <Download resource={resource} />

        {/* =====================================================
            WHY / WHAT'S INSIDE
        ====================================================== */}

        <section className="estimator-grid">
          <div className="content-block-large estimator-cell">
            <h2 data-reveal="fade-up" className="eyebrow">
              Why I Built It
            </h2>
            <div data-reveal="fade-up" className="case-story">
              {resource.story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="content-block-large">
            <h2 data-reveal="fade-up" className="eyebrow">
              What&apos;s Inside
            </h2>
            <ul data-reveal="fade-up" className="resource-includes">
              {resource.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* =====================================================
            GETTING STARTED
        ====================================================== */}

        <div className="post-layout">
          <aside className="post-aside">
            <dl className="post-facts resource-needs">
              <div>
                <dt>You&apos;ll need</dt>
                <dd>
                  <ul className="case-list">
                    {resource.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </aside>

          <article className="post-content">
            <h2 className="mt-0!">Getting started</h2>
            <ol>
              {resource.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>
              Stuck, or wondering whether it suits your project? Ask me on a{" "}
              <Link href="/free-consultation">free consultation call</Link>. Happy to help.
            </p>
          </article>
        </div>

        {/* =====================================================
            NEXT RESOURCE
        ====================================================== */}

        {next !== resource && (
          <Link href={`/resources/${next.slug}`} className="case-next">
            <span className="eyebrow">Next from the workbench</span>
            <span data-reveal="fade-up" className="case-next-title">
              {next.title} <span aria-hidden="true">→</span>
            </span>
          </Link>
        )}

        <BlogCta />
      </AnimatedPage>

      <HomeFooter />
    </>
  );
}
