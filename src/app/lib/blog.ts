import { fetchBlogPosts, fetchPostBySlug } from "./wordpress";

/*
 * Blog data for the blog pages, cleaned up for display: WordPress titles and
 * excerpts arrive HTML-encoded, images may be `false`, and every post sits in
 * "Uncategorized" unless given a real category. Server only (via lib/wordpress).
 */

export interface BlogSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string | null;
  readingMinutes: number;
  category: string | null;
}

export interface BlogArticle extends BlogSummary {
  content: string;
  modified: string;
  // A hand-written excerpt to show under the title; null when WordPress's
  // excerpt just repeats the opening of the article.
  standfirst: string | null;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…",
  ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
};

export function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-z]+);/gi, (entity, name) => NAMED_ENTITIES[name.toLowerCase()] ?? entity);
}

export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

// WordPress ends automatic excerpts with "[…]"; a plain ellipsis reads better.
function cleanExcerpt(html: string): string {
  return stripHtml(html).replace(/\s*\[(…|\.\.\.)\]$/, "…");
}

// At roughly 220 words a minute, never less than a minute.
function readingMinutes(html: string): number {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

interface ListPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featured_image_url: string | false;
  categories?: { name: string; slug: string }[];
}

function toSummary(post: ListPost): BlogSummary {
  const category = post.categories?.find((term) => term.slug !== "uncategorized");

  return {
    slug: post.slug,
    title: decodeEntities(post.title),
    excerpt: cleanExcerpt(post.excerpt),
    date: post.date,
    image: post.featured_image_url || null,
    readingMinutes: readingMinutes(post.content),
    category: category ? decodeEntities(category.name) : null,
  };
}

export async function getPosts(page: number, perPage: number) {
  const data = await fetchBlogPosts(page, perPage);
  return {
    posts: (data.posts as ListPost[]).map(toSummary),
    total: data.total as number,
    pages: data.pages as number,
  };
}

export async function getArticle(slug: string): Promise<BlogArticle | null> {
  const post = await fetchPostBySlug(slug);
  if (!post) return null;

  const excerpt = cleanExcerpt(post.excerpt);
  const opening = stripHtml(post.content);
  const repeatsOpening = opening.startsWith(excerpt.replace(/…$/, "").trim());

  return {
    slug: post.slug,
    title: decodeEntities(post.title),
    excerpt,
    standfirst: excerpt && !repeatsOpening ? excerpt : null,
    content: post.content,
    date: post.date,
    modified: post.modified,
    image: post.featured_image_url || null,
    imageWidth: post.featured_image_width,
    imageHeight: post.featured_image_height,
    imageAlt: decodeEntities(post.featured_image_alt),
    readingMinutes: readingMinutes(post.content),
    category: null,
  };
}
