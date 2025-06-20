import { FaCommentDots } from "react-icons/fa";
import { HoverBorderGradient } from "../../ui/hover-border-gradient";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChat, loadChatForPlace } from "@/store/slices/chatSlice";
// import { toggleChatbot } from "@/store/slices/placeSlice";
import { setChatbotOpen } from "@/store/slices/placeSlice";
import { useEffect,useRef } from "react";

export default function ChatbotD({chatbotRef}:{chatbotRef: React.RefObject<HTMLDivElement|null>}) {
  const [input, setInput] = useState("");

  // const toggleChatbot = () => {
  //   setIsOpen(!isOpen);
  // };

  const activePlaceId=useSelector((state:any)=>state.place.activePlaceId);
  const isChatBotOpen=useSelector((state:any)=>state.place.isChatBotOpen);
  const placesData=useSelector((state:any)=>state.place.places);

   const getActivePlaceName = () => {
    if (!activePlaceId || !placesData) return null;
    
    // Search through all itineraries and days to find the place with matching ID
    for (let itineraryIdx = 0; itineraryIdx < placesData.length; itineraryIdx++) {
      const itinerary = placesData[itineraryIdx];
      for (let dayIdx = 0; dayIdx < itinerary.length; dayIdx++) {
        const dayPlaces = itinerary[dayIdx];
        
        // Each day contains an array of places
        if (Array.isArray(dayPlaces)) {
          for (let placeIdx = 0; placeIdx < dayPlaces.length; placeIdx++) {
            const place = dayPlaces[placeIdx];
            if (place && place.id === activePlaceId) {
              // console.log("Found Place:", place);
              // Use displayName, formattedAddress, or placename as fallback
              return place.displayName || place.placename || place.formattedAddress || "Unknown Place";
            }
          }
        }
      }
    }
    // console.log("Place not found for ID:", activePlaceId);
    return null;
  };

  const activePlaceName = getActivePlaceName();
  // console.log("Active Place Name:", activePlaceName);

  const dispatch=useDispatch();

  // Auto load chat history but don't open chatbot automatically when activePlaceId is set
  useEffect(() => {
    if (activePlaceId) {
      // Don't automatically open the chatbot
      // dispatch(setChatbotOpen(true)); 
      
      // Just load the chat history for the active place
      dispatch(loadChatForPlace(activePlaceId)); 
    }
  }, [activePlaceId, dispatch]);

  const toggleChatbotPanel = () => {
    // console.log("Toggling chatbot panel");
    // dispatch(toggleChatbot());
    dispatch(setChatbotOpen(!isChatBotOpen));
  };

  const {chats}=useSelector((state:any)=>state.chat);
  const messages=chats[activePlaceId] || [];
  // console.log("Messages",messages); 

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth", // smoother than scrollIntoView
      });
    }
  }, [messages]);

  const handleSendQuery = async () => {
    if (!input.trim()) return;
  
    dispatch(addChat({
      placeId:activePlaceId,
      message: { type: "user", message: input }
    }));
    setInput("");
  
    try {
      // console.log("Sending query to backend:", input);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          query: input,
          placeName: activePlaceId,
          limit: 7,
        }),
      });
  
      const data = await res.json();
      // console.log("Response from backend /query route:", data);
  
      if (data) {
        dispatch(addChat({
          placeId:activePlaceId,
          message: { type: "ai", message: data }
        }));
      } else {
        dispatch(addChat({
          placeId:activePlaceId,
          message: { type: "ai", message: "Sorry, I couldn't understand that." }
        }));
      }
  
    } catch (error) {
      dispatch(addChat({
        placeId:activePlaceId,
        message: { type: "ai", message: "Oops, something went wrong. Try again later." }
      }));
    }
  };

  return (
    <div className="relative" ref={chatbotRef}>
      {/* Fixed button at the bottom */}
      {activePlaceId && (
      <div className="fixed bottom-6 right-6 z-50">
        <HoverBorderGradient className="w-full rounded-full cursor-pointer">
          <motion.button 
            type="button" 
            onClick={toggleChatbotPanel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3.5 sm:p-4 text-white font-medium rounded-full z-10 flex items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out" 
            style={{
              background: isChatBotOpen 
                ? "linear-gradient(to right, #3b82f6, #8b5cf6)" 
                : "rgba(0, 0, 0, 0.8)"
            }}
          >
            <FaCommentDots className="text-2xl text-white" />
            
            {/* Subtle glow around the icon */}
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md -z-10"></div>
          </motion.button>
        </HoverBorderGradient>
        
        {/* Chat interface with smooth animations */}
        <AnimatePresence>
          {isChatBotOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: -10, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25
              }}
              className="absolute bottom-full right-0 mb-4 w-72 sm:w-80"
            >  <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl border border-blue-500/20 overflow-hidden shadow-2xl shadow-blue-900/20 backdrop-blur-sm">
                {/* Header with gradient accent */}
                <div className="bg-black/50 px-5 py-4 flex items-center justify-between border-b border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                    <div className="flex flex-col">
                      <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">AI Travel Assistant</p>
                      {activePlaceName && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {activePlaceName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={toggleChatbotPanel}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                  {/* Chat area with sample message */}
                <div className="h-80 p-4 overflow-y-auto chat-scroll bg-gradient-to-b from-gray-900/90 to-black/95" ref={chatContainerRef}>
                  <style>
                    {`
                      .chat-scroll::-webkit-scrollbar {
                        display: none;
                      }
                    `}
                  </style>
                  <div className="chat-scroll flex flex-col gap-5">
                  {messages.map((msg: { type: string; message: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, idx : number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                      >                        {msg.type === "ai" && (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shadow-lg">
                            AI
                          </div>
                        )}
                        <div className={`rounded-xl p-3 max-w-[80%] shadow-md ${
                          msg.type === "user" 
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-auto" 
                            : "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 border border-gray-600/30"
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </motion.div>
                    ))}
                    
                  </div>
                </div>
                  {/* Input area with theme-matched styling */}
                <div className="px-4 py-3 border-t border-blue-500/20 bg-gradient-to-r from-black/50 to-gray-900/50 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Ask anything about ${activePlaceName || 'this place'}...`}
                      value={input}
                      onChange={(e)=>setInput(e.target.value)}
                      onKeyDown={(e)=>{
                        if(e.key==="Enter") handleSendQuery();
                      }}
                      className="flex-1 bg-gray-800/80 border border-blue-500/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all duration-200 placeholder-gray-400"
                    />                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendQuery}
                      className="p-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}
    </div>
  );
}