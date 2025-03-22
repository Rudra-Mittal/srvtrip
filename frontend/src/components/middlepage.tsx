// Middle.tsx
import React, { useState } from 'react';
import { FaHeart, FaSearch, FaStar, FaCalendarAlt, FaPlane, FaHotel, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { GlobeDemo } from './globeDemo';

const Middle: React.FC = () => {
  const [fromLocation, setFromLocation] = useState('London');
  const [toLocation, setToLocation] = useState('London');
  const [departureDate, setDepartureDate] = useState('Fri, 22 Mar');
  const [returnDate, setReturnDate] = useState('Mon, 2 Apr');
  const [guests, setGuests] = useState(6);
  const [rooms, setRooms] = useState(3);
  const [activeCity, setActiveCity] = useState('All');

  const cities = ['All', 'London', 'Birmingham', 'Nottingham', 'Leicester', 'Plymouth', 'Derby', 'Southampton', 'Manchester', 'Liverpool'];
  
  const deals = [
    {
      id: 1,
      discount: '30 % off',
      image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Best in Derby',
      days: 19,
      nights: 18,
      description: 'Return international flights*',
      dateRange: 'Mar - Nov 2024',
      bookBy: 'Book by 30 October 2024',
      rating: 4.5
    },
    {
      id: 2,
      discount: '20 % off',
      image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Best of Manchester',
      days: 8,
      nights: 5,
      description: 'Receive free accommodation and touring',
      dateRange: 'Mar - Apr 2024',
      bookBy: 'Book by 18 Mar 2024',
      rating: 4.5
    },
    {
      id: 3,
      discount: '40 % off',
      image: 'https://images.unsplash.com/photo-1512753360435-329c4535a9a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Best of Spain, Intrepid',
      days: 15,
      nights: 14,
      description: '24-1 Last minute sale - save $537 per person',
      dateRange: 'Aug - Dec 2024',
      bookBy: 'Book by 24 Jul 2024',
      rating: 4.5
    }
  ];

  const incrementGuests = () => setGuests(guests + 1);
  const decrementGuests = () => setGuests(Math.max(1, guests - 1));
  const incrementRooms = () => setRooms(rooms + 1);
  const decrementRooms = () => setRooms(Math.max(1, rooms - 1));

  return (
    <div className=" bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
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

      {/* Hero Section */}
      <section className="relative">
        <div className="min-h-[500px] overflow-hidden relative ">
          {/* Background decoration elements would go here in a real implementation */}
          {/* <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Beach scene" 
            className="absolute inset-0 w-full h-full object-cover"
          /> */}
          <GlobeDemo className="h-20 "/>
          {/* Woman with suitcase would be an overlay image in a real implementation */}
        </div>

        {/* Search Box */}
        <div className="container mx-auto px-4 absolute top-16 left-0 right-0 ">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg">
            <h2 className="text-4xl font-bold mb-1">What Is Your</h2>
            <h2 className="text-4xl font-bold text-teal-500 mb-6">Destination?</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">FROM</label>
                <div className="relative">
                  <select 
                    className="w-full border border-gray-300 rounded-md py-2 px-3 Middleearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                  >
                    <option>London</option>
                    <option>Manchester</option>
                    <option>Birmingham</option>
                    <option>Liverpool</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">TO</label>
                <div className="relative">
                  <select 
                    className="w-full border border-gray-300 rounded-md py-2 px-3 Middleearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                  >
                    <option>London</option>
                    <option>Paris</option>
                    <option>Barcelona</option>
                    <option>Rome</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">DEPARTURE</label>
                <div className="relative">
                  <select 
                    className="w-full border border-gray-300 rounded-md py-2 px-3 Middleearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                  >
                    <option>Fri, 22 Mar</option>
                    <option>Sat, 23 Mar</option>
                    <option>Sun, 24 Mar</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">RETURN</label>
                <div className="relative">
                  <select 
                    className="w-full border border-gray-300 rounded-md py-2 px-3 Middleearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  >
                    <option>Mon, 2 Apr</option>
                    <option>Tue, 3 Apr</option>
                    <option>Wed, 4 Apr</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">GUESTS</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={decrementGuests}
                    className="px-3 py-2 text-gray-500 hover:text-teal-500"
                  >
                    -
                  </button>
                  <div className="flex items-center flex-1 justify-center">
                    <span className="text-gray-700">{guests}</span>
                    <svg className="w-5 h-5 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <button 
                    onClick={incrementGuests}
                    className="px-3 py-2 text-gray-500 hover:text-teal-500"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">ROOMS</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={decrementRooms}
                    className="px-3 py-2 text-gray-500 hover:text-teal-500"
                  >
                    -
                  </button>
                  <div className="flex items-center flex-1 justify-center">
                    <span className="text-gray-700">{rooms}</span>
                    <svg className="w-5 h-5 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <button 
                    onClick={incrementRooms}
                    className="px-3 py-2 text-gray-500 hover:text-teal-500"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-teal-500 text-white font-medium py-3 rounded-md hover:bg-teal-600 transition-colors">
              Get your deal now
            </button>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="container mx-auto px-4 py-12 mt-64">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Best holiday deals</h2>
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="SEARCH YOUR NEXT CITY" 
              className="border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <FaSearch className="absolute left-3 text-gray-400" />
            <button className="ml-2 bg-teal-800 text-white px-4 py-2 rounded-md">Search</button>
          </div>
        </div>

        {/* City Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
          {cities.map(city => (
            <button
              key={city}
              className={`px-4 py-2 rounded-full ${
                activeCity === city 
                ? 'bg-teal-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setActiveCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
        {/* Deal Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map(deal => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
                <div className="absolute top-0 left-0 bg-teal-500 text-white px-3 py-1 rounded-br-lg">
                  {deal.discount}
                </div>
                <button className="absolute top-2 right-2 text-white hover:text-red-500">
                  <FaHeart className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-3">{deal.title}</h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span>{deal.days} days and {deal.nights} nights</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <FaPlane className="mr-2 text-gray-400" />
                  <span>{deal.description}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span>{deal.dateRange}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <FaClock className="mr-2 text-gray-400" />
                  <span>{deal.bookBy}</span>
                </div>
                
                <div className="flex items-center mt-4">
                  <div className="flex items-center text-yellow-400">
                    <span className="font-bold mr-1">{deal.rating}</span>
                    <FaStar />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </section>
    </div>
  );
}

export default Middle;