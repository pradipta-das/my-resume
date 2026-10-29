import Image from "next/image";
import Link from "next/link";
import { formatDate, type BlogSummary } from "../lib/blog";

/*
 * One post in a grid of cards. The title link stretches over the whole card,
 * so the card is one click target with one link for screen readers.
 */
export default function BlogCard({ post, index }: { post: BlogSummary; index: number }) {
  return (
    <article className="blog-card">
      {post.image && (
        <div data-reveal="image" className="blog-card-image">
          <Image
            src={post.image}
            alt=""
            width={800}
            height={500}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="image-cover"
          />
        </div>
      )}

      <div data-reveal="fade-up" className="blog-card-body">
        <span className="blog-card-index">{String(index).padStart(2, "0")}</span>

        <p className="blog-meta">
          {post.category && <span>{post.category}</span>}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
        </p>

        <h3 className="blog-card-title">
          <Link href={`/blog/${post.slug}`} className="blog-card-link">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}

        <span aria-hidden="true" className="blog-card-more">
          <span className="link-sweep">Read article</span> →
        </span>
      </div>
    </article>
  );
}
