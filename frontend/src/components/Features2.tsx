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
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BackgroundGradient } from "@/components/ui/backgroud-gradient";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { Button } from "@/components/ui/button";
// import { MovingGradient } from "@/components/ui/moving-gradient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"; 
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Timeline } from "@/components/ui/timeline";
import { FlipWords } from "@/components/ui/flip-words";
// import { Globe } from "@/components/ui/globe";
import { EvervaultCard } from "@/components/ui/evervault-card";
// import { Globe } from "@/ui/globe";

// Mock data for itinerary
const itineraryData = [
  {
    day: 1,
    location: "Paris",
    title: "Iconic Landmarks & Cultural Immersion",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    description: "Begin your Paris adventure with the city's most iconic landmarks.",
    activities: [
      { time: "09:00", title: "Eiffel Tower", type: "Must-Visit | Landmark", description: "Beat the crowds with an early morning visit to the Eiffel Tower. Pro tip: Book skip-the-line tickets in advance.", coordinates: [2.2945, 48.8584] },
      { time: "12:30", title: "Lunch at Café de Flore", type: "Authentic | Cuisine", description: "Experience a quintessential Parisian café with excellent pastries and people watching.", coordinates: [2.3333, 48.8539] },
      { time: "14:30", title: "Louvre Museum", type: "Cultural | Historical", description: "Explore the world's largest art museum, home to thousands of works including the Mona Lisa.", coordinates: [2.3376, 48.8606] },
      { time: "18:00", title: "Seine River Sunset Cruise", type: "Scenic | Romantic", description: "See Paris from the water during golden hour for spectacular views of major landmarks.", coordinates: [2.3522, 48.8566] }
    ]
  },
  {
    day: 2,
    location: "Paris",
    title: "Hidden Gems & Local Experiences",
    image: "https://images.unsplash.com/photo-1551887196-9b6c26118711?q=80&w=2029&auto=format&fit=crop",
    description: "Discover Paris beyond the tourist track with these local favorites.",
    activities: [
      { time: "10:00", title: "Montmartre Walking Tour", type: "Local | Artistic", description: "Wander through the charming streets and visit Sacré-Cœur Basilica for panoramic city views.", coordinates: [2.3431, 48.8867] },
      { time: "13:00", title: "Le Petit Marché", type: "Hidden Gem | Cuisine", description: "Enjoy lunch at this local favorite known for authentic French cuisine at reasonable prices.", coordinates: [2.3509, 48.8705] },
      { time: "15:00", title: "Centre Pompidou", type: "Modern | Cultural", description: "Explore Europe's largest modern art museum housed in an architectural marvel.", coordinates: [2.3522, 48.8606] },
      { time: "18:00", title: "Le Marais District", type: "Trending | Shopping", description: "Discover fashion boutiques, art galleries and trendy bars in this historic district.", coordinates: [2.3622, 48.8566] }
    ]
  },
  {
    day: 3,
    location: "Paris",
    title: "Royal Experience & Parisian Luxury",
    image: "https://images.unsplash.com/photo-1568700942090-19dc36fab0c4?q=80&w=1974&auto=format&fit=crop",
    description: "Experience the grandeur of French royalty and luxury.",
    activities: [
      { time: "09:00", title: "Palace of Versailles", type: "Historical | Majestic", description: "Explore the opulent royal palace and its magnificent gardens, a UNESCO World Heritage site.", coordinates: [2.1203, 48.8048] },
      { time: "14:00", title: "Angelina Paris", type: "Luxury | Cuisine", description: "Indulge in Paris' most famous hot chocolate and pastries at this historic tearoom.", coordinates: [2.3295, 48.8656] },
      { time: "16:00", title: "Galeries Lafayette", type: "Shopping | Architectural", description: "Visit the iconic department store with its stunning stained-glass dome and rooftop views.", coordinates: [2.3376, 48.8731] },
      { time: "19:30", title: "Dinner at Le Jules Verne", type: "Fine Dining | Experience", description: "Enjoy Michelin-starred cuisine inside the Eiffel Tower with panoramic views of Paris.", coordinates: [2.2945, 48.8584] }
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
];

// Mock data for place reviews
const placeReviews = {
  "Eiffel Tower": [
    { 
      id: 1, 
      user: "Michael T.", 
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
      date: "3 weeks ago",
      text: "The view from the top is absolutely breathtaking! Worth every penny. Try to go during sunset for the best experience."
    },
    { 
      id: 2, 
      user: "Sarah K.", 
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      date: "1 month ago",
      text: "Beautiful icon of Paris. Lines can be long, but they move efficiently. The night light show is magical."
    },
    { 
      id: 3, 
      user: "Jean P.", 
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      rating: 5,
      date: "2 months ago",
      text: "An engineering marvel and cultural landmark. The restaurant on the second floor offers great cuisine with amazing views."
    }
  ],
  "Louvre Museum": [
    { 
      id: 1, 
      user: "Emma L.", 
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 5,
      date: "2 weeks ago",
      text: "Plan to spend at least 4 hours here. The collection is massive and world-class. The Mona Lisa is smaller than you might expect!"
    },
    { 
      id: 2, 
      user: "Robert J.", 
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4,
      date: "1 month ago",
      text: "Incredible collection. Get the audio guide for a more immersive experience. Wednesday and Friday evenings are less crowded."
    },
    { 
      id: 3, 
      user: "Sophia D.", 
      avatar: "https://randomuser.me/api/portraits/women/49.jpg",
      rating: 5,
      date: "6 weeks ago",
      text: "Beyond the Mona Lisa, make sure to see the Venus de Milo, Winged Victory, and the amazing Egyptian collection."
    }
  ]
};

// AI-generated summarized reviews
const summarizedReviews = {
  "Eiffel Tower": {
    sentiment: "Overwhelmingly Positive",
    rating: 4.7,
    summary: "Visitors consistently praise the spectacular views, especially at sunset and during the evening light show. Most recommend booking skip-the-line tickets in advance and allocating 2-3 hours for the full experience. The second-floor restaurant receives positive mentions for its combination of fine dining and unique setting.",
    highlights: ["Sunset views", "Evening light show", "Engineering marvel"],
    tips: "Visit during weekday mornings or late evenings to avoid peak crowds. The second floor offers nearly as good views as the summit with shorter lines."
  },
  "Louvre Museum": {
    sentiment: "Extremely Positive",
    rating: 4.8,
    summary: "Art enthusiasts recommend planning at least 4-5 hours for this vast museum, with many suggesting breaking the visit into multiple days. The audio guide receives high praise for enhancing the experience. Beyond the Mona Lisa, reviewers highlight the Egyptian antiquities, Venus de Milo, and Winged Victory as must-see attractions.",
    highlights: ["Vast collection", "World-class exhibits", "Architectural beauty"],
    tips: "Visit during Wednesday or Friday evenings for smaller crowds. Enter through the Carrousel du Louvre entrance to avoid the longer pyramid line."
  }
};

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

const Features2: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showReviewMerge, setShowReviewMerge] = useState(false);
  const [mergeComplete, setMergeComplete] = useState(false);
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
  const itineraryRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const reviewsRef = React.useRef<HTMLDivElement>(null);
  
  const smartFormInView = useInView(smartFormRef, { amount: 0.2, once: true });
  const itineraryInView = useInView(itineraryRef, { amount: 0.2, once: true });
  const mapInView = useInView(mapRef, { amount: 0.2, once: true });
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

  // Animation for review merging
  useEffect(() => {
    if (showReviewMerge) {
      const timer = setTimeout(() => {
        setMergeComplete(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setMergeComplete(false);
    }
  }, [showReviewMerge]);

  const content = (
    <div className="flex flex-col items-start">
      <h1 className="text-2xl font-bold text-white mb-2">AI-Generated Travel Itineraries</h1>
      <p className="text-sm text-white/70 mb-4">
        Our AI creates personalized travel plans based on your preferences, local insights, and real-time data
      </p>
      <div className="h-40 w-full bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" 
          className="w-full h-full object-cover mix-blend-overlay"
          alt="Paris cityscape"
        />
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-white">Features:</h3>
        <ul className="text-xs text-white/70 mt-2 space-y-1">
          <li className="flex items-center">
            <div className="h-1 w-1 bg-purple-500 rounded-full mr-2"></div>
            <span>Personalized daily itineraries</span>
          </li>
          <li className="flex items-center">
            <div className="h-1 w-1 bg-purple-500 rounded-full mr-2"></div>
            <span>Local hidden gems and authentic experiences</span>
          </li>
          <li className="flex items-center">
            <div className="h-1 w-1 bg-purple-500 rounded-full mr-2"></div>
            <span>Real-time updates and adaptive planning</span>
          </li>
          <li className="flex items-center">
            <div className="h-1 w-1 bg-purple-500 rounded-full mr-2"></div>
            <span>Budget optimization and tracking</span>
          </li>
        </ul>
      </div>
    </div>
  );

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

      {/* Gradient animation background instead of sparkles
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MovingGradient />
      </div> */}

      {/* Interactive Map Section */}
      <section id="map" className="py-20 relative" ref={mapRef}>
        <div className="container mx-auto px-4">
          <TextGenerateEffect
            words="Today's Destinations"
            className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          />
          
          <div className="max-w-5xl mx-auto">
            <CardContainer className="w-full">
              <BackgroundGradient className="rounded-2xl p-0.5">
                <div className="bg-black/80 rounded-2xl p-6 md:p-8 relative">
                  {/* Map visualization */}
                  <div className="relative h-[500px] rounded-lg overflow-hidden">
                    {/* Base map image */}
                    <img 
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
                      className="w-full h-full object-cover opacity-50"
                      alt="Paris Map"
                    />
                    
                    {/* Animated markers */}
                    {itineraryData[0].activities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1.2, 1],
                          opacity: 1 
                        }}
                        transition={{ 
                          delay: index * 0.2,
                          duration: 0.5,
                          times: [0, 0.7, 1]
                        }}
                        className="absolute"
                        style={{
                          left: `${20 + (index * 25)}%`,
                          top: `${30 + (index * 15)}%`
                        }}
                      >
                        <div className="relative">
                          {/* Ripple effect */}
                          <div className="absolute -inset-4">
                            <motion.div
                              animate={{
                                scale: [1, 2],
                                opacity: [0.3, 0]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                              className="w-8 h-8 rounded-full bg-purple-500/30"
                            />
                          </div>
                          
                          {/* Marker */}
                          <div className="relative z-10 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {index + 1}
                          </div>
                          
                          {/* Location name */}
                          <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-black/90 px-3 py-1 rounded-lg whitespace-nowrap">
                            {activity.title}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </BackgroundGradient>
            </CardContainer>
          </div>
        </div>
      </section>

      <section id="smart-form" className="py-20 relative" ref={smartFormRef}>
        <div className="container mx-auto px-4">
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
                              <Button 
                                size="lg" 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-8 rounded-xl shadow-lg shadow-purple-900/20"
                              >
                                <span className="flex items-center">
                                  Generate My Itinerary <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                              </Button>
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
          
          {/* <div className="flex justify-center mb-10">
            <Tabs 
              value={selectedDay.toString()} 
              onValueChange={(value) => setSelectedDay(parseInt(value))}
              className="border border-blue-500/20 rounded-lg p-1 bg-black/50 backdrop-blur-sm"
            >
              <TabsList className="grid grid-cols-3 w-full min-w-[300px] max-w-md bg-transparent gap-1">
                {itineraryData.map(day => (
                  <TabsTrigger 
                    key={day.day} 
                    value={day.day.toString()}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white rounded-md"
                  >
                    Day {day.day}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div> */}
          
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
                                      <FlipWords words={activity.type.split(' | ')} />
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
                      {day.activities.map((activity, idx) => (
                        <Timeline 
                          key={idx}
                          data={[{
                            title: activity.title,
                            text: activity.description,
                            onClick: () => setSelectedLocation(activity.title),
                            icon: (
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                                {idx + 1}
                              </div>
                            )
                          }]}
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
      
      {/* AI-Summarized Place Reviews */}
      <section id="reviews" className="py-20 relative" ref={reviewsRef}>
        <div className="container mx-auto px-4">
          <TextGenerateEffect
            words="AI-Powered Place Reviews"
            className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          />
          
          <p className="text-center text-blue-200 max-w-3xl mx-auto mb-12">
            Our AI analyzes thousands of authentic reviews to provide concise, balanced summaries 
            of each place in your itinerary, saving you hours of research.
          </p>
          
          <div className="max-w-4xl mx-auto">
            {/* Demo of review merging animation */}
            <div className="relative min-h-[550px] flex items-center justify-center">
              <Spotlight
                className="-top-40 left-1/2"
                fill="purple"
              />
              
              <AnimatePresence>
                {!showReviewMerge ? (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ 
                      opacity: 0,
                      y: 100,
                      transition: { duration: 0.5 } 
                    }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold text-white mb-3">See How Our AI Summarizes Reviews</h3>
                      <p className="text-sm text-blue-200 max-w-lg">
                        We collect and process thousands of reviews to extract the most valuable insights
                        about each place in your itinerary.
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => setShowReviewMerge(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-8 py-2 rounded-lg mb-8"
                    >
                      Watch AI Review Synthesis
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
                      <EvervaultCard text="Eiffel Tower (352 reviews)" />
                      <EvervaultCard text="Louvre Museum (487 reviews)" />
                    </div>
                  </motion.div>
                ) : !mergeComplete ? (
                  <motion.div className="w-full">
                    {/* Animation of review cards merging */}
                    <div className="relative h-[400px]">
                      {/* Flying review cards */}
                      {placeReviews["Eiffel Tower"].map((review, i) => (
                        <motion.div
                          key={`eiffel-${review.id}`}
                          initial={{ 
                            opacity: 1, 
                            x: -300 + (i * 50), 
                            y: -100 + (i * 30),
                            scale: 0.8,
                            rotate: -5 + (i * 5)
                          }}
                          animate={{ 
                            opacity: 0,
                            x: 0,
                            y: 0,
                            scale: 0.5,
                            rotate: 0,
                            transition: { 
                              duration: 1 + (i * 0.2), 
                              ease: "easeInOut" 
                            }
                          }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-black/80 border border-blue-500/30 rounded-lg p-3 z-10"
                        >
                          <div className="flex items-center mb-2">
                            <img 
                              src={review.avatar} 
                              alt={review.user}
                              className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/50" 
                            />
                            <div className="ml-2">
                              <p className="font-medium text-white text-sm">{review.user}</p>
                              <p className="text-xs text-gray-400">{review.date}</p>
                            </div>
                          </div>
                          
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                              />
                            ))}
                          </div>
                          
                          <p className="text-gray-300 text-xs line-clamp-2">{review.text}</p>
                        </motion.div>
                      ))}
                      
                      {placeReviews["Louvre Museum"].map((review, i) => (
                        <motion.div
                          key={`louvre-${review.id}`}
                          initial={{ 
                            opacity: 1, 
                            x: 300 - (i * 50), 
                            y: 50 + (i * 30),
                            scale: 0.8,
                            rotate: 5 - (i * 5)
                          }}
                          animate={{ 
                            opacity: 0,
                            x: 0,
                            y: 0,
                            scale: 0.5,
                            rotate: 0,
                            transition: { 
                              duration: 1 + (i * 0.2), 
                              ease: "easeInOut" 
                            }
                          }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-black/80 border border-blue-500/30 rounded-lg p-3 z-10"
                        >
                          <div className="flex items-center mb-2">
                            <img 
                              src={review.avatar} 
                              alt={review.user}
                              className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/50" 
                            />
                            <div className="ml-2">
                              <p className="font-medium text-white text-sm">{review.user}</p>
                              <p className="text-xs text-gray-400">{review.date}</p>
                            </div>
                          </div>
                          
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                              />
                            ))}
                          </div>
                          
                          <p className="text-gray-300 text-xs line-clamp-2">{review.text}</p>
                        </motion.div>
                      ))}
                      
                      {/* Central merging effect */}
                      <motion.div
                        initial={{ 
                          opacity: 0.7, 
                          scale: 0, 
                          rotate: 180,
                          background: "radial-gradient(circle, rgba(129,140,248,0.8) 0%, rgba(168,85,247,0.4) 100%)"
                        }}
                        animate={{ 
                          opacity: [0.7, 1, 0.7], 
                          scale: [0, 1.5, 0.9], 
                          rotate: [180, 0, 0],
                          background: "radial-gradient(circle, rgba(129,140,248,0.8) 0%, rgba(168,85,247,0.4) 100%)"
                        }}
                        transition={{ 
                          duration: 2,
                          times: [0, 0.7, 1],
                          ease: "easeInOut"
                        }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full z-0 flex items-center justify-center"
                      >
                        <div className="text-white text-center">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2, times: [0, 0.5, 1] }}
                          >
                            <p className="font-bold">Processing</p>
                            <p className="text-xs">AI analyzing reviews</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-3xl"
                  >
                    <Tabs defaultValue="eiffel" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-blue-500/20 rounded-lg mb-6">
                        <TabsTrigger value="eiffel" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80">Eiffel Tower</TabsTrigger>
                        <TabsTrigger value="louvre" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-purple-600/80">Louvre Museum</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="eiffel">
                        <BackgroundGradient className="rounded-2xl p-0.5">
                          <CardContainer className="w-full">
                            <div className="bg-black/80 rounded-2xl p-6 md:p-8">
                              <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-3 mr-4">
                                  <Star className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-white">Eiffel Tower</h3>
                                  <p className="text-gray-400 text-sm">Summarized from 352 verified visitor reviews</p>
                                </div>
                                <div className="ml-auto">
                                  <div className="bg-blue-500/20 rounded-full px-3 py-1.5">
                                    <span className="text-blue-300 font-medium">{summarizedReviews["Eiffel Tower"].rating}/5</span>
                                  </div>
                                </div>
                              </div>
                              
                              <CardBody className="text-gray-200">
                                <CardItem translateZ="50" className="mb-8">
                                  <div className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs inline-block mb-3">
                                    {summarizedReviews["Eiffel Tower"].sentiment}
                                  </div>
                                  <p className="text-lg leading-relaxed">
                                    {summarizedReviews["Eiffel Tower"].summary}
                                  </p>
                                </CardItem>
                                
                                <CardItem translateZ="80" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                                  <div className="bg-black/50 rounded-lg p-4 border border-blue-500/20">
                                    <h4 className="text-blue-300 font-medium mb-3">Top Highlights</h4>
                                    <ul className="space-y-2">
                                      {summarizedReviews["Eiffel Tower"].highlights.map((highlight, idx) => (
                                        <li key={idx} className="flex items-center text-sm">
                                          <div className="bg-blue-500/20 p-1 rounded-md mr-2">
                                            <Star className="h-4 w-4 text-blue-400" />
                                          </div>
                                          <span>{highlight}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
                                    <h4 className="text-purple-300 font-medium mb-3">Pro Tips</h4>
                                    <p className="text-sm text-gray-300">
                                      {summarizedReviews["Eiffel Tower"].tips}
                                    </p>
                                  </div>
                                </CardItem>
                              </CardBody>
                            </div>
                          </CardContainer>
                        </BackgroundGradient>
                      </TabsContent>
                      
                      <TabsContent value="louvre">
                        <BackgroundGradient className="rounded-2xl p-0.5">
                          <CardContainer className="w-full">
                            <div className="bg-black/80 rounded-2xl p-6 md:p-8">
                              <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-3 mr-4">
                                  <Star className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-white">Louvre Museum</h3>
                                  <p className="text-gray-400 text-sm">Summarized from 487 verified visitor reviews</p>
                                </div>
                                <div className="ml-auto">
                                  <div className="bg-blue-500/20 rounded-full px-3 py-1.5">
                                    <span className="text-blue-300 font-medium">{summarizedReviews["Louvre Museum"].rating}/5</span>
                                  </div>
                                </div>
                              </div>
                              
                              <CardBody className="text-gray-200">
                                <CardItem translateZ="50" className="mb-8">
                                  <div className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs inline-block mb-3">
                                    {summarizedReviews["Louvre Museum"].sentiment}
                                  </div>
                                  <p className="text-lg leading-relaxed">
                                    {summarizedReviews["Louvre Museum"].summary}
                                  </p>
                                </CardItem>
                                
                                <CardItem translateZ="80" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                                  <div className="bg-black/50 rounded-lg p-4 border border-blue-500/20">
                                    <h4 className="text-blue-300 font-medium mb-3">Top Highlights</h4>
                                    <ul className="space-y-2">
                                      {summarizedReviews["Louvre Museum"].highlights.map((highlight, idx) => (
                                        <li key={idx} className="flex items-center text-sm">
                                          <div className="bg-blue-500/20 p-1 rounded-md mr-2">
                                            <Star className="h-4 w-4 text-blue-400" />
                                          </div>
                                          <span>{highlight}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
                                    <h4 className="text-purple-300 font-medium mb-3">Pro Tips</h4>
                                    <p className="text-sm text-gray-300">
                                      {summarizedReviews["Louvre Museum"].tips}
                                    </p>
                                  </div>
                                </CardItem>
                              </CardBody>
                            </div>
                          </CardContainer>
                        </BackgroundGradient>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={() => {
                          setShowReviewMerge(false);
                          setSelectedLocation(null);
                        }}
                        variant="outline"
                        className="border-blue-500/30 hover:border-blue-500/50 text-blue-300"
                      >
                        Back to Demo
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none px-8 py-6 rounded-full"
                  onClick={() => document.getElementById('smart-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span>Plan Your Journey Now</span>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500/30 hover:border-blue-500/50 text-white px-8 rounded-full"
                >
                  View Example Itineraries
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features2;