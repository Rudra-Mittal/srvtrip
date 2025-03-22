// Middle.tsx
import React, { useState } from 'react';
// import { FaHeart, FaSearch, FaStar, FaCalendarAlt, FaPlane, FaHotel, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { GlobeDemo } from './globeDemo';
import TravelPlannerForm from './form';
import { HeroParallax } from '../ui/hero-parallax';
import { HeroParallaxDemo } from './heroparallax';

// import { MacbookScrollDemo } from './macbookscrooldemo';
// import { BackgroundBeamsDemo } from './BackGroundBeamsdemp';

const Middle: React.FC = () => {
  // const [fromLocation, setFromLocation] = useState('London');
  // const [toLocation, setToLocation] = useState('London');
  // const [departureDate, setDepartureDate] = useState('Fri, 22 Mar');
  // const [returnDate, setReturnDate] = useState('Mon, 2 Apr');
  // const [guests, setGuests] = useState(6);
  // const [rooms, setRooms] = useState(3);
  // const [activeCity, setActiveCity] = useState('All');

  // const cities = ['All', 'London', 'Birmingham', 'Nottingham', 'Leicester', 'Plymouth', 'Derby', 'Southampton', 'Manchester', 'Liverpool'];
  
  

  // const incrementGuests = () => setGuests(guests + 1);
  // const decrementGuests = () => setGuests(Math.max(1, guests - 1));
  // const incrementRooms = () => setRooms(rooms + 1);
  // const decrementRooms = () => setRooms(Math.max(1, rooms - 1));

  return (
    <div className=" bg-black">
      {/* Header */}
      <header className="bg-black shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold">TM</span>
            </div>
            <h1 className="text-gray-800 font-bold text-xl">TripMate</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-teal-500">Holiday Packages</a>
            <a href="#" className="text-gray-600 hover:text-teal-500">Top Deals</a>
            <a href="#" className="text-gray-600 hover:text-teal-500">Help</a>
            <a href="#" className="text-gray-600 hover:text-teal-500">Wishlist</a>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="text-gray-600 hover:text-teal-500">Register</button>
            <button className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">Login</button>
            <div className="relative">
              <button className="flex items-center space-x-1 text-gray-600">
                <span>EN</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

<section className="relative">
  <div className="min-h-screen w-full overflow-hidden relative">
    {/* Background Beams as the bottom layer */}
    <div className="absolute inset-0 z-10">
      {/* <BackgroundBeamsDemo /> */}
      {/* <MacbookScrollDemo/> */}
      {/* <ThreeDMarqueeDemo /> */}
    </div>
    
    {/* Content layer with form and globe */}
    <div className="relative z-10 flex flex-row items-center justify-between w-full px-4">
      <div className="z-20 w-1/2">
        {/* <TravelPlannerForm /> */}
        <HeroParallaxDemo />
      </div>
      <div className="z-10 w-1/2 h-screen">
        {/* <GlobeDemo /> */}
      </div>
    </div>
  </div>
</section>
     
    </div>
  );
}

export default Middle;