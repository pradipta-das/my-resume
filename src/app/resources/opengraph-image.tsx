import { shareImage } from "../lib/og";

export const alt = "Free WordPress, Shopify and Next.js resources by Pradipta Das";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({ label: "Free Resources", title: "From my workbench, free to take." });
}
