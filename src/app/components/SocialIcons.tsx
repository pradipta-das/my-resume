import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {fetchSiteOptions} from '../lib/wordpress';

interface SocialLink {
  social_key: number;
  social_name: string;
  social_link: string;
  social_icon: string;
}

export default function SocialIcons(){
const [socialIcon, setSocialicon] = useState<SocialLink[]>([]);

const fetchSettings = async () =>{

    try {
      const data = await fetchSiteOptions();
    
      setSocialicon(data.social_links || []);



      
    } catch (error) {
    
      console.error('Failed to fetch site settings:', error);
      // Set default values or handle error
     
    }

  }

  fetchSettings();

    return(
     <ul className="grid social-icons grid-cols-4">
         {socialIcon.map((social) => (

             <li key={social.social_key}>
              <Link href={social.social_link}>
                <Image className="relative transition-all hover:scale-125 hover:fill-white" src={social.social_icon} height={40} width={40} alt={social.social_name}></Image>
              </Link>
              </li> 

         )


         )}

         
          </ul>


    );
}