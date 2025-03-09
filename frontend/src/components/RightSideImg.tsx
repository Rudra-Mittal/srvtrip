import ColorThief from "colorthief";
import { testimonials } from "../testimonialsData"
import { useEffect } from "react";

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

    return(
        <>
        <div 
          className="w-full md:w-7/12 relative bg-neutral-200 p-4" 
          style={{
            borderRadius: '40px 0 12px 40px', // Prominent border
            padding: '16px', // Padding around the image
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
          }}
        >
            {/* Image container with padding */}
            <div 
              className="relative h-full overflow-hidden"
              style={{
                borderRadius: '32px 0 32px 0px', // Same border style for image container
                padding: '10px',
                backgroundColor: 'white'
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
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-600/30 to-neutral-800/30 flex flex-col justify-end p-12">
                      <div className="text-white mb-4">
                        {/* Quote Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                          <path d="M14.5 10C14.5 8.3 15.8 7 17.5 7C19.2 7 20.5 8.3 20.5 10C20.5 11.7 19.2 13 17.5 13C17.2 13 17 13 16.8 13C17.3 15.9 18.9 17 22.5 17V19C17.5 19 14.5 16 14.5 10ZM3.5 10C3.5 8.3 4.8 7 6.5 7C8.2 7 9.5 8.3 9.5 10C9.5 11.7 8.2 13 6.5 13C6.2 13 6 13 5.8 13C6.3 15.9 7.9 17 11.5 17V19C6.5 19 3.5 16 3.5 10Z" fill="white"/>
                        </svg>

                        <p className="text-2xl font-light leading-relaxed mb-4">{testimonial.quote}</p>
                        <h3 className="text-xl font-semibold">{testimonial.author}</h3>
                        <p className="text-sm opacity-80">{testimonial.position}</p>
                        <p className="text-sm mt-1 opacity-90 font-medium">📍 {testimonial.location}</p>
                      </div>

                      {/* Buttons */}
                      <div className="absolute bottom-9 right-12 flex space-x-2">
                        <button
                          onClick={prevSlide}
                          className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition duration-200 cursor-pointer"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          onClick={nextSlide}
                          className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition duration-200 cursor-pointer"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5L16 12L9 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-1">
              {testimonials.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'
                  }`}
                ></div>
              ))}
            </div>
        </div>
        </>
    )
}
