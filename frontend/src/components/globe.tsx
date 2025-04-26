"use client";
import dynamic from "next/dynamic";
import { sampleArcs } from "../data/globearcs";
const World = dynamic(() => import("./ui/globe").then((m) => m.World), {
  ssr: false,
});

export function Globe() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "rgba(29, 7, 46, 1)",
    showAtmosphere: true,
    atmosphereColor: "FF0000",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 10,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
    globeScale: 1.5, // Larger scale to make it appear cut off
  };
  
  return (
    <div className="flex items-center justify-start h-full bg-black relative w-full opacity-100 z-30">
      <div className="relative overflow-hidden h-full w-[150%]">
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none z-40" />
        <div className="absolute w-full left-[-25%] h-full z-30">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
