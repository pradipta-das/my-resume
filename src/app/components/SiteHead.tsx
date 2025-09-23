import Link from 'next/link';
import React, { useState } from 'react';

export default function SiteHead(){

    const [isToggled,setIsToggled] = useState(false);
    


    return(

  <header className="header-sec w-dvw py-1 px-1 z-50">
    <div className="relative mx-auto px-9 py-9">
        <Link className="float-left site-logo font-[--font-playfair] font-bold text-[1rem]" href="#" aria-label="logo">pradipta.online</Link>
        <Link className="float-right menu-btn" onClick={() => setIsToggled(!isToggled)} href="#" aria-label="Menu"><span>Menu</span></Link>
        {isToggled && (
             <div className='absolute w-2xs top-20 right-0 p-2 m-3  bg-black bg-opacity-70 text-white'>
                <ul>
                    <li><Link href={'/about'}>Know Me</Link></li>
                    <li><Link href={'/about'}>My Services</Link></li>
                    <li><Link href={'/about'}>My Work</Link></li>
                    <li>
                      <Link href={'/about'}>Free Tools</Link>
                        <ul>
                          <li><Link href={'/webaudit'}>Auditify</Link></li>
                          <li><Link href={'/stepper'}>Stepper</Link></li>
                        </ul>
                    </li>
                    <li><Link href={'/contact'}>Contact Me</Link></li>

                </ul>
            </div>
        )}
        
    </div>
  </header>

    )


}
