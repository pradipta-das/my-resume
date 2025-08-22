import Link from 'next/link';
import React, { useState } from 'react';

export default function SiteHead(){

    const [isToggled,setIsToggled] = useState(false);

    const toggleMenu = () => {
        setIsToggled(!isToggled)
        console.log(isToggled);
    }


    return(

  <header className="header-sec w-dvw py-1 px-1">
    <div className="container relative mx-auto px-9 py-9">
        <Link className="float-left site-logo font-[--font-playfair] font-bold text-[1rem]" href="#" aria-label="logo">pradipta.online</Link>
        <Link className="float-right menu-btn" onClick={toggleMenu} href="#" aria-label="Menu"><span>Menu</span></Link>
        {isToggled && (
             <div className='absolute right-0 p-2 m-3'>
                submenu
            </div>
        )}
        
    </div>
  </header>

    )


}
