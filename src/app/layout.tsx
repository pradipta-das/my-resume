import type { Metadata } from "next";
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
  title: "Freelance Web Developer | Pradipta Das – Frontend, E-Commerce & Integrations",
  description: "Frontend developer specializing in HTML, CSS, React, and E-Commerce. I help agencies and businesses build fast, scalable, and conversion-driven websites.",
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

