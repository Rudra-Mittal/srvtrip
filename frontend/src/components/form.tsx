import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Types for our form data
interface TravelFormData {
  destination: string;
  budget: number;
  numberOfPersons: number;
  interests: string[];
  days: number;
}

// Available interest options
const interestOptions = [
  "Beach", "Mountains", "City", "History", "Food", 
  "Adventure", "Relaxation", "Shopping", "Nature", "Culture"
];

export const TravelPlannerForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<TravelFormData>({
    destination: "",
    budget: 1000,
    numberOfPersons: 1,
    interests: [],
    days: 7
  });

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Animated background bubbles
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle interest selection
  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest]
        };
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden ">
      {/* Animated background bubbles */}
      {bubbles.map(bubble => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-purple-500/10 blur-xl"
          initial={{ 
            width: bubble.size, 
            height: bubble.size,
            x: `${bubble.x}vw`,
            y: `${bubble.y}vh`,
            opacity: 0.1
          }}
          animate={{
            x: [`${bubble.x}vw`, `${(bubble.x + 30) % 100}vw`],
            y: [`${bubble.y}vh`, `${(bubble.y + 20) % 100}vh`],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}

      {/* Main card with glass effect */}
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header decoration */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
        
        <div className="p-8">
          <motion.h1 
            className="text-3xl font-bold text-white mb-2 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Plan Your Dream Adventure
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 mb-8 text-center"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Fill in the details and let's create your perfect journey
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Destination Input */}
            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block text-purple-300 mb-2 font-medium" htmlFor="destination">
                Where would you like to go?
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </span>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  type="text"
                  id="destination"
                  name="destination"
                  placeholder="Paradise..."
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full pl-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 outline-none transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Budget slider */}
            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block text-purple-300 mb-2 font-large" htmlFor="budget">
                Budget (USD): ${formData.budget}
              </label>
              <input
                type="range"
                id="budget"
                name="budget"
                min="100"
                max="10000"
                step="100"
                value={formData.budget}
                onChange={handleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-s text-gray-400 mt-1">
                <span>$100</span>
                <span>$10,000</span>
              </div>
            </motion.div>

            {/* Number of persons and days */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" variants={itemVariants}>
              <div>
                <label className="block text-purple-300 mb-2 font-medium" htmlFor="numberOfPersons">
                  Travelers
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </span>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    type="number"
                    id="numberOfPersons"
                    name="numberOfPersons"
                    min="1"
                    max="20"
                    value={formData.numberOfPersons}
                    onChange={handleChange}
                    className="w-full pl-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white outline-none transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-purple-300 mb-2 font-large" htmlFor="days">
                  Duration (days)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </span>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    type="number"
                    id="days"
                    name="days"
                    min="1"
                    max="60"
                    value={formData.days}
                    onChange={handleChange}
                    className="w-full pl-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Interests selection */}
            <motion.div className="mb-8" variants={itemVariants}>
              <label className="block text-purple-300 mb-4 font-medium">
                What are you interested in?
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <motion.button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      formData.interests.includes(interest)
                        ? "bg-purple-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Plan My Trip
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default TravelPlannerForm;