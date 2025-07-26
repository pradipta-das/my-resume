'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import MotionPathPlugin from 'gsap/dist/MotionPathPlugin';


function MySlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 12,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 8,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 7,
          initialSlide: 0
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5
        }
      }
    ]
  };
  return (
    <Slider {...settings}>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      <div><Image src='/html5.svg' width={70} height={70} alt='html logo'/></div>
      
    </Slider>
  );
}








export default function FirstFrame(){

const backgroundStyle = {
        backgroundImage: `url('/web-bg.png')`,
        backgroundSize: '100% auto', // Optional: Adjust as needed
        backgroundPosition: 'top center', // Optional: Adjust as needed
        backgroundRepeat: 'repeat-x',
        minHeight: '100vh', // Optional: Ensure the background covers the desired area
      };

gsap.registerPlugin(ScrollTrigger,ScrollSmoother);
gsap.registerPlugin(MotionPathPlugin);


 useGSAP(()=>{

   ScrollSmoother.create({
    smooth: 1,
    effects: true,
  });

 

const textElements = gsap.utils.toArray('.text');


textElements.forEach((text) => {
  gsap.to(text, {
    backgroundSize: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: text,
      start: 'center 80%',
      end: 'center 20%',
      scrub: true,
    },
  });
});

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
    trigger: '.anim-cont',
    start: 'top top',
    end: '2500',
    scrub: 0.6,
    pin: true,
    markers: true
  }
});
tlintro.fromTo('.intro-anim',{opacity:1},{opacity:1,duration:1})

for (var i = 0; i < spriteSheet.total; i++) {  
  tlintro.set(".intro-anim", {
    x: (i % spriteSheet.cols) * -spriteSheet.width,
    y: Math.floor(i / spriteSheet.cols) * -spriteSheet.height
  }, i / (spriteSheet.total - 1) * spriteSheet.duration);
}
*/
  const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-anim',
        start: 'top top',
        end: '2500',
        scrub: 0.6,
        pin: true,
       markers: true,
        
      },
      duration:1
    })

     tl.to('.header-sec',{opacity: 1},'>');
     tl.addLabel('start-box')
     tl.from("#div", {
      motionPath: {
       path: [{x:0, y:0}, {x:-200, y:-500}, {x:-1400, y:-500}],
       alignOrigin: [0.5, 0.5],
       autoRotate: true,
        type: "cubic"
      },
      transformOrigin: "50% 50%",
      duration: 1,
    })
     tl.addLabel('end-box')

     /*const tlprobs = gsap.timeline({
        
        scrollTrigger: {
        trigger: '.image-cont-prob',
        start: 'center center',
        end: '+=300',
        scrub: 0.6,
        pin: true,
        markers: true,
        
      },
      duration:2
     })*/
    // tlprobs.to('.image-cont-prob',{opacity:1,duration:1})

     const highlightText = gsap.utils.toArray(".text-highlight");

     highlightText.forEach((highlighttxt) => {
      ScrollTrigger.create({
        trigger: highlighttxt,
        start: "-100px center",
        onEnter: () => highlighttxt.classList.add("active"),
        onLeave:() => highlighttxt.classList.remove("active")

      });
    });

    }
   
  )

  return(
    <div id="smooth-wrapper">
  <div id="smooth-content">
<header className="header-sec w-dvw py-1 px-1 bg-[#f4ae32]">
    <div className='mx-auto max-w-5xl text-center'><p className='text-[.5em]'>Eliminate Bottlenecks. Fix Downtime. Keep Projects Moving.</p></div>
  </header>
  
  
<section style={backgroundStyle} className='hero-anim relative h-dvh mx-auto px-4 py-4 mb-20'>
  <div id="div" className='w-2.5 h-2.5 absolute left-[50%] border-2 z-10'></div>
  <div className="px-4 py-6 w-full">
      <h1 className="text-5xl font-bold text-center text-white">Your frustration ends here.</h1>
      <p className="mt-2 text-lg text-center"></p>
    </div>
    <div className="z-20 scroll-btn-cont absolute top-[35%] left-[5%] h-[200px] bottom-auto">
      <div className="scroll-bar mt-4">
          <div className="scroll-btn animate-[scroll]"></div>
      </div>
      <span className="absolute scroll-scrub -translate-7 rotate-90 font-bold uppercase">scroll</span>
    </div>
  <div className='flex-wrap flex-row hidden'>
   <div className='py-10 px-4 caption-cont align-middle'>
      <p className="text">77% of small businesses in the U.S. reported that hiring and retaining employees was one of their top challenges.<span>(NFIB, 2023)</span></p>
      <p className="text">54% of creative and marketing agencies admitted to turning down new projects in 2023 due to insufficient manpower.<span>Statista Agency Report</span></p>
      <p className="text">78% of businesses using freelancers during bottlenecks reported faster project delivery.<span>Upwork Future Workforce Report, 2023</span></p>
      <p className="text">Small businesses can save $15,000-$30,000 annually by using freelancers instead of hiring full-time developers for intermittent work.<span>Payoneer SMB Report, 2022</span></p>
    </div>
   </div> 
</section>

  <section className="relative problemdiv py-4 px-4 max-w-5xl mx-auto">
   
    <div className='flex flex-row flex-wrap'>
     <div className='bg-[#f4ae32] square absolute w-5 h-5 rotate-12 -z-10 top-[50%] right-0' data-lag=".8"></div>
      <div className='bg-[#f4ae32] square absolute w-5 h-5  -z-10 top-[2%] -left-2' data-lag=".5"></div>
    <h2 className="text-2xl font-semibold mb-10">Facing Too Many Projects or Website Issues?</h2>
    <p className="mb-10">Is your <strong className='text-highlight'>agency flooded with development tasks</strong>, struggling to meet deadlines with a stretched team?<br/>Every hour spent trying to fix a broken site, every opportunity delayed due to a missing developer, adds up to <strong className='text-highlight'>frustration, lost money, and missed growth</strong>.
    </p>

    <p className="mb-10">
    <em>Agencies lose valuable clients due to delivery delays.<br/>Business owners lose trust and revenue every time their website breaks or slows down.</em></p>

    <h2 className="text-2xl font-semibold mb-10">Website problems aren't just technical - they're business problems.</h2>

    <p className="mb-10">Are you a <strong className='text-highlight'>business owner constantly firefighting site issues</strong>, missing out on leads or sales because your website isn't reliable?<br/>You're not alone.</p>

    <p className="mb-10">But it doesn't have to be this way.</p>

    <p className="mb-10">What if you had <strong className='text-highlight'>an expert developer you could call in anytime</strong> — someone who understands deadlines, fixes problems fast, and works as an extension of your team?</p>
    </div>
   
    </section>


  <section className="benefit-section relative overflow-hidden  max-w-5xl mx-auto px-4">
    <div className='bg-[#f4ae32] highlight-benefit absolute w-5 h-5  -z-10 top-[50%] right-0' data-speed=".8"></div>
    
    <div className="max-w-5xl mx-auto mb-10">
      <h2 className="text-2xl font-semibold mb-10">Get Expert Web Development Support, On Demand</h2>
      <p>I help agencies, startups, and small businesses by stepping in exactly where your internal resources hit a wall.<br/>Think of me as your go-to freelance web developer — <span className='text-highlight'>ready to deliver clean, scalable solutions without the delays, learning curves, or overheads</span>.<br/>Here's how I can help:</p>
    </div>
    <div className='max-w-5xl mx-auto flex flex-row flex-wrap mb-10'>
      <div className='md:flex-1/2'>
      <div className='caption-cont caption-cont-half px-4'>
      <p className="text shadow">Clear your project backlog.<span>Deliver faster, without burning out your team.</span></p>
      <p className="text shadow">Keep your website online and optimized.<span>Because downtime costs money.</span></p>
      <p className="text shadow">Solve recurring technical issues.<span>No more chasing bugs or patching quick fixes.</span></p>
      <p className="text shadow">Free up your in-house team.<span>Best let your core staff focus on what they do.</span></p>
      <p className="text shadow">Meet deadlines and impress your clients.<span>Turn chaos into smooth delivery.</span></p>
       <p className="text shadow">Get ongoing website care and updates.<span>So you stay secure, fast, and future-ready.</span></p>
       
    </div>
       
      </div>
      <div className='md:flex-1/2 pt-18'>
        <Image className=' border-[#f4ae32] border-1 border-s p-2' src='/expert-support.png' width={600} height={400} alt="my offer"/>
      </div>
    
    </div>
  </section>


  <section className="relative service-blocks py-10 px-4 ">
     <div className='bg-[#f4ae32] absolute w-5 h-5  -z-10 top-[50%] right-33' data-speed=".7"></div>
    <div className='max-w-5xl mx-auto'>
    <h2 className="text-2xl font-semibold mb-10">What I Offer</h2>
    <div className='flex flex-row flex-wrap justify-center align-middle'>
     
    <div className='flex-1/2'>
    <div className="grid grid-rows-1 gap-6">
      <div className="flex flex-row flex-wrap p-3 rounded shadow transition hover:shadow-2xl service-block">
        <Image className='mx-auto flex-1/4' src={'/web-dev.svg'} width={50} height={50} alt='partnership' />
        <div className='flex-3/4 p-2'>
        <h3 className="text-xl font-bold mt-2 mb-2">Website Development & Customization</h3>
        <p className=''>Web development using cutting edge tech stack.</p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap  p-3 rounded shadow transition hover:shadow-2xl service-block">
        <Image className='mx-auto flex-1/4' src={'/web-maintenance.svg'} width={50} height={50} alt='partnership' />
         <div className='flex-3/4 p-2'>
        <h3 className="text-xl font-bold mt-2 mb-2">Website Maintenance & Support</h3>
        <p className=''>Performance optimization, plugin/theme updates, fixes</p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap p-3 rounded shadow transition hover:shadow-2xl service-block" >
        <Image className='mx-auto flex-1/4' src={'/partnership.svg'} width={50} height={50} alt='partnership' />
         <div className='flex-3/4 p-2'>
        <h3 className="text-xl font-bold mt-2 mb-2">White-Label Partnership for Agencies</h3>
        <p className=''>Seamless collaboration with your clients under your brand</p>
        </div>
      </div>
    </div>
    </div>
     <div className='flex-1/2 md:px-4 py-4 '>
     <Image className=' border-[#f4ae32] border-1 border-s p-2' src='/whatioffer.png' width={600} height={400} alt="my offer"/>
    </div>
    </div>
    </div>
  </section>


  <section className="py-10 px-4 whyworksec">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-10">Why Work With Me?</h2>
      <ul className="list-none flex flex-wrap flex-row space-y-2 text-center">
        <li className='flex-1/1 md:flex-1/5 py-3 px-4'>
        <Link href='https://www.google.com'>
         <Image className='mx-auto py-4' src={'/experience.svg'} width={100} height={100} alt='Highly experience' />
        10+ years of experience building and managing websites
        </Link>
        </li>
        <li className='flex-1/1 md:flex-1/5 py-3 px-4'> 
        <Image className='mx-auto py-4' src={'/trusted.svg'} width={100} height={100} alt='trusted' />
        Trusted by global agencies for recurring work</li>
        <li className='flex-1/1 md:flex-1/5 py-3 px-4'> <Image className='mx-auto py-4' src={'/onetime.svg'} width={100} height={100} alt='Available for contracts' />
        Available for one-time projects and long-term contracts</li>
        <li className='flex-1/1 md:flex-1/5 py-3 px-4'> <Image className='mx-auto py-4' src={'/communication.svg'} width={100} height={100} alt='Quick response' />
        Direct communication, quick response time</li>
        <li className='flex-1/1 md:flex-1/5 py-3 px-4'>
         <Image className='mx-auto py-4' src={'/clean-optimized.svg'} width={100} height={100} alt='Clean codes' />
         Clean, optimized, and scalable code</li>
      </ul>
    </div>
  </section>


  <section className="relative py-10 px-4 max-w-5xl mx-auto">
    <h2 className="text-2xl font-semibold mb-10">Who I Help</h2>
     <div className='bg-[#f4ae32] absolute w-10 h-10  -z-10 top-[50%] -left-1' data-speed=".7"></div>
     
    <div className='max-w-5xl mx-auto flex flex-row flex-wrap'>
      <div className='flex-1/2 border-[#f4ae32] border-1 border-s p-2'>
    
        <Image className='shadow' src='/whowework.png' width={600} height={400} alt="my offer"/>
      </div>
      <div className='flex-1/2 pt-3 px-6 '>
    <ul className="grid grid-rows-1 gap-6">
      <li className='p-4 rounded shadow transition hover:shadow-2xl '>Digital Agencies with too many client projects</li>
      <li className='p-4 rounded shadow transition hover:shadow-2xl '>Business Owners needing reliable website support</li>
      <li className='p-4 rounded shadow transition hover:shadow-2xl '>Startups seeking flexible, skilled development help</li>
      <li className='p-4 rounded shadow transition hover:shadow-2xl '>E-commerce brands requiring stable, fast websites</li>
    </ul>
    </div>
     
    </div>
  </section>

  <section className="py-12 text-center">
    <h2 className="text-3xl font-bold mb-4">Let's Take the Bottleneck Off Your Plate</h2>
    <p className="text-lg mb-6">Need a freelance web developer you can count on?</p>
    <div className="space-x-4">
      <Link href="#" className="bg-[#f4ae32] text-black px-6 py-3  shadow">Book a Free Consultation</Link>
      <Link href="#" className="bg-white border border-[#f4ae32] text-black-600 px-6 py-3  shadow">Send Project Details</Link>
    </div>
  </section>


  <footer className="text-center text-sm py-6">
    <span>© 2025 Pradipta Das. All rights reserved.</span>
  </footer>
</div>
</div>
  )

}