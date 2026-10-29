"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { animateSections } from "../utils/animateSections";
import { magnetic } from "../utils/magnetic";

/*
 * A <main> that runs the shared section animations (see utils/animateSections)
 * and magnetic links on whatever it wraps, so server-rendered pages get the
 * same motion as the homepage without becoming client components.
 */
export default function AnimatedPage({ children, className = "page" }: { children: React.ReactNode; className?: string }) {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    mm.add("(prefers-reduced-motion: no-preference)", () => animateSections(rootRef.current!));
    mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () =>
      magnetic(rootRef.current!),
    );
    return () => mm.revert();
  }, []);

  return (
    <main ref={rootRef} className={className}>
      {children}
    </main>
  );
}
