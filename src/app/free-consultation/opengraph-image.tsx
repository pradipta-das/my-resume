import { shareImage } from "../lib/og";

export const alt = "Book a free consultation call with Pradipta Das";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({ label: "Free Consultation", title: "Let's talk about what you're building." });
}
