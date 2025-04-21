import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
// FIX required: Stop the calls when the summary  is received
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getPlaceReview = async (placeId: string, abortSignal: AbortSignal) => {
    const MAX_ATTEMPTS = 10;

    let attempts = 0;
    
    // Create a variable to track if polling should continue
    let shouldContinue = true;
    
    // Set up abort handler
    abortSignal.addEventListener('abort', () => {
        shouldContinue = false;
        console.log(`Polling for place ${placeId} aborted`);
    });

    const poll = async () => {
        // Check if we should stop polling
        if (!shouldContinue) {
            console.log(`Polling for place ${placeId} stopped due to cancellation`);
            return null;
        }
        
        try {
            const res = await fetch(`${BACKEND_URL}api/summarize?placeid=${placeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                signal: abortSignal // Pass the abort signal to fetch
            });

            const data = await res.json();
            if (res.ok) {
                console.log("Successful response received.");
                return data.summary;
            }

        } catch (err) {
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
            return new Promise(resolve => {
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
            return "Error: Max attempts reached";
        }
    };

    return poll();
}

export default function Summary({dayNum,itineraryNum}:{dayNum:number,itineraryNum:number}) {    
    const currentPlace = useSelector((state: any) => state.place.activePlaceId);
    const [currentPlaceData, setCurrentPlaceData] = useState<any>(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const places = useSelector((state: any) => state.place.places);
    
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
            
            if(place?.summary == null){
                setReviewLoading(true);
                
                // Create a new AbortController for this polling operation
                abortControllerRef.current = new AbortController();
                const signal = abortControllerRef.current.signal;
                
                getPlaceReview(currentPlace, signal)
                    .then((data) => {
                        // Only update if the request wasn't aborted and we got data
                        if (data && !signal.aborted) {
                            setCurrentPlaceData((prevData: any) => ({
                                ...prevData,
                                summary: data,
                            }));
                            setReviewLoading(false);
                        }
                    })
                    .catch((error)=>{
                        // Only update if the request wasn't aborted
                        if (!signal.aborted) {
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
    if(reviewLoading){
        return <div className="text-gray-300">Loading...</div>
    }
    return (
        <div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center">
                <span className="inline-block w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 mr-2 rounded-full"></span>
                {currentPlaceData&&currentPlaceData.placename}
            </h3>
            {currentPlaceData&&currentPlaceData.summary}
        </div>
    )
}