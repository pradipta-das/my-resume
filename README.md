# pradipta.online

Portfolio and lead-generation site for Pradipta Das, built with Next.js (App Router), Tailwind CSS v4 and GSAP. Content comes from a headless WordPress at logicncolor.com.

## Getting started

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run dev                  # http://localhost:3000
```

`npm run build` makes a production build, and `npm run lint` checks the code.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Homepage |
| `/about` | About me |
| `/case-studies`, `/case-studies/[slug]` | Case studies from the `case-study` post type |
| `/blog`, `/blog/[slug]` | The Journal: WordPress posts |
| `/cost-estimator` | AI cost estimator (Claude), saved to WordPress |
| `/free-consultation` | Consultation booking, saved to WordPress |
| `/resources`, `/resources/[slug]` | Free downloads, listed in `src/app/lib/resources.ts` (files go in `public/downloads/`) |
| `/privacy-policy`, `/terms-and-conditions` | Legal pages |

API routes: `POST /api/estimate` and `POST /api/consultation`.

## Project layout

```
src/app/
  components/   Page sections and shared UI (header, footer, forms, cards, cookie banner)
  lib/          Data and integrations: WordPress, case studies, blog, estimate (Claude),
                consultation, analytics (consent-gated GA4 + Meta Pixel), legal details
  utils/        GSAP helpers: section animations, border drawing, magnetic links
  input.css     All styles (Tailwind v4 theme and components)
wordpress/      WordPress plugins the site relies on (install on logicncolor.com)
```

## WordPress

The site reads WordPress over its REST API, server-side only, sending `WORDPRESS_API_SECRET` with every request. The plugins in `wordpress/` must be installed and active:

| Plugin | Purpose | wp-config.php |
| --- | --- | --- |
| `pradipta-rest-lock` | Blocks the REST API for anyone without the key | `PRADIPTA_API_SECRET` |
| `pradipta-redirect` | Sends visitors of logicncolor.com to pradipta.online | |
| `pradipta-estimates` | Stores cost estimates | `PRADIPTA_ESTIMATE_SECRET` |
| `pradipta-consultations` | Stores consultation requests and emails a notification | (uses `PRADIPTA_API_SECRET`) |
| `pradipta-case-studies` | The Case Studies post type and its fields | |

To install one, zip its folder and upload it under Plugins → Add New → Upload Plugin.

## Analytics and privacy

Google Analytics and the Meta Pixel load only after a visitor accepts cookies (`src/app/components/CookieConsent.tsx`, `src/app/lib/analytics.ts`). If you add a tracking service or change what's collected, update the privacy policy (`src/app/privacy-policy/page.tsx`) and bump `CONSENT_VERSION` in `lib/analytics.ts` so visitors are asked again.
