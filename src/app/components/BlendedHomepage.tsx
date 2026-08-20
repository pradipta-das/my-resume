"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { imageSequence } from "../utils/imageSequence";
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
  { id: 1, folderName: "timeline-1", frameCount: 148, aspectRatio: "1:1" },
  { id: 2, folderName: "timeline-1", frameCount: 148, aspectRatio: "1:1" },
  { id: 3, folderName: "timeline-1", frameCount: 148, aspectRatio: "1:1" },
  { id: 4, folderName: "timeline-1", frameCount: 148, aspectRatio: "1:1" },
   { id: 5, folderName: "timeline-1", frameCount: 148, aspectRatio: "1:1" },
    { id: 6, folderName: "timeline-1", frameCount: 148, aspectRatio: "1:1" },
     { id: 7, folderName: "timeline-1", frameCount: 148, aspectRatio: "1:1" }
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

  canvas.width = 600;
  canvas.height = 600;

  const urls: string[] = [];
  let absoluteIndex = 0;

  SECTIONS_CONFIG.forEach((section) => {
    sectionStartIndices.current.push(absoluteIndex);
    for (let i = 1; i <= section.frameCount; i++) {
      urls.push(`/sequences/${section.folderName}/Timeline 1_${i.toString().padStart(4, "0")}.webp`);
      frameToSectionMap.current[absoluteIndex] = section;
      absoluteIndex++;
    }
  });

  const totalFrames = urls.length;
  const totalTimelineDuration = 50;
  const mm = gsap.matchMedia(masterContainerRef);

  let sequenceTween: gsap.core.Tween | null = null;

  mm.add(
    { isDesktop: "(min-width: 1024px)", isMobile: "(max-width: 1023px)" },
    (contextData) => {
      const { isDesktop } = contextData.conditions as { isDesktop: boolean };

      
      const drawEngine = (frame: number, activeImg: HTMLImageElement) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const currentSection = frameToSectionMap.current[frame];
        //console.log(frame, activeImg.src, currentSection?.id);
        if (!activeImg || !currentSection) return;

        const drawFrame = (img: HTMLImageElement, section: SectionData, alpha: number) => {
          context.save();
          context.globalAlpha = alpha;

          if (section.aspectRatio === "16:9") {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
          } else {
           /* const size = Math.min(img.width, img.height);
            const sourceX = (img.width - size) / 2;
            const sourceY = (img.height - size) / 2;

            const targetHeight = isDesktop ? canvas.height : canvas.width;
            const targetWidth = isDesktop ? canvas.height : canvas.width;
            const targetX = (canvas.width - targetWidth) / 2;
            const targetY = (canvas.height - targetHeight) / 2;

            context.drawImage(img, sourceX, sourceY, size, size, targetX, targetY, targetWidth, targetHeight);
            */
           
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

          }

          context.restore();
          
        };

        const currentSectionConfigIndex = SECTIONS_CONFIG.findIndex(s => s.id === currentSection.id);
        const currentSectionStart = sectionStartIndices.current[currentSectionConfigIndex];
        const currentSectionEnd = currentSectionStart + currentSection.frameCount - 1;
        const fadeWindow = 8;

        if (frame >= currentSectionEnd - fadeWindow && currentSectionConfigIndex < SECTIONS_CONFIG.length - 1) {
          const mixProgress = (frame - (currentSectionEnd - fadeWindow)) / fadeWindow;
          drawFrame(activeImg, currentSection, 1 - mixProgress);
        } else {
          drawFrame(activeImg, currentSection, 1.0);
        }
      };

      // 🚀 1. CREATE A TRUE, NATIVE MASTER TIMELINE
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: masterContainerRef.current,
          start: "top top",
          end: "+=4000",
          scrub: 0.5,
          pin: true,
          onUpdate: ()=>{
            //console.log('works');
          }
         /* enabled: isLoaded,
          snap: {
            snapTo: [0, 0.25, 0.50, 0.75, 1.0],
            duration: { min: 0.2, max: 0.5 },
            delay: 0.1,
            ease: "power1.out"
          }*/
        }
      });

      // 🚀 2. CALL IMAGESEQUENCE WITHOUT ITS OWN SCROLLTRIGGER
      // We pass the scrollTrigger as null so it doesn't try to pin independently
      sequenceTween = imageSequence({
        canvas: canvas,
        urls: urls,
        clear: false,
        paused: false,
        scrollTrigger: null, // Left to the master timeline instead
        onImageLoad: (loaded, total) => {
          const currentPercent = Math.round((loaded / total) * 100);
          setLoadingProgress(currentPercent);

          if (loaded === total) {
            gsap.to("#loading-screen", {
              opacity: 0,
              duration: 0.5,
              onComplete: () => setIsLoaded(true)
            });
          }
        },
        onUpdate: (frame, img) => {
            
          drawEngine(frame, img);
        }
      });

      console.log(sequenceTween);

      if (!sequenceTween) return;

      // 🚀 3. ADD THE IMAGE TWEEN TO THE MASTER TIMELINE
      // This maps the image scrubbing cleanly from time 0 to 10
      masterTimeline.add(sequenceTween, 0);
      // ensure the sequence tween spans the same logical duration
      // as the master timeline so scrubbing maps correctly
      try {
        sequenceTween.duration(totalTimelineDuration);
      } catch (e) {
        // ignore if tween can't be resized
      }

      // 🚀 4. ALL .fromTo(), .set(), and .to() METHODS WORK PERFECTLY NOW
      if (isDesktop) {
        masterTimeline.fromTo(canvas, { xPercent: 0, yPercent:0 }, { xPercent: -100, yPercent: -35, duration: 1.5, ease: "power2.inOut" },6);
      }

      let accumulatedFrames = 0;
      SECTIONS_CONFIG.forEach((section, index) => {
        const sectionStartPos = (accumulatedFrames / totalFrames) * totalTimelineDuration;
        accumulatedFrames += section.frameCount;
        const sectionEndPos = (accumulatedFrames / totalFrames) * totalTimelineDuration;
        const sectionDuration = sectionEndPos - sectionStartPos;

        const targetRef = [sec1Ref, sec2Ref, sec3Ref, sec4Ref, sec5Ref,sec6Ref, sec7Ref][index].current;
        if (!targetRef) return;

        const elements = targetRef.querySelectorAll("h1, h2, p, button, span");

        if (index === 0) {
          masterTimeline.to(elements, {
            opacity: 0,
            y: -60,
            stagger: 0.1,
            duration: sectionDuration * 0.4,
            ease: "power2.in"
          }, sectionEndPos - (sectionDuration * 0.4));
          masterTimeline.call(() => setActiveSectionId(1), [], 0);
        } else {
          masterTimeline.set(targetRef, { opacity: 1 }, sectionStartPos);
          masterTimeline.fromTo(elements,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.15, duration: sectionDuration * 0.3, ease: "power2.out" },
            sectionStartPos
          );

          if (index < SECTIONS_CONFIG.length - 1) {
            masterTimeline.to(targetRef, {
              opacity: 0,
              y: -60,
              duration: sectionDuration * 0.3,
              ease: "power2.in"
            }, sectionEndPos - (sectionDuration * 0.3));
          }
          masterTimeline.call(() => setActiveSectionId(index + 1), [], sectionStartPos);
        }
      });
    }
  );

  return () => {
    mm.revert();
    if (sequenceTween) {
      sequenceTween.kill();
    }
  };

  
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
          
          <canvas ref={canvasRef} className="absolute z-10 bottom-10 max-h-1/2 max-w-screen object-contain" />

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

