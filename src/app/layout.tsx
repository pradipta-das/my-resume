import type { Metadata } from "next";
import {siteConfig} from "./lib/seo";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./input.css";
import CookieConsent from "./components/CookieConsent";

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant-garamond',
  subsets: ['latin'],
  weight: ["300","400","500","600","700"],
  style: ["normal","italic"]
})

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ["200","300","400","500","600","700"]
})




export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: "%s | Pradipta Das",
  },

  description: siteConfig.description,

  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  // Domain verification for Meta Business (needed for ad conversion events).
  verification: {
    other: { "facebook-domain-verification": "xdwn8od8y9n4yynr7xvo1fbtlikkwf" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    // The font variables sit on <html> so the theme's --font-primary and
    // --font-secondary (input.css) can use them from the root down.
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
       {children}
       <CookieConsent />
      </body>
    </html>
  );
}

