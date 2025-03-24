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
  const [textVisible, setTextVisible] = useState(false);
  
  // Animation sequence control
  useEffect(() => {
    // Immediately show images at full brightness
    const timer1 = setTimeout(() => {
      setInitialized(true);
      setImagesLoaded(true);
      
      // After delay, activate spotlight and text at the same time
      const timer2 = setTimeout(() => {
        setSpotlightActive(true);
        setTextVisible(true);
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

  return (
    <div
      ref={ref}
      className="h-[300vh] py-96 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header spotlightActive={spotlightActive} textVisible={textVisible} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
        }}
        className="z-10 pointer-events-auto"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: initialized ? 1 : 0.2 }}
        transition={{ duration: 3}}
      >
        <motion.div 
          className="flex flex-row-reverse space-x-reverse space-x-20 mb-20"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: imagesLoaded ? 
              (hasScrolled ? 0.9 : (spotlightActive ? 0.5 : 0.9)) : 0 
          }}
          transition={{ duration: 1}}
        >
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
              isLoaded={imagesLoaded}
              spotlightActive={spotlightActive && !hasScrolled}
              hasScrolled={hasScrolled}
            />
          ))}
        </motion.div>
        <motion.div 
          className="flex flex-row mb-20 space-x-20"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: imagesLoaded ? 
              (hasScrolled ? 0.9 : (spotlightActive ? 0.5 : 0.9)) : 0 
          }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
              isLoaded={imagesLoaded}
              spotlightActive={spotlightActive && !hasScrolled}
              hasScrolled={hasScrolled}
            />
          ))}
        </motion.div>
        <motion.div 
          className="flex flex-row-reverse space-x-reverse space-x-20"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: imagesLoaded ? 
              (hasScrolled ? 0.9 : (spotlightActive ? 0.5 : 0.9)) : 0 
          }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
              isLoaded={imagesLoaded}
              spotlightActive={spotlightActive && !hasScrolled}
              hasScrolled={hasScrolled}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({ spotlightActive = false, textVisible = false }) => {
  return (
    <div className="absolute top-0 left-0 w-full z-20 flex flex-col justify-center items-center py-10 sm:py-16 md:py-20 pointer-events-none">
    {/* Center spotlight with vertical animation */}
    {spotlightActive && (
      <>
       <Spotlight
          className=""
          fill="rgb(255, 255, 255)"
        />

      </>
    )}
  
    {/* Text container with better spacing for mobile */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: textVisible ? 1 : 0 }}
      transition={{ duration: 1.5 }}
      className="translate-y-[2rem] xs:translate-y-[2.5rem] sm:translate-y-[4rem] md:translate-y-[6rem] relative z-30 px-4 sm:px-6 md:px-0"
    >
      {/* The rest of your Header content remains the same */}
      <div className="mb-4 sm:mb-6 md:mb-8 text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl justify-center items-center text-center">
        {/* Larger SrvTrip text with animated gradient */}
        <motion.div 
          className="text-transparent bg-clip-text"
          animate={{ 
            backgroundImage: [
              "linear-gradient(to right, #3b82f6, #6366f1, #a855f7)",
              "linear-gradient(to right, #8b5cf6, #3b82f6, #06b6d4)",
              "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
              "linear-gradient(to right, #3b82f6, #6366f1, #a855f7)"
            ]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "mirror" 
          }}
        >
          <span className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl">
            SrvTrip
          </span>
        </motion.div>
          
          {/* Insert the component here */}
          <div className="h-[15rem] flex flex-col justify-center items-center px-4 mt-4">
            <div className="flex justify-center items-center gap-3 sm:gap-5 mb-4">
              <span className="text-4xl sm:text-5xl md:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-300 whitespace-nowrap">
                Build
              </span>
              <div className="w-[180px] sm:w-[220px] md:w-[280px] min-h-[60px] flex items-center">
                <FlipWords 
                  words={words} 
                  className="text-4xl sm:text-5xl md:text-6xl font-semibold"
                />
              </div>
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-blue-200 to-blue-600">
              Travel Itineraries with AI
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
        setImageOpacity(spotlightActive ? 0.5 : 0.9);
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
      className="group/product h-96 w-[30rem] relative shrink-0"
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
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};