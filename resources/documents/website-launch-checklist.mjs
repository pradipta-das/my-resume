// The Website Launch Checklist (PDF). Edit the lists below, then run
// `npm run resources` to rebuild public/downloads/website-launch-checklist.pdf.
import { createElement as h } from "react";
import { BrandDocument, Check, Closing, Section } from "./pdf.mjs";

export const file = "website-launch-checklist.pdf";

const SECTIONS = [
  {
    title: "Technical SEO",
    note: "Most launch-day ranking drops come from settings carried over from staging. Check the live site, not staging.",
    items: [
      ["No page is set to noindex.", "Look for `<meta name=\"robots\" content=\"noindex\">` and an `X-Robots-Tag: noindex` header. In WordPress, untick Settings › Reading › \"Discourage search engines\"."],
      ["robots.txt doesn't block the site.", "No `Disallow: /` left over from staging, and a `Sitemap:` line pointing to the live sitemap."],
      ["The XML sitemap lists only live, indexable pages.", "Every URL in it should return 200, be canonical and not be noindexed."],
      ["Canonical tags point to the live domain.", "Not to staging, and each indexable page points to itself."],
      ["One address for the whole site.", "http to https and www to non-www (or the reverse) in a single 301 redirect, not a chain."],
      ["Every page has its own title and meta description.", "Titles of roughly 50–60 characters, and one H1 per page."],
      ["Structured data passes Google's Rich Results Test.", "Organisation or Person, breadcrumbs, articles, products: whichever the site uses."],
      ["Shared links look right.", "Paste a few URLs into a messaging app or social post to check the share image and title."],
      ["No links point to the staging domain.", "Search the database or the codebase for the staging address before launch."],
    ],
  },
  {
    title: "Redirects and 404s",
    note: "Every old URL with links or traffic should land somewhere useful on the new site.",
    items: [
      ["List every URL on the old site.", "Combine a crawl, the old sitemap, your top landing pages in analytics and the pages in Search Console."],
      ["Map each old URL to its closest new page.", "Use 301 (permanent) redirects, not 302. Send a page to the home page only when nothing closer exists."],
      ["No redirect chains or loops.", "A redirects straight to C, never A to B to C."],
      ["The 404 page returns a real 404 status.", "Not a 200 \"soft 404\". Give it navigation or search so visitors can recover."],
      ["Update the links you control elsewhere.", "Google Business Profile, social profiles, email signatures, ads and directory listings."],
    ],
  },
  {
    title: "Page speed and Core Web Vitals",
    note: "Test the main templates (home, a content page, a listing, a product or form page) on mobile in PageSpeed Insights.",
    items: [
      ["Core Web Vitals are in the \"good\" range.", "Largest Contentful Paint 2.5 s or less, Interaction to Next Paint 200 ms or less, Cumulative Layout Shift 0.1 or less."],
      ["Images are sized and compressed.", "WebP or AVIF, no larger than they're shown, with width and height set so the layout doesn't jump."],
      ["The main image above the fold loads first.", "Don't lazy-load it; lazy-load the images further down instead."],
      ["Fonts are kept in check.", "A few families and weights, `font-display: swap`, and preload only the fonts above the fold."],
      ["Caching is on.", "A page cache or CDN for HTML, and long cache lifetimes for CSS, JavaScript and images."],
      ["Third-party scripts have earned their place.", "Remove the ones nobody uses, and load the rest after the page or after consent."],
      ["Unused plugins, apps and themes are removed.", "Deactivated is not enough: delete them."],
    ],
  },
  {
    title: "Accessibility basics",
    note: "Automated tools such as Lighthouse, axe or WAVE find only part of the problems. Do a keyboard pass yourself as well.",
    items: [
      ["Text contrast meets WCAG AA.", "At least 4.5:1 for body text and 3:1 for large text."],
      ["Headings follow a logical order.", "One H1, then H2s and H3s that outline the page. Never pick a heading for its size."],
      ["Images have the right alt text.", "Describe the images that carry information; give decorative ones an empty `alt=\"\"`."],
      ["Everything works with a keyboard.", "Menus, forms, sliders and pop-ups, with a visible focus outline and a skip link."],
      ["Form fields have visible labels.", "Errors say what went wrong and how to fix it, in text rather than colour alone."],
      ["Link text describes where it goes.", "\"Read the case study\", not \"click here\"."],
      ["The page language is set.", "`<html lang=\"en\">`, or the right language for the site."],
      ["The layout holds up when zoomed.", "Readable at 200% zoom and at 320 px wide without scrolling sideways."],
      ["Videos have captions, and nothing plays sound on its own.", null],
    ],
  },
  {
    title: "Analytics, consent and tracking",
    items: [
      ["Analytics records the live domain.", "Visit the site and watch for yourself in the real-time report. Exclude or filter out staging."],
      ["Each conversion is tracked once.", "Form submissions, purchases, sign-ups and phone clicks: test each one and check it isn't counted twice."],
      ["Consent works where the law requires it.", "In the UK and EU, non-essential cookies and tags load only after the visitor agrees, and the choice is remembered."],
      ["The privacy policy matches what the site collects.", "Including every analytics, advertising and embedded service."],
      ["The site is verified in Search Console and Bing Webmaster Tools.", "Use a Domain property in Search Console. Bing can import it from Google."],
      ["Ad and pixel conversions are tested.", "Use each platform's own test or debug tool."],
      ["The launch date is noted in analytics.", "So any change in the numbers can be traced back to it."],
    ],
  },
  {
    title: "Forms and emails",
    items: [
      ["Every form works on the live domain.", "Submit each one on a phone and a desktop."],
      ["Notifications reach the right inbox.", "And not its spam folder. Send a test from an outside address."],
      ["Email is sent from your own domain and authenticated.", "SPF, DKIM and DMARC records in place for the domain that appears in the From address."],
      ["Automatic emails have the right links and branding.", "Order confirmations, password resets and replies point to the live site, not staging."],
      ["Spam protection doesn't stop real people.", "Honeypot fields, rate limits or a CAPTCHA, tested with a normal submission."],
      ["For online stores: a real order goes all the way through.", "Pay with a real card, check tax, shipping and the emails, then refund it."],
    ],
  },
  {
    title: "Security, SSL and backups",
    items: [
      ["The SSL certificate covers every version of the domain.", "Both www and non-www, renewing automatically, with no mixed-content warnings."],
      ["Admin accounts are locked down.", "Strong, unique passwords and two-factor sign-in; delete staging and unused accounts."],
      ["Core software, themes and plugins are up to date.", null],
      ["Basic security headers are set.", "`Strict-Transport-Security` once HTTPS is stable, `X-Content-Type-Options: nosniff` and a `Referrer-Policy`."],
      ["The staging site is password-protected or deleted.", "A public copy of the site competes with it in search."],
      ["A full backup is taken just before launch and stored off the server.", "Files and database, and you've checked that a restore works."],
      ["There's a rollback plan.", "Who does what, and how to switch back within an hour if something breaks."],
      ["Uptime monitoring is on.", "So you hear about an outage before your visitors do."],
    ],
  },
  {
    title: "Launch day",
    items: [
      ["Lower the DNS TTL a day ahead.", "So the switch takes minutes rather than hours. Leave the MX records alone so email keeps working."],
      ["Freeze content changes on the old site.", null],
      ["Switch over, then clear every cache.", "Server, CDN and any page-cache plugin."],
      ["Run a smoke test on mobile and desktop.", "Home page, key pages, every form, checkout, search and the 404 page."],
      ["Check for noindex and robots.txt once more, on the live site.", null],
      ["Submit the sitemap in Search Console.", "And request indexing for the home page."],
      ["Keep the old hosting until everything has moved.", "DNS changes can take a while to reach everyone."],
    ],
  },
  {
    title: "The week after",
    items: [
      ["Check Search Console for crawl errors and 404s.", "Add redirects for any old URLs you missed."],
      ["Compare traffic and conversions with the weeks before.", "Look at the top landing pages one by one."],
      ["Watch the server error logs.", null],
      ["Re-run the speed tests.", "Field data from real visitors in PageSpeed Insights covers the last 28 days, so it catches up over the first month."],
      ["Set up regular, automatic backups.", "And note when to check that a restore still works."],
    ],
  },
];

export function document() {
  return h(
    BrandDocument,
    {
      title: "Website Launch Checklist",
      eyebrow: "Free resource from Pradipta Das",
      intro:
        "Launches rarely go wrong on the big things. They go wrong on a forgotten redirect, a noindex tag left over from staging or an analytics tag that never fired. Work through this list a week before launch, then again on the day and the week after. It works for any platform: WordPress, Shopify, Next.js or anything else.",
      footerNote: "Website Launch Checklist · Free to use and share",
    },
    SECTIONS.map((section, i) =>
      h(
        Section,
        { key: section.title, number: i + 1, title: section.title, note: section.note },
        section.items.map(([text, detail]) => h(Check, { key: text, text, detail })),
      ),
    ),
    h(Closing, {
      title: "Launching something soon?",
      text: "I'm happy to look over your launch plan or run through this list with you on a free call:",
      href: "https://pradipta.online/free-consultation",
      label: "pradipta.online/free-consultation",
    }),
  );
}
