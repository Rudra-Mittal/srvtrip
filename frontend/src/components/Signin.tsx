import { useState, useEffect } from 'react';
import { testimonials } from '../testimonialsData';
import LeftSideForm from './LeftSideForm';
import RightSideImg from './RightSideImg';

export default function Signin() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgColor, setBgColor] = useState('#000');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
        <div className="min-h-screen flex items-center justify-center p-4 relative "  style={{ backgroundColor: bgColor,transition: 'background-color 0.5s' }}>
        {/* Grid background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Updated container with dark theme */}
            <div className="w-full max-w-6xl bg-black/90 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xl relative z-10"
              style={{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '40px',
                border: '1px solid rgba(59, 130, 246, 0.2)', // Blue border with low opacity
                boxShadow: '0 15px 35px rgba(91, 33, 182, 0.15), 0 2px 10px rgba(59, 130, 246, 0.1)' // Combined purple and blue shadow
              }}
            >
              {/* Left side - Form - will be styled in LeftSideForm component */}
              <LeftSideForm type='signin' />
              
              {/* Right side - Image slider - keeping the same */}
              <RightSideImg currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} setBgColor={setBgColor}/>
            </div>
    </div>
  );
}