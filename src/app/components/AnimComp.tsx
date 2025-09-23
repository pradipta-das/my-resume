"use client";

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AnimComp(){

    
  return (

    <div className="intro-cont flex flex-row flex-wrap justify-center align-middle items-baseline-last">
        <div className="cta-cont flex-1/2">
        <h5>Want to get in touch for a free site audit report?</h5>
        <p>Includes accessibility report, hotspot report & key metrics which could cost you money.</p>
    </div>
      
    <div className="anim-cont flex-1/2">
        <DotLottieReact
        src="https://lottie.host/a28254c1-d991-48f4-8aef-034f9fa1dc27/tfgFlcTBt2.lottie"
        loop
        autoplay
        />
    </div>
    
    </div>
  );
}
