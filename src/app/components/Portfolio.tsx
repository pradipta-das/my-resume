"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { fetchPortfolios } from '../lib/wordpress';

interface PortfolioItem {
  id: number;
  title: string;
  content: string;
  featured_image_url: string;
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

        gsap.registerPlugin(ScrollTrigger);

        

        const pfItems:HTMLDivElement[] = gsap.utils.toArray('.pfolio-img');
        const pfItemsText:HTMLDivElement[] = gsap.utils.toArray('.pfolio-text');

        pfItems.forEach((elem)=>{


          gsap.to(elem, {
            scrollTrigger: {
              trigger: elem,
              start: 'top center',
              end: '1200',
              scrub: true,
              markers: false,
              invalidateOnRefresh: true
            },
            ease: "power1.inOut",
            scale: '.8',
            filter:"blur(0rem)"
            });
          


        })

        pfItemsText.forEach((txtelem)=>{

         gsap.to(txtelem, {
            scrollTrigger: {
              trigger: txtelem,
              start: 'top center',
              end: '1200',
              scrub: true,
              markers: false,
              invalidateOnRefresh: true
            },
            ease: "power1.inOut",
            y:20,
            duration:'2s'
          
         

            
            });
          


        })

        

      },{dependencies: [portfolios]})


  /*

    if (pfolioCont.current && pfolioItem.current) {
        const pfolioContainer = pfolioCont.current;
        const pfolioList = pfolioItem.current;


      // Get the total height of the list
      const pfolioWidth = pfolioList.scrollWidth;
      // Get the container height
      const pfoliocontWidth = pfolioContainer.offsetWidth;
      // Calculate the maximum scroll distance
      const maxScroll = pfolioWidth-pfoliocontWidth;

        const portfolioItemArr:HTMLElement[] = gsap.utils.toArray(".masonry-grid li");

         portfolioItemArr.forEach((pfolioElem:HTMLElement,index) =>{

            const scaleVal = distributor(index, portfolioItemArr[index], portfolioItemArr);
            const tween = gsap.to(pfolioElem, {
            scrollTrigger: {
            trigger: pfolioElem,
            start: 'top top',
            scrub: true,
            markers: false,
            invalidateOnRefresh: true
            },
            ease: "none",
            opacity:1
            
            });

            ScrollTrigger.create({
            trigger: pfolioElem,
            start: `top-=${index * spacer} top`,
            endTrigger: '.portfolio-sec',
            end: `bottom bottom+=${100 + (portfolioItemArr.length * spacer)}`,
            pin: true,
            pinSpacing: false,
            markers: false,
            id: 'pin',
            invalidateOnRefresh: true,
            });
          

         })
     

      // Create the scroll trigger
      ScrollTrigger.create({
        trigger: '.portfolio-sec',
        start: "top top",
        end: () => `+=${maxScroll}`,
        markers: false,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {

          // Move the list based on scroll progress
          const x = -self.progress * maxScroll;
          gsap.set(pfolioList, { x });
        },
        onLeave:()=>{
            gsap.to(pfolioList, { filter:"blur(0.5rem)",scale:0.95 });
        },
        onEnter:()=>{
             gsap.to(pfolioList, { filter:"blur(0rem)",scale:1  });
        },
         onEnterBack:()=>{
             gsap.to(pfolioList, { filter:"blur(0rem)",scale:1  });
        }
      });
    }

        

    })
    */


  return (
     <section className="portfolio-sec" style={slidethreeBG}>
    
       <div className="mx-auto">
    
       
    
    <div className="portfolio-container justify-center-safe" ref={pfolioCont}>
      <div className="masonry-grid">
        <div className="relative">
        <div ref={pfolioItem}>
        {portfolios.map((item) => (
          <div
            key={item.id}
            className="portfolio-tile mb-20 block overflow-visible" 
          >
            <Image
              src={item.featured_image_url}
              alt={item.title}
              width={1920}
              height={800}
              className="pfolio-img object-cover blur-xs"
              
            />
            <div className="pfolio-text absolute inset-0 bg-white flex items-center justify-center-safe shadow-2xl  transition-all duration-300">
              <div className="text-[--var(--foreground)] text-center p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <div className="text-sm mb-4">{item.content}</div>
                <Link
                  href={'#'}
                  className="inline-block bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
        </div>
        </div>
      </div>
    </div>
     </div>
   </section>
  );
}