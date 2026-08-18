import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function FooterSection(){
   

    return(


        <footer className="relative z-40 bg-[#0D0829] text-[#f8f6f2] h-[70vh] flex flex-col items-center justify-around text-left px-4 font-[--font-cormorant-garamond]">
        <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 mb-4">
        <div className="flex flex-col gap-12">
            <Link href="/">
            <Image src="footer-logo.svg" alt="pradipta online logo" width={123} height={40}></Image>
            </Link>
        <h2 className="text-5xl text-[#f8f6f2]  font-semibold mb-2 ">Ready to start?</h2>
        <p>Whether you have a brief ready or just an idea you want to talk through, get in touch. No obligations, no agency pitch - just a conversation. Whether you have a brief ready or just an idea you want to talk through, get in touch. No obligations, no agency pitch - just a conversation.</p>
        <ul className="w-full flex flex-row gap-2 justify-between">
            <li><Link href="/contact" className="underline hover:text-[#f8f6f2]">Book A Free Consultation Call</Link></li>
            <li><Link href="/projects" className="underline hover:text-[#f8f6f2]">Try Free Cost Calculator</Link></li>
            <li><Link href="/about" className="underline hover:text-[#f8f6f2]">Visit studiolnc.dev</Link></li>
        </ul>
        </div>
        <div className="flex flex-col items-start justify-bottom gap-12">
          <div className="flex flex-col gap-12">
        <div className="h-10"></div>
        <h2 className="text-5xl font-semibold mb-2">Trending topics</h2>

          <ul className="flex flex-row flex-wrap gap-4">
            <li><Link href="/blog/seo" className="underline hover:text-[#f8f6f2]">SEO for E-Commerce</Link></li>
            <li><Link href="/blog/react" className="underline hover:text-[#f8f6f2]">React Best Practices</Link></li>
            <li><Link href="/blog/integrations" className="underline hover:text-[#f8f6f2]">Integrations & APIs</Link></li>
            <li><Link href="/blog/seo" className="underline hover:text-[#f8f6f2]">SEO for E-Commerce</Link></li>
            <li><Link href="/blog/react" className="underline hover:text-[#f8f6f2]">React Best Practices</Link></li>
            <li><Link href="/blog/integrations" className="underline hover:text-[#f8f6f2]">Integrations & APIs</Link></li>
            <li><Link href="/blog/seo" className="underline hover:text-[#f8f6f2]">SEO for E-Commerce</Link></li>
            <li><Link href="/blog/react" className="underline hover:text-[#f8f6f2]">React Best Practices</Link></li>
            <li><Link href="/blog/integrations" className="underline hover:text-[#f8f6f2]">Integrations & APIs</Link></li>
             <li><Link href="/blog/seo" className="underline hover:text-[#f8f6f2]">SEO for E-Commerce</Link></li>
            <li><Link href="/blog/react" className="underline hover:text-[#f8f6f2]">React Best Practices</Link></li>
            <li><Link href="/blog/integrations" className="underline hover:text-[#f8f6f2]">Integrations & APIs</Link></li>
            <li><Link href="/blog/seo" className="underline hover:text-[#f8f6f2]">SEO for E-Commerce</Link></li>
            <li><Link href="/blog/react" className="underline hover:text-[#f8f6f2]">React Best Practices</Link></li>
            <li><Link href="/blog/integrations" className="underline hover:text-[#f8f6f2]">Integrations & APIs</Link></li>
            <li><Link href="/blog/seo" className="underline hover:text-[#f8f6f2]">SEO for E-Commerce</Link></li>
            <li><Link href="/blog/react" className="underline hover:text-[#f8f6f2]">React Best Practices</Link></li>
            <li><Link href="/blog/integrations" className="underline hover:text-[#f8f6f2]">Integrations & APIs</Link></li>
          </ul>
      
        </div>
        </div>
        </div>
        <div className="max-w-7xl flex flex-row w-dvw items-center justify-between gap-2">
        <p className="text-[.75rem]">© 2026 Pradipta Das. All rights reserved.</p>
        <p className="text-[.75rem]">Follow me on <a href="#" className="underline hover:text-[#f8f6f2]">LinkedIn</a> | <a href="#" className="underline hover:text-[#f8f6f2]">Twitter</a> | <a href="#" className="underline hover:text-[#f8f6f2]">GitHub</a></p>
        </div>
      </footer>


    );
}