import {motion} from "framer-motion";
import {cn} from "@/lib/utils";
import {useState, useEffect, useRef} from "react";
import {AnimatePresence} from "framer-motion";
import { useSelector } from "react-redux";

// interface DayCardProps {
//     day: number;
//     date: string;
//     title: string;
//     description: string;
//     images: string[];
//     placesVisited: string[];
// }

export const DayCard = ({itineraryIdx,dayIdx}: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const [loadingImage, setLoadingImage] = useState<number | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [limitedImages, setLimitedImages] = useState<{url: string, placeIndex: number}[]>([]);

    const itineraries=useSelector((state: any) => state.itinerary.itineraries);
    const places=useSelector((state: any) => state.place.places);

    console.log("itineraries in daycard",itineraries);
    console.log("places in daycard",places);

    const itinerary = itineraries[itineraryIdx];
    const placesforeachday = places[itineraryIdx][dayIdx];
    console.log("placeforeachday",placesforeachday);
    
    // Collect all images from all places for this day into a single flat array
    // Now also track which place each image belongs to
    const resizeGoogleImage = (url: string): string => {
        // Check if it's a Google image URL
        if (url.includes('googleusercontent.com') && !url.includes('=s')) {
            // Append a small size parameter (s400 = 400px width)
            return `${url}=s400-c`;  // s400-c means 400px with cropping
        }
        return url;
    };

    // Improved Google image resizing with fallback size options
    ;

    // Collect all images from all places (without limiting)
    useEffect(() => {
        const newAllImages: {url: string, placeIndex: number}[] = [];
        
        // Process all photos from all places
        placesforeachday.forEach((place: any, placeIdx: number) => {
            if (place.photos && Array.isArray(place.photos)) {
                place.photos.forEach((photo: any) => {
                    newAllImages.push({
                        url: resizeGoogleImage(photo), // Still resize for better performance
                        placeIndex: placeIdx
                    });
                });
            }
        });
        
        // Set all images without limiting
        setLimitedImages(newAllImages);
        
        // Reset loaded image states when images change
        setLoadedImages(new Set());
        setImageErrors(new Set());
        setLoadingImage(null);
    }, [placesforeachday]);

    // Ensure currentImageIndex stays within limits
    useEffect(() => {
        if (limitedImages.length > 0 && currentImageIndex >= limitedImages.length) {
            setCurrentImageIndex(0);
        }
    }, [limitedImages, currentImageIndex]);

    // Update the place index when the image changes
    useEffect(() => {
        if (limitedImages.length > 0 && currentImageIndex < limitedImages.length) {
            setCurrentPlaceIndex(limitedImages[currentImageIndex].placeIndex);
        }
    }, [currentImageIndex, limitedImages]);

    // Auto-rotate images when card is expanded - with longer delay
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (isHovered && limitedImages.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % limitedImages.length);
            }, 5000); // Increased to 5 seconds between rotations
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovered, limitedImages.length]);
    
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

    // Load the current image if it's not loaded yet
    useEffect(() => {
        // Don't try to load if we're already loading an image
        if (loadingImage !== null) return;
        
        // Don't try to load if there are no images
        if (limitedImages.length === 0) return;
        
        // Don't try to load if the current image is already loaded
        if (loadedImages.has(currentImageIndex)) return;
        
        // Don't try to load if the current image had an error recently
        if (imageErrors.has(currentImageIndex)) return;
        
        // Add a significant delay before starting to load to avoid rate limiting
        const loadTimer = setTimeout(() => {
            setLoadingImage(currentImageIndex);
        }, 1000); // 1 second delay before starting to load
        
        return () => clearTimeout(loadTimer);
    }, [currentImageIndex, loadedImages, loadingImage, limitedImages.length, imageErrors]);

    // Handle image load success
    const handleImageLoaded = (idx: number) => {
        setLoadedImages(prev => new Set(prev).add(idx));
        setLoadingImage(null);
    };

    // Improved error handling with longer backoff
    const handleImageError = (idx: number) => {
        console.log(`Error loading image at index ${idx}`);
        setImageErrors(prev => new Set(prev).add(idx));
        setLoadingImage(null);
        
        // Try again with a much longer delay if it's the current image
        if (idx === currentImageIndex && !intervalRef.current) {
            intervalRef.current = setTimeout(() => {
                setImageErrors(prev => {
                    const newErrors = new Set(prev);
                    newErrors.delete(idx);
                    return newErrors;
                });
                setLoadedImages(prev => {
                    const newLoaded = new Set(prev);
                    newLoaded.delete(idx);
                    return newLoaded;
                });
                intervalRef.current = null;
            }, 15000); // 15 seconds before retrying - much longer to avoid rate limits
        }
    };

    // Clean up retry timeout on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

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
                    ? "0 0 60px rgba(121, 113, 234, 0.3)" 
                    : "0 0 30px rgba(121, 113, 234, 0.15)"
            }}
        >
            {/* Enhanced glass-like border with subtle glow */}
            <div className="absolute inset-0 rounded-xl border border-white/10 z-50 pointer-events-none">
                <div className="absolute inset-0 rounded-xl opacity-50 blur-sm" 
                    style={{
                        background: "radial-gradient(circle at top right, rgba(121, 113, 234, 0.15), transparent 70%)"
                    }}
                />
            </div>
            
            {/* Background glow and gradient effect with enhanced animation */}
            <motion.div 
                className="absolute inset-0 z-10"
                animate={{ 
                    background: isHovered 
                        ? "linear-gradient(to right, rgba(85, 91, 255, 0.2), rgba(177, 156, 217, 0.2))"
                        : "linear-gradient(to right, rgba(85, 91, 255, 0.1), rgba(177, 156, 217, 0.1))"
                }}
                transition={{ duration: 0.8 }}
            />
            
            {/* Base image or slider with overlay */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                {/* Enhanced gradient overlay for better image visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 z-10"></div>
                <AnimatePresence>
                    {limitedImages.length > 0 ? (
                        limitedImages.map((image, idx) => (
                            <motion.div 
                                key={`img-${idx}`}
                                className="absolute inset-0 w-full h-full"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ 
                                    opacity: currentImageIndex === idx ? 1 : 0,
                                    scale: currentImageIndex === idx ? 1 : 1.1
                                }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            >
                                {/* Only render the current image to avoid loading all at once */}
                                {currentImageIndex === idx ? (
                                    <>
                                        {/* Show a loading or error placeholder */}
                                        {(!loadedImages.has(idx) || imageErrors.has(idx)) && (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                {imageErrors.has(idx) ? (
                                                    <div className="text-white/70 flex flex-col items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        <p className="text-sm">Image temporarily unavailable</p>
                                                        <p className="text-xs text-indigo-300 mt-1">Limiting requests to avoid rate limiting</p>
                                                    </div>
                                                ) : (
                                                    <div className="h-8 w-8 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* The actual image that gets loaded */}
                                        <img 
                                            src={image.url} 
                                            alt={`Day ${dayIdx} - Place ${image.placeIndex + 1}`}
                                            className="w-full h-full object-cover"
                                            style={{ 
                                                objectPosition: "center",
                                                display: imageErrors.has(idx) ? 'none' : 'block'
                                            }}
                                            loading="lazy"
                                            onLoad={() => handleImageLoaded(idx)}
                                            onError={() => handleImageError(idx)}
                                        />
                                    </>
                                ) : (
                                    // Do not render anything for non-visible images
                                    null
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <p className="text-white/50">No images available</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            
            
            {/* Content container */}
            <div className="relative z-20 h-full w-full flex">
                {/* Small card content (always visible) with enhanced styling */}
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
                                className="bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full px-4 py-1.5 text-sm font-bold text-white flex items-center gap-1.5 shadow-lg shadow-indigo-900/20"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(121, 113, 234, 0.5)" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                                </svg>
                                DAY {dayIdx+1}
                            </motion.div>
                            <motion.span 
                                className="text-blue-100 text-sm font-medium px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-800/40 shadow-inner shadow-indigo-500/10"
                                whileHover={{ y: -2, boxShadow: "0 4px 10px rgba(121, 113, 234, 0.3)" }}
                            >
                                {itinerary?.date || `Day ${dayIdx+1}`}
                            </motion.span>
                        </div>
                        
                        <motion.h2
                            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 text-2xl font-bold mb-3"
                            initial={{ opacity: 0.9 }}
                            whileHover={{ opacity: 1, scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            {itinerary?.title || `Day ${dayIdx+1} Adventure`}
                        </motion.h2>
                        
                        <p className="text-gray-100 text-sm leading-relaxed mb-4 line-clamp-3 max-w-[370px]">
                            {itinerary?.description || "Explore amazing places and create unforgettable memories on this wonderful journey."}
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center text-sm text-indigo-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{placesforeachday.length} Iconic Locations</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-purple-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Full Day Experience</span>
                        </div>
                    </div>
                </motion.div>
                
                {/* Expanded content (visible on hover) with enhanced styling */}
                <motion.div 
                    className="flex-grow p-7 text-white flex flex-col bg-gradient-to-l from-black/80 via-black/50 to-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                        opacity: isHovered ? 1 : 0,
                        x: isHovered ? 0 : -20,
                        pointerEvents: isHovered ? "auto" : "none",
                        display: isHovered ? "flex" : "none" // Prevents layout issues
                    }}
                    transition={{ delay: isHovered ? 0.2 : 0, duration: 0.5 }}
                    style={{ backdropFilter: "none" }}
                >
                    <div>
                        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 text-xl font-semibold mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Today's Journey
                        </h3>
                        
                        {/* Enhanced scrollbar styling */}
                        <style>
                            {`
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 4px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: rgba(255, 255, 255, 0.05);
                                    border-radius: 10px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: linear-gradient(to bottom, #8b5cf6, #6366f1);
                                    border-radius: 10px;
                                }
                            `}
                        </style>
                        
                        <ul className="space-y-2 max-h-[240px] overflow-y-auto pr-3 custom-scrollbar">
                            {placesforeachday.map((place, idx) => (
                                <motion.li 
                                    key={place.id || idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ 
                                        opacity: isHovered ? 1 : 0, 
                                        x: isHovered ? 0 : -10,
                                        scale: currentPlaceIndex === idx ? 1.03 : 1,
                                        backgroundColor: currentPlaceIndex === idx ? "rgba(121, 113, 234, 0.1)" : "transparent"
                                    }}
                                    transition={{ 
                                        delay: isHovered ? 0.3 + (idx * 0.08) : 0,
                                        scale: { duration: 0.3 },
                                        backgroundColor: { duration: 0.3 }
                                    }}
                                    className={`flex items-start gap-3 group mb-2 pl-2 py-1 pr-1 rounded-md ${
                                        currentPlaceIndex === idx ? "bg-indigo-900/10 ring-1 ring-indigo-400/20" : ""
                                    }`}
                                    whileHover={{ x: 3 }}
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className={`flex items-center justify-center h-7 w-7 rounded-full shadow-md flex-shrink-0 ${
                                            currentPlaceIndex === idx 
                                                ? "bg-gradient-to-br from-indigo-400 to-purple-500" 
                                                : "bg-gradient-to-br from-indigo-500/80 to-purple-600/80"
                                        } text-white font-medium text-sm transition-all duration-300 group-hover:scale-110`}>{idx + 1}</div>
                                    </div>
                                    <span 
                                        className={`font-medium text-lg transition-all duration-200 pt-0.5 leading-tight ${
                                            currentPlaceIndex === idx 
                                                ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200" 
                                                : "text-white group-hover:text-indigo-300"
                                        }`}
                                    >
                                        {place.displayName} 
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-center">
                        <motion.button 
                            className="py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-900/20"
                            whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(121, 113, 234, 0.5)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            View Full Itinerary
                        </motion.button>
                        
                        <motion.div 
                            className="flex items-center gap-1 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full border border-white/5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span className="text-xs text-gray-300">Image</span>
                            <span className="text-xs font-medium text-white">{currentImageIndex + 1}/{limitedImages.length}</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            
            {/* Enhanced Image navigation controls */}
            {isHovered && limitedImages.length > 1 && (
                <>
                    {/* Previous button with improved styling */}
                    <motion.button
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm p-2 text-white z-40 hover:bg-black/60 border border-white/10 shadow-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => (prev - 1 + limitedImages.length) % limitedImages.length);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </motion.button>
                    
                    {/* Next button with improved styling */}
                    <motion.button
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm p-2 text-white z-40 hover:bg-black/60 border border-white/10 shadow-lg"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => (prev + 1) % limitedImages.length);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </motion.button>
                </>
            )}
            
            {/* Redesigned image indicator dots with proper spacing */}
            {isHovered && limitedImages.length > 1 && (
                <div className="absolute bottom-4 right-4 z-40">
                    {limitedImages.length <= 8 ? (
                        // Show dots for 8 or fewer images
                        <div className="flex space-x-1.5 px-3 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                            {limitedImages.map((_, idx) => (
                                <motion.button
                                    key={`dot-${idx}`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`h-2 w-2 rounded-full ${
                                        currentImageIndex === idx 
                                            ? "bg-gradient-to-r from-indigo-400 to-purple-400" 
                                            : "bg-white/30 hover:bg-white/50"
                                    }`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.5 }}
                                    transition={{ delay: 0.4 + (idx * 0.05) }}
                                />
                            ))}
                        </div>
                    ) : (
                        // Show compact numbered indicator for more than 8 images
                        <motion.div 
                            className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 flex items-center gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {/* Mini pagination dots for visual context */}
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, idx) => {
                                    // Calculate position for mini dots
                                    const position = Math.min(
                                        Math.max(0, currentImageIndex - 2 + idx),
                                        limitedImages.length - 1
                                    );
                                    const isActive = position === currentImageIndex;
                                    
                                    return (
                                        <motion.button
                                            key={`minidot-${idx}`}
                                            onClick={() => setCurrentImageIndex(position)}
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                isActive 
                                                    ? "bg-gradient-to-r from-indigo-400 to-purple-400" 
                                                    : "bg-white/30"
                                            }`}
                                            whileHover={{ scale: 1.3 }}
                                        />
                                    );
                                })}
                            </div>
                            
                            <span className="text-xs font-medium text-white">
                                {currentImageIndex + 1}/{limitedImages.length}
                            </span>
                        </motion.div>
                    )}
                </div>
            )}
            
            {/* Add more informative loading status */}
            {isHovered && (
                <div className="absolute top-4 left-4 z-40 bg-black/50 backdrop-blur-sm rounded-lg py-1.5 px-3 text-xs text-white border border-white/10 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${imageErrors.has(currentImageIndex) ? "bg-red-400" : loadedImages.has(currentImageIndex) ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`}></div>
                    {loadedImages.size} of {limitedImages.length} loaded
                    {loadingImage !== null && " • Loading..."}
                    {imageErrors.size > 0 && ` • ${imageErrors.size} error(s)`}
                </div>
            )}
            
            {/* Add rate-limiting information */}
            {imageErrors.size > 0 && (
                <div className="absolute bottom-4 left-4 z-40 bg-black/80 backdrop-blur-sm rounded-lg py-1.5 px-3 text-xs text-red-300 border border-red-900/30">
                    <p>Rate limited by Google - showing limited images</p>
                </div>
            )}
        </motion.div>
    );
};