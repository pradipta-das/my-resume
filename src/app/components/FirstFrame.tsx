"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import SplitText from "gsap/dist/SplitText";
import ScrambleTextPlugin from "gsap/dist/ScrambleTextPlugin";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MotionPathPlugin from "gsap/dist/MotionPathPlugin";
import SiteHead from "./SiteHead";
import AnimComp from "./AnimComp";
import RatingComp from "./RatingComp";



export default function FirstFrame(){

const backgroundStyle = {
        backgroundImage: 'url("/slide_1_bg.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };

const slidetwoBG = {
        backgroundImage: 'url("/slide_bg_2.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };

const slidethreeBG = {
        backgroundImage: 'url("/slide_bg_3.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };

const slidefourBG = {
        backgroundImage: 'url("/slide_bg_4.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };

const slidefiveBG = {
        backgroundImage: 'url("/slide_bg_5.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };

gsap.registerPlugin(ScrollTrigger,ScrollSmoother,SplitText,ScrambleTextPlugin);
gsap.registerPlugin(MotionPathPlugin);


 useGSAP(()=>{

   ScrollSmoother.create({
    smooth: 1,
    effects: true,
  });

 
/*const textElements: HTMLElement[] = gsap.utils.toArray(".text");


textElements.forEach((text:HTMLElement) => {

  gsap.to(text, {
    backgroundSize: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: text,
      start: "center 80%",
      end: "center 20%",
      scrub: true,
    },
  });
});
*/
/*var spriteSheet = {
  width: 800,
  height: 335,
  total: 11,
  cols: 1,
  rows: 11,
  duration: 3
};

var tlintro = gsap.timeline({
  scrollTrigger: {
    trigger: ".anim-cont",
    start: "top top",
    end: "2500",
    scrub: 0.6,
    pin: true,
    markers: true
  }
});
tlintro.fromTo(".intro-anim",{opacity:1},{opacity:1,duration:1})

for (var i = 0; i < spriteSheet.total; i++) {  
  tlintro.set(".intro-anim", {
    x: (i % spriteSheet.cols) * -spriteSheet.width,
    y: Math.floor(i / spriteSheet.cols) * -spriteSheet.height
  }, i / (spriteSheet.total - 1) * spriteSheet.duration);
}
*/

const headersplit = SplitText.create(".intro-head h1");
const splitintro = SplitText.create(".split-text-intro");
let tlintro = gsap.timeline({  scrollTrigger: {
    trigger: ".intro-text",
    start: "top top",
    end: "300",
    pin:true,
    scrub: true,
    markers: true,
  }});
//tlintro.to(".intro-text", {duration: 1, scrambleText: "{original}"});
tlintro.from(headersplit.chars,{
  opacity: 0.2,
  stagger: 0.1,
})

tlintro.addLabel('start')
 
 //.to('.cards-anim',{scale:.7})
 //.addLabel('anim 2')
 //.from('.anim-cont',{scale:.8,filter:"blur(0.5rem)"})
 .addLabel('text anim 1')
 .from(splitintro.chars, {
  opacity: 0.2,
  stagger: 0.1,
})
.addLabel('anim end')
/*const highlightText:HTMLElement[] = gsap.utils.toArray(".text-highlight");

highlightText.forEach((highlighttxt:HTMLElement, index) => {

  tlintro.from(highlightText,
    { scrollTrigger: {
    trigger: ".intro-text",
    start: "top 30%",
    end: "top 20%",
    scrub: true,
    markers: true,
    },opacity:1,  
    onStart: () => highlighttxt.classList.add("active"),
    onComplete:() => highlighttxt.classList.remove("active")
  })
    
    });*/





let tlsupport = gsap.timeline({
  defaults:{
    duration:"2s"
  }
});

let split = SplitText.create(".split-text");
gsap.from(split.chars, {
  scrollTrigger: {
    trigger: ".problemdiv p",
    start: "top 50%",
    end: "top 20%",
    scrub: true,
    markers: false,
  },
  opacity: 0.2,
  stagger: 0.1,
});


const servList:HTMLElement[] = gsap.utils.toArray(".service-list li");
servList.forEach((servElem:HTMLElement,index)=>{

  tlsupport.to(servElem,{opacity: 1, delay:.5*index});  

})

}
  
   
  )

  return(
    <div id="smooth-wrapper">
  <div id="smooth-content">

  <SiteHead/>
  
<section className="intro-section w-dvw h-dvh">
   <div className="mx-auto px-9 py-9 flex flex-wrap flex-col">
    <div className="flex-auto md:flex-1/2">
    <div className="intro-text">
      <div className="intro-head">
      <h1 className="mb-12"><span className="text-highlight">Top Rated</span> Freelance Web Developer for <span className="text-highlight">Agencies & Businesses</span> <i>Needing</i> <span className="text-highlight">Reliable</span> Website <span className="text-highlight">Support</span></h1>
      </div>
      <div className="split-text-intro pb-12">
      <h2>Eliminate Bottlenecks. Fix Site Downtime. Keep Projects Moving.</h2>
      </div>
      <div className="split-text-intro pb-12">
      <p>Is your agency overloaded with development work and too few hands to deliver on time? Are you a business owner losing sales due to website downtime or poor site performance? You&#39;re not alone. Many teams face resource crunches and tech gaps that slow things down. But you don&#39;t have to.</p>
      </div>
      <ul className="grid grid-cols-4">
        <li><Link href={'/'}>linkedIn</Link></li> 
        <li>github</li>
        <li>youtube</li>
        <li>pinterest</li>
      </ul>
     
      </div>
      
    </div>
    
    </div>
</section>
<section className="intro-anim-sec w-dvw h-dvh px-9 py-9" style={backgroundStyle}>
   

      <AnimComp/>

  
</section>
<section className="problemdiv mx-auto w-dvw " style={slidetwoBG}>
   <div className="prob-text-header px-9">
      <h2>Get <span className="text-highlight">Expert</span> Web Development <span className="text-highlight">Support</span>, On <i>Demand</i></h2>
    </div>
    <div className="px-9 py-9 flex flex-row flex-wrap">
    <div className="prob-text flex-auto md:flex-1/2 py-15">
      <div className="split-text pb-12">
      <p>I help agencies, startups, and small businesses by stepping in exactly where your internal resources hit a wall. Think of me as your go-to freelance web developer — ready to deliver clean, scalable solutions without the delays, learning curves, or overheads.</p>
      </div>
       <div className="split-text pb-12">
      <p>Here&#39;s how I can help:</p>
      </div>
      <div className="service-cont">
        <ul className="service-list">
          <li className="split-text">Clear your project backlog</li>
          <li className="split-text">Keep your website online and optimized</li>
          <li className="split-text">Keep your website online and optimized</li>
          <li className="split-text">Solve recurring technical issues</li>
          <li className="split-text">Free up your in-house team</li>
          <li className="split-text">Meet deadlines and impress your clients</li>
          </ul> 
           
      </div>
    </div>
    <div className="rating-img flex-1/2">
      <RatingComp/>
    </div>
    </div>
    </section>
    <section className="offer-sec mx-auto w-dvw" style={slidethreeBG}>

    <div className="mx-auto px-9 py-9 flex flex-row flex-nowrap">
     
    <div className="flex-auto md:flex-3/5 pr-16  bg-white overflow-hidden">
        <div className="split-prob-text pb-12">
              <h2>What I Offer</h2>
         </div>
      <div className="offer-slide-cont">
          <ul>
        <li className="px-10 py-10 shadow-2xs">
          <div className="offer-sec pb-12">
            <div className="icon"></div>
            <div className="offer-text">
              <div className="offer-head pb-12">
                  <h3>Website Development & Customization</h3>
              </div>
              <div className="offer-txt">
                   <p>I build custom, responsive, and scalable websites using modern technologies that match your business goals and brand identity. Whether you&#39;re launching a new project or refreshing an old one, I deliver clean, maintainable code and visually polished UI/UX.</p>
              </div>
             
            </div>
          </div>
        </li>
         <li className="px-10 py-10 shadow-2xs">
          <div className="offer-sec pb-12">
            <div className="icon"></div>
            <div className="offer-text">
              <div className="offer-head pb-12">
                  <h3>Website Maintenance & Technical Support</h3>
              </div>
              <div className="offer-txt">
                   <p>Your website needs more than just a launch — it needs ongoing care. I provide monthly website maintenance, performance optimisation, bug fixes, plugin/theme updates, and emergency troubleshooting to keep your site secure, fast, and fully operational.</p>
              </div>
             
            </div>
          </div>
        </li>
         <li className="px-10 py-10 shadow-2xs">
          <div className="offer-sec pb-12">
            <div className="icon"></div>
            <div className="offer-text">
                <div className="offer-head pb-12">
                    <h3>Reliable White-Label Partnership for Agencies</h3>
                </div>
              <div className="offer-txt">
                   <p>I offer white-label web development services to digital agencies and design studios who need extra development bandwidth without hiring full-time staff. I communicate clearly, meet deadlines, and work under your branding - making you look good in front of your clients.</p>
              </div>
             
            </div>
          </div>
        </li>
      </ul>
      </div>
      
    </div>
    <div className="intro-text flex-auto md:flex-2/5 z-10 align-middle items-center-safe" >
      <div className="logo-cont px-10 h-dvh">
       <p>
           <Image src={'/service_logos.png'} width={619} height={470} alt="Logo of stack" />
       </p>
           

      </div>
    </div>
    </div>
    </section>
 <section className="offer-sec mx-auto w-dvw " style={slidefourBG}>
   
    <div className="mx-auto px-9 py-9">
    
    <div className="why-head pb-12">
       <h2>Who & Why</h2>
    </div>
     <div className="who-text relative">
      <ul>
        <li>
          <div className="offer-sec pb-12">
            <div className="icon"></div>
            <div className="offer-text">
              <div className="why-head pb-12">
                <h3>Digital Agencies with Overflowing Development Work</h3>
              </div>
              <div className="why-cont">
                <p>When your in-house dev team is at capacity and deadlines are looming, I step in to keep projects on track. As a white-label freelance web developer, I integrate seamlessly with your workflow, helping you deliver polished websites faster — without hiring full-time staff.</p>
              </div>
            </div>
          </div>
        </li>
         <li className="">
          <div className="offer-sec pb-12">
            <div className="icon"></div>
            <div className="offer-text">
              <div className="why-head pb-12">
                  <h3>Business Owners with Ongoing Website Support Needs</h3>
              </div>
              <div className="why-cont">
                   <p>If you run a small business, you know how critical a reliable website is. I provide recurring website maintenance, quick updates, and performance fixes — so you can focus on your business while I keep your site live, secure, and updated.</p>
              </div>
             
            </div>
          </div>
        </li>
         <li>
          <div className="offer-sec pb-12">
            <div className="icon"></div>
            <div className="offer-text">
               <div className="why-head pb-12">
                 <h3>Startups Needing a Flexible, Cost-Effective Developer</h3>
               </div>
             <div className="why-cont">
                 <p>Startups move fast — and I do too. Whether you need help building an MVP, adding new features, or iterating quickly, I offer flexible freelance development services that adapt to your growth, tech stack, and deadlines.</p>
             </div>
             
            </div>
          </div>
        </li>
         <li>
          <div className="offer-sec pb-12">
            <div className="icon"></div>
            <div className="offer-text">
               <div className="why-head pb-12">
                  <h3>E-Commerce Brands Requiring High-Performance Websites </h3>
               </div>
               <div className="why-cont">
                   <p>From Shopify to WooCommerce, I help online stores stay fast, secure, and bug-free. Whether you&#39;re launching a product, optimizing checkout, or fixing downtime issues - I bring the tech skills to keep your ecommerce site running smoothly.</p>
               </div>
             
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div className="intro-text">
      <div className="why-cont  px-20 py-20">
       
            <div className="why-points">
              <p>Direct Communication. Fast Response.</p>
            </div>
             <div className="why-points">
              <p>Trusted by Global Agencies for Ongoing Development Work</p>
            </div>
             <div className="why-points">
                <p>Clean, Scalable Code Built for Performance and Maintainability</p>
             </div>
           



      </div>
    </div>
    </div>
    </section>
    <section className="" style={slidefiveBG}>
      <div>
     
      </div>
    </section>


  <footer className="w-dvw text-right text-sm py-6">
    <div className="container mx-auto">
       <span>© 2025 Pradipta Das. All rights reserved.</span>
    </div>
   
  </footer>
</div>
</div>
  )

}