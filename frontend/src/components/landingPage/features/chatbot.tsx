import { FaCommentDots } from "react-icons/fa";
import { HoverBorderGradient } from "../../ui/hover-border-gradient";
import { BackgroundGradient } from "../../ui/backgroud-gradient";
import { TypewriterEffect } from "../../ui/typewriter-effect";
import {motion, useInView } from "framer-motion";
import React from "react";
export default function Chatbot({chatbotRef}:{chatbotRef: React.RefObject<HTMLDivElement|null>}) {
   
      const chatbotInView = useInView(chatbotRef, { amount: 0.2, once: false });
    return (
        <div className="container mx-auto px-4">
            {/* Adding TypewriterEffect heading with key to reset when view changes */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={chatbotInView ? { opacity: 1 } : { opacity: 0 }}
              className="text-center mb-12"
              key={chatbotInView ? "chatbot-visible" : "chatbot-hidden"} // Add key to force re-render
            >
              <TypewriterEffect
                words={[
                  { text: "Your", className: "text-3xl sm:text-4xl font-bold text-blue-200" },
                  { text: "Personal", className: "text-3xl sm:text-4xl font-bold text-blue-400" },
                  { text: "AI", className: "text-3xl sm:text-4xl font-bold text-purple-400" },
                  { text: "Travel", className: "text-3xl sm:text-4xl font-bold text-blue-400" },
                  { text: "Companion", className: "text-3xl sm:text-4xl font-bold text-blue-200" }
                ]}
                className="mb-4"
                cursorClassName="bg-blue-400"
              />
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 max-w-2xl mx-auto text-sm sm:text-base">
                Curious about any destination in your itinerary? Get instant, detailed insights and local knowledge at your fingertips.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={chatbotInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <BackgroundGradient className="rounded-[22px] overflow-hidden">
                <div className="p-6 sm:p-8 md:p-10 bg-black rounded-[18px] h-full flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
                  <div className="md:w-1/2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                      Curious About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Destinations</span>?
                    </h2>
                    <p className="text-gray-400 mb-4 sm:mb-6">
                      Ask our AI Travel Assistant anything specific about locations in your itinerary - from hidden local spots to practical travel tips.
                    </p>
                    <div className="space-y-4">
                      <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
                        <p className="text-gray-300 text-xs sm:text-sm mb-2">Ask about places in your itinerary:</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <span className="text-xs bg-blue-900 bg-opacity-40 text-blue-300 px-2 py-1 rounded-full">Eiffel Tower history</span>
                          <span className="text-xs bg-purple-900 bg-opacity-40 text-purple-300 px-2 py-1 rounded-full">Montmartre restaurants</span>
                          <span className="text-xs bg-indigo-900 bg-opacity-40 text-indigo-300 px-2 py-1 rounded-full">Louvre Museum tips</span>
                          <span className="text-xs bg-pink-900 bg-opacity-40 text-pink-300 px-2 py-1 rounded-full">Versailles secrets</span>
                        </div>
                      </div>
                      <HoverBorderGradient className="w-full">
                        <button type="submit" className="w-full px-4 sm:px-6 py-3 sm:py-4 text-white font-medium relative z-10 flex items-center justify-center gap-2">
                          <FaCommentDots className="text-blue-400" />
                          <span className="text-sm sm:text-base">Chat with AI Assistant</span>
                        </button>
                      </HoverBorderGradient>
                    </div>
                  </div>
                  <div className="md:w-1/2 w-full">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                      <div className="bg-gray-800 px-5 py-4 flex items-center justify-between">
                        <p className="text-white font-medium text-sm sm:text-base">AI Travel Assistant</p>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <div 
                        className="h-72 sm:h-80 md:h-96 p-4 sm:p-5 overflow-y-auto"
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
                          <div className="flex gap-3 mb-4">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                              AI
                            </div>
                            <div className="bg-gray-800 rounded-lg p-3 max-w-[80%]">
                              <p className="text-gray-200 text-xs sm:text-sm">Hello! I can provide detailed information about any place in your Paris itinerary. Which location would you like to know more about?</p>
                            </div>
                          </div>
                          <div className="flex gap-3 mb-4 justify-end">
                            <div className="bg-blue-900 bg-opacity-40 rounded-lg p-3 max-w-[80%]">
                              <p className="text-gray-200 text-xs sm:text-sm">Tell me about Montmartre from Day 2. What's special about it and what shouldn't I miss?</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs">
                              You
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                              AI
                            </div>
                            <div className="bg-gray-800 rounded-lg p-3 max-w-[80%]">
                              <p className="text-gray-200 text-xs sm:text-sm">
                                <strong className="text-blue-400">Montmartre</strong> is a charming artistic neighborhood with cobblestone streets and village-like atmosphere. Here's what makes it special:
                                <br /><br />
                                <strong className="text-blue-400">Must-see:</strong> The stunning Sacré-Cœur Basilica with panoramic city views
                                <br />
                                <strong className="text-blue-400">Don't miss:</strong> Place du Tertre with street artists, the Moulin Rouge, and Café des Deux Moulins from the film Amélie
                                <br />
                                <strong className="text-blue-400">Local tip:</strong> Visit early morning to avoid crowds and get the best photos of Paris from the hilltop
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-800">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ask about any place in your itinerary..."
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button title="submit" className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BackgroundGradient>
            </motion.div>
          </div>
    )
}