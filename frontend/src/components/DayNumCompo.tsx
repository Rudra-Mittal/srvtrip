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
    return (
      <div className="space-y-4 md:space-y-6">
        
        {/* Activities */}
        <div>
          <h5 className="font-medium text-gray-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Activities
          </h5>
          <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-sm px-3 py-1 rounded-full ${
                section === 'morning' ? 'bg-green-100 text-green-800' :
                section === 'afternoon' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {data.activities}
              </span>
          </div>
        </div>
        
        {/* Food */}
        <div>
          <h5 className="font-medium text-gray-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            Food & Dining
          </h5>
          <div className="bg-white bg-opacity-60 rounded-lg p-3 mt-2">
            <h6 className="font-medium">{data.food.title}</h6>
            <p className="text-sm text-gray-600 mt-1">{data.food.description}</p>
            <div className="flex justify-between mt-2 text-sm">
              <div>
                <span className="font-medium"></span> {data.food}
              </div>
            </div>
          </div>
        </div>
        
        {/* Transport */}
        <div>
          <h5 className="font-medium text-gray-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            Transportation
          </h5>
          <div className="bg-white bg-opacity-60 rounded-lg p-3 mt-2">
            <p className="text-sm text-gray-600 mt-1">{data.transport}</p>
          </div>
        </div>
        
        {/* Cost Summary */}
        <div className={`rounded-lg p-3 mt-4 ${
          section === 'morning' ? 'bg-green-100' :
          section === 'afternoon' ? 'bg-amber-100' :
          'bg-blue-100'
        }`}>
          <p className="text-xs mt-1 text-gray-600">{data.cost}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border h-[100vh] border-red-600 shadow-xl p-6 overflow-hidden flex flex-col justify-center items-center">

      
        {/* <div className="mb-4">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
            Day {itineraryData.days[currentDay].day}
          </h2>
        </div> */}

      {/* Image Slider */}
      <div className="relative w-3/5 h-7/5 mb-4 overflow-hidden rounded-lg shadow-lg">
        {imageData.map((image, index) => (
          <div 
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize:'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
              <h4 className="text-md font-bold">{image.title}</h4>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <button 
          onClick={prevSlide} 
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black opacity-50 hover:opacity-70 text-white cursor-pointer p-2 rounded-full transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black opacity-50 hover:opacity-70 cursor-pointer text-white p-2 rounded-full transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {imageData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-4 bg-opacity-45' : 'bg-white bg-opacity-60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Day content */}
        <div className="space-y-8 w-full max-w-2xl overflow-y-auto border border-gray-300 rounded-lg p-4">
          {/* Morning */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-green-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Morning
              </h3>
              <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                {itineraryData.days[currentDay].morning.cost}
              </span>
            </div>
            {renderSectionContent('morning', itineraryData.days[currentDay].morning)}
          </div>

          {/* Afternoon */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-5 shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-amber-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Afternoon
              </h3>
              <span className="bg-amber-200 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                {itineraryData.days[currentDay].afternoon.cost}
              </span>
            </div>
            {renderSectionContent('afternoon',itineraryData.days[currentDay].afternoon)}
          </div>

          {/* Evening */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-blue-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Evening
                </h3>
                <span className="bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {itineraryData.days[currentDay].morning.cost}
                </span>
            </div>
            {renderSectionContent('evening',itineraryData.days[currentDay].afternoon)}

            {/* Total budget breakdown */}
            <div className="bg-white bg-opacity-60 rounded-lg p-3 mt-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Total Budget Estimation</h5>
                <span className="font-bold">{itineraryData.days[currentDay].budget_breakdown}</span>
              </div>
              <p className="text-xs mt-1 text-gray-600">{itineraryData.days[currentDay].budget_breakdown}</p>
            </div>

            {/* Accomodation & total budget of day */}
            <div className="bg-white rounded-lg p-4 mt-2 shadow-md">
                <div className="flex justify-between items-center">
                <h5 className="font-medium">{itineraryData.accommodation.hotel}</h5>
                <div className="flex items-center">
                    <span className="text-sm">{itineraryData.accommodation.cost}</span>
                </div>
                </div>

                <div className="mt-3 flex justify-center">
                  <div className="font-bold text-blue-800">{itineraryData.total_budget_used}</div>
                  <div className="font-bold text-blue-800">{itineraryData.remaining_budget}</div>
                  <div className="font-bold text-blue-800">{itineraryData.days[currentDay].tips}</div>
                </div>
            </div>
            </div>
        </div>
    </div>
    );
}