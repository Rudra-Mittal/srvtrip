import { FaCommentDots } from "react-icons/fa";
import { HoverBorderGradient } from "../../ui/hover-border-gradient";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChat, loadChatForPlace } from "@/store/slices/chatSlice";

export default function ChatbotD({chatbotRef}:{chatbotRef: React.RefObject<HTMLDivElement|null>}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  // const toggleChatbot = () => {
  //   setIsOpen(!isOpen);
  // };

  const activePlaceId=useSelector((state:any)=>state.place.activePlaceId);


  const dispatch=useDispatch();
  const toggleChatbot=()=>{
   // load chat for the selected placeId from sessionStorage if it exists
    if(activePlaceId){
      dispatch(loadChatForPlace(activePlaceId));
    }
    setIsOpen(!isOpen);
  }

  const {selectedPlaceId,chats}=useSelector((state:any)=>state.chat);
  const messages=chats[selectedPlaceId] || [];

  const handleSendQuery = async () => {
    if (!input.trim()) return;
  
    dispatch(addChat({
      placeId:activePlaceId,
      message: { type: "user", message: input }
    }));
    setInput("");
  
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
          placeName: activePlaceId,
          limit: 5,
        }),
      });
  
      const data = await res.json();
  
      if (data?.result) {
        dispatch(addChat({
          activePlaceId,
          message: { type: "ai", message: data.result }
        }));
      } else {
        dispatch(addChat({
          activePlaceId,
          message: { type: "ai", message: "Sorry, I couldn't understand that." }
        }));
      }
  
    } catch (error) {
      dispatch(addChat({
        activePlaceId,
        message: { type: "ai", message: "Oops, something went wrong. Try again later." }
      }));
    }
  };

  return (
    <div className="relative" ref={chatbotRef}>
      {/* Fixed button at the bottom */}
      <div className="fixed bottom-6 right-6 z-50">
        <HoverBorderGradient className="w-full rounded-full cursor-pointer">
          <motion.button 
            type="button" 
            onClick={toggleChatbot}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3.5 sm:p-4 text-white font-medium rounded-full z-10 flex items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out" 
            style={{
              background: isOpen 
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
          {isOpen && (
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
            >
              <div className="bg-gray-900 rounded-xl border border-blue-500/20 overflow-hidden shadow-xl shadow-blue-900/10">
                {/* Header with gradient accent */}
                <div className="bg-black/50 px-5 py-4 flex items-center justify-between border-b border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">AI Travel Assistant</p>
                  </div>
                  <button 
                    onClick={toggleChatbot}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {/* Chat area with sample message */}
                <div className="h-80 p-4 overflow-y-auto chat-scroll bg-gray-900/90">
                  <style>
                    {`
                      .chat-scroll::-webkit-scrollbar {
                        display: none;
                      }
                    `}
                  </style>
                  <div className="chat-scroll flex flex-col gap-5">
                  {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.type === "ai" && (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                            AI
                          </div>
                        )}
                        <div className={`rounded-lg p-3 max-w-[80%] ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"}`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Input area with theme-matched styling */}
                <div className="px-4 py-3 border-t border-blue-500/20 bg-black/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about any place..."
                      value={input}
                      onChange={(e)=>setInput(e.target.value)}
                      onKeyDown={(e)=>{
                        if(e.key==="Enter") handleSendQuery();
                      }}
                      className="flex-1 bg-gray-800/80 border border-blue-500/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendQuery}
                      className="p-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
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
    </div>
  );
}