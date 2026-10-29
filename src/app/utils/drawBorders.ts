import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SIDES = ["top", "right", "bottom", "left"] as const;
const REPLACED = "img, video, canvas, iframe, embed, object, input, textarea, select";
// Opt-out for areas whose borders react to state (hover, checked, ...).
const STATIC = "[data-static-borders], [data-static-borders] *";
type Side = (typeof SIDES)[number];

// Where in the viewport each side starts drawing (fraction from the top),
// measured against the element's top edge, or its bottom edge for "bottom".
const START: Record<Side, number> = { top: 0.9, right: 0.85, bottom: 0.95, left: 0.85 };

// Scroll position at which a side starts drawing. Capped just short of the
// maximum scroll so lines at the very end of the page still fire.
const startFor = (el: HTMLElement, side: Side) => () => {
  const rect = el.getBoundingClientRect();
  const edge = (side === "bottom" ? rect.bottom : rect.top) + window.scrollY;
  return Math.min(edge - window.innerHeight * START[side], ScrollTrigger.maxScroll(window) - 1);
};

/*
 * Draws the CSS borders inside `root` in as lines when they scroll into view.
 *
 * Every visible, straight border side is made transparent and covered by a line that
 * scales from 0 to full length (left to right, top to bottom). Once a line has
 * drawn it is removed and the real border restored, so breakpoint changes
 * afterwards behave normally.
 *
 * Call inside a gsap.context / matchMedia callback so the tweens and
 * ScrollTriggers revert with it, and call the returned function on cleanup to
 * undo the DOM changes.
 */
export function drawBorders(root: HTMLElement): () => void {
  const cleanups: Array<() => void> = [];

  [root, ...root.querySelectorAll<HTMLElement>("*")].forEach((el) => {
    // Replaced elements can't hold the line element, so their borders stay as is.
    if (el.matches(REPLACED) || el.matches(STATIC)) return;

    const cs = getComputedStyle(el);
    if (cs.display === "contents" || cs.display === "none") return;

    // A straight line can't trace a rounded corner.
    const rounded = ["top-left", "top-right", "bottom-right", "bottom-left"].some(
      (corner) => parseFloat(cs.getPropertyValue(`border-${corner}-radius`)) > 0,
    );
    if (rounded) return;

    const width = (side: Side) => parseFloat(cs.getPropertyValue(`border-${side}-width`)) || 0;
    const color = (side: Side) => cs.getPropertyValue(`border-${side}-color`);

    const sides = SIDES.filter(
      (side) =>
        width(side) > 0 &&
        cs.getPropertyValue(`border-${side}-style`) !== "none" &&
        color(side) !== "rgba(0, 0, 0, 0)",
    );
    if (!sides.length) return;

    // Lines sit exactly over the border, outside the padding box. An element
    // that clips its overflow would hide them there, so draw just inside.
    const clipped = cs.overflowX !== "visible" || cs.overflowY !== "visible";
    const offset = (side: Side) => `${clipped ? 0 : -width(side)}px`;

    const savedPosition = el.style.position;
    if (cs.position === "static") el.style.position = "relative";

    let pending = sides.length;

    sides.forEach((side) => {
      const horizontal = side === "top" || side === "bottom";
      const savedColor = el.style.getPropertyValue(`border-${side}-color`);
      const line = document.createElement("span");

      line.setAttribute("aria-hidden", "true");
      Object.assign(line.style, {
        position: "absolute",
        zIndex: "1",
        pointerEvents: "none",
        background: color(side),
        transformOrigin: horizontal ? "left center" : "center top",
        [side]: offset(side),
        ...(horizontal
          ? { left: offset("left"), right: offset("right"), height: `${width(side)}px` }
          : { top: offset("top"), bottom: offset("bottom"), width: `${width(side)}px` }),
      });

      el.style.setProperty(`border-${side}-color`, "transparent");
      el.appendChild(line);

      let restored = false;
      const restore = () => {
        if (restored) return;
        restored = true;
        line.remove();
        el.style.setProperty(`border-${side}-color`, savedColor);
        if (--pending === 0) el.style.position = savedPosition;
      };
      cleanups.push(restore);

      // Long vertical lines take a little longer so they don't snap down.
      const duration = horizontal ? 1.2 : gsap.utils.clamp(1.2, 2.4, el.offsetHeight / 500);

      gsap.from(line, {
        [horizontal ? "scaleX" : "scaleY"]: 0,
        duration,
        ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: startFor(el, side), once: true },
        onComplete: restore,
      });
    });
  });

  return () => cleanups.forEach((restore) => restore());
}
