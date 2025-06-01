"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FlipWords } from "./flip-words";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { Spotlight } from "./spotlight";

const words = ["Extraordinary", "Stunning", "Unforgettable", "Next-Gen"];

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = useMemo(() => products.slice(0, 5), [products]);
  const secondRow = useMemo(() => products.slice(5, 10), [products]);
  const thirdRow = useMemo(() => products.slice(10, 15), [products]);
  
  const ref = React.useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [spotlightActive, setSpotlightActive] = useState(false);
  const [spotlightCompleted, setSpotlightCompleted] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  
  // Animation sequence control - synchronized timings
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setInitialized(true);
      
      const timer2 = setTimeout(() => {
        setSpotlightActive(true);
        setTextVisible(true);
        
        // Wait for spotlight animation to complete (2000ms) + fade start delay (1000ms)
        const timer3 = setTimeout(() => {
          setSpotlightCompleted(true);
          setImagesLoaded(true);
        }, 3000); // Spotlight animation (2000ms) + fade delay (1000ms)
        
        return () => clearTimeout(timer3);
      }, 1500);
      
      return () => clearTimeout(timer2);
    }, 100);
    
    return () => clearTimeout(timer1);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [hasScrolled, setHasScrolled] = useState(false);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      setHasScrolled(value > 0.05); // More sensitive scroll detection
    });
    
    return unsubscribe;
  }, [scrollYProgress]);

  const springConfig = { stiffness: 400, damping: 40, bounce: 0.2 }; // Improved spring config

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
  
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0, 300]),
    springConfig
  );
  
  useEffect(() => {
    if (initialized) {
      window.scrollTo(0, 0);
    }
    
    return () => {
      translateX.set(0);
      translateXReverse.set(0);
      rotateX.set(15);
      rotateZ.set(20);
      translateY.set(0);
    };
  }, [initialized, translateX, translateXReverse, rotateX, rotateZ, translateY]);

  const handleSpotlightComplete = useCallback(() => {
    // Don't immediately set images loaded here, let the timer handle it
    // This ensures proper synchronization
  }, []);

  return (
    <div
      ref={ref}
      className="h-[200vh] overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] "
    >
      <Header 
        spotlightActive={spotlightActive} 
        textVisible={textVisible} 
        hasScrolled={hasScrolled}
        onSpotlightComplete={handleSpotlightComplete}
      />
      
      <div className="absolute inset-0 flex justify-center">
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
          }}
          className="z-10 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: spotlightCompleted ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex  space-x-4 xs:space-x-6 sm:space-x-10 md:space-x-16 lg:space-x-20 mb-8 sm:mb-12 md:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: imagesLoaded && spotlightCompleted ? 1 : 0, y: imagesLoaded && spotlightCompleted ? 0 : 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {firstRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
                isLoaded={imagesLoaded && spotlightCompleted}
                spotlightActive={spotlightActive}
                hasScrolled={hasScrolled}
              />
            ))}
          </motion.div>
          <motion.div 
            className="flex flex-row mb-8 sm:mb-12 md:mb-16 lg:mb-20 space-x-4 xs:space-x-6 sm:space-x-10 md:space-x-16 lg:space-x-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: imagesLoaded && spotlightCompleted ? 1 : 0, y: imagesLoaded && spotlightCompleted ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateXReverse}
                key={product.title}
                isLoaded={imagesLoaded && spotlightCompleted}
                spotlightActive={spotlightActive}
                hasScrolled={hasScrolled}
              />
            ))}
          </motion.div>
          <motion.div 
            className="flex  space-x-4 xs:space-x-6 sm:space-x-10 md:space-x-16 lg:space-x-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: imagesLoaded && spotlightCompleted ? 1 : 0, y: imagesLoaded && spotlightCompleted ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {thirdRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
                isLoaded={imagesLoaded && spotlightCompleted}
                spotlightActive={spotlightActive}
                hasScrolled={hasScrolled}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export const Header = ({ 
  spotlightActive = false, 
  textVisible = false, 
  hasScrolled = false,
  onSpotlightComplete 
}: {
  spotlightActive?: boolean;
  textVisible?: boolean; 
  hasScrolled?: boolean;
  onSpotlightComplete?: () => void;
}) => {
  return (
    <div className="absolute inset-0 w-full h-screen z-20 flex flex-col justify-center items-center pointer-events-none">
      {spotlightActive && (
        <Spotlight
          className="w-full h-full absolute inset-0"
          fill="rgb(255, 255, 255)"
          mode="light"
          hasScrolled={hasScrolled}
          onAnimationComplete={onSpotlightComplete}
        />
      )}
    
      {/* Text container without any borders or backgrounds */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 30 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-30 px-4 sm:px-6 md:px-0 w-full max-w-full"
      >
        <div className="mb-4 sm:mb-6 md:mb-8 text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl flex flex-col justify-center items-center text-center">
          {/* SrvTrip text with proper styling */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: textVisible ? 1 : 0, scale: textVisible ? 1 : 0.9 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            <h1 className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-bold relative">
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 filter drop-shadow-2xl"
                style={{
                  textShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(147, 51, 234, 0.3)',
                }}
              >
                SrvTrip
              </span>
              {/* Subtle glow effect */}
              <div 
                className="absolute inset-0 text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text blur-sm opacity-30"
                aria-hidden="true"
              >
                SrvTrip
              </div>
            </h1>
          </motion.div>
            
          {/* Text sections without any background containers */}
          <motion.div 
            className="flex flex-col justify-center items-center px-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          >
            <div className="flex flex-col xs:flex-row justify-center items-center gap-2 xs:gap-3 sm:gap-5 mb-6 w-full">
              <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-white drop-shadow-2xl">
                Build
              </span>
              <div className="w-full xs:w-[200px] sm:w-[240px] md:w-[320px] min-h-[60px] flex items-center justify-center">
                <FlipWords 
                  words={words} 
                  className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white drop-shadow-2xl"
                />
              </div>
            </div>
            
            <div className="text-center text-xl xs:text-2xl sm:text-3xl md:text-4xl font-semibold">
              <span className="bg-gradient-to-b from-white via-blue-100 to-blue-300 text-transparent bg-clip-text drop-shadow-2xl">
                Travel Itineraries with AI
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
  isLoaded = false,
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
  const [imageOpacity, setImageOpacity] = useState(0);
  
  useEffect(() => {
    if (isLoaded) {
      setImageOpacity(hasScrolled ? 0.95 : 0.85);
    }
  }, [hasScrolled, isLoaded]);
  
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{
        y: -20,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      key={product.title}
      className="group/product h-40 xs:h-48 sm:h-64 md:h-80 lg:h-96 w-[8rem] xs:w-[10rem] sm:w-[16rem] md:w-[20rem] lg:w-[24rem] relative shrink-0 cursor-pointer"
    >
      <motion.img
        src={product.thumbnail}
        height="600"
        width="600"
        initial={{ opacity: 0, filter: "brightness(70%) contrast(1.1) blur(1px)" }}
        animate={{ 
          opacity: isLoaded ? imageOpacity : 0,
          filter: "brightness(85%) contrast(1.1) saturate(1.1) blur(0.7px)"
        }}
        whileHover={{
          filter: "brightness(100%) contrast(1.2) saturate(1.2) blur(0px)",
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          filter: { duration: 0.8 }
        }}
        className="object-cover object-center absolute h-full w-full inset-0 rounded-lg shadow-2xl"
        alt={product.title}
      />
      
      {/* Simple hover overlay without blur effects */}
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-100 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-all duration-300 ease-out pointer-events-none rounded-lg" />
    </motion.div>
  );
};