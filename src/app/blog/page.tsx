import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import AnimatedPage from "../components/AnimatedPage";
import BlogCard from "../components/BlogCard";
import BlogCta from "../components/BlogCta";
import { formatDate, getCategories, getPosts } from "../lib/blog";
import { pageAlternates, pageOpenGraph } from "../lib/seo";

const PER_PAGE = 9;

type SearchParams = Promise<{ page?: string; category?: string }>;

// The page number and category from the query string, or null when either
// doesn't exist (the page then 404s).
async function readParams(searchParams: SearchParams) {
  const { page: rawPage, category: slug } = await searchParams;
  const page = Number(rawPage ?? 1);
  if (!Number.isInteger(page) || page < 1) return null;

  const categories = await getCategories();
  const category = slug ? categories.find((item) => item.slug === slug) : undefined;
  if (slug && !category) return null;

  return { page, category, categories };
}

// /blog, /blog?category=ai, /blog?category=ai&page=2 …
function blogPath(category?: string, page = 1) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (page > 1) query.set("page", String(page));
  return query.size ? `/blog?${query}` : "/blog";
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await readParams(searchParams);
  const category = params?.category;
  const page = params?.page ?? 1;
  // Each page of a listing is its own canonical URL.
  const path = blogPath(category?.slug, page);
  const title = category ? `${category.name} Articles` : "The Journal: Web Development Blog";

  return {
    title: page > 1 ? `${title} (Page ${page})` : title,
    description: category
      ? `Articles on ${category.name} by Pradipta Das: practical, measured writing from 15+ years of building for the web.`
      : "A blog on web development, WordPress, Next.js and the business of getting websites right, by Pradipta Das.",
    alternates: pageAlternates(path),
    openGraph: pageOpenGraph(path),
  };
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await readParams(searchParams);
  if (!params) notFound();
  const { page, category, categories } = params;

  const { posts, total, pages } = await getPosts(page, PER_PAGE, category?.id);
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
            {category ? `Writing on ${category.name}.` : "Ideas, lessons and notes from building for the web."}
          </h1>

          <div data-reveal="fade-up" className="blog-hero-meta">
            <p className="body-copy max-w-[520px]">
              Practical writing on web development, WordPress, Next.js and the business of getting websites right.
            </p>
            <span className="blog-hero-count">
              {total} {total === 1 ? "article" : "articles"}
            </span>
          </div>

          {categories.length > 0 && (
            <nav data-reveal="fade-up" aria-label="Categories" className="blog-categories">
              <Link href="/blog" aria-current={category ? undefined : "page"}>
                All
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={blogPath(item.slug)}
                  aria-current={item.slug === category?.slug ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
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
                {page > 1 ? `Page ${page}` : category ? `More on ${category.name}` : "More from the journal"}
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
              <Link href={blogPath(category?.slug, page - 1)} className="link-sweep">
                ← Newer
              </Link>
            ) : (
              <span />
            )}

            <span className="blog-pagination-count">
              Page {page} of {pages}
            </span>

            {page < pages ? (
              <Link href={blogPath(category?.slug, page + 1)} className="link-sweep">
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
