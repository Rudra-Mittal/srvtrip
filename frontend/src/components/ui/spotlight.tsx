import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
  direction?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export const Spotlight = ({ 
  className, 
  fill, 
  direction = "top-left" 
}: SpotlightProps) => {
  
  // This determines the transform matrix based on the desired direction
  const getTransform = () => {
    switch (direction) {
      case "top-left": // diagonal from top-left to bottom-right
        return "matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)";
      case "top-right": // diagonal from top-right to bottom-left
        return "matrix(0.822377 -0.568943 0.568943 0.822377 155.12 2291.09)";
      case "bottom-left": // diagonal from bottom-left to top-right
        return "matrix(-0.822377 0.568943 -0.568943 -0.822377 3631.88 550.91)";
      case "bottom-right": // diagonal from bottom-right to top-left
        return "matrix(0.822377 0.568943 0.568943 -0.822377 155.12 550.91)";
      default:
        return "matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)";
    }
  };

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="600"
      height="600"
    >
      <defs>
        <radialGradient id="spotlightGradient" cx="50%" cy="30%" r="70%" fx="50%" fy="30%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="60%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        
        <filter id="blurFilter">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
    
      <path
        d="M50 10 
           C47 20, 42 25, 35 35
           C28 45, 20 55, 15 70
           C25 85, 35 90, 50 90
           C65 90, 75 85, 85 70
           C80 55, 72 45, 65 35
           C58 25, 53 20, 50 10"
        fill="url(#spotlightGradient)"
        filter="url(#blurFilter)"
        opacity="0.35"
      />
    </svg>
  );
};