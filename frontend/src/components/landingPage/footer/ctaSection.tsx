import { ArrowRight } from "lucide-react";
import { BackgroundBeams } from "../../ui/background-beams";
import {motion} from "framer-motion";
export default function CtaSection() {
    return (
        <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <BackgroundBeams />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
                    Ready to Experience Travel Planning Reimagined?
                  </span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-8 sm:mb-10 lg:mb-12 max-w-xl mx-auto">
                  Let our AI craft your perfect itinerary in seconds. No more hours of research or uncertainty.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                  <button 
                    onClick={() => document.getElementById('smart-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3.5 rounded-lg shadow-md transition-all duration-200 text-base cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Plan Your Journey Now
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                  
                  <button 
                    className="w-full sm:w-auto border-2 border-blue-500/30 text-white hover:bg-blue-900/20 hover:border-blue-400/50 px-8 py-3.5 rounded-lg transition-all duration-200 text-base font-medium cursor-pointer"
                  >
                    View Example Itineraries
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
    )
}