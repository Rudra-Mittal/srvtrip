import { Boxes } from "@/components/ui/background-boxes";
import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { DayCard } from "@/components/ItineraryDayCard";
import { useSelector } from "react-redux";
import { useParams} from "react-router-dom";

export const ItineraryPage = () => {
    const { itineraryNum } = useParams();
    
    
    const itineraryIdx = useMemo(() => Number(itineraryNum) - 1, [itineraryNum]);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [expandedMobileCard, setExpandedMobileCard] = useState<number | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);

    const itineraries = useSelector((state: any) => state.itinerary.itineraries);
    const itineraryD = useMemo(() => itineraries?.[itineraryIdx], [itineraries, itineraryIdx]);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Simplified scroll to card function
    const scrollToCard = useCallback((index: number) => {
        if (!sliderRef.current) return;

        const slider = sliderRef.current;
        const cards = slider.querySelectorAll('[data-card-index]');
        const targetCard = cards[index] as HTMLElement;
        
        if (!targetCard) return;

        const cardLeft = targetCard.offsetLeft;
        const cardWidth = targetCard.offsetWidth;
        const sliderWidth = slider.clientWidth;
        
        // For mobile, align card to left with some padding
        const scrollLeft = isMobile 
            ? cardLeft - 20 
            : cardLeft - (sliderWidth - cardWidth) / 2;
        
        const maxScroll = slider.scrollWidth - sliderWidth;
        const clampedScroll = Math.max(0, Math.min(scrollLeft, maxScroll));
        
        slider.scrollTo({
            left: clampedScroll,
            behavior: 'smooth'
        });
    }, [isMobile]);

    // Navigate to next/previous card
    const navigateSlider = useCallback((direction: 'prev' | 'next') => {
        if (!itineraryD?.itinerary?.days) return;
        
        const newIndex = direction === 'prev' 
            ? Math.max(0, activeCardIndex - 1)
            : Math.min(itineraryD.itinerary.days.length - 1, activeCardIndex + 1);
        
        setActiveCardIndex(newIndex);
        scrollToCard(newIndex);
    }, [activeCardIndex, itineraryD?.itinerary?.days?.length, scrollToCard]);

    // Handle indicator click
    const handleIndicatorClick = useCallback((index: number) => {
        setActiveCardIndex(index);
        scrollToCard(index);
    }, [scrollToCard]);

    // Mobile long-press handlers
    const handleTouchStart = useCallback((e: React.TouchEvent, cardIndex?: number) => {
        if (!isMobile) return;
        
        touchStartX.current = e.touches[0].clientX;
        isLongPress.current = false;
        
        // Start long press timer for card expansion
        if (cardIndex !== undefined) {
            longPressTimer.current = setTimeout(() => {
                isLongPress.current = true;
                setExpandedMobileCard(cardIndex);
                
                // Add haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }, 500); // 500ms for long press
        }
    }, [isMobile]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isMobile) return;
        
        touchEndX.current = e.touches[0].clientX;
        
        // Cancel long press if user moves finger too much
        const touchDiff = Math.abs(touchStartX.current - touchEndX.current);
        if (touchDiff > 10 && longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    }, [isMobile]);

    const handleTouchEnd = useCallback((cardIndex?: number) => {
        if (!isMobile) return;
        
        // Clear long press timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        
        // If it was a long press, don't navigate - just collapse
        if (isLongPress.current) {
            setTimeout(() => setExpandedMobileCard(null), 100);
            isLongPress.current = false;
            return;
        }
        
        // Handle swipe navigation only on slider, not individual cards
        if (cardIndex === undefined) {
            const touchDiff = touchStartX.current - touchEndX.current;
            const minSwipeDistance = 50;
            
            if (Math.abs(touchDiff) > minSwipeDistance) {
                if (touchDiff > 0) {
                    navigateSlider('next');
                } else {
                    navigateSlider('prev');
                }
            }
        }
    }, [isMobile, navigateSlider]);

    // Track scroll position to update active card
    useEffect(() => {
        if (!sliderRef.current || !itineraryD?.itinerary?.days) return;

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
            }, 150);
        };

        const slider = sliderRef.current;
        slider.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            slider.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, [activeCardIndex, itineraryD?.itinerary?.days]);

    // Enhanced card hover/press effect
    const handleCardInteraction = useCallback((element: HTMLElement, isActive: boolean, isMobileExpand = false) => {
        if (isMobile && !isMobileExpand) return; // Only allow mobile expand for mobile

        if (isActive) {
            const slider = sliderRef.current;
            if (!slider) return;

            const elementRect = element.getBoundingClientRect();
            const sliderRect = slider.getBoundingClientRect();
            
            // Different behavior for mobile vs desktop
            if (isMobile && isMobileExpand) {
                // Mobile: expand downwards without position adjustment
                element.style.transform = 'scale(1.08) translateY(5px)';
                element.style.zIndex = '30';
                element.style.boxShadow = '0 25px 50px rgba(0,0,0,0.4)';
                element.style.borderRadius = '12px';
            } else {
                // Desktop: intelligent positioning
                const gradientWidth = 80;
                const effectiveSliderLeft = sliderRect.left + gradientWidth;
                const effectiveSliderRight = sliderRect.right - gradientWidth;
                
                const scaleGrowth = 0.05;
                const currentWidth = elementRect.width;
                const expandedWidth = currentWidth * (1 + scaleGrowth);
                const growthAmount = expandedWidth - currentWidth;
                const halfGrowth = growthAmount / 2;
                
                const spaceOnLeft = elementRect.left - effectiveSliderLeft;
                const spaceOnRight = effectiveSliderRight - elementRect.right;
                
                let translateX = 0;
                const buffer = 20;
                
                if (spaceOnLeft >= halfGrowth + buffer && spaceOnRight >= halfGrowth + buffer) {
                    translateX = 0;
                } else if (spaceOnRight < halfGrowth + buffer) {
                    const deficit = (halfGrowth + buffer) - spaceOnRight;
                    translateX = -deficit;
                    const maxLeftShift = spaceOnLeft - buffer;
                    translateX = Math.max(translateX, -maxLeftShift);
                } else if (spaceOnLeft < halfGrowth + buffer) {
                    const deficit = (halfGrowth + buffer) - spaceOnLeft;
                    translateX = deficit;
                    const maxRightShift = spaceOnRight - buffer;
                    translateX = Math.min(translateX, maxRightShift);
                }
                
                element.style.transform = `translateX(${translateX}px) scale(1.05)`;
                element.style.zIndex = '30';
                element.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }
        } else {
            element.style.transform = 'translateX(0) scale(1)';
            element.style.zIndex = '10';
            element.style.boxShadow = 'none';
            element.style.borderRadius = '';
        }
    }, [isMobile]);

    const handleCardClick = useCallback((dayNumber: number) => {
        // Don't navigate if it was a long press
        if (isLongPress.current) {
            isLongPress.current = false;
            return;
        }
        
        // Construct the URL for the day page
        const basePathParts = window.location.pathname.split('/');
        // Make sure we're always using the correct base path to avoid nested paths
        const basePath = basePathParts[0] === '' ? 
            basePathParts.slice(0, basePathParts.indexOf('itinerary') + 2).join('/') : 
            '/' + basePathParts.slice(0, basePathParts.indexOf('itinerary') + 2).join('/');
        
        const dayPath = `${basePath}/day/${dayNumber}`;
        
        // Use window.location for a full page reload instead of React Router navigation
        window.location.href = dayPath;
        
        // Alternatively, if you want to preserve React Router:
        // navigate(dayPath, { replace: true });
    }, []);

    const destinationTitle = useMemo(() => 
        itineraryD?.itinerary?.destination ? 
        itineraryD.itinerary.destination[0].toUpperCase() + itineraryD.itinerary.destination.slice(1) : 
        '',
        [itineraryD?.itinerary?.destination]
    );

    // Show skeleton if itineraries are null or itineraryD is undefined - AFTER all hooks
    if (!itineraries || !itineraryD) {
        return (
            <div className="bg-black min-h-screen w-full overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden opacity-50">
                    <Boxes />
                </div>

                <div className="relative z-10 min-h-screen w-full pointer-events-none mx-auto px-3 sm:px-4 py-6 sm:py-12">
                    {/* Header skeleton */}
                    <div className="text-center mb-8 sm:mb-12 pointer-events-auto">
                        <div className="mt-6 sm:mt-12">
                            <div className="h-8 sm:h-12 md:h-16 w-64 sm:w-96 bg-gray-800 rounded-lg animate-pulse mx-auto mb-2 sm:mb-3"></div>
                        </div>
                        <div className="h-4 sm:h-5 w-48 sm:w-80 bg-gray-800 rounded animate-pulse mx-auto"></div>
                    </div>

                    {/* Navigation controls skeleton */}
                    <div className="flex justify-between items-center mb-6 sm:mb-8 pointer-events-auto px-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-6 sm:h-8 w-16 sm:w-20 bg-gray-800 rounded animate-pulse"></div>
                            <div className="h-4 sm:h-5 w-8 sm:w-12 bg-gray-800 rounded animate-pulse"></div>
                        </div>

                        {/* Desktop navigation buttons skeleton */}
                        <div className="hidden sm:flex gap-3">
                            <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse"></div>
                            <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse"></div>
                        </div>

                        {/* Mobile swipe indicator skeleton */}
                        <div className="sm:hidden flex items-center gap-1">
                            <div className="w-4 h-4 bg-gray-800 rounded animate-pulse"></div>
                            <div className="w-8 h-3 bg-gray-800 rounded animate-pulse"></div>
                            <div className="w-4 h-4 bg-gray-800 rounded animate-pulse"></div>
                        </div>
                    </div>

                    {/* Card slider skeleton */}
                    <div className="relative pb-6 sm:pb-8 flex-1">
                        {/* Gradient overlays */}
                        <div className="absolute inset-y-0 left-0 w-6 sm:w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-6 sm:w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                        <div className="overflow-x-auto scrollbar-hide pb-4">
                            <div className="flex gap-2 sm:gap-6 px-2 sm:px-6 py-2 sm:py-4" style={{ width: 'max-content' }}>
                                {/* Skeleton cards */}
                                {[1, 2, 3].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0"
                                        style={{
                                            width: isMobile ? '220px' : '320px',
                                            minWidth: isMobile ? '220px' : '320px'
                                        }}
                                    >
                                        <div className="bg-gray-800/50 rounded-xl p-4 h-96 animate-pulse">
                                            {/* Card content skeleton */}
                                            <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
                                            <div className="space-y-3">
                                                <div className="h-4 w-full bg-gray-700 rounded"></div>
                                                <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                                                <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
                                            </div>
                                            <div className="mt-6 space-y-2">
                                                <div className="h-3 w-full bg-gray-700 rounded"></div>
                                                <div className="h-3 w-5/6 bg-gray-700 rounded"></div>
                                                <div className="h-3 w-4/5 bg-gray-700 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Day indicators skeleton */}
                        <div className="flex justify-center mt-4 sm:mt-6 gap-1.5 sm:gap-2 pointer-events-auto px-4">
                            {[1, 2, 3].map((_, index) => (
                                <div
                                    key={index}
                                    className="h-1 sm:h-1.5 w-6 sm:w-8 bg-gray-700 rounded-full animate-pulse"
                                />
                            ))}
                        </div>

                        {/* Mobile navigation buttons skeleton */}
                        {isMobile && (
                            <div className="flex justify-center gap-8 mt-6 pointer-events-auto">
                                <div className="w-12 h-12 bg-gray-800 rounded-full animate-pulse"></div>
                                <div className="w-12 h-12 bg-gray-800 rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen w-full overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden opacity-50">
                <Boxes />
            </div>

            <div className="relative z-10 min-h-screen w-full pointer-events-none mx-auto px-3 sm:px-4 py-6 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8 sm:mb-12 pointer-events-auto"
                >
                    <div className="mt-6 sm:mt-12">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 sm:mb-3 px-2">
                            Your {destinationTitle} Adventure
                        </h1>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto px-4">
                        Experience the best of {itineraryD.itinerary.destination} with our carefully crafted {itineraryD.itinerary.days.length}-day itinerary, designed to showcase the city's iconic landmarks and hidden gems.
                    </p>
                </motion.div>

                {/* Navigation controls */}
                <div className="flex justify-between items-center mb-6 sm:mb-8 pointer-events-auto px-2">
                    <motion.div
                        className="flex items-center gap-2 sm:gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.span className="text-lg sm:text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Day {activeCardIndex + 1}
                        </motion.span>
                        <span className="text-gray-400 text-sm sm:text-base">of {itineraryD.itinerary.days.length}</span>
                    </motion.div>

                    {/* Desktop navigation buttons */}
                    <div className="hidden sm:flex gap-3">
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

                    {/* Mobile swipe indicator */}
                    <div className="sm:hidden text-gray-400 text-xs flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        <span>Swipe</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>

                {/* Card slider */}
                <div className="relative pb-6 sm:pb-8 flex-1">
                    {/* Gradient overlays - smaller on mobile */}
                    <motion.div
                        className="absolute inset-y-0 left-0 w-6 sm:w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    />
                    <motion.div
                        className="absolute inset-y-0 right-0 w-6 sm:w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0 }}
                    />

                    <div
                        className="overflow-x-auto scrollbar-hide pb-4"
                        ref={sliderRef}
                        onTouchStart={(e) => handleTouchStart(e)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd()}
                        style={{ 
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        <div className="flex gap-2 sm:gap-6 px-2 sm:px-6 py-2 sm:py-4" style={{ width: 'max-content' }}> 
                            {itineraryD.itinerary.days.map((day: { day: number; }, index: number) => (
                                <motion.div
                                    key={day.day}
                                    data-card-index={index}
                                    className="flex-shrink-0 pointer-events-auto cursor-pointer select-none"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                    onClick={() => handleCardClick(day.day)}
                                    onMouseEnter={!isMobile ? (e) => handleCardInteraction(e.currentTarget, true) : undefined}
                                    onMouseLeave={!isMobile ? (e) => handleCardInteraction(e.currentTarget, false) : undefined}
                                    onTouchStart={(e) => {
                                        e.stopPropagation();
                                        handleTouchStart(e, index);
                                    }}
                                    onTouchMove={(e) => {
                                        e.stopPropagation();
                                        handleTouchMove(e);
                                    }}
                                    onTouchEnd={(e) => {
                                        e.stopPropagation();
                                        handleTouchEnd(index);
                                    }}
                                    style={{
                                        transformOrigin: 'center center',
                                        transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms ease',
                                        position: 'relative',
                                        zIndex: expandedMobileCard === index ? '30' : '10',
                                        willChange: 'transform',
                                        // Mobile: much smaller cards
                                        width: isMobile ? '220px' : 'auto',
                                        minWidth: isMobile ? '220px' : 'auto'
                                    }}
                                >
                                    <div 
                                        className={`transition-all duration-250 ${
                                            expandedMobileCard === index 
                                                ? 'transform scale-105 translate-y-1' 
                                                : ''
                                        }`}
                                        style={{
                                            transformOrigin: 'center top'
                                        }}
                                    >
                                        <DayCard
                                            itineraryIdx={itineraryIdx} 
                                            dayIdx={day.day - 1}  
                                        />
                                    </div>
                                    
                                    {/* Mobile long-press indicator */}
                                    {isMobile && (
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-60">
                                            Hold to expand
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Day indicators */}
                    <div className="flex justify-center mt-4 sm:mt-6 gap-1.5 sm:gap-2 pointer-events-auto px-4">
                        {itineraryD.itinerary.days.map((_: any, index: number) => (
                            <motion.button
                                key={`indicator-${index}`}
                                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${activeCardIndex === index
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 w-8 sm:w-12"
                                        : "bg-gray-700 hover:bg-gray-600 w-6 sm:w-8"
                                    }`}
                                onClick={() => handleIndicatorClick(index)}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + (index * 0.02) }}
                            />
                        ))}
                    </div>

                    {/* Mobile navigation buttons at bottom */}
                    {isMobile && (
                        <div className="flex justify-center gap-8 mt-6 pointer-events-auto">
                            <motion.button
                                className={`p-3 rounded-full ${activeCardIndex > 0
                                        ? "bg-blue-600/20 text-blue-400 active:bg-blue-600/30"
                                        : "bg-gray-800/30 text-gray-600"
                                    } transition-colors touch-manipulation`}
                                onClick={() => navigateSlider('prev')}
                                disabled={activeCardIndex === 0}
                                whileTap={activeCardIndex > 0 ? { scale: 0.95 } : {}}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </motion.button>

                            <motion.button
                                className={`p-3 rounded-full ${activeCardIndex < itineraryD.itinerary.days.length - 1
                                        ? "bg-blue-600/20 text-blue-400 active:bg-blue-600/30"
                                        : "bg-gray-800/30 text-gray-600"
                                    } transition-colors touch-manipulation`}
                                onClick={() => navigateSlider('next')}
                                disabled={activeCardIndex === itineraryD.itinerary.days.length - 1}
                                whileTap={activeCardIndex < itineraryD.itinerary.days.length - 1 ? { scale: 0.95 } : {}}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.button>
                        </div>
                    )}

                    {/* Mobile instruction overlay for first visit */}
                    {isMobile && activeCardIndex === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 text-center pointer-events-none z-40"
                        >
                            <div className="text-white text-sm mb-2">💡 Pro tip</div>
                            <div className="text-gray-300 text-xs">
                                Swipe left/right to navigate<br/>
                                Hold a card to expand it
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

