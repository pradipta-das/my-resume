import { ADDITION_HOURS, PROJECT_HOURS, freelancePrice, priceHours, type Currency, type Hours } from "./estimate/pricing";
import { formatRange } from "./estimate/format";

/*
 * Cost guides at /cost/[slug]: one page per search people make before hiring
 * ("website development cost in india", "saas mvp development cost", ...).
 *
 * Prices aren't typed in. Each option gives the hours it takes, and the page
 * prices them at my rates from lib/estimate/pricing.ts, so a guide always
 * quotes what the estimator would. Running costs, comparisons, examples and
 * FAQs are text to edit here.
 *
 * DRAFTS: a guide with `draft: true` can be opened at its address to check it,
 * but is kept out of search (noindex), the sitemap and every link on the site,
 * and shows a "draft" note. The content below started as demo data: replace
 * the running costs, the example and the FAQs with real figures and a real
 * project, then set `draft: false` to publish the guide.
 */

export type CostOption = {
  name: string;
  includes: string;
  hours: Hours;
  // Build time, in weeks.
  weeks: Hours;
};

export type CostGuide = {
  slug: string;
  draft: boolean;
  // ISO date, shown as "Updated" and given to search engines.
  updated: string;
  // The label above the title, and on the share image.
  type: string;
  title: string;
  // The page's title in search results (the site name is added after it).
  seoTitle: string;
  // Meta description (keep it under ~160 characters).
  description: string;
  // The answer, in the first lines of the page. {range} is the full price
  // range; {1}, {2}, {3} are the options' ranges, in the first currency.
  answer: string;
  // Prices are shown in each, the first being the guide's main market.
  currencies: Currency[];
  options: CostOption[];
  // Optional: how other ways of getting the same thing compare.
  comparison?: { intro: string; rows: { option: string; price: string; suits: string }[] };
  runningCosts: { item: string; cost: string; note: string }[];
  drivers: { title: string; text: string }[];
  example: { title: string; brief: string; scope: string[]; hours: Hours; weeks: Hours; outcome: string; caseStudy?: string };
  faqs: { question: string; answer: string }[];
  // Answers the estimator starts with when opened from this guide. Values
  // must match the form's options exactly (see CostEstimatorForm).
  estimator: Partial<Record<"project_type" | "project_action" | "technology" | "country", string>>;
  related: string[];
};

// Adds two sets of hours (a project type plus an addition).
const plus = (a: Hours, b: Hours): Hours => [a[0] + b[0], a[1] + b[1]];

const ALL_COST_GUIDES: CostGuide[] = [
  /* =========================================================
     WEBSITE DEVELOPMENT COST IN INDIA
  ========================================================= */
  {
    slug: "website-india",
    draft: true,
    updated: "2026-11-01",
    type: "Websites · India",
    title: "Website Development Cost in India",
    seoTitle: "Website Development Cost in India (2026 Price Guide)",
    description:
      "What a website costs in India in 2026: prices in ₹ for portfolio, business and custom-designed sites, running costs, and freelancer vs agency vs DIY.",
    answer:
      "A business website in India costs {2} built from a quality template, or {3} with a custom design. A small portfolio site costs {1}. On top of that, plan for about ₹5,000–₹15,000 a year in domain, hosting and email.",
    currencies: ["INR"],
    options: [
      {
        name: "Portfolio or small site",
        includes: "1–5 pages, a template design, a contact form and basic SEO",
        hours: PROJECT_HOURS.portfolio.hours,
        weeks: [1, 2],
      },
      {
        name: "Business website",
        includes: "6–15 pages on WordPress, starting from a template, with forms, a blog and analytics",
        hours: PROJECT_HOURS.businessTemplate.hours,
        weeks: [2, 4],
      },
      {
        name: "Custom-designed business website",
        includes: "6–15 pages designed around your brand, with custom layouts and light animation",
        hours: PROJECT_HOURS.businessCustom.hours,
        weeks: [4, 7],
      },
    ],
    comparison: {
      intro:
        "The same business website, built four ways. Agency and DIY figures are typical market prices, not quotes. [DEMO: check these against current offers.]",
      rows: [
        {
          option: "DIY website builder",
          price: "₹3,000–₹12,000 a year",
          suits: "A simple page while you test an idea, if you have the time to build it",
        },
        {
          option: "Freelancer (with me)",
          price: formatRange(priceHours(PROJECT_HOURS.businessTemplate.hours, "INR"), "INR"),
          suits: "Most small businesses: one person who designs, builds and supports the site",
        },
        {
          option: "Typical experienced freelancer",
          price: formatRange(freelancePrice(PROJECT_HOURS.businessTemplate.hours, "INR"), "INR"),
          suits: "The same work at common freelance rates in India",
        },
        {
          option: "Agency",
          price: "₹60,000–₹3,00,000",
          suits: "Larger teams that need account management, strategy and a bigger crew",
        },
      ],
    },
    runningCosts: [
      { item: "Domain (.com or .in)", cost: "₹800–₹1,500 a year", note: "Renewal prices are often higher than the first year" },
      { item: "Hosting", cost: "₹3,000–₹12,000 a year", note: "Shared or managed WordPress hosting with daily backups" },
      { item: "Business email", cost: "₹0–₹3,000 a year per mailbox", note: "Free tiers exist; paid plans add storage and support" },
      { item: "SSL certificate", cost: "Free", note: "Included with almost every host" },
      { item: "Updates and support", cost: "₹1,500–₹5,000 a month", note: "Optional: updates, backups checks and small edits" },
    ],
    drivers: [
      { title: "Design", text: "A template is the quickest start; a custom design takes longer but fits your brand exactly." },
      { title: "Number of layouts", text: "Ten pages that share three layouts cost far less than ten different ones." },
      { title: "Features", text: "Booking, payments, multi-language and integrations each add a few hours to a few days." },
      { title: "Content", text: "Having your text and photos ready keeps the project moving; writing them for you adds time." },
      { title: "Timeline", text: "An urgent launch adds 20%, because other work has to move." },
    ],
    example: {
      title: "A 10-page website for a clinic [DEMO]",
      brief: "Replace with a real project: who it was for, what they needed and what it cost.",
      scope: ["10 pages on WordPress from a template", "Appointment enquiry form", "Google Maps and reviews", "Basic SEO and analytics"],
      hours: [40, 50],
      weeks: [3, 3],
      outcome: "[DEMO] Launched in three weeks; enquiries now arrive through the site instead of phone calls.",
    },
    faqs: [
      {
        question: "How much does a basic website cost in India?",
        answer:
          "A basic 1–5 page website costs about {1} with me, plus roughly ₹5,000 a year for a domain and hosting. Website builders are cheaper to start but cost more each year.",
      },
      {
        question: "Why do website prices in India vary so much?",
        answer:
          "Quotes range from ₹5,000 to several lakh because they describe different work: a template with your logo, a custom design, or an agency team with strategy and account management. Compare what's included, not just the price.",
      },
      {
        question: "Are there yearly charges after the website is built?",
        answer:
          "Yes: domain, hosting and email, usually ₹5,000–₹15,000 a year in total. Updates and support are optional and billed monthly.",
      },
      {
        question: "Is a freelancer cheaper than an agency?",
        answer:
          "Usually, because there's no account manager or team overhead. The trade-off is capacity: one person can take on fewer projects at a time.",
      },
    ],
    estimator: { project_type: "Business Website", technology: "WordPress", country: "India" },
    related: ["wordpress-website", "shopify-store"],
  },

  /* =========================================================
     SHOPIFY STORE COST IN INDIA
  ========================================================= */
  {
    slug: "shopify-store",
    draft: true,
    updated: "2026-11-01",
    type: "E-commerce · Shopify",
    title: "Shopify Store Development Cost in India",
    seoTitle: "Shopify Website Development Cost in India (₹ Price Guide)",
    description:
      "What a Shopify store costs in India: setup and custom build prices in ₹ and $, monthly Shopify, app and payment costs, and what changes the price.",
    answer:
      "Setting up a Shopify store in India costs {1} on a ready-made theme, or {2} for a full store with customised sections and integrations. Add Shopify's monthly plan, apps and payment gateway fees.",
    currencies: ["INR", "USD"],
    options: [
      {
        name: "Store setup",
        includes: "A premium or free theme set up with your brand, up to 50 products, payments and shipping",
        hours: [25, 45],
        weeks: [1, 3],
      },
      {
        name: "Custom store",
        includes: "Customised theme sections, product filters, reviews, WhatsApp and email marketing integrations",
        hours: PROJECT_HOURS.ecommerce.hours,
        weeks: [3, 6],
      },
      {
        name: "Store with custom features",
        includes: "Custom sections or a small app, subscriptions or B2B pricing, and data moved from your old store",
        hours: plus(PROJECT_HOURS.ecommerce.hours, ADDITION_HOURS.contentMigration.hours),
        weeks: [5, 9],
      },
    ],
    runningCosts: [
      { item: "Shopify plan", cost: "About ₹1,500–₹5,600 a month", note: "[DEMO] Basic to Grow, billed yearly; check Shopify's current India pricing" },
      { item: "Payment gateway", cost: "About 2% per order", note: "[DEMO] Razorpay, PayU or similar; Shopify may add its own fee on top" },
      { item: "Apps", cost: "₹0–₹5,000 a month", note: "Reviews, WhatsApp, subscriptions; many have free plans" },
      { item: "Premium theme", cost: "$0–$400 once", note: "Free themes work well for many stores" },
      { item: "Domain", cost: "₹800–₹1,500 a year", note: "Bought through Shopify or any registrar" },
    ],
    drivers: [
      { title: "Theme or custom sections", text: "A configured theme is fastest; custom sections let you design pages Shopify's themes can't." },
      { title: "Catalogue size", text: "Ten products are quick to add; hundreds need an import, variants and clean collections." },
      { title: "Integrations", text: "Shipping (Shiprocket, Delhivery), WhatsApp, accounting and marketing tools each add time." },
      { title: "Moving from another platform", text: "Products, customers and orders from WooCommerce or another store need importing and checking." },
    ],
    example: {
      title: "A fashion store with 120 products [DEMO]",
      brief: "Replace with a real Shopify project, and link its case study below.",
      scope: ["Premium theme with custom homepage sections", "120 products with size variants", "Razorpay and Shiprocket", "WhatsApp order updates"],
      hours: [70, 85],
      weeks: [4, 5],
      outcome: "[DEMO] Live in five weeks, with orders and shipping handled in one dashboard.",
    },
    faqs: [
      {
        question: "How much does it cost to start a Shopify store in India?",
        answer:
          "A professionally set up store costs {1} with me, plus Shopify's monthly plan and a payment gateway. Doing it yourself costs only the plan, but takes time to get right.",
      },
      {
        question: "Does Shopify charge extra transaction fees in India?",
        answer:
          "[DEMO: confirm current rules] Shopify can add a fee when you use a third-party gateway, on top of the gateway's own charge. Check Shopify's pricing page for the plan you choose.",
      },
      {
        question: "How much does Shopify theme customisation cost?",
        answer:
          "Small changes such as colours, fonts and section order take a few hours. A new custom section usually takes 4–12 hours, depending on how interactive it is.",
      },
      {
        question: "Shopify or WooCommerce: which is cheaper?",
        answer:
          "WooCommerce has no monthly platform fee but needs hosting, updates and more upkeep. Shopify costs more each month and less in maintenance.",
      },
    ],
    estimator: { project_type: "E-commerce", technology: "Shopify", country: "India" },
    related: ["wordpress-to-shopify-migration", "website-india"],
  },

  /* =========================================================
     WORDPRESS WEBSITE COST IN INDIA
  ========================================================= */
  {
    slug: "wordpress-website",
    draft: true,
    updated: "2026-11-01",
    type: "Websites · WordPress",
    title: "WordPress Website Cost in India",
    seoTitle: "WordPress Website Cost in India: Theme, Custom & Headless",
    description:
      "What a WordPress website costs in India: theme, custom block theme and headless builds compared in ₹ and $, with hosting and maintenance costs.",
    answer:
      "A WordPress website in India costs {1} on a ready-made theme, {2} with a custom block theme, or {3} as a headless site with a Next.js front end. Hosting adds ₹3,000–₹12,000 a year.",
    currencies: ["INR", "USD"],
    options: [
      {
        name: "Ready-made theme",
        includes: "A quality theme set up with your brand and content, 6–15 pages, forms and SEO",
        hours: PROJECT_HOURS.businessTemplate.hours,
        weeks: [2, 4],
      },
      {
        name: "Custom block theme",
        includes: "A theme designed for your brand, with custom blocks your team can edit safely",
        hours: PROJECT_HOURS.businessCustom.hours,
        weeks: [4, 7],
      },
      {
        name: "Headless WordPress",
        includes: "WordPress for editing, a Next.js front end for speed, SEO and instant updates",
        hours: [90, 160],
        weeks: [6, 10],
      },
    ],
    runningCosts: [
      { item: "WordPress hosting", cost: "₹3,000–₹12,000 a year", note: "Managed hosting handles updates and backups" },
      { item: "Premium plugins", cost: "₹0–₹15,000 a year", note: "Forms, SEO or backups; free versions are often enough" },
      { item: "Premium theme", cost: "₹0–₹5,000 once", note: "Not needed for a custom theme" },
      { item: "Front-end hosting (headless only)", cost: "₹0–₹1,800 a month", note: "Netlify or Vercel; free tiers suit most small sites" },
      { item: "Updates and support", cost: "₹1,500–₹5,000 a month", note: "Optional: core, theme and plugin updates and checks" },
    ],
    drivers: [
      { title: "Theme approach", text: "A ready-made theme is quickest; a custom block theme is faster and easier to edit in the long run." },
      { title: "Plugins vs custom code", text: "A good plugin often saves days; custom code makes sense when no plugin fits cleanly." },
      { title: "Content editing", text: "Custom blocks and fields let your team edit without breaking the design." },
      { title: "Headless", text: "A separate front end costs more to build but loads faster and is harder to break." },
    ],
    example: {
      title: "A custom block theme for a consultancy [DEMO]",
      brief: "Replace with a real WordPress project. Link the Tailwind block theme once it ships.",
      scope: ["12 pages on a custom block theme", "8 custom blocks", "Case study post type", "Contact form with CRM integration"],
      hours: [60, 75],
      weeks: [5, 6],
      outcome: "[DEMO] The team now publishes new pages themselves, without a developer.",
    },
    faqs: [
      {
        question: "Is WordPress free?",
        answer:
          "The software is free. You pay for hosting, a domain, any premium theme or plugins, and the time to build and look after the site.",
      },
      {
        question: "How much does WordPress maintenance cost in India?",
        answer:
          "Typically ₹1,500–₹5,000 a month for updates, backups checks and small edits. Managed hosting covers part of this.",
      },
      {
        question: "What is headless WordPress, and is it worth it?",
        answer:
          "WordPress stays as the editor, and a separate Next.js site shows the pages. It's worth it when speed, security or a custom front end matter more than plugin-based features.",
      },
      {
        question: "How long does it take to build a WordPress website?",
        answer: "Two to four weeks on a theme, four to seven for a custom design, mostly depending on how quickly content is ready.",
      },
    ],
    estimator: { project_type: "Business Website", technology: "WordPress", country: "India" },
    related: ["headless-wordpress", "website-india"],
  },

  /* =========================================================
     SAAS MVP DEVELOPMENT COST
  ========================================================= */
  {
    slug: "saas-mvp",
    draft: true,
    updated: "2026-11-01",
    type: "Web apps · Next.js",
    title: "SaaS MVP Development Cost",
    seoTitle: "SaaS MVP Development Cost: Next.js Build Prices & Timeline",
    description:
      "What a SaaS MVP costs to build with Next.js: prices by scope, timelines, monthly service costs and how to keep the first version lean.",
    answer:
      "A SaaS MVP built with Next.js costs {2} for a core product with accounts, billing and a dashboard, or {1} for a lean first version to test the idea. AI features take it to {3}.",
    currencies: ["USD", "INR"],
    options: [
      {
        name: "Lean first version",
        includes: "One core workflow, sign-in, a simple dashboard and payments through Stripe Checkout",
        hours: [70, 140],
        weeks: [3, 6],
      },
      {
        name: "Core MVP",
        includes: "Accounts and teams, billing, an admin area, emails and the main product features",
        hours: PROJECT_HOURS.saas.hours,
        weeks: [6, 14],
      },
      {
        name: "MVP with AI features",
        includes: "The core MVP plus AI features such as summaries, search or assistants built on an LLM API",
        hours: plus(PROJECT_HOURS.saas.hours, ADDITION_HOURS.ai.hours),
        weeks: [7, 16],
      },
    ],
    runningCosts: [
      { item: "Hosting", cost: "$0–$20 a month", note: "Vercel or Netlify; free tiers cover early users" },
      { item: "Database", cost: "$0–$25 a month", note: "Managed Postgres or MySQL, such as Neon or Supabase" },
      { item: "Sign-in", cost: "$0–$25 a month", note: "Built in, or a service such as Clerk" },
      { item: "Email", cost: "$0–$20 a month", note: "Transactional email for sign-ups and receipts" },
      { item: "Payments", cost: "About 3% per payment", note: "[DEMO] Stripe's standard card fee; varies by country" },
      { item: "AI API usage", cost: "Varies with use", note: "Often a few cents per user per day; cache and cap it" },
    ],
    drivers: [
      { title: "Number of workflows", text: "Each distinct thing a user can do adds screens, logic and tests. Start with the one that proves the idea." },
      { title: "Roles and permissions", text: "Teams, invitations and admin roles add a lot; single-user accounts are much simpler." },
      { title: "Billing", text: "Stripe Checkout is quick; usage-based or seat-based billing takes longer." },
      { title: "Integrations", text: "Each external API adds 4–15 hours, more when it has to sync both ways." },
      { title: "AI features", text: "Calling an LLM is quick; making the results reliable, safe and affordable is the work." },
    ],
    example: {
      title: "A booking SaaS for coaches [DEMO]",
      brief: "Replace with a real Next.js project, or a well-documented personal build such as the cost estimator.",
      scope: ["Next.js App Router with Postgres", "Accounts and Stripe subscriptions", "Calendar booking with email reminders", "Admin dashboard"],
      hours: [180, 220],
      weeks: [8, 10],
      outcome: "[DEMO] First paying customers within a month of launch.",
    },
    faqs: [
      {
        question: "How much does it cost to build a SaaS MVP?",
        answer:
          "With me, {2} for a core MVP, or {1} for a leaner first version. Agencies typically quote several times more for the same scope, mostly for team overhead.",
      },
      {
        question: "How long does an MVP take to build?",
        answer: "Three to six weeks for a lean first version and six to fourteen for a core MVP, depending on scope and how quickly decisions are made.",
      },
      {
        question: "Why Next.js for a SaaS MVP?",
        answer:
          "One codebase covers the marketing site, the app and the API, it deploys easily, and it's widely known, so you can hire for it later.",
      },
      {
        question: "Do I own the code?",
        answer: "Yes. The code lives in your repository and accounts are set up in your name from the start.",
      },
    ],
    estimator: { project_type: "SaaS / Web Application", technology: "Next.js / React" },
    related: ["headless-wordpress"],
  },

  /* =========================================================
     HEADLESS WORDPRESS DEVELOPMENT COST
  ========================================================= */
  {
    slug: "headless-wordpress",
    draft: true,
    updated: "2026-11-01",
    type: "WordPress · Next.js",
    title: "Headless WordPress Development Cost",
    seoTitle: "Headless WordPress Development Cost (Next.js) in 2026",
    description:
      "What a headless WordPress site with a Next.js front end costs: prices by scope, hosting, and when headless is worth it over a regular theme.",
    answer:
      "A headless WordPress site with a Next.js front end costs {2} for a typical business site, from {1} for a blog on your existing WordPress, and {3} for a large or multilingual site.",
    currencies: ["USD", "INR"],
    options: [
      {
        name: "Headless blog",
        includes: "A Next.js front end for an existing WordPress blog: posts, categories, search and SEO",
        hours: [50, 90],
        weeks: [3, 5],
      },
      {
        name: "Headless business site",
        includes: "Custom design, custom post types, forms, instant updates on publish and structured data",
        hours: [90, 160],
        weeks: [6, 10],
      },
      {
        name: "Large or multilingual site",
        includes: "A headless business site plus multiple languages, many content types and a content move",
        hours: plus(plus([90, 160], ADDITION_HOURS.multiLanguage.hours), ADDITION_HOURS.contentMigration.hours),
        weeks: [8, 14],
      },
    ],
    runningCosts: [
      { item: "WordPress hosting", cost: "$5–$30 a month", note: "WordPress only serves the editor and API, so small plans work" },
      { item: "Front-end hosting", cost: "$0–$20 a month", note: "Netlify or Vercel" },
      { item: "Forms and email", cost: "$0–$15 a month", note: "Transactional email for form notifications" },
      { item: "Updates and support", cost: "Optional, monthly", note: "WordPress and Next.js updates, and checks after each" },
    ],
    drivers: [
      { title: "Content model", text: "Each custom post type and field group needs an API shape and a template." },
      { title: "Preview and editing", text: "Live previews and instant updates on publish add time but keep editors happy." },
      { title: "Plugins that output HTML", text: "Plugins built for themes (sliders, page builders) need replacing in a headless site." },
      { title: "Languages", text: "Multilingual content adds routing, translations and SEO tags for every language." },
    ],
    example: {
      title: "pradipta.online (this website)",
      brief: "A headless WordPress site with a Next.js front end, built from the free headless starter. [DEMO: add the real hours.]",
      scope: ["WordPress for posts, case studies and form records", "Next.js 16 front end on Netlify", "Instant updates on publish", "An AI cost estimator"],
      hours: [120, 160],
      weeks: [6, 8],
      outcome: "[DEMO] Add real results: page speed scores, launch date, what changed.",
    },
    faqs: [
      {
        question: "Is headless WordPress more expensive?",
        answer:
          "It costs more to build, usually 50–100% more than a theme, because there are two parts. Running costs are similar, and security and speed are better.",
      },
      {
        question: "When is headless WordPress worth it?",
        answer:
          "When speed, search performance or a custom front end matter, or when the content also feeds an app. For a simple brochure site, a good block theme is usually enough.",
      },
      {
        question: "Can my team still use the WordPress editor?",
        answer: "Yes. Editors keep using WordPress exactly as before; only the public website changes.",
      },
      {
        question: "Do you have a starter for headless WordPress?",
        answer: "Yes, my free Headless WordPress Starter is the foundation I build these sites on.",
      },
    ],
    estimator: { project_type: "Business Website", technology: "Next.js / React" },
    related: ["wordpress-website", "saas-mvp"],
  },

  /* =========================================================
     WORDPRESS TO SHOPIFY MIGRATION COST
  ========================================================= */
  {
    slug: "wordpress-to-shopify-migration",
    draft: true,
    updated: "2026-11-01",
    type: "E-commerce · Migration",
    title: "WordPress to Shopify Migration Cost",
    seoTitle: "WordPress (WooCommerce) to Shopify Migration Cost",
    description:
      "What it costs to move a WooCommerce store to Shopify: prices by store size in ₹ and $, what gets moved, and how to keep your search rankings.",
    answer:
      "Moving a WooCommerce store to Shopify costs {1} for a small catalogue on a ready-made theme, {2} for a typical store, and {3} for large catalogues with customers, orders and a custom theme.",
    currencies: ["INR", "USD"],
    options: [
      {
        name: "Small store",
        includes: "Up to 100 products and pages moved, a theme set up, redirects and payments",
        hours: [30, 50],
        weeks: [2, 3],
      },
      {
        name: "Typical store",
        includes: "Up to 1,000 products with variants, customers, a customised theme and integrations",
        hours: plus([45, 80], ADDITION_HOURS.contentMigration.hours),
        weeks: [3, 6],
      },
      {
        name: "Large store",
        includes: "Thousands of products, order history, custom sections and careful SEO checks",
        hours: plus(PROJECT_HOURS.ecommerce.hours, [30, 60]),
        weeks: [6, 10],
      },
    ],
    runningCosts: [
      { item: "Shopify plan", cost: "About ₹1,500–₹5,600 a month", note: "[DEMO] Replaces your WordPress hosting; check current pricing" },
      { item: "Apps", cost: "₹0–₹5,000 a month", note: "Often replacing WooCommerce plugins you paid for yearly" },
      { item: "Migration app (optional)", cost: "$0–$200 once", note: "For large catalogues and order history" },
      { item: "Payment gateway", cost: "About 2% per order", note: "[DEMO] Same as before, plus any Shopify fee" },
    ],
    drivers: [
      { title: "Catalogue size and variants", text: "Clean data moves quickly; messy variants and attributes need tidying first." },
      { title: "Customer accounts and orders", text: "Moving history is optional; customers also have to reset their passwords." },
      { title: "SEO and redirects", text: "Every old product and category URL needs a redirect to keep rankings and links." },
      { title: "Custom WooCommerce features", text: "Anything built in custom code needs a Shopify app or a custom section." },
    ],
    example: {
      title: "A WooCommerce store moved to Shopify [DEMO]",
      brief: "Replace with a real migration and its before-and-after numbers.",
      scope: ["400 products with variants", "2,000 customers", "Over 500 redirects", "Theme customised to match the old design"],
      hours: [70, 90],
      weeks: [4, 5],
      outcome: "[DEMO] No drop in search traffic after launch, and lower monthly upkeep.",
    },
    faqs: [
      {
        question: "Will I lose my Google rankings when moving to Shopify?",
        answer:
          "Not if every old URL is redirected to its new address and titles and descriptions are carried over. A short dip while Google recrawls is normal.",
      },
      {
        question: "Can I move customers and orders?",
        answer: "Yes. Customers move with their details, but have to set a new password. Order history can be moved with a migration app.",
      },
      {
        question: "Is Shopify cheaper to run than WooCommerce?",
        answer:
          "Often similar in total: Shopify costs more each month, but replaces hosting, many paid plugins and much of the maintenance.",
      },
      {
        question: "How long does a migration take?",
        answer: "Two to three weeks for a small store, and up to ten for large catalogues with custom features.",
      },
    ],
    estimator: { project_type: "E-commerce", project_action: "Moving from another platform", technology: "Shopify" },
    related: ["shopify-store", "wordpress-website"],
  },
];

export const COST_GUIDES = ALL_COST_GUIDES;

// The guides that are public: listed, linked and in the sitemap.
export const PUBLISHED_COST_GUIDES = ALL_COST_GUIDES.filter((guide) => !guide.draft);

export const getCostGuide = (slug: string) => ALL_COST_GUIDES.find((guide) => guide.slug === slug);

// The full range across a guide's options, and each option's, in a currency.
export const optionPrice = (option: CostOption, currency: Currency) => priceHours(option.hours, currency);

export function guideRange(guide: CostGuide, currency: Currency = guide.currencies[0]) {
  const prices = guide.options.map((option) => optionPrice(option, currency));
  return { low: Math.min(...prices.map((p) => p.low)), high: Math.max(...prices.map((p) => p.high)) };
}

// Fills {range}, {1}, {2}... with prices in the guide's main currency.
export function fillPrices(text: string, guide: CostGuide): string {
  const currency = guide.currencies[0];
  return text
    .replace("{range}", formatRange(guideRange(guide), currency))
    .replace(/\{(\d)\}/g, (token, n: string) => {
      const option = guide.options[Number(n) - 1];
      return option ? formatRange(optionPrice(option, currency), currency) : token;
    });
}

// The estimator, opened with this guide's answers already chosen.
export const estimatorLink = (guide: CostGuide) =>
  `/cost-estimator?${new URLSearchParams(guide.estimator).toString()}#estimateForm`;

// A link only to guides that are public, unless the page itself is a draft
// (so drafts can be checked together).
export const relatedGuides = (guide: CostGuide) =>
  guide.related
    .map(getCostGuide)
    .filter((related): related is CostGuide => Boolean(related) && (guide.draft || !related!.draft));
