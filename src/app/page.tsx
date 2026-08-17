'use client'

import { Suspense } from "react";
import SiteHead from "./components/SiteHead";
import FooterSection from "./components/FooterSection";
import BlendedHomepage from "./components/BlendedHomepage";




export default function Page() {
  

  return(


     
      <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white font-sans">Loading...</div>}  >
        <div id="smooth-wrapper">
        <div id="smooth-content">
        <SiteHead />
        <BlendedHomepage />
        <FooterSection />
        </div>
        </div>
      </Suspense>

      
    
  
  );
  };
