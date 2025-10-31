"use client";

import React, {useState, useEffect, Suspense } from "react";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";



import Intro from "./Intro";
import WordPressBlogPostsSimple from "./WordPressBlogPostsSimple";
import RatingComp from "./RatingComp";
import WhyWork from "./WhyWork";
import Portfolio from "./Portfolio";
import ReviewSlider from "./ReviewSlider";
import OfferSlider from "./OfferSlider";
import FooterSection from "./FooterSection";





export default function FirstFrame(){

gsap.registerPlugin(ScrollSmoother,ScrollTrigger);
 
useGSAP(()=>{

  gsap.set(".cursoranim", {xPercent: -50, yPercent: -50});

let xTo = gsap.quickTo(".cursoranim", "x", {duration: 0.6, ease: "power3"}),
    yTo = gsap.quickTo(".cursoranim", "y", {duration: 0.6, ease: "power3"});

window.addEventListener("mousemove", e => {
  xTo(e.clientX);
  yTo(e.clientY);
});

gsap.to('progress', {
  value: 100,
  ease: 'none',
  scrollTrigger: { scrub: 0.3 }
});
})



  return(
    

<>
  <div className="cursoranim"></div>
  <progress max="100" value="0"></progress>
<Intro/>
<Suspense fallback={<div className="w-dvw h-dvh">Loading</div>}>
<OfferSlider/>
</Suspense>

<Suspense fallback={<div className="w-dvw h-dvh">Loading</div>}>
<ReviewSlider/>
</Suspense>
<FooterSection/>
  <footer className="w-dvw text-right text-sm py-6">
    <div className="container mx-auto">
       <span>© 2025 Pradipta Das. All rights reserved.</span>
    </div>
   
  </footer>
</>  
  )

}