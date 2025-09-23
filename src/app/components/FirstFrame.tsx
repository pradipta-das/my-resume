"use client";

import React, {useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import SplitText from "gsap/dist/SplitText";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {fetchSiteOptions} from '../lib/wordpress';
import WordPressBlogPostsSimple from "./WordPressBlogPostsSimple";

import Portfolio from "./Portfolio";
import ReviewSlider from "./ReviewSlider";
import OfferSlider from "./OfferSlider";

interface SocialLink {
  social_key: number;
  social_name: string;
  social_link: string;
  social_icon: string;
}

interface WorkList{
  work_key: number;
  why_work_list_text: string;
  why_work_list_icon: string;

}


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
        backgroundImage: 'url("/slide_bg_2.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };



gsap.registerPlugin(ScrollTrigger,ScrollSmoother,SplitText);



const [siteHeader, setSiteheader] = useState('');
const [siteDesc, setSitedesc] = useState('');
const [socialIcon, setSocialicon] = useState<SocialLink[]>([]);
const [workDesc, setWorkdesc] = useState('');
const [workList, setWorklist] = useState<WorkList[]>([]);


useEffect(() => {

  const fetchSettings = async () =>{

    try {
      const data = await fetchSiteOptions();
      setSiteheader(data.header_text || '');
      setSitedesc(data.header_description || '');
      setSocialicon(data.social_links || []);
      setWorkdesc(data.why_work_description || '');
      setWorklist(data.why_work_list || []);
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
      // Set default values or handle error
      setSiteheader('Welcome');
      setSitedesc('Default description');
      setSocialicon([]);
      setWorkdesc('Default work description');
      setWorklist([]);
    }

  }

  fetchSettings();

},[])

 
/* GSAP animation codes */

 useGSAP(()=>{

   ScrollSmoother.create({
    smooth: 1,
    effects: true,
  });

const headersplit = SplitText.create(".intro-head h1");
const splitintro = SplitText.create(".split-text-intro");
const tlintro = gsap.timeline({  scrollTrigger: {
    trigger: ".intro-section",
    start: "top top",
    end: "300",
    pin:false,
    scrub: true,
    markers: false,
  }});

tlintro.from(headersplit.chars,{
  opacity: 0.2,
  stagger: 0.1,
})
 .from(splitintro.chars, {
  opacity: 0.2,
  stagger: 0.1,
})



const servList:HTMLElement[] = gsap.utils.toArray(".service-list li");
const tl = gsap.timeline({defaults:{delay:0.8,ease:"power1.inOut"}})
tl.to('.problem-text',{opacity:1,xPercent: 0,scrollTrigger:{
      trigger: '.problem-text',
      start: "top center",
      end: 'bottom center',
      scrub:true,
      pin:false,
      markers:false
    }});
servList.forEach((index,elem)=>{

  tl.to(servList[elem],{opacity:1,scrollTrigger:{
      trigger: index,
      start: "center center",
      end: 'bottom center',
      scrub:true,
      pin:false,
      markers:false
    }});
})



const tlFooter = gsap.timeline({  scrollTrigger: {
    trigger: ".footer-cta",
    start: "top top",
    end: "2000",
    pin:false,
    scrub: 1,
    markers: false,
    
  }});

tlFooter.to(".why-head",{'color':'var(--foreground)'})
.to(".footer-text",{x:-80,'color':'black', opacity:1, filter: "blur(0rem)"})
.to(".footer-img",{x:100,opacity:0.5,scale:.8,filter:"blur(0.5rem)"})
  },{dependencies:[siteHeader,siteDesc]})


  return(
    

<>
  
<section className="intro-section w-dvw h-dvh relative" style={backgroundStyle}>
   <div className="mx-auto relative px-9 py-9">
  <div className="rating-img">
      <div className="blog-img absolute scale-50 opacity-50 -z-1" data-speed='.2'>
        <Image src={'global-map.svg'} width={1400} height={800} alt="map-image"></Image>
      </div>
     
    </div>
   
    <div className="intro-text h-dvh">
      <div className="intro-head mt-25">
      <h1 className="mb-25 text-center">{siteHeader}</h1>
      </div>
      <div className="split-text-intro pb-25 text-center">
      <h2>{siteDesc}</h2>
      </div>
      <div className="w-3xs split-text-intro pb-25">
        <ul className="grid grid-cols-4">
         {socialIcon.map((social) => (

             <li key={social.social_key}>
              <Link href={social.social_link}>
                <Image className="relative transition-all hover:scale-125 hover:fill-white" src={social.social_icon} height={40} width={40} alt={social.social_name}></Image>
              </Link>
              </li> 

         )


         )}

         
          </ul>
      </div>
      </div>
    
    </div>
</section>

<section className="problemdiv mx-auto w-dvw" style={slidetwoBG}>
   <div className="prob-text-header px-9 mb-25 mt-25 ">
      <h2><span className="text-highlight">Why Work With Me?</span></h2>
    </div>
    <div className="px-9 py-9 pb-25 w-[50%] problem-text opacity-20">
      <p>{workDesc}</p>
      </div>
    <div className="px-9 py-9 flex flex-row flex-wrap">
    <div className="prob-text relative flex-auto md:flex-1/2">
      
      
      <div className="service-cont">
        <ul className="service-list">
          {workList.map((works) => (
             <li key={works.work_key} className="ml-1 opacity-20">{works.why_work_list_text}</li>


          )
          )}

         
          
          </ul> 
      <p className="py-25">
        <Link href="/quote">Let&apos;s discuss your project</Link>
      </p>  
      </div>
      
    </div>
    <div className="flex-auto md:flex-1/2 justify-end-safe">
          
    </div>
    </div>
   
    </section>
    <OfferSlider />
<section>
  <div className="mx-auto px-9 py-9">
    <div className="why-head pb-25">
          <h2 className="mb-25">Portfolio / Case Studies</h2>
          <p>Over the years, I&apos;ve collaborated with global agencies and direct clients, building more than 50+ websites across industries.</p>
       </div>
  </div>
  
</section>
   <Portfolio />

  
    
      <ReviewSlider />



      <WordPressBlogPostsSimple />
  
 <section className="footer-cta h-dvh overflow-hidden" style={slidethreeBG}>

       <div className="mx-auto px-9 py-9 relative">
    <div className="footer-img absolute  right-0" data-lag='.2'>
    <Image src={'onetime.svg'} width={800} height={800} alt="contact-image"></Image>
  </div>
    <div className="why-head pb-12">
    <h2>Let&apos;s Build Something Great Together</h2>
    <p>Whether you&apos;re an agency with overflow work or a business owner needing a reliable developer,<br/> I&apos;m here to help. I focus on results, not excuses.</p>
      </div>
      <div className="footer-social w-50">
        <ul className="grid grid-cols-4">
         {socialIcon.map((social) => (

             <li key={social.social_key}>
              <Link href={social.social_link}>
                <Image className="relative transition-all hover:scale-125 hover:fill-white" src={social.social_icon} height={40} width={40} alt={social.social_name}></Image>
              </Link>
              </li> 

         )


         )}

         
          </ul>
      </div>
        <div className="footer-text w-dvw blur-xl">
    <p className="relative text-[15rem] text-[var(--foreground)] left-20">I&apos;m Online</p>
  </div>
  
      </div>
     
    </section>
  <footer className="w-dvw text-right text-sm py-6">
    <div className="container mx-auto">
       <span>© 2025 Pradipta Das. All rights reserved.</span>
    </div>
   
  </footer>
</>  
  )

}