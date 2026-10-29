import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import AnimatedPage from "../../components/AnimatedPage";
import BlogCard from "../../components/BlogCard";
import BlogCta from "../../components/BlogCta";
import { formatDate, getArticle, getPosts } from "../../lib/blog";
import { pageAlternates, pageOpenGraph, siteConfig } from "../../lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Without generateStaticParams the route renders on every request. An empty
// list builds nothing up front (the build doesn't depend on WordPress); each
// post renders on its first visit, then is cached and revalidated like its data.
export async function generateStaticParams() {
  return [];
}

// Narrower featured images would blur if stretched across the page.
const FULL_BLEED_MIN_WIDTH = 1200;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) return {};

  const path = `/blog/${article.slug}`;
  return {
    // Absolute: article titles are long enough without "| Pradipta Das"; the
    // author is in the structured data.
    title: { absolute: article.title },
    description: article.excerpt,
    alternates: pageAlternates(path),
    // The share image comes from opengraph-image.tsx (with the featured image
    // alongside the title once the post has one).
    openGraph: pageOpenGraph(path, {
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      authors: [`${siteConfig.url}/about`],
      ...(article.category && { section: article.category }),
    }),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const { posts } = await getPosts(1, 4);
  const related = posts.filter((post) => post.slug !== article.slug).slice(0, 3);

  const url = `${siteConfig.url}/blog/${article.slug}`;
  const updated = article.modified.slice(0, 10) !== article.date.slice(0, 10);
  const categoryUrl = article.categorySlug && `${siteConfig.url}/blog?category=${article.categorySlug}`;

  // For search engines: the article, its author, and where it sits in the site.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article.modifiedAt,
        image: article.image ?? `${url}/opengraph-image`,
        author: { "@type": "Person", "@id": `${siteConfig.url}/#person`, name: siteConfig.name, url: `${siteConfig.url}/about` },
        publisher: { "@id": `${siteConfig.url}/#person` },
        inLanguage: "en-IN",
        ...(article.category && { articleSection: article.category }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", item: siteConfig.url },
          { name: "The Journal", item: `${siteConfig.url}/blog` },
          ...(article.category && categoryUrl ? [{ name: article.category, item: categoryUrl }] : []),
          { name: article.title, item: url },
        ].map((crumb, i) => ({ "@type": "ListItem", position: i + 1, ...crumb })),
      },
    ],
  };

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

        <header className="post-hero">
          <Link href="/blog" className="post-back">
            <span className="link-sweep">← All articles</span>
          </Link>

          <p data-reveal="fade-up" className="blog-meta">
            {article.category && article.categorySlug && (
              <Link href={`/blog?category=${article.categorySlug}`} className="link-sweep">
                {article.category}
              </Link>
            )}
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span>{article.readingMinutes} min read</span>
          </p>

          <h1 data-split="words" className="post-title">
            {article.title}
          </h1>

          {article.standfirst && (
            <p data-reveal="fade-up" className="post-standfirst">
              {article.standfirst}
            </p>
          )}
        </header>

        {/* Large images run full width; smaller ones sit at their natural
            size in a frame, rather than being stretched until they blur. */}
        {article.image &&
          (article.imageWidth >= FULL_BLEED_MIN_WIDTH ? (
            <div data-reveal="image" data-drift className="post-image">
              <Image
                src={article.image}
                alt={article.imageAlt}
                width={article.imageWidth}
                height={article.imageHeight}
                sizes="100vw"
                className="image-cover"
                priority
              />
            </div>
          ) : (
            <div className="post-image-framed">
              <div data-reveal="image">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  width={article.imageWidth || 800}
                  height={article.imageHeight || 500}
                  sizes={`${article.imageWidth || 800}px`}
                  priority
                />
              </div>
            </div>
          ))}

        {/* =====================================================
            ARTICLE
        ====================================================== */}

        <div className="post-layout">
          <aside className="post-aside">
            <dl className="post-facts">
              <div>
                <dt>Published</dt>
                <dd>{formatDate(article.date)}</dd>
              </div>
              {updated && (
                <div>
                  <dt>Updated</dt>
                  <dd>{formatDate(article.modified)}</dd>
                </div>
              )}
              <div>
                <dt>Reading time</dt>
                <dd>{article.readingMinutes} minutes</dd>
              </div>
              <div>
                <dt>Share</dt>
                <dd className="post-share">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sweep"
                  >
                    X / Twitter
                  </a>
                </dd>
              </div>
            </dl>
          </aside>

          {/* Content comes from the site's own WordPress, which sanitises it. */}
          <article className="post-content" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* =====================================================
            KEEP READING
        ====================================================== */}

        {related.length > 0 && (
          <section className="blog-list">
            <div className="blog-list-head">
              <h2 data-reveal="fade-up" className="section-caption">
                Keep reading
              </h2>
            </div>

            <div className="blog-grid">
              {related.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i + 1} />
              ))}
            </div>
          </section>
        )}

        <BlogCta />
      </AnimatedPage>

      <HomeFooter />
    </>
  );
}
