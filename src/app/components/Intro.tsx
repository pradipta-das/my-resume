import React,{useState, useEffect, useRef} from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import MotionPathPlugin from "gsap/dist/MotionPathPlugin";
import DrawSVGPlugin from "gsap/dist/DrawSVGPlugin";
import SplitText from "gsap/dist/SplitText";
import {fetchSiteOptions} from '../lib/wordpress';
import SocialIcons from "./SocialIcons";


export function ArrowMessage(){

return(
 <svg version="1.1" id="message" viewBox="0 0 462.5 462.5"  width="100px" height="100px" fill="#C1E8E6" transform="rotate(0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.925"></g><g id="SVGRepo_iconCarrier"> <g> <polygon fill="#6DA8D6"  points="204.147,113.811 150.024,163.811 462.5,163.813 "></polygon> <polygon fill="#98D9D5" points="150.024,163.811 204.147,213.811 462.5,163.813 "></polygon> <polygon  points="462.5,163.813 173.413,321.312 204.147,213.812 "></polygon> <polygon points="462.5,163.813 204.147,113.812 173.413,6.312 "></polygon>  </g> </g></svg>
  
)

}

export function AtomAnim(){

  return(
    <svg viewBox="0 0 24 24" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M10.4606 1.25H13.5394C15.1427 1.24999 16.3997 1.24999 17.4039 1.34547C18.4274 1.44279 19.2655 1.64457 20.0044 2.09732C20.7781 2.57144 21.4286 3.22194 21.9027 3.99563C22.3554 4.73445 22.5572 5.57256 22.6545 6.59611C22.75 7.60029 22.75 8.85725 22.75 10.4606V11.5278C22.75 12.6691 22.75 13.564 22.7007 14.2868C22.6505 15.0223 22.5468 15.6344 22.3123 16.2004C21.7287 17.6093 20.6093 18.7287 19.2004 19.3123C18.3955 19.6457 17.4786 19.7197 16.2233 19.7413C15.7842 19.7489 15.5061 19.7545 15.2941 19.7779C15.096 19.7999 15.0192 19.832 14.9742 19.8582C14.9268 19.8857 14.8622 19.936 14.7501 20.0898C14.6287 20.2564 14.4916 20.4865 14.2742 20.8539L13.7321 21.7697C12.9585 23.0767 11.0415 23.0767 10.2679 21.7697L9.72579 20.8539C9.50835 20.4865 9.37122 20.2564 9.24985 20.0898C9.13772 19.936 9.07313 19.8857 9.02572 19.8582C8.98078 19.832 8.90399 19.7999 8.70588 19.7779C8.49387 19.7545 8.21575 19.7489 7.77666 19.7413C6.52138 19.7197 5.60454 19.6457 4.79957 19.3123C3.39066 18.7287 2.27128 17.6093 1.68769 16.2004C1.45323 15.6344 1.3495 15.0223 1.29932 14.2868C1.24999 13.564 1.25 12.6691 1.25 11.5278L1.25 10.4606C1.24999 8.85726 1.24999 7.60029 1.34547 6.59611C1.44279 5.57256 1.64457 4.73445 2.09732 3.99563C2.57144 3.22194 3.22194 2.57144 3.99563 2.09732C4.73445 1.64457 5.57256 1.44279 6.59611 1.34547C7.60029 1.24999 8.85726 1.24999 10.4606 1.25ZM6.73809 2.83873C5.82434 2.92561 5.24291 3.09223 4.77938 3.37628C4.20752 3.72672 3.72672 4.20752 3.37628 4.77938C3.09223 5.24291 2.92561 5.82434 2.83873 6.73809C2.75079 7.663 2.75 8.84876 2.75 10.5V11.5C2.75 12.6751 2.75041 13.5189 2.79584 14.1847C2.84081 14.8438 2.92737 15.2736 3.07351 15.6264C3.50486 16.6678 4.33223 17.4951 5.3736 17.9265C5.88923 18.1401 6.54706 18.2199 7.8025 18.2416L7.83432 18.2421C8.23232 18.249 8.58109 18.2549 8.87097 18.287C9.18246 18.3215 9.4871 18.3912 9.77986 18.5615C10.0702 18.7304 10.2795 18.9559 10.4621 19.2063C10.6307 19.4378 10.804 19.7306 11.0004 20.0623L11.5587 21.0057C11.7515 21.3313 12.2485 21.3313 12.4412 21.0057L12.9996 20.0623C13.1959 19.7306 13.3692 19.4378 13.5379 19.2063C13.7204 18.9559 13.9298 18.7304 14.2201 18.5615C14.5129 18.3912 14.8175 18.3215 15.129 18.287C15.4189 18.2549 15.7676 18.249 16.1656 18.2421L16.1975 18.2416C17.4529 18.2199 18.1108 18.1401 18.6264 17.9265C19.6678 17.4951 20.4951 16.6678 20.9265 15.6264C21.0726 15.2736 21.1592 14.8438 21.2042 14.1847C21.2496 13.5189 21.25 12.6751 21.25 11.5V10.5C21.25 8.84876 21.2492 7.663 21.1613 6.73809C21.0744 5.82434 20.9078 5.24291 20.6237 4.77938C20.2733 4.20752 19.7925 3.72672 19.2206 3.37628C18.7571 3.09223 18.1757 2.92561 17.2619 2.83873C16.337 2.75079 15.1512 2.75 13.5 2.75H10.5C8.84876 2.75 7.663 2.75079 6.73809 2.83873Z" fill="#1C274C"></path> </g></svg>
  )

}

export function LocationIcon(){

  return(

   <svg version="1.1" id="Layer_1" viewBox="0 0 512 512" width="25px" height="25px" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <polygon fill="#ED732F" points="380.628,276.898 444.016,276.898 444.016,377.208 291.809,377.208 216.228,377.208 92.931,377.208 42.776,327.053 92.931,276.898 215.184,276.898 "></polygon> <polygon fill="#ED732F" points="129.217,222.563 65.829,222.563 65.829,122.253 218.036,122.253 293.616,122.253 416.914,122.253 467.069,172.408 416.914,222.563 294.661,222.563 "></polygon> </g> <path fill="#FFE48D" d="M220.473,501.551V20.898c0-5.771,4.678-10.449,10.449-10.449h50.155 c5.771,0,10.449,4.678,10.449,10.449v480.653H220.473z"></path> <rect x="220.473" y="10.449" fill="#FF9D3B" width="71.053" height="44.931"></rect> <path d="M348.978,366.759h-0.137c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449h0.137 c5.77,0,10.449-4.678,10.449-10.449C359.427,371.437,354.749,366.759,348.978,366.759z"></path> <path d="M416.914,233.012c2.771,0,5.428-1.101,7.388-3.061l50.155-50.155c4.08-4.08,4.08-10.697,0-14.778l-50.155-50.155 c-1.96-1.958-4.617-3.059-7.388-3.059H301.975V20.898C301.975,9.375,292.601,0,281.078,0h-50.155 c-11.523,0-20.898,9.375-20.898,20.898v90.906H65.829c-5.77,0-10.449,4.678-10.449,10.449v100.31 c0,5.771,4.679,10.449,10.449,10.449h63.389c5.77,0,10.449-4.678,10.449-10.449c0-5.771-4.679-10.449-10.449-10.449h-52.94v-79.412 h133.747v79.412h-14.102c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449h14.102v33.437H95.086 c-2.771,0-5.428,1.101-7.388,3.06l-50.155,50.155c-4.08,4.08-4.08,10.697,0,14.778l50.155,50.155 c1.96,1.958,4.617,3.059,7.388,3.059h114.939v113.894c0,5.771,4.679,10.449,10.449,10.449h71.053c5.77,0,10.449-4.678,10.449-10.449 V387.657h14.102c5.77,0,10.449-4.678,10.449-10.449c0-5.771-4.679-10.449-10.449-10.449h-14.102v-79.412h133.747v79.412h-52.94 c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449h63.389c5.77,0,10.449-4.678,10.449-10.449v-100.31 c0-5.771-4.679-10.449-10.449-10.449H301.975v-33.437H416.914z M99.415,366.759l-39.706-39.706l39.706-39.706h110.61v79.412H99.415z M281.078,491.102h-50.155V65.829h29.954c5.77,0,10.449-4.678,10.449-10.449s-4.679-10.449-10.449-10.449h-29.954V20.898h50.155 V491.102z M412.585,132.702l39.706,39.706l-39.706,39.706h-110.61v-79.412H412.585z"></path> <path d="M163.158,233.012c5.77,0,10.449-4.678,10.449-10.449c0-5.771-4.679-10.449-10.449-10.449h-0.137 c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449H163.158z"></path> </g></svg>


  );

}

export default function Intro(){


    const backgroundStyle = {
        backgroundImage: 'url("/slide_1_bg.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };

const [siteHeader, setSiteheader] = useState('');
const [siteDesc, setSitedesc] = useState('');
const introcntxt = useRef<HTMLHtmlElement>(null);


useEffect(() => {

  const fetchSettings = async () =>{

    try {
      const data = await fetchSiteOptions();
      setSiteheader(data.header_text || '');
      setSitedesc(data.header_description || '');
      



      
    } catch (error) {
    
      console.error('Failed to fetch site settings:', error);
      // Set default values or handle error
      setSiteheader('Welcome');
      setSitedesc('Default description');
     
     
    }

    ScrollTrigger.refresh();

  }

  fetchSettings();

},[siteHeader,siteDesc])


useGSAP(()=>{
 gsap.registerPlugin(ScrollTrigger,SplitText,MotionPathPlugin,DrawSVGPlugin);
   
    const headersplit = SplitText.create(".intro-head h1");
    const splitintro = SplitText.create(".split-text-intro");
    const skillItems:HTMLUListElement[] = gsap.utils.toArray('.service-details');
    const skillTrigs:HTMLDivElement[] = gsap.utils.toArray('.service-trigger');
    const numStack:HTMLSpanElement[] = gsap.utils.toArray('.stack span');

    

   


   

    const tlintro = gsap.timeline({ scrollTrigger: {
        trigger: ".intro-text",
        start: "top 140px",
        end: "650",
        pin:false,
        invalidateOnRefresh:false,
        scrub: 1,
        markers: false,
    } });



tlintro.from(headersplit.chars,{
  opacity: 0.2,
  stagger: 0.1,
})
 .from(splitintro.chars, {
  opacity: 0.2,
  stagger: 0.1,
},'>')

skillItems.forEach((elem,index)=>{

      
const startTime = index === 0 ? "-=0.5" : "-=0.5"; // Stagger animations

              tlintro.fromTo(elem, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                zIndex: 9999 - index
              }, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                
                zIndex: 9999 - index,
                duration: 2,
                stagger:{
                  each: 1.0
                }
                
              }, startTime);
              tlintro.fromTo(skillTrigs[index], {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                zIndex: 9999 - index
              }, {
                 clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                zIndex: 9999 - index,
                duration: 2
                
              }, '<');
          
        })

const tlmessage = gsap.timeline({ scrollTrigger: {
        trigger: "#message",
        start: "top top",
        end: "2000",
        pin:false,
        invalidateOnRefresh:false,
        scrub: 1,
        markers: false,
    } });


tlmessage.to("#message", {
  motionPath: {
    path: [{x:200, y:0}, {x:320, y:220}, {x:230, y:15}, {x:130, y:1400}],
    type: "cubic",
    autoRotate: true,
  },
  scale:1,
  duration: 5,
},'-=1')
.to("#message", {
  opacity:0,
  duration:1
})
 
const introGrphcs = gsap.timeline({
  scrollTrigger:{
     trigger: ".intro-graphics",
        start: "top top",
        end: "1000",
        pin:false,
        invalidateOnRefresh:false,
        scrub: 1,
        markers: false,
  }
})

introGrphcs.to('.map',{
  scale:1,
  duration:1
})
numStack.forEach((elem)=>{

  introGrphcs.from(elem, {
  textContent: 0,
  duration: 5,
  ease: "power1.in",
  snap: { textContent: 1 },
    stagger: {
      each: 1.0,  
      onUpdate: function() {
        
        if (elem.innerHTML) elem.innerHTML = elem.textContent.toString()+'+';
        
      },
    }
  });

})

introGrphcs.fromTo(".responsive-img", {duration:1,scale:0.7},{scale:1},'+=5')


},{scope:introcntxt})

    return(
        <section className="intro-section overflow-hidden pt-35 w-dvw" ref={introcntxt} style={backgroundStyle}>
   <div className="allIntro max-w-7xl mx-auto grid md:grid-cols-2 grid-cols-1 px-9 py-9">
    <div className="intro-text">
      <div className="intro-head mt-10">
     
        <h1 className="mb-10 text-center">Hi, I am Pradipta - Web Developer & Creative Technologist based in India.</h1>
      
      
      </div>
      <div className="split-text-intro pb-10 text-left">
      <p>I build solutions for businesses across the globe.<br/>Want to know more? <br/>Visit my socials below or Scroll down.<br/>Send me a message, I would love to connect.</p>
      </div>
      <div className="w-3xs split-text-intro pb-10">
        <div className="message w-3 h-3 z-20">
          
          <ArrowMessage/>
        </div>
        <p className="pb-10">Connect with me</p>
        <SocialIcons></SocialIcons>
      </div>
       <div id="about" className="split-text-intro pt-15 pb-15 text-left">
        <h2><span className="text-highlight mb-10">How I Bring Ideas to Life</span></h2>
        <div className="pt-10 pb-10">
        <span>Headless Development / Shopify / Wordpress / Sanity / Next / React</span>
        </div>
        <p>I offer big agency experience at small agency cost. If you are looking for a problem solver dedicated to make things better for your users, check my creds below.</p>
        </div>
        <div className="why_graphics px-7">
   <ul className="grid grid-cols-2 grid-rows-4 gap-7 service-list">
    <li>
        <div className="px-3 py-3 border-black border-r-1">
         
          <div className="service-details">
            <p>Frontend that feels natural, loads lightning-fast, and scales easily.</p>
          </div>
        </div>
      </li>
      <li> <div data-id="1" className="service-trigger absolute text-2xl leading-20 py-2 cursor-pointer ">Frontend</div></li>
        <li><div data-id="2" className="service-trigger absolute text-2xl py-2 cursor-pointer ">E-Commerce</div></li> 
      <li>
        <div className="px-3 py-3 border-black border-l-1">
          
          <div className="service-details">
            <p>Your store deserves speed, stability, and style — I deliver all three.</p>
          </div>
        </div>
      </li>
   
      <li><div className="px-3 py-3 border-black border-r-1">
          
          <div className="service-details">
            <p>Integrations that save time, reduce chaos, and boost workflow.</p>
          </div>
        </div></li>
     <li><div data-id="3" className="service-trigger absolute text-2xl py-2 cursor-pointer">Integrations</div></li>
     <li> <div data-id="4" className="service-trigger absolute text-3xl py-2 cursor-pointer">Tools</div></li>
      <li><div className="px-3 py-3 border-black border-l-1">
         
         <div className="service-details ">
            <p className="text-black">I work with modern tech stack — choosing the right tools to fit each project&apos;s goals.</p>
          </div>
        </div></li>
        
    </ul>
   

  </div>
      </div>
   <div className="intro-graphics -z-1 pt-20">

  <div className="blog-img  -z-99" data-speed='.2'>
        <Image src={'global-map.svg'} width={1920} height={1080} alt="map-image"></Image>
      </div>
  <div className="stack justify-center px-10 py-10">
    <ul className="flex flex-row flex-wrap mb-12">
    <li className="p-10 flex-1/2 border-r-black border-r-[1px]"><span className="text-5xl">15+ </span><br/>Years of development</li>
    
    <li className="p-10 flex-1/2"></li>
    <li className="p-10 flex-1/2"></li>
    <li className="p-10 flex-1/2  border-r-black border-r-[1px]  border-b-black border-b-[1px]  border-t-black border-t-[1px]"><span className="text-5xl">400+</span><br/>Projects</li>

    <li className="p-10 flex-1/2  border-r-black border-r-[1px]"><span className="text-5xl">50+</span> Clients <p className= "mr-6 text-[.7rem]">As of Sept,2025</p></li>
<li className="p-10 flex-1/2"></li>
     <li className="p-10 flex-1/2"></li>
    <li className="p-10 flex-1/2  border-t-black border-t-[1px]  border-r-black border-r-[1px]"><span className="text-5xl">10+</span><br/>Agencies experience across US, Canada, Australia, UK & Middle East</li>
    
   </ul>
    
    
  </div>
  
  <Image className="responsive-img translate-y-[5rem] -translate-x-[50%] " src="onetime.svg" width={800} height={600} alt="offer image"></Image>
   
   </div>
   
    </div>
    
</section>


    )

}