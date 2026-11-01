import type { Metadata } from "next";
import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import AnimatedPage from "./components/AnimatedPage";
import PageDirections from "./components/PageDirections";

// Shown for any address the site doesn't have, and wherever a page calls
// notFound() (a missing post, case study or resource), with a 404 status.
export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page doesn't exist on pradipta.online. Here's where to find case studies, the Journal, free resources and the cost estimator.",
  // Replaces the site-wide "index, follow", so the page sends one robots tag.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <HomeHeader />

      <AnimatedPage>
        <section className="blog-hero">
          <span data-reveal="fade-up" className="eyebrow">
            Error 404
          </span>

          <h1 data-split="words" className="blog-hero-title">
            This page took a wrong turn.
          </h1>

          <div data-reveal="fade-up" className="blog-hero-meta">
            <p className="body-copy max-w-[560px]">
              The link may be out of date, or the address has a typo. Either way, nothing&apos;s broken. Here&apos;s
              where most people are headed.
            </p>
          </div>
        </section>

        <PageDirections reveal />
      </AnimatedPage>

      <HomeFooter />
    </>
  );
}
