import  { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
  direction?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  mode?: "light" | "dark";
  intensity?: number;
  width?: number;
  hasScrolled?: boolean;
  onAnimationComplete?: () => void;
};

export const Spotlight = ({ 
  className, 
  fill, 
  mode = "light",
  intensity = 0.2,
  width = 100,
  hasScrolled = false,
  onAnimationComplete
}: SpotlightProps) => {
  const uniqueId = useRef(`spotlight-${Math.random().toString(36).substr(2, 9)}`).current;
  const gradientRef = useRef<SVGRadialGradientElement>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(0); // Start with opacity 0
  const animationStartedRef = useRef(false); // Use ref instead of state to prevent re-renders
  const animationCompletedRef = useRef(false);
  const fadeOutStartedRef = useRef(false); // Track if fade-out has started
  
  // Detect viewport width for responsive adjustments
  useEffect(() => {
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
    };
    
    // Set initial width
    updateWidth();
    
    // Update on resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  // Delay spotlight animation start - only run once
  useEffect(() => {
    if (animationStartedRef.current) return;
    
    const startDelay = setTimeout(() => {
      animationStartedRef.current = true;
      setOpacity(1); // Make visible after delay
      
      // Start animation after delay
      startSpotlightAnimation();
    }, 300); // 0.3 seconds delay
    
    return () => clearTimeout(startDelay);
  }, []);
  
  // Define spotlight animation function to avoid duplication
  const startSpotlightAnimation = () => {
    // Don't run if animation already completed
    if (animationCompletedRef.current) return;
    
    // Start with radius at 0%
    const gradient = gradientRef.current;
    if (!gradient) return;
    
    // Set initial state
    gradient.setAttribute("r", "0%");
    
    // Animation configuration
    const duration = 3000;
    const fps = 60;
    const steps = Math.floor(duration / 1000 * fps);
    let currentStep = 0;
    
    // Use cubic-bezier for easing
    const ease = (t: number) => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    // Calculate max radius based on screen size
    const getMaxRadius = () => {
      if (viewportWidth < 640) return 220;
      if (viewportWidth < 1024) return 250;
      return 280;
    };
    
    // Start animation loop
    const animationInterval = setInterval(() => {
      currentStep++;
      
      // Calculate progress (0 to 1)
      const linearProgress = currentStep / steps;
      
      // Apply easing for smoother animation
      const easedProgress = ease(linearProgress);
      
      // Calculate current radius percentage
      const maxRadius = getMaxRadius();
      const radius = Math.min(maxRadius, Math.round(easedProgress * 170));
      
      gradient?.setAttribute("r", `${radius}%`);
      
      // End animation when complete
      if (currentStep >= steps) {
        clearInterval(animationInterval);
        animationCompletedRef.current = true;
        
        // Notify parent that animation is complete
        if (onAnimationComplete) {
          onAnimationComplete();
        }
        
        // Add fade-out after 1 second or when user scrolls
        if (hasScrolled) {
          startFadeOut();
        } else {
          setTimeout(() => {
            if (!fadeOutStartedRef.current) {
              startFadeOut();
            }
          }, 1000); // Reduced from 2000 to 1000 for faster fade-out
        }
      }
    }, 1000 / fps);
    
    return () => clearInterval(animationInterval);
  };
  
  // Handle hasScrolled changes separately
  useEffect(() => {
    if (hasScrolled && animationCompletedRef.current && !fadeOutStartedRef.current) {
      startFadeOut();
    }
  }, [hasScrolled]);
  
  const startFadeOut = () => {
    // Only start fade-out once
    if (fadeOutStartedRef.current) return;
    fadeOutStartedRef.current = true;
    
    // Create a faster fade-out animation (1 second instead of 1.5)
    const fadeOutDuration = 1000;
    const fadeOutFPS = 60;
    const fadeOutSteps = Math.floor(fadeOutDuration / 1000 * fadeOutFPS);
    let fadeOutStep = 0;
    
    const ease = (t: number) => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const fadeOutInterval = setInterval(() => {
      fadeOutStep++;
      const fadeProgress = fadeOutStep / fadeOutSteps;
      const easedFadeProgress = ease(fadeProgress);
      setOpacity(1 - easedFadeProgress);
      
      if (fadeOutStep >= fadeOutSteps) {
        clearInterval(fadeOutInterval);
        setOpacity(0); // Ensure it's fully invisible at the end
      }
    }, 1000 / fadeOutFPS);
  };
  
  // Force fade-out when component unmounts
  useEffect(() => {
    return () => {
      if (!fadeOutStartedRef.current) {
        fadeOutStartedRef.current = true;
        setOpacity(0);
      }
    };
  }, []);
  
  // Enhanced colors based on mode
  const getPrimaryColor = () => {
    if (fill) return fill;
    return mode === "light" ? "white" : "#111";
  };
  
  const primaryColor = getPrimaryColor();
  const mixBlendMode = mode === "light" ? "screen" : "multiply";
  
  // Calculate points for enhanced spread
  const halfSpread = width / 2;
  const leftPoint = Math.min(0, 50 - halfSpread);
  const rightPoint = Math.max(100, 50 + halfSpread);
  
  // Make the height of the triangle responsive to screen size
  const triangleHeight = viewportWidth < 640 ? 100 : 150;
  const points = `50,0 ${leftPoint},${triangleHeight} ${rightPoint},${triangleHeight}`;
  
  // Adjust viewBox height based on screen size
  const viewBoxHeight = viewportWidth < 640 ? 100 : 150;
  
  return (
    <div className={cn("absolute inset-0 z-10", className)} style={{ pointerEvents: "none" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 100 ${viewBoxHeight}`}
        width="100%"
        height="100%"
        style={{ 
          mixBlendMode,
          position: "absolute",
          inset: 0,
          opacity: opacity, // Apply the opacity state
          transition: "opacity 0.2s linear" // Faster transition for more responsive fade
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient
            ref={gradientRef}
            id={`${uniqueId}-gradient`}
            cx="50%"
            cy={viewportWidth < 640 ? "25%" : "10%"}
            r="50%" 
            fx="50%"
            fy={viewportWidth < 640 ? "25%" : "10%"}
            style={{ transition: "r 0.2s ease" }} // Added transition for smoother radius changes
          >
            {/* Enhanced gradient with multiple color stops for more attractive look */}
            <stop offset="0%" stopColor={primaryColor} stopOpacity={intensity * 1.2} /> {/* Brighter center */}
            <stop offset="40%" stopColor={primaryColor} stopOpacity={intensity} />
            <stop offset="70%" stopColor={primaryColor} stopOpacity={intensity * 0.7} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
          
          <filter id={`${uniqueId}-filter`}>
            <feGaussianBlur stdDeviation={viewportWidth < 640 ? 6 : 10} /> {/* Increased blur for more glow */}
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 2 0" /> {/* Enhanced opacity/brightness */}
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