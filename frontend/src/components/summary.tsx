import { setReview } from "@/store/slices/placeSlice";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// FIX required: Stop the calls when the summary  is received
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getPlaceReview = async (placeId: string, abortSignal: AbortSignal): Promise<{summarizedReview: string, rating: number} | null> => {
    const MAX_ATTEMPTS = 4;

    let attempts = 0;
    
    // Create a variable to track if polling should continue
    let shouldContinue = true;
    
    // Set up abort handler
    abortSignal.addEventListener('abort', () => {
        shouldContinue = false;
        console.log(`Polling for place ${placeId} aborted`);
    });

    const poll = async (): Promise<{summarizedReview: string, rating: number} | null> => {
        // Check if we should stop polling
        if (!shouldContinue) {
            console.log(`Polling for place ${placeId} stopped due to cancellation`);
            return null;
        }
          try {
            const res = await fetch(`${BACKEND_URL}/api/summarize?placeid=${placeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                signal: abortSignal // Pass the abort signal to fetch
            });

            const data = await res.json();
            if (res.ok) {
                console.log("Successful response received.", data.summarizedReview, "Rating:", data.rating);
                return {
                    summarizedReview: data.summarizedReview,
                    rating: data.rating
                };
            }

        } catch (err : any) {
            // Don't log aborted requests as errors
            if (err.name !== 'AbortError') {
                console.error("Error fetching place review:", err);
            } else {
                console.log("Request was aborted");
                return null;
            }
        }

        attempts++;
        if (attempts < MAX_ATTEMPTS && shouldContinue) {
            // Return a promise that will resolve after the timeout
            return new Promise<{summarizedReview: string, rating: number} | null>(resolve => {
                const timeoutId = setTimeout(() => {
                    // Only continue polling if not aborted
                    if (shouldContinue) {
                        resolve(poll());
                    } else {
                        resolve(null);
                    }
                }, 10 * 1000);
                
                // If aborted during timeout, clear the timeout
                abortSignal.addEventListener('abort', () => {
                    clearTimeout(timeoutId);
                    resolve(null);
                });
            });
        } else {
            if (!shouldContinue) {
                return null;
            }
            console.log("Max attempts reached. Stopping polling.");
            throw new Error("Taking too long to fetch the latest summary. Try again after some time.") ;
        }
    };

    return poll();
}

export default function Summary({dayNum,itineraryNum}:{dayNum:number,itineraryNum:number}) {    
    const currentPlace = useSelector((state: any) => state.place.activePlaceId);
    const [currentPlaceData, setCurrentPlaceData] = useState<any>(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const places = useSelector((state: any) => state.place.places);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const dispatch = useDispatch();
    // Ref to store the current AbortController
    const abortControllerRef = useRef<AbortController | null>(null);
    // Track the current place being processed to avoid race conditions
    const currentPlaceRef = useRef<string | null>(null);
    
    useEffect(()=>{
        // Cleanup function that will be called when the effect re-runs or component unmounts
        return () => {
            // Abort any in-progress polling when component unmounts
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, []);
    
    useEffect(()=>{
        // Abort any previous polling operation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        
        // Update the current place ref immediately
        currentPlaceRef.current = currentPlace;
        
        if(currentPlace && places[itineraryNum-1]?.[dayNum-1]?.length > 0){
            const place = places[itineraryNum-1][dayNum-1].find((place: any) => place.id === currentPlace);
            console.log("Current place data:", place, currentPlace);
            setCurrentPlaceData(place);
            setReviewError(null);
            
            // Check if we need to start polling
            const needsPolling = place?.summarizedReview == null;
            
            if(needsPolling){
                setReviewLoading(true);
                
                // Create a new AbortController for this polling operation
                abortControllerRef.current = new AbortController();
                const signal = abortControllerRef.current.signal;
                
                getPlaceReview(currentPlace, signal)
                    .then((data) => {
                        console.log("Data received:", data, signal.aborted);
                        // Only update if this is still the current place and request wasn't aborted
                        if (data && !signal.aborted && currentPlaceRef.current === currentPlace) {
                            console.log('dispatching review:', data.summarizedReview, 'rating:', data.rating);
                            dispatch(setReview({
                                placeId: currentPlace, 
                                summarizedReview: data.summarizedReview, 
                                rating: data.rating,
                                itineraryIdx: itineraryNum-1
                            }));
                            setReviewError(null);
                        }
                        // Only update loading state if this is still the current place
                        if (currentPlaceRef.current === currentPlace) {
                            setReviewLoading(false);
                        }
                    })
                    .catch((error)=>{
                        // Only update if the request wasn't aborted and this is still the current place
                        if (!signal.aborted && currentPlaceRef.current === currentPlace) {
                            setReviewError(error.message);
                            console.error("Error fetching place review:", error);
                            setReviewLoading(false);
                        }
                    });
            } else {
                // Place has summary, set loading to false
                setReviewLoading(false);
            }
        } else {
            // No place selected or places not loaded - clear everything
            setCurrentPlaceData(null);
            setReviewLoading(false);
            setReviewError(null);
        }
        
        // Clean up function for when the effect re-runs
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [currentPlace, places, itineraryNum, dayNum]);

    if (!currentPlace) {
        return <div className="text-gray-300">Select a place to see the summarized reviews</div>
    } 
    return (
        <div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center">
                <span className="inline-block w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 mr-2 rounded-full"></span>
                {currentPlaceData&&currentPlaceData.displayName}
            </h3>
            
            <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <span className="block truncate">
                    Summarized Review of {currentPlaceData?.displayName || "Selected Place"}
                </span>
            </h2>
            
            {reviewLoading && (
                <div className="space-y-4">
                    
                    
                    {/* Summary text skeleton with shimmer effect */}
                    <div className="space-y-3">
                        {[100, 90, 85, 95, 75, 88, 92].map((width, i) => (
                            <div
                                key={i}
                                className="relative overflow-hidden bg-gray-700 rounded h-4"
                                style={{ 
                                    width: `${width}%`,
                                    animationDelay: `${i * 0.15}s`
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/50 to-transparent animate-pulse"></div>
                                <div 
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    
                    
                    <style>
                        {`
                        @keyframes shimmer {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(100%); }
                        }
                        `}
                    </style>
                </div>
            )}
            
            {reviewError && (
                <div className="text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Unable to load summary</span>
                    </div>
                    <p className="text-sm">{reviewError}</p>
                </div>
            )}
            
            {!reviewLoading && !reviewError && currentPlaceData?.summarizedReview && (
                <div className="text-gray-300">
                    {/* Rating display */}
                    {currentPlaceData.rating && (
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(currentPlaceData.rating) 
                                            ? 'text-yellow-400' 
                                            : 'text-gray-600'
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-gray-400">
                                {currentPlaceData.rating.toFixed(1)}/5
                            </span>
                        </div>
                    )}
                    
                    {/* Summary text */}
                    <div className="leading-relaxed">
                        {currentPlaceData.summarizedReview}
                    </div>
                </div>
            )}
            
            {!reviewLoading && !reviewError && !currentPlaceData?.summarizedReview && (
                <div className="text-gray-400 text-center py-8">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No summary available for this place</p>
                    <p className="text-sm mt-1">Summary will be generated automatically</p>
                </div>
            )}
        </div>
    )
}