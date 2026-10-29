import Link from "next/link";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import AnimatedPage from "./AnimatedPage";
import { formatDate } from "../lib/blog";
import { LEGAL } from "../lib/legal";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/*
 * Layout for the privacy policy and the terms: title and date, a sticky list
 * of sections beside the text on wide screens, and the text itself in the
 * article typography.
 */
export default function LegalPage({
  title,
  intro,
  sections,
  related,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  related: { href: string; label: string };
}) {
  return (
    <>
      <HomeHeader />

      <AnimatedPage>
        <header className="post-hero">
          <p data-reveal="fade-up" className="eyebrow">
            Legal
          </p>

          <h1 data-split="words" className="post-title">
            {title}
          </h1>

          <p data-reveal="fade-up" className="post-standfirst">
            {intro}
          </p>

          <p data-reveal="fade-up" className="blog-meta mt-6">
            <span>
              Last updated <time dateTime={LEGAL.updated}>{formatDate(LEGAL.updated)}</time>
            </span>
          </p>
        </header>

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
              <Link href={related.href} className="legal-toc-related link-sweep">
                {related.label} →
              </Link>
            </nav>
          </aside>

          <article className="post-content legal-content">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.body}
              </section>
            ))}
          </article>
        </div>
      </AnimatedPage>

      <HomeFooter />
    </>
  );
}
