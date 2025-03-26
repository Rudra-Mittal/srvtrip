import React, { useState, useEffect } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Reviews from "@/components/landingPage/features/reviews";
import { HeroParallaxDemo } from "@/components/landingPage/hero/heroparallax";
import SmartForm from "../components/landingPage/features/smartform";
import IteneraryTimeline from "../components/landingPage/features/itenenaryTimeline";
import MapLanding from "@/components/landingPage/features/mapLanding";
import Chatbot from "@/components/landingPage/features/chatbot";
import CtaSection from "@/components/landingPage/footer/ctaSection";
import ThreeDMarque from "@/components/landingPage/footer/threedmarquee";
  
export default function LandingPage() {
  const [formVisible, setFormVisible] = useState(false);
  const smartFormRef = React.useRef<HTMLDivElement>(null);  
  const itineraryRef = React.useRef<HTMLDivElement>(null);
  const chatbotRef = React.useRef<HTMLDivElement>(null);
  useEffect(()=>{
    setTimeout(()=>{
      setFormVisible(true)
    },200)
  },[])

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">
      <HeroParallaxDemo/>
      <div className="relative">
        {/* Smart Form Section */}
        <section id="smart-form" className="" ref={smartFormRef}>
          <SmartForm smartFormRef={smartFormRef} formVisible={formVisible}/>
        </section>
        {/* AI-Generated Itinerary Timeline */}
        <section id="itinerary" className="py-20 relative" ref={itineraryRef}>
          <BackgroundBeams className="absolute inset-0 opacity-20" />
          <IteneraryTimeline/>
        </section>
        {/* Map Showcase Section */}
        <section className="py-16 sm:py-20 bg-black relative">
          <MapLanding/>
        </section>
        {/* AI Travel Chatbot Section */}
        <section className="py-20 mb-14 bg-black relative" ref={chatbotRef}>
          <Chatbot chatbotRef={chatbotRef}/>
        </section>
        {/* Reviews Section */}
        <section>
        <Reviews/>
        </section>
        {/* Combined hero and 3D marquee with z-index layering */}
        <section className="relative min-h-screen flex flex-col justify-center items-center  overflow-hidden">
          <ThreeDMarque/>
        </section>
        {/* Final CTA Section*/}
        <CtaSection/>
      </div>
    </div>
  );
};

