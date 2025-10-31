import React, {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import  ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {fetchSiteOptions} from '../lib/wordpress';


interface WorkList{
  work_key: number;
  why_work_list_text: string;
  why_work_list_icon: string;

}

export default function WhyWork(){
    const slidetwoBG = {
        backgroundImage: 'url("/slide_bg_2.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };

const [workDesc, setWorkdesc] = useState('');
const [workList, setWorklist] = useState<WorkList[]>([]);

useEffect(() => {



  const fetchSettings = async () =>{

    try {
      const data = await fetchSiteOptions();
      
      setWorkdesc(data.why_work_description || '');
      setWorklist(data.why_work_list || []);
    } catch (error) {
    
      console.error('Failed to fetch site settings:', error);
      // Set default values or handle error
     
      setWorkdesc('Default work description');
      setWorklist([]);
    }

  }

  fetchSettings();

},[])

useEffect(()=>{

     const tlProb = gsap.timeline({  scrollTrigger: {
        trigger: ".prob-text",
        start: "top top",
        end: "500",
        pin:false,
        scrub: true,
        markers: false,
    }});

      tlProb.to('.text1',{opacity:1})
             .to('.brain-img',{opacity:1,scale:.75},('<'))
             .to('.text2',{opacity:1},('<'))
             .to('.time-img2',{opacity:1,scale:.75},('<'))
             .to('.text3',{opacity:1},('<'))



})

    return(

        <section className="problemdiv mx-auto w-dvw" style={slidetwoBG}>
  <div className="prob-text-header px-9 mb-25 mt-25 ">
      <h2><span className="text-highlight">Why Work With Me?</span></h2>
    </div>
    <div className="px-9 py-9 pb-25 problem-text">
      <p>{workDesc}</p>
        <h3 className="text1 text-4xl transition-all leading-24 opacity-0 scale-100">Because... I&apos;m not</h3>
          <Image className="brain-img p-4 scale-30 opacity-100 transition-all" src="alien-svgrepo-com.svg" width={400} height={400} alt="brain-img"></Image>
          <h3 className="text2 mt-20 text-4xl transition-all opacity-0 scale-100">.....and I use </h3>
          <Image className="time-img2 p-4 scale-30 opacity-0" src="hourglass-svgrepo-com.svg" width={400} height={400} alt="brain-img"></Image>
          <h3 className="text3 mt-20 text-4xl transition-all opacity-0 scale-100">...and I build useful things .</h3>
      </div>
  <div className="grid grid-rows-1">
    <div className="prob-text px-9 py-9">
      
      
      <div className="service-cont">
        <ul className="service-list flex flex-nowrap align-center justify-center-safe">
          {workList.map((works) => (
             <li key={works.work_key} className="ml-1 flex-1/5">{works.why_work_list_text}</li>


          )
          )}

         
          
          </ul> 
      <p className="py-25">
        <Link href="/quote">Let&apos;s discuss your project</Link>
      </p>  
      </div>
      
    </div>
    <div className="prob-text flex flex-nowrap ">
     
        
    </div>
  </div>
   
    

    
   
    
   
    </section>


    );


}