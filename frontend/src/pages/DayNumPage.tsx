import ParentMap from "@/components/ParentMap"
import {DayNumCompo} from "../components/DayNumCompo"
import { useRef, useState, useEffect } from "react"
import Weather from "@/components/ui/weather"
import ChatbotD from "@/components/landingPage/features/Chatbotdaycard"
import { Navbar } from "@/components/Navbar"

export const DayNumPage = () => {
    const chatbotRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [leftWidth, setLeftWidth] = useState(60) // Initial width percentage for left column
    const [isDragging, setIsDragging] = useState(false)
    
    // Handle mouse events for resizing
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return
            
            const containerRect = containerRef.current.getBoundingClientRect()
            const containerWidth = containerRect.width
            const mouseX = e.clientX - containerRect.left
            
            // Calculate percentage (with bounds to prevent columns from getting too small)
            let newLeftWidth = (mouseX / containerWidth) * 100
            newLeftWidth = Math.max(30, Math.min(70, newLeftWidth)) // Keep between 30% and 70%
            
            setLeftWidth(newLeftWidth)
        }
        
        const handleMouseUp = () => {
            setIsDragging(false)
        }
        
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])
    
    // Calculate right width as complement to 100%
    const rightWidth = 100 - leftWidth
    
    return(
        <div className="flex flex-col min-h-screen bg-black">
            {/* Navbar*/}
            <Navbar />
            
            {/* Main content - positioned below navbar with proper spacing */}
            <div className="flex-grow mt-18 p-2 sm:p-4">
                {/* Use a container for the resizable grid */}
                <div ref={containerRef} className="relative flex flex-col lg:flex-row w-full gap-4 h-full">
                    {/* Left column */}
                    <div 
                        className="w-full lg:w-auto" 
                        style={{ flex: `0 0 ${leftWidth}%` }}
                    >
                        <DayNumCompo />
                    </div>
                    
                    {/* Resizer handle */}
                    <div 
                        className="hidden lg:block absolute top-0 bottom-0 w-4 cursor-col-resize z-10"
                        style={{ left: `calc(${leftWidth}% - 8px)` }}
                        onMouseDown={handleMouseDown}
                    >
                        <div className="h-full w-1 mx-auto bg-blue-500 rounded opacity-0 hover:opacity-100 transition-opacity"></div>
                    </div>
                    
                    {/* Right column - Map and information */}
                    <div 
                        className="w-full lg:w-auto flex flex-col gap-4 overflow-hidden border border-zinc-800 rounded-lg p-3" 
                        style={{ flex: `0 0 ${rightWidth}%` }}
                    >   
                        {/* Weather */}
                        <div className="w-full">
                            <Weather/>
                        </div>   

                        {/* Map container */}
                        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-zinc-800">
                            <div className="w-full h-full translate-x-1">
                                <ParentMap />
                            </div>
                        </div>
                        
                        {/* Enhanced Paris description with blue-lavender gradient theme */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-gray-300 p-5 rounded-lg border border-blue-500/20 shadow-lg shadow-blue-900/10">
                            {/* Heading with gradient */}
                            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center">
                                <span className="inline-block w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 mr-2 rounded-full"></span>
                                About Paris
                            </h3>
                            
                            {/* Decorative divider */}
                            <div className="h-px w-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-transparent mb-4"></div>
                            
                            {/* Enhanced paragraph with better spacing and readability */}
                            <p className="leading-relaxed text-gray-300 space-y-1 text-base">
                                <span className="block mb-2">
                                    Paris, the <span className="text-blue-300">"City of Light,"</span> is a timeless destination known for its rich history, iconic landmarks, and vibrant culture.
                                </span>
                                
                                <span className="block mb-2">
                                    The Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral captivate visitors, while charming cafés, Seine River cruises, and lively streets offer an unforgettable experience.
                                </span>
                                
                                <span className="block mb-2">
                                    Paris is a paradise for <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">art lovers, food enthusiasts, and fashion aficionados</span>, boasting world-class museums, gourmet cuisine, and luxury shopping.
                                </span>
                                
                                <span className="block">
                                    While the city's beauty is undeniable, it can be crowded, expensive, and tourist-heavy. However, the enchanting ambiance, romantic architecture, and cultural depth make it a must-visit. Whether exploring Montmartre's artistic charm or indulging in French pastries, Paris leaves a lasting impression.
                                </span>
                            </p>
                        </div>
                        
                        {/* Chatbot section */}
                        <div ref={chatbotRef} className="w-full min-w-0">
                            <ChatbotD chatbotRef={chatbotRef} placeId="" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Add cursor styling when dragging */}
            {isDragging && (
                <div className="fixed inset-0 bg-transparent cursor-col-resize z-50" />
            )}
        </div>
    )
}