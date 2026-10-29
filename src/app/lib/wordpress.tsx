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
    // First, get the total number of posts to calculate pages
    const response = await wpFetch(
      `/pradipta/v1/posts?page=1&per_page=1`,
      { 
        next: { revalidate: 60 } 
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const totalPages = data.pages;
    
    // Fetch all posts
    const allPosts = [];
    for (let page = 1; page <= totalPages; page++) {
      const pageData = await fetchBlogPosts(page, 100); // Fetch 100 per page
      allPosts.push(...pageData.posts);
    }
    
    return allPosts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  }
}

export interface BlogPostDetail {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
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
      `/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`,
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
