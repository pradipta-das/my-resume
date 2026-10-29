import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import AnimatedPage from "../../components/AnimatedPage";
import BlogCta from "../../components/BlogCta";
import { getCaseStudies, getCaseStudy, type CaseStudyResult } from "../../lib/case-studies";

type Props = { params: Promise<{ slug: string }> };

// Narrower images would blur if stretched across the page.
const FULL_BLEED_MIN_WIDTH = 1200;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await getCaseStudy((await params).slug);
  if (!study) return {};

  const title = `Case Study: ${study.title}`;
  return {
    title,
    description: study.excerpt,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      type: "article",
      title,
      description: study.excerpt,
      ...(study.image && { images: [{ url: study.image.url }] }),
    },
  };
}

// Paragraphs of a plain-text field, split on blank lines.
const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

// Whole numbers count up ("+40%" → "+", 40, "%"); anything else, like "2.1s",
// is shown as written.
function ResultValue({ value }: { value: string }) {
  const match = value.match(/^(\D*?)(\d+)(\D*)$/);
  if (!match) return <>{value}</>;

  const [, before, number, after] = match;
  return (
    <>
      {before}
      <span data-count>{number}</span>
      {after}
    </>
  );
}

function Results({ results }: { results: CaseStudyResult[] }) {
  return (
    <section className="case-results" style={{ "--cols": Math.min(results.length, 4) } as React.CSSProperties}>
      {results.map((result) => (
        <div key={result.label} data-divider className="case-result">
          <p className="case-result-value">
            <ResultValue value={result.value} />
          </p>
          <p className="case-result-label">{result.label}</p>
        </div>
      ))}
    </section>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const [study, all] = await Promise.all([getCaseStudy(slug), getCaseStudies()]);
  if (!study) notFound();

  // The next project in listing order, wrapping round to the first.
  const position = all.findIndex((item) => item.slug === study.slug);
  const next = all.length > 1 ? all[(position + 1) % all.length] : null;

  const facts = [
    ["Client", study.client],
    ["Year", study.year],
    ["Industry", study.industry],
    ["My role", study.role],
    ["Duration", study.duration],
  ].filter(([, value]) => value);

  const story = [
    ["The Challenge", study.challenge],
    ["The Approach", study.approach],
  ].filter(([, text]) => text.trim());

  const hasContent = study.content.replace(/<[^>]*>/g, "").trim() !== "";

  return (
    <>
      <HomeHeader />

      <AnimatedPage>
        {/* =====================================================
            HERO
        ====================================================== */}

        <header className="post-hero">
          <Link href="/case-studies" className="post-back">
            <span className="link-sweep">← All case studies</span>
          </Link>

          <p data-reveal="fade-up" className="eyebrow">
            Case Study{study.client && ` · ${study.client}`}
          </p>

          <h1 data-split="words" className="post-title">
            {study.title}
          </h1>

          {study.excerpt && (
            <p data-reveal="fade-up" className="post-standfirst">
              {study.excerpt}
            </p>
          )}
        </header>

        {/* =====================================================
            FACTS
        ====================================================== */}

        {(facts.length > 0 || study.liveUrl) && (
          <dl data-reveal="stagger" className="case-facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            {study.liveUrl && (
              <div>
                <dt>Live site</dt>
                <dd>
                  {/* A normal, followed link: the client's site is work I stand
                      behind. No "noreferrer", so their analytics can see the
                      visit came from here. */}
                  <a href={study.liveUrl} target="_blank" rel="noopener" className="link-sweep">
                    Visit ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* Large images run full width; smaller ones sit at their natural
            size in a frame, rather than being stretched until they blur. */}
        {study.image &&
          (study.image.width >= FULL_BLEED_MIN_WIDTH ? (
            <div data-reveal="image" data-drift className="post-image">
              <Image
                src={study.image.url}
                alt={study.image.alt}
                width={study.image.width}
                height={study.image.height}
                sizes="100vw"
                className="image-cover"
                priority
              />
            </div>
          ) : (
            <div className="post-image-framed">
              <div data-reveal="image">
                <Image
                  src={study.image.url}
                  alt={study.image.alt}
                  width={study.image.width}
                  height={study.image.height}
                  sizes={`${study.image.width}px`}
                  priority
                />
              </div>
            </div>
          ))}

        {study.results.length > 0 && <Results results={study.results} />}

        {/* =====================================================
            CHALLENGE / APPROACH
        ====================================================== */}

        {story.length > 0 && (
          <section className="estimator-grid">
            {story.map(([title, text], i) => (
              <div key={title} className={`content-block-large${i === 0 && story.length > 1 ? " estimator-cell" : ""}`}>
                <span data-reveal="fade-up" className="eyebrow">
                  {title}
                </span>
                <div data-reveal="fade-up" className="case-story">
                  {paragraphs(text).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* =====================================================
            THE STORY
        ====================================================== */}

        {(hasContent || study.services.length > 0 || study.stack.length > 0) && (
          <div className="post-layout">
            <aside className="post-aside">
              <dl className="post-facts">
                {study.services.length > 0 && (
                  <div>
                    <dt>Services</dt>
                    <dd>
                      <ul className="case-list">
                        {study.services.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                {study.stack.length > 0 && (
                  <div>
                    <dt>Technology</dt>
                    <dd>
                      <ul className="case-list">
                        {study.stack.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </aside>

            {/* Content comes from the site's own WordPress, which sanitises it. */}
            {hasContent ? (
              <article className="post-content" dangerouslySetInnerHTML={{ __html: study.content }} />
            ) : (
              <div />
            )}
          </div>
        )}

        {/* =====================================================
            NEXT PROJECT
        ====================================================== */}

        {next && (
          <Link href={`/case-studies/${next.slug}`} className="case-next">
            <span className="eyebrow">Next case study</span>
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
