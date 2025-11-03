import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import RatingComp from "./RatingComp";
import SocialIcons from "./SocialIcons";

export default function FooterSection(){
    const slidethreeBG = {
        backgroundImage: 'url("/global-map.svg")',
        backgroundSize: "60%", // Optional: Adjust as needed
        backgroundPosition: "bottom right", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 

      };
      gsap.registerPlugin(ScrollTrigger);
      /* GSAP animation codes */
      
       useGSAP(()=>{
      
      const tlFooter = gsap.timeline({  scrollTrigger: {
          start: "top top",
          end: "3000",
          pin:false,
          scrub: 1,
          markers: false,
          
        }});
      
      tlFooter.to(".footer-text",{'color':'var(--maincolor)',duration:2})
      .fromTo(".footer-text",{clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
              }, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                onComplete: () => {
                  
                },
                onStart: ()=>{
                   //tlPortfolio.to('#portfolionav-path', { stroke:"#ffffff"});
                   console.log();
                }
                 
                })
                
        })

    return(


         <section className="footer-cta relative backdrop-blur-3xl" style={slidethreeBG}>

       <div className="max-w-7xl mx-auto px-9 py-9 relative">
    <div className="why-head">
    <h2 className="mb-20">Let&apos;s Build Something Great Together</h2>
    <p className="mb-20">Whether you&apos;re an agency with overflow work or a business owner needing a reliable developer,<br/> I&apos;m here to help. I focus on results, not excuses.</p>
      </div>
      <div className="footer-social w-50 mb-20">
       <SocialIcons></SocialIcons>
      </div>
  <div className="grid md:grid-cols-2 grid-cols-1 grid-rows-1 gap-4">
  <div className="footer-img" data-lag="0.6">
      
      <RatingComp/>
      
    </div>
     <div className="footer-text" data-lag="0.6">
    <p className="footertxt text-[8rem] text-[var(--bg-color-highlight)] leading-8">I&apos;m<br/>Online</p>
  </div>
  </div>
      </div>
    
    </section>


    );
}