import { motion, AnimatePresence, useInView } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useState, useEffect } from "react";
import { CardContainer } from "@/components/ui/3d-card";
import { BackgroundGradient } from "@/components/ui/backgroud-gradient";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ArrowRight } from "lucide-react";

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
        "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-300",
        selected
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          : "bg-black/40 text-gray-300 border border-blue-500/20 hover:border-purple-500/40"
      )}
    >
      {children}
    </button>
  );
};

export default function SmartForm({smartFormRef, formVisible}: {smartFormRef: React.RefObject<HTMLDivElement|null>, formVisible: boolean}) {
  const smartFormInView = useInView(smartFormRef, { amount: 0.2, once: false });
  const [interests, setInterests] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    days: "3",
    budget: "medium",
    persons: "2",
    customRequests: ""
  });

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
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
  
  return (
    // Use responsive padding instead of fixed margin-top, apply only on mobile view
    <div className={cn(
      "w-full px-4 sm:px-6 md:px-8",
      isMobile ? "md:-mt-[53rem] -mt-[10rem] sm:-mt-[10rem]" : ""
    )}>
      {/* TypewriterEffect with responsive spacing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={smartFormInView ? { opacity: 1 } : { opacity: 0 }}
        className={cn(
          "text-center",
          isMobile ? "mb-4" : "mb-8" 
        )}
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

        {/* Responsive description with fluid margins */}
        <p className={cn(
          "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mx-auto text-sm sm:text-base",
          isMobile ? "mt-2 mb-4 px-2" : "mt-3 sm:mt-4 mb-8 sm:mb-10 max-w-2xl"
        )}>
          Tell us where you want to go, and we'll create a detailed itinerary tailored perfectly to your preferences and style.
        </p>
      </motion.div>

      <AnimatePresence>
        {formVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full mx-auto"
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
                          className="w-full bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10"
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <Label className="text-blue-100 text-xs sm:text-sm lg:text-base">Number of Days</Label>
                        <Select
                          name="days"
                          value={formData.days}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, days: value }))}
                        >
                          <SelectTrigger className="w-full bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10">
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
                          <SelectTrigger className="w-full bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10">
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
                          <SelectTrigger className="w-full bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10">
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
                        className="w-full bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base resize-none min-h-16 sm:min-h-20 lg:min-h-24"
                      />
                    </div>

                    <div className="flex justify-center pt-2 sm:pt-3 lg:pt-4">
                      <HoverBorderGradient
                        as="button"
                        className="w-full sm:w-auto px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-sm sm:text-base lg:text-lg shadow-lg shadow-purple-900/20"
                      >
                        <span className="flex items-center justify-center whitespace-nowrap">
                          Generate My Itinerary <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </span>
                      </HoverBorderGradient>
                    </div>
                  </form>
                </div>
              </BackgroundGradient>
            </CardContainer>

            {/* Text reveal - conditionally rendered based on screen size */}
            <div className={cn(
              "mt-6 sm:mt-8 lg:mt-10 mb-0",
              isMobile ? "hidden sm:block" : ""
            )}>
              <TextRevealCard
                text="You pick the destination"
                revealText="Stellar itinerary is our creation."
                className="w-1/2 text-xs sm:text-sm md:text-base lg:text-lg justify-center mx-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}