import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
  direction?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  mode?: "light" | "dark";
  intensity?: number;
  width?: number;
};

export const Spotlight = ({ 
  className, 
  fill, 
  direction = "top-left",
  mode = "light",
  intensity = 0.3,
  width = 90
}: SpotlightProps) => {
  // Create unique IDs to prevent conflicts when multiple spotlights are used
  const uniqueId = useRef(`spotlight-${Math.random().toString(36).substr(2, 9)}`).current;
  const gradientRef = useRef<SVGRadialGradientElement>(null);
  
  useEffect(() => {
    console.log("Spotlight component mounted");
    
    // Start with radius at 0%
    const gradient = gradientRef.current;
    if (!gradient) {
      console.log("Gradient ref not found");
      return;
    }
    
    // Set initial state
    gradient.setAttribute("r", "0%");
    
    // Animation configuration
    const duration = 2800; // Total animation duration in ms
    const fps = 60; // Frames per second
    const steps = Math.floor(duration / 1000 * fps); // Total animation steps
    let currentStep = 0;
    
    // Use cubic-bezier for easing
    const ease = (t: number) => {
      // Cubic bezier approximation of (0.4, 0, 0.2, 1)
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    // Start animation loop
    const animationInterval = setInterval(() => {
      currentStep++;
      
      // Calculate progress (0 to 1)
      const linearProgress = currentStep / steps;
      
      // Apply easing for smoother animation
      const easedProgress = ease(linearProgress);
      
      // Calculate current radius percentage
      const radius = Math.min(250, Math.round(easedProgress * 150)); // Increased max radius to 150
      
      // console.log(`Animating spotlight radius: ${radius}%`);
      gradient.setAttribute("r", `${radius}%`);
      
      // End animation when complete
      if (currentStep >= steps) {
        clearInterval(animationInterval);
        console.log("Spotlight animation complete");
      }
    }, 1000 / fps); // Update interval based on FPS
    
    // Cleanup on unmount
    return () => {
      clearInterval(animationInterval);
      console.log("Spotlight animation cleanup");
    };
  }, [])

  // Determine colors based on mode
  const primaryColor = mode === "light" ? "white" : "#111";
  const mixBlendMode = mode === "light" ? "screen" : "multiply";
  
  // Calculate points - adjusted to make the spotlight extend to the bottom
  const halfSpread = width / 2; // Increased spread
  const leftPoint = Math.min(0, 50 - halfSpread);
  const rightPoint = Math.max(100, 50 + halfSpread);
  const points = `50,0 ${leftPoint},150 ${rightPoint},150`; // Increased vertical reach to 150
  
  return (
    <div className={cn("absolute inset-0 z-10", className)} style={{ pointerEvents: "none" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 150" // Extended viewBox height to 150
        width="100%"
        height="100%"
        style={{ 
          mixBlendMode,
          position: "absolute",
          inset: 0,
          opacity: 1
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient
            ref={gradientRef}
            id={`${uniqueId}-gradient`}
            cx="50%"
            cy="10%" // Moved gradient origin higher
            r="50%" 
            fx="50%"
            fy="10%" // Moved focal point higher
            style={{ transition: "r" }}
          >
            <stop offset="0%" stopColor={primaryColor} stopOpacity={intensity} />
            <stop offset="50%" stopColor={primaryColor} stopOpacity={intensity * 0.6} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
          
          <filter id={`${uniqueId}-filter`}>
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
      
        {/* Spotlight triangle */}
        <polygon
          points={points}
          fill={`url(#${uniqueId}-gradient)`}
          filter={`url(#${uniqueId}-filter)`}
        />
      </svg>
    </div>
  );
};