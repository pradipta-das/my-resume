import { shareImage } from "../lib/og";

export const alt = "The Journal, a web development blog by Pradipta Das";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({ label: "The Journal", title: "Ideas, lessons and notes from building for the web." });
}
