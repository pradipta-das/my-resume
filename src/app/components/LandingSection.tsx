'use client'

import Link from 'next/link';
import React from 'react';
import { useRef } from 'react';
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/all";
import Image from 'next/image';
import landingImg from '@/../public/landing.jpg';
import IntroText from './IntroText';


export function LandingFooter(){
  return(
    <div className="landingImg flex h-dvh w-auto absolute lg:relative lg:w-1/3 grow items-center justify-center footer-links max-h-10/12 lg:pr-10 opacity-0 -mr-10">
      <Image src={landingImg} alt='Pradipta on landing page' />
      
    </div>  
  )
}


export default function LandingSection() {

  const context = useRef(null);
  gsap.registerPlugin(ScrollTrigger);

  useGSAP((context) => {

    let tl = gsap.timeline({
      // add it to an entire timeline!
     });
     
  tl.to('.landingwrapper',{
    opacity:1,
    duration:2,
    scrollTrigger: {
      trigger: '.landingwrapper',
      markers: true,
      pin: true, // pin the trigger element while active
      start: 'top top', // when the top of the trigger hits the top of the viewport
      end: '100%', // end after scrolling 1700px beyond the start
      scrub: 0.6, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
     
    }
  }).to('.first-name ',{
    opacity:1,
    duration:1,
    scrollTrigger:{
        trigger:'.first-name ',
        scrub: true,
        start: "0",
        end:"300"
    }
  }).to('.landingImg',{
    opacity:1,
    marginRight:0,
    duration:1,
    scrollTrigger:{
      trigger:'.title',
      scrub:true,
      start:"300",
      end: "500"
    }
  }).to('.last-name',{
    opacity:1,
    duration:1,
    scrollTrigger:{
      trigger:'.last-name',
      scrub:true,
      start:"400",
      end: "500"
    }
  }).to('.title',{
    opacity:1,
    duration:1,
    scrollTrigger:{
      trigger:'.title',
      scrub:true,
      start:"500",
      end: "600"
    }
  }).to('.sociallinks',{
    opacity:1,
    duration:1,
    scrollTrigger:{
      trigger:'.sociallinks',
      scrub:true,
      start:"600",
      end: "700"
    }
  })
      
      console.log(context.data.length);
  })

  return (

    <section className="landingwrapper h-svh w-dvw bg-[#fafafa]" ref={context} >
        <div className='header flex items-start justify-start pl-20 pr-20'>
          <div className='header-text h-svh flex flex-col w-full lg:w-2/3 grow max-h-10/12 p-5 justify-start border-l-neutral-700 border-l-2 border-b-2'>
            <IntroText/>
            <div className='sociallinks flex lg:absolute bottom-22 mt-10 opacity-0'>
              <Link href="home">LinkedIn</Link>
              <Link href="home">GitHub</Link>
              <Link href="home">Facebook</Link>
              <Link href="home">Instagram</Link>
            </div> 
          </div>
          <LandingFooter/>
        </div>
    </section>
  )
}
