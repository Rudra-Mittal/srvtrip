import React from "react";

import { Spotlight } from "../components/ui/spotlight";
import { SparklesCore } from "../components/ui/sparkles";
import { HeroParallaxDemo, products } from "@/components/heroparallax";
// import { sample_destination_images } from "../sample_Images_itinerary";

export default function LandingPage() {
  // Reformat the sample images for HeroParallax
//   const heroImages = sample_destination_images.map((item, index) => ({
//     title: item.title,
//     link: "#",
//     thumbnail: item.url,
//   }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Spotlight effect */}
    

      {/* Parallax background with travel destinations */}
      <div >
        <HeroParallaxDemo />
      </div>

      {/* Overlay to ensure text readability */}
      {/* <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div> */}

      {/* Main hero content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">

        {/* Hero text content */}
        
      </div>

      {/* Scroll indicator */}
    
    </div>
  );
}