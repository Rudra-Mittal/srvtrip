import ColorThief from "colorthief";
import { testimonials } from "../testimonialsData"
import { useEffect } from "react";
import { motion } from "framer-motion";

interface RightSideImageSliderProps {
    currentSlide: number;
    setCurrentSlide: (index: number | ((prevIndex: number) => number)) => void;
    setBgColor: (color: string) => void;
}

export default function RightSideImg({currentSlide,setCurrentSlide,setBgColor}: RightSideImageSliderProps){ 
    const nextSlide = () => {
        setCurrentSlide((prevSlide: number) => (prevSlide + 1) % testimonials.length);
    };
    
    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + testimonials.length) % testimonials.length);
    };

    // Extract prominent color from image using ColorThief and pass it to the parent
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = testimonials[currentSlide].image;

        img.onload = () => {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 5);
            const vibrantColor = palette[0] || palette[1];
            const color = `rgb(${vibrantColor[0]}, ${vibrantColor[1]}, ${vibrantColor[2]})`;
            setBgColor(color); // Passing the color to the parent component
        };
    }, [currentSlide]);

    return (
        <div 
          className="h-full relative bg-black/80 p-4" 
          style={{
            borderRadius: '40px 0 12px 40px', // Prominent border
            padding: '16px', // Padding around the image
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            boxShadow: 'inset 0 0 0 1px rgba(167, 139, 250, 0.15)' // Updated to lavender
          }}
        >
            {/* Image container with padding */}
            <div 
              className="relative h-full overflow-hidden"
              style={{
                borderRadius: '32px 0 32px 0px', // Same border style for image container
                padding: '10px',
                backgroundColor: 'rgba(15, 23, 42, 0.9)' // Dark background
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <div className="relative h-full">
                    <img
                      src={testimonial.image}
                      alt={testimonial.location}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        borderRadius: '32px 0 32px 0px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/50 flex flex-col justify-end p-8 sm:p-12">
                      <div className="text-white mb-4">
                        {/* Quote Icon with gradient */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                          <defs>
                            <linearGradient id="quoteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#a78bfa" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                          <path d="M14.5 10C14.5 8.3 15.8 7 17.5 7C19.2 7 20.5 8.3 20.5 10C20.5 11.7 19.2 13 17.5 13C17.2 13 17 13 16.8 13C17.3 15.9 18.9 17 22.5 17V19C17.5 19 14.5 16 14.5 10ZM3.5 10C3.5 8.3 4.8 7 6.5 7C8.2 7 9.5 8.3 9.5 10C9.5 11.7 8.2 13 6.5 13C6.2 13 6 13 5.8 13C6.3 15.9 7.9 17 11.5 17V19C6.5 19 3.5 16 3.5 10Z" fill="url(#quoteGradient)"/>
                        </svg>

                        <p className="text-lg sm:text-2xl font-light leading-relaxed mb-4">{testimonial.quote}</p>
                        <h3 className="text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{testimonial.author}</h3>
                        <p className="text-xs sm:text-sm text-blue-200 opacity-90">{testimonial.position}</p>
                        <p className="text-xs sm:text-sm mt-1 text-blue-100 font-medium">📍 {testimonial.location}</p>
                      </div>

                      {/* Buttons with animated gradient borders */}
                      <div className="absolute bottom-6 sm:bottom-9 right-6 sm:right-12 flex space-x-3">
                        <motion.button
                          onClick={prevSlide}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative w-10 h-10 rounded-full flex items-center justify-center text-white overflow-hidden group"
                        >
                          {/* Animated border */}
                          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-lavender-500 via-purple-500 to-lavender-500 opacity-75 group-hover:opacity-100 animate-spin-slow"></span>
                          {/* Dark inner background */}
                          <span className="absolute inset-[1.5px] rounded-full bg-black/80 z-10"></span>
                          {/* Icon */}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-20">
                            <path d="M15 19L8 12L15 5" stroke="url(#navGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <defs>
                              <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a78bfa" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </motion.button>
                        <motion.button
                          onClick={nextSlide}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative w-10 h-10 rounded-full flex items-center justify-center text-white overflow-hidden group"
                        >
                          {/* Animated border */}
                          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-lavender-500 via-purple-500 to-lavender-500 opacity-75 group-hover:opacity-100 animate-spin-slow"></span>
                          {/* Dark inner background */}
                          <span className="absolute inset-[1.5px] rounded-full bg-black/80 z-10"></span>
                          {/* Icon */}
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-20">
                            <path d="M9 5L16 12L9 19" stroke="url(#navGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Indicator with gradient */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
              {testimonials.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide 
                      ? 'w-8 bg-gradient-to-r from-lavender-500 to-purple-500' 
                      : 'w-2 bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                ></div>
              ))}
            </div>
        </div>
    )
}