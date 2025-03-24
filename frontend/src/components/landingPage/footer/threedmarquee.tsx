import { ArrowRight } from "lucide-react";
import { popularDestinations } from "@/MockPlacesData";
import {motion} from "framer-motion"
import { ThreeDMarquee } from "../../ui/3d-marquee";
export default function ThreeDMarque(){
    return (
        <>
        <div className="absolute my-auto inset-0 z-0 h-[90vh]">
            <div className="opacity-45 h-full">
              <ThreeDMarquee
                images={popularDestinations.map(dest => dest.image)}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white ">
                <span className="relative">
                  Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-slow">Dream Journey</span> Awaits
                  <span className="absolute inset-0 bg-white/5 blur-sm -z-10 rounded-lg"></span>
                </span>
            </h1>
              <div className="relative">
                <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                    Discover extraordinary destinations with our AI-powered travel planner that adapts to your
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium"> preferences</span>,
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium"> timeframe</span>, and
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium"> budget</span>.
                  </p>
                {/* Add a subtle glow effect behind the text */}
                <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl -z-10"></div>
              </div>
            </motion.div>
          </div>
          <div className="flex justify-center">
            <button
              className="border border-blue-800/20 text-white backdrop-blur-md bg-white/5 hover:bg-white/10 px-10 py-3 rounded-full transition-all duration-300 shadow-lg cursor-pointer"
              onClick={() => document.getElementById('smart-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex items-center justify-center text-lg font-medium">
                Generate Itinerary <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </button>
          </div>
        </>
    )
}