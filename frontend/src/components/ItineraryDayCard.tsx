import {motion} from "framer-motion";
import {cn} from "@/lib/utils";
import {useState, useEffect, useRef} from "react";
import {AnimatePresence} from "framer-motion";

interface DayCardProps {
    day: number;
    date: string;
    title: string;
    description: string;
    images: string[];
    placesVisited: string[];
}

export const DayCard = ({ day, date, title, description, images, placesVisited }: DayCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Auto-rotate images when card is expanded
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (isHovered && images.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % images.length);
            }, 3000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovered, images.length]);
    const handleHoverStart = () => {
        // Set a timeout for 1 second before expanding
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(true);
            hoverTimeoutRef.current = null;
        }, 1000);
    };
    const handleHoverEnd = () => {
        // Clear the timeout if it exists
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        // Reset hover state
        setIsHovered(false);
    };
    // Fixed height for both collapsed and expanded states
    const cardHeight = 360; // Increased height to show more of the image

    return (
        <motion.div
            className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer",
                isHovered ? "w-[850px]" : "w-[420px]"
            )}
            initial={{ height: cardHeight }}
            animate={{ 
                height: cardHeight, // Keep height constant
                width: isHovered ? 850 : 420,
                transition: { 
                    type: "spring",
                    stiffness: 70,
                    damping: 20
                }
            }}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            style={{
                boxShadow: isHovered 
                    ? "0 0 60px rgba(79, 70, 229, 0.3)" 
                    : "0 0 30px rgba(79, 70, 229, 0.15)"
            }}
        >
            {/* Glass-like border for better blending */}
            <div className="absolute inset-0 rounded-xl border border-white/10 z-50 pointer-events-none"></div>
            
            {/* Background glow and gradient effect */}
            <motion.div 
                className="absolute inset-0 z-10"
                animate={{ 
                    background: isHovered 
                        ? "linear-gradient(to right, rgba(30, 64, 175, 0.2), rgba(109, 40, 217, 0.2))"
                        : "linear-gradient(to right, rgba(30, 64, 175, 0.1), rgba(109, 40, 217, 0.1))"
                }}
                transition={{ duration: 0.8 }}
            />
            
            {/* Base image or slider with overlay */}
            <div className="absolute inset-0 w-full h-full z-0">
                {/* Reduced opacity overlay for better image visibility */}
                <div className="absolute inset-0 bg-black/20 z-10"></div> {/* Reduced opacity further */}
                <AnimatePresence>
                    {images.map((src, idx) => (
                        <motion.div 
                            key={src}
                            className="absolute inset-0 w-full h-full"
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: currentImageIndex === idx ? 1 : 0,
                                scale: currentImageIndex === idx ? 1 : 1.1
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2 }}
                        >
                            <img 
                                src={src} 
                                alt={`Day ${day} - ${placesVisited[idx] || title}`}
                                className="w-full h-full object-cover"
                                // Removed objectPosition to show the full image
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            {/* Content container */}
            <div className="relative z-20 h-full w-full flex">
                {/* Small card content (always visible) */}
                <motion.div 
                    className={cn(
                        "flex-shrink-0 p-6 flex flex-col justify-between h-full",
                        isHovered 
                            ? "w-[380px] bg-gradient-to-r from-black/80 via-black/70 to-transparent" 
                            : "w-[420px] bg-gradient-to-br from-black/80 to-black/50"
                    )}
                    animate={{
                        background: isHovered 
                            ? "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7), transparent)"
                            : "linear-gradient(to bottom right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5))"
                    }}
                    style={{ backdropFilter: "none" }}
                >
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <motion.div 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-4 py-1.5 text-sm font-bold text-white flex items-center gap-1.5 shadow-lg shadow-blue-900/20"
                                whileHover={{ scale: 1.05 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                                </svg>
                                DAY {day}
                            </motion.div>
                            <motion.span 
                                className="text-blue-100 text-sm font-medium px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800/40 shadow-inner shadow-blue-500/10"
                                whileHover={{ y: -2 }}
                            >
                                {date}
                            </motion.span>
                        </div>
                        
                        <motion.h2
                            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 text-2xl font-bold mb-3"
                        >
                            {title}
                        </motion.h2>
                        
                        <p className="text-gray-100 text-sm leading-relaxed mb-4 line-clamp-3 max-w-[370px]">
                            {description}
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center text-sm text-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{placesVisited.length} Iconic Locations</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-purple-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Full Day Experience</span>
                        </div>
                    </div>
                </motion.div>
                
                {/* Expanded content (visible on hover) */}
                <motion.div 
                    className="flex-grow p-7 text-white flex flex-col bg-gradient-to-l from-black/80 via-black/50 to-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                        opacity: isHovered ? 1 : 0,
                        x: isHovered ? 0 : -20,
                        pointerEvents: isHovered ? "auto" : "none"
                    }}
                    transition={{ delay: isHovered ? 0.2 : 0, duration: 0.5 }}
                    style={{ backdropFilter: "none" }}
                >
                    <div>
                        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 text-xl font-semibold mb-3">
                            Today's Journey
                        </h3>
                        <ul className="space-y-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                            {placesVisited.map((place, idx) => (
                                <motion.li 
                                    key={place}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ 
                                        opacity: isHovered ? 1 : 0, 
                                        x: isHovered ? 0 : -10 
                                    }}
                                    transition={{ delay: isHovered ? 0.3 + (idx * 0.08) : 0 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className={`flex items-center justify-center h-7 w-7 rounded-full shadow-md ${
                                        idx % 4 === 0 ? "bg-gradient-to-br from-blue-500 to-blue-700" : 
                                        idx % 4 === 1 ? "bg-gradient-to-br from-purple-500 to-purple-700" : 
                                        idx % 4 === 2 ? "bg-gradient-to-br from-indigo-500 to-indigo-700" :
                                        "bg-gradient-to-br from-violet-500 to-violet-700"
                                    } text-white font-medium text-sm`}>{idx + 1}</div>
                                    <span className="font-medium text-lg">{place}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-center">
                        <motion.button 
                            className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20"
                            whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(79, 70, 229, 0.5)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            View Full Itinerary
                        </motion.button>
                        
                        <motion.div 
                            className="flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span className="text-xs text-gray-300">Image</span>
                            <span className="text-xs font-medium text-white">{currentImageIndex + 1}/{images.length}</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            
            {/* Image navigation controls */}
            {isHovered && images.length > 1 && (
                <>
                    {/* Previous button */}
                    <motion.button
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 backdrop-blur-sm p-2 text-white z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </motion.button>
                    
                    {/* Next button */}
                    <motion.button
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 backdrop-blur-sm p-2 text-white z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => (prev + 1) % images.length);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </motion.button>
                </>
            )}
            
            {/* Image indicator dots with increased size for better visibility */}
            {isHovered && images.length > 1 && (
                <div className="absolute bottom-4 right-4 z-30 flex space-x-2">
                    {images.map((_, idx) => (
                        <motion.button
                            key={`dot-${idx}`}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-3 w-3 rounded-full shadow-md ${
                                currentImageIndex === idx 
                                    ? "bg-gradient-to-r from-blue-400 to-purple-400" 
                                    : "bg-white/50"
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.3 }}
                            transition={{ delay: 0.4 + (idx * 0.05) }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};