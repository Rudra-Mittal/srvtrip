import { setReview } from "@/store/slices/placeSlice";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// FIX required: Stop the calls when the summary  is received
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getPlaceReview = async (placeId: string, abortSignal: AbortSignal): Promise<{summarizedReview: string, rating: number} | null> => {
    const MAX_ATTEMPTS = 2;

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
        
        if(currentPlace && places[itineraryNum-1]?.[dayNum-1]?.length > 0){
            const place = places[itineraryNum-1][dayNum-1].find((place: any) => place.id === currentPlace);
            console.log("Current place data:", place, currentPlace);
            setCurrentPlaceData(place);
            setReviewError(null);            
            if(place?.summarizedReview == null){
                setReviewLoading(true);
                
                // Create a new AbortController for this polling operation
                abortControllerRef.current = new AbortController();
                const signal = abortControllerRef.current.signal;
                
                getPlaceReview(currentPlace, signal)
                    .then((data) => {
                        console.log("Data received:", data, signal.aborted);
                        // Only update if the request wasn't aborted and we got data
                        if (data && !signal.aborted) {
                            console.log('dispatching review:', data.summarizedReview, 'rating:', data.rating);
                            dispatch(setReview({
                                placeId: currentPlace, 
                                summarizedReview: data.summarizedReview, 
                                rating: data.rating,
                                itineraryIdx: itineraryNum-1
                            }));
                        }else{
                        }
                        setReviewError(null);
                        setReviewLoading(false);
                    })
                    .catch((error)=>{
                        // Only update if the request wasn't aborted
                        if (!signal.aborted) {
                            setReviewError(error.message);
                            console.error("Error fetching place review:", error);
                            setReviewLoading(false);
                        }
                    });
            }
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
        return <div className="text-gray-300">No place selected</div>
    } 
    return (
        <div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center">
                <span className="inline-block w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 mr-2 rounded-full"></span>
                {currentPlaceData&&currentPlaceData.displayName}
            </h3>
            {reviewLoading && <div className="text-gray-300">Loading...</div>}
             {reviewError||currentPlaceData&&currentPlaceData.summarizedReview}
        </div>
    )
}