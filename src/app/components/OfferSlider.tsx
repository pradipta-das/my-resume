"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { fetchSiteOptions } from '../lib/wordpress';
import { useGSAP } from "@gsap/react";

interface OfferList {
  offer_id: number;
  offer_name: string;
  offer_short_description: string;
  offer_price: string;
  offer_image: string;
}

gsap.registerPlugin(ScrollTrigger);

export default function OfferSlider() {
  const offerSlideRef = useRef<HTMLDivElement>(null);
  const offerListRef = useRef<HTMLDivElement>(null);

  const [offerDesc, setOfferdesc] = useState('');
  const [offersList, setOfferslist] = useState<OfferList[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await fetchSiteOptions();
        setOfferdesc(data.what_i_offer_description || '');
        setOfferslist(data.what_i_offer_list || []);
      } catch (error) {
        console.error('Failed to fetch offer settings:', error);
        setOfferdesc('Default offer description');
        setOfferslist([]);
      }
    }

    fetchOffers();
  }, [])

  // Scroll-based slider logic
    
  useGSAP(() => {
    if (offersList.length > 0 && offerSlideRef.current && offerListRef.current) {
      // Wait for images to load


      const offertl = gsap.timeline({scrollTrigger: {
        trigger: ".offer-text-anim",
        start: "top top",
        end: "+=300",
        pin:false,
        scrub: true,
        markers: true,
    }});

      offertl.to('.text1',{opacity:1})
             .to('.brain-img',{opacity:1,scale:.75},('<'))
             .to('.text2',{opacity:1},('<'))
             .to('.time-img2',{opacity:1,scale:.75},('<'))
             .to('.text3',{opacity:1},('<'))

      


     
        const slideContainer = offerSlideRef.current;
        const slideList = offerListRef.current;
       

        if (slideContainer && slideList) {
          // Get the total width of the list
          const listWidth = slideList.scrollWidth;
          // Get the container width
          const containerWidth = slideContainer.offsetWidth;
          // Calculate the maximum scroll distance
          const maxScroll = listWidth - containerWidth;
          console.log(listWidth +" "+ containerWidth+" "+maxScroll);

          // Only create scroll trigger if maxScroll > 0
         /* if (maxScroll > 0) {
            // Create the scroll trigger
            ScrollTrigger.create({
              trigger: slideContainer,
              start: "top top",
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
          }*/
        }
     

     
    }
  },{dependencies: [offersList]});

  return (
    <section className="offer-sec mx-auto w-dvw mt-25" style={{
      backgroundImage: 'url("/slide_bg_2.png")',
      backgroundSize: "100%",
      backgroundPosition: "top center",
      backgroundRepeat: "repeat",
      backgroundAttachment: "fixed"
    }}>
      <div className="mx-auto px-9 pr-9 pb-25">
        <div className="relative w-dvw">
          <div className="split-prob-text">
            <h2 className="mb-25">What I Offer</h2>
            <p>{offerDesc}</p>
          </div>

          
        </div>

        <div className="offer-slide-cont w-dvw flex-nowrap pt-50" ref={offerSlideRef}>
            <div className="relative md:w-2/3 w-3/3 offer-text-block">
                <div className="offer-text-anim py-14">
                    <h3 className="text1 mt-50 text-8xl transition-all leading-24 opacity-0 scale-100">Apart from my</h3>
                    <Image className="brain-img p-4 scale-50 opacity-0" src="brain-svgrepo-com.svg" width={400} height={400} alt="brain-img"></Image>
                    <h3 className="text2 mt-20 text-9xl transition-all opacity-0 scale-100">.....and my</h3>
                    <Image className="time-img2 p-4 scale-50 opacity-0" src="hourglass-svgrepo-com.svg" width={400} height={400} alt="brain-img"></Image>
                    <h3 className="text3 mt-20 text-8xl transition-all opacity-0 scale-100">.....I offer impactful solutions for your business.</h3>
                </div>
           

            </div>
            <div className="relative md:w-1/3 w-3/3 mb-20" ref={offerListRef}>
             
              <ul className="relative">
                {offersList.map((offer) => (
                    
                  <li key={offer.offer_id} className="relative">
                    <Image src={offer.offer_image} width={100} height={100} alt={`${offer.offer_name}`} className="block w-auto object-cover" />
                  </li>
                 
                  
                ))}
              </ul>
            <Image className="mt-40 mr-10" src="onetime.svg" width={800} height={600} alt="offer image"></Image>
            </div>
            
          </div>
      </div>
    </section>
  );
}