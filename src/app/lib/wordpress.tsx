// WordPress REST API functions. Server only: WordPress answers REST requests
// only when they carry WORDPRESS_API_SECRET (see wordpress/pradipta-rest-lock),
// and that key must never reach the browser.
export const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://www.logicncolor.com/wp-json';

export function wpFetch(path: string, init: RequestInit = {}) {
  return fetch(`${WORDPRESS_API_URL}${path}`, {
    ...init,
    headers: { ...init.headers, 'X-Pradipta-Api-Key': process.env.WORDPRESS_API_SECRET ?? '' },
  });
}

/**
 * Fetch blog posts from WordPress
 */
export async function fetchBlogPosts(page: number = 1, perPage: number = 10) {
  try {
    const response = await wpFetch(
      `/pradipta/v1/posts?page=${page}&per_page=${perPage}`,
      { 
        next: { revalidate: 60 } // Revalidate every 60 seconds
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

/**
 * Fetch all posts (for static generation)
 */
export async function fetchAllPosts() {
  try {
    // The first page (100 posts) says how many pages there are in all.
    const first = await fetchBlogPosts(1, 100);
    const allPosts = [...first.posts];

    for (let page = 2; page <= first.pages; page++) {
      const pageData = await fetchBlogPosts(page, 100);
      allPosts.push(...pageData.posts);
    }

    return allPosts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  }
}

export interface WpTerm {
  name: string;
  slug: string;
}

// Categories from a post fetched with _embed=wp:term (the first term list is
// always the categories).
function embeddedCategories(post: { _embedded?: { 'wp:term'?: WpTerm[][] } }): WpTerm[] {
  return (post._embedded?.['wp:term']?.[0] ?? []).map(({ name, slug }) => ({ name, slug }));
}

export interface WpCategory extends WpTerm {
  id: number;
  count: number;
}

/**
 * Categories that have at least one published post.
 */
export async function fetchCategories(): Promise<WpCategory[]> {
  const response = await wpFetch('/wp/v2/categories?hide_empty=true&per_page=100&_fields=id,name,slug,count', {
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  return response.json();
}

// The fields of a core /wp/v2/posts item that the blog list uses.
interface WpListPost {
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  _embedded?: { "wp:featuredmedia"?: { source_url?: string }[]; "wp:term"?: WpTerm[][] };
}

/**
 * One page of posts in a category, in the same shape as fetchBlogPosts. Uses
 * the core posts endpoint, because /pradipta/v1/posts doesn't filter.
 */
export async function fetchPostsInCategory(categoryId: number, page: number, perPage: number) {
  const response = await wpFetch(
    `/wp/v2/posts?categories=${categoryId}&page=${page}&per_page=${perPage}&_embed=wp:featuredmedia,wp:term`,
    { next: { revalidate: 60 } },
  );
  // WordPress answers a page past the end with 400 rather than an empty list.
  if (response.status === 400) return { posts: [], total: 0, pages: 0 };
  if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);

  const posts = await response.json();
  return {
    posts: (posts as WpListPost[]).map((post) => ({
      slug: post.slug,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      content: post.content.rendered,
      date: post.date,
      featured_image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || false,
      categories: embeddedCategories(post),
    })),
    total: Number(response.headers.get('X-WP-Total') ?? 0),
    pages: Number(response.headers.get('X-WP-TotalPages') ?? 0),
  };
}

export interface FeedPost {
  slug: string;
  title: string;
  excerpt: string;
  // UTC, with a timezone.
  date: string;
  categories: WpTerm[];
}

/**
 * The newest posts for the RSS feed, with UTC dates.
 */
export async function fetchFeedPosts(count = 20): Promise<FeedPost[]> {
  const response = await wpFetch(`/wp/v2/posts?per_page=${count}&_embed=wp:term`, { next: { revalidate: 600 } });
  if (!response.ok) throw new Error(`Failed to fetch feed posts: ${response.status} ${response.statusText}`);

  const posts: (WpListPost & { date_gmt: string })[] = await response.json();
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered,
    date: `${post.date_gmt}Z`,
    categories: embeddedCategories(post),
  }));
}

export interface BlogPostDetail {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  // UTC, with a timezone (WordPress's date and modified are site-local without one).
  date_gmt: string;
  modified_gmt: string;
  categories: WpTerm[];
  featured_image_url: string;
  featured_image_width: number;
  featured_image_height: number;
  featured_image_alt: string;
}

/**
 * Fetch a single post by slug. Returns only the fields the post page shows
 * (no author IDs or links back to WordPress), or null when there's no such post.
 */
export async function fetchPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    const response = await wpFetch(
      `/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term`,
      { 
        next: { revalidate: 60 } 
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
    }
    
    const posts = await response.json();
    const post = posts[0];
    if (!post) return null;

    const media = post._embedded?.['wp:featuredmedia']?.[0];

    return {
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      date: post.date,
      modified: post.modified,
      date_gmt: `${post.date_gmt}Z`,
      modified_gmt: `${post.modified_gmt}Z`,
      categories: embeddedCategories(post),
      featured_image_url: media?.source_url ?? '',
      featured_image_width: media?.media_details?.width ?? 0,
      featured_image_height: media?.media_details?.height ?? 0,
      featured_image_alt: media?.alt_text ?? '',
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}
