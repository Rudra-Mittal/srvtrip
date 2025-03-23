import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import {  AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BackgroundGradient } from "@/components/ui/backgroud-gradient";
export default function Reviews() {
  const [isAggregating, setIsAggregating] = useState(false)
  const [isSwirling, setIsSwirling] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [initialPositions, setInitialPositions] = useState<Array<{ x: number; y: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: "some" });
  useEffect(() => {
    console.log("isInView", isInView)
    if (isInView && !isAggregating && !showSummary) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        handleAggregate();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, isAggregating, showSummary]);
  useEffect(()=>{
    if (!isInView && isAggregating && showSummary) {
      // Add a small delay for better UX
      handleReset();
      return ;
    }
  },[isInView, isAggregating, showSummary]) 
  // Updated reviews data focused on a single place (Montmartre)
const reviews = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Montmartre was the highlight of our Paris trip! The views from Sacré-Cœur were breathtaking. Go early to avoid crowds.",
    date: "May 2023",
    duration: "3-hour visit"
  },
  {
    id: 2,
    name: "Sam Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "Charming area with great street artists in Place du Tertre. Cafés are a bit overpriced but the atmosphere is worth it.",
    date: "June 2023",
    duration: "Half-day"
  },
  {
    id: 3,
    name: "Jordan Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 3,
    comment: "Montmartre streets are steep and tiring. Take the funicular if mobility is an issue. Nice views but very crowded midday.",
    date: "April 2023",
    duration: "2-hour visit"
  },
  {
    id: 4,
    name: "Casey Morgan",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Don't miss Café des Deux Moulins from the movie Amélie! Also found a hidden gem bakery on Rue Lepic with amazing pastries.",
    date: "May 2023",
    duration: "Full day"
  },
  {
    id: 5,
    name: "Riley Quinn",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "The artistic vibe is incredible. Feels like stepping back in time to 1920s Paris. Watch out for tourist traps near the main square.",
    date: "July 2023",
    duration: "4-hour visit"
  },
]
  const averageRating = Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)

  const isTooClose = (pos1: { x: number; y: number }, pos2: { x: number; y: number }, minDistance: number) => {
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < minDistance
  }

  

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight
      const cardWidth = 256 // w-64
      const cardHeight = 160 // Approximate card height
  
      // Calculate valid position ranges to keep cards fully visible
      const minX = (-containerWidth / 2) + (cardWidth / 2)
      const maxX = (containerWidth / 2) - (cardWidth / 2)
      const minY = (-containerHeight / 2) + (cardHeight / 2)
      const maxY = (containerHeight / 2) - (cardHeight / 2)
  
      // Generate random positions within visible area (allow overlaps)
      const positions = reviews.map(() => ({
        x: Math.random() * (maxX - minX) + minX,
        y: Math.random() * (maxY - minY) + minY
      }))
  
      setInitialPositions(positions)
    }
  }, [reviews.length])

  // Updated handleAggregate function
const handleAggregate = async () => {
  setIsAggregating(true);
  
  // Wait for all cards to animate
  setTimeout(() => {
    setShowSummary(true);
  }, reviews.length * 50 + 800); // Match animation timing
};

  const handleReset = () => {
    setIsAggregating(false)
    setIsSwirling(false)
    setShowSummary(false)
  }

  // Generate floating animation variants for each review
  const getFloatingAnimation = (index: number) => {
    return {
      initial: {
        x: initialPositions[index]?.x || 0,
        y: initialPositions[index]?.y || 0,
      },
      animate: {
        x: [
          initialPositions[index]?.x || 0,
          (initialPositions[index]?.x || 0) + 15 * Math.sin(index), // Reduced from 20
          (initialPositions[index]?.x || 0) - 8 * Math.sin(index + 1), // Reduced from 10
          initialPositions[index]?.x || 0,
        ],
        y: [
          initialPositions[index]?.y || 0,
          (initialPositions[index]?.y || 0) - 10 * Math.cos(index), // Reduced from 15
          (initialPositions[index]?.y || 0) + 15 * Math.cos(index + 1), // Reduced from 25
          initialPositions[index]?.y || 0,
        ],
        transition: {
          duration: 8 + index,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse" as const,
        },
      },
      converge: {
        x: 0,
        y: 0,
        scale: 0.1,
        opacity: 0,
        transition: {
          duration: 1,
          ease: "easeInOut",
        },
      },
    }
  }

  // Improved merging animation with smooth, direct paths
  const getMergeAnimation = (index: number) => {
    const delay = index * 0.05;
    return {
      animate: {
        x: 0,
        y: 0,
        scale: [1, 0.8, 0.4, 0],
        opacity: [1, 0.8, 0.3, 0],
        rotate: [0, -5, 5, 0],
        transition: {
          x: {
            duration: 0.8,
            ease: [0.33, 1, 0.68, 1],
            delay
          },
          y: {
            duration: 0.8,
            ease: [0.33, 1, 0.68, 1],
            delay
          },
          scale: {
            duration: 0.6,
            ease: "easeInOut",
            delay
          },
          opacity: {
            duration: 0.7,
            ease: "linear",
            delay
          },
          rotate: {
            duration: 0.8,
            ease: "easeInOut",
            delay
          }
        }
      }
    };
  };
  const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
    <Card className="w-64 p-4 shadow-xl bg-gradient-to-br"
    style={{ 
      background: "linear-gradient(to right bottom, rgba(79, 70, 229, 0.08), rgba(124, 58, 237, 0.08))",
      backdropFilter: "blur(10px)"
    }}>
      <div 
      className="flex items-center gap-3 mb-3 ">
        <Avatar className="h-8 w-8">
          <AvatarImage src={review.avatar} />
          <AvatarFallback style={{ background: "linear-gradient(to right, #3b82f6, #6366f1, #a855f7)" }}>{review.name[0]}</AvatarFallback>
        </Avatar>
        <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{review.name}</h3>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < review.rating ? "text-indigo-500 fill-indigo-500" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-white dark:text-gray-300 line-clamp-3">
        {review.comment}
      </p>

      </Card>
  )
  const SummaryCard = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 110,
          damping: 15
        }
      }}
      className="absolute"
    >
      <BackgroundGradient className="rounded-[22px] max-w-sm  sm:p-10 bg-black dark:bg-zinc-900">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-3" 
            style={{ 
              background: "linear-gradient(to right, #3b82f6, #6366f1, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
            Summarized Insights
          </h2>
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                key={i}
                className={`h-6 w-6 ${i < averageRating ? "text-indigo-500 fill-indigo-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-indigo-600 dark:text-indigo-400">
              ({averageRating.toFixed(1)}/5)
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Based on {reviews.length} reviews
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-center dark:text-white leading-relaxed text-white">
            Visitors highlight Montmartre's <span style={{ color: "#6366f1" }} className="font-medium">panoramic views</span> from Sacré-Cœur, with <span style={{ color: "#6366f1" }} className="font-medium">80%</span> recommending early morning visits to avoid crowds. The artistic atmosphere and charming streets receive praise, though <span style={{ color: "#6366f1" }} className="font-medium">60%</span> mention steep walking conditions and midday tourist crowds as challenges. Don't miss Café des Deux Moulins from Amélie and hidden gem bakeries on Rue Lepic.
          </p>
        </div>
      </BackgroundGradient>
    </motion.div>
  )
   return (
    <div className="flex items-center justify-center h-screen bg-black w-full max-w-4xl mx-auto my-auto">
  
      <div ref={containerRef} className="relative h-[600px] w-full flex items-center justify-center overflow-hidden">
          {/* Floating reviews */}
          <AnimatePresence>
            {initialPositions.length > 0 && !showSummary && reviews.map((review, index) => (
              <motion.div
              key={review.id}
              className="absolute"
              initial="initial"
              animate={isAggregating ? "animate" : "animate"}
              variants={
                isAggregating 
                  ? getMergeAnimation(index)
                  : getFloatingAnimation(index)
              }
              exit="exit"
            >
              <ReviewCard review={review} />
            </motion.div>
            ))}
          </AnimatePresence>
          {showSummary && <SummaryCard />}
          
        </div>
       </div>
  )
}