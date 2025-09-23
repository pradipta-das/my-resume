# WordPress Integration for Resume App

This document explains how to set up and use the WordPress integration in your resume application.

## Setup Instructions

1. **WordPress Headless Setup**:
   - Ensure you have a WordPress installation with the headless theme activated
   - The theme should expose REST API endpoints for posts and settings
   - Update the `WORDPRESS_API_URL` in your `.env.local` file to match your WordPress installation

2. **Environment Configuration**:
   - The integration uses the `WORDPRESS_API_URL` environment variable
   - Default value is `http://localhost:8000/wp-json` for local development
   - Update this value to match your WordPress site's REST API endpoint

3. **Components**:
   - `WordPressBlogPosts.tsx`: A full-featured blog posts listing component with pagination
   - `WordPressBlogPostsSimple.tsx`: A simplified version for use in the homepage
   - `WordPressPostDetail.tsx`: A component to display individual blog post details

4. **API Functions**:
   - All WordPress API functions are located in `src/app/lib/wordpress.ts`
   - Functions include:
     - `fetchBlogPosts`: Fetch paginated blog posts
     - `fetchAllPosts`: Fetch all posts for static generation
     - `fetchPostBySlug`: Fetch a single post by slug
     - `fetchSiteSettings`: Fetch site settings
     - `fetchMenu`: Fetch menu items by location

5. **Usage**:
   - Blog posts are automatically displayed in the "Insights" section of the homepage
   - Individual blog posts can be accessed at `/blog/[slug]`
   - The blog listing page is available at `/blog`

6. **Customization**:
   - Modify the components in `src/app/components/` to change the appearance
   - Update the API functions in `src/app/lib/wordpress.ts` to add new endpoints
   - Adjust the number of posts displayed by changing the `perPage` parameter

## Troubleshooting

- If blog posts aren't loading, check that your WordPress site is running and accessible
- Verify that the REST API endpoints are working correctly
- Ensure CORS is properly configured on your WordPress site
- Check the browser console for any error messages