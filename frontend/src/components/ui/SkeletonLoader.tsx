
export const DayPageSkeletonLoader = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Custom subtle pulse animation */}
      <style>{`
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.9; }
        }
        .animate-subtle-pulse {
          animation: subtlePulse 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Main content - positioned below navbar with proper spacing */}
      <div className="flex-grow mt-24 p-2 sm:p-4">
        <div className="relative flex flex-col lg:flex-row w-full gap-4 h-full">
          {/* Left column */}
          <div className="w-full lg:w-3/5">
            <div className="rounded-xl border border-blue-500/20 shadow-xl p-3 md:p-6 flex flex-col h-full bg-gradient-to-b from-black to-gray-900/95">
              {/* Image slider skeleton */}
              <div className="flex justify-center w-full mb-5">
                <div className="relative w-4/5 sm:w-3/4 md:w-3/5 aspect-[5/3] bg-gray-800 rounded-lg border border-blue-500/20 animate-subtle-pulse"></div>
              </div>

              {/* Day Heading skeleton */}
              <div className="flex items-center justify-center mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-purple-500/30 flex-grow"></div>
                <div className="h-6 w-24 mx-4 bg-gray-800 rounded animate-subtle-pulse"></div>
                <div className="h-px bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-transparent flex-grow"></div>
              </div>

              {/* Day content container */}
              <div className="w-full flex-1 rounded-lg bg-black/30 border border-blue-500/10 p-4">
                {/* Morning section */}
                <div className="mb-4">
                  <div className="h-8 w-32 bg-gray-800 mb-2 rounded animate-subtle-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-full animate-subtle-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-11/12 animate-subtle-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-10/12 animate-subtle-pulse"></div>
                  </div>
                </div>

                {/* Afternoon section */}
                <div className="mb-4 mt-8">
                  <div className="h-8 w-32 bg-gray-800 mb-2 rounded animate-subtle-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-full animate-subtle-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-10/12 animate-subtle-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-11/12 animate-subtle-pulse"></div>
                  </div>
                </div>

                {/* Evening section */}
                <div className="mb-4 mt-8">
                  <div className="h-8 w-32 bg-gray-800 mb-2 rounded animate-subtle-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-9/12 animate-subtle-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-full animate-subtle-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded w-10/12 animate-subtle-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-full lg:w-2/5 flex flex-col gap-4 overflow-hidden border border-zinc-800 rounded-lg p-3">
            {/* Weather skeleton */}
            <div className="w-full h-24 bg-gray-800 rounded-lg animate-subtle-pulse"></div>

            {/* Map skeleton */}
            <div className="w-full h-[400px] rounded-lg bg-gray-800 border border-zinc-800 animate-subtle-pulse"></div>

            {/* Summary skeleton */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-5 rounded-lg border border-blue-500/20">
              <div className="h-6 w-48 bg-gray-800 mb-4 rounded animate-subtle-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-800 rounded w-full animate-subtle-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-11/12 animate-subtle-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-10/12 animate-subtle-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-full animate-subtle-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-9/12 animate-subtle-pulse"></div>
              </div>
            </div>

            {/* Navigation buttons skeleton */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="h-10 w-32 bg-gray-800 rounded-lg animate-subtle-pulse"></div>
              <div className="h-10 w-32 bg-gray-800 rounded-lg animate-subtle-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayPageSkeletonLoader;
