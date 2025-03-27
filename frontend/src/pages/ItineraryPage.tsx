import { Boxes } from "@/components/ui/background-boxes";
import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { DayCard } from "@/components/ItineraryDayCard";
import { itineraryData } from "@/data/iteneraryData";
import { useDebounce } from "use-debounce";
export const ItineraryPage = () => {
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(itineraryData.length).fill(null));
    const [scrollPosition] = useDebounce(useScrollPosition(sliderRef), 50);

    const navigateSlider = useCallback((direction: 'prev' | 'next') => {
        if (!sliderRef.current) return;
        
        let newIndex;
        if (direction === 'prev') {
            newIndex = Math.max(0, activeCardIndex - 1);
        } else {
            newIndex = Math.min(itineraryData.length - 1, activeCardIndex + 1);
        }
        
        setActiveCardIndex(newIndex);
        
        // Scroll to the card using proper measurement
        const card = cardRefs.current[newIndex];
        if (card) {
            const slider = sliderRef.current;
            const cardLeft = card.offsetLeft;
            const sliderWidth = slider.clientWidth;
            
            slider.scrollTo({
                left: cardLeft - (sliderWidth - card.offsetWidth) / 2,
                behavior: 'smooth'
            });
        }
    }, [activeCardIndex]);
    function useScrollPosition(ref: React.RefObject<HTMLDivElement>) {
        const [scrollPosition, setScrollPosition] = useState(0);
    
        useEffect(() => {
            const element = ref.current;
            if (!element) return;
    
            const updatePosition = () => {
                setScrollPosition(element.scrollLeft);
            };
    
            element.addEventListener('scroll', updatePosition);
            return () => element.removeEventListener('scroll', updatePosition);
        }, [ref]);
    
        return scrollPosition;
    }
    useEffect(() => {
        if (!sliderRef.current || !cardRefs.current.length) return;

        // Calculate visible card index
        const calculateActiveIndex = () => {
            const slider = sliderRef.current!;
            const scrollLeft = slider.scrollLeft + slider.clientWidth * 0.1; // 10% threshold
            
            // Find the first card that's mostly visible from left
            const activeIndex = cardRefs.current.findIndex((card) => {
                if (!card) return false;
                const cardLeft = card.offsetLeft;
                const cardRight = cardLeft + card.offsetWidth;
                return cardLeft <= scrollLeft && cardRight > scrollLeft;
            });

            return activeIndex >= 0 ? activeIndex : 0;
        };

        const newActiveIndex = calculateActiveIndex();
        if (newActiveIndex !== activeCardIndex) {
            setActiveCardIndex(newActiveIndex);
        }
    }, [scrollPosition, activeCardIndex]);
    // Handle navigation
   // Enhanced handleCardHover function with edge detection and smooth adjustments
const handleCardHover = useCallback((index: number, isHovering: boolean) => {
    if (!cardRefs.current[index] || !sliderRef.current) return;

    const card = cardRefs.current[index];
    const slider = sliderRef.current;
    const SCALE_FACTOR = 1.05;
    const BASE_CARD_WIDTH = 440; // Match the cardWidth used in navigateSlider

    if (isHovering) {
        // Set elevated z-index first
        card.style.zIndex = '30';
        
        // Calculate dimensions and potential overflow
        const cardRect = card.getBoundingClientRect();
        const sliderRect = slider.getBoundingClientRect();
        const scaledWidth = BASE_CARD_WIDTH * SCALE_FACTOR;
        const growthAmount = (scaledWidth - BASE_CARD_WIDTH) / 2;

        // Calculate available space on both sides
        const spaceLeft = cardRect.left - sliderRect.left;
        const spaceRight = sliderRect.right - cardRect.right;

        // Determine necessary translation
        let translateX = 0;
        if (spaceLeft < growthAmount) {
            translateX = growthAmount - spaceLeft;
        } else if (spaceRight < growthAmount) {
            translateX = -(growthAmount - spaceRight);
        }

        // Apply transform with transition
        card.style.transition = 'transform 300ms ease, box-shadow 300ms ease';
        card.style.transform = `translateX(${translateX}px) scale(${SCALE_FACTOR})`;
        card.style.boxShadow = '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)';
        card.style.backgroundColor='black'

        // Calculate required scroll adjustment
        const cardGlobalLeft = card.offsetLeft + translateX;
        const cardGlobalRight = cardGlobalLeft + scaledWidth;
        const visibleLeft = slider.scrollLeft;
        const visibleRight = visibleLeft + slider.clientWidth;

        let targetScroll = slider.scrollLeft;
        if (cardGlobalLeft < visibleLeft) {
            targetScroll = cardGlobalLeft - 50; // Add 20px padding
        } else if (cardGlobalRight > visibleRight) {
            targetScroll = cardGlobalRight - slider.clientWidth + 20;
        }

        // Clamp and smooth scroll
        targetScroll = Math.max(0, Math.min(targetScroll, slider.scrollWidth - slider.clientWidth));
        if (Math.abs(targetScroll - slider.scrollLeft) > 1) {
            slider.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }

    } else {
        // Reset styles with transition
        card.style.transition = 'transform 300ms ease, box-shadow 300ms ease';
        card.style.transform = 'none';
        card.style.boxShadow = 'none';
        card.style.backgroundColor='none'
        
        // Delay z-index reset to prevent flickering
        setTimeout(() => {
            if (!card.matches(':hover')) {
                card.style.zIndex = '10';
            }
        }, 300);
    }
}, []);
    return (
        <div className="bg-black max-h-screen max-w-screen overflow-hidden  ">
            <div className="absolute inset-0 z-0 overflow-hidden opacity-50">
                <Boxes />
            </div>

            <div className="relative z-10 container min-h-screen min-w-screen pointer-events-none mx-auto px-4 py-12 ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 pointer-events-auto"
                >
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-3">
                            Your Paris Adventure
                        </h1>
                    </div>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Experience the best of Paris with our carefully crafted 7-day itinerary, designed to showcase the city's iconic landmarks and hidden gems.
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
                        <span className="text-gray-400">of 7</span>
                    </motion.div>

                    <div className="flex gap-3">
                        <motion.button
                            className={`p-2 rounded-full ${activeCardIndex > 0
                                    ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                                    : "bg-gray-800/30 text-gray-600"
                                } transition-colors `}
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
                            className={`p-2 rounded-full ${activeCardIndex < itineraryData.length - 1
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
                <div className="relative pb-8 min-h-screen">
                    <motion.div
                        className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-20 "
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
                        style={{ scrollbarWidth: 'none', position: 'relative' }}
                    >
                        <div className="flex gap-5 px-4 py-4"> {/* Added py-4 to give room for expansion */}
                            {itineraryData.map((day, index) => (
                                <motion.div
                                key={day.day}
                                className="snap-center flex-shrink-0 pointer-events-auto"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                                ref={el => { cardRefs.current[index] = el; }}
                                onMouseEnter={() => {
                                    setTimeout(()=>handleCardHover(index, true),501)
                                }}
                                onMouseLeave={() => handleCardHover(index, false)}
                                style={{
                                    transformOrigin: 'center center',
                                    transition: 'transform 300ms ease, box-shadow 300ms ease',
                                    position: 'relative',
                                    zIndex: '10',
                                    marginLeft: '5px', // Add small gap between cards
                                    marginRight: '5px'
                                    
                                }}
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
                                className={`w-8 h-1.5 rounded-full transition-all ${activeCardIndex === index
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

