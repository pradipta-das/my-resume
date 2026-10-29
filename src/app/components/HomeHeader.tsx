"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Book Free Consultation", href: "/free-consultation" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "The Journal", href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: "Cost Estimator", href: "/cost-estimator" },
  { label: "Visit studiolnc.dev", href: "#" },
];

export default function HomeHeader() {
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const closeMenu = () => setIsMenuOpen(false);

  // Mobile menu: lock scroll, close on Escape, close when resizing up to lg.
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };

    document.body.classList.add("overflow-hidden");
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [isMenuOpen]);

  // The mobile menu pieces are position: fixed inside this fixed header. Keep
  // transforms/filters off the <header> itself (animate its children instead),
  // otherwise they become positioned relative to the header, not the viewport.
  return (
    <header className="site-header fixed top-0 z-99 w-full bg-transparent">
      <div className="bg-blur w-full h-full absolute left-0 right-0 top-0 bottom-0 m-auto bg-white/65 backdrop-blur-sm -z-1"></div>

      <Link href="/" className="site-logo" aria-label="Pradipta Das, home" onClick={closeMenu}>
        <Image src="/logo.svg" alt="" width={97} height={34} priority />
      </Link>

      <nav className="site-nav">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="link-sweep">
            {link.label}
          </a>
        ))}
      </nav>

      {/* =====================================================
          MOBILE NAVIGATION
      ====================================================== */}

      <button
        ref={menuToggleRef}
        type="button"
        id="mobile-menu-toggle"
        className={`mobile-menu-toggle${isMenuOpen ? " is-open" : ""}`}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="mobile-menu-icon">
          <span className="mobile-menu-line"></span>
          <span className="mobile-menu-line"></span>
          <span className="mobile-menu-line"></span>
        </span>
      </button>

      <div
        id="mobile-menu-overlay"
        className={`mobile-menu-overlay${isMenuOpen ? " is-open" : ""}`}
        onClick={closeMenu}
      ></div>

      <nav
        id="mobile-menu"
        className={`mobile-menu${isMenuOpen ? " is-open" : ""}`}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <div>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="mobile-menu-link" onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
