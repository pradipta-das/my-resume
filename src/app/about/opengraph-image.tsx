import { shareImage } from "../lib/og";

export const alt = "About Pradipta Das";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({ label: "About", title: "Hi, I'm Pradipta. Where logic meets colour." });
}
