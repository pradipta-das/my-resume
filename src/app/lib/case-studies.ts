import { wpFetch } from "./wordpress";
import { decodeEntities, stripHtml } from "./blog";

/*
 * Case studies from the "case-study" post type (wordpress/pradipta-case-studies),
 * read at wp/v2/case-studies and cleaned up for display. Server only.
 */

export interface CaseStudyImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface CaseStudyResult {
  value: string;
  label: string;
}

export interface CaseStudySummary {
  slug: string;
  title: string;
  excerpt: string;
  client: string;
  year: string;
  industry: string;
  services: string[];
  image: CaseStudyImage | null;
}

export interface CaseStudy extends CaseStudySummary {
  content: string;
  date: string;
  modified: string;
  role: string;
  duration: string;
  liveUrl: string;
  stack: string[];
  results: CaseStudyResult[];
  challenge: string;
  approach: string;
}

interface WpCaseStudy {
  slug: string;
  date: string;
  modified: string;
  menu_order: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  meta?: Partial<Record<string, string>>;
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string; alt_text?: string; media_details?: { width?: number; height?: number } }[];
  };
}

const REVALIDATE = 300;

// One item per line, blanks dropped.
const lines = (value = "") =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function toSummary(post: WpCaseStudy): CaseStudySummary {
  const meta = post.meta ?? {};
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  return {
    slug: post.slug,
    title: decodeEntities(post.title.rendered),
    // WordPress ends automatic excerpts with "[…]"; a plain ellipsis reads better.
    excerpt: stripHtml(post.excerpt.rendered).replace(/\s*\[(…|\.\.\.)\]$/, "…"),
    client: meta.cs_client ?? "",
    year: meta.cs_year ?? "",
    industry: meta.cs_industry ?? "",
    services: lines(meta.cs_services),
    image: media?.source_url
      ? {
          url: media.source_url,
          width: media.media_details?.width ?? 1600,
          height: media.media_details?.height ?? 1000,
          alt: decodeEntities(media.alt_text ?? ""),
        }
      : null,
  };
}

function toCaseStudy(post: WpCaseStudy): CaseStudy {
  const meta = post.meta ?? {};

  return {
    ...toSummary(post),
    content: post.content.rendered,
    date: post.date,
    modified: post.modified,
    role: meta.cs_role ?? "",
    duration: meta.cs_duration ?? "",
    liveUrl: meta.cs_live_url ?? "",
    stack: lines(meta.cs_stack),
    // "value | label" per line; a line without a label is skipped.
    results: lines(meta.cs_results).flatMap((line) => {
      const [value, ...label] = line.split("|").map((part) => part.trim());
      return value && label.join(" ") ? [{ value, label: label.join(" ") }] : [];
    }),
    challenge: meta.cs_challenge ?? "",
    approach: meta.cs_approach ?? "",
  };
}

// The plugin may not be installed yet: WordPress then has no such route, and
// the site shows no case studies rather than an error page.
async function fetchCaseStudies(query: string): Promise<WpCaseStudy[]> {
  const response = await wpFetch(`/wp/v2/case-studies?${query}&_embed=wp:featuredmedia`, {
    next: { revalidate: REVALIDATE },
  });

  if (response.status === 404) {
    console.warn("Case studies aren't available in WordPress yet (is pradipta-case-studies active?)");
    return [];
  }
  if (!response.ok) throw new Error(`Failed to fetch case studies: ${response.status} ${response.statusText}`);

  return response.json();
}

// In listing order: the "Order" field first (lowest first), then newest.
export async function getCaseStudies(): Promise<CaseStudySummary[]> {
  const posts = await fetchCaseStudies("per_page=100");
  return posts
    .sort((a, b) => a.menu_order - b.menu_order || b.date.localeCompare(a.date))
    .map(toSummary);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const [post] = await fetchCaseStudies(`slug=${encodeURIComponent(slug)}`);
  return post ? toCaseStudy(post) : null;
}
