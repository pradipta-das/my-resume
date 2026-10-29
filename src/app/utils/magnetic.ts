import gsap from "gsap";

/*
 * Makes every [data-magnetic] element inside `root` lean towards the pointer
 * when it comes near, and spring back when it leaves.
 *
 * Call inside a gsap.matchMedia callback limited to fine pointers (mouse /
 * trackpad) and call the returned function on cleanup.
 */
export function magnetic(root: HTMLElement, { strength = 0.35, reach = 40 } = {}): () => void {
  const items = gsap.utils.toArray<HTMLElement>("[data-magnetic]", root).map((el) => ({
    el,
    x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
    y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
    near: false,
  }));

  const onMove = (e: PointerEvent) => {
    // Only the element closest to the pointer is pulled, so neighbours closer
    // together than `reach` don't move with it.
    let closest: { item: (typeof items)[number]; dx: number; dy: number; gap: number } | null = null;

    items.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      if (!rect.width) return; // hidden (e.g. a button on an inactive step)

      // Measure from the resting position, not the current pulled one.
      const pullX = Number(gsap.getProperty(item.el, "x"));
      const pullY = Number(gsap.getProperty(item.el, "y"));
      const dx = e.clientX - (rect.left - pullX + rect.width / 2);
      const dy = e.clientY - (rect.top - pullY + rect.height / 2);
      // Distance from the element's edge (0 when the pointer is over it).
      const gap = Math.hypot(
        Math.max(0, Math.abs(dx) - rect.width / 2),
        Math.max(0, Math.abs(dy) - rect.height / 2),
      );

      if (gap < reach && (!closest || gap < closest.gap)) closest = { item, dx, dy, gap };
    });

    items.forEach((item) => {
      const target = closest?.item === item ? closest : null;

      if (target) {
        item.x(target.dx * strength);
        item.y(target.dy * strength);
      } else if (item.near) {
        item.x(0);
        item.y(0);
      }
      item.near = !!target;
    });
  };

  window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    items.forEach(({ el }) => gsap.set(el, { clearProps: "x,y" }));
  };
}
