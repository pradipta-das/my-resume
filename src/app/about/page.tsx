import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import AnimatedPage from "../components/AnimatedPage";
import BlogCard from "../components/BlogCard";
import { getPosts } from "../lib/blog";
import { withBuildFallback } from "../lib/build-fallback";
import { pageAlternates, pageOpenGraph, siteConfig } from "../lib/seo";

export const metadata: Metadata = {
  // Absolute: the layout's "| Pradipta Das" suffix would repeat the name.
  title: { absolute: "About Pradipta Das | Freelance Web Developer & Consultant" },
  description:
    "Pradipta Das, freelance web developer and consultant with 15+ years' experience building fast, findable websites with WordPress, Shopify and Next.js.",
  alternates: pageAlternates("/about"),
  openGraph: pageOpenGraph("/about"),
};

const PRINCIPLES = [
  {
    title: "Listen first",
    copy: "Before any design or code, I want to understand your business, your customers and what success looks like for you.",
  },
  {
    title: "Honest advice",
    copy: "If a template will do, I'll tell you. If you don't need me at all, I'll tell you that too. Good advice is worth more than a sale.",
  },
  {
    title: "Built to last",
    copy: "Clean, well-structured code and a site you can update yourself, so it keeps working long after launch day.",
  },
  {
    title: "Speed is a feature",
    copy: "Fast pages keep visitors, rank better and sell more. Performance is part of the brief from day one, never an afterthought.",
  },
];

const STACK = [
  "Next.js",
  "React",
  "WordPress",
  "Shopify",
  "Webflow",
  "Headless CMS",
  "Motion & GSAP",
  "Technical SEO",
  "Core Web Vitals",
  "Accessibility",
  "AI integrations",
];

// Same figures as the homepage.
const STATS = [
  { value: 100, label: "Projects" },
  { value: 60, label: "Brands" },
  { value: 50, label: "Partners" },
];

// For search engines: this page is about a person, and who that person is.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${siteConfig.url}/about`,
  mainEntity: {
    "@type": "Person",
    // The same Person the homepage describes.
    "@id": `${siteConfig.url}/#person`,
    sameAs: Object.values(siteConfig.profiles),
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/img-5.png`,
    jobTitle: "Freelance Web Developer & Digital Consultant",
    knowsAbout: ["Web development", "Next.js", "React", "WordPress", "Shopify", "Technical SEO", "Web performance", "UX design"],
  },
};

export default async function AboutPage() {
  const { posts } = await withBuildFallback("Latest journal posts", () => getPosts(1, 3), {
    posts: [],
    total: 0,
    pages: 0,
  });

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

        <section className="estimator-hero">
          <span data-reveal="fade-up" className="eyebrow">
            About Me
          </span>

          <h1 data-split="words" className="estimator-hero-title">
            Hi, I&apos;m Pradipta.
          </h1>

          <p data-reveal="fade-up" className="about-hero-lead">
            I design and build websites that are fast, easy to use and easy to find, for businesses with big ideas
            and agencies with full plates.
          </p>
        </section>

        {/* =====================================================
            THE SHORT VERSION
        ====================================================== */}

        <section className="estimator-grid">
          <div data-reveal="image" data-drift className="estimator-cell about-portrait">
            <Image
              src="/img-5.png"
              alt="Pradipta Das standing in a café doorway with a coffee"
              width={736}
              height={1308}
              sizes="(min-width: 768px) 50vw, 100vw"
              loading="eager"
              className="image-cover"
            />
          </div>

          <div className="content-block-large flex flex-col justify-center">
            <span data-reveal="fade-up" className="eyebrow">
              The Short Version
            </span>

            <h2 data-split="words" className="display-title text-[clamp(2.375rem,4.25vw,4.25rem)]">
              Where logic meets colour.
            </h2>

            <div data-reveal="stagger" className="about-story">
              <p>
                I&apos;m a freelance web developer, digital consultant and technical architect. Put simply, I help
                businesses turn ideas into websites that work as well as they look.
              </p>
              <p>
                Most of my days are spent somewhere between design and code: working out how a site should behave,
                then building it properly in Next.js, React, WordPress or Shopify. I care a lot about the parts nobody
                sees, like clean structure, accessibility, performance and technical SEO, because they&apos;re what make
                the parts everybody sees actually work.
              </p>
              <p>
                I work directly with founders and business owners, and quietly alongside agencies who need a
                dependable developer on the team, from India to the US, the UK, Canada and Australia. Either way,
                you talk to me, not an account manager.
              </p>
              <p className="about-signature">Pradipta</p>
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW I WORK
        ====================================================== */}

        <section className="about-principles-head">
          <span data-reveal="fade-up" className="eyebrow">
            How I Work
          </span>
          <h2 data-split="words" className="display-title text-[clamp(2.375rem,4.25vw,4.25rem)]">
            A few things I believe.
          </h2>
        </section>

        <section data-reveal="stagger" className="about-principles">
          {PRINCIPLES.map((principle, i) => (
            <article key={principle.title} className="about-principle">
              <span className="about-principle-index">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display-heading">{principle.title}</h3>
              <p className="body-copy mt-3">{principle.copy}</p>
            </article>
          ))}
        </section>

        {/* =====================================================
            WHAT I WORK WITH
        ====================================================== */}

        <section className="about-stack">
          <span data-reveal="fade-up" className="eyebrow">
            What I Work With
          </span>

          <ul data-reveal="stagger" className="about-stack-list">
            {STACK.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p data-reveal="fade-up" className="estimate-microcopy max-w-[560px]">
            The right tool depends on the job. I&apos;ll recommend whatever suits your project and budget, not
            whatever I happen to like best.
          </p>
        </section>

        {/* =====================================================
            NUMBERS
        ====================================================== */}

        <section className="estimator-grid">
          <div className="estimator-cell content-block-large">
            <span data-reveal="fade-up" className="eyebrow">
              So Far
            </span>

            <h2 data-split="words" className="display-heading">
              Success isn&apos;t measured in projects. It&apos;s measured in trust.
            </h2>

            <p data-reveal="fade-up" className="body-copy mt-4 max-w-[520px]">
              Behind every one of these numbers is someone who trusted me with their idea. Many of them still do.
            </p>
          </div>

          <div className="content-block-large flex flex-col justify-end">
            <div className="stats">
              {STATS.map((stat) => (
                <div key={stat.label} data-divider className="stat last:before:hidden">
                  <div className="stat-number">
                    <span data-count>{stat.value}</span>
                    <sup>+</sup>
                  </div>

                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            FROM THE JOURNAL
        ====================================================== */}

        {posts.length > 0 && (
          <section className="blog-list">
            <div className="blog-list-head">
              <h2 data-reveal="fade-up" className="section-caption">
                From the journal
              </h2>
              <Link href="/blog" className="link-sweep about-journal-link">
                All articles →
              </Link>
            </div>

            <div className="blog-grid">
              {posts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* =====================================================
            CLOSING
        ====================================================== */}

        <section className="blog-cta">
          <div className="blog-cta-title">
            <h2 data-split="words" className="display-title">
              Let&apos;s make something worth talking about.
            </h2>
          </div>

          <div data-reveal="fade-up" className="blog-cta-body">
            <p className="body-copy max-w-[440px]">
              Tell me what you&apos;re working on. The first conversation is free, and there&apos;s never any
              pressure.
            </p>

            <div className="blog-cta-links">
              <Link href="/free-consultation" data-magnetic className="display-link link-redraw">
                Book a free call
              </Link>
              <Link href="/cost-estimator" data-magnetic className="display-link link-sweep">
                Estimate your project
              </Link>
            </div>
          </div>
        </section>
      </AnimatedPage>

      <HomeFooter />
    </>
  );
}
