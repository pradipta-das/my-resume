import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import AnimatedPage from "../../components/AnimatedPage";
import {
  COST_GUIDES,
  estimatorLink,
  fillPrices,
  getCostGuide,
  guideRange,
  optionPrice,
  relatedGuides,
  type CostGuide,
} from "../../lib/cost-guides";
import { freelancePrice, priceHours } from "../../lib/estimate/pricing";
import { formatRange } from "../../lib/estimate/format";
import { formatDate } from "../../lib/blog";
import { pageAlternates, pageOpenGraph, siteConfig } from "../../lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Every guide is listed in lib/cost-guides.ts; any other slug is a 404.
export const dynamicParams = false;

// Drafts are built too, so they can be checked at their address.
export function generateStaticParams() {
  return COST_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getCostGuide((await params).slug);
  if (!guide) return {};

  return {
    title: guide.seoTitle,
    description: guide.description,
    alternates: pageAlternates(`/cost/${guide.slug}`),
    openGraph: pageOpenGraph(`/cost/${guide.slug}`, { type: "article" }),
    // Replaces the site-wide "index, follow" until the guide is published.
    ...(guide.draft && { robots: { index: false, follow: false } }),
  };
}

const weeks = ([low, high]: readonly [number, number]) =>
  low === high ? `${low} ${low === 1 ? "week" : "weeks"}` : `${low}–${high} weeks`;

// For search engines: the guide as an article by the site's Person, its
// questions, and where it sits in the site.
function structuredData(guide: CostGuide) {
  const url = `${siteConfig.url}/cost/${guide.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url,
      dateModified: guide.updated,
      author: { "@id": `${siteConfig.url}/#person` },
      publisher: { "@id": `${siteConfig.url}/#person` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: fillPrices(faq.answer, guide) },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Website Cost Calculator", item: `${siteConfig.url}/cost-estimator` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
  ];
}

export default async function CostGuidePage({ params }: Props) {
  const guide = getCostGuide((await params).slug);
  if (!guide) notFound();

  const [currency, ...otherCurrencies] = guide.currencies;
  const allTimes = guide.options.flatMap((option) => option.weeks);
  const related = relatedGuides(guide);
  const example = guide.example;

  const sections = [
    { id: "prices", title: "Prices at a glance" },
    ...(guide.comparison ? [{ id: "compare", title: "Freelancer, agency or DIY" }] : []),
    { id: "running-costs", title: "Running costs" },
    { id: "cost-drivers", title: "What changes the price" },
    { id: "example", title: "A worked example" },
    { id: "faq", title: "Questions" },
  ];

  const facts = [
    ["Price range", formatRange(guideRange(guide), currency)],
    ["Build time", weeks([Math.min(...allTimes), Math.max(...allTimes)])],
    ["Prices in", guide.currencies.join(", ")],
    ["Updated", formatDate(guide.updated)],
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(guide)).replace(/</g, "\\u003c") }}
      />

      <HomeHeader />

      <AnimatedPage>
        {/* =====================================================
            HERO: the answer first
        ====================================================== */}

        <header className="post-hero">
          <Link href="/cost-estimator" className="post-back">
            <span className="link-sweep">← Website cost calculator</span>
          </Link>

          <p data-reveal="fade-up" className="eyebrow">
            Cost Guide · {guide.type}
          </p>

          <h1 data-split="words" className="post-title">
            {guide.title}
          </h1>

          <p data-reveal="fade-up" className="post-standfirst">
            {fillPrices(guide.answer, guide)}
          </p>
        </header>

        <dl data-reveal="stagger" className="case-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {guide.draft && (
          <section className="resource-download">
            <div>
              <p className="resource-download-title">Draft with demo figures.</p>
              <p className="resource-download-note">
                Hidden from search engines and the site&apos;s links. Replace the demo content in
                lib/cost-guides.ts, then set draft to false to publish it.
              </p>
            </div>
          </section>
        )}

        {/* =====================================================
            THE GUIDE
        ====================================================== */}

        <div className="post-layout">
          <aside className="post-aside">
            <nav className="legal-toc" aria-label="On this page">
              <p className="legal-toc-title">On this page</p>
              <ol>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="link-sweep">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
              <Link href={estimatorLink(guide)} className="legal-toc-related link-sweep">
                Estimate your project →
              </Link>
            </nav>
          </aside>

          <article className="post-content legal-content">
            <section id="prices">
              <h2>Prices at a glance</h2>
              <p>
                What each kind of project costs with me, next to what the same work typically costs with other
                experienced freelancers.
              </p>
              <div className="wp-block-table">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Option</th>
                      <th scope="col">My price</th>
                      {otherCurrencies.map((other) => (
                        <th key={other} scope="col">
                          In {other}
                        </th>
                      ))}
                      <th scope="col">Typical freelancer</th>
                      <th scope="col">Build time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guide.options.map((option) => (
                      <tr key={option.name}>
                        <th scope="row">
                          {option.name}
                          <span className="cost-option-includes">{option.includes}</span>
                        </th>
                        <td className="whitespace-nowrap">{formatRange(optionPrice(option, currency), currency)}</td>
                        {otherCurrencies.map((other) => (
                          <td key={other} className="whitespace-nowrap">
                            {formatRange(optionPrice(option, other), other)}
                          </td>
                        ))}
                        <td className="whitespace-nowrap">{formatRange(freelancePrice(option.hours, currency), currency)}</td>
                        <td className="whitespace-nowrap">{weeks(option.weeks)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                These are ballparks for planning, not quotes. For a figure based on your own project, use the{" "}
                <Link href={estimatorLink(guide)}>free cost calculator</Link>.
              </p>
            </section>

            {guide.comparison && (
              <section id="compare">
                <h2>Freelancer, agency or DIY</h2>
                <p>{guide.comparison.intro}</p>
                <div className="wp-block-table">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Option</th>
                        <th scope="col">Typical price</th>
                        <th scope="col">Best for</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guide.comparison.rows.map((row) => (
                        <tr key={row.option}>
                          <th scope="row">{row.option}</th>
                          <td>{row.price}</td>
                          <td>{row.suits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <section id="running-costs">
              <h2>Running costs</h2>
              <p>What you pay after launch, whoever builds the site.</p>
              <div className="wp-block-table">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Cost</th>
                      <th scope="col">Typical price</th>
                      <th scope="col">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guide.runningCosts.map((row) => (
                      <tr key={row.item}>
                        <th scope="row">{row.item}</th>
                        <td>{row.cost}</td>
                        <td>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="cost-drivers">
              <h2>What changes the price</h2>
              <ul>
                {guide.drivers.map((driver) => (
                  <li key={driver.title}>
                    <strong>{driver.title}.</strong> {driver.text}
                  </li>
                ))}
              </ul>
            </section>

            <section id="example">
              <h2>A worked example</h2>
              <h3>{example.title}</h3>
              <p>{example.brief}</p>
              <ul>
                {example.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                <strong>
                  Cost: {formatRange(priceHours(example.hours, currency), currency)} · Build time: {weeks(example.weeks)}
                </strong>
              </p>
              <p>{example.outcome}</p>
              {example.caseStudy && (
                <p>
                  <Link href={`/case-studies/${example.caseStudy}`}>Read the full case study</Link>
                </p>
              )}
            </section>

            <section id="faq">
              <h2>Questions</h2>
              {guide.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p className="mt-3">{fillPrices(faq.answer, guide)}</p>
                </div>
              ))}
            </section>
          </article>
        </div>

        {/* =====================================================
            RELATED GUIDES
        ====================================================== */}

        {related.length > 0 && (
          <ul data-reveal="stagger" className="resource-grid">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/cost/${item.slug}`} className="resource-card">
                  <span className="resource-card-type">Cost Guide · {item.type}</span>
                  <h2 className="resource-card-title">
                    <span className="link-sweep">{item.title}</span>
                  </h2>
                  <p className="resource-card-copy">{item.description}</p>
                  <span className="resource-card-meta">
                    <span className="resource-card-format">{formatRange(guideRange(item), item.currencies[0])}</span>
                    <span className="resource-card-status">
                      Read
                      <span aria-hidden="true" className="resource-card-arrow">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* =====================================================
            CTA: the estimator, set up for this kind of project
        ====================================================== */}

        <section className="blog-cta">
          <div className="blog-cta-title">
            <h2 data-split="words" className="display-title">
              What would yours cost?
            </h2>
          </div>

          <div data-reveal="fade-up" className="blog-cta-body">
            <p className="body-copy max-w-[440px]">
              Answer a few questions about your project and get a price range, a timeline and what drives the cost,
              in a couple of minutes.
            </p>

            <div className="blog-cta-links">
              <Link href={estimatorLink(guide)} data-magnetic className="display-link link-redraw">
                Estimate your project
              </Link>
              <Link href="/free-consultation" data-magnetic className="display-link link-sweep">
                Book a free consultation
              </Link>
            </div>
          </div>
        </section>
      </AnimatedPage>

      <HomeFooter />
    </>
  );
}
