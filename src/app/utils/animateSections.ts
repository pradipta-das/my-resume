import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { drawBorders } from "./drawBorders";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/*
 * Scroll animations shared by every page, driven by data attributes:
 *
 *   data-reveal="fade-up"     block fades and rises in when scrolled into view
 *   data-reveal="stagger"     its children fade and rise in one after another
 *   data-reveal="image"       image wrapper is wiped in with clip-path while
 *                             the image settles from a slight zoom
 *   data-drift                on an image wrapper: the image keeps drifting
 *                             inside its frame while scrolling (cover images)
 *   data-marquee              on an image wrapper: skip the zoom (the page
 *                             loops the strip itself)
 *   data-split="words"        heading rises word by word from behind its lines
 *   data-split="scrub"        heading builds line by line, tied to scroll
 *   data-count                number that counts up from 0
 *   data-divider              element whose ::before divider grows in; its CSS
 *                             scales the divider by var(--divider)
 *
 * Every border inside `root` also draws itself in (see drawBorders).
 *
 * Call inside a gsap.matchMedia callback guarded by prefers-reduced-motion,
 * and return the result from it so the DOM changes are undone on revert.
 */
// SplitText labels the element with its text so screen readers skip the
// fragments; aria-label is only valid on headings, though, so anything else
// (a <p> tagline) keeps its text as-is for screen readers instead.
const ariaFor = (el: Element) => (/^H[1-6]$/.test(el.tagName) ? "auto" : "none");

export function animateSections(root: HTMLElement): () => void {
  const undoBorders = drawBorders(root);
  const all = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, root);

  all("[data-reveal='fade-up']").forEach((el) => {
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  all("[data-reveal='stagger']").forEach((el) => {
    gsap.from(el.children, {
      y: 24,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  all("[data-reveal='image']").forEach((el) => {
    const img = el.hasAttribute("data-marquee") ? null : el.querySelector("img");
    const drift = el.hasAttribute("data-drift");

    const reveal = gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } })
      .from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" });

    // Drifting images stay slightly enlarged so they never show an edge.
    if (img) {
      reveal.fromTo(
        img,
        { scale: drift ? 1.3 : 1.15 },
        { scale: drift ? 1.12 : 1, duration: 1.8, ease: "power3.out" },
        0,
      );
    }

    if (img && drift) {
      gsap.fromTo(
        img,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }
  });

  // Masks are removed once the words land, so descenders aren't clipped and
  // the heading is plain text again.
  all("[data-split='words']").forEach((el) => {
    SplitText.create(el, {
      type: "lines,words",
      aria: ariaFor(el),
      mask: "lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.words, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.04,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onComplete: () => self.revert(),
        }),
    });
  });

  all("[data-split='scrub']").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      aria: ariaFor(el),
      linesClass: "split-line",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 60,
          autoAlpha: 0,
          stagger: 0.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 50%", scrub: 0.6 },
        }),
    });
  });

  all("[data-count]").forEach((el) => {
    gsap.from(el, {
      textContent: 0,
      snap: { textContent: 1 },
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  all("[data-divider]").forEach((el) => {
    gsap.from(el, {
      "--divider": 0,
      duration: 1.6,
      ease: "power3.inOut",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  return undoBorders;
}
