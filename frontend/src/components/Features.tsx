import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {ArrowRight} from "lucide-react";
import { cn } from "@/lib/utils";

// Import Aceternity UI components
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { BackgroundBeams } from "./ui/background-beams";
import { BackgroundGradient } from "./ui/backgroud-gradient";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
// import { Button } from "@/components/ui/button";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timeline } from "./ui/timeline";
import { FlipWords } from "@/components/ui/flip-words";
import { FaCommentDots } from "react-icons/fa";
import { popularDestinations } from "@/MockPlacesData";
import { TypewriterEffect } from "./ui/typewriter-effect";
import { itineraryData } from "@/sample_itineraryData";
import Reviews from "./reviews";
import { Textarea } from "./ui/textarea";
import { Link } from "react-router-dom";


interface InterestTagProps {
  children: React.ReactNode;
  onClick: () => void;
  selected: boolean;
}

const InterestTag: React.FC<InterestTagProps> = ({ children, onClick, selected }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm transition-all duration-300",
        selected
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          : "bg-black/40 text-gray-300 border border-blue-500/20 hover:border-purple-500/40"
      )}
    >
      {children}
    </button>
  );
};

const Features: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [showReviewSummary, setShowReviewSummary] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    destination: "",
    days: "3",
    budget: "medium",
    persons: "2",
    customRequests: ""
  });

  // Track if sections are in view
  const smartFormRef = React.useRef<HTMLDivElement>(null);
  const smartFormInView = useInView(smartFormRef, { amount: 0.2, once: false });
  
  const itineraryRef = React.useRef<HTMLDivElement>(null);
  const itineraryInView = useInView(itineraryRef, { amount: 0.2, once: true });
  
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { amount: 0.2, once: true });

  const chatbotRef = React.useRef<HTMLDivElement>(null);
  const chatbotInView = useInView(chatbotRef, { amount: 0.2, once: false });
  
  const reviewsRef = React.useRef<HTMLDivElement>(null);
  const reviewsInView = useInView(reviewsRef, { amount: 0.2, once: true });

  const interestOptions = [
    "Art & Museums", "Food & Cuisine", "Architecture", "Nightlife", 
    "Shopping", "Nature", "Adventure", "History", "Local Culture", "Relaxation"
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  // Peerlist logo for macbook
const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
        fill="#00AA45"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#219653"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z"
        fill="#24292E"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18 11H29.0769C36.2141 11 42 16.5716 42 23.4444C42 30.3173 36.2141 35.8889 29.0769 35.8889H25.3846V43H18V11ZM25.3846 28.7778H29.0769C32.1357 28.7778 34.6154 26.39 34.6154 23.4444C34.6154 20.4989 32.1357 18.1111 29.0769 18.1111H25.3846V28.7778Z"
        fill="white"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17 10H29.0769C36.7305 10 43 15.984 43 23.4444C43 30.9048 36.7305 36.8889 29.0769 36.8889H26.3846V44H17V10ZM19 12V42H24.3846V34.8889H29.0769C35.6978 34.8889 41 29.7298 41 23.4444C41 17.1591 35.6978 12 29.0769 12H19ZM24.3846 17.1111H29.0769C32.6521 17.1111 35.6154 19.9114 35.6154 23.4444C35.6154 26.9775 32.6521 29.7778 29.0769 29.7778H24.3846V17.1111ZM26.3846 19.1111V27.7778H29.0769C31.6194 27.7778 33.6154 25.8024 33.6154 23.4444C33.6154 21.0864 31.6194 19.1111 29.0769 19.1111H26.3846Z"
        fill="#24292E"
      ></path>
    </svg>
  );
};

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // Simulate form appearance after page load
    const timer = setTimeout(() => {
      setFormVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">

      <div className="relative">
        
      {/* Combined hero and 3D marquee with z-index layering */}
        <section className="relative min-h-screen flex flex-col justify-center items-center  overflow-hidden">
          {/* Add spotlight for better visual effect */}
          {/* <Spotlight
            className="-top-40 left-0 md:left-60"
            fill="white"
          /> */}
          
          {/* Background 3D marquee with reduced opacity */}
          <div className="absolute my-auto inset-0 z-0 h-[90vh]">
            <div className="opacity-45 h-full">
              <ThreeDMarquee
                images={popularDestinations.map(dest => dest.image)}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Hero content - positioned on top */}
          <div className="container mx-auto px-4 text-center relative z-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white ">
                <span className="relative">
                  Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-slow">Dream Journey</span> Awaits
                  <span className="absolute inset-0 bg-white/5 blur-sm -z-10 rounded-lg"></span>
                </span>
            </h1>
              <div className="relative">
                <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                    Discover extraordinary destinations with our AI-powered travel planner that adapts to your
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium"> preferences</span>,
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium"> timeframe</span>, and
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium"> budget</span>.
                  </p>
                {/* Add a subtle glow effect behind the text */}
                <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl -z-10"></div>
              </div>
            </motion.div>
          </div>
          <div className="flex justify-center">
            <button
              className="border border-blue-800/20 text-white backdrop-blur-md bg-white/5 hover:bg-white/10 px-10 py-3 rounded-full transition-all duration-300 shadow-lg cursor-pointer"
              onClick={() => document.getElementById('smart-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex items-center justify-center text-lg font-medium">
                Generate Itinerary <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </button>
          </div>
        </section>

        {/* Smart Form Section */}
        <section id="smart-form" className="py-6 sm:py-10 lg:py-14" ref={smartFormRef}>
          <div className="container mx-auto px-4">
            {/* Replace TextGenerateEffect with TypewriterEffect */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={smartFormInView ? { opacity: 1 } : { opacity: 0 }}
              className="text-center"
            >
              <TypewriterEffect
                key={smartFormInView ? "visible" : "hidden"} 
                words={[
                  { text: "Let", className: "text-2xl sm:text-3xl lg:text-4xl font-bold" },
                  { text: "AI", className: "text-2xl sm:text-3xl lg:text-4xl font-bold " },
                  { text: "Personalize", className: "text-2xl sm:text-3xl lg:text-4xl font-bold" },
                  { text: "Your", className: "text-2xl sm:text-3xl lg:text-4xl font-bold " },
                  { text: "Journey", className: "text-2xl sm:text-3xl lg:text-4xl font-bold " }
                ]}
                className="text-center"
                cursorClassName="bg-blue-400"
              />

              {/* Added description with gradient text */}
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 max-w-2xl mx-auto text-sm sm:text-base mt-3 sm:mt-4 mb-8 sm:mb-10">
                Tell us where you want to go, and we'll create a detailed itinerary tailored perfectly to your preferences and style.
              </p>

            </motion.div>

            <AnimatePresence>
              {formVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto"
                >
                  
                  <CardContainer className="w-full pointer-events-auto">
                    <BackgroundGradient className="rounded-xl sm:rounded-2xl p-0.5">
                      <div className="bg-black/95 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
                        <form className="space-y-4 sm:space-y-5 lg:space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                            <div className="space-y-1 sm:space-y-2">
                              <Label className="text-blue-100 text-xs sm:text-sm lg:text-base">Destination</Label>
                              <Input
                                name="destination"
                                value={formData.destination}
                                onChange={handleFormChange}
                                placeholder="Where would you like to go?"
                                className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10"
                              />
                            </div>
                            
                            <div className="space-y-1 sm:space-y-2">
                              <Label className="text-blue-100 text-xs sm:text-sm lg:text-base">Number of Days</Label>
                              <Select 
                                name="days"
                                value={formData.days} 
                                onValueChange={(value) => setFormData(prev => ({ ...prev, days: value }))}
                              >
                                <SelectTrigger className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10">
                                  <SelectValue placeholder="Select days" />
                                </SelectTrigger>
                                <SelectContent className="bg-black/90 border border-blue-500/30 text-white text-xs sm:text-sm lg:text-base">
                                  {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(day => (
                                    <SelectItem key={day} value={day.toString()}>
                                      {day} {day === 1 ? 'day' : 'days'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-1 sm:space-y-2">
                              <Label className="text-blue-100 text-xs sm:text-sm lg:text-base">Budget</Label>
                              <Select 
                                name="budget"
                                value={formData.budget} 
                                onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                              >
                                <SelectTrigger className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10">
                                  <SelectValue placeholder="Select budget" />
                                </SelectTrigger>
                                <SelectContent className="bg-black/90 border border-blue-500/30 text-white">
                                  <SelectItem value="budget">Budget</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="luxury">Luxury</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-1 sm:space-y-2">
                              <Label className="text-blue-100 text-xs sm:text-sm lg:text-base">Number of Travelers</Label>
                              <Select 
                                name="persons"
                                value={formData.persons}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, persons: value }))}
                              >
                                <SelectTrigger className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10">
                                  <SelectValue placeholder="Select number" />
                                </SelectTrigger>
                                <SelectContent className="bg-black/90 border border-blue-500/30 text-white">
                                  {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num} {num === 1 ? 'person' : 'people'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <Label className="text-blue-100 text-xs sm:text-sm lg:text-base">Travel Interests</Label>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {interestOptions.map(interest => (
                                <InterestTag
                                  key={interest}
                                  selected={interests.includes(interest)}
                                  onClick={() => handleInterestToggle(interest)}
                                >
                                  <span className="text-xs sm:text-sm">{interest}</span>
                                </InterestTag>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <Label className="text-blue-100 text-xs sm:text-sm lg:text-base">Your Interests</Label>
                            <Textarea
                              name="customRequests"
                              value={formData.customRequests}
                              onChange={handleFormChange}
                              placeholder="Tell us your interests or places you'd like to visit..."
                              className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base resize-none min-h-16 sm:min-h-20 lg:min-h-24"
                            />
                          </div>
                          
                          <div className="flex justify-center pt-2 sm:pt-3 lg:pt-4">
                            <HoverBorderGradient
                              as="button"
                              className="px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-sm sm:text-base lg:text-lg shadow-lg shadow-purple-900/20"
                            >
                              <span className="flex items-center whitespace-nowrap">
                                Generate My Itinerary <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                              </span>
                            </HoverBorderGradient>
                          </div>
                        </form>
                      </div>
                    </BackgroundGradient>
                  </CardContainer>
                  
                  {/* text reveal */}
                  <div className="mt-6 sm:mt-8 lg:mt-10 mb-0">
                    <TextRevealCard
                      text="You pick the destination"
                      revealText="Stellar itinerary is our creation."
                      className="w-full text-xs sm:text-sm md:text-base lg:text-lg"
                    />
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        
        {/* AI-Generated Itinerary Timeline */}
        <section id="itinerary" className="py-20 relative" ref={itineraryRef}>
          <BackgroundBeams className="absolute inset-0 opacity-20" />
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
        </section>
        
        {/* Interactive Map Section */}
        {/* Map Showcase Section */}
        <section className="py-16 sm:py-20 bg-black relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  Visualize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Travel Route</span>
                </h2>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 max-w-2xl mx-auto text-sm sm:text-base">
                  See your entire itinerary mapped out for easy navigation
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ 
                type: "spring",
                stiffness: 50,
                damping: 15,
                duration: 0.8
              }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-black/80 rounded-lg overflow-hidden shadow-2xl shadow-blue-900/10">
                {/* Map Image with dimmed overlay */}
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md">
                  <div className="absolute inset-0 bg-black/30 z-10"></div>
                  <img 
                    src="/mapimg.png" 
                    alt="Interactive Travel Map" 
                    className="w-full h-full object-cover relative z-0"
                  />
                </div>
              </div>
          </motion.div>
          </div>
        </section>

  
        {/* AI Travel Chatbot Section */}
        <section className="py-20 mb-14 bg-black relative" ref={chatbotRef}>
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
                          <button className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
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
        </section>
  
        
        {/* Reviews Section */}
        <div className="w-full mx-auto">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Review Insights</span>
                  </h2>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500  max-w-2xl mx-auto">
                  We analyze thousands of authentic reviews, distilled for your journey,
                  </p>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500  text-sm sm:text-base max-w-3xl mx-auto">
                  Skip hours of research—get honest, actionable summaries that highlight what truly matters at each stop in your itinerary.
                  </p>
                </motion.div>
              </div>
          <Reviews/>
        </div>

        
        
        {/* Final CTA Section*/}
        <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <BackgroundBeams />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
                    Ready to Experience Travel Planning Reimagined?
                  </span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-8 sm:mb-10 lg:mb-12 max-w-xl mx-auto">
                  Let our AI craft your perfect itinerary in seconds. No more hours of research or uncertainty.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                  <button 
                    onClick={() => document.getElementById('smart-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3.5 rounded-lg shadow-md transition-all duration-200 text-base cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Plan Your Journey Now
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                  
                  <button 
                    className="w-full sm:w-auto border-2 border-blue-500/30 text-white hover:bg-blue-900/20 hover:border-blue-400/50 px-8 py-3.5 rounded-lg transition-all duration-200 text-base font-medium cursor-pointer"
                  >
                    View Example Itineraries
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Features;
