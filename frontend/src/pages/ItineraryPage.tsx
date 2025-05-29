import { Boxes } from "@/components/ui/background-boxes";
import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { DayCard } from "@/components/ItineraryDayCard";
import { useDebounce } from "use-debounce";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

export const ItineraryPage = () => {
    const {itineraryNum}= useParams();
    const navigate = useNavigate();
    console.log("itineraryNumber",itineraryNum);
    const itineraryIdx= Number(itineraryNum)-1;
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const itineraries= useSelector((state: any) => state.itinerary.itineraries);
    const itineraryD=itineraries[itineraryIdx];  


    const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(itineraryD.itinerary.days.length).fill(null));
    const [scrollPosition] = useDebounce(useScrollPosition(sliderRef as React.RefObject<HTMLDivElement>), 50);
    const navigateSlider = useCallback((direction: 'prev' | 'next') => {
        if (!sliderRef.current) return;
        let newIndex;
        if (direction === 'prev') {
            newIndex = Math.max(0, activeCardIndex - 1);
        } else {
            newIndex = Math.min(itineraryD.itinerary.days.length - 1, activeCardIndex + 1);
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
        
        // Define constants
        const SCALE_FACTOR = 1.05;
        const BUFFER_PX = 10;
        
        if (isHovering) {
            // First set z-index to ensure card is on top
            card.style.zIndex = '30';
            
            // Force layout recalculation before measuring
            void card.offsetWidth;
            
            // Get accurate measurements
            const cardRect = card.getBoundingClientRect();
            const sliderRect = slider.getBoundingClientRect();
            
            // Calculate how much the card will grow on each side when scaled
            const originalWidth = cardRect.width;
            const expandedWidth = originalWidth * SCALE_FACTOR;
            const growthPerSide = (expandedWidth - originalWidth) / 2;
            
            // Calculate space available on each side
            const leftSpace = cardRect.left - sliderRect.left;
            const rightSpace = sliderRect.right - cardRect.right;
            
            // Determine if adjustments are needed
            let translateX = 0;
            
            if (leftSpace < growthPerSide + BUFFER_PX) {
                // Not enough space on left, shift right
                translateX = (growthPerSide + BUFFER_PX) - leftSpace;
                console.log(`Card ${index} - LEFT adjustment: ${translateX}px`);
            } 
            else if (rightSpace < growthPerSide + BUFFER_PX) {
                // Not enough space on right, shift left
                translateX = -((growthPerSide + BUFFER_PX) - rightSpace);
                console.log(`Card ${index} - RIGHT adjustment: ${translateX}px`);
            }
            
            // Apply transformations with hardware acceleration
            card.style.willChange = 'transform';
            card.style.transition = 'transform 300ms ease-out, box-shadow 300ms ease';
            card.style.transform = `translateX(${translateX}px) scale(${SCALE_FACTOR})`;
            card.style.boxShadow = '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)';
            card.style.backgroundColor = 'black';
        } else {
            // Reset transforms
            card.style.willChange = 'auto';
            card.style.transition = 'transform 300ms ease, box-shadow 300ms ease';
            card.style.transform = 'translateX(0) scale(1)';
            card.style.boxShadow = 'none';
            card.style.backgroundColor = 'transparent';
            
            // Reset z-index after transition completes
            setTimeout(() => {
                if (!card.matches(':hover')) {
                    card.style.zIndex = '10';
                }
            }, 300);
        }
    }, []);
    

    const handleCardClick = useCallback((dayNumber: number) => {
        navigate(`${window.location.pathname}/day/${dayNumber}`);
    }, [navigate]);

    return (
        <div className="bg-black max-h-screen max-w-screen overflow-hidden  ">
            <div className="absolute inset-0 z-0 overflow-hidden min-w-secreen min-h-screen opacity-50">
                <Boxes />
            </div>

            <div className="relative z-10 container min-h-screen min-w-screen pointer-events-none mx-auto px-4 py-12 ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 pointer-events-auto"
                >
                    <div className="mt-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-3">
                            Your {itineraryD.itinerary.destination[0].toUpperCase()+itineraryD.itinerary.destination.slice(1)} Adventure
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
                        className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-20 "
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
                        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                        ref={sliderRef}
                        style={{ scrollbarWidth: 'none', position: 'relative' }}
                    >
                         <div className="flex gap-5 px-4 py-4"> 
                            {itineraryD.itinerary.days.map((day: { day: number; }, index: number) => (
                                <motion.div
                                key={day.day}
                                className="snap-center flex-shrink-0 pointer-events-auto cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0 , duration: 0.5 }}
                                ref={el => { cardRefs.current[index] = el; }}
                                onClick={() => handleCardClick(day.day)}
                                onMouseEnter={() => {
                                    setTimeout(()=>handleCardHover(index, true),1600)
                                }}
                                onMouseLeave={() => handleCardHover(index, false)}
                                style={{
                                    transformOrigin: 'center center',
                                    transition: 'transform 300ms ease, box-shadow 300ms ease',
                                    position: 'relative',
                                    zIndex: '10',
                                    marginLeft: '5px',
                                    marginRight: '5px'
                                }}
                            >
                                    <DayCard
                                        itineraryIdx={itineraryIdx} 
                                        dayIdx={day.day-1}  
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Day indicators */}
                    <div className="flex justify-center mt-6 gap-2">
                        {itineraryD.itinerary.days.map((_: any, index: number) => (
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

