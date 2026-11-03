"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

/*
 * Cloudflare Turnstile's bot check, for the forms that send email or call the
 * AI. Rendered inside a form, the widget adds a hidden "cf-turnstile-response"
 * field with its token, which the API routes check with Cloudflare (see
 * lib/turnstile). It stays invisible unless Cloudflare wants the visitor to
 * click.
 */

// Outside production, Cloudflare's always-pass test key, so the forms work on
// localhost (the real key only works on the widget's domains).
const SITE_KEY = process.env.NODE_ENV === "production" ? "0x4AAAAAAFyOatTUgU_gDf0O" : "1x00000000000000000000AA";

export const TURNSTILE_FIELD = "cf-turnstile-response";

type TurnstileApi = {
  render(container: HTMLElement, options: Record<string, unknown>): string | undefined;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// One script for the whole page, however many widgets mount.
let loading: Promise<TurnstileApi> | undefined;

function loadTurnstile(): Promise<TurnstileApi> {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile didn't start")));
    script.onerror = () => {
      // Let a later mount try again (a blocker may have been switched off).
      loading = undefined;
      reject(new Error("Turnstile didn't load"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

export type TurnstileHandle = {
  // Tokens are single use: call after a submission so a retry gets a new one.
  reset(): void;
};

// action: names the form, and the server checks the token was made for it.
export default function Turnstile({ action, ref }: { action: string; ref?: Ref<TurnstileHandle> }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<string | undefined>(undefined);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (widgetRef.current) window.turnstile?.reset(widgetRef.current);
      },
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    // If it never loads, there's no token and the form says so on submit.
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetRef.current = turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          action,
          appearance: "interaction-only",
          theme: "light",
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (widgetRef.current) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = undefined;
    };
  }, [action]);

  return <div ref={containerRef} className="turnstile" />;
}
