'use client'

import { Suspense } from "react";
import FirstFrame from "./components/FirstFrame";
import SiteHead from "./components/SiteHead";
import Loading from "./loading";

export default function Page() {
  

  return(


     
      <Suspense fallback={<Loading/>}>
        <div id="smooth-wrapper">
        <div id="smooth-content">
         <SiteHead/>
        <FirstFrame/>
        </div>
        </div>
      </Suspense>

      
    
  
  );
  };
