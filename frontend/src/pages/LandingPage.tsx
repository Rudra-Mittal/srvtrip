import React from "react";

import { Spotlight } from "../components/ui/spotlight";
import { SparklesCore } from "../components/ui/sparkles";
import { HeroParallaxDemo, products } from "@/components/heroparallax";
import ParentMap from "@/components/ParentMap";
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
    

      {/* Parallax background with travel destinations */}
      <div >
        <HeroParallaxDemo />
      </div>
      {/* <ParentMap/> */}
      {/* Scroll indicator */}
    
    </div>
  );
}