"use client";
import { HeroParallax } from "../../ui/hero-parallax";

export function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "Santorini, Greece",
    link: "https://en.wikipedia.org/wiki/Santorini",
    thumbnail: "https://images.unsplash.com/photo-1503152394-c571994fd383?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FudG9yaW5pJTIwZ3JlZWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Kyoto, Japan",
    link: "https://en.wikipedia.org/wiki/Kyoto",
    thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a3lvdG8lMjBqYXBhbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Banff National Park, Canada",
    link: "https://en.wikipedia.org/wiki/Banff_National_Park",
    thumbnail: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZmYlMjBuYXRpb25hbCUyMHBhcmt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Taj Mahal, India",
    link: "https://en.wikipedia.org/wiki/Taj_Mahal",
    thumbnail: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Cappadocia, Turkey",
    link: "https://en.wikipedia.org/wiki/Cappadocia",
    thumbnail: "/parallaximages/image1.jpg",
  },
  {
    title: "Amalfi Coast, Italy",
    link: "https://en.wikipedia.org/wiki/Amalfi_Coast",
    thumbnail: "/parallaximages/image3.jpg",
  },
  
  {
    title: "Machu Picchu, Peru",
    link: "https://en.wikipedia.org/wiki/Machu_Picchu",
    thumbnail: "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Sahara Desert, Morocco",
    link: "https://en.wikipedia.org/wiki/Sahara",
    thumbnail: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FoYXJhJTIwZGVzZXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "New York, USA",
    link: "https://en.wikipedia.org/wiki/USA",
    thumbnail: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2071&auto=format&fit=crops",
  },
  {
    title: "Barcelona, Spain",
    link: "https://en.wikipedia.org/wiki/Barcelona",
    thumbnail: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Santorini, Greece",
    link: "https://en.wikipedia.org/wiki/Santorini",
    thumbnail: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2002&auto=format&fit=crop"
  },
  {
    title: "Bali, Indonesia",
    link: "https://en.wikipedia.org/wiki/Bali",
    thumbnail: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "London, UK",
    link: "https://en.wikipedia.org/wiki/London",
    thumbnail: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=2052&auto=format&fit=crop"
  },
  {
    title: "Dubai, UAE",
    link: "https://en.wikipedia.org/wiki/Dubai",
    thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Rio de Janeiro, Brazil",
    link: "https://en.wikipedia.org/wiki/Rio_de_Janeiro",
    thumbnail: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmlvJTIwZGUlMjBqYW5laXJvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Iceland Northern Lights",
    link: "https://en.wikipedia.org/wiki/Aurora",
    thumbnail: "/parallaximages/image10.jpg",
  },
  // New entries below
  {
    title: "Rio de Janeiro, Brazil",
    link: "https://en.wikipedia.org/wiki/Rio_de_Janeiro",
    thumbnail: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmlvJTIwZGUlMjBqYW5laXJvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Maldives",
    link: "https://en.wikipedia.org/wiki/Maldives",
    thumbnail: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZGl2ZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Barcelona, Spain",
    link: "https://en.wikipedia.org/wiki/Barcelona",
    thumbnail: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Bangkok, Thailand",
    link: "https://en.wikipedia.org/wiki/Eiffel_Tower",
    thumbnail: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=1974&auto=format&fit=crop",
  },
  {
    title: "Angkor Wat, Cambodia",
    link: "https://en.wikipedia.org/wiki/Angkor_Wat",
    thumbnail: "/parallaximages/image2.jpg",
  },
];