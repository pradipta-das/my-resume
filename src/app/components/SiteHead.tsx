import Link from 'next/link';
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/dist/ScrollToPlugin';

export default function SiteHead(){

    const [isToggled,setIsToggled] = useState(false);
    const [isLogoSwitched, setLogoSwitch] =useState(false);

    

    const menuRef = useRef<HTMLUListElement>(null);

    gsap.registerPlugin(ScrollToPlugin);
    
    function scrollToSection(target:string){
     setIsToggled(!isToggled);
     gsap.to(window, {duration: 1, scrollTo:{y:"#" + target, offsetY:20}});


    }

    useEffect(()=>{

      window.addEventListener('scroll',()=>{

        setLogoSwitch(!isLogoSwitched);

        })


    })

    

    return(

  <header className= {isToggled ? 'header-sec fixed top-0 w-dvw z-50 h-30 active': 'header-sec fixed top-0 w-dvw z-50 h-30'}>
    <div className="cursoranim"></div>
    <div className="relative grid grid-cols-3 mx-auto px-9 py-3">
        
        <Link className="site-logo justify-center-safe font-[--font-playfair] font-bold text-[1rem]" href="#" aria-label="logo">
        <div className={!isLogoSwitched ?'p-2': 'active p-2'}><Image src="logo.svg" alt="pradipta online logo" width={150} height={100}></Image></div></Link>
        <div className='menu-cont-up'>
        <button className="absolute menu-btn right-9 z-[999] top-0 bottom-0 m-auto p-3" onClick={() => setIsToggled(!isToggled)} aria-label="Menu">
        <span className='block w-10 h-0.5 bg-black'></span>
        <span className='block w-10 h-0.5 bg-black mt-3 mb-3'></span>
        <span className='block w-10 h-0.5 bg-black'></span></button>
      
             
        
      </div>  
    </div>
    <div className='menu-cont h-auto fixed overflow-hidden w-dvw backdrop-blur-2xl top-0 left-0 px-4 pt-30 bg-[#ffffff3d] text-[--foreground] -z-10'>
      <div className='menu-cont-inner clear-both'>
           <ul className='flex flex-row border-black border-t-1 border-b-1 flex-nowrap gap-8 mt-4 justify-self-stretch justify-center-safe' ref={menuRef}>
                    <li className='py-3'><Link href={'#'} onClick={()=>{scrollToSection('about')}}>Know Me</Link></li>
                    <li className='py-3'><Link href={'#'}>My Services</Link></li>
                    <li className='py-3'><Link href={'#'}>My Work</Link></li>
                    <li className='py-3'><Link href={'#'}>Contact Me</Link></li>

                </ul>
                
      </div>
    </div>
  </header>

    )


}
