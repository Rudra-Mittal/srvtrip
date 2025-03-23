"use client";
import { BackgroundBeams } from "../ui/background-beams";

export function BackgroundBeamsDemo() {
  return (
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <BackgroundBeams />
    </div>
  );
}