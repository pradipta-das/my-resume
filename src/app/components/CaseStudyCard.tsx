import Image from "next/image";
import Link from "next/link";
import type { CaseStudySummary } from "../lib/case-studies";

// One project on the case studies listing: image first, then the facts.
export default function CaseStudyCard({ study, index }: { study: CaseStudySummary; index: number }) {
  const href = `/case-studies/${study.slug}`;
  const meta = [study.client, study.industry, study.year].filter(Boolean);

  return (
    <article className="work-card">
      <div data-reveal="image" className="work-card-media">
        {study.image ? (
          <Image
            src={study.image.url}
            alt={study.image.alt}
            width={study.image.width}
            height={study.image.height}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="image-cover"
          />
        ) : (
          // Typographic stand-in when the project has no image yet.
          <span aria-hidden="true" className="work-card-mark">
            {study.client || study.title}
          </span>
        )}
      </div>

      <div data-reveal="fade-up" className="work-card-body">
        <div className="work-card-top">
          <span className="work-card-index">{String(index).padStart(2, "0")}</span>
          {meta.length > 0 && (
            <p className="blog-meta">
              {meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </p>
          )}
        </div>

        <h2 className="work-card-title">
          {/* Stretched over the whole card, so the card is one link. */}
          <Link href={href} className="work-card-link">
            {study.title}
          </Link>
        </h2>

        {study.excerpt && <p className="body-copy mt-3 max-w-[560px]">{study.excerpt}</p>}

        {study.services.length > 0 && (
          <ul className="work-tags" aria-label="Services">
            {study.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        )}

        <span aria-hidden="true" className="work-card-cta link-sweep">
          View case study →
        </span>
      </div>
    </article>
  );
}
