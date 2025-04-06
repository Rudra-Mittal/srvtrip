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
    autoRotate: false,
    autoRotateSpeed: 1.0,
    globeScale: 1.15,
  };
  
  

  return (
    <div className="flex flex-row items-center justify-center  h-screen md:h-auto bg-black relative w-full opacity-100 z-50s">
      <div className=" mx-auto w-full relative overflow-hidden h-screen  px-4">
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none z-40" />
        <div className="absolute w-full ml-10  h-72 md:h-full z-5 ">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
