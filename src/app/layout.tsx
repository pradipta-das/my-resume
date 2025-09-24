import type { Metadata } from "next";
import {Inter, Josefin_Sans, Playfair, Ubuntu_Mono} from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu_Mono({
  variable: '--font-ubuntu-mono',
  subsets: ['latin'],
  weight: "400"
})

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    weight: ["100","200"]
})

const josefin = Josefin_Sans({
      variable: '--font-josefin',
      subsets: ['latin'],
})

const playfair = Playfair({
  variable: '--font-playfair',
      subsets: ['latin'],
})


export const metadata: Metadata = {
  title: "Pradipta Das - Freelance Web Developer | WordPress & Shopify Expert | Pradipta online",
  description: "Hire an experienced freelance web developer with 10+ years of expertise in WordPress, Shopify, and custom web solutions. Scalable, fast, and SEO-optimized websites for agencies, startups, and businesses worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={`${inter.variable} ${josefin.variable} ${playfair.variable} ${ubuntu.variable}`}>
       {children}
      </body>
    </html>
  );
}

