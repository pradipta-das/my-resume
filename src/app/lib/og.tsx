import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
 * Social share images (Open Graph / X), drawn at request or build time by the
 * opengraph-image files. One layout for the whole site: a label, the page's
 * title in the brand serif, and the name and domain. Server only.
 *
 * The fonts live in assets/fonts (SIL Open Font License); next.config.ts makes
 * sure they're deployed with the server code.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

let fonts: Promise<[Buffer, Buffer]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([
    readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-Medium.woff")),
    readFile(join(process.cwd(), "assets/fonts/Manrope-Medium.woff")),
  ]));

type ShareImage = {
  label: string;
  title: string;
  // A photo (e.g. a post's featured image) shown alongside the title.
  image?: string | null;
};

export async function shareImage({ label, title, image }: ShareImage) {
  const [serif, sans] = await loadFonts();
  // Long titles step down so they never run off the card.
  const size = title.length > 90 ? 52 : title.length > 60 ? 60 : 72;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#ffffff", color: "#000000" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "64px 72px",
            borderLeft: "16px solid #0813ef",
          }}
        >
          <div style={{ display: "flex", fontFamily: "Manrope", fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>
            {label}
          </div>

          <div style={{ display: "flex", fontFamily: "Cormorant", fontSize: size, lineHeight: 1.08 }}>{title}</div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "2px solid #000000",
              paddingTop: 24,
              fontFamily: "Manrope",
              fontSize: 22,
            }}
          >
            <span style={{ fontFamily: "Cormorant", fontSize: 36 }}>Pradipta Das</span>
            <span>pradipta.online</span>
          </div>
        </div>

        {image && (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain <img>
          <img src={image} alt="" width={420} height={630} style={{ objectFit: "cover" }} />
        )}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Cormorant", data: serif, style: "normal", weight: 500 },
        { name: "Manrope", data: sans, style: "normal", weight: 500 },
      ],
    },
  );
}
