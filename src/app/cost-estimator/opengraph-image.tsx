import { shareImage } from "../lib/og";

export const alt = "Website cost estimator by Pradipta Das";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({ label: "Website Cost Estimator", title: "Don't let a bad estimate kill a good idea." });
}
