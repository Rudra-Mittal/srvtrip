import { motion, AnimatePresence, useInView } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useState } from "react";
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
export default function SmartForm({smartFormRef,formVisible}:{smartFormRef:React.RefObject<HTMLDivElement|null>,formVisible:boolean}) {
  const smartFormInView = useInView(smartFormRef, { amount: 0.2, once: false });
  const [interests, setInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    destination: "",
    days: "3",
    budget: "medium",
    persons: "2",
    customRequests: ""
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const interestOptions = [
    "Art & Museums", "Food & Cuisine", "Architecture", "Nightlife",
    "Shopping", "Nature", "Adventure", "History", "Local Culture", "Relaxation"
  ]
  const handleInterestToggle = (interest: string) => {
      setInterests(prev => 
        prev.includes(interest) 
          ? prev.filter(i => i !== interest) 
          : [...prev, interest]
      );
    }
  return (
    <div className="container mx-auto px-4 pt-0 sm:pt-2 lg:pt-4">
      {/* Replace TextGenerateEffect with TypewriterEffect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={smartFormInView ? { opacity: 1 } : { opacity: 0 }}
        className="text-center mb-6 sm:mb-8 lg:mb-12"
      >
        <TypewriterEffect
          key={smartFormInView ? "visible" : "hidden"}
          words={[
            { text: "Let", className: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold" },
            { text: "AI", className: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold " },
            { text: "Personalize", className: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold" },
            { text: "Your", className: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold " },
            { text: "Journey", className: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold " }
          ]}
          className="text-center"
          cursorClassName="bg-blue-400"
        />

        {/* Added description with gradient text */}
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 max-w-2xl mx-auto text-sm sm:text-base mt-2 sm:mt-3 lg:mt-4 px-4">
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
                <div className="bg-black/95 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8">
                  <form className="space-y-3 sm:space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <div className="space-y-1 sm:space-y-2">
                        <Label className="text-blue-100 text-xs sm:text-sm lg:text-base">Destination</Label>
                        <Input
                          name="destination"
                          value={formData.destination}
                          onChange={handleFormChange}
                          placeholder="Where would you like to go?"
                          className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-9 sm:h-10 lg:h-11"
                        />
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <Label className="text-blue-100 text-xs sm:text-sm lg:text-base">Number of Days</Label>
                        <Select
                          name="days"
                          value={formData.days}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, days: value }))}
                        >
                          <SelectTrigger className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-9 sm:h-10 lg:h-11">
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
                          <SelectTrigger className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-9 sm:h-10 lg:h-11">
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
                          <SelectTrigger className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm lg:text-base h-9 sm:h-10 lg:h-11">
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
                        className="px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-sm sm:text-base lg:text-lg shadow-lg shadow-purple-900/20"
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
            <div className="mt-4 sm:mt-6 lg:mt-10 mb-2 sm:mb-4 lg:mb-8">
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
  )
}