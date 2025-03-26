import React from 'react';

export const AdTaskLanding = () => {
  return (
    <div className="relative h-screen w-full bg-gray-900 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 w-full h-full" 
           style={{
             backgroundImage: 'linear-gradient(rgba(50, 50, 70, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(50, 50, 70, 0.2) 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             backgroundPosition: 'center center'
           }}>
      </div>
      
      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center text-white">
        {/* Transform text */}
        <div className="bg-gray-800 bg-opacity-50 py-2 px-6 rounded-full mb-16 flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3L21 8L16 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 21L3 16L8 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 8H13C7.47715 8 3 12.4772 3 18V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="uppercase tracking-wider text-sm font-medium">Transform your digital presence with AI agents</span>
        </div>
        
        {/* Main Logo with Triangular Spotlight */}
        <div className="relative mb-16">
          {/* Triangular Spotlight */}
          <div 
  className="absolute left-1/2 transform -translate-x-1/2 -z-10"
  style={{
    width: '150vw',  // Very wide to ensure coverage
    height: '100vh', // Full viewport height
    top: '0',        // Start from the very top
    background: 'linear-gradient(to bottom, rgba(100, 100, 200, 0.20) 0%, rgba(70, 70, 150, 0.15) 40%, rgba(40, 40, 100, 0.08) 70%, transparent 100%)',
    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
    filter: 'blur(40px)' // Diffused effect
  }}
></div>
          
          {/* Logo Text */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
            <span className="text-white">ad</span>
            <span className="text-white">Task</span>
            <span className="text-white">.ai</span>
          </h1>
        </div>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl max-w-3xl mb-16">
          Stop struggling with marketing decisions. Our AI assistant analyzes your business, creates personalized strategies, and helps you execute them - all in real-time.
        </p>
        
        {/* CTA Button */}
        <div className="mb-12">
          <button className="bg-gray-500 bg-opacity-50 hover:bg-opacity-70 text-white font-medium py-3 px-8 rounded-full transition-all">
            Free Trial Coming Soon
          </button>
        </div>
        
        {/* Contact Link */}
        <a href="#" className="text-gray-400 hover:text-white transition-colors">
          Contact us to know more
        </a>
      </div>
    </div>
  );
};

export default AdTaskLanding;