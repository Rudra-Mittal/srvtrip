import { FlipWords } from "@/components/ui/flip-words";
import { Timeline } from "@/components/ui/timeline";
import { BackgroundGradient } from "@/components/ui/backgroud-gradient";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { itineraryData } from "@/sample_itineraryData";
import { cn } from "@/lib/utils";
export default function IteneraryTimeline(){
    const [selectedDay, setSelectedDay] = useState(1);

    return (
        <div className="container mx-auto px-4 relative z-10">
                  <h2 className="text-4xl font-bold text-white mb-4 text-center">
                         Your <span className="text-transparent  bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI-Generated </span>Paris Itinerary
                  </h2>
                    
                    <p className="text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 max-w-3xl mx-auto mb-16">
                      This personalized 3-day journey showcases the best of Paris, 
                      balancing iconic landmarks, cultural immersion, and authentic local experiences.
                    </p>
                    
                    <div className="flex justify-center mb-10">
                      <div className="border border-blue-500/20 rounded-lg p-1 bg-black/50 backdrop-blur-sm">
                        <div className="grid grid-cols-3 w-full min-w-[300px] max-w-md bg-transparent gap-1">
                          {itineraryData.map(day => (
                            <button 
                              key={day.day} 
                              onClick={() => setSelectedDay(day.day)}
                              className={cn(
                                "py-2 px-4 rounded-md transition-all cursor-pointer",
                                selectedDay === day.day
                                  ? "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white"
                                  : "text-gray-300 hover:text-white"
                              )}
                            >
                              Day {day.day}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-w-5xl mx-auto">
                      <AnimatePresence mode="wait">
                        {itineraryData.map(day => (
                          day.day === selectedDay && (
                            <motion.div
                              key={day.day}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.5 }}
                            >
                              <BackgroundGradient className="rounded-2xl p-0.5 mb-12">
                                <div className="bg-black/90 rounded-2xl p-6 md:p-8">
                                  <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/2 aspect-video md:aspect-auto rounded-xl overflow-hidden">
                                      <img 
                                        src={day.image} 
                                        alt={`Day ${day.day} in ${day.location}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="md:w-1/2">
                                      <h3 className="text-2xl font-bold text-white mb-2">Day {day.day}: {day.title}</h3>
                                      <p className="text-blue-200 mb-6">{day.description}</p>
                                      
                                      <ul className="space-y-4">
                                        {day.activities.map((activity, i) => (
                                          <li key={i} className="flex gap-3 items-start">
                                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-md min-w-10 h-10 flex items-center justify-center text-white font-medium">
                                              {activity.time.split(':')[0]}
                                            </div>
                                            <div>
                                              <h4 className="font-medium text-white">{activity.title}</h4>
                                              <div className="my-1">
                                                <FlipWords words={[activity.type]} />
                                              </div>
                                              <p className="text-sm text-gray-400">{activity.description}</p>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </BackgroundGradient>
                              
                              {/* Timeline for the day */}
                            <div className="pl-4 mt-16 space-y-12 relative">
                              {/* Gradient line with proper spacing and constraints */}
                              <div className="absolute top-0 bottom-0 left-0 ml-[19px] w-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 max-h-[95%] mt-5"></div>
                              
                              <Timeline 
                                data={day.activities.map((activity, idx) => ({
                                  title: activity.title,
                                  content: <p className="text-sm text-gray-400">{activity.description}</p>,
                                  time: activity.time,
                                  icon: <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white relative z-10">{idx + 1}</div>
                                }))}
                              />
                            </div>
                            </motion.div>
                          )
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
    )
}