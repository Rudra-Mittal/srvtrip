import { Boxes } from "@/components/ui/background-boxes";
import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { DayCard } from "@/components/ItineraryDayCard";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

export const ItineraryPage = () => {
    const { itineraryNum } = useParams();
    const navigate = useNavigate();
    
    const itineraryIdx = useMemo(() => Number(itineraryNum) - 1, [itineraryNum]);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const itineraries = useSelector((state: any) => state.itinerary.itineraries);
    const itineraryD = useMemo(() => itineraries[itineraryIdx], [itineraries, itineraryIdx]);

    // Simplified scroll to card function
    const scrollToCard = useCallback((index: number) => {
        if (!sliderRef.current) return;

        const slider = sliderRef.current;
        const cards = slider.querySelectorAll('[data-card-index]');
        const targetCard = cards[index] as HTMLElement;
        
        if (!targetCard) return;

        // Get card and slider dimensions
        const cardRect = targetCard.getBoundingClientRect();
        const sliderRect = slider.getBoundingClientRect();
        
        // Calculate current card position relative to slider
        const cardLeft = targetCard.offsetLeft;
        const cardWidth = targetCard.offsetWidth;
        const sliderWidth = slider.clientWidth;
        
        // Calculate scroll position to center the card
        const scrollLeft = cardLeft - (sliderWidth - cardWidth) / 2;
        
        // Ensure scroll position is within bounds
        const maxScroll = slider.scrollWidth - sliderWidth;
        const clampedScroll = Math.max(0, Math.min(scrollLeft, maxScroll));
        
        slider.scrollTo({
            left: clampedScroll,
            behavior: 'smooth'
        });
    }, []);

    // Navigate to next/previous card
    const navigateSlider = useCallback((direction: 'prev' | 'next') => {
        const newIndex = direction === 'prev' 
            ? Math.max(0, activeCardIndex - 1)
            : Math.min(itineraryD.itinerary.days.length - 1, activeCardIndex + 1);
        
        setActiveCardIndex(newIndex);
        scrollToCard(newIndex);
    }, [activeCardIndex, itineraryD.itinerary.days.length, scrollToCard]);

    // Handle indicator click
    const handleIndicatorClick = useCallback((index: number) => {
        setActiveCardIndex(index);
        scrollToCard(index);
    }, [scrollToCard]);

    // Track scroll position to update active card (simplified)
    useEffect(() => {
        if (!sliderRef.current) return;

        let timeoutId: NodeJS.Timeout;
        
        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (!sliderRef.current) return;

                const slider = sliderRef.current;
                const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;
                const cards = slider.querySelectorAll('[data-card-index]');
                
                let closestIndex = 0;
                let closestDistance = Infinity;
                
                cards.forEach((card, index) => {
                    const cardElement = card as HTMLElement;
                    const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2;
                    const distance = Math.abs(cardCenter - sliderCenter);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestIndex = index;
                    }
                });
                
                if (closestIndex !== activeCardIndex) {
                    setActiveCardIndex(closestIndex);
                }
            }, 150); // Debounce scroll updates
        };

        const slider = sliderRef.current;
        slider.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            slider.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, [activeCardIndex]);

    // Intelligent hover effect that adjusts expansion direction based on available space
    const handleCardHover = useCallback((element: HTMLElement, isHovering: boolean) => {
        if (isHovering) {
            const slider = sliderRef.current;
            if (!slider) return;

            // Get element and slider dimensions
            const elementRect = element.getBoundingClientRect();
            const sliderRect = slider.getBoundingClientRect();
            
            // Account for gradient overlays (20px each side)
            const gradientWidth = 80; // w-20 = 80px
            const effectiveSliderLeft = sliderRect.left + gradientWidth;
            const effectiveSliderRight = sliderRect.right - gradientWidth;
            const effectiveSliderWidth = effectiveSliderRight - effectiveSliderLeft;
            
            // Calculate how much the card will grow (5% scale = 5% larger)
            const scaleGrowth = 0.05;
            const currentWidth = elementRect.width;
            const expandedWidth = currentWidth * (1 + scaleGrowth);
            const growthAmount = expandedWidth - currentWidth;
            const halfGrowth = growthAmount / 2;
            
            // Calculate available space on each side (excluding gradient areas)
            const spaceOnLeft = elementRect.left - effectiveSliderLeft;
            const spaceOnRight = effectiveSliderRight - elementRect.right;
            
            let translateX = 0;
            const buffer = 20; // Increased buffer for better visibility
            
            // Check if there's enough space on both sides for normal expansion
            if (spaceOnLeft >= halfGrowth + buffer && spaceOnRight >= halfGrowth + buffer) {
                // Enough space on both sides - expand normally (centered)
                translateX = 0;
            } else if (spaceOnRight < halfGrowth + buffer) {
                // Not enough space on right - shift left
                const deficit = (halfGrowth + buffer) - spaceOnRight;
                translateX = -deficit;
                
                // Ensure we don't push too far left
                const maxLeftShift = spaceOnLeft - buffer;
                translateX = Math.max(translateX, -maxLeftShift);
            } else if (spaceOnLeft < halfGrowth + buffer) {
                // Not enough space on left - shift right
                const deficit = (halfGrowth + buffer) - spaceOnLeft;
                translateX = deficit;
                
                // Ensure we don't push too far right
                const maxRightShift = spaceOnRight - buffer;
                translateX = Math.min(translateX, maxRightShift);
            }
            
            // Apply the transformations
            element.style.transform = `translateX(${translateX}px) scale(1.05)`;
            element.style.zIndex = '30';
            element.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
        } else {
            // Reset transformations
            element.style.transform = 'translateX(0) scale(1)';
            element.style.zIndex = '10';
            element.style.boxShadow = 'none';
        }
    }, []);

    const handleCardClick = useCallback((dayNumber: number) => {
        navigate(`${window.location.pathname}/day/${dayNumber}`);
    }, [navigate]);

    const destinationTitle = useMemo(() => 
        itineraryD.itinerary.destination[0].toUpperCase() + itineraryD.itinerary.destination.slice(1),
        [itineraryD.itinerary.destination]
    );

    return (
        <div className="bg-black max-h-screen max-w-screen overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden min-w-screen min-h-screen opacity-50">
                <Boxes />
            </div>

            <div className="relative z-10 container min-h-screen min-w-screen pointer-events-none mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 pointer-events-auto"
                >
                    <div className="mt-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-3">
                            Your {destinationTitle} Adventure
                        </h1>
                    </div>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Experience the best of {itineraryD.itinerary.destination} with our carefully crafted {itineraryD.itinerary.days.length}-day itinerary, designed to showcase the city's iconic landmarks and hidden gems.
                    </p>
                </motion.div>

                {/* Navigation controls */}
                <div className="flex justify-between items-center mb-8 pointer-events-auto">
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.span className="text-xl sm:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Day {activeCardIndex + 1}
                        </motion.span>
                        <span className="text-gray-400">of {itineraryD.itinerary.days.length}</span>
                    </motion.div>

                    <div className="flex gap-3">
                        <motion.button
                            className={`p-2 rounded-full ${activeCardIndex > 0
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
                            className={`p-2 rounded-full ${activeCardIndex < itineraryD.itinerary.days.length - 1
                                    ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                                    : "bg-gray-800/30 text-gray-600"
                                } transition-colors`}
                            onClick={() => navigateSlider('next')}
                            disabled={activeCardIndex === itineraryD.itinerary.days.length - 1}
                            whileHover={activeCardIndex < itineraryD.itinerary.days.length - 1 ? { scale: 1.05 } : {}}
                            whileTap={activeCardIndex < itineraryD.itinerary.days.length - 1 ? { scale: 0.95 } : {}}
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
                <div className="relative pb-8 min-h-screen">
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
                        transition={{ delay: 0 }}
                    />

                    <div
                        className="overflow-x-auto scrollbar-hide pb-4"
                        ref={sliderRef}
                        style={{ 
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        <div className="flex gap-6 px-6 py-4" style={{ width: 'max-content' }}> 
                            {itineraryD.itinerary.days.map((day: { day: number; }, index: number) => (
                                <motion.div
                                    key={day.day}
                                    data-card-index={index}
                                    className="flex-shrink-0 pointer-events-auto cursor-pointer"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    onClick={() => handleCardClick(day.day)}
                                    onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
                                    onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
                                    style={{
                                        transformOrigin: 'center center',
                                        transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms ease',
                                        position: 'relative',
                                        zIndex: '10',
                                        willChange: 'transform'
                                    }}
                                >
                                    <DayCard
                                        itineraryIdx={itineraryIdx} 
                                        dayIdx={day.day - 1}  
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Day indicators */}
                    <div className="flex justify-center mt-6 gap-2 pointer-events-auto">
                        {itineraryD.itinerary.days.map((_: any, index: number) => (
                            <motion.button
                                key={`indicator-${index}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${activeCardIndex === index
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 w-12"
                                        : "bg-gray-700 hover:bg-gray-600 w-8"
                                    }`}
                                onClick={() => handleIndicatorClick(index)}
                                whileHover={{ scale: 1.2 }}
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

