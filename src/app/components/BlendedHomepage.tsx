"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingScreen from "./LoadingScreen";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SectionData {
  id: number;
  folderName: string;
  frameCount: number;
  aspectRatio: "16:9" | "1:1";
}

const SECTIONS_CONFIG: SectionData[] = [
  { id: 1, folderName: "hero", frameCount: 10, aspectRatio: "16:9" },
  { id: 2, folderName: "hero", frameCount: 10, aspectRatio: "1:1" },
  { id: 3, folderName: "hero", frameCount: 10, aspectRatio: "1:1" },
  { id: 4, folderName: "hero", frameCount: 10, aspectRatio: "1:1" },
   { id: 5, folderName: "hero", frameCount: 10, aspectRatio: "1:1" },
    { id: 6, folderName: "hero", frameCount: 10, aspectRatio: "1:1" },
     { id: 7, folderName: "hero", frameCount: 10, aspectRatio: "1:1" }
];

export default function FinalSnappingHomepage() {
  const masterContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollnavRef = useRef<HTMLDivElement | null>(null);
  
  const sec1Ref = useRef<HTMLDivElement | null>(null);
  const sec2Ref = useRef<HTMLDivElement | null>(null);
  const sec3Ref = useRef<HTMLDivElement | null>(null);
  const sec4Ref = useRef<HTMLDivElement | null>(null);
  const sec5Ref = useRef<HTMLDivElement | null>(null);
  const sec6Ref = useRef<HTMLDivElement | null>(null);
  const sec7Ref = useRef<HTMLDivElement | null>(null);

  const globalTrack = useRef({ frameIndex: 0 });
  const [activeSectionId, setActiveSectionId] = useState<number>(1);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const frameToSectionMap = useRef<{ [key: number]: SectionData }>({});
  const sectionStartIndices = useRef<number[]>([]);

  useEffect(() => {
    if (!masterContainerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1000;
    canvas.height = 400;

    const masterImagePool: HTMLImageElement[] = [];
    let absoluteIndex = 0;
    const totalFrames = SECTIONS_CONFIG.reduce((acc, s) => acc + s.frameCount, 0);
    let loadedCount = 0;

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const currentIndex = globalTrack.current.frameIndex;
      const currentImg = masterImagePool[currentIndex];
      const currentSection = frameToSectionMap.current[currentIndex];



      if (!currentImg || !currentImg.complete || !currentSection) return;

      //console.log(currentIndex, currentImg.src);

      const drawFrameToCanvas = (img: HTMLImageElement, section: SectionData, alpha: number) => {
        context.save();
        context.globalAlpha = alpha;
        const isDesktopWindow = window.innerWidth >= 1024;
        //console.log(img.src);

        if (section.aspectRatio === "16:9") {
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else {
          
          
          const size = Math.min(img.width, img.height);
          console.log(`Drawing ${img.src} with size ${size} and alpha ${alpha}`);
          const sourceX = (img.width - size) / 2;
          const sourceY = (img.height - size) / 2;

          const targetHeight = isDesktopWindow ? canvas.height : canvas.width;
          const targetWidth = isDesktopWindow ? canvas.height : canvas.width;
          const targetX = (canvas.width - targetWidth) / 2;
          const targetY = (canvas.height - targetHeight) / 2;

          context.drawImage(img, sourceX, sourceY, size, size, targetX, targetY, targetWidth, targetHeight);
        }
        context.restore();
      };

      const currentSectionConfigIndex = SECTIONS_CONFIG.findIndex(s => s.id === currentSection.id);
      const currentSectionStart = sectionStartIndices.current[currentSectionConfigIndex];
      const currentSectionEnd = currentSectionStart + currentSection.frameCount - 1;
      const fadeWindow = 0; 

      //drawFrameToCanvas(currentImg, currentSection, 1.0);

      if (currentIndex >= currentSectionEnd - fadeWindow && currentSectionConfigIndex < SECTIONS_CONFIG.length - 1) {
        const framesIntoFade = currentIndex - (currentSectionEnd - fadeWindow);
        const mixProgress = framesIntoFade / fadeWindow;
        const nextImg = masterImagePool[currentSectionEnd + 1];
        const nextSection = SECTIONS_CONFIG[currentSectionConfigIndex + 1];

        drawFrameToCanvas(currentImg, currentSection, 1 - mixProgress);
        if (nextImg && nextImg.complete) {
          drawFrameToCanvas(nextImg, nextSection, mixProgress);
        }
      } else {
        drawFrameToCanvas(currentImg, currentSection, 1.0);
      }
    };

    const handleImageLoad = () => {
      loadedCount++;
      setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));

      if (loadedCount === totalFrames) {
        gsap.to("#loading-screen", {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setIsLoaded(true);
            render();
          }
        });
      }
    };

    SECTIONS_CONFIG.forEach((section) => {
      sectionStartIndices.current.push(absoluteIndex);
      for (let i = 1; i <= section.frameCount; i++) {
        const img = new Image();
        img.src = `/sequences/${section.folderName}/Timeline 1_${i.toString().padStart(4, "0")}.webp`;
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad;
        masterImagePool.push(img);
        frameToSectionMap.current[absoluteIndex] = section;
        absoluteIndex++;
      }
    });

    const SECTION_TIMES = [
    { section: 1, time: 0 },
    { section: 2, time: 5 },
    { section: 3, time: 10 },
    { section: 4, time: 15 },
    { section: 5, time: 20 },
    { section: 6, time: 25 },
    { section: 7, time: 30 },
    ];

    function getSectionFromTimeline(time) {
        for (let i = SECTION_TIMES.length - 1; i >= 0; i--) {
            if (time >= SECTION_TIMES[i].time) {
            return SECTION_TIMES[i].section;
            }
        }

        return 1;
    }

    const mm = gsap.matchMedia(masterContainerRef);
    mm.add(
      { isDesktop: "(min-width: 1024px)", isMobile: "(max-width: 1023px)" },
      (contextData) => {
        const { isDesktop } = contextData.conditions as { isDesktop: boolean };
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: masterContainerRef.current,
            start: "top top",
            end: "+=4000",
            scrub: 0.5,
            pin: true,
            //markers: true,
            onUpdate: () => {
                const section = getSectionFromTimeline(mainTl.time());

                setActiveSectionId((prev) => {
                    if (prev === section) {
                        return prev;
                    }

                    return section;
                });

                render();
            },
            //enabled: isLoaded,
            // 🚀 INTEGRATED NATIVE SCROLL SNAPPING
            // Array dictates incremental timeline decimal break snap thresholds (0% -> 25% -> 50% -> 75% -> 100% Footer)
           /* snap: {
              snapTo: [0, 0.25, 0.50, 0.75, 1.0],
              duration: { min: 0.3, max: 0.7 }, // How fast it snaps into place
              delay: 0.15,                     // Delay in seconds after scrolling stops before snap activates
              ease: "power2.out"               // Smooth slowdown easing
            }*/
          }
        });

        mainTl.to(globalTrack.current, {
          frameIndex: totalFrames - 1,
          snap: "frameIndex",
          ease: "none",
          duration: 35,
          onUpdate: () => {
            //console.log(totalFrames, globalTrack.current.frameIndex, Math.round(totalFrames/30));
          }
        }, 0);

        // As Section 1 rolls out and Section 2 rolls in (between timeline marks 1.5 and 2.5),
        // we smoothly slide the entire canvas element left by 25% of its width.
        if (isDesktop) {
        mainTl.fromTo(canvasRef.current, 
            { xPercent: 0 }, 
            { xPercent: -25, duration: 1, ease: "power2.inOut" }, 
           2.5
        );
        }

       // --- HERO TEXT 1 (Appears immediately at 0, exits at 0.6) ---
      mainTl.to(".hero-phrase-1", { opacity: 0, y: -40, duration: 0.1, ease: "power2.in" }, 2);

        /*  // --- HERO TEXT 2 (Enters at 0.8, exits at 1.4) ---
        mainTl.fromTo(".hero-phrase-2", 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 
        .2
        ).to(".hero-phrase-2", 
        { opacity: 0, y: -40, duration: 0.4, ease: "power2.in" }, 
        .4
        );

        // --- HERO TEXT 3 (Enters at 1.6, exits at 2.2) ---
        mainTl.fromTo(".hero-phrase-3", 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 
        .6
        ).to(".hero-phrase-3", 
        { opacity: 0, y: -40, duration: 0.4, ease: "power2.in" }, 
        .8
        );

        mainTl.fromTo(".hero-phrase-4", 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 
        1
        ).to(".hero-phrase-4", 
        { opacity: 0, y: -40, duration: 0.4, ease: "power2.in" }, 
        1.2
        );

        mainTl.fromTo(".hero-phrase-5", 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 
       1.4
        ).to(".hero-phrase-5", 
        { opacity: 0, y: -40, duration: 0.4, ease: "power2.in" }, 
        1.6
        );
*/
        // Maintain active section state trackers
        mainTl.call(() => setActiveSectionId(1), [], 0);

        
        mainTl.set(sec2Ref.current, { opacity: 1 }, 5);
        mainTl.fromTo(sec2Ref.current?.querySelectorAll("span,h2,h3, p,a") || [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.1, duration: .5, ease: "power2.out" },
        5.5
        ).to(sec2Ref.current, { opacity: 0, y: -60, duration: .3, ease: "power2.in" }, 10)
        .call(() => setActiveSectionId(2), [], 5);

        mainTl.set(sec3Ref.current, { opacity: 1 }, 10);
        mainTl.fromTo(sec3Ref.current?.querySelectorAll("span,h2,h3, p,a") || [],
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: "power2.out" },
        10.5
        ).to(sec3Ref.current, { opacity: 0, y: -60, duration: 1, ease: "power2.in" }, 15)
        .call(() => setActiveSectionId(3), [], 10);

        mainTl.set(sec4Ref.current, { opacity: 1 }, 15);
        mainTl.fromTo(sec4Ref.current?.querySelectorAll("span,h2,h3, p,a") || [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.18, duration: 1.2, ease: "power2.out" },
        15.5
        ).to(sec4Ref.current, { opacity: 0, y: -60, duration: 1, ease: "power2.in" }, 20)
        .call(() => setActiveSectionId(4), [], 15);

        mainTl.set(sec5Ref.current, { opacity: 1 }, 20);
        mainTl.fromTo(sec5Ref.current?.querySelectorAll("span,h2,h3, p,a") || [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.18, duration: 1.2, ease: "power2.out" },
        20.5
        ).to(sec5Ref.current, { opacity: 0, y: -60, duration: 1, ease: "power2.in" }, 25)
        .call(() => setActiveSectionId(5), [], 20);

        mainTl.set(sec6Ref.current, { opacity: 1 }, 25);
        mainTl.fromTo(sec6Ref.current?.querySelectorAll("span,h2,h3, p,a") || [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.18, duration: 1.2, ease: "power2.out" },
        25.5
        ).to(sec6Ref.current, { opacity: 0, y: -60, duration: 1, ease: "power2.in" }, 30)
        .call(() => setActiveSectionId(6), [], 25);

        mainTl.set(sec7Ref.current, { opacity: 1 }, 30);
        mainTl.fromTo(sec7Ref.current?.querySelectorAll("span,h2,h3, p,a") || [],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.18, duration: 1.2, ease: "power2.out" },
        30.5
        )
        .call(() => setActiveSectionId(7), [], 30);

      }
    );

    return () => mm.revert();
  }, [isLoaded]);

  const handleNavClick = (sectionIndex: number) => {
    if (!masterContainerRef.current || !isLoaded) return;
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: masterContainerRef.current,
      start: "top top",
      end: "bottom bottom"
    });
    const startScroll = scrollTriggerInstance.start;
    const totalScrollDist = scrollTriggerInstance.end - startScroll;
    const targetScrollPosition = startScroll + (totalScrollDist * (sectionIndex / SECTIONS_CONFIG.length));

    window.scrollTo({ top: targetScrollPosition + 15, behavior: "smooth" });
    scrollTriggerInstance.kill();
  };

  return (
    <>
      {!isLoaded && <LoadingScreen progress={loadingProgress} />}
       
      {/* Nav Sidebar Tracker */}
       <div ref={scrollnavRef} className="opacity-100">
      <nav className={`hidden fixed right-6 top-1/2 z-50 -translate-y-1/2 border-r-[1px] border-black md:flex flex-col gap-2  transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {SECTIONS_CONFIG.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => handleNavClick(idx)}
            className={`w-10 h-5 bg-transparent ${activeSectionId === idx ? '' : ' relative transition-all duration-300'}`}
          ><div className="flex flex-col text-left justify-between text-[.7rem] font-bold relative w-full h-full">
            {activeSectionId === section.id && '0' + section.id}
           
            <div className={`absolute  h-[1px] top-0 right-0 transition-all duration-300 ${activeSectionId === section.id ? "bg-black w-10" : "w-5 bg-black"}`}></div>
          </div>
          </button>
        ))}
      </nav>
      </div>

      {/* Main Track Viewport Wrapper */}
      <div ref={masterContainerRef} className="relative bg-[#f8f6f2] h-auto overflow-hidden">
        <div className="sticky top-0 flex h-screen w-screen items-center justify-center overflow-hidden px-4 md:px-12">
          
          <canvas ref={canvasRef} className="absolute z-10 bottom-10 max-h-screen max-w-screen object-contain" />

          {/* SECTION 1: HERO LAYOUT (1 Col, 2 Rows) */}
          <div 
            ref={sec1Ref} 
            className="absolute z-30 max-w-3xl w-full top-50 flex items-center justify-center text-center text-black mix-blend-difference pointer-events-none"
            >
            {/* PHRASE 1: Visible immediately on page load */}
            <div className="hero-phrase-1 absolute flex flex-col items-center justify-center px-4 will-change-transform">
                <h1 className="text-4xl md:text-7xl font-normal tracking-tight mb-4"><span className="text-9xl">Hi!</span><br></br>Glad you are here.</h1>
               
            </div>

            {/* PHRASE 2: Hidden initially, scrolls into place second */}
            <div className="hero-phrase-2 absolute flex flex-col items-center justify-center px-4 will-change-transform opacity-0">
                <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4">Glad you are here.</h2>
             
            </div>

            {/* PHRASE 3: Hidden initially, scrolls into place third */}
            <div className="hero-phrase-3 absolute flex flex-col items-center justify-center px-4 will-change-transform opacity-0">
                <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4">Want to know about me?</h2>
                
            </div>
             <div className="hero-phrase-4 absolute flex flex-col items-center justify-center px-4 will-change-transform opacity-0">
                <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4">Well I can tell you...</h2>
                
            </div>
             <div className="hero-phrase-5 absolute flex flex-col items-center justify-center px-4 will-change-transform opacity-0">
                <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4">I am a little bit of YOU.</h2>
                
            </div>
            </div>

          {/* SECTION 2: DESIGN LAYOUT (2 Cols Split) */}
          <div ref={sec2Ref} className="absolute z-40 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 text-[--text-color] mix-blend-difference opacity-0">
            <div className="flex flex-col justify-center text-center md:text-left"></div>
            <div className="flex flex-col justify-center text-center md:text-left p-5">
              <span className="text-[0.9em] text-[--text-color] font-bold mb-2">Chapter I - The Seed</span>
              <h2 className="text-4xl md:text-5xl mb-4">Every remarkable website begins long before the first line of code.</h2>
              <h3 className="mb-4">Turning Ideas into Scalable Digital Experiences</h3>
              <p className="mb-4">Every high-performing website starts with a clear idea. As a freelance web developer, I help businesses turn ideas into custom, fast, scalable, and SEO-friendly websites designed to attract users and drive results.</p>
              <p className="mb-4">From Next.js and React web development to WordPress websites, custom web applications, and AI-powered solutions, I build digital experiences focused on performance, usability, search visibility, and business growth.</p>
<Link href="/process" rel="noopener noreferrer" className="mb-4 transition hover:text-[#1a1a1a] hover:underline w-fit">Discover More</Link>
            </div>
          </div>
          <div ref={sec3Ref} className="absolute z-30 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 mix-blend-difference  opacity-0">
            <div className="flex flex-col justify-center text-center md:text-left"></div>
            <div className="flex flex-col justify-center p-5 text-center md:text-left">
               <span className="text-[.85em] text-[--text-color] font-bold mb-2">Chapter 2 - The Fruit</span>
              <h2 className="text-4xl md:text-5xl mb-4">Ideas become blueprints.Blueprints become experiences.</h2>
              <h3 className="mb-4">Designing Websites That Connect Business Goals with User Experience</h3>
              <p className="mb-4">A great website is more than an attractive interface. It is a carefully planned digital experience that guides visitors towards meaningful actions. From information architecture and wireframing to responsive user interface design, every screen is created to improve usability, strengthen your brand, and increase conversions.</p>
              <p className="mb-4">My development process combines user experience (UX), user interface (UI) design principles, accessibility standards, technical SEO, and performance optimization to deliver websites that are intuitive for users and discoverable by search engines.</p>
<Link href="/case-studies" rel="noopener noreferrer" className="mb-4 transition hover:text-[#1a1a1a] hover:underline w-fit">Explore Cases</Link>
            </div>
          </div>
          <div ref={sec4Ref} className="absolute z-30 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 mix-blend-difference  opacity-0">
            <div className="flex flex-col justify-center text-center md:text-left"></div>
            <div className="flex flex-col justify-center text-center p-5 md:text-left">
               <span className="text-[.85em] text-[--text-color] font-bold mb-2">Chapter 3- The Process</span>
              <h2 className="text-4xl md:text-5xl mb-4">Every movement has a purpose. Every section earns its place.</h2>
              <h3 className="mb-4">From Strategy to Deployment — My Website Development Workflow</h3>
              <p className="mb-4">Every successful digital project follows a structured process. I collaborate closely with clients to understand requirements, organize content, define technical architecture, and build scalable web solutions using modern development practices.</p>
              <p className="mb-4">My workflow includes business discovery, wireframing, UI implementation, frontend development, backend integration, testing, accessibility reviews, SEO optimization, performance tuning, and continuous improvement. This structured approach ensures every website is reliable, maintainable, and prepared for future growth.</p>
<Link href="/case-studies" rel="noopener noreferrer" className="mb-4 transition hover:text-[#1a1a1a] hover:underline w-fit">Check Process</Link>
            </div>
          </div>
          <div ref={sec5Ref} className="absolute z-30 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 mix-blend-difference opacity-0">
            <div className="flex flex-col justify-center text-center md:text-left"></div>
            <div className="flex flex-col justify-center text-center p-5 md:text-left">
               <span className="text-[.85em] text-[--text-color] font-bold mb-2">Chapter 4 - The Companion</span>
              <h2 className="text-4xl md:text-5xl mb-4">Human creativity. Artificial intelligence. Better together.</h2>
              <h3 className="mb-4">AI-Assisted Web Development for Faster, Smarter Digital Solutions</h3>
              <p className="mb-4">Artificial Intelligence is changing the way websites are designed, developed, and optimized. Rather than replacing creativity, AI helps automate repetitive tasks, accelerate development, improve code quality, enhance SEO recommendations, and identify opportunities for performance improvements.</p>
              <p className="mb-4">I integrate AI into my workflow to deliver faster development cycles, intelligent website audits, content optimization, accessibility improvements, and scalable digital solutions while ensuring that every project remains guided by human creativity and business objectives.</p>
<Link href="/case-studies" rel="noopener noreferrer" className="mb-4 transition hover:text-[#1a1a1a] hover:underline w-fit">Get Started</Link>
            </div>
          </div>
          <div ref={sec6Ref} className="absolute z-30 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12  mix-blend-difference  opacity-0">
            <div className="flex flex-col justify-center text-center md:text-left"></div>
            <div className="flex flex-col justify-center text-center p-5 md:text-left">
               <span className="text-[.85em] text-[--text-color] font-bold mb-2">Chapter 5- The Cookie Jar</span>
              <h2 className="text-4xl md:text-5xl mb-4">Success isn't measured in projects. It's measured in trust.</h2>
              <h3 className="mb-4">Long-Term Partnerships Built on Quality and Results</h3>
              <p className="mb-4">Behind every completed website is a business that trusted me with its vision. Over the years, I've partnered with agencies, startups, and business owners to deliver reliable web development services focused on quality, performance, and measurable outcomes.</p>
              <p className="mb-4">My goal extends beyond launching websites. I believe in building long-term partnerships by providing ongoing support, website maintenance, technical improvements, SEO enhancements, and continuous optimization that help businesses grow online.</p>
<Link href="/case-studies" rel="noopener noreferrer" className="mb-4 transition hover:text-[#1a1a1a] hover:underline w-fit">Read Success Stories</Link>
            </div>
          </div>
           <div ref={sec7Ref} className="absolute z-30 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 mix-blend-difference opacity-0">
            <div className="flex flex-col justify-center text-center md:text-left"></div>
            <div className="flex flex-col justify-center text-center p-5 md:text-left">
               <span className="text-[.85em] text-[--text-color] font-bold mb-2">Chapter 6 - The Blank Page</span>
              <h2 className="text-4xl md:text-5xl mb-4">Every story begins...with a blank page.</h2>
              <h3 className="mb-4">Let's Build Your Next Website Together</h3>
              <p className="mb-4">Every successful business starts with an idea, and every great website begins with a conversation. Whether you're planning a new website, redesigning an existing platform, improving website performance, or exploring AI-powered digital solutions, I'd love to help bring your vision to life.</p>
              <p className="mb-4">Let's collaborate to build a fast, scalable, SEO-friendly website that not only looks exceptional but also delivers meaningful business results.</p>
<Link href="/case-studies" rel="noopener noreferrer" className="mb-4 transition hover:text-[#1a1a1a] hover:underline w-fit">Calculate Your ROI</Link>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 h-10 w-full rounded-t-3xl text-[#f8f6f2] bg-[#0D0829] ">
            <ul className="flex justify-center items-center h-full gap-4">
                <li className="text-[.85em]  pt-1.5 pb-1.5 border-r-[#f8f6f2] border-r-[1px] pr-3">Total visitors: 1,234</li>
                
                <li className="text-[.85em]  pt-1.5 pb-1.5">Why freelancing is not for everyone</li>
                <li className="text-[1.85em] pt-1.5 pb-1.5 ]"><div className="w-2 h-2 bg-[#f8f6f2] rounded-full"></div></li>
                <li className="text-[.85em]  pt-1.5 pb-1.5">Why online business is the future</li>
                 <li className="text-[1.85em] pt-1.5 pb-1.5 ]"><div className="w-2 h-2 bg-[#f8f6f2] rounded-full"></div></li>
                <li className="text-[.85em]  pt-1.5 pb-1.5">How to choose the right web developer</li>
                 <li className="text-[1.85em] pt-1.5 pb-1.5 ]"><div className="w-2 h-2 bg-[#f8f6f2] rounded-full"></div></li>
                <li className="text-[.85em]  pt-1.5 pb-1.5">Why AI is important for web development</li>
            </ul>
        </div>
    </div>
   
</>
  );
}

