"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { fetchSiteOptions } from '../lib/wordpress';
import { useGSAP } from "@gsap/react";
import Link from "next/link";

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
          if (maxScroll > 0) {
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
          }
        }
     

     
    }
  },{dependencies: [offersList]});

  return (
    <section className="offer-sec mx-auto w-dvw overflow-hidden" style={{
      backgroundImage: 'url("/slide_bg_2.png")',
      backgroundSize: "100%",
      backgroundPosition: "top center",
      backgroundRepeat: "repeat",
      backgroundAttachment: "fixed"
    }}>
      <div className="mx-auto flex flex-row flex-nowrap">
        <div className="flex-auto overflow-hidden">
          <div className="split-prob-text px-9 pr-9 pb-25">
            <h2 className="mb-25">What I Offer</h2>
            <p>{offerDesc}</p>
          </div>

          <div className="offer-slide-cont w-dvw h-dvh overflow-hidden" ref={offerSlideRef}>
            <div className="relative h-screen" ref={offerListRef}>
              <ul>
                {offersList.map((offer) => (
                  <li key={offer.offer_id} className="relative w-2xl h-dvh justify-center-safe">
                    <Image src={offer.offer_image} width={800} height={600} alt={`${offer.offer_name}`} className="block blur-xs w-auto object-cover" />
                    <div className="absolute bg-white inset-0 p-8 w-xl text-center top-auto bottom-0 left-0 right-0 m-auto h-1/4 shadow-2xl">
                        <span><div className=" w-4 h-4 rounded-2xl bg-lime-300"></div></span>
                        <h3>Wordpress</h3>
                        <p>Lorem Ipsum dolor summit</p>

                        <Link href={'#'}>Learn More</Link>
                    </div>
                  </li>
                ))}
              </ul>
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}