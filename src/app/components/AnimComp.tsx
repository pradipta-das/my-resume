"use client";

import React from 'react';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AnimComp(){

    useGSAP(()=>{

   

    let cards: HTMLElement[]= gsap.utils.toArray(".cards");
    let totalCards = cards.length;
    let activeIndex = -1;
    let zIndex = 9999;


    function animateCards(){
        zIndex--;
        activeIndex++;
        
        if (activeIndex === totalCards) activeIndex = 0 ;
        const activeItem = cards[activeIndex];
        let nextIndex = (activeIndex+1) % totalCards;
        let nextItem = cards[nextIndex];
        const tl = gsap.timeline({defaults:{delay:0.8,ease:"power1.inOut"}})
        tl.set(nextItem,{scale:.7,yPercent:0,filter:"blur(0rem)","--background-opacity":0.2,opacity:1,zIndex:zIndex-1,delay:0})
        tl.set(activeItem,{scale:.7,yPercent:0,filter:"blur(0rem)","--background-opacity":0.2,opacity:1,zIndex:zIndex,delay:0})
        tl.to(activeItem,{scale:.8,"--background-opacity":0.1,yPercent:-10, onComplete:() => animateCards()})
        tl.to(activeItem,{scale:.9,"--background-opacity":0,yPercent:-20})
        tl.to(activeItem,{scale:1,yPercent:-30,filter:"blur(0.5rem)",opacity:0})

    }

    animateCards();
})
  return (

    <div className="intro-cont flex flex-row flex-wrap justify-center align-middle items-center-safe">
        <div className="cta-cont flex-1/3">
        <h5>Want to get in touch for a free site audit report?</h5>
        <p>Includes accessibility report, hotspot report & key metrics which could cost you money.</p>
    </div>
      <div className="cards-anim flex-1/3">

       
          <div className="cards shadow-2xs">Card 1</div>
          <div className="cards shadow-2xs">Card 2</div>
          <div className="cards shadow-2xs">Card 3</div>
          <div className="cards shadow-2xs">Card 4</div>
          <div className="cards shadow-2xs">Card 5</div>
          <div className="cards shadow-2xs">Card 6</div>
         
       
        

      </div>
    <div className="anim-cont flex-1/3">
        <DotLottieReact
        src="https://lottie.host/a28254c1-d991-48f4-8aef-034f9fa1dc27/tfgFlcTBt2.lottie"
        loop
        autoplay
        />
    </div>
    
    </div>
  );
}
