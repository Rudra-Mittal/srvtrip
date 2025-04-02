import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BackgroundGradient } from "@/components/ui/backgroud-gradient";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, ArrowRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import Loader from '../loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  destination: string;
  budget: number;
  persons: number;
  days: number;
  interests: string[];
  startDate: Date | undefined;
  customRequests: string;
  currency: string;
}

export default function Form() {
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    destination: "",
    budget: 5000,
    persons: 2,
    days: 7,
    interests: [],
    startDate: undefined,
    customRequests: "",
    currency: "INR"
  });
  
  const currencies = [
    { value: "USD", label: "USD - $", symbol: "$" },
    { value: "EUR", label: "EUR - €", symbol: "€" },
    { value: "GBP", label: "GBP - £", symbol: "£" },
    { value: "JPY", label: "JPY - ¥", symbol: "¥" },
    { value: "CAD", label: "CAD - C$", symbol: "C$" },
    { value: "AUD", label: "AUD - A$", symbol: "A$" },
    { value: "INR", label: "INR - ₹", symbol: "₹" }
  ];
  // Visual effect states
  const [isAggregating, setIsAggregating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const getCurrencySymbol = () => {
    const currency = currencies.find(c => c.value === formData.currency);
    return currency ? currency.symbol : "₹";
  };
  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  useEffect(() => {
    // Show form with delay for entrance animation
    const timer = setTimeout(() => {
      setFormVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Interest options
  const interestOptions = [
    "Beach", "Mountains", "City", "History", "Food",
    "Adventure", "Relaxation", "Shopping", "Nature", "Culture",
    "Nightlife", "Architecture", "Art", "Music", "Local Experiences"
  ];

  // Handle form changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Toggle interests
  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAggregate();
  };

  // Animation for form submission
  const handleAggregate = async () => {
    // Step 1: Start merging animation
    setIsAggregating(true);
    setTimeout(() => {
      console.log("Star should be visible now");

      // Animate the star
      setTimeout(() => {
        setShowSummary(true);
      }, 2500);
    }, 1300);
  };

  // Move to next step with animation
  const nextStep = () => {
    if (currentStep < 4) {
      // Add a small delay for exit animation
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to previous step with animation
  const prevStep = () => {
    if (currentStep > 1) {
      // Add a small delay for exit animation
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle step change directly
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      // Add a small delay for exit animation
      setCurrentStep(step);
    }
  };

  // Particles for background animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <BackgroundBeams className="absolute inset-0 opacity-20" />
      {/* <div> */}

      {/* </div> */}
      {/* Animated background particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/20 blur-md"
          style={{ width: particle.size, height: particle.size }}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 0.2
          }}
          animate={{
            x: [`${particle.x}vw`, `${(particle.x + 30) % 100}vw`],
            y: [`${particle.y}vh`, `${(particle.y + 20) % 100}vh`],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Page title with animation */}
      <div className="mb-8 text-center relative z-10">
        <TypewriterEffect
          words={[
            { text: "Plan", className: "text-3xl sm:text-4xl lg:text-5xl font-bold" },
            { text: "Your", className: "text-3xl sm:text-4xl lg:text-5xl font-bold" },
            { text: "Dream", className: "text-3xl sm:text-4xl lg:text-5xl font-bold" },
            { text: "Adventure", className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-500" },
          ]}
          className="text-center"
          cursorClassName="bg-blue-400"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-blue-300 mt-4 max-w-xl mx-auto text-sm sm:text-base lg:text-lg"
        >
          Let's create your perfect journey, tailored exactly to your preferences.
        </motion.p>
      </div>

      <AnimatePresence mode="popLayout">
        {formVisible && !isAggregating && (
          <motion.div
            key="form-container"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-3xl z-10"
          >
            <BackgroundGradient className="rounded-2xl p-0.5">
              <form onSubmit={handleSubmit} className="bg-black/90 rounded-2xl p-8 relative">
                {/* Progress indicator - make clickable */}
                <div className="mb-8">
                  <div className="flex justify-between">
                    {[1, 2, 3, 4].map(step => (
                      <motion.div
                        key={step}
                        className={`w-1/4 h-1 rounded-full ${step <= currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-700'}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step <= currentStep ? 1 : 0 }}
                        transition={{ duration: 0.5, delay: step * 0.1 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {[
                      { step: 1, label: "Basics" },
                      { step: 2, label: "Details" },
                      { step: 3, label: "Interests" },
                      { step: 4, label: "Confirm" }
                    ].map(({ step, label }) => (
                      <motion.button
                        key={step}
                        type="button"
                        onClick={() => goToStep(step)}
                        className={`text-xs sm:text-sm lg:text-base px-2 py-1 rounded-md cursor-pointer ${step === currentStep
                          ? 'text-blue-400 font-medium'
                          : 'text-gray-400 hover:text-gray-200'
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Step 1: Destination and dates */}
                <AnimatePresence mode="popLayout">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                      className="space-y-6"
                    >
                      <h2 className="sm:text-sm   md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Where to?
                      </h2>

                      {/* Destination Field */}
                      <div className="space-y-2">
                        <Label className="text-blue-200">Destination</Label>
                        <div className="relative">
                          <Input
                            value={formData.destination}
                            onChange={(e) => handleChange("destination", e.target.value)}
                            placeholder="Dream destination..."
                            className="bg-black/60 border border-blue-500/20 focus:border-purple-500/50 text-white h-12 sm:h-14 pl-10 text-sm sm:text-base lg:text-lg "
                          />
                          <span className="absolute left-3 top-3 text-blue-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                          </span>
                        </div>
                      </div>

                      {/* Start Date Field */}
                      <div className="space-y-2">
                        <Label className="text-blue-200 text-sm sm:text-base lg:text-lg">Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-black/60 border border-blue-500/20 focus:border-purple-500/50 h-12 sm:h-12 hover:bg-black/70 text-sm sm:text-base lg:text-lg "
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                              {formData.startDate ? (
                                format(formData.startDate, "PPP")
                              ) : (
                                <span className="text-gray-400">Select your start date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-black/90 border border-blue-500/30">
                            <Calendar
                              mode="single"
                              selected={formData.startDate}
                              onSelect={(date) => handleChange("startDate", date)}
                              initialFocus
                              className="bg-black text-white scale-90 sm:scale-100 max-w-[280px] sm:max-w-none"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex justify-end mt-8">
                        <HoverBorderGradient
                          as="button"
                          type="button"
                          onClick={nextStep}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white shadow-lg shadow-purple-900/20"
                        >
                          <span className="flex items-center">
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        </HoverBorderGradient>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 2: Trip details */}
                <AnimatePresence mode="popLayout">
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Trip Details
                      </h2>

                      {/* Budget Slider with manual input - fix visibility issue */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-blue-200 text-sm sm:text-base lg:text-lg">Budget</Label>
                          <div className="flex items-center">
                            <Select
                              value={formData.currency}
                              onValueChange={(value) => handleChange("currency", value)}
                            >
                              <SelectTrigger className="w-16 sm:w-20 h-10 sm:h-12 mr-2 bg-black/60 border border-blue-500/20 focus:border-purple-500/50 text-white text-xs sm:text-sm">
                                <SelectValue placeholder="USD" />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 border border-blue-500/30 text-white">
                                {currencies.map((currency) => (
                                  <SelectItem
                                    key={currency.value}
                                    value={currency.value}
                                    className="hover:bg-blue-900/20 focus:bg-blue-900/20 text-xs sm:text-sm"
                                  >
                                    {currency.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={formData.budget}
                              onChange={(e) => handleChange("budget", Number(e.target.value))}
                              className="w-24 sm:w-32 lg:w-36 h-10 sm:h-12 bg-black/60 border border-blue-500/20 focus:border-purple-500/50 text-white text-sm sm:text-base lg:text-lg px-3 py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              // Removed min/max constraints
                              step={100}
                            />
                          </div>
                        </div>
                        <div className="relative py-4">
                          {/* Enhanced slider with visible track and thumb */}
                          <Slider
                            value={[Math.min(formData.budget, 20000)]} // Cap slider display at 20000
                            min={500}
                            max={20000}
                            step={500}
                            onValueChange={(value) => handleChange("budget", value[0])}
                            className="z-10 relative 
      [&>span:nth-child(1)]:h-2 py-7 [&>span:nth-child(1)]:bg-gray-800/80 [&>span:nth-child(1)]:rounded-full
      [&>span:nth-child(2)]:h-4 [&>span:nth-child(2)]:bg-gradient-to-r [&>span:nth-child(2)]:from-blue-500 [&>span:nth-child(2)]:to-purple-500 [&>span:nth-child(2)]:rounded-full
      [&>span:nth-child(3)]:h-3 [&>span:nth-child(3)]:w-5 [&>span:nth-child(3)]:bg-gradient-to-r [&>span:nth-child(3)]:from-blue-500 [&>span:nth-child(3)]:to-purple-500 [&>span:nth-child(3)]:border-2 [&>span:nth-child(3)]:border-white/90 [&>span:nth-child(3)]:shadow-lg mt-0"
                          />
                          <div className="absolute inset-0 pointer-events-none z-11 mr-4">
                            <div
                              className="h-2 bg-white rounded-full mt-11 "
                              style={{
                                width: `${Math.min(((Math.min(formData.budget, 20000) - 500) / (20000 - 500)) * 100, 100)}%`,
                                boxShadow: "0 0 8px rgba(147, 51, 234, 0.3)"
                              }}
                            />
                          </div>
                          {formData.budget > 20000 && (
                            <p className="text-blue-400 text-xs mt-1 italic">
                              Custom budget: {getCurrencySymbol()}{formData.budget.toLocaleString()}
                            </p>
                          )}
                          {/* Add a glowing effect under the slider for better visibility */}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{getCurrencySymbol()}500</span>
                          <span>{getCurrencySymbol()}20,000</span>
                        </div>
                      </div>

                      {/* Number of Persons with manual input */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-blue-200">Number of Travelers</Label>
                          <Input
                          type="number"
                          value={formData.persons}
                          onChange={(e) => handleChange("persons", Number(e.target.value))}
                          className="w-24 sm:w-28 h-10 sm:h-12 bg-black/60 border border-blue-500/20 focus:border-purple-500/50 text-white text-sm sm:text-base lg:text-lg px-3 py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min={1}
                          max={20}
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <motion.button
                              key={num}
                              type="button"
                              onClick={() => handleChange("persons", num)}
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                formData.persons === num
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                  : "bg-black/50 border border-blue-500/20 text-blue-200"
                              )}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {num}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Trip Duration with manual input */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-blue-200">Trip Duration (days)</Label>
                          <Input
                            type="number"
                            value={formData.days}
                            onChange={(e) => handleChange("days", Number(e.target.value))}
                            className="w-24 sm:w-28 h-10 sm:h-12 bg-black/60 border border-blue-500/20 focus:border-purple-500/50 text-white text-sm sm:text-base lg:text-lg px-3 py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min={1}
                            max={30}
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          {[3, 5, 7, 10, 14, 21].map(num => (
                            <motion.button
                              key={num}
                              type="button"
                              onClick={() => handleChange("days", num)}
                              className={cn(
                                "h-10 px-3 rounded-full flex items-center justify-center transition-all",
                                formData.days === num
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                  : "bg-black/50 border border-blue-500/20 text-blue-200"
                              )}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {num}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="bg-black/50 border border-blue-500/20 text-blue-200 hover:bg-black/70 rounded-3xl"
                        >
                          Back
                        </Button>
                        <HoverBorderGradient
                          as="button"
                          type="button"
                          onClick={nextStep}
                          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white shadow-lg shadow-purple-900/20 text-sm sm:text-base"
                        >
                          <span className="flex items-center">
                            Next <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                          </span>
                        </HoverBorderGradient>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3: Interests */}
                <AnimatePresence mode="popLayout">
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Your Interests
                      </h2>

                      <div className="space-y-4">
                        <Label className="text-blue-200">Select your travel interests</Label>
                        <div className="flex flex-wrap gap-2">
                          {interestOptions.map(interest => (
                            <motion.button
                              key={interest}
                              type="button"
                              onClick={() => toggleInterest(interest)}
                              className={cn(
                                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all",
                                formData.interests.includes(interest)
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-900/20"
                                  : "bg-black/50 border border-blue-500/20 text-blue-200"
                              )}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {interest}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-200">Any specific requests?</Label>
                        <Textarea
                          value={formData.customRequests}
                          onChange={(e) => handleChange("customRequests", e.target.value)}
                          placeholder="Tell us about any specific places you'd like to visit or experiences you'd like to have..."
                          className="bg-black/60 border border-blue-500/20 focus:border-purple-500/50 text-white min-h-24 sm:min-h-28 resize-none text-sm sm:text-base lg:text-lg p-2 sm:p-3 lg:p-4"
                        />
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="bg-black/50 border border-blue-500/20 text-blue-200 hover:bg-black/70 text-sm sm:text-base h-10 sm:h-12 rounded-3xl"
                        >
                          Back
                        </Button>
                        <HoverBorderGradient
                          as="button"
                          type="button"
                          onClick={nextStep}
                          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white shadow-lg shadow-purple-900/20 text-sm sm:text-base"
                        >
                          <span className="flex items-center">
                            Next <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                          </span>
                        </HoverBorderGradient>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 4: Review and Submit */}
                <AnimatePresence mode="popLayout">
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Review Your Trip
                      </h2>

                      <div className="space-y-4 p-4 rounded-lg border border-blue-500/20 bg-black/40">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm md:text-base">Destination</p>
                            <p className="text-white text-base md:text-lg font-medium">
                              {formData.destination || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm md:text-base">Start Date</p>
                            <p className="text-white text-base md:text-lg font-medium">
                              {formData.startDate ? format(formData.startDate, "PPP") : "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm md:text-base">Budget</p>
                            <p className="text-white text-base md:text-lg font-medium">{getCurrencySymbol()}{formData.budget}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm md:text-base">Travelers</p>
                            <p className="text-white text-base md:text-lg font-medium">{formData.persons} {formData.persons === 1 ? "person" : "people"}</p>
                          </div>
                          <div>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Interests</p>
                            <p className="text-white">
                              {formData.interests.length > 0
                                ? formData.interests.join(", ")
                                : "None specified"}
                            </p>
                          </div>
                        </div>

                        {formData.customRequests && (
                            <div className="mt-2 overflow-auto scrollbar-hide">
                            <p className="text-gray-400 text-md">Special Requests</p>
                            <p className="text-white">{formData.customRequests}</p>
                            </div>
                        )}
                      </div>

                      <div className="flex justify-between mt-8 align-items-center">
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          className="bg-black/50 border border-blue-500/20 text-blue-200 hover:bg-black/70 rounded-3xl"
                        >
                          Back
                        </Button>
                        <HoverBorderGradient
                          as="button"
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white shadow-lg shadow-purple-900/20"
                        >
                          <span className="flex items-center justify-center text-xs sm:text-sm md:text-xl">
                            Generate My Itinerary <Sparkles className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                          </span>
                        </HoverBorderGradient>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </BackgroundGradient>
          </motion.div>
        )}
        {/* Success summary */}
        <AnimatePresence>
          {showSummary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center z-20"
            >
              <div>
                <Loader />
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Creating Your Perfect Trip!
                </h2>
                <p className="text-blue-200 mb-8 max-w-md mx-auto text-sm sm:text-base lg:text-lg">
                  We're generating a personalized itinerary for your {formData.days}-day adventure to {formData.destination}. This might take a moment.
                </p>
                <div className="relative h-2 w-64 mx-auto bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}