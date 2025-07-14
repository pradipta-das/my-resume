'use client';

import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';



export default function FirstFrame(){

  gsap.registerPlugin(ScrollTrigger);


 useGSAP(()=>{

    const tl = gsap.timeline({
      // add it to an entire timeline!
      scrollTrigger: {
          trigger: '.landingcont',
          start: 'center center', // when the top of the trigger hits the top of the viewport
          end: '1500', // end after scrolling 500px beyond the start
          scrub: 0.6,
          markers: false,
          pin: true
          
       }
     });
    
     tl.to('.title',{scale:.8,duration:2},'<')
       .to('.sub-title',{x:-70,duration:2},'<')
       .to('#Ellipse_120',{x:100,duration:2},'<')
      
       
     
    }
    

   
  )

  return(
<section className="w-auto h-dvh container m-auto landingcont" >
    <div className="big-circle absolute -top-120 -right-90">


    </div>
    <div className="absolute -top-50 sml-circle -left-180">
      <svg className="scale-60 overflow-visible" width="953" height="953" viewBox="0 0 953 953">
        <circle id="Ellipse_120" data-name="Ellipse 120" cx="476.5" cy="476.5" r="476.5" fill="#2e2e2e"/>
      </svg>
    </div>
    <div className="relative h-dvh w-dvw landing flex items-center flex-col align-middle justify-start z-10" >
       <h1 className='title w-auto mt-35'>Pradipta Das</h1>
       <span className='w-full sub-title text-3xl'>Full-Stack Developer, based in Kolkata, INDIA</span>
       <div className="scroll-btn-cont absolute left-0 bottom-0  mb-5">
          <div className="scroll-bar">
            <div className="scroll-btn animate-[scroll]"></div>
          </div>
          <span className="absolute scroll-scrub -translate-7 rotate-90 font-bold uppercase">scroll</span>
          </div>
    </div>
</section>
  )

}