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

    function handleScroll(){
      if(window.scrollY>0){
        setLogoSwitch(true);
      }else{
        setLogoSwitch(false);
      }
    }
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount


    

    return(

  <header className= {isToggled ? 'header-sec fixed top-0 w-dvw z-50 active': 'header-sec fixed top-0 w-dvw z-50'}>
    
    <div className={!isLogoSwitched ?'w-dvw flex flex-row justify-between align-middle transition transition-height duration-500 ' : 'w-dvw flex flex-row justify-between align-middle transition transition-height duration-500  scrolled '}>
        
        <Link className="site-logo flex justify-start font-[--font-playfair] font-bold text-[1rem]" href="#" aria-label="logo">
        <div className={!isLogoSwitched ?'p-2 transition duration-1000 scale-100': 'transition duration-1000 scale-75 p-2'}><Image src="logo.svg" alt="pradipta online logo" width={123} height={40}></Image></div>
        </Link>
       <nav className='menu-cont flex justify-end items-center'>
        <ul className="flex flex-row gap-4 h-12 pr-6 align-middle justify-center" ref={menuRef}>
            <li className='menu-item flex align-middle flex-col justify-center'><Link href="#" onClick={()=>scrollToSection('projects')}>Book Free Consultation</Link></li>
            <li className='menu-item flex align-middle flex-col justify-center'><Link href="#" onClick={()=>scrollToSection('about')}>Cost Estimator</Link></li>
            <li className='menu-item flex align-middle flex-col justify-center'><Link href="https://www.studiolnc.dev">visit studiolnc.lab</Link></li>
        </ul>
       </nav>
       </div>
  </header>

    )


}
