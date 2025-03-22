import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Star,
  Clock,
  ArrowRight,
  Heart,
  TrendingUp,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import Aceternity UI components
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { BackgroundBeams } from "./ui/background-beams";
import { BackgroundGradient } from "./ui/backgroud-gradient";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
// import { Button } from "@/components/ui/button";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { Button } from "./ui/moving-border";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SparklesCore } from "@/components/ui/sparkles";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"; 
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Timeline } from "./ui/timeline";
import { FlipWords } from "@/components/ui/flip-words";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

// Mock data for itinerary
const itineraryData = [
  {
    day: 1,
    location: "Paris",
    title: "Iconic Landmarks & Cultural Immersion",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    description: "Begin your Paris adventure with the city's most iconic landmarks.",
    activities: [
      { time: "09:00", title: "Eiffel Tower", type: "Must-Visit | Landmark", description: "Beat the crowds with an early morning visit to the Eiffel Tower. Pro tip: Book skip-the-line tickets in advance." },
      { time: "12:30", title: "Lunch at Café de Flore", type: "Authentic | Cuisine", description: "Experience a quintessential Parisian café with excellent pastries and people watching." },
      { time: "14:30", title: "Louvre Museum", type: "Cultural | Historical", description: "Explore the world's largest art museum, home to thousands of works including the Mona Lisa." },
      { time: "18:00", title: "Seine River Sunset Cruise", type: "Scenic | Romantic", description: "See Paris from the water during golden hour for spectacular views of major landmarks." }
    ]
  },
  {
    day: 2,
    location: "Paris",
    title: "Hidden Gems & Local Experiences",
    image: "https://images.unsplash.com/photo-1551887196-9b6c26118711?q=80&w=2029&auto=format&fit=crop",
    description: "Discover Paris beyond the tourist track with these local favorites.",
    activities: [
      { time: "10:00", title: "Montmartre Walking Tour", type: "Local | Artistic", description: "Wander through the charming streets and visit Sacré-Cœur Basilica for panoramic city views." },
      { time: "13:00", title: "Le Petit Marché", type: "Hidden Gem | Cuisine", description: "Enjoy lunch at this local favorite known for authentic French cuisine at reasonable prices." },
      { time: "15:00", title: "Centre Pompidou", type: "Modern | Cultural", description: "Explore Europe's largest modern art museum housed in an architectural marvel." },
      { time: "18:00", title: "Le Marais District", type: "Trending | Shopping", description: "Discover fashion boutiques, art galleries and trendy bars in this historic district." }
    ]
  },
  {
    day: 3,
    location: "Paris",
    title: "Royal Experience & Parisian Luxury",
    image: "https://images.unsplash.com/photo-1568700942090-19dc36fab0c4?q=80&w=1974&auto=format&fit=crop",
    description: "Experience the grandeur of French royalty and luxury.",
    activities: [
      { time: "09:00", title: "Palace of Versailles", type: "Historical | Majestic", description: "Explore the opulent royal palace and its magnificent gardens, a UNESCO World Heritage site." },
      { time: "14:00", title: "Angelina Paris", type: "Luxury | Cuisine", description: "Indulge in Paris' most famous hot chocolate and pastries at this historic tearoom." },
      { time: "16:00", title: "Galeries Lafayette", type: "Shopping | Architectural", description: "Visit the iconic department store with its stunning stained-glass dome and rooftop views." },
      { time: "19:30", title: "Dinner at Le Jules Verne", type: "Fine Dining | Experience", description: "Enjoy Michelin-starred cuisine inside the Eiffel Tower with panoramic views of Paris." }
    ]
  }
];

// Mock data for popular destinations
const popularDestinations = [
  { id: 1, name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" },
  { id: 2, name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop" },
  { id: 3, name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop" },
  { id: 5, name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, name: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop" },
  { id: 7, name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2002&auto=format&fit=crop" },
  { id: 8, name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1551621053-40c35aab4fff?q=80&w=2070&auto=format&fit=crop" },
  { id: 1, name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" },
  { id: 2, name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop" },
  { id: 3, name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop" },
  { id: 5, name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, name: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop" },
  { id: 7, name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2002&auto=format&fit=crop" },
  { id: 8, name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1551621053-40c35aab4fff?q=80&w=2070&auto=format&fit=crop" },
  { id: 1, name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" },
  { id: 2, name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop" },
  { id: 3, name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop" },
  { id: 5, name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, name: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop" },
  { id: 7, name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2002&auto=format&fit=crop" },
  { id: 8, name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1551621053-40c35aab4fff?q=80&w=2070&auto=format&fit=crop" },
  { id: 1, name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" },
  { id: 2, name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop" },
  { id: 3, name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop" },
  { id: 5, name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, name: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop" },
  { id: 7, name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2002&auto=format&fit=crop" },
  { id: 8, name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1551621053-40c35aab4fff?q=80&w=2070&auto=format&fit=crop" },
];

const images = [
  "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
  "https://assets.aceternity.com/animated-modal.png",
  "https://assets.aceternity.com/animated-testimonials.webp",
  "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
  "https://assets.aceternity.com/github-globe.png",
  "https://assets.aceternity.com/glare-card.png",
  "https://assets.aceternity.com/layout-grid.png",
  "https://assets.aceternity.com/flip-text.png",
  "https://assets.aceternity.com/hero-highlight.png",
  "https://assets.aceternity.com/carousel.webp",
  "https://assets.aceternity.com/placeholders-and-vanish-input.png",
  "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
  "https://assets.aceternity.com/signup-form.png",
  "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
  "https://assets.aceternity.com/spotlight-new.webp",
  "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
  "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
  "https://assets.aceternity.com/tabs.png",
  "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
  "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
  "https://assets.aceternity.com/glowing-effect.webp",
  "https://assets.aceternity.com/hover-border-gradient.png",
  "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
  "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
  "https://assets.aceternity.com/macbook-scroll.png",
  "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
  "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
  "https://assets.aceternity.com/multi-step-loader.png",
  "https://assets.aceternity.com/vortex.png",
  "https://assets.aceternity.com/wobble-card.png",
  "https://assets.aceternity.com/world-map.webp",
];

// Mock data for map locations
const mapLocations = [
  { id: 1, name: "Eiffel Tower", lat: 48.8584, lng: 2.2945, type: "Landmark | Must-Visit", rating: 4.8 },
  { id: 2, name: "Louvre Museum", lat: 48.8606, lng: 2.3376, type: "Cultural | Historical", rating: 4.7 },
  { id: 3, name: "Notre-Dame", lat: 48.8530, lng: 2.3499, type: "Historical | Architectural", rating: 4.7 },
  { id: 4, name: "Montmartre", lat: 48.8867, lng: 2.3431, type: "Local | Artistic", rating: 4.5 },
  { id: 5, name: "Palace of Versailles", lat: 48.8048, lng: 2.1203, type: "Historical | Majestic", rating: 4.6 }
];

// Mock data for reviews
const reviewsData = [
  {
    id: 1,
    name: "Jessica T.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "Berlin, Germany",
    rating: 5,
    text: "The AI itinerary was perfect! It saved us so much time planning our Paris trip and found hidden gems we would have never discovered on our own."
  },
  {
    id: 2,
    name: "Marco L.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "Toronto, Canada",
    rating: 4,
    text: "Great recommendations for restaurants that weren't too touristy. The day-by-day planning helped us maximize our time without feeling rushed."
  },
  {
    id: 3,
    name: "Aisha K.",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    location: "Dubai, UAE",
    rating: 5,
    text: "The AI adapted our itinerary when it unexpectedly rained on day 3. Brilliant service! It suggested indoor activities that ended up being highlights."
  }
];

interface InterestTagProps {
  children: React.ReactNode;
  onClick: () => void;
  selected: boolean;
}

const InterestTag: React.FC<InterestTagProps> = ({ children, onClick, selected }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm transition-all duration-300",
        selected
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          : "bg-black/40 text-gray-300 border border-blue-500/20 hover:border-purple-500/40"
      )}
    >
      {children}
    </button>
  );
};

const Features: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [showReviewSummary, setShowReviewSummary] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    destination: "",
    days: "3",
    budget: "medium",
    persons: "2",
    customRequests: ""
  });

  // Track if sections are in view
  const smartFormRef = React.useRef<HTMLDivElement>(null);
  const smartFormInView = useInView(smartFormRef, { amount: 0.2, once: true });
  
  const itineraryRef = React.useRef<HTMLDivElement>(null);
  const itineraryInView = useInView(itineraryRef, { amount: 0.2, once: true });
  
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { amount: 0.2, once: true });
  
  const reviewsRef = React.useRef<HTMLDivElement>(null);
  const reviewsInView = useInView(reviewsRef, { amount: 0.2, once: true });

  const interestOptions = [
    "Art & Museums", "Food & Cuisine", "Architecture", "Nightlife", 
    "Shopping", "Nature", "Adventure", "History", "Local Culture", "Relaxation"
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // Simulate form appearance after page load
    const timer = setTimeout(() => {
      setFormVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">
      {/* Floating navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <FloatingNav
          navItems={[
            {
              name: "Smart Form",
              link: "#smart-form",
              icon: <Users className="h-4 w-4" />
            },
            {
              name: "Itinerary",
              link: "#itinerary",
              icon: <Calendar className="h-4 w-4" />
            },
            {
              name: "Map",
              link: "#map",
              icon: <MapPin className="h-4 w-4" />
            },
            {
              name: "Reviews",
              link: "#reviews",
              icon: <Star className="h-4 w-4" />
            }
          ]}
        />
      </div>

      {/* Interactive particles background */}
      {/* <div className="absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullscreen"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={40}
          className="w-full h-full"
          particleColor="#8a2be2"
        />
      </div> */}

      <div className="relative z-10">
        {/* Hero section with spotlight */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:left-60"
            fill="blue"
          />
          
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
                Your Dream Journey Awaits
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
                Let our AI craft the perfect itinerary based on your preferences, 
                local insights, and real-time data.
              </p>
              
              <Button
                className="bg-black text-white border-none px-8 py-4 rounded-[1.75rem]"
                onClick={() => document.getElementById('smart-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center">
                  Start Planning <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </motion.div>
          </div>
        </section> 
        
        {/* Popular destinations 3D marquee */}
        <div className="mb-20">
          <ThreeDMarquee
            images={popularDestinations.map(dest => dest.image) as Array}
            // images={images}
            className="w-full"
          />
        </div>

        {/* Smart Form Section */}
         <section id="smart-form" className="py-20" ref={smartFormRef}>
          <div className="container mx-auto px-4">
            <TextGenerateEffect
              words="Let AI Personalize Your Journey"
              className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            />

            <AnimatePresence>
              {formVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <TextRevealCard
                    text="Create Your Dream Itinerary"
                    revealText="Tell Us About Your Trip"
                    className="w-full"
                  >
                   
                      <CardContainer className="w-full">
                        <BackgroundGradient className="rounded-[22px] p-0.5">
                          <div className="bg-black/95 rounded-[21px] p-8">
                            <form className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label className="text-blue-100">Destination</Label>
                                  <Input
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleFormChange}
                                    placeholder="Where would you like to go?"
                                    className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-blue-100">Number of Days</Label>
                                  <Select 
                                    name="days"
                                    value={formData.days} 
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, days: value }))}
                                  >
                                    <SelectTrigger className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white">
                                      <SelectValue placeholder="Select days" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black/90 border border-blue-500/30 text-white">
                                      {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(day => (
                                        <SelectItem key={day} value={day.toString()}>
                                          {day} {day === 1 ? 'day' : 'days'}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-blue-100">Budget</Label>
                                  <Select 
                                    name="budget"
                                    value={formData.budget} 
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                                  >
                                    <SelectTrigger className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white">
                                      <SelectValue placeholder="Select budget" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black/90 border border-blue-500/30 text-white">
                                      <SelectItem value="budget">Budget</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="luxury">Luxury</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-blue-100">Number of Travelers</Label>
                                  <Select 
                                    name="persons"
                                    value={formData.persons}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, persons: value }))}
                                  >
                                    <SelectTrigger className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white">
                                      <SelectValue placeholder="Select number" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black/90 border border-blue-500/30 text-white">
                                      {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                                        <SelectItem key={num} value={num.toString()}>
                                          {num} {num === 1 ? 'person' : 'people'}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <Label className="text-blue-100">Travel Interests</Label>
                                <div className="flex flex-wrap gap-2">
                                  {interestOptions.map(interest => (
                                    <InterestTag
                                      key={interest}
                                      selected={interests.includes(interest)}
                                      onClick={() => handleInterestToggle(interest)}
                                    >
                                      {interest}
                                    </InterestTag>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-blue-100">Any Special Requests?</Label>
                                <Textarea
                                  name="customRequests"
                                  value={formData.customRequests}
                                  onChange={handleFormChange}
                                  placeholder="Tell us any special requirements or places you'd like to visit..."
                                  className="bg-black/50 border border-blue-500/20 focus:border-purple-500/50 text-white resize-none min-h-24"
                                />
                              </div>
                              
                              <div className="flex justify-center pt-4">
                                <HoverBorderGradient
                                  as="button"
                                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-lg shadow-lg shadow-purple-900/20"
                                >
                                  <span className="flex items-center">
                                    Generate My Itinerary <ArrowRight className="ml-2 h-4 w-4" />
                                  </span>
                                </HoverBorderGradient>
                              </div>
                            </form>
                          </div>
                        </BackgroundGradient>
                      </CardContainer>
                  </TextRevealCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section> 
        
        {/* AI-Generated Itinerary Timeline */}
        <section id="itinerary" className="py-20 relative" ref={itineraryRef}>
          <BackgroundBeams className="absolute inset-0 opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <TextGenerateEffect
              words="Your AI-Generated Paris Itinerary"
              className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            />
            
            <p className="text-center text-blue-200 max-w-3xl mx-auto mb-16">
              This personalized 3-day journey showcases the best of Paris, 
              balancing iconic landmarks, cultural immersion, and authentic local experiences.
            </p>
            
            <div className="flex justify-center mb-10">
              <div className="border border-blue-500/20 rounded-lg p-1 bg-black/50 backdrop-blur-sm">
                <div className="grid grid-cols-3 w-full min-w-[300px] max-w-md bg-transparent gap-1">
                  {itineraryData.map(day => (
                    <button 
                      key={day.day} 
                      onClick={() => setSelectedDay(day.day)}
                      className={cn(
                        "py-2 px-4 rounded-md transition-all",
                        selectedDay === day.day
                          ? "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white"
                          : "text-gray-300 hover:text-white"
                      )}
                    >
                      Day {day.day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                {itineraryData.map(day => (
                  day.day === selectedDay && (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <BackgroundGradient className="rounded-2xl p-0.5 mb-12">
                        <div className="bg-black/90 rounded-2xl p-6 md:p-8">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/2 aspect-video md:aspect-auto rounded-xl overflow-hidden">
                              <img 
                                src={day.image} 
                                alt={`Day ${day.day} in ${day.location}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="md:w-1/2">
                              <h3 className="text-2xl font-bold text-white mb-2">Day {day.day}: {day.title}</h3>
                              <p className="text-blue-200 mb-6">{day.description}</p>
                              
                              <ul className="space-y-4">
                                {day.activities.map((activity, i) => (
                                  <li key={i} className="flex gap-3 items-start">
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-md min-w-10 h-10 flex items-center justify-center text-white font-medium">
                                      {activity.time.split(':')[0]}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-white">{activity.title}</h4>
                                      <div className="my-1">
                                        <FlipWords words={[activity.type]} />
                                      </div>
                                      <p className="text-sm text-gray-400">{activity.description}</p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </BackgroundGradient>
                      
                      {/* Timeline for the day */}
                      <div className="pl-4 space-y-12 relative before:absolute before:inset-0 before:w-[2px] before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-blue-500 before:left-0 before:ml-[19px]">
                        <Timeline 
                          data={day.activities.map((activity, idx) => ({
                            title: activity.title,
                            content: <p className="text-sm text-gray-400">{activity.description}</p>,
                            time: activity.time,
                            icon: <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">{idx + 1}</div>
                          }))}
                        />
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
        
        {/* Interactive Map Section */}
        <section id="map" className="py-20 relative" ref={mapRef}>
          <div className="container mx-auto px-4">
            <TextGenerateEffect
              words="Visualize Your Travel Route"
              className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            />
            
            <div className="max-w-5xl mx-auto">
              <CardContainer className="w-full">
                <BackgroundGradient className="rounded-2xl p-0.5 mb-12">
                  <div className="bg-black/80 rounded-2xl p-6 md:p-8 min-h-[500px] relative">
                    
                    <div className="relative h-[500px] bg-[url('https://images.unsplash.com/photo-1541791003877-802fa7418720?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-black/40"></div>
                      
                      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                        <defs>
                          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M150,220 C200,100 280,300 350,150 C420,30 480,200 550,250" 
                          stroke="url(#routeGradient)" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                          strokeDasharray="10,5"
                          fill="none" 
                          className="animate-pulse-slow"
                        />
                      </svg>
                      
                     
                      {mapLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => setSelectedLocation(location.id)}
                          className={`absolute w-6 h-6 rounded-full bg-gradient-to-r transition-all duration-300 ${
                            selectedLocation === location.id
                              ? "from-blue-500 to-purple-600 scale-125 z-20 shadow-lg shadow-purple-500/30"
                              : "from-blue-400/80 to-purple-500/50"
                          } flex items-center justify-center`}
                          style={{
                            
                            left: `${((location.id * 125) % 500) + 50}px`,
                            top: `${((location.id * 83) % 400) + 50}px`,
                          }}
                        >
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-50"></span>
                          <MapPin className="w-3 h-3 text-white" />
                          
                          {selectedLocation === location.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-52 bg-black/90 backdrop-blur-md p-3 rounded-lg border border-purple-500/30 shadow-lg z-30"
                            >
                              <h4 className="font-medium text-white text-sm">{location.name}</h4>
                              <div className="my-1.5">
                                <FlipWords words={[location.type]} className="text-xs" />
                              </div>
                              <div className="flex items-center mt-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 text-xs text-gray-300">{location.rating}/5.0</span>
                                <span className="text-xs text-blue-400 ml-auto">View Details</span>
                              </div>
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-white mb-2">Paris Exploration Route</h3>
                      <p className="text-blue-200 mb-4">
                        This AI-optimized route minimizes travel time while maximizing experiences. 
                        It considers opening hours, crowd levels, and proximity between attractions.
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        <HoverBorderGradient className="px-4 py-2 bg-black text-white rounded-md">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Optimized for Time</span>
                          </div>
                        </HoverBorderGradient>
                        
                        <HoverBorderGradient className="px-4 py-2 bg-black text-white rounded-md">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            <span>Avoids Crowds</span>
                          </div>
                        </HoverBorderGradient>
                        
                        <HoverBorderGradient className="px-4 py-2 bg-black text-white rounded-md">
                          <div className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            <span>Interactive Map</span>
                          </div>
                        </HoverBorderGradient>
                      </div>
                    </div>
                  </div>
                </BackgroundGradient>
              </CardContainer>
            </div>
          </div>
        </section>
        
        {/* Reviews Section */}
         <section id="reviews" className="py-20 relative" ref={reviewsRef}>
          <div className="container mx-auto px-4">
            <TextGenerateEffect
              words="What Travelers Are Saying"
              className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            />
            
            <div className="max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                {!showReviewSummary ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {reviewsData.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: review.id * 0.1 }}
                        className="bg-black/60 border border-blue-500/20 rounded-xl p-6"
                      >
                        <div className="flex items-center mb-4">
                          <img 
                            src={review.avatar} 
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50" 
                          />
                          <div className="ml-3">
                            <p className="font-medium text-white">{review.name}</p>
                            <p className="text-xs text-gray-400">{review.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-gray-300 text-sm leading-relaxed">{review.text}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-3xl mx-auto"
                  >
                    <Spotlight
                      className="-top-10 -right-10 md:top-10 md:right-40"
                      fill="purple"
                    />
                    
                    <BackgroundGradient className="rounded-2xl p-0.5">
                      <CardContainer className="w-full">
                        <div className="bg-black/80 rounded-2xl p-8">
                          <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-3 mr-4">
                              <Star className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">AI-Generated Review Summary</h3>
                              <p className="text-gray-400 text-sm">Based on 1,248 verified traveler reviews</p>
                            </div>
                            <div className="ml-auto">
                              <div className="bg-blue-500/20 rounded-full px-3 py-1.5">
                                <span className="text-blue-300 font-medium">4.8/5</span>
                              </div>
                            </div>
                          </div>
                          
                          <CardBody className="text-gray-200">
                            <CardItem translateZ="50" className="mb-8">
                              <p className="text-lg leading-relaxed">
                                "Travelers consistently praise the AI itinerary planner for its ability to 
                                <span className="text-blue-400 font-medium"> save valuable planning time </span> 
                                while creating perfectly balanced days. Many highlighted how the AI discovered 
                                <span className="text-purple-400 font-medium"> hidden local gems </span> 
                                that became unexpected trip highlights. The dynamic weather adaptation feature 
                                received special mention from travelers who experienced changing conditions."
                              </p>
                            </CardItem>
                            
                            <CardItem translateZ="80" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                              <div className="bg-black/50 rounded-lg p-4 border border-blue-500/20">
                                <h4 className="text-blue-300 font-medium mb-3">Top Highlights</h4>
                                <ul className="space-y-2">
                                  <li className="flex items-center text-sm">
                                    <div className="bg-green-500/20 p-1 rounded-md mr-2">
                                      <TrendingUp className="h-4 w-4 text-green-400" />
                                    </div>
                                    <span>Time-saving itineraries</span>
                                  </li>
                                  <li className="flex items-center text-sm">
                                    <div className="bg-red-500/20 p-1 rounded-md mr-2">
                                      <Heart className="h-4 w-4 text-red-400" />
                                    </div>
                                    <span>Unexpected discovery moments</span>
                                  </li>
                                  <li className="flex items-center text-sm">
                                    <div className="bg-blue-500/20 p-1 rounded-md mr-2">
                                      <Users className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <span>Personalized recommendations</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
                                <h4 className="text-purple-300 font-medium mb-3">Rating Breakdown</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Accuracy:</span>
                                    <div className="flex items-center gap-1.5">
                                      <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '94%'}}></div>
                                      </div>
                                      <span className="text-white">4.7</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Personalization:</span>
                                    <div className="flex items-center gap-1.5">
                                      <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '98%'}}></div>
                                      </div>
                                      <span className="text-white">4.9</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Value:</span>
                                    <div className="flex items-center gap-1.5">
                                      <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '96%'}}></div>
                                      </div>
                                      <span className="text-white">4.8</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardItem>
                          </CardBody>
                        </div>
                      </CardContainer>
                    </BackgroundGradient>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex justify-center mt-10">
                <HoverBorderGradient
                  as="button"
                  onClick={() => setShowReviewSummary(!showReviewSummary)}
                  className="px-6 py-3 bg-black text-white rounded-md"
                >
                  <span>{showReviewSummary ? "View Individual Reviews" : "See AI-Powered Summary"}</span>
                </HoverBorderGradient>
              </div>
            </div>
          </div>
        </section> 
        
        {/* Final CTA Section */}
         <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <BackgroundBeams />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
                  Ready to Experience Travel Planning Reimagined?
                </h2>
                <p className="text-xl text-blue-100 mb-10">
                  Let our AI craft your perfect itinerary in seconds. No more hours of research or uncertainty.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    borderRadius={0.75}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none px-8 py-4"
                    onClick={() => document.getElementById('smart-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span>Plan Your Journey Now</span>
                  </Button>
                  
                  <Button variant="outline" className="border border-blue-500/30 text-white hover:bg-blue-900/20 px-8">
                    View Example Itineraries
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section> 
      </div>
    </div>
  );
};

export default Features;
