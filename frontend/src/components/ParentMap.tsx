import { APIProvider } from "@vis.gl/react-google-maps";
import { useEffect, useState} from "react";
import MapComponent from "./Map";
import { useSelector } from "react-redux";
function ParentMap({ dayNum, itineraryNum }: { dayNum: string, itineraryNum: string }) {
  // Convert string params to numbers (subtract 1 for zero-based array index)
  const activePlaceId = useSelector((state: any) => state.place.activePlaceId);
  console.log("Active place ID from Redux:", activePlaceId);
  // const [mapInstance, setMapInstance] = useState<any>(null); // Store the map instance

  const currentDay = dayNum ? parseInt(dayNum) - 1 : 0;
  const itineraryId = itineraryNum ? parseInt(itineraryNum) - 1 : 0;
  // Predefined markers with names
  const placesData = useSelector((state: any) => state.place.places);
  console.log("places for day:", currentDay, placesData[itineraryId][currentDay]);
  
  const [predefinedMarkers, setPredefinedMarkers] = useState<Array<{ lat: number; lng: number; name: string; placeId: string }>>([]);

  // console.log("Predefined markers:", placesData[currentDay]);
  useEffect(() => {
    // if (placesData && placesData.length > currentDay && placesData[itineraryId][currentDay]) {
      const markers: Array<{ lat: number; lng: number; name: string; placeId: string; photos?: string[]; rating?: number; category?: string}> = [];
      // console.log("reached")
      // Only process places for the current day
      const dayPlaces = placesData[itineraryId][currentDay];
      // console.log("Day places:", dayPlaces); 
      if (Array.isArray(dayPlaces)) {
        // Changed from dayPlaces[currentDay] to dayPlaces[0]
        // We're already at the current day, so just process the first group of places
        dayPlaces.forEach((place) => {
          // console.log("Processing place for day", currentDay, place);
          if (place && place.location && place.displayName) {
            // console.log("Adding marker:", place.displayName);
            markers.push({
              lat: place.location.latitude,
              lng: place.location.longitude,
              name: place.displayName,
              placeId: place.id, // Add placeId here
              photos: place.photos || [], // Add photos from place data
              rating: place.rating || 4.5, // Add rating from place data
              category: place.types?.[0] || "Tourist Attraction", // Add category from place data
            });
          }
        });
      // }
      
      // Update predefinedMarkers if we found any valid locations for the current day
      if (markers.length > 0) {
        setPredefinedMarkers(markers);
        console.log("Updated markers for day", currentDay, ":", markers);
      } else {
        console.log("No valid locations found for day", currentDay);
      }
    } else {
      console.log("No places data available for day", currentDay);
    }
  }, []);

  useEffect(() => {
    if (activePlaceId ) {
      console.log("predefibed markers:", predefinedMarkers);
      console.log("Active place ID:", activePlaceId);
      const activeMarker = predefinedMarkers.find(marker => marker.placeId === activePlaceId);
      console.log("Active marker:", activeMarker);
      if (activeMarker) {
        console.log(`Zooming in on: ${activeMarker.name}`);
        console.log(`Coordinates: ${activeMarker.lat}, ${activeMarker.lng}`);
        setSelectedMarker(activeMarker === selectedMarker ? null : activeMarker);
        //@ts-ignore
        setInfoOpen(activeMarker);
        // mapInstance.panTo({ lat: activeMarker.lat, lng: activeMarker.lng }); // Center the map on the marker
        // mapInstance.setZoom(14); // Zoom in on the marker
      }
      
    }
  }, [activePlaceId, predefinedMarkers]);

  const [hoveredMarker, setHoveredMarker] = useState<Marker | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [infoOpen, setInfoOpen] = useState<boolean | null>(null);
  const closeInfoWindow = () => {
    console.log("Closing info window manually");
    setSelectedMarker(null);
    setInfoOpen(null);
    setHoveredMarker(null);
  };

  useEffect(() => {
    // Function to handle clicks outside
    const handleOutsideClick = (e: MouseEvent) => {
      // Only proceed if a marker is selected
      if (!selectedMarker) return;
  
  const target = e.target as HTMLElement;
  const clickedOnPlaceButton = target.closest('[data-place-id]') !== null;
  const clickedOnMap = target.closest('.info-win') !== null;
  const clickedOnInfoWindow = target.closest('.google-maps-info-window') !== null || 
                              target.closest('.gm-style-iw') !== null;  // Google Maps InfoWindow class
  
  if (!clickedOnPlaceButton && !clickedOnMap && !clickedOnInfoWindow) {
    closeInfoWindow();
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleOutsideClick);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [selectedMarker]); 

  useEffect(() => {
    // Only set the timer if a marker is selected
    if (selectedMarker && infoOpen) {
      const timer = setTimeout(() => {
        console.log("Auto-closing info window for:", selectedMarker.name);
        setSelectedMarker(null);
        setInfoOpen(null);
        setHoveredMarker(null);
      }, 5000); // 10 seconds (adjust as needed)
  
      // Clear the timer when component unmounts or when selection changes
      return () => clearTimeout(timer);
    }
  }, [selectedMarker, infoOpen]);
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  
  if (!apiKey) {
    return <div>Error: Missing Google API Key</div>;
  }

  // Handle hover on text listing
  interface Marker {
    lat: number;
    lng: number;
    name: string;
  }

  // const handleListingHover = (marker: any): void => {
  //   setHoveredMarker(marker);
  //   setInfoOpen(marker);
  // };

  // // Handle click on text listing
  // const handleListingClick = (marker : Marker): void => {
  //   setSelectedMarker(marker === selectedMarker ? null : marker);
  // };

  // // Handle mouse leave from text listing
  // const handleListingLeave = () => {
  //   setHoveredMarker(null);
  //   setInfoOpen(null);
  // };

  return (
    <div className="flex w-full absolute inset-0">
      {/* Left side - Listings */}
      {/* <div className="w-1/2 p-6 overflow-y-auto bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Places in Shimla</h2>
        <div className="space-y-4">
          {predefinedMarkers.map((marker, index) => (
            <div 
              key={index}
              className={`
                p-4 rounded-lg cursor-pointer transition-all duration-300
                ${(hoveredMarker === marker || selectedMarker === marker) ? 
                  'bg-blue-100 shadow-md transform scale-105' : 
                  'bg-white shadow hover:shadow-md'
                }
              `}
              onMouseEnter={() => handleListingHover(marker)}
              onMouseLeave={handleListingLeave}
              onClick={() => handleListingClick(marker)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mr-3">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{marker.name}</h3>
                  <p className="text-sm text-gray-500">
                    {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      
      {/* Right side - Map */}
      <div className="w-full h-[35rem]">
        <APIProvider apiKey={apiKey} version="beta">
          <MapComponent 
            predefinedMarkers={predefinedMarkers}
            hoveredMarker={hoveredMarker}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            infoOpen={infoOpen}
            setInfoOpen={setInfoOpen}
            
          />
        </APIProvider>
      </div>
    </div>
  );
}

export default ParentMap;