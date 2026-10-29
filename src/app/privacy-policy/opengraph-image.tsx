import { shareImage } from "../lib/og";

export const alt = "Privacy policy for pradipta.online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({ label: "Privacy Policy", title: "How your information is collected, used and protected." });
}
