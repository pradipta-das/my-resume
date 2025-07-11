'use client'

import FirstFrame from "./components/FirstFrame";

export default function Page() {
  
 /*  const context = useRef(null);
  gsap.registerPlugin(ScrollTrigger);

  useGSAP((context) => {

    let tl = gsap.timeline({
      // add it to an entire timeline!
     });
     let tl2 = gsap.timeline({
      // add it to an entire timeline!
     });

  tl.to('.resumeContainer',{
    opacity:1,
    duration:2,
    scrollTrigger: {
      trigger: '.resumeContainer',
      markers: true,
      pin: true, // pin the trigger element while active
      start: 'top top', // when the top of the trigger hits the top of the viewport
      end: '1500', // end after scrolling 1700px beyond the start
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
    //  pin: true,
      start:"300",
      end: "500"
    }
  }).to('.last-name',{
    opacity:1,
    duration:1,
    scrollTrigger:{
      trigger:'.last-name',
      scrub:true,
      start:"500",
      end: "700"
    }
  }).to('.title',{
    opacity:1,
    duration:1,
    scrollTrigger:{
      trigger:'.title',
      scrub:true,
      start:"700",
      end: "1000"
    }
  }).to('.sociallinks',{
    opacity:1,
    duration:1,
    scrollTrigger:{
      trigger:'.sociallinks',
      scrub:true,
      start:"1000",
      end: "1500"
    }
  }).to('.experience-cont',{
    opacity:1,
    duration:1,
    scrollTrigger: {
      trigger: '.experience-cont',
      markers: true,
     // pin: true, // pin the trigger element while active
      start: 'top top', // when the top of the trigger hits the top of the viewport
      end: '2500', // end after scrolling 1700px beyond the start
      scrub: 0.6, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
     
    }
  })


 const pin = gsap.fromTo('.portfolio-container',{
    translateX : 0
},{
    translateX: '-300vw',
    ease: 'none',
    duration: 1,
    scrollTrigger:{
        trigger: portfolioTriggerref.current,
        start: 'top top',
        end: '2000 top',
        scrub: 0.6,
        pin: true
    }
  
      
      console.log(context.data.length);
  }) */

  return(
    <section className="resumeContainer m-auto box-border">
      <FirstFrame/>
    </section>
  
  );
  };
