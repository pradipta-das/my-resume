import type { Metadata } from "next";
import { pageAlternates, pageOpenGraph } from "../lib/seo";
import Link from "next/link";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import AnimatedPage from "../components/AnimatedPage";
import BlogCta from "../components/BlogCta";
import CaseStudyCard from "../components/CaseStudyCard";
import { getCaseStudies } from "../lib/case-studies";
import { withBuildFallback } from "../lib/build-fallback";

export const metadata: Metadata = {
  title: "Case Studies: Web Design & Development Projects",
  description:
    "Selected website and web application projects by Pradipta Das: the challenge, the approach and the results, from WordPress builds to Next.js applications.",
  alternates: pageAlternates("/case-studies"),
  openGraph: pageOpenGraph("/case-studies"),
};

export default async function CaseStudiesPage() {
  const studies = await withBuildFallback("Case studies", getCaseStudies, []);

  return (
    <>
      <HomeHeader />

      <AnimatedPage>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="blog-hero">
          <span data-reveal="fade-up" className="eyebrow">
            Case Studies
          </span>

          <h1 data-split="words" className="blog-hero-title">
            Work I&apos;m proud of, and the thinking behind it.
          </h1>

          <div data-reveal="fade-up" className="blog-hero-meta">
            <p className="body-copy max-w-[520px]">
              A closer look at projects I&apos;ve designed and built: the problem each client brought, how we solved
              it, and what changed afterwards.
            </p>
            {studies.length > 0 && (
              <span className="blog-hero-count">
                {studies.length} {studies.length === 1 ? "project" : "projects"}
              </span>
            )}
          </div>
        </section>

        {/* =====================================================
            PROJECTS
        ====================================================== */}

        {studies.length > 0 ? (
          <section className="work-grid">
            {studies.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i + 1} />
            ))}
          </section>
        ) : (
          <section className="statement">
            <p data-reveal="fade-up" className="section-caption">
              New case studies are on their way.
            </p>
            <p data-reveal="fade-up" className="body-copy mx-auto mt-4 max-w-[480px]">
              In the meantime, I&apos;m happy to walk you through recent work on a{" "}
              <Link href="/free-consultation" className="underline underline-offset-4">
                free call
              </Link>
              .
            </p>
          </section>
        )}

        <BlogCta />
      </AnimatedPage>

      <HomeFooter />
    </>
  );
}
