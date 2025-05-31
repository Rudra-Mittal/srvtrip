import { useEffect, useRef, useState, useCallback } from "react";
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
  intensity = 0.25,
  width = 100,
  hasScrolled = false,
  onAnimationComplete
}: SpotlightProps) => {
  const uniqueId = useRef(`spotlight-${Math.random().toString(36).substr(2, 9)}`).current;
  const gradientRef = useRef<SVGRadialGradientElement>(null);
  const animationFrameRef = useRef<number>();
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(0);
  const animationStartedRef = useRef(false);
  const animationCompletedRef = useRef(false);
  const fadeOutStartedRef = useRef(false);
  
  // Optimized viewport detection
  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateWidth, 100);
    };
    
    window.addEventListener('resize', debouncedUpdate);
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Improved animation with better timing
  const startSpotlightAnimation = useCallback(() => {
    if (animationCompletedRef.current) return;
    
    const gradient = gradientRef.current;
    if (!gradient) return;
    
    gradient.setAttribute("r", "0%");
    
    const startTime = performance.now();
    const duration = 2000; // Keep duration at 2000ms
    
    const ease = (t: number) => {
      // Custom easing for smoother spotlight appearance
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const getMaxRadius = () => {
      if (viewportWidth < 640) return 180;
      if (viewportWidth < 1024) return 220;
      return 250;
    };
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = ease(progress);
      
      const maxRadius = getMaxRadius();
      const radius = Math.round(easedProgress * maxRadius);
      
      gradient?.setAttribute("r", `${radius}%`);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationCompletedRef.current = true;
        onAnimationComplete?.();
        
        // Reduced delay to synchronize with photo loading
        setTimeout(() => startFadeOut(), 500); // Reduced from 1000ms to 500ms
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [viewportWidth, onAnimationComplete]);
  
  const startFadeOut = useCallback(() => {
    if (fadeOutStartedRef.current) return;
    fadeOutStartedRef.current = true;
    
    const startTime = performance.now();
    const duration = 800; // Faster fade-out to match photo appearance
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      
      setOpacity(1 - easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);
  
  useEffect(() => {
    if (animationStartedRef.current) return;
    
    const startDelay = setTimeout(() => {
      animationStartedRef.current = true;
      setOpacity(1);
      startSpotlightAnimation();
    }, 300);
    
    return () => clearTimeout(startDelay);
  }, [startSpotlightAnimation]);
  
  useEffect(() => {
    if (hasScrolled && animationCompletedRef.current && !fadeOutStartedRef.current) {
      startFadeOut();
    }
  }, [hasScrolled, startFadeOut]);
  
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  const primaryColor = fill || (mode === "light" ? "white" : "#111");
  const mixBlendMode = mode === "light" ? "screen" : "multiply";
  
  const halfSpread = width / 2;
  const leftPoint = Math.min(0, 50 - halfSpread);
  const rightPoint = Math.max(100, 50 + halfSpread);
  
  const triangleHeight = viewportWidth < 640 ? 120 : 160;
  const points = `50,0 ${leftPoint},${triangleHeight} ${rightPoint},${triangleHeight}`;
  const viewBoxHeight = viewportWidth < 640 ? 120 : 160;
  
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
          opacity,
          transition: "opacity 0.2s ease-out",
          willChange: "opacity"
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient
            ref={gradientRef}
            id={`${uniqueId}-gradient`}
            cx="50%"
            cy={viewportWidth < 640 ? "15%" : "5%"}
            r="50%" 
            fx="50%"
            fy={viewportWidth < 640 ? "15%" : "5%"}
          >
            <stop offset="0%" stopColor={primaryColor} stopOpacity={intensity * 1.6} />
            <stop offset="20%" stopColor={primaryColor} stopOpacity={intensity * 1.3} />
            <stop offset="40%" stopColor={primaryColor} stopOpacity={intensity * 1.0} />
            <stop offset="70%" stopColor={primaryColor} stopOpacity={intensity * 0.5} />
            <stop offset="90%" stopColor={primaryColor} stopOpacity={intensity * 0.2} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
          
          <filter id={`${uniqueId}-filter`}>
            <feGaussianBlur stdDeviation={viewportWidth < 640 ? 6 : 10} />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1.5 0" />
          </filter>
        </defs>
      
        <polygon
          points={points}
          fill={`url(#${uniqueId}-gradient)`}
          filter={`url(#${uniqueId}-filter)`}
        />
      </svg>
    </div>
  );
};