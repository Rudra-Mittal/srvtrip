import {motion} from "framer-motion";
export default function MapLanding() {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        Visualize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Travel Route</span>
                    </h2>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 max-w-2xl mx-auto text-sm sm:text-base">
                        See your entire itinerary mapped out for easy navigation
                    </p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 15,
                    duration: 0.8
                }}
                className="max-w-4xl mx-auto"
            >
                <div className="bg-black/80 rounded-lg overflow-hidden shadow-2xl shadow-blue-900/10">
                    {/* Map Image with dimmed overlay */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md">
                        <div className="absolute inset-0 bg-black/30 z-10"></div>
                        <img
                            src="/mapimg.png"
                            alt="Interactive Travel Map"
                            className="w-full h-full object-cover relative z-0"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}