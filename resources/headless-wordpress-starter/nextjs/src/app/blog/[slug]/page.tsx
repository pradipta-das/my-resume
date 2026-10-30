import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Content from "@/components/Content";
import { categories, featuredImage, getPost, plainText } from "@/lib/wordpress";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Posts are built on first visit, then cached until WordPress says they changed.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};

  const image = featuredImage(post);
  const title = plainText(post.title.rendered);
  const description = plainText(post.excerpt.rendered).slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: `${post.date_gmt}Z`,
      modifiedTime: `${post.modified_gmt}Z`,
      ...(image && { images: [{ url: image.source_url, alt: image.alt_text }] }),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const image = featuredImage(post);
  const title = plainText(post.title.rendered);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: `${post.date_gmt}Z`,
    dateModified: `${post.modified_gmt}Z`,
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(image && { image: image.source_url }),
  };

  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 flex flex-wrap gap-x-3 text-sm text-zinc-500">
          <time dateTime={`${post.date_gmt}Z`}>
            {new Date(`${post.date_gmt}Z`).toLocaleDateString("en-GB", { dateStyle: "long", timeZone: "UTC" })}
          </time>
          {categories(post).map((term) => (
            <span key={term.id}>{term.name}</span>
          ))}
        </p>
      </header>
      {image && (
        <Image
          src={image.source_url}
          alt={image.alt_text}
          width={image.media_details?.width ?? 1200}
          height={image.media_details?.height ?? 630}
          sizes="(min-width: 768px) 768px, 100vw"
          priority
          className="mb-10 w-full rounded-xl"
        />
      )}
      {post.content.protected ? (
        <p>This post is password protected.</p>
      ) : (
        <Content html={post.content.rendered} />
      )}
      <p className="mt-12 text-sm">
        <Link href="/" className="font-semibold hover:underline">
          ← All posts
        </Link>
      </p>
    </article>
  );
}
