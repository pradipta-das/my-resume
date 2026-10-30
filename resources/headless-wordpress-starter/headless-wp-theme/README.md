# Headless WP Theme

The WordPress half of the Headless WordPress Starter: a theme for a WordPress site that serves content to a separate front end (the Next.js app in `../nextjs`), with block editor support, WooCommerce support and a few REST API additions.

## Install

1. Zip this folder (or use the `headless-wp-theme` folder from the download) and upload it under Appearance › Themes › Add New Theme › Upload Theme. Activate it.
2. Set **Settings › Permalinks** to *Custom structure* `/blog/%postname%/`, so WordPress links and front-end links match.
3. Under **Appearance › Menus**, assign a menu to the *Primary Menu* location. The front end shows it in its header.
4. Add to `wp-config.php`, so WordPress tells the front end when content changes:

   ```php
   define( 'HEADLESS_REVALIDATE_URL', 'https://your-site.com/api/revalidate' );
   define( 'HEADLESS_REVALIDATE_SECRET', 'a-long-random-string' ); // = REVALIDATE_SECRET in the Next.js app
   ```

5. Optional: under **Appearance › Customize › Headless Settings**, set the *Frontend URL* if the front end calls the API from the browser (see CORS below), and turn on *Headless mode* to send visitors of the WordPress site to the front end.

Requires WordPress 6.0 or later and PHP 8.0 or later.

## REST API

Everything in WordPress's own REST API (`/wp-json/wp/v2/...`) works as usual. The theme adds:

| Endpoint | Returns |
| --- | --- |
| `GET /wp-json/headless-wp-theme/v1/menus` | Every menu location with its items |
| `GET /wp-json/headless-wp-theme/v1/menus/{location}` | One location's menu, e.g. `primary` |
| `GET /wp-json/headless-wp-theme/v1/settings` | Site title, tagline, URL, date and reading settings, logo |
| `GET /wp-json/headless-wp-theme/v1/customizer` | The theme's Customizer settings |
| `GET /wp-json/headless-wp-theme/v1/posts/slug/{slug}` | A post by slug (same shape as `/wp/v2/posts`) |
| `GET /wp-json/headless-wp-theme/v1/pages/slug/{slug}` | A page by slug |
| `GET /wp-json/headless-wp-theme/v1/posts/all` | Posts with author, terms and featured image in one response. `page`, `per_page` (up to 100), `category`, `tag`, `search` |
| `GET /wp-json/headless-wp-theme/v1/categories/with-count` | Categories with post counts |

Extra fields on posts and pages:

- `featured_image_url`: the full-size featured image URL
- `author_info`: the author's name, website, bio and avatar (never the email address)
- `blocks`: the content as parsed blocks, for rendering blocks as components
- `meta_fields`: post meta, **only the keys you allow**:

  ```php
  add_filter( 'headless_wp_theme_rest_meta_keys', fn () => array( 'subtitle', 'reading_time' ) );
  ```

  Post meta often holds plugin data that was never meant to be public, so nothing is published by default.

Products also get `featured_image_url`, `gallery_images`, `product_categories` and `product_tags`. For the cart and checkout, use WooCommerce's own [Store API](https://developer.woocommerce.com/docs/apis/store-api/) (`/wp-json/wc/store/v1/cart` and so on), which handles sessions, nonces and stock.

## Keeping the front end up to date

With the two constants from step 4 set, the theme sends a small JSON request to the front end whenever published content is saved, published, unpublished or trashed, or a menu changes. The request runs in the background, so saving in the editor never waits for it, and it carries the secret in an `X-Revalidate-Secret` header. The Next.js app's `/api/revalidate` checks it and refreshes the pages.

## CORS

A Next.js front end fetches from the server, which needs no CORS headers at all. Only if your front end calls the API from the browser, set its address as the *Frontend URL* in the Customizer: the theme then allows that one origin (with credentials) on REST responses, and no other. With no Frontend URL set, browsers on other sites can't read the API.

To close the REST API to everyone except your front end, pair this theme with the free [REST API Lock](https://pradipta.online/resources/wordpress-rest-api-lock) plugin.

## Changelog

### 1.1.0

- **Security:** the `/settings` endpoint no longer includes the admin email, and `author_info` no longer includes authors' email addresses.
- **Security:** CORS headers are sent only for the configured Frontend URL and only on REST responses. The theme no longer intercepts every `OPTIONS` request on the site.
- **Security:** `meta_fields` publishes only the keys allowed with the `headless_wp_theme_rest_meta_keys` filter.
- `posts/all` validates its parameters, returns at most 100 posts per request, returns rendered content, and skips password-protected content.
- Removed the custom cart endpoints, which failed because WooCommerce doesn't load the cart for REST requests. Use the Store API.
- The `blocks` field now works outside the edit context. Removed `rendered_content`, which duplicated `content.rendered` and ran the content filters twice.
- New: notifies the front end when content changes (`HEADLESS_REVALIDATE_URL`, `HEADLESS_REVALIDATE_SECRET`).

### 1.0.0

- Initial release.

## Licence

GPL-2.0-or-later.
