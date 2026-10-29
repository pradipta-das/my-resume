import { shareImage } from "../lib/og";

export const alt = "Case studies by Pradipta Das";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({ label: "Case Studies", title: "Work I'm proud of, and the thinking behind it." });
}
