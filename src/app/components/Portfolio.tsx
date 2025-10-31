"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { fetchPortfolios } from '../lib/wordpress';

interface PortfolioItem {
  id: number;
  title: string;
  content: string;
  featured_image_url: string;
}

export function PortfolioItem({ item }: { item: PortfolioItem }) {

  return(
  <div
            className="portfolio-tile h-dvh w-dvw opacity-100 flex-shrink-0"
          >

            <div className="outer z-1">
              <div className="inner">
                <div className="bg one">
                   <Image
                      src={item.featured_image_url || "/global-map.svg"}
                      alt={item.title}
                      width={1920}
                      height={800}
                      className="pfolio-img"

                    />
                  <h2 className="section-heading">{item.title}</h2>
                  <p>{item.content}</p>
                  <Link
                  href={'#'}
                  className="inline-block bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors"
                >
                  View Details
                </Link>
                </div>
              </div>
            </div>
          </div>
  )
}

export function PortfolioSkeleton(){
  return(
    <div className="w-dvw h-dvh">Loading</div>
  );

}

export default function Portfolio() {
    const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
    const pfolioCont = useRef<HTMLDivElement>(null);
    const pfolioItem = useRef<HTMLDivElement>(null);
    const slidethreeBG = {
        backgroundImage: 'url("/slide_bg_2.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };
  useEffect(() => {
    const fetchPortfolio = async () => {
          try {
         
            const data = await fetchPortfolios(); // Fetch first 6 posts
            setPortfolios(data.posts);
          } catch (err) {
            
            console.error('Error fetching blog posts:', err);
          } finally {
            
          }
        };
    
        fetchPortfolio();
      }, []);

    useGSAP(() =>{

        gsap.registerPlugin(ScrollTrigger,SplitText);

        const sections = document.querySelectorAll(".portfolio-tile");
        console.log(sections.length);

        sections.forEach((value,key)=>{

       

        gsap.to(value, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: sections[key],
            pin: true,
            scrub: 1,
            //snap: 1 / (sections.length - 1),
            end: "3000",//() => "+=" + (sections.length - 1) * window.innerWidth,
            markers: true
          }
        });

         })

  },{dependencies:[portfolios]});   


  return (

    <div className="w-screen">
    <section className="">
      <div className="mx-auto px-9 py-9">
        <div className="why-head pb-15">
              <h2 className="mb-25">Portfolio / Case Studies</h2>
           </div>
      </div>
      
    </section>
    <section className="portfolio-sec w-dvw h-dvh" style={slidethreeBG}>
      <div className="portfolio-container h-dvh overflow-hidden" ref={pfolioCont}>
        <div className="pitems flex h-full" ref={pfolioItem}>
        {portfolios.map((item) => (

          <Suspense fallback={<PortfolioSkeleton />} key={item.id}>
            <PortfolioItem item={item} />
          </Suspense>

        ))}
        </div>
       </div>
   </section>
   </div>
  );
}