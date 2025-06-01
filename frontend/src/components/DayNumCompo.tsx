import { useEffect, useState, useMemo, useCallback } from 'react';

// Extend the Window interface to include handlePlaceClick
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setActivePlaceId } from '@/store/slices/placeSlice';
export const DayNumCompo = ({ dayNum, itineraryNum }: { dayNum: string, itineraryNum: string }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const placesData = useSelector((state: any) => state.place.places);
  const dispatch = useDispatch();

  const currentDay = parseInt(dayNum, 10) - 1;
  const itineraryId = parseInt(itineraryNum,10) - 1;

  // Memoize places data extraction to prevent recalculation
  const placesforeachday = useMemo(() => {
    try {
      if (placesData && 
          placesData[itineraryId] && 
          placesData[itineraryId][currentDay] &&
          Array.isArray(placesData[itineraryId][currentDay])) {
        return placesData[itineraryId][currentDay];
      }
    } catch (err) {
      console.error("Error accessing places data:", err);
    }
    return [];
  }, [placesData, itineraryId, currentDay]);

  // Memoize all day images calculation
  const allDayImages = useMemo(() => {
    const images: {url: string, placeIndex: number}[] = [];
    placesforeachday.forEach((place: any, placeIdx: number) => {
      if (place.photos && Array.isArray(place.photos)) {
        place.photos.forEach((photoUrl: string) => {
          images.push({
            url: photoUrl,
            placeIndex: placeIdx
          });
        });
      }
    });
    return images;
  }, [placesforeachday]);

  // Optimize button click handler with useCallback
  const handleButtonClick = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' && target.dataset.placeId) {
      const placeId = target.dataset.placeId;
      console.log(`Button clicked for place ID: ${placeId}`);
      dispatch(setActivePlaceId(placeId));
    }
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener('click', handleButtonClick);
    return () => {
      document.removeEventListener('click', handleButtonClick);
    };
  }, [handleButtonClick]);

  const itinerary = useSelector((state: any) => state.itinerary.itineraries);

  // Memoize place map creation
  const placeMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (placesData && placesData.length > 0) {
      placesData.forEach((dayPlaces: any[]) => {
        if (Array.isArray(dayPlaces)) {
          dayPlaces.forEach((placeArray: any[]) => {
            placeArray.forEach((place) => {
              if (place && place.id && place.displayName) {
                map[place.id] = place.displayName;
              }
            });
          });          
        }
      });
    }
    return map;
  }, [placesData]);

  // Memoize replace function
  const replacePlaceIds = useCallback((text: string) => {
    if (!text) return text;
    return text.replace(/#([a-zA-Z0-9_-]+)#/g, (match, placeId) => {
      const placeName = placeMap[placeId];
      if (!placeName) return match;
      return `<button 
        class="inline-flex items-center px-2 py-0.5 mx-0.5 bg-blue-900/30 text-blue-300 rounded border border-blue-500/20 hover:bg-blue-800/40 transition-all text-xs font-medium" 
        data-place-id="${placeId}"
      >
        ${placeName}
      </button>`;
    });
  }, [placeMap]);

  // Memoize section processing
  const processSection = useCallback((data: any) => {
    if (!data) return data;
    const processed = {...data};
    
    if (typeof processed.activities === 'string') {
      processed.activities = replacePlaceIds(processed.activities);
    }
    if (typeof processed.food === 'string') {
      processed.food = replacePlaceIds(processed.food);
    }
    if (typeof processed.transport === 'string') {
      processed.transport = replacePlaceIds(processed.transport);
    }
    
    return processed;
  }, [replacePlaceIds]);

  // Function to navigate slides
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === allDayImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? allDayImages.length - 1 : prev - 1));
  };

  const renderSectionContent = (data: { activities: any; food: any; transport: any; cost: any; }) => {
    // Process the data to replace place IDs with names
    const processedData = processSection(data);

    // All sections will now use the dark theme with a subtle icon background
    const sectionTheme = { 
      iconBg: 'bg-gray-900/60'
    };
  // console.log("processedData", processSection(itinerary[currentDay].itinerary.days[currentDay].morning));
  // console.log("processedData", processedData);
  // const renderSectionContent = (section: string, data: { activities: any; food: any; transport: any; cost: any; }) => {
  //   // Process the data to replace place IDs with names
  //   // All sections will now use the dark theme with a subtle icon background
  //   const sectionTheme = { 
  //     iconBg: 'bg-gray-900/60'
  //   };
    if(!itinerary){
      return <div className="text-gray-300">No itinerary data available</div>
    }
    return (
      <div className="space-y-4 md:space-y-3">
        {/* Activities - Card style */}
        <div className="rounded-lg overflow-hidden border border-blue-500/10 shadow-sm transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1">
          <div className="px-3 py-2 flex items-center justify-between bg-black/80">
            <div className="flex items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${sectionTheme.iconBg} mr-2`}>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h5 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Activities</h5>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-900/20 text-blue-300 border border-blue-500/20">
              {data.cost}
            </span>
          </div>
          <div className="bg-gray-900/40 p-3">
          <p className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: processedData.activities }}></p>
        </div>
        </div>
        
        {/* Food & Transport - Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Food */}
          <div className="rounded-lg overflow-hidden border border-blue-500/10 shadow-sm transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1">
            <div className="bg-black/80 px-3 py-2 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900/60 mr-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h5 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Food & Dining</h5>
            </div>
            <div className="bg-gray-900/40 p-3">
            <p className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: processedData.food }}></p>
          </div>
          </div>
          
          {/* Transport */}
          <div className="rounded-lg overflow-hidden border border-blue-500/10 shadow-sm transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg hover:-translate-y-1">
            <div className="bg-black/80 px-3 py-2 flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900/60 mr-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </div>
              <h5 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Transportation</h5>
            </div>
            <div className="bg-gray-900/40 p-3">
            <p className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: processedData.transport }}></p>
          </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-blue-500/20 shadow-xl p-3 md:p-6 flex flex-col h-full bg-gradient-to-b from-black to-gray-900/95">
      {/* Enhanced scrollbar with vibrant blue-lavender gradient */}
      <style>{`
        /* Hide default scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #4f46e5, #8b5cf6, #3b82f6);
          border-radius: 20px;
          box-shadow: 0 0 8px rgba(79, 70, 229, 0.6);
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          margin: 6px 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #6366f1, #a855f7, #60a5fa);
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.8);
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.9);
        }
        
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4f46e5 rgba(0, 0, 0, 0.3);
        }
        
        /* Animated background for section headings */
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animated-gradient-text {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #6366f1, #3b82f6);
          background-size: 300% 100%;
          animation: gradientAnimation 8s ease infinite;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
      `}</style>

      {/* Image Slider - Centered with better image display */}
      <div className="flex justify-center w-full mb-5">
        <div className="relative w-4/5 sm:w-3/4 md:w-3/5 aspect-[5/3] overflow-hidden rounded-lg shadow-lg border border-blue-500/20">
          {allDayImages.map((image, index) => (
            <div 
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image.url} 
                // alt={image.title}
                className="object-cover w-full h-full bg-gray-900"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pb-8 pt-6 px-3 md:px-4 text-white">
                {/* <h4 className="text-sm md:text-base font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">{image.title}</h4> */}
              </div>
            </div>
          ))}
          
          {/* Slider Controls */}
          <button 
            onClick={prevSlide} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white cursor-pointer p-2 rounded-full transition-all duration-300 border border-blue-500/30"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button 
            onClick={nextSlide} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 cursor-pointer text-white p-2 rounded-full transition-all duration-300 border border-blue-500/30"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          {/* Indicators - Now placed at the very bottom with enough spacing */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 py-1.5 bg-opacity-40">
            {allDayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index+1)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-gradient-to-r from-blue-400 to-purple-400 w-5' : 'bg-white/40 w-1'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Day Heading with animated gradient */}
      <div className="flex items-center justify-center mb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-purple-500/50 flex-grow"></div>
        <h2 className="px-4 font-bold animated-gradient-text text-lg">Day {currentDay + 1}</h2>
        <div className="h-px bg-gradient-to-r from-purple-500/50 via-blue-500 to-transparent flex-grow"></div>
      </div>

      {/* Day content - Scrollable container with enhanced custom scrollbar */}
      <div className="w-full flex-1 overflow-hidden rounded-lg bg-black/30 border border-blue-500/10 relative">
        {/* Light blue spotlight effect */}
        <div className="absolute -top-10 left-1/4 w-1/2 h-32 bg-blue-600 opacity-[0.08] blur-3xl rounded-full"></div>
      
        {/* Increased height to give more space */}
        <div className="h-[500px] md:h-[600px] lg:h-[700px] custom-scrollbar overflow-y-auto pr-2">
          <div className="p-3 md:p-4 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {/* Morning */}
              <div className="rounded-lg overflow-hidden border border-blue-500/10 bg-gray-900/40 transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                <div className="bg-black/50 px-4 py-2.5 flex items-center justify-between">
                  <h3 className="font-bold animated-gradient-text flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Morning
                  </h3>
                  <div className="bg-blue-900/20 text-blue-300 rounded-full px-3 py-0.5 text-sm font-semibold border border-blue-500/20">
                    {itinerary[itineraryId].itinerary.days[currentDay].morning.cost}
                  </div>
                </div>
                <div className="p-3 bg-black/30 text-gray-300">
                  {renderSectionContent(processSection( itinerary[itineraryId].itinerary.days[currentDay].morning))}
                </div>
              </div>

              {/* Afternoon */}
              <div className="rounded-lg overflow-hidden border border-blue-500/10 bg-gray-900/40 transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                <div className="bg-black/50 px-4 py-2.5 flex items-center justify-between">
                  <h3 className="font-bold animated-gradient-text flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Afternoon
                  </h3>
                  <div className="bg-blue-900/20 text-blue-300 rounded-full px-3 py-0.5 text-sm font-semibold border border-blue-500/20">
                    {itinerary[itineraryId].itinerary.days[currentDay].afternoon.cost}
                  </div>
                </div>
                <div className="p-3 bg-black/30 text-gray-300">
                  {renderSectionContent(processSection(itinerary[itineraryId].itinerary.days[currentDay].afternoon))}
                </div>
              </div>

              {/* Evening */}
              <div className="rounded-lg overflow-hidden border border-blue-500/10 bg-gray-900/40 transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                <div className="bg-black/50 px-4 py-2.5 flex items-center justify-between">
                  <h3 className="font-bold animated-gradient-text flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Evening
                  </h3>
                  <div className="bg-blue-900/20 text-blue-300 rounded-full px-3 py-0.5 text-sm font-semibold border border-blue-500/20">
                    {itinerary[itineraryId].itinerary.days[currentDay].evening?.cost || itinerary[itineraryId].itinerary.days[currentDay].afternoon.cost}
                  </div>
                </div>
                <div className="p-3 bg-black/30 text-gray-300">
                  {renderSectionContent(processSection(itinerary[itineraryId].itinerary.days[currentDay].evening) || processSection(itinerary[itineraryId].itinerary.days[currentDay].afternoon))}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-500/20">
              {/* Tips Section */}
              <div className="mt-4">
                <h4 className="font-bold animated-gradient-text mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  Travel Tips
                 
                </h4>
                <div className=" p-3 bg-black/50 rounded-lg border border-blue-500/10 transform transition-all duration-300 hover:shadow-blue-900/30 hover:shadow-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                    <p className="text-sm text-gray-300">{itinerary[itineraryId].itinerary.days[currentDay].tips}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};