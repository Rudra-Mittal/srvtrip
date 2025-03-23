"use client";
import React from "react";
import { FlipWords } from "./flip-words";
import { TextGenerateEffect } from "./text-generate-effect";
import { HoverBorderGradient } from "./hover-border-gradient";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import { Spotlight } from "./spotlight";

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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

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
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20 opacity-50">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 opacity-50">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 opacity-50">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="absolute top-0 left-0 w-full z-20 flex flex-col justify-center items-center py-20">
      {/* First spotlight - top left to bottom right */}
      <Spotlight
        className="animate-[spotlight-left_4s_ease_0.0s_forwards] -top-40 left-0 md:left-0 md:-top-20 -translate-x-[10rem]"
        fill="rgb(255, 255, 255)"
        direction="top-left"
      />

      {/* Second spotlight - top right to bottom left */}
      <Spotlight
        className="animate-[spotlight-right_4s_ease_0.0s_forwards] -top-40 right-0 md:right-0 md:-top-20 translate-x-[10rem]"
        fill="rgb(255, 255, 255)"
        direction="top-right"
      />
    
      {/* Text container with initial opacity 0 and animated entrance */}
      <motion.div 
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
        className="translate-y-[8rem] relative z-30"
      >
        <div className="mb-8 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl justify-center items-center text-center">
          <TextGenerateEffect
            words="SrvTrip"
            className="bg-gradient-to-b from-blue-200 to-blue-600 bg-clip-text text-transparent text-xl"
          />
          <div className="my-4 justify-center items-center text-center ">
            <FlipWords
              words={["Extraordinary", "Stunning", "Unforgettable", "Next-Gen"]}
              duration={2500}
              className="bg-gradient-to-r from-violet-400 to-indigo-600 bg-clip-text py-2 text-transparent"
            />
          </div>
          <TextGenerateEffect
            words="Travel Itineraries with AI"
            className="bg-gradient-to-b from-blue-200 to-blue-600 bg-clip-text text-transparent "
          />
        </div>
        
        {/* Subtitle with separate entrance animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.8 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-neutral-300 sm:text-xl md:text-2xl "
        >
          Experience the future of travel planning powered by cutting-edge artificial intelligence
        </motion.p>

        {/* CTAs with final entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 "
        >
          <HoverBorderGradient
            as="button"
            className="bg-black px-8 py-3 text-lg font-medium text-white transition-all duration-300 hover:scale-105"
            containerClassName="rounded-full"
          >
            Get Started
          </HoverBorderGradient>
          
          <HoverBorderGradient
            as="button"
            className="bg-black px-8 py-3 text-lg font-medium text-blue-300 transition-all duration-300 hover:scale-105"
            containerClassName="rounded-full"
          >
            Explore Destinations
          </HoverBorderGradient>
        </motion.div>
      </motion.div>
    </div>
  );
};
export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
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
     
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
