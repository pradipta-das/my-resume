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



  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section className="reviews-cont w-dvw pb-25 mt-15 overflow-hidden relative" style={slidethreeBG}>
    <div ref={sliderRef} className="slider-container max-w-7xl review-slider-container relative mx-auto px-9 py-9">
       
      <div className="why-head pb-13">
        <h2 className="mb-12">What Clients Say</h2>
      </div>
     

      <div className="review-slider flex-1/2 pb-25">
      
      <Slider {...settings}>
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
     </div>
      <div className="h-120 overflow-hidden max-w-7xl mask-b-from-1 absolute bottom-40 left-0 right-0 m-auto -z-1">
          <Image src={'globe-bg.svg'} width={1920} height={800} alt="blog-image"></Image>
        </div>  
         <div className="w-80 p-8 text-center m-auto  align-middle border border-black cta-btn">Connect with me</div>
      </section>
  );
}