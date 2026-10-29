import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import AnimatedPage from "../components/AnimatedPage";
import BlogCard from "../components/BlogCard";
import BlogCta from "../components/BlogCta";
import { formatDate, getPosts } from "../lib/blog";

const PER_PAGE = 9;

export const metadata: Metadata = {
  title: "The Journal: Web Development Blog",
  description:
    "A blog on web development, WordPress, Next.js and the business of getting websites right, by Pradipta Das.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Number((await searchParams).page ?? 1);
  if (!Number.isInteger(page) || page < 1) notFound();

  const { posts, total, pages } = await getPosts(page, PER_PAGE);
  if (page > 1 && posts.length === 0) notFound();

  // The newest post leads the first page; everything else goes in the grid,
  // numbered by its position in the whole journal.
  const featured = page === 1 ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;
  const firstIndex = (page - 1) * PER_PAGE + (featured ? 2 : 1);

  return (
    <>
      <HomeHeader />

      <AnimatedPage>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="blog-hero">
          <span data-reveal="fade-up" className="eyebrow">
            The Journal
          </span>

          <h1 data-split="words" className="blog-hero-title">
            Ideas, lessons and notes from building for the web.
          </h1>

          <div data-reveal="fade-up" className="blog-hero-meta">
            <p className="body-copy max-w-[520px]">
              Practical writing on web development, WordPress, Next.js and the business of getting websites right.
            </p>
            <span className="blog-hero-count">
              {total} {total === 1 ? "article" : "articles"}
            </span>
          </div>
        </section>

        {/* =====================================================
            FEATURED (newest post, first page only)
        ====================================================== */}

        {featured && (
          <section className="blog-feature">
            {featured.image ? (
              <div data-reveal="image" data-drift className="blog-feature-media">
                <Image
                  src={featured.image}
                  alt=""
                  width={1200}
                  height={900}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="image-cover"
                  priority
                />
              </div>
            ) : (
              // Typographic stand-in when the post has no image.
              <div aria-hidden="true" className="blog-feature-media blog-feature-mark">
                <span data-reveal="fade-up">Latest</span>
              </div>
            )}

            <div data-reveal="fade-up" className="blog-feature-body">
              <p className="blog-meta">
                {featured.category && <span>{featured.category}</span>}
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                <span>{featured.readingMinutes} min read</span>
              </p>

              <h2 className="blog-feature-title">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>

              {featured.excerpt && <p className="body-copy mt-4 max-w-[560px]">{featured.excerpt}</p>}

              <Link href={`/blog/${featured.slug}`} data-magnetic className="display-link link-redraw mt-6 self-start">
                Read the article
              </Link>
            </div>
          </section>
        )}

        {/* =====================================================
            ALL POSTS
        ====================================================== */}

        {rest.length > 0 && (
          <section className="blog-list">
            <div className="blog-list-head">
              <h2 data-reveal="fade-up" className="section-caption">
                {page === 1 ? "More from the journal" : `Page ${page}`}
              </h2>
            </div>

            <div className="blog-grid">
              {rest.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={firstIndex + i} />
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <section className="statement">
            <p className="section-caption">Every story begins...with a blank page. The first one is on its way.</p>
          </section>
        )}

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        {pages > 1 && (
          <nav className="blog-pagination" aria-label="Journal pages">
            {page > 1 ? (
              <Link href={page === 2 ? "/blog" : `/blog?page=${page - 1}`} className="link-sweep">
                ← Newer
              </Link>
            ) : (
              <span />
            )}

            <span className="blog-pagination-count">
              Page {page} of {pages}
            </span>

            {page < pages ? (
              <Link href={`/blog?page=${page + 1}`} className="link-sweep">
                Older →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}

        <BlogCta />
      </AnimatedPage>

      <HomeFooter />
    </>
  );
}
