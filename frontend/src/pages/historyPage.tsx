import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function HistoryPage() {
    const itineraries = useSelector((state: any) => state.itinerary.itineraries);
    
    // Default to showing the most recent itinerary if available
    const [selectedItineraryIndex, setSelectedItineraryIndex] = useState(0);
    
    if (!itineraries || itineraries.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-blue-500/20">
                    <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">No Itineraries Found</h2>
                    <p className="text-gray-400 mb-6">
                        You haven't created any itineraries yet.
                    </p>
                </div>
            </div>
        );
    }
    
    const selectedItinerary = itineraries[selectedItineraryIndex]?.itinerary;
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full"
            >
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Your Travel History
                </h1>
                
                {itineraries.length > 1 && (
                    <div className="flex justify-center mb-6 gap-2">
                        {itineraries.map((_, index) => (
                            <motion.button
                                key={`indicator-${index}`}
                                className={`w-8 h-1.5 rounded-full transition-all ${
                                    selectedItineraryIndex === index
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 w-12"
                                        : "bg-gray-700 hover:bg-gray-600"
                                }`}
                                onClick={() => setSelectedItineraryIndex(index)}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                            />
                        ))}
                    </div>
                )}
                
                {/* Container for card and navigation buttons */}
                <div className="relative">
                    {/* Navigation Buttons - Now outside the card */}
                    {itineraries.length > 1 && (
                        <>
                            {/* Previous Button */}
                            <motion.button
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-16 w-12 h-12 rounded-full bg-black/30 border border-blue-500/20 backdrop-blur-sm text-white flex items-center justify-center shadow-lg z-20"
                                onClick={() => setSelectedItineraryIndex(prev => (prev === 0 ? itineraries.length - 1 : prev - 1))}
                                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <ChevronLeftIcon className="w-6 h-6" />
                            </motion.button>
                            
                            {/* Next Button */}
                            <motion.button
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16 w-12 h-12 rounded-full bg-black/30 border border-blue-500/20 backdrop-blur-sm text-white flex items-center justify-center shadow-lg z-20"
                                onClick={() => setSelectedItineraryIndex(prev => (prev === itineraries.length - 1 ? 0 : prev + 1))}
                                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <ChevronRightIcon className="w-6 h-6" />
                            </motion.button>
                        </>
                    )}
                    
                    <motion.div 
                        layoutId="card"
                        className="relative overflow-hidden rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-xl"
                    >
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/90 to-gray-800/70 z-0"></div>
                        
                        {/* Animated glow effects */}
                        <motion.div 
                            className="absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl z-0"
                            animate={{ 
                                x: [0, 30, 0], 
                                y: [0, 20, 0],
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 8, 
                                ease: "easeInOut" 
                            }}
                        />
                        <motion.div 
                            className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl z-0"
                            animate={{ 
                                x: [0, -30, 0], 
                                y: [0, -20, 0],
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 10, 
                                ease: "easeInOut" 
                            }}
                        />
                        
                        {/* Card content */}
                        <div className="relative z-10 p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                {/* Left column */}
                                <div className="flex-1">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-6"
                                    >
                                        <h2 className="text-4xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 capitalize">
                                            {selectedItinerary?.destination}
                                        </h2>
                                        <p className="text-gray-400 text-lg">
                                            {selectedItinerary?.number_of_days} Days of Adventure
                                        </p>
                                    </motion.div>
                                    
                                    <div className="space-y-6">
                                        {[
                                            { 
                                                icon: "👥", 
                                                label: "Travelers", 
                                                value: selectedItinerary?.number_of_persons 
                                            },
                                            { 
                                                icon: "📅", 
                                                label: "Start Date", 
                                                value: selectedItinerary?.start_date 
        ? new Date(selectedItinerary.start_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : "Not specified" 
                                            },
                                            { 
                                                icon: "💰", 
                                                label: "Budget", 
                                                value: `${selectedItinerary?.currency || "₹"}${selectedItinerary?.budget?.toLocaleString() || 0}` 
                                            }
                                        ].map((item, index) => (
                                            <motion.div 
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + (index * 0.1) }}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/30 shadow-lg">
                                                    <span className="text-xl">{item.icon}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-gray-400 text-sm font-medium">{item.label}</h3>
                                                    <p className="text-white text-lg font-bold">{item.value}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Right column */}
                                <div className="flex-1">
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="bg-black/30 border border-blue-500/20 rounded-xl p-5 mb-6"
                                    >
                                        <h3 className="text-lg font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                                            Budget Summary
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Total Budget Used:</span>
                                                <span className="font-bold text-white">{selectedItinerary?.total_budget_used || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Remaining Budget:</span>
                                                <span className="font-bold text-green-400">{selectedItinerary?.remaining_budget || "N/A"}</span>
                                            </div>
                                            
                                            {/* Budget progress bar */}
                                            <div className="mt-3 pt-3 border-t border-gray-700">
                                                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                        initial={{ width: "0%" }}
                                                        animate={{ 
                                                            width: selectedItinerary?.total_budget_used 
                                                                ? `${(parseInt(selectedItinerary.total_budget_used.replace(/[^\d]/g, '')) / selectedItinerary.budget) * 100}%` 
                                                                : "0%" 
                                                        }}
                                                        transition={{ delay: 0.8, duration: 1.2 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    {selectedItinerary?.interests && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <h3 className="text-lg font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                                                Interests
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedItinerary.interests.split(',').map((interest, index) => (
                                                    <motion.span 
                                                        key={interest}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.8 + (index * 0.1) }}
                                                        className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm border border-blue-500/30"
                                                    >
                                                        {interest.trim()}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                            
                            {/* View details button */}
                            <motion.div 
                                className="mt-8 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                <motion.button
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    View Full Itinerary Details
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}