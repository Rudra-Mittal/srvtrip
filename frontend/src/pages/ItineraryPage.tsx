import { Boxes } from "@/components/ui/background-boxes";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {DayCard} from "@/components/ItineraryDayCard";

export const ItineraryPage = () => {
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    
    // Paris 7-day itinerary data
    const itineraryData = [
        {
            day: 1,
            date: "March 25, 2025",
            title: "Central Paris Highlights",
            description: "Explore iconic landmarks and experience the charm of the City of Lights on your first day in Paris.",
            images: [
                "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1600111765736-9b5bb440acf0?q=80&w=1887&auto=format&fit=crop", 
                "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1854&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=1828&auto=format&fit=crop"
            ],
            placesVisited: ["Eiffel Tower", "Louvre Museum", "Notre Dame Cathedral", "Arc de Triomphe", "Seine River Cruise"]
        },
        {
            day: 2,
            date: "March 26, 2025",
            title: "Montmartre & Art District",
            description: "Discover the artistic heart of Paris and enjoy breathtaking city views from Sacré-Cœur Basilica.",
            images: [
                "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1584633881530-44a7eb786942?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1528219089976-87a76979728e?q=80&w=2071&auto=format&fit=crop"
            ],
            placesVisited: ["Sacré-Cœur Basilica", "Place du Tertre", "Moulin Rouge", "Pigalle", "Musée de Montmartre"]
        },
        {
            day: 3,
            date: "March 27, 2025",
            title: "Palace of Versailles",
            description: "Step into royal history with a day trip to the magnificent Palace of Versailles and its stunning gardens.",
            images: [
                "https://images.unsplash.com/photo-1597992701208-d7586239d433?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1591289009723-aef022cb5c38?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1571166062671-c69c78dba48a?q=80&w=2071&auto=format&fit=crop"
            ],
            placesVisited: ["Hall of Mirrors", "Royal Apartments", "Gardens of Versailles", "Grand Trianon", "Queen's Hamlet"]
        },
        {
            day: 4,
            date: "March 28, 2025",
            title: "Latin Quarter & Saint-Germain",
            description: "Wander through historic academic districts, visit the Panthéon, and enjoy the lively café culture.",
            images: [
                "https://images.unsplash.com/photo-1549051579-91119e087a75?q=80&w=1915&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1557063673-0493e05da49f?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1541166246832-4cb45a2b236b?q=80&w=2071&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1539037897685-5b2c002be1bc?q=80&w=1887&auto=format&fit=crop"
            ],
            placesVisited: ["Panthéon", "Luxembourg Gardens", "Sorbonne University", "Shakespeare and Company", "Saint-Sulpice Church"]
        },
        {
            day: 5,
            date: "March 29, 2025",
            title: "Modern Art & Architecture",
            description: "Experience contemporary Paris through its modern museums, architecture, and cultural landmarks.",
            images: [
                "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1583146202015-361050c1b305?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1577083552792-a0d461cb1945?q=80&w=1923&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1584707824639-12a087904341?q=80&w=1899&auto=format&fit=crop"
            ],
            placesVisited: ["Centre Pompidou", "Fondation Louis Vuitton", "La Défense", "Musée d'Orsay", "Palais de Tokyo"]
        },
        {
            day: 6,
            date: "March 30, 2025",
            title: "Parisian Food & Markets",
            description: "Indulge in a culinary journey through Paris's finest markets, patisseries, and dining experiences.",
            images: [
                "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1590846083693-f23fcf9d4acd?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1624704765325-9dbd0921e9ed?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1627905646269-7f034dcc5738?q=80&w=1980&auto=format&fit=crop"
            ],
            placesVisited: ["Marché d'Aligre", "Rue Mouffetard", "Le Marais food tour", "Château Rouge", "Wine tasting experience"]
        },
        {
            day: 7,
            date: "March 31, 2025",
            title: "Hidden Paris & Farewell",
            description: "Discover secret spots and lesser-known gems before bidding farewell to the City of Light.",
            images: [
                "https://images.unsplash.com/photo-1560704194-8afbc567946f?q=80&w=2069&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507666664345-c49224b3e45b?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop"
            ],
            placesVisited: ["Promenade Plantée", "Butte-aux-Cailles", "Canal Saint-Martin", "Père Lachaise Cemetery", "Sunset Seine Cruise"]
        }
    ];
    
    // Handle navigation
    const navigateSlider = (direction: 'prev' | 'next') => {
        if (sliderRef.current) {
            const newIndex = direction === 'next'
                ? Math.min(activeCardIndex + 1, itineraryData.length - 1)
                : Math.max(activeCardIndex - 1, 0);
            
            setActiveCardIndex(newIndex);
            
            // Smooth scroll to the card
            const cardWidth = 440; // Card width + gap
            sliderRef.current.scrollTo({
                left: newIndex * cardWidth,
                behavior: 'smooth'
            });
        }
    };
    
    return (
        <div className="bg-black min-h-screen min-w-screen overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Boxes />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-3">
                        Your Paris Adventure
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Experience the best of Paris with our carefully crafted 7-day itinerary, designed to showcase the city's iconic landmarks and hidden gems.
                    </p>
                </motion.div>
                
                {/* Navigation controls */}
                <div className="flex justify-between items-center mb-8">
                    <motion.div 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.span className="text-xl sm:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Day {activeCardIndex + 1}
                        </motion.span>
                        <span className="text-gray-400">of 7</span>
                    </motion.div>
                    
                    <div className="flex gap-3">
                        <motion.button 
                            className={`p-2 rounded-full ${
                                activeCardIndex > 0 
                                    ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30" 
                                    : "bg-gray-800/30 text-gray-600"
                            } transition-colors`}
                            onClick={() => navigateSlider('prev')}
                            disabled={activeCardIndex === 0}
                            whileHover={activeCardIndex > 0 ? { scale: 1.05 } : {}}
                            whileTap={activeCardIndex > 0 ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>
                        
                        <motion.button 
                            className={`p-2 rounded-full ${
                                activeCardIndex < itineraryData.length - 1 
                                    ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30" 
                                    : "bg-gray-800/30 text-gray-600"
                            } transition-colors`}
                            onClick={() => navigateSlider('next')}
                            disabled={activeCardIndex === itineraryData.length - 1}
                            whileHover={activeCardIndex < itineraryData.length - 1 ? { scale: 1.05 } : {}}
                            whileTap={activeCardIndex < itineraryData.length - 1 ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
                
                {/* Card slider */}
                <div className="relative pb-8">
                    <motion.div 
                        className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    />
                    <motion.div 
                        className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    />
                    
                    <div 
                        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                        ref={sliderRef}
                        style={{ scrollbarWidth: 'none' }}
                    >
                        <div className="flex gap-5 px-4">
                            {itineraryData.map((day, index) => (
                                <motion.div 
                                    key={day.day}
                                    className="snap-center flex-shrink-0"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                                >
                                    <DayCard
                                        day={day.day}
                                        date={day.date}
                                        title={day.title}
                                        description={day.description}
                                        images={day.images}
                                        placesVisited={day.placesVisited}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Day indicators */}
                    <div className="flex justify-center mt-6 gap-2">
                        {itineraryData.map((_, index) => (
                            <motion.button
                                key={`indicator-${index}`}
                                className={`w-8 h-1.5 rounded-full transition-all ${
                                    activeCardIndex === index 
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 w-12" 
                                        : "bg-gray-700 hover:bg-gray-600"
                                }`}
                                onClick={() => {
                                    setActiveCardIndex(index);
                                    if (sliderRef.current) {
                                        const cardWidth = 440;
                                        sliderRef.current.scrollTo({
                                            left: index * cardWidth,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + (index * 0.05) }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

