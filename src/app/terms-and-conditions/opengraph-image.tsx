import { shareImage } from "../lib/og";

export const alt = "Terms and conditions for pradipta.online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({ label: "Terms & Conditions", title: "The terms for using this website and its free tools." });
}
