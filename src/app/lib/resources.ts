// Free resources: shown in the footer, listed at /resources, and written up
// at /resources/[slug].
//
// Leave `href` out until the file exists: the resource is then shown as
// "Coming soon" and its page has no download button. `href` is either a file
// in public/downloads (e.g. "/downloads/headless-starter.zip"), which
// downloads directly, or a full URL (GitHub, the Shopify App Store), which
// opens in a new tab. GA4 records .zip and .pdf downloads on its own.

export type Resource = {
  slug: string;
  type: string;
  title: string;
  // The page's title in search results (the site name is added after it).
  seoTitle: string;
  // Card text and meta description (keep it under ~160 characters).
  description: string;
  // The standfirst under the title on the resource's page.
  summary: string;
  format: string;
  worksWith: string;
  licence: string;
  // "code" or "document", for search engines' structured data.
  kind: "code" | "document";
  href?: string;
  version?: string;
  story: string[];
  includes: string[];
  requirements: string[];
  steps: string[];
};

export const RESOURCES: Resource[] = [
  {
    slug: "headless-wordpress-starter",
    type: "WordPress · Next.js",
    title: "Headless WordPress Starter",
    seoTitle: "Free Headless WordPress Starter for Next.js",
    description:
      "A Next.js App Router starter for headless WordPress, with typed REST fetchers, incremental revalidation, SEO metadata and Tailwind CSS.",
    summary:
      "The foundation I start headless WordPress projects from: WordPress keeps the editing experience your team already knows, and Next.js serves fast, search-friendly pages.",
    format: "Boilerplate · ZIP",
    worksWith: "Next.js 16, WordPress 6",
    licence: "MIT",
    kind: "code",
    story: [
      "Most headless WordPress projects begin with the same week of plumbing: fetching posts, handling images, generating metadata, and wiring up revalidation so editors see their changes without waiting for a rebuild. After doing that enough times, I stopped rebuilding it and started keeping it.",
      "This starter is that foundation, trimmed down to what every project needs and nothing that only one project did. It follows the same approach this website is built on.",
    ],
    includes: [
      "Next.js App Router project in TypeScript",
      "Typed fetchers for posts, pages and custom post types through the WordPress REST API",
      "Incremental revalidation, so edits in WordPress appear without a redeploy",
      "SEO metadata, Open Graph tags and a sitemap generated from WordPress content",
      "Tailwind CSS with readable typography for WordPress post content",
      "Images served through next/image from the WordPress media library",
      "Server-only API access, so your WordPress address and keys never reach the browser",
    ],
    requirements: [
      "Node.js 20 or later",
      "A WordPress 6 site with the REST API enabled",
      "Some familiarity with React and the terminal",
    ],
    steps: [
      "Download and unzip the starter.",
      "Copy .env.example to .env.local and add your WordPress site's address.",
      "Run npm install, then npm run dev, and open http://localhost:3000.",
      "Deploy to Vercel or any Node.js host, adding the same environment variables there.",
    ],
  },
  {
    slug: "wordpress-rest-api-lock",
    type: "WordPress · Plugin",
    title: "REST API Lock",
    seoTitle: "REST API Lock: Free WordPress Plugin for Headless Sites",
    description:
      "A small WordPress plugin that keeps a headless site private: the REST API only answers logged-in users and requests carrying your secret key.",
    summary:
      "Going headless shouldn't mean leaving your whole WordPress REST API open to anyone who knows where to look.",
    format: "Plugin · ZIP",
    worksWith: "WordPress 6, PHP 7.4+",
    licence: "GPL-2.0-or-later",
    kind: "code",
    story: [
      "Out of the box, WordPress publishes a REST API that lists your posts, pages, media and user names to anyone who asks. For a traditional site that's mostly harmless. For a headless site, where WordPress only exists to feed a front end, it's an open door with no reason to be open.",
      "I wrote this plugin for my own headless sites. It closes the API to everyone except logged-in editors and the front end, which proves itself with a secret key, and it stops WordPress advertising the API's address in every page.",
    ],
    includes: [
      "Blocks REST API requests from anonymous visitors with a 401 response",
      "Lets your front end through with a secret key sent in a request header",
      "Keeps the block editor and other logged-in tools working as normal",
      "An allowlist for routes that must stay public, such as form plugins, editable with a filter",
      "Removes the API discovery links WordPress adds to every page and response",
      "A single file with no settings screen and no database tables",
    ],
    requirements: [
      "WordPress 6 or later",
      "PHP 7.4 or later",
      "Access to wp-config.php to add the secret key",
    ],
    steps: [
      "Add your secret key to wp-config.php, as shown in the plugin's header comment.",
      "Upload the ZIP under Plugins → Add New → Upload Plugin, and activate it.",
      "Send the same key in a request header from your front end's server-side requests.",
      "Visit /wp-json in a private browser window to check that it now returns a 401.",
    ],
  },
  {
    slug: "shopify-free-shipping-bar",
    type: "Shopify · App",
    title: "Free Shipping Progress Bar",
    seoTitle: "Free Shipping Progress Bar for Shopify",
    description:
      "A lightweight Shopify theme app extension that shows shoppers how close they are to free shipping, styled from the theme editor.",
    summary:
      "A small nudge that does a lot of work: a progress bar that tells shoppers exactly how much more they need to spend to get free shipping.",
    format: "Theme app extension",
    worksWith: "Shopify Online Store 2.0 themes",
    licence: "Free",
    kind: "code",
    story: [
      "A free shipping threshold is one of the simplest ways to raise average order value, yet many stores mention theirs once in a banner and leave it there. In my experience, shoppers respond far better to a number that moves as they add to their cart.",
      "Most apps that do this are heavier than they need to be. This one is deliberately small: a theme app extension with no outside scripts, set up from the theme editor like any other block.",
    ],
    includes: [
      "A theme app block for the cart page and the cart drawer",
      "Live progress as items are added or removed, without a page reload",
      "Threshold, messages and colours set in the theme editor",
      "Works with Shopify's own multi-currency conversion",
      "No outside scripts and no tracking",
      "Accessible progress updates for screen reader users",
    ],
    requirements: [
      "A Shopify store using an Online Store 2.0 theme, such as Dawn",
      "Permission to install apps on the store",
    ],
    steps: [
      "Install the app from the link on this page.",
      "In the theme editor, add the Free Shipping Bar block to your cart page or cart drawer.",
      "Set your free shipping threshold and the messages shoppers see.",
      "Save, then test it with a cart above and below the threshold.",
    ],
  },
  {
    slug: "tailwind-wordpress-block-theme",
    type: "WordPress · Theme",
    title: "Tailwind Block Theme",
    seoTitle: "Free Tailwind CSS WordPress Block Theme",
    description:
      "A lean WordPress block theme built on Tailwind CSS and theme.json presets, with full site editing and no page builder weight.",
    summary:
      "A starting point for WordPress sites that should feel custom and stay fast, with full site editing and nothing you'll need to strip out later.",
    format: "Theme · ZIP",
    worksWith: "WordPress 6.5+",
    licence: "GPL-2.0-or-later",
    kind: "code",
    story: [
      "Page builders make the first week easy and every year after that a little harder. Pages get slower, the markup gets tangled, and moving away becomes a project of its own.",
      "Block themes changed that. With theme.json and the site editor, editors get real freedom and developers keep control of the design system. This theme pairs that with Tailwind CSS, so the styles in the code match the presets editors choose from.",
    ],
    includes: [
      "Full site editing templates and template parts",
      "theme.json colour, typography and spacing presets that match the Tailwind tokens",
      "A Tailwind CSS build that ships only the classes you use",
      "A small set of block patterns: hero, features, testimonials and call to action",
      "No jQuery and no page builder dependencies",
      "Accessible, responsive markup, ready for translation",
    ],
    requirements: [
      "WordPress 6.5 or later",
      "Node.js 20 or later, only if you want to change the styles",
    ],
    steps: [
      "Upload the ZIP under Appearance → Themes → Add New Theme, and activate it.",
      "Open Appearance → Editor to adjust templates, colours and fonts.",
      "To change the CSS, run npm install, then npm run build, in the theme folder.",
    ],
  },
  {
    slug: "website-launch-checklist",
    type: "Checklist",
    title: "Website Launch Checklist",
    seoTitle: "Free Website Launch Checklist (PDF)",
    description:
      "The checklist I run through before every website launch: technical SEO, page speed, accessibility, analytics, redirects and backups.",
    summary:
      "Launch day is not the time to remember the redirects. This is the list I work through before any website goes live.",
    format: "PDF",
    worksWith: "Any website or platform",
    licence: "Free to use and share",
    kind: "document",
    story: [
      "The launches that go wrong rarely fail on the big things. They fail on a forgotten redirect, a noindex tag left over from staging, or an analytics tag that never fired. Small things, found too late.",
      "I keep a checklist so I don't have to rely on memory, and it gets a little better after every launch. It doesn't depend on the platform, so it works whether your site runs on WordPress, Shopify, Next.js or something else.",
    ],
    includes: [
      "Technical SEO: indexing, canonical tags, sitemaps and structured data",
      "Redirects and 404 handling for pages that have moved",
      "Page speed and Core Web Vitals checks",
      "Accessibility basics: contrast, headings, alt text and keyboard navigation",
      "Analytics, cookie consent and conversion tracking",
      "Forms, notification emails and transactional messages",
      "Security, SSL, backups and a rollback plan",
    ],
    requirements: ["Nothing at all. Print it, or tick it off on screen."],
    steps: [
      "Download the PDF.",
      "Work through it a week before launch, not the day before.",
      "Run the SEO and analytics sections again the day after the site goes live.",
    ],
  },
  {
    slug: "mysql-query-tuning-cheatsheet",
    type: "SQL · MySQL",
    title: "Query Tuning Cheatsheet",
    seoTitle: "MySQL Query Tuning Cheatsheet for WordPress",
    description:
      "Indexes, EXPLAIN and the MySQL query patterns that keep WordPress and WooCommerce databases fast as they grow.",
    summary:
      "When a WordPress or WooCommerce site slows down, the database is often where the time goes. This is where I start looking.",
    format: "PDF",
    worksWith: "MySQL 8, MariaDB 10.6+",
    licence: "Free to use and share",
    kind: "document",
    story: [
      "A slow site often gets blamed on hosting when the real cost is a handful of queries doing far more work than they should. WordPress makes this easy to miss: the postmeta table grows quietly, plugins add queries, and pages slow down a little every month.",
      "This cheatsheet collects the checks and fixes I come back to most often. It's written for people who are comfortable in phpMyAdmin or a terminal but don't tune databases every day.",
    ],
    includes: [
      "Reading EXPLAIN output and spotting full table scans",
      "Choosing and adding indexes, including composite indexes",
      "The wp_postmeta and wp_options patterns that slow WordPress down",
      "Finding and trimming autoloaded options",
      "Common WooCommerce order and product query hotspots",
      "Finding slow queries with the slow query log",
      "Safe habits: backups first, and testing changes on staging",
    ],
    requirements: [
      "Access to your database through phpMyAdmin, Adminer or the MySQL command line",
      "A recent backup before you change anything",
    ],
    steps: [
      "Download the PDF.",
      "Turn on the slow query log on a staging copy of your site.",
      "Work through the checks in order, testing each change before moving on.",
    ],
  },
];

export const getResource = (slug: string) => RESOURCES.find((resource) => resource.slug === slug);
