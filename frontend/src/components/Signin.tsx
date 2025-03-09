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

      <div className="w-full max-w-6xl bg-white rounded-xl overflow-hidden flex flex-col md:flex-row shadow-lg relative z-10">
        {/* Left side - Form */}
        <LeftSideForm type='signin'/>
        
        {/* Right side - Image slider */}
        <RightSideImg currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} setBgColor={setBgColor}/>
      </div>
    </div>
  );
}