/*
 * Google Analytics and the Meta Pixel, loaded only with the visitor's consent
 * (see components/CookieConsent). Browser only.
 *
 * Nothing from Google or Meta loads until the visitor allows it. Google's
 * Consent Mode v2 is set to "denied" first and updated from the visitor's
 * choice before gtag.js loads, so Google Ads measurement keeps working for
 * UK and EU visitors who say yes.
 *
 * Events never carry personal details: no names, emails or form answers.
 */

export const GA_MEASUREMENT_ID = "G-F31R4Y9H1X";
export const META_PIXEL_ID = "882884554674004";

// Bump the version when what's collected changes, so everyone is asked again.
// Choices also expire after a year.
const CONSENT_KEY = "pd-consent";
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export type Consent = { analytics: boolean; marketing: boolean };
type StoredConsent = Consent & { version: number; savedAt: number };

type Gtag = (...args: unknown[]) => void;
type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/* =========================================================
   STORED CHOICE
   The choice itself is kept in the browser's local storage:
   it's needed to respect the choice, so it doesn't need consent.
========================================================= */

export function readConsent(): Consent | null {
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null") as StoredConsent | null;
    if (!stored || stored.version !== CONSENT_VERSION || Date.now() - stored.savedAt > CONSENT_MAX_AGE_MS) return null;
    return { analytics: stored.analytics, marketing: stored.marketing };
  } catch {
    return null;
  }
}

function storeConsent(consent: Consent) {
  try {
    const stored: StoredConsent = { ...consent, version: CONSENT_VERSION, savedAt: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
  } catch {
    // Storage blocked (private mode, settings): the choice applies to this visit only.
  }
}

/* =========================================================
   LOADING
========================================================= */

function addScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function ensureGtag(): Gtag {
  if (!window.gtag) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // gtag.js expects the arguments object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }
  return window.gtag;
}

let gaLoaded = false;
let metaLoaded = false;

function loadGoogleAnalytics() {
  if (gaLoaded) return;
  gaLoaded = true;
  const gtag = ensureGtag();
  gtag("js", new Date());
  // Page views on client-side navigation are picked up by GA's enhanced
  // measurement ("page changes based on browser history events").
  gtag("config", GA_MEASUREMENT_ID);
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
}

function loadMetaPixel() {
  if (metaLoaded) return;
  metaLoaded = true;

  // Meta's standard loader: queue calls until fbevents.js arrives.
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) (fbq.callMethod as (...a: unknown[]) => void).apply(fbq, args);
    else fbq.queue!.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = window.fbq ?? fbq;
  window._fbq = window._fbq ?? window.fbq;

  // No automatic configuration: the pixel mustn't scan buttons or forms, and
  // no advanced matching (no email addresses) is sent.
  window.fbq("set", "autoConfig", false, META_PIXEL_ID);
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
  addScript("https://connect.facebook.net/en_US/fbevents.js");
}

// Cookies set by the two services, removed when consent is withdrawn.
function clearTrackingCookies() {
  const host = location.hostname.replace(/^www\./, "");
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => /^(_ga|_gid|_gat|_fbp|_fbc)/.test(name));

  for (const name of names) {
    for (const domain of ["", `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

/* =========================================================
   APPLYING A CHOICE
========================================================= */

// Loads whatever the visitor allowed. Called on every page load with the
// stored choice, and when the visitor makes or changes a choice.
export function applyConsent(consent: Consent) {
  if (consent.analytics || consent.marketing) {
    ensureGtag()("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
  }
  if (consent.analytics) loadGoogleAnalytics();
  if (consent.marketing) loadMetaPixel();
}

// Saves a new choice. Withdrawing something that's already running removes
// its cookies and reloads the page, so the scripts stop too.
export function saveConsent(consent: Consent) {
  const withdrawn = (gaLoaded && !consent.analytics) || (metaLoaded && !consent.marketing);
  storeConsent(consent);

  if (withdrawn) {
    window.gtag?.("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
    if (!consent.marketing) window.fbq?.("consent", "revoke");
    clearTrackingCookies();
    location.reload();
    return;
  }
  applyConsent(consent);
}

/* =========================================================
   EVENTS
========================================================= */

// Meta needs a page view for each client-side navigation (GA handles its own).
export function trackPageView() {
  if (metaLoaded) window.fbq?.("track", "PageView");
}

// A completed estimate or consultation request. Mark "generate_lead" as a key
// event in Google Analytics to count these as conversions.
export function trackLead(form: "cost_estimator" | "free_consultation") {
  if (gaLoaded) window.gtag?.("event", "generate_lead", { form_name: form });
  if (metaLoaded) {
    if (form === "free_consultation") window.fbq?.("track", "Schedule");
    else window.fbq?.("track", "Lead", { content_name: "Cost estimate" });
  }
}

// Opens the cookie settings (the footer's "Cookie settings" link).
export const OPEN_SETTINGS_EVENT = "pd:cookie-settings";
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
