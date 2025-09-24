// WordPress REST API functions
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://www.logicncolor.com/wp-json';

/**
 * Fetch blog posts from WordPress
 */
export async function fetchBlogPosts(page: number = 1, perPage: number = 10) {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/pradipta/v1/posts?page=${page}&per_page=${perPage}`,
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
    const response = await fetch(
      `${WORDPRESS_API_URL}/pradipta/v1/posts?page=1&per_page=1`,
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

/**
 * Fetch a single post by slug
 */
export async function fetchPostBySlug(slug: string) {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/posts?slug=${slug}`,
      { 
        next: { revalidate: 60 } 
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
    }
    
    const posts = await response.json();
    
    if (posts.length === 0) {
      throw new Error('Post not found');
    }
    
    return posts[0];
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}

/**
 * Fetch site settings from WordPress
 */
export async function fetchSiteSettings() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/pradipta/v1/settings`,
      { 
        next: { revalidate: 3600 } // Revalidate every hour
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }
}

/**
 * Fetch portfolios from WordPress
 */
export async function fetchPortfolios() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/pradipta/v1/portfolios`,
      { 
        next: { revalidate: 3600 } // Revalidate every hour
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }
}

/**
 * Fetch site options from WordPress
 */
export async function fetchSiteOptions() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/pradipta/v1/site-settings/all`,
      { 
        next: { revalidate: 3600 } // Revalidate every hour
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }
}

/**
 * Fetch menu from WordPress
 */
export async function fetchMenu(location: string) {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/pradipta/v1/menu/${location}`,
      { 
        next: { revalidate: 3600 } 
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
}