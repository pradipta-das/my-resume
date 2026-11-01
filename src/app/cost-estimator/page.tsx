import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates, pageOpenGraph, siteConfig } from "../lib/seo";
import { RUSH_PREMIUM } from "../lib/estimate/pricing";
import { formatRange } from "../lib/estimate/format";
import { PUBLISHED_COST_GUIDES, guideRange } from "../lib/cost-guides";
import CostEstimatorForm from "../components/CostEstimatorForm";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";

const description =
  "Free website cost calculator for India and abroad: answer a few questions and get a price range in ₹ or your currency, a timeline and what drives the cost.";

export const metadata: Metadata = {
  title: "Website Cost Calculator India: Free ₹ Estimate",
  description,
  alternates: pageAlternates("/cost-estimator"),
  openGraph: pageOpenGraph("/cost-estimator"),
};

const rush = `${Math.round(RUSH_PREMIUM * 100)}%`;

// Plain text, as search engines read them too (see jsonLd).
const FAQS = [
  {
    question: "How does the website cost calculator work?",
    answer:
      "You describe your project: its type, size, features, design, technology, market and timeline. An AI model (Claude) estimates the hours it would take me, checked against how long my real projects take. The calculator then prices those hours at my own rates, in your currency.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. There's no account and no charge. Your estimate appears on screen straight away, and a PDF copy goes to the email address you give.",
  },
  {
    question: "Which currencies does it use?",
    answer:
      "Rupees for businesses in India, and US dollars, pounds, Canadian dollars or Australian dollars for those countries. Everywhere else, the estimate is in US dollars.",
  },
  {
    question: "How accurate is the estimate?",
    answer:
      "It's a ballpark for planning, not a quote. The range covers reasonable readings of your answers, and the assumptions it lists show what it took for granted. A firm price follows a short call about the details.",
  },
  {
    question: "Why is it lower than agency quotes?",
    answer:
      "You work directly with one experienced developer, with no account managers or handoffs, and I build on proven starters, themes and plugins where they fit. The estimate also shows what the same hours typically cost with other freelancers.",
  },
  {
    question: "Does an urgent deadline cost more?",
    answer: `Yes. When you need the site as soon as possible, or call the deadline critical, ${rush} is added, because other work has to move.`,
  },
];

// For search engines: the estimator is a free tool, made by the site's Person;
// the questions under it are an FAQ.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Website Cost Calculator",
    url: `${siteConfig.url}/cost-estimator`,
    description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: 0, priceCurrency: "INR" },
    creator: { "@id": `${siteConfig.url}/#person` },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

export default function CostEstimatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomeHeader />
      <CostEstimatorForm>
        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section className="estimator-grid">
          <div className="estimator-cell content-block-large">
            <span data-reveal="fade-up" className="eyebrow">
              The Method
            </span>

            <h2 data-split="words" className="display-title text-[clamp(2.375rem,4.25vw,4.25rem)]">
              How this website cost calculator works.
            </h2>
          </div>

          <div data-reveal="fade-up" className="content-block-large case-story mt-0">
            <p>
              Most website cost calculators multiply a page count by a fixed price. That misses what actually drives
              the cost: how many different layouts you need, which features and integrations the site depends on,
              how custom the design is, and how soon you need it.
            </p>
            <p>
              This one asks about all of that. An AI model reads your answers and estimates the hours the work
              would take me, calibrated against how long my own projects take, from a five-page portfolio to a
              SaaS product. It never sets the price: the calculator turns the hours into money at my own fixed
              rates, so two people with the same project get the same figure, in rupees for Indian businesses and
              in local currency for the US, UK, Canada and Australia.
            </p>
            <p>
              You get a price range, a build time, a breakdown by part of the work, the main cost drivers and the
              assumptions behind them. When the full project is a stretch, it also suggests a smaller first version
              you could launch with and grow from, and it shows what the same hours typically cost with other
              experienced freelancers in your market, so you can compare.
            </p>
            <p>
              It&apos;s a ballpark for planning, not a quote. If the numbers look workable,{" "}
              <Link href="/free-consultation" className="underline underline-offset-4">
                book a free consultation
              </Link>{" "}
              and we&apos;ll turn it into a firm price.
            </p>
          </div>
        </section>

        {/* =====================================================
            COST GUIDES (published ones only)
        ====================================================== */}

        {PUBLISHED_COST_GUIDES.length > 0 && (
          <section>
            <div className="estimate-intro">
              <div>
                <span data-reveal="fade-up" className="eyebrow">
                  Cost Guides
                </span>
                <h2 data-split="words" className="estimate-aside-title">
                  What projects cost
                </h2>
              </div>
            </div>
            <ul data-reveal="stagger" className="resource-grid">
              {PUBLISHED_COST_GUIDES.map((guide) => (
                <li key={guide.slug}>
                  <Link href={`/cost/${guide.slug}`} className="resource-card">
                    <span className="resource-card-type">{guide.type}</span>
                    <h3 className="resource-card-title">
                      <span className="link-sweep">{guide.title}</span>
                    </h3>
                    <p className="resource-card-copy">{guide.description}</p>
                    <span className="resource-card-meta">
                      <span className="resource-card-format">
                        {formatRange(guideRange(guide), guide.currencies[0])}
                      </span>
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
          </section>
        )}

        {/* =====================================================
            QUESTIONS
        ====================================================== */}

        <section className="estimator-grid">
          <div className="estimator-cell content-block-large">
            <span data-reveal="fade-up" className="eyebrow">
              Questions
            </span>

            <h2 data-split="words" className="display-title text-[clamp(2.375rem,4.25vw,4.25rem)]">
              Before you start.
            </h2>
          </div>

          <div data-reveal="fade-up" className="content-block-large estimator-faq">
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
            <div>
              <p>
                Your answers are kept with your estimate so we can talk it through, and marketing emails only go to
                you if you tick the box. See the{" "}
                <Link href="/privacy-policy" className="underline underline-offset-4">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </CostEstimatorForm>
      <HomeFooter />
    </>
  );
}
