"use client";

import React, { useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';




interface Review {
  title: string;
  message: string;
}

const reviews: Review[] = [
  { title: "Excellent Work", message: "Pradipta delivered high-quality work on time. Highly recommended!" },
  { title: "Great Collaboration", message: "Professional and skilled developer. Made the process smooth." },
  { title: "Outstanding Results", message: "The website looks amazing and performs perfectly." },
  { title: "Reliable Partner", message: "Always available and delivers beyond expectations." },
  { title: "Top Notch", message: "Best developer I've worked with. Will hire again." },
  { title: "Impressive Skills", message: "Transformed our vision into reality seamlessly." },
  { title: "Fantastic Service", message: "Quick response and excellent communication." },
  { title: "Highly Skilled", message: "Expert in modern web technologies and best practices." },
  { title: "Great Value", message: "Quality work at competitive rates." },
  { title: "Professional", message: "Delivered exactly what was promised." }
];

export default function ReviewSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidethreeBG = {
        backgroundImage: 'url("/slide_bg_2.png")',
        backgroundSize: "100%", // Optional: Adjust as needed
        backgroundPosition: "top center", // Optional: Adjust as needed
        backgroundRepeat: "no-repeat", 
        
      };

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
   
     const tlReview = gsap.timeline({
        defaults:{
            duration:"2s"
        }
        });
        tlReview.to(".rating-cont canvas",{scale:1.2,
          scrollTrigger:{
            trigger: ".reviews-cont",
            start: 'top top',
            scrub: true,
            markers: false,
            pin: false,
            
          }
        })

  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    fade: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 350,
        settings: {
           slidesToShow: 1,
           slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
           slidesToShow: 2,
           slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      },
      {
        breakpoint: 1440,
        settings: {
           slidesToShow: 2,
           slidesToScroll: 1,
          arrows: false,
          dots: true
        }
      }
    ]
  };

  return (
    <section className="reviews-cont pb-25" style={slidethreeBG}>
    <div ref={sliderRef} className="review-slider-container relative mx-auto px-9 py-9">
       
      <div className="why-head pb-13">
        <h2 className="mb-12">What Clients Say</h2>
      </div>
       <div className='w-screen container'>

      <Slider {...settings} className="review-slider pb-25">
        {reviews.map((review, index) => (
          <div key={index} className="review-slide px-4 pb-25">
            <div className="review-card bg-white shadow-2xl rounded-xl p-6 max-w-lg mx-auto">
              <h5 className="text-xl font-semibold mb-10 text-gray-800">{review.title}</h5>
              <p className="text-gray-600 mb-10 leading-relaxed">{review.message}</p>
            </div>
          </div>
        ))}
      </Slider>
      </div>
      <div className="h-80 overflow-hidden w-full mask-b-from-1 absolute bottom-0 -z-1">
          <Image src={'globe-bg.svg'} width={1920} height={800} alt="blog-image"></Image>
        </div>  
        </div>
      </section>
  );
}