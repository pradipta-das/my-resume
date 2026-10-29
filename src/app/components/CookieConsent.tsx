"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  OPEN_SETTINGS_EVENT,
  applyConsent,
  readConsent,
  saveConsent,
  trackPageView,
  type Consent,
} from "../lib/analytics";

/*
 * Cookie banner. Shown until the visitor chooses; "Accept all" and "Reject
 * all" sit side by side with equal weight, and "Choose" offers a switch per
 * purpose. The footer's "Cookie settings" link reopens it. Nothing tracks
 * until a choice allows it (see lib/analytics).
 */
export default function CookieConsent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [customising, setCustomising] = useState(false);
  const [choice, setChoice] = useState<Consent>({ analytics: false, marketing: false });
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // On load: apply a stored choice, or ask. Read after mount, since the choice
  // lives in the browser.
  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      applyConsent(stored);
    } else {
      setOpen(true); // eslint-disable-line react-hooks/set-state-in-effect -- first read of browser-only state
    }

    const reopen = () => {
      setChoice(readConsent() ?? { analytics: false, marketing: false });
      setCustomising(true);
      setOpen(true);
      requestAnimationFrame(() => headingRef.current?.focus());
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  // Client-side navigation: a page view for the Meta Pixel (skips the first
  // render, which the pixel counts itself when it loads).
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = pathname;
    trackPageView();
  }, [pathname]);

  const decide = (consent: Consent) => {
    saveConsent(consent);
    setOpen(false);
    setCustomising(false);
  };

  if (!open) return null;

  return (
    <section className="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text">
      <div className="cookie-banner-copy">
        <h2 id="cookie-title" ref={headingRef} tabIndex={-1} className="cookie-banner-title">
          Cookies, honestly.
        </h2>
        <p id="cookie-text" className="cookie-banner-text">
          I&apos;d like to use Google Analytics to see which pages are useful, and the Meta Pixel to measure my ads.
          Neither loads unless you say yes, and you can change your mind any time from the footer.{" "}
          <Link href="/privacy-policy#cookies" className="underline underline-offset-4">
            Privacy policy
          </Link>
          .
        </p>

        {customising && (
          <fieldset className="cookie-options">
            <legend className="sr-only">Choose which cookies to allow</legend>

            <label className="cookie-option is-locked">
              <input type="checkbox" checked disabled className="h-4 w-4 accent-black" />
              <span>
                <strong>Strictly necessary</strong>
                <small>Remembers this choice. Always on.</small>
              </span>
            </label>

            <label className="cookie-option">
              <input
                type="checkbox"
                checked={choice.analytics}
                onChange={(e) => setChoice({ ...choice, analytics: e.target.checked })}
                className="h-4 w-4 accent-black"
              />
              <span>
                <strong>Analytics</strong>
                <small>Google Analytics: which pages are visited and how people find the site.</small>
              </span>
            </label>

            <label className="cookie-option">
              <input
                type="checkbox"
                checked={choice.marketing}
                onChange={(e) => setChoice({ ...choice, marketing: e.target.checked })}
                className="h-4 w-4 accent-black"
              />
              <span>
                <strong>Marketing</strong>
                <small>Meta Pixel: measuring and improving my ads on Facebook and Instagram.</small>
              </span>
            </label>
          </fieldset>
        )}
      </div>

      <div className="cookie-banner-actions">
        <button type="button" className="cookie-btn" onClick={() => decide({ analytics: false, marketing: false })}>
          Reject all
        </button>
        <button type="button" className="cookie-btn" onClick={() => decide({ analytics: true, marketing: true })}>
          Accept all
        </button>
        {customising ? (
          <button type="button" className="cookie-btn-link" onClick={() => decide(choice)}>
            <span className="link-redraw">Save my choices</span>
          </button>
        ) : (
          <button type="button" className="cookie-btn-link" onClick={() => setCustomising(true)}>
            <span className="link-redraw">Choose</span>
          </button>
        )}
      </div>
    </section>
  );
}
