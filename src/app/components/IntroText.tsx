import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function IntroText(){

    const headRef= useRef(null);
    const intCont = useRef(null);

    useEffect(() => {
        const typed = new Typed(headRef.current, {
            strings: ['Let\'s get into codes now.'],
            typeSpeed: 50,
            showCursor: false
          });
       
      
          return () => {
            // Destroy Typed instance during cleanup to stop animation
            typed.destroy();
           
          };
    },[])

    useEffect(() => {
        const typedintro = new Typed(intCont.current,{
            //strings: ['', '',''],
            strings: ['console.log("Hello World.");<br>let resume="";<br>resume = "Frontend";<br>resume.concat(" ","Backend");'],
            typeSpeed: 50,
            showCursor: false,
            onComplete: (self) => {
                console.log('works');
                //window.scrollTo({top:1000, behavior:'smooth'})

            },
        })
        return () => {
            // Destroy Typed instance during cleanup to stop animation
           
            typedintro.destroy();
          };

    },[])


    return(
        <div className="">
            <h1 className='first-name w-full font-normal text-[2rem]' ref={headRef}></h1>
            <p className='last-name w-full font-light text-[1rem] min-h-[1rem]' ref={intCont}></p>
          
            <h5 className='title w-full  font-light text-3xl opacity-0 mt-2.5'>A Fullstack [CMS] Developer's Story</h5>

            <button onClick={() => { alert('works');}}>Scroll Now</button>
        </div>
    )
}
