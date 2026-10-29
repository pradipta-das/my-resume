"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawBorders } from "../utils/drawBorders";
import { magnetic } from "../utils/magnetic";
import { openCookieSettings } from "../lib/analytics";
import { RESOURCES } from "../lib/resources";
import { siteConfig } from "../lib/seo";
import ResourceCard from "./ResourceCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Journal categories (WordPress category slugs); each opens the journal filtered to it.
const TRENDING_TOPICS = [
  { label: "AI", category: "ai" },
  { label: "WordPress", category: "wordpress" },
  { label: "Performance", category: "performance" },
  { label: "Shopify", category: "shopify" },
  { label: "Next.js", category: "next-js" },
];

export default function HomeFooter() {
  const rootRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  // Footer lines (including the trending-topics brick grid) draw themselves in.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    mm.add("(prefers-reduced-motion: no-preference)", () => drawBorders(rootRef.current!));
    mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () =>
      magnetic(rootRef.current!),
    );
    return () => mm.revert();
  }, []);

  return (
    <footer ref={rootRef} data-section="footer" className="site-footer">
      {/* The resources page lists these itself, so the footer leaves them out there. */}
      {pathname !== "/resources" && (
        <section className="footer-resources" aria-labelledby="footer-resources-title">
          <div className="footer-resources-head">
            <span className="footer-resources-label">Free Resources</span>
            <h2 id="footer-resources-title" className="footer-resources-title">
              From my workbench, free to take.
            </h2>
            <p className="footer-copy">
              Starters, plugins and notes that came out of real projects. Use them, change them,
              ship something with them.
            </p>
            <Link href="/resources" data-magnetic className="footer-resources-all link-redraw">
              All resources
            </Link>
          </div>

          <ul className="resource-grid footer-resources-grid">
            {RESOURCES.map((resource) => (
              <li key={resource.slug}>
                <ResourceCard resource={resource} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="footer-content">
        <div className="footer-brand">
          <Link href="/" className="footer-title" aria-label="Pradipta Das, home">
            <Image src="/logo-footer.svg" alt="" width={242} height={75} />
          </Link>

          <h3 className="footer-heading mt-8">Ready to start?</h3>

          <p className="footer-copy">
            Whether you have a brief ready or just an idea you want to talk through, get in touch.
            No obligations, no agency pitch - just a conversation.
          </p>

          <div className="footer-social">
            <a href="/free-consultation" data-magnetic className="link-redraw">
              Book A Free Consultation Call
            </a>
            <a href="/cost-estimator" data-magnetic className="link-redraw">
              Try Free Cost Calculator
            </a>
            <a href="https://www.studiolnc.dev" data-magnetic className="link-redraw normal-case">
              Visit studiolnc.dev
            </a>
          </div>
        </div>

        <div className="footer-contact">
          <span className="footer-label">Trending topics</span>

          <div className="footer-meta">
            {TRENDING_TOPICS.map((topic) => (
              <div key={topic.category} className="footer-topic">
                <Link href={`/blog?category=${topic.category}`} className="footer-meta-value">
                  {topic.label}
                </Link>
              </div>
            ))}

            {/* Empty bricks completing the eight-cell line pattern under the topics */}
            {Array.from({ length: 8 - TRENDING_TOPICS.length }, (_, i) => (
              <div key={i} aria-hidden="true" className="footer-brick" />
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-legal">
            <span className="footer-copyright">© 2026 Pradipta Das. All rights reserved.</span>
            <Link href="/privacy-policy" className="link-sweep">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="link-sweep">
              Terms &amp; Conditions
            </Link>
            <button type="button" onClick={openCookieSettings} className="footer-cookie-btn link-sweep">
              Cookie settings
            </button>
          </div>

          <span className="footer-follow">
            Follow me on{" "}
            <a href={siteConfig.profiles.linkedin} target="_blank" rel="noopener me" className="link-sweep">
              LinkedIn
            </a>{" "}
            |{" "}
            <a href={siteConfig.profiles.x} target="_blank" rel="noopener me" className="link-sweep">
              X
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
