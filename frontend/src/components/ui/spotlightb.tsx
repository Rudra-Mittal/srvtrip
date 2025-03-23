import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
  direction?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export const Spotlightb = ({ 
  className, 
  fill, 
  direction = "top-right" // Changed default direction to top-right
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
        return "matrix(0.822377 -0.568943 0.568943 0.822377 155.12 2291.09)"; // Changed default to top-right
    }
  };

  return (
    <svg
    className={cn(
      "animate-spotlightb pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
      className
    )}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 3787 2842"
    fill="none"
  >
    <g filter="url(#filter)">
      <ellipse
        cx="1924.71"
        cy="273.501"
        rx="1924.71"
        ry="273.501"
        transform={getTransform()}
        fill={fill || "white"}
        fillOpacity="0.21"
      ></ellipse>
    </g>
    <defs>
      <filter
        id="filter"
        x="0.860352"
        y="0.838989"
        width="3785.16"
        height="2840.26"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          stdDeviation="151"
          result="effect1_foregroundBlur_1065_8"
        ></feGaussianBlur>
      </filter>
    </defs>
  </svg>
  );
};