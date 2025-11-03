"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import DrawSVGPlugin from "gsap/dist/DrawSVGPlugin";
import Link from "next/link";
import { fetchSiteOptions,fetchPortfolios } from '../lib/wordpress';
import { useGSAP } from "@gsap/react";

interface OfferList {
  offer_id: number;
  offer_name: string;
  offer_short_description: string;
  offer_price: string;
  offer_image: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  content: string;
  featured_image_url: string;
}

export function PortfolioNav(){
  return(

    <svg xmlns="http://www.w3.org/2000/svg" width="598" height="598" fill="none" viewBox="0 0 598 598"><path   id="portfolionav-path" stroke="#ffffff" strokeWidth="1px" d="M299 .5a298.499 298.499 0 1 1 0 596.998A298.499 298.499 0 0 1 299 .5Z"></path></svg>
  )
}

export function PortfolioItem({ item }: { item: PortfolioItem }) {

  return(
  <div className="portfolio-tile h-dvh w-dvw opacity-100 absolute flex-shrink-0">
            <div className="outer h-dvh z-1">
              <div className="inner h-dvh">
                <div className="bg h-dvh w-dvw bg-gradient-to-t" style={{backgroundImage: `url("${item.featured_image_url}")`}}>
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                     <h2 className="section-heading text-4xl font-bold mb-4 hidden">{item.title}</h2>
                      <p className="text-lg mb-6 max-w-2xl text-center hidden">{item.content}</p>
                      <Link
                      href={'#'}
                      className=" bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors rounded hidden">
                      View Details
                    </Link>
                  </div>
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

export default function OfferSlider() {
  const offerSlideRef = useRef<HTMLDivElement>(null);
  const offerListRef = useRef<HTMLDivElement>(null);
  
  const pfolioCont = useRef<HTMLDivElement>(null);
  const pfolioItem = useRef<HTMLDivElement>(null);

  const [offersList, setOfferslist] = useState<OfferList[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await fetchSiteOptions();
        setOfferslist(data.what_i_offer_list || []);
      } catch (error) {
        console.error('Failed to fetch offer settings:', error);
        setOfferslist([]);
      }
    }

    fetchOffers();

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
  }, [])

  

  // Scroll-based slider logic
  gsap.registerPlugin(ScrollTrigger,DrawSVGPlugin);
  useGSAP(() => {

    const normalProgress = gsap.timeline({
      scrollTrigger: {
        scrub: true,
        trigger: "#smooth-wrapper",
        // whole body shorthand values
        start: 0,
        end: "max"
      }
    });
    normalProgress.to("progress", {
      value: 100,
      // important to set ease none to have progress bar map to scroll
      ease: "none"
    });
    if (offersList.length > 0 && offerSlideRef.current && offerListRef.current) {
      // Wait for images to load
     
        const slideContainer = offerSlideRef.current;
        const slideList = offerListRef.current;


       

        if (slideContainer && slideList) {
          // Get the total width of the list
          const listWidth = slideList.scrollWidth;
          // Get the container width
          const containerWidth = slideContainer.offsetWidth;
          // Calculate the maximum scroll distance
          const maxScroll = (listWidth - containerWidth);
          //console.log(listWidth +" "+ containerWidth+" "+maxScroll);

          // Only create scroll trigger if maxScroll > 0
        if (maxScroll > 0) {
            // Create the scroll trigger
            ScrollTrigger.create({
              trigger: '.offer-sec',
              start: "50% 10%",
              end: () => `+=${maxScroll}`,
              pin: true,
              scrub: 1,
              markers: false,
              onUpdate: (self) => {
                // Move the list based on scroll progress
                const x = -self.progress * maxScroll;
                gsap.set(slideList, { x });
              },
              onLeave: () => {
                gsap.to(slideList, { filter: "blur(0.1rem)", scale: 0.97 });
              },
              onEnter: () => {
                gsap.to(slideList, { filter: "blur(0rem)", scale: 1 });
              },
              onEnterBack: () => {
                gsap.to(slideList, { filter: "blur(0rem)", scale: 1 });
              }
            });
          }
        }
     

     
    }

    const sections = document.querySelectorAll(".portfolio-tile");
if(pfolioItem.current && sections.length > 0){

     
      const navProgressdisp = document.querySelector('.progressCount');
      const navText = document.querySelector('.slideCount');
          if (navText) navText.innerHTML = sections.length.toString();


            //const pItems:PortfolioItem[] = gsap.utils.toArray('.portfolio-tile');
            const images:HTMLDivElement[] = gsap.utils.toArray(".bg");
            const thumbimages:HTMLUListElement[] = gsap.utils.toArray(".bg-thumb");
            let navIndex=1;

            const tlPortfolio = gsap.timeline({
              scrollTrigger: {
                trigger: ".portfolio-cont",
                start: "top top",
                end: () => "+=" + (sections.length - 1) * window.innerHeight,
                pin: true,
                scrub: 1,
                markers: false
              }
            });

            // Animate title block
            tlPortfolio.fromTo(".pfoliotitle-block", {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
            }, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
            }, "-=1");

            // Animate each image sequentially with proper timing
            images.forEach((image, index) => {
              const startTime = index === 0 ? "-=1.15" : "+=0.5"; // Stagger animations

              tlPortfolio.fromTo(image, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                zIndex: 9999 - index
              }, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                zIndex: 9999 - index,
                duration: 1,
                onStart:()=>{
                  //console.log(thumbimages[index])
                  navIndex++;
                  if (navProgressdisp) navProgressdisp.innerHTML = navIndex.toString();
                },
                onReverseComplete:()=>{
                  navIndex--;
                  if (navProgressdisp) navProgressdisp.innerHTML = navIndex.toString();
                }
              }, startTime);
              tlPortfolio.fromTo(thumbimages[index], {
                clipPath: "circle(0% at 50% 50%)",
              }, {
                clipPath: "circle(50% at 50% 50%)",
                duration: 1
              }, "<");
            });
  }
   


  },{dependencies:[offersList]});

  return (
    <>
    <section className="offer-sec h-50" style={{
      backgroundImage: 'url("/slide_bg_2.png")',
      backgroundSize: "100%",
      backgroundPosition: "top center",
      backgroundRepeat: "repeat",
      backgroundAttachment: "fixed"
    }}>
      <div className="mx-auto">
       
       
        <div className="offer-slide-cont overflow-hidden flex-nowrap px-9 py-9" ref={offerSlideRef}>
           <div className="max-w-7xl mx-auto">
            <p>
              <em>your website is your best salesperson.</em>
            </p> 
            </div>
            <div className="relative mt-15 mb-15" ref={offerListRef}>
             
              <ul className="relative">
                {offersList.map((offer) => (
                    
                  <li key={offer.offer_id} className="box relative block w-15 h-15">
                    <Image src= {offer.offer_image || "/global-map.svg"}
                     width={60} height={60} alt={`${offer.offer_name}`} className="block w-auto object-cover" />
                  </li>
                 
                  
                ))}
              </ul>
           
            </div>
            
          </div>
         <div className="w-80 p-8 text-center m-auto  align-middle border border-black cta-btn">Connect with me</div>
      </div>
    </section>
    <section className="filler bg-amber-50 blur-3xl h-30 w-dvw"></section>
     <section className="portfolio-cont  w-dvw bg-amber-50">
        <div className="portfolio-container relative h-dvh" ref={pfolioCont}>
          <div className=" w-dvw h-fit bg-amber-950">
          <div className="pfoliotitle-block absolute top-0 right-0 left-0 bottom-0 w-80 h-80 border-black border rounded-[50%] flex flex-col justify-items-center-safe flex-shrink flex-wrap p-10 m-auto z-100">
            <h2 className="m-auto block">Portfolio</h2>
            </div>
          </div>
          <div className="portfolionav absolute  z-99 h-80 w-80 top-0 left-0 right-0 bottom-0 m-auto">

                  <div className="w-[100%] h-[100%] m-auto rounded-[50%]  portfolio-circle">
                    <div className="portfolio-inner flex flex-wrap flex-col items-center text-center pt-7 pb-5 h-[100%] justify-between m-auto border-white border rounded-[50%]">
                      <div className=" text-center text-amber-50">
                      <p className="text-[.7em]">Featured Projects</p>
                    </div>
                  
                     <div className="align-middle text-center  text-amber-50">
                     <div className="flex align-middle items-center justify-between">
                     <p className="progressCount p-3 text-center w-10">~1</p>
                     <div className="border-white border rounded-[50%] bg-amber-100 w-50 h-50">
                      <ul>
                      {portfolios.map((item) => (
                           <li className="bg-thumb w-50 h-50 rounded-[50%]" style={{backgroundImage: `url("${item.featured_image_url}")`}} key={item.id}></li>
                      ))}
                      </ul>
                      
                     </div>
                     <p className="slideCount p-3 text-center w-10">~3</p>
                     </div>
                    </div>
                     <div className="  align-center  text-center  text-amber-50">
                      <p className="text-[.7em]">Scroll</p>
                    </div>


                    </div>
                    
                  
                  </div>
                
                </div>
          <div className="pitems flex h-dvh" ref={pfolioItem}>
          {portfolios.map((item) => (
  
            <Suspense fallback={<PortfolioSkeleton />} key={item.id}>
              <PortfolioItem item={item} />
            </Suspense>
  
          ))}
          </div>
                
               </div>
    </section>
    </>
  );
}