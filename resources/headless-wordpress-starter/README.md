# Headless WordPress Starter

Both halves of a headless WordPress site, ready to connect:

| Folder | What it is |
| --- | --- |
| `headless-wp-theme/` | The WordPress theme: REST API additions, menus over the API, and a hook that tells the front end when content changes |
| `nextjs/` | A Next.js (App Router) front end: typed fetchers, cached pages that refresh when you publish, SEO metadata, a sitemap, Tailwind CSS and `next/image` |

WordPress stays the editing experience your team knows; Next.js serves fast, search-friendly pages.

From [pradipta.online](https://pradipta.online/resources/headless-wordpress-starter).

## Set up WordPress

1. Upload `headless-wp-theme` (zipped) under Appearance › Themes › Add New Theme › Upload Theme, and activate it.
2. Set **Settings › Permalinks** to *Custom structure* `/blog/%postname%/`.
3. Assign a menu to the *Primary Menu* location under **Appearance › Menus**.
4. Add to `wp-config.php` (pick your own long random secret):

   ```php
   define( 'HEADLESS_REVALIDATE_URL', 'https://your-site.com/api/revalidate' );
   define( 'HEADLESS_REVALIDATE_SECRET', 'a-long-random-string' );
   ```

More in `headless-wp-theme/README.md`.

## Set up Next.js

You need Node.js 20.9 or later.

```bash
cd nextjs
cp .env.example .env.local    # then fill it in (below)
npm install
npm run dev                   # http://localhost:3000
```

| Variable | Value |
| --- | --- |
| `WORDPRESS_URL` | Your WordPress address, e.g. `https://cms.example.com` |
| `NEXT_PUBLIC_SITE_URL` | This site's public address, for canonical URLs and the sitemap |
| `REVALIDATE_SECRET` | The same secret as `HEADLESS_REVALIDATE_SECRET` in WordPress |
| `WORDPRESS_API_KEY` | Optional: only with the REST API Lock plugin (below) |

Deploy it to Vercel, Netlify or any Node.js host, with the same variables set there, then point `HEADLESS_REVALIDATE_URL` at `https://<your site>/api/revalidate`.

## What you get

- **Routes:** the latest posts at `/` (with `/blog/page/2` and so on), posts at `/blog/<slug>`, and WordPress pages at their own paths, including child pages (`/about/team`). Drafts and private content never appear.
- **Caching:** pages are built on first visit and cached. When you publish, update, unpublish or trash something, or change a menu, WordPress calls `/api/revalidate`, and the next visit gets the new version, with no rebuild. Everything also refreshes at least hourly as a fallback.
- **Server-only data:** all WordPress requests happen on the server (`src/lib/wordpress.ts` imports `server-only`), so the WordPress address and keys never reach the browser.
- **SEO:** titles and descriptions from WordPress, canonical URLs, Open Graph tags with the featured image, BlogPosting structured data, `sitemap.xml` and `robots.txt`.
- **Images:** featured images through `next/image`, limited to your WordPress uploads folder.
- **Content:** post HTML styled with Tailwind Typography, with links to your WordPress site pointed at the front end.

## Making it yours

- **Custom post types:** register them with `show_in_rest`, then use `getCollection("your-rest-base", { ... })` from `src/lib/wordpress.ts` and add a route like `src/app/blog/[slug]`.
- **Styling:** everything is Tailwind; start with `src/app/layout.tsx` and `src/components/`.
- **Block styles:** `src/app/globals.css` covers the common block classes. For complete block styling, load WordPress's block library stylesheet in `src/app/layout.tsx`:

  ```tsx
  <link rel="stylesheet" href={`${process.env.WORDPRESS_URL}/wp-includes/css/dist/block-library/style.min.css`} />
  ```

- **Locking the API:** with the free [REST API Lock](https://pradipta.online/resources/wordpress-rest-api-lock) plugin, WordPress's REST API only answers your front end. Set `WORDPRESS_API_KEY` to the plugin's key and the starter sends it with every request.

## Licences

The theme is GPL-2.0-or-later, like WordPress. The Next.js app is MIT.
