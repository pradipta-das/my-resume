'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { fetchBlogPosts } from '../lib/wordpress';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  featured_image_url: string;
}

export default function WordPressBlogPostsSimple() {
  const slidethreeBGFixed = {
        backgroundImage: 'url("/slide_bg_2.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "repeat", 
        backgroundAttachment: "fixed"
      };
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const blogSlideRef = useRef<HTMLDivElement>(null);
  const blogListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlogPosts(1, 6); // Fetch first 6 posts
        setPosts(data.posts);
      } catch (err) {
        setError('Failed to fetch blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useGSAP(() => {
    if (posts.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    
    

    const blogListInit:HTMLElement[] = gsap.utils.toArray(".blog-cont li");
    const spacer = 5;
    const minScale = 0.5;

    const distributor = gsap.utils.distribute({ base: minScale, amount: 0.2 });

    blogListInit.forEach((servElem:HTMLElement,index)=>{
      
    const scaleVal = distributor(index, blogListInit[index], blogListInit);
  
     gsap.to(servElem, {
      scrollTrigger: {
        trigger: servElem,
        start: 'top top',
        scrub: true,
        markers: false,
        invalidateOnRefresh: true
      },
      ease: "none",
      scale: scaleVal,
      filter:"blur(0.5rem)"
      });

      ScrollTrigger.create({
        trigger: servElem,
        start: `top-=${index * spacer} top`,
        endTrigger: '.blog-list-cont',
        end: `bottom top+=${250 + (blogListInit.length * spacer)}`,
        pin: false,
        pinSpacing: false,
        markers: false,
        id: 'pin',
        invalidateOnRefresh: true,
      });

    })

    if (blogSlideRef.current && blogListRef.current) {
      //const blogContainer = blogSlideRef.current;
      const blogList = blogListRef.current;
     
      // Get the total height of the list
      const listHeight = blogList.scrollHeight;
      // Get the container height
      //const containerHeight = blogContainer.offsetHeight;
      // Calculate the maximum scroll distance
      const maxScroll = listHeight;

      // Create the scroll trigger
      ScrollTrigger.create({
        trigger: '.blog-cont',
        start: "top top",
        end: () => `+=${maxScroll}`,
        markers: false,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {

          // Move the list based on scroll progress
          const y = -self.progress * maxScroll;
          gsap.set(blogList, { y });
        }
      });
    }
  }, { dependencies: [posts] });

  if (loading) {
    return (
      <div className="grid">
        <ul>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <li key={item}><div className="why-points animate-pulse bg-gray-200"></div></li>
        ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid">
        <div className="col-span-4 text-center py-4 text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

     

  return (
     <section className="blog-cont h-dvh" style={slidethreeBGFixed}> 
           <div className="px-9">
        
        <div className="why-head mb-25 mt-20">
        <h2 className='w-full block'>Insights</h2>
          </div>
          </div>
    <div className="blog-list-cont py-20" ref={blogSlideRef}>
      <div className="relative h-screen">
        <ul ref={blogListRef} className="absolute top-0 left-0 w-full">
          {posts.map((post) => (
            <li key={post.id} className="mb-4">
              <Link
                href={`/blog/${post.slug}`}
                className="why-points relative overflow-hidden transition-all duration-300 scale-75 block"
              >
                {post.featured_image_url ? (
                  <div className="h-dvh w-full">
                    <Image
                      src={post.featured_image_url}
                      width={1920}
                      height={1080}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm line-clamp-2">{post.title}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-end">
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-3">{post.title}</h3>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
     
      {posts.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No blog posts available at the moment.
        </div>
      )}
    </div>
    <div className="blog-img absolute -left-60 -z-1" data-lag='.1'>
          <Image src={'chart-up.svg'} width={800} height={800} alt="blog-image"></Image>
        </div>
    </section>
  );
}