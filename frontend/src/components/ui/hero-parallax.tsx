"use client";
import React, { useEffect, useState } from "react";
import { FlipWords } from "./flip-words";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { Spotlight } from "./spotlight";
const words=["Extraordinary", "Stunning", "Unforgettable", "Next-Gen"];

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [spotlightActive, setSpotlightActive] = useState(false);
  const [spotlightCompleted, setSpotlightCompleted] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  
  // Animation sequence control
  useEffect(() => {
    // First initialize the component
    const timer1 = setTimeout(() => {
      setInitialized(true);
      
      // After a short delay, activate the spotlight only (no content)
      const timer2 = setTimeout(() => {
        setSpotlightActive(true);
        setTextVisible(true);
        
        // Wait 3 seconds for spotlight animation to complete before showing images
        const timer3 = setTimeout(() => {
          setSpotlightCompleted(true);
          setImagesLoaded(true);
        }, 3000); // Match this with the spotlight animation duration
        
        return () => clearTimeout(timer3);
      }, 2000);
      
      return () => clearTimeout(timer2);
    }, 100);
    
    return () => clearTimeout(timer1);
  }, []);
  
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Create a derived state for tracking whether user has scrolled
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Monitor scroll position changes
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      // Consider user has scrolled if we're more than 10% down the page
      setHasScrolled(value > 0.1);
    });
    
    return () => {
      unsubscribe();
    };
  }, [scrollYProgress]);

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  // Update opacity to be based on scroll position

  
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  
  // Reset scroll position on page refresh
  useEffect(() => {
    if (initialized) {
      window.scrollTo(0, 0);
    }
    
    return () => {
      // Cleanup any animation values when component unmounts
      translateX.set(0);
      translateXReverse.set(0);
      rotateX.set(15);
      rotateZ.set(20);
      translateY.set(-700);
    };
  }, [initialized]);

  // Handler for spotlight animation completion
  const handleSpotlightComplete = () => {
    setSpotlightCompleted(true);
    setImagesLoaded(true);
  };

  return (
    <div
      ref={ref}
      className="h-[200vh] overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header 
        spotlightActive={spotlightActive} 
        textVisible={textVisible} 
        hasScrolled={hasScrolled}
        onSpotlightComplete={handleSpotlightComplete}
      />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
        }}
        className="z-10 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: spotlightCompleted ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="flex flex-row-reverse space-x-reverse space-x-4 xs:space-x-6 sm:space-x-10 md:space-x-16 lg:space-x-20 mb-8 sm:mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: imagesLoaded && spotlightCompleted ? 
              (hasScrolled ? 0.9 : 0.9) : 0 
          }}
          transition={{ duration: 1 }}
        >
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
              isLoaded={imagesLoaded && spotlightCompleted}
              spotlightActive={false}
              hasScrolled={hasScrolled}
            />
          ))}
        </motion.div>
        <motion.div 
          className="flex flex-row mb-8 sm:mb-12 md:mb-16 lg:mb-20 space-x-4 xs:space-x-6 sm:space-x-10 md:space-x-16 lg:space-x-20"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: imagesLoaded && spotlightCompleted ? 
              (hasScrolled ? 0.9 : 0.9) : 0 
          }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
              isLoaded={imagesLoaded && spotlightCompleted}
              spotlightActive={false}
              hasScrolled={hasScrolled}
            />
          ))}
        </motion.div>
        <motion.div 
          className="flex flex-row-reverse space-x-reverse space-x-4 xs:space-x-6 sm:space-x-10 md:space-x-16 lg:space-x-20"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: imagesLoaded && spotlightCompleted ? 
              (hasScrolled ? 0.9 : 0.9) : 0 
          }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
              isLoaded={imagesLoaded && spotlightCompleted}
              spotlightActive={false}
              hasScrolled={hasScrolled}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({ 
  spotlightActive = false, 
  textVisible = false, 
  hasScrolled = false,
  onSpotlightComplete 
}) => {
  return (
    <div className="absolute inset-0 w-full h-screen z-20 flex flex-col justify-center items-center pointer-events-none">
      {/* Center spotlight with vertical animation */}
      {spotlightActive && (
        <Spotlight
          className="w-full h-full absolute inset-0"
          fill="rgb(255, 255, 255)"
          mode="light"
          hasScrolled={hasScrolled}
          onAnimationComplete={onSpotlightComplete}
        />
      )}
    
      {/* Text container centered vertically */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: textVisible ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        className="relative z-30 px-4 sm:px-6 md:px-0 w-full max-w-full"
      >
        {/* The rest of your Header content remains the same */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl flex flex-col justify-center items-center text-center">
          {/* Larger SrvTrip text with animated gradient */}
          <motion.div 
            className="text-transparent bg-clip-text filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
            animate={{ 
              backgroundImage: [
                "linear-gradient(to right, #3b82f6, #6366f1, #a855f7)",
                "linear-gradient(to right, #8b5cf6, #3b82f6, #06b6d4)",
                "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
                "linear-gradient(to right, #3b82f6, #6366f1, #a855f7)"
              ]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          >
            <div className="xs:text-2xl sm:text-3xl md:text-7xl text-6xl font-bold ">
              SrvTrip
            </div>
          </motion.div>
            
          {/* Text sections with better mobile centering */}
          <div className="h-auto sm:h-[15rem] flex flex-col justify-center items-center px-4 mt-4">
            {/* Build + FlipWords section */}
            <div className="flex flex-col xs:flex-row justify-center items-center gap-2 xs:gap-3 sm:gap-5 mb-4 w-full">
              <span className="sm:text-lg md:text-2xl text-2xl font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Build
              </span>
              <div className="w-full xs:w-[180px] sm:w-[220px] md:w-[280px] min-h-[60px] flex items-center justify-center">
                <FlipWords 
                  words={words} 
                  className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                />
              </div>
            </div>
            
            {/* Travel Itineraries text */}
            <div className="text-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-semibold text-white bg-clip-text drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] mt-2 xs:mt-0">
              <span className="bg-gradient-to-b from-white to-blue-300 text-transparent bg-clip-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Travel Itineraries with AI
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
  isLoaded = false,
  spotlightActive = false,
  hasScrolled = false
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
  isLoaded?: boolean;
  spotlightActive?: boolean;
  hasScrolled?: boolean;
}) => {
  // Track whether we've ever scrolled down
  const [hasEverScrolled, setHasEverScrolled] = useState(false);
  // Track the previous scroll state to determine direction
  const [prevScrollState, setPrevScrollState] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(0);
  
  // Update opacity based on scroll direction
  useEffect(() => {
    if (!prevScrollState && hasScrolled) {
      // Scrolling down - increase opacity and remember we've scrolled
      setImageOpacity(0.9);
      setHasEverScrolled(true);
    } else if (prevScrollState && !hasScrolled) {
      // Scrolling up - if we've ever scrolled down, keep high opacity
      if (hasEverScrolled) {
        // Keep the high opacity
        setImageOpacity(0.9);
      } else {
        // Initial state behavior
        setImageOpacity(spotlightActive ? 0.5 : 0.9);
      }
    } else if (isLoaded && !hasScrolled) {
      // Initial state or after refresh
      if (!hasEverScrolled) {
        setImageOpacity(spotlightActive ? 1: 0.9);
      }
    }
    
    // Update the previous scroll state
    setPrevScrollState(hasScrolled);
  }, [hasScrolled, isLoaded, spotlightActive, prevScrollState, hasEverScrolled]);
  
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-40 xs:h-48 sm:h-64 md:h-80 lg:h-96 w-[8rem] xs:w-[10rem] sm:w-[16rem] md:w-[20rem] lg:w-[24rem] relative shrink-0"
    >
        <motion.img
          src={product.thumbnail}
          height="600"
          width="600"
          initial={{ opacity: 0, filter: "brightness(80%)" }}
          animate={{ 
            opacity: isLoaded ? imageOpacity : 0,
            filter: hasEverScrolled || hasScrolled
              ? "brightness(80%)" // Full brightness when ever scrolled
              : (spotlightActive ? "brightness(40%)" : "brightness(80%)") // Dimmed with spotlight initially
          }}
          transition={{ 
            opacity: { duration: 1 },
            filter: { duration: 1 }
          }}
          className="object-cover object-left-top absolute h-full w-full inset-0 cover-fit"
          alt={product.title}
        />
      
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-100 group-hover/product:transition-all duration-300 ease-out pointer-events-none"></div>
    </motion.div>
  );
};