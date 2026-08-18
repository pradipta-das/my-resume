import type { Metadata } from "next";
import {siteConfig} from "./lib/seo";
import {Cormorant_Garamond,Inter, Josefin_Sans, Playfair, Ubuntu_Mono, Manrope} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant-garamond',
  subsets: ['latin'],
  weight: ["400","500","600","700"]
})

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ["200","300","400","500","600","700"]
})

const ubuntu = Ubuntu_Mono({
  variable: '--font-ubuntu-mono',
  subsets: ['latin'],
  weight: "400"
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={`${ubuntu.variable} ${cormorant.variable} ${manrope.variable}`}>
       {children}
      </body>
    </html>
  );
}

