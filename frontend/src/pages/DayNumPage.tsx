import ParentMap from "@/components/ParentMap"
import {DayNumCompo} from "../components/DayNumCompo"
import { useRef, useState, useEffect } from "react"
import Weather from "@/components/ui/weather"
import ChatbotD from "@/components/landingPage/features/Chatbotdaycard"

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
        <div className="bg-black">
            {/* Navbar */}
            <div className="min-h-screen p-2 sm:p-4">
                {/* Use a container for the resizable grid */}
                <div ref={containerRef} className="relative flex flex-col lg:flex-row w-full gap-4">
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
    className="w-full lg:w-auto flex flex-col gap-4 overflow-hidden border border-zinc-800" 
    style={{ flex: `0 0 ${rightWidth}%` }}
>   
    {/* Weather */}
    <div className="w-full ">
            <Weather/>
        </div>   

    {/* Map container */}
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-zinc-800">
    <div className="w-full h-full translate-x-1">
        <ParentMap />
        
    </div>
</div>
    
    {/* Paris description */}
    <div className="bg-zinc-900 text-gray-300 p-4 rounded-lg border border-zinc-800 text-lg">
        <h3 className="text-lg font-bold mb-2 text-blue-400">About Paris</h3>
        <p className="leading-relaxed text-justify break-words">
            Paris, the "City of Light," is a timeless destination known for its rich history, iconic landmarks, and vibrant culture. The Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral captivate visitors, while charming cafés, Seine River cruises, and lively streets offer an unforgettable experience. Paris is a paradise for art lovers, food enthusiasts, and fashion aficionados, boasting world-class museums, gourmet cuisine, and luxury shopping. While the city's beauty is undeniable, it can be crowded, expensive, and tourist-heavy. However, the enchanting ambiance, romantic architecture, and cultural depth make it a must-visit. Whether exploring Montmartre's artistic charm or indulging in French pastries, Paris leaves a lasting impression.
        </p>
    </div>
    
    {/* Chatbot section */}
    <div ref={chatbotRef} className="w-full min-w-0">
        <ChatbotD chatbotRef={chatbotRef} />
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