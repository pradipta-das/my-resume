import "server-only";

/*
 * Typed fetchers for the WordPress REST API. Server only: the "server-only"
 * import makes the build fail if a client component imports this file, so
 * the WordPress address and the optional API key never reach the browser.
 *
 * Every response is cached with the "wordpress" tag and refreshed at most
 * every hour, or straight away when WordPress calls /api/revalidate (see
 * src/app/api/revalidate/route.ts and the theme's inc/headless.php).
 */

const WORDPRESS_URL = (process.env.WORDPRESS_URL || "").replace(/\/+$/, "");
const API = `${WORDPRESS_URL}/wp-json`;

export const CACHE_TAG = "wordpress";
const REVALIDATE_SECONDS = 3600;

/* ---------- Types: only the fields this starter reads ---------- */

export interface WpImage {
  source_url: string;
  alt_text: string;
  media_details?: { width?: number; height?: number };
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WpEntry {
  id: number;
  slug: string;
  type: string;
  link: string;
  date_gmt: string;
  modified_gmt: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string; protected: boolean };
  parent?: number;
  _embedded?: {
    "wp:featuredmedia"?: WpImage[];
    "wp:term"?: WpTerm[][];
  };
}

export interface WpMenuItem {
  id: number;
  title: string;
  url: string;
  target: string;
  parent: string;
  order: number;
}

export interface Page<T> {
  items: T[];
  total: number;
  totalPages: number;
}

/* ---------- Fetching ---------- */

class WordPressError extends Error {}

async function wp(path: string, tags: string[] = []): Promise<Response> {
  if (!WORDPRESS_URL) throw new WordPressError("WORDPRESS_URL is not set (see .env.example).");

  const headers: Record<string, string> = { Accept: "application/json" };
  // Only needed when WordPress runs the REST API Lock plugin.
  if (process.env.WORDPRESS_API_KEY) headers["X-Pradipta-Api-Key"] = process.env.WORDPRESS_API_KEY;

  try {
    return await fetch(`${API}${path}`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG, ...tags] },
    });
  } catch (error) {
    throw new WordPressError(`Can't reach WordPress at ${WORDPRESS_URL}: ${(error as Error).message}`);
  }
}

async function json<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) throw new WordPressError(`WordPress answered ${response.status} for ${path}`);
  return (await response.json()) as T;
}

/**
 * One page of any collection: posts, pages, or a custom post type registered
 * with show_in_rest (use its rest_base, e.g. "projects"). Asking for a page
 * past the end returns no items rather than an error.
 */
export async function getCollection<T = WpEntry>(
  restBase: string,
  params: Record<string, string | number> = {},
): Promise<Page<T>> {
  const query = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]));
  const path = `/wp/v2/${restBase}?${query}`;
  const response = await wp(path, [restBase]);

  // WordPress answers 400 for a page number past the last page.
  if (response.status === 400) return { items: [], total: 0, totalPages: 0 };

  return {
    items: await json<T[]>(response, path),
    total: Number(response.headers.get("X-WP-Total") ?? 0),
    totalPages: Number(response.headers.get("X-WP-TotalPages") ?? 0),
  };
}

export const getPosts = (page = 1, perPage = 10) =>
  getCollection("posts", { page, per_page: perPage, _embed: "wp:featuredmedia" });

/** A published post by slug, or null. */
export async function getPost(slug: string): Promise<WpEntry | null> {
  const { items } = await getCollection("posts", { slug, _embed: "wp:featuredmedia,wp:term" });
  return items[0] ?? null;
}

/**
 * A published page by its full path, e.g. ["about", "team"] for /about/team.
 * Pages are looked up by their last slug, then matched on the whole path, so
 * a child page is only found under its real parent.
 */
export async function getPage(path: string[]): Promise<WpEntry | null> {
  const slug = path.at(-1);
  if (!slug) return null;
  const { items } = await getCollection("pages", { slug, _embed: "wp:featuredmedia" });
  const wanted = `/${path.join("/")}/`;
  return items.find((page) => new URL(page.link).pathname === wanted) ?? null;
}

/** Every published entry of a type, for the sitemap. */
export async function getAll(restBase: string, fields = "slug,link,modified_gmt"): Promise<WpEntry[]> {
  const all: WpEntry[] = [];
  for (let page = 1; ; page++) {
    const { items, totalPages } = await getCollection(restBase, { page, per_page: 100, _fields: fields });
    all.push(...items);
    if (page >= totalPages) return all;
  }
}

/** The site's name and tagline, from WordPress's General Settings. */
export async function getSite(): Promise<{ name: string; description: string }> {
  const response = await wp("/");
  const { name, description } = await json<{ name: string; description: string }>(response, "/");
  return { name, description };
}

/**
 * A menu from a theme location ("primary", "footer"), via the companion
 * WordPress theme's endpoint. Returns [] when the location has no menu.
 */
export async function getMenu(location: string): Promise<WpMenuItem[]> {
  const path = `/headless-wp-theme/v1/menus/${encodeURIComponent(location)}`;
  const response = await wp(path, ["menu"]);
  if (response.status === 404) return [];
  const { items } = await json<{ items: WpMenuItem[] }>(response, path);
  return items.filter((item) => item.parent === "0").sort((a, b) => a.order - b.order);
}

/* ---------- Helpers ---------- */

export const featuredImage = (entry: WpEntry): WpImage | undefined => entry._embedded?.["wp:featuredmedia"]?.[0];

export const categories = (entry: WpEntry): WpTerm[] =>
  (entry._embedded?.["wp:term"] ?? []).flat().filter((term) => term.taxonomy === "category");

/**
 * Turns a link to the WordPress site into a link on this site ("/about/"),
 * leaving uploads, the admin and other sites alone.
 */
export function localUrl(url: string): string {
  if (!WORDPRESS_URL || !url.startsWith(WORDPRESS_URL)) return url;
  const path = url.slice(WORDPRESS_URL.length) || "/";
  return /^\/wp-(content|admin|json|includes)\//.test(path) ? url : path;
}

/** Post and page HTML with its internal links pointed at this site. */
export function localizeLinks(html: string): string {
  if (!WORDPRESS_URL) return html;
  const escaped = WORDPRESS_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`href="${escaped}(/[^"]*)?"`, "g"), (match, path = "/") =>
    /^\/wp-(content|admin|json|includes)\//.test(path) ? match : `href="${path}"`,
  );
}

/** Plain text from a rendered excerpt or title, for meta descriptions. */
export function plainText(html: string): string {
  return html
    .replace(/\s*\[&hellip;\]/g, "…")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&hellip;|&#8230;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&quot;|&#8243;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
