

import React from 'react';
import {useRef} from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from 'gsap/all';
import gsap from "gsap";

export default function PortfolioSection() {
    const portContext = useRef(null);
    gsap.registerPlugin(ScrollTrigger);
    useGSAP((portContext) => {
       /*  let tl = gsap.timeline({
            // add it to an entire timeline!
           });
           
        tl.to('.portfolio-container',{
          opacity:1,
          duration:2,
          scrollTrigger: {
            trigger: '.portfolio-container',
            markers: true,
            pin: true, // pin the trigger element while active
            start: 'top top', // when the top of the trigger hits the top of the viewport
            end: '4000', // end after scrolling 1700px beyond the start
            scrub: 0.6, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
           
          }
        }).fromTo('.scroll-section-inner',{
            translateX: 0
        },{
            translateX: '-300vw',
            ease: 'none',
            duration: 1,
            scrollTrigger:{
                trigger: '.scroll-section-inner',
                start: '2400',
                end: '4000',
                scrub: 0.6,
                //markers: true
            
            }
        }) */

    })
    /*const portfolioRef = useRef(null);
    const portfolioTriggerref = useRef(null);

    gsap.registerPlugin(ScrollTrigger);

    useEffect(() => {

        const pin = gsap.fromTo(portfolioRef.current,{
            translateX : 0
        },{
            translateX: '-300vw',
            ease: 'none',
            duration: 1,
            scrollTrigger:{
                trigger: portfolioTriggerref.current,
                start: 'top top',
                end: '2000 top',
                scrub: 0.6,
                pin: true
            }
        })

        return () => {
            pin.kill();
        }
    },[])*/
  

  return (
    <section className="portfolio-container scroll-section-outer  overflow-hidden h-dvh w-dvw bg-[#fafafa]" ref={portContext}>
            <div className='scroll-section-inner'>
                <div className="experience_slide portfolio1 text-neutral-700 bg-[#fafafa]">
                        <h2 className='portfolioHeader'>Portfolio 1</h2>
                        <p>Lorem ipsum</p>
                </div>
                <div className="experience_slide bg-[#fafafa]">
                        Portfolio 2
                </div>
                <div className="experience_slide bg-[#fafafa]">
                        Portfolio 3
                </div>
                <div className="experience_slide bg-[#fafafa]">
                        Portfolio 4
                </div>
            </div>
    </section>
  )
}
