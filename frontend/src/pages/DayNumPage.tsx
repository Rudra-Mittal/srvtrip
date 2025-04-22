import ParentMap from "@/components/ParentMap"
import { DayNumCompo } from "../components/DayNumCompo"
import { useRef, useState, useEffect } from "react"
import Weather from "@/components/ui/weather"
import ChatbotD from "@/components/landingPage/features/Chatbotdaycard"
import { Navbar } from "@/components/Navbar"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import Summary from "@/components/summary"

export const DayNumPage = () => {
    const { itineraryNum, dayNum } = useParams()
    const itinerarynumber = parseInt(itineraryNum || "0", 10)
    const daynumber = parseInt(dayNum || "0", 10)
    console.log(itineraryNum, dayNum)
    const chatbotRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [leftWidth, setLeftWidth] = useState(60) // Initial width percentage for left column
    const [isDragging, setIsDragging] = useState(false)
    const itinerary = useSelector((state: any) => state.itinerary.itineraries);
    const days = (itinerary)?itinerary[parseInt(itineraryNum || "0", 10) - 1]?.itinerary?.days?.length || 0:0;
    console.log("days", days)
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
    if(!itinerary){
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-white">Loading...</div>
            </div>
        )
    }
    return (
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
                        <DayNumCompo dayNum={daynumber} itineraryNum={itinerarynumber} />
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
                            <Weather />
                        </div>

                        {/* Map container */}
                        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-zinc-800">
                            <div className="w-full h-full translate-x-1">
                                <ParentMap dayNum={dayNum} itineraryNum={itineraryNum} />
                            </div>
                        </div>

                        {/* Enhanced Paris description with blue-lavender gradient theme */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-gray-300 p-5 rounded-lg border border-blue-500/20 shadow-lg shadow-blue-900/10">
                            {/* Heading with gradient */}
                            <Summary dayNum={daynumber} itineraryNum={itinerarynumber}/>
                        </div>

                        {/* Day Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() => {
                                    if (parseInt(dayNum!) > 1) {
                                        window.location.href = `/itinerary/${itineraryNum}/day/${parseInt(dayNum!) - 1}`;
                                    }
                                }}
                                disabled={parseInt(dayNum!) <= 1}
                                className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-white font-medium transition-all ${parseInt(dayNum!) <= 1
                                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/30"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-blue-500/20"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Previous Day
                            </button>

                            <button
                                onClick={() => {
                                    // Assuming 7-day itinerary (adjust the number based on your actual data)
                                    const maxDays = days;
                                    if (parseInt(dayNum!) < maxDays) {
                                        window.location.href = `/itinerary/${itineraryNum}/day/${parseInt(dayNum!) + 1}`;
                                    }
                                }}
                                disabled={parseInt(dayNum!) >= days} // Change 7 to your actual max days
                                className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-white font-medium transition-all ${parseInt(dayNum!) >= days // Change 7 to your actual max days
                                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/30"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-blue-500/20"
                                    }`}
                            >
                                Next Day
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
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