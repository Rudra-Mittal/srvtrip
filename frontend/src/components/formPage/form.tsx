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
import { CalendarIcon, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import Loader from '../loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { genitinerary } from '@/api/formroute';
import { useDispatch, useSelector } from 'react-redux';
import { addItinerary } from '@/store/slices/itinerarySlice';
import { addPlace } from '@/store/slices/placeSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface FormData {
  destination: string;
  budget: number;
  number_of_persons: number;
  number_of_days: number;
  interests: string[] | string;
  startdate: Date | undefined;
  customRequests: string;
  currency: string;
}

interface ValidationErrors {
  startdate?: string;
  number_of_days?: string;
}

export default function Form() {
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    destination: "",
    budget: 5000,
    number_of_persons: 2,
    number_of_days: 7,
    interests: [],
    startdate: undefined,
    customRequests: "",
    currency: "INR"
  });
  
  // Add validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
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

  // Validate form data
  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    // Validate date is not in the past
    if (formData.startdate) {
      const today = startOfDay(new Date());
      if (isBefore(formData.startdate, today)) {
        errors.startdate = "Start date cannot be in the past";
      }
    }
    
    // Validate number of days is not more than 7
    if (formData.number_of_days > 7) {
      errors.number_of_days = "Trip duration cannot exceed 7 days";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form changes with validation
  const handleChange = (field: keyof FormData, value: any) => {
    // Special handling for number_of_days to enforce the 7-day limit
    if (field === 'number_of_days' && typeof value === 'number') {
      value = Math.min(value, 7); // Cap at 7 days maximum
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors for the field being changed
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Special validation for date field
    if (field === 'startdate' && value) {
      const today = startOfDay(new Date());
      if (isBefore(value, today)) {
        setValidationErrors(prev => ({ 
          ...prev, 
          startdate: "Start date cannot be in the past" 
        }));
      }
    }
  };

  // Toggle interests
  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: Array.isArray(prev.interests)
            ? prev.interests.filter(i => i !== interest)
            : prev.interests
        };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };
  
  const dispatch= useDispatch()
  const itineraries = useSelector((state: any) => state.itinerary.itineraries);
  
  // Handle form submission with validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (validateForm()) {
      handleAggregate();
    } else {
      // Show toast for validation errors
      if (validationErrors.startdate) {
        toast.error(validationErrors.startdate, {
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(220, 38, 38, 0.5)',
          },
          icon: '📅',
        });
      }
      
      if (validationErrors.number_of_days) {
        toast.error(validationErrors.number_of_days, {
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(220, 38, 38, 0.5)',
          },
          icon: '⏱️',
        });
      }
    }
  };

  // Animation for form submission
  const handleAggregate = async () => {
    // Step 1: Start merging animation
    setIsAggregating(true);
    setTimeout(() => {
      // console.log("Star should be visible now");

      // Animate the star
      setTimeout(() => {
        setShowSummary(true);
      }, 2500);
    }, 1300);
  };

  // Move to next step with validation
  const nextStep = () => {
    // Validate current step before moving to the next
    let canProceed = true;
    
    // Specific validation for step 1 (date validation)
    if (currentStep === 1 && formData.startdate) {
      const today = startOfDay(new Date());
      if (isBefore(formData.startdate, today)) {
        setValidationErrors(prev => ({ 
          ...prev, 
          startdate: "Start date cannot be in the past" 
        }));
        canProceed = false;
        
        // Show toast for invalid date
        toast.error("Start date cannot be in the past", {
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(220, 38, 38, 0.5)',
          },
          icon: '📅',
        });
      }
    }
    
    // If we can proceed, move to next step
    if (canProceed && currentStep < 4) {
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

  // Handle step change directly with validation
  const goToStep = (step: number) => {
    // Validate current step before changing
    let canProceed = true;
    
    // Check for date validation when on step 1
    if (currentStep === 1 && formData.startdate) {
      const today = startOfDay(new Date());
      if (isBefore(formData.startdate, today)) {
        setValidationErrors(prev => ({ 
          ...prev, 
          startdate: "Start date cannot be in the past" 
        }));
        canProceed = false;
      }
    }
    
    if (canProceed && step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };
  
  const navigate=useNavigate()
  
  // Update the handleGenerateItinerary function to include validation
  const handleGenerateItinerary = async (formData: FormData) => {
    // Validate form before generating itinerary
    if (!validateForm()) {
      if (validationErrors.startdate) {
        toast.error(validationErrors.startdate, {
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(220, 38, 38, 0.5)',
          },
          icon: '📅',
        });
      }
      
      if (validationErrors.number_of_days) {
        toast.error(validationErrors.number_of_days, {
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(220, 38, 38, 0.5)',
          },
          icon: '⏱️',
        });
      }
      return;
    }
    
    setFormVisible(false);
    setShowSummary(true);
    setShowTimeoutMessage(false); // Reset timeout message
    
    // Set timeout timer for 10 seconds (reasonable time for AI processing)
    const timeoutTimer = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, 60000); // Changed from 10000 to 60000 (1 minute)
    
    // Create a copy of the form data to modify
    const submissionData = { ...formData };
    
    // Combine interests array and custom requests into a single array
    const interestsArray = [...submissionData.interests];
    
    // Add custom requests to interests if it exists
    if (submissionData.customRequests && submissionData.customRequests.trim() !== '') {
      interestsArray.push(submissionData.customRequests.trim());
    }
    
    // Update submissionData.interests with the updated array
    submissionData.interests = interestsArray;
    
    // console.log("submissiondata", submissionData);
    // console.log("Form data:", submissionData);
      genitinerary(submissionData).then(async (res)=>{
      clearTimeout(timeoutTimer);
      //if error thrown is invalid destination then show the error message
      if(res.error){
        //handle error here and sendback to form page
        console.log("Error in generating itinerary:",res.error)
        setIsAggregating(false);
        setShowSummary(false);
        setFormVisible(true);
        toast.error("Invalid destination. Please try again with a valid destination.", {
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.5)',
          },
          icon: '🌍',
        });
        navigate("/form");
      }
      // console.log("newitinerary",JSON.parse(res.newItenary))
      dispatch(addItinerary(await JSON.parse(res.newItenary)))
      dispatch(addPlace(await JSON.parse(res.placesData)))
      
      // Calculate the itinerary number based on current store count
      const currentItinerariesCount = itineraries ? itineraries.length : 0;
      const newItineraryNumber = currentItinerariesCount + 1;
      
      navigate(`/itinerary/${newItineraryNumber}`);
    }).catch((error) => {
      clearTimeout(timeoutTimer);
      console.log("Error in generating itinerary:", error.message);
      setIsAggregating(false);
      setShowSummary(false);
      setFormVisible(true);
      
      // Handle different types of errors with specific toast messages
      if (error.message === 'Invalid destination') {
        toast.error("Invalid destination. Please try again with a valid destination.", {
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.5)',
          },
          icon: '🌍',
        });
      } else if (error.message.includes('Too many AI requests')) {
        toast.error("Too many AI itinerary requests. Please try again after an hour.", {
          duration: 6000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(255, 99, 71, 0.5)',
          },
          icon: '⏳',
        });
      } else if (error.message.includes('Rate limit exceeded') || error.message.includes('Too many')) {
        toast.error("Rate limit exceeded. Please try again later.", {
          duration: 5000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(255, 165, 0, 0.5)',
          },
          icon: '⚠️',
        });
      } else {
        toast.error("Failed to generate itinerary. Please try again.", {
          duration: 4000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(220, 20, 60, 0.5)',
          },
          icon: '❌',
        });
      }
      
      navigate("/form");
    })
  }
  // Particles for background animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));

  // Add a state to track if loading is taking too long
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  // Add function to navigate to homepage or other sections
  const handleExploreMore = () => {
    navigate("/");
    // You could also navigate to another section of your app
  };


  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 pt-20 pb-16 sm:pt-24 md:pt-28 lg:pt-32 overflow-hidden">
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
      <div className="relative z-10 mt-8 sm:mt-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            delay: 0.5

          }}
          className="mb-8 text-center"
        >
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-blue-300 mt-4 max-w-xl mx-auto text-sm sm:text-base lg:text-lg"
          >
            Let's create your perfect journey, tailored exactly to your preferences.
          </motion.p>
        </motion.div>
      </div>

      <AnimatePresence mode="popLayout">
        {formVisible && !isAggregating && (
          <motion.div
            key="form-container"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-3xl z-10 mt-4 sm:mt-6 md:mt-8"
          >
            <BackgroundGradient className="rounded-2xl p-0.5">
              <form onSubmit={handleSubmit} className="bg-black/90 rounded-2xl p-8 relative">
                {/* Progress indicator - continuous bar */}
                <div className="mb-8">
                  <div className="w-full h-1 bg-gray-700 rounded-full relative overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(currentStep / 4) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 relative">
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
                        className={`text-xs sm:text-sm lg:text-base px-2 py-1 rounded-md cursor-pointer ${
                          step <= currentStep
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

                      {/* Start Date Field with validation */}
                      <div className="space-y-2">
                        <Label className="text-blue-200 text-sm sm:text-base lg:text-lg">Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-black/60 border h-12 sm:h-12 hover:bg-black/70 text-sm sm:text-base lg:text-lg",
                                validationErrors.startdate 
                                  ? "border-red-500 focus:border-red-500" 
                                  : "border-blue-500/20 focus:border-purple-500/50"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                              {formData.startdate ? (
                                format(formData.startdate, "PPP")
                              ) : (
                                <span className="text-gray-400">Select your start date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-black/90 border border-blue-500/30">
                            <Calendar
                              mode="single"
                              selected={formData.startdate}
                              onSelect={(date) => handleChange("startdate", date)}
                              initialFocus
                              fromDate={new Date()} // Disable past dates
                              className="bg-black text-white scale-90 sm:scale-100 max-w-[280px] sm:max-w-none"
                            />
                          </PopoverContent>
                        </Popover>
                        {validationErrors.startdate && (
                          <div className="text-red-500 text-xs flex items-center mt-1">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {validationErrors.startdate}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end mt-8">
                        <HoverBorderGradient
                          as="button"
                          //@ts-ignore
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

                      {/* Budget Slider with manual input */}
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
                          value={formData.number_of_persons}
                          onChange={(e) => handleChange("number_of_persons", Number(e.target.value))}
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
                              onClick={() => handleChange("number_of_persons", num)}
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                formData.number_of_persons === num
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

                      {/* Trip Duration with manual input - updated for 7 day limit */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-blue-200">Trip Duration (days)</Label>
                          <div className="flex items-center">
                            <Input
                              type="number"
                              value={formData.number_of_days}
                              onChange={(e) => handleChange("number_of_days", Math.min(Number(e.target.value), 7))}
                              className={cn(
                                "w-24 sm:w-28 h-10 sm:h-12 bg-black/60 border text-white text-sm sm:text-base lg:text-lg px-3 py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                validationErrors.number_of_days 
                                  ? "border-red-500 focus:border-red-500" 
                                  : "border-blue-500/20 focus:border-purple-500/50"
                              )}
                              min={1}
                              max={7}
                            />
                            <span className="ml-2 text-xs text-blue-300">(max 7)</span>
                          </div>
                        </div>
                        {validationErrors.number_of_days && (
                          <div className="text-red-500 text-xs flex items-center mt-1">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {validationErrors.number_of_days}
                          </div>
                        )}
                        <div className="flex items-center space-x-4">
                          {[1, 2, 3, 5, 7].map(num => (
                            <motion.button
                              key={num}
                              type="button"
                              onClick={() => handleChange("number_of_days", num)}
                              className={cn(
                                "h-10 px-3 rounded-full flex items-center justify-center transition-all",
                                formData.number_of_days === num
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
                          //@ts-ignore
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
                          //@ts-ignore
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
                              {formData.startdate ? format(formData.startdate, "PPP") : "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm md:text-base">Budget</p>
                            <p className="text-white text-base md:text-lg font-medium">{getCurrencySymbol()}{formData.budget}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm md:text-base">Travelers</p>
                            <p className="text-white text-base md:text-lg font-medium">{formData.number_of_persons} {formData.number_of_persons === 1 ? "person" : "people"}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm md:text-base">Trip Duration</p>
                            <p className="text-white text-base md:text-lg font-medium">
                              {formData.number_of_days} {formData.number_of_days === 1 ? "day" : "days"} 
                              <span className="text-xs text-blue-300 ml-1">(max 7 days)</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Interests</p>
                            <p className="text-white">
                              {formData.interests.length > 0
                                ? Array.isArray(formData.interests) ? formData.interests.join(", ") : formData.interests
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
                          //@ts-ignore
                          type="button"
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white shadow-lg shadow-purple-900/20"
                          onClick={() => {
                            if (validateForm()) {
                              handleGenerateItinerary(formData);
                            } else {
                              if (validationErrors.startdate) {
                                toast.error(validationErrors.startdate);
                              }
                              if (validationErrors.number_of_days) {
                                toast.error(validationErrors.number_of_days);
                              }
                            }
                          }}
                        >
                          <span className="flex items-center justify-center text-xs sm:text-sm whitespace-nowrap">
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
              className="text-center z-20 w-full max-w-3xl mx-auto mt-10 sm:mt-12 md:mt-16"
            >
              <div className="w-full flex justify-center items-center mb-4">
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
                  We're generating a personalized itinerary for your {formData.number_of_days}-day adventure to {formData.destination}. This might take a moment.
                </p>
                <div className="relative h-2 w-64 mx-auto bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 50, ease: "easeInOut" }}
                  />
                </div>
                
                {/* Timeout message and button */}
                <AnimatePresence>
                  {showTimeoutMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="mt-10 p-4 rounded-lg border border-blue-500/30 bg-black/60 max-w-md mx-auto"
                    >
                      <h3 className="text-xl font-semibold text-blue-300 mb-2">
                        Taking a bit longer than expected
                      </h3>
                      <p className="text-gray-300 mb-4 text-sm">
                        Don't worry! Your itinerary is still being created. You can continue exploring our site or close this tab - your itinerary will be saved and ready when you return.
                      </p>
                      <div className="flex justify-center"> {/* Added centering wrapper */}
                        <HoverBorderGradient
                          as="button"
                          //@ts-ignore
                          type="button"
                          onClick={handleExploreMore}
                          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white shadow-lg shadow-purple-900/20 text-sm"
                        >
                          <span className="flex items-center justify-center">
                            Explore More <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        </HoverBorderGradient>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}