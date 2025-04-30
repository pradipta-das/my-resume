import React from 'react'
import {useRef} from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from 'gsap/all';
import gsap from "gsap";

export default function ExperienceSection() {
    const expContext = useRef(null);
     /* gsap.registerPlugin(ScrollTrigger);
    useGSAP((portContext) => {
        let tl = gsap.timeline({
            // add it to an entire timeline!
           });
           
       tl.to('.experience-cont',{
          opacity:1,
          duration:2,
          scrollTrigger: {
            trigger: '.experience-cont',
            markers: true,
            //pin: true, // pin the trigger element while active
            start: 'top top', // when the top of the trigger hits the top of the viewport
            end: '10000', // end after scrolling 1700px beyond the start
            scrub: 0.6, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
           
          }
        }) 
    })*/
  return (
    <section className="experience-cont  bg-amber-500" ref={expContext}>
        <div className="experience_slide">
                Experience 1
        </div>
        <div className="experience_slide">
                Experience 2
        </div>
        <div className="experience_slide">
                Experience 3
        </div>
    </section>
  )
}
