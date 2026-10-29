import Link from "next/link";

// Closing band on the blog pages: from reading to starting a project.
export default function BlogCta() {
  return (
    <section className="blog-cta">
      <div className="blog-cta-title">
        <h2 data-split="words" className="display-title">
          Have a project in mind?
        </h2>
      </div>

      <div data-reveal="fade-up" className="blog-cta-body">
        <p className="body-copy max-w-[440px]">
          Whether it&apos;s a new website, a redesign or something more ambitious, let&apos;s put some numbers
          around your idea.
        </p>

        <div className="blog-cta-links">
          <Link href="/cost-estimator" data-magnetic className="display-link link-redraw">
            Estimate your project
          </Link>
          <Link href="/free-consultation" data-magnetic className="display-link link-sweep">
            Book a free consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
