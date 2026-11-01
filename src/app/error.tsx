"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import Link from "next/link";
import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import PageDirections from "./components/PageDirections";
import { LEGAL } from "./lib/legal";

/*
 * Shown when a page fails to render, for example when WordPress doesn't
 * answer. The root layout stays, so the page keeps its fonts and cookie
 * banner. Errors in the root layout itself would need global-error.tsx.
 *
 * Plain markup on purpose (no GSAP entrance): the page should appear even if
 * the error came from the animations.
 */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  // In production the message is generic; the digest matches the server log.
  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <title>Something Went Wrong | Pradipta Das</title>
      <meta name="robots" content="noindex" />

      <HomeHeader />

      <main className="page">
        <section className="blog-hero">
          <span className="eyebrow">Something went wrong</span>

          <h1 className="blog-hero-title">This page didn&apos;t load properly.</h1>

          <div className="blog-hero-meta">
            <div className="max-w-[560px]">
              <p className="body-copy">
                That&apos;s on my side, not yours. It&apos;s usually a brief hiccup, so trying again often works. If
                it keeps happening, email me at <a href={`mailto:${LEGAL.email}`} className="link-redraw">{LEGAL.email}</a>
                {digest ? <> and mention reference {digest}</> : null}.
              </p>

              <div className="blog-cta-links">
                <button type="button" onClick={() => retry()} className="display-link link-redraw cursor-pointer">
                  Try again
                </button>
                <Link href="/" className="display-link link-sweep">
                  Go to the homepage
                </Link>
              </div>
            </div>
          </div>
        </section>

        <PageDirections />
      </main>

      <HomeFooter />
    </>
  );
}
