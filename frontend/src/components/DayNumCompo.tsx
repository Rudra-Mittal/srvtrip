import { useState } from 'react';
import { imageData, itineraryData } from '../sample_Images_itinerary';

export const DayNumCompo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  let currentDay=0;

  // Function to navigate slides
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === imageData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? imageData.length - 1 : prev - 1));
  };
  
  // Function to render the section content
  const renderSectionContent = (section: string, data: { activities: any; food: any; transport: any; cost: any; }) => {
    // All sections will now use the dark theme, we'll just keep a slight variation in the icon background
    const sectionTheme = 
      section === 'morning' ? { 
        iconBg: 'bg-zinc-800'
      } : 
      section === 'afternoon' ? {
        iconBg: 'bg-zinc-800'
      } : {
        iconBg: 'bg-zinc-800'
      };
    
    return (
      <div className="space-y-3">
        {/* Activities - Card style */}
        <div className="rounded-lg overflow-hidden border border-zinc-800 shadow-sm transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1">
          <div className="px-3 py-2 flex items-center justify-between bg-black">
            <div className="flex items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${sectionTheme.iconBg} mr-2`}>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h5 className="font-semibold text-blue-400">Activities</h5>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-900 text-zinc-400">
              {data.cost}
            </span>
          </div>
          <div className="bg-black p-3">
            <p className="text-sm text-zinc-400">{data.activities}</p>
          </div>
        </div>
        
        {/* Food & Transport - Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Food */}
          <div className="rounded-lg overflow-hidden border border-zinc-800 shadow-sm transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1">
            <div className="bg-black px-3 py-2 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 mr-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h5 className="font-semibold text-blue-400">Food & Dining</h5>
            </div>
            <div className="bg-black p-3">
              <p className="text-sm text-zinc-400">{data.food}</p>
            </div>
          </div>
          
          {/* Transport */}
          <div className="rounded-lg overflow-hidden border border-zinc-800 shadow-sm transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1">
            <div className="bg-black px-3 py-2 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 mr-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </div>
              <h5 className="font-semibold text-blue-400">Transportation</h5>
            </div>
            <div className="bg-black p-3">
              <p className="text-sm text-zinc-400">{data.transport}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-300 shadow-xl p-3 md:p-6 flex flex-col h-full bg-black">
      {/* Add global styles for custom scrollbar */}
      <style>{`
        /* Hide default scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
          height: 2px;
          background-color: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #1e40af);
          border-radius: 20px;
          box-shadow: 0 0 6px rgba(59, 130, 246, 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 8px 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #60a5fa, #3b82f6);
          box-shadow: 0 0 8px rgba(96, 165, 250, 0.6);
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.7);
        }
        
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 transparent;
        }
      `}</style>

      {/* Image Slider - Centered with better image display */}
      <div className="flex justify-center w-full mb-5">
        <div className="relative w-4/5 sm:w-3/4 md:w-3/5 aspect-[5/3] overflow-hidden rounded-lg shadow-lg ">
          {imageData.map((image, index) => (
            <div 
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="object-cover w-full h-full bg-gray-100"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pb-8 pt-6 px-3 md:px-4 text-white">
                <h4 className="text-sm md:text-base font-bold">{image.title}</h4>
              </div>
            </div>
          ))}
          
          {/* Slider Controls */}
          <button 
            onClick={prevSlide} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black opacity-60 hover:opacity-80 text-white cursor-pointer p-2 rounded-full transition-all duration-300"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button 
            onClick={nextSlide} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black opacity-60 hover:opacity-80 cursor-pointer text-white p-2 rounded-full transition-all duration-300"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          {/* Indicators - Now placed at the very bottom with enough spacing */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 py-1.5 bg-opacity-40">
            {imageData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-5' : 'bg-white bg-opacity-60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Day Heading with enhanced gradient */}
      <div className="flex items-center justify-center mb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-700 to-transparent flex-grow"></div>
        <h2 className="px-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-950 via-blue-700 to-blue-400 text-lg">Day {currentDay + 1}</h2>
        <div className="h-px bg-gradient-to-r from-transparent via-blue-700 to-transparent flex-grow"></div>
      </div>

      {/* Day content - Scrollable container with custom scrollbar */}
      <div className="w-full flex-1 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 relative">
        {/* Light blue spotlight effect */}
        <div className="absolute -top-10 left-1/4 w-1/2 h-32 bg-blue-600 opacity-[0.03] blur-3xl rounded-full"></div>
      
        <div className="h-[calc(100vh-20rem)] sm:h-[calc(100vh-21rem)] md:h-[calc(100vh-22rem)] custom-scrollbar overflow-y-auto pr-2">
          <div className="p-3 md:p-4 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {/* Morning */}
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                <div className="bg-black px-4 py-2.5 flex items-center justify-between">
                  <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Morning
                  </h3>
                  <div className="bg-zinc-900 text-blue-400 rounded-full px-3 py-0.5 text-sm font-semibold">
                    {itineraryData.days[currentDay].morning.cost}
                  </div>
                </div>
                <div className="p-3 bg-black text-zinc-400">
                  {renderSectionContent('morning', itineraryData.days[currentDay].morning)}
                </div>
              </div>

              {/* Afternoon */}
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                <div className="bg-black px-4 py-2.5 flex items-center justify-between">
                  <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Afternoon
                  </h3>
                  <div className="bg-zinc-900 text-blue-400 rounded-full px-3 py-0.5 text-sm font-semibold">
                    {itineraryData.days[currentDay].afternoon.cost}
                  </div>
                </div>
                <div className="p-3 bg-black text-zinc-400">
                  {renderSectionContent('afternoon', itineraryData.days[currentDay].afternoon)}
                </div>
              </div>

              {/* Evening */}
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                <div className="bg-black px-4 py-2.5 flex items-center justify-between">
                  <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Evening
                  </h3>
                  <div className="bg-zinc-900 text-blue-400 rounded-full px-3 py-0.5 text-sm font-semibold">
                    {itineraryData.days[currentDay].evening?.cost || itineraryData.days[currentDay].afternoon.cost}
                  </div>
                </div>
                <div className="p-3 bg-black text-zinc-400">
                  {renderSectionContent('evening', itineraryData.days[currentDay].evening || itineraryData.days[currentDay].afternoon)}
                </div>
              </div>
            </div>

            {/* Daily Summary Section */}
            <div className="mt-3 pt-2 border-t border-zinc-800">
              <h3 className="font-bold mb-3 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                </svg>
                Daily Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-black rounded-lg p-3 border border-zinc-800 transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-xs text-blue-400 uppercase font-semibold">Total Budget Used</div>
                  <div className="text-white font-bold mt-1">{itineraryData.total_budget_used}</div>
                </div>
                
                <div className="bg-black rounded-lg p-3 border border-zinc-800 transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-xs text-blue-400 uppercase font-semibold">Remaining Budget</div>
                  <div className="text-white font-bold mt-1">{itineraryData.remaining_budget}</div>
                </div>
                
                <div className="bg-black rounded-lg p-3 border border-zinc-800 transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-xs text-blue-400 uppercase font-semibold">Accommodation Cost</div>
                  <div className="text-white font-bold mt-1">{itineraryData.accommodation.cost}</div>
                </div>
              </div>
              
              {/* Accommodation Section */}
              <div className="mt-4">
                <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Accommodation Details
                </h4>
                
                <div className="mt-2 p-3 bg-black rounded-lg border border-zinc-800 transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                      </svg>
                      <span className="font-medium text-white">{itineraryData.accommodation.hotel}</span>
                    </div>
                    <div className="bg-zinc-900 text-blue-400 px-3 py-1 rounded text-sm font-semibold">
                      {itineraryData.accommodation.cost}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tips Section */}
              <div className="mt-4">
                <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  Travel Tips
                </h4>
                
                <div className="mt-2 p-3 bg-black rounded-lg border border-zinc-800 transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                    <p className="text-sm text-zinc-400">{itineraryData.days[currentDay].tips}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}