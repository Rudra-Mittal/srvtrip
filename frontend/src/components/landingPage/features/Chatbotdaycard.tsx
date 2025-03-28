import { FaCommentDots } from "react-icons/fa";
import { HoverBorderGradient } from "../../ui/hover-border-gradient";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

export default function ChatbotD({chatbotRef}:{chatbotRef: React.RefObject<HTMLDivElement|null>}) {
   
  // const chatbotInView = useInView(chatbotRef, { amount: 0.2, once: false });
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={chatbotRef}>
      {/* Fixed button at the bottom with increased width */}
      <div className="fixed bottom-6 right-6 z-50">
        <HoverBorderGradient className="w-full">
          <button 
            type="button" 
            onClick={toggleChatbot}
            className=" px-4 sm:px-6 py-3 sm:py-4 text-white font-medium relative z-10 flex items-center justify-center gap-2"
          >
            <FaCommentDots className="text-blue-400 " />
          </button>
        </HoverBorderGradient>
        
        {/* Chat interface that appears just above the button */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: -10, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-full right-0 mb-2 w-60 sm:w-72"
            >
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                <div className="bg-gray-800 px-5 py-4 flex items-center justify-between">
                  <p className="text-white font-medium text-sm sm:text-base">AI Travel Assistant</p>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <div 
                  className="h-72 p-4 overflow-y-auto"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none' 
                  }}
                >
                  <style>
                    {`
                      .chat-scroll::-webkit-scrollbar {
                        display: none;
                      }
                    `}
                  </style>
                  <div className="chat-scroll flex flex-col gap-5">
                  
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-gray-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about any place..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button title="submit" className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
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