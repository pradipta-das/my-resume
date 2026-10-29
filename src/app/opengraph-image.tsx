import { shareImage } from "./lib/og";

export const alt = "Pradipta Das, freelance WordPress, Shopify and Next.js developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({ label: "Freelance Web Developer & Consultant", title: "What Fifteen Years as a Freelance Web Developer Taught Me About Ideas" });
}
