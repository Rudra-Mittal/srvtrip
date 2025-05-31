import React, { useState, useEffect, useRef } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import "../index.css";

// Interface for animation parameters
interface AnimateZoomParams {
  start: number;
  end: number;
  position: google.maps.LatLngLiteral;
  duration: number;
}

// Add this outside the component to persist between renders
const directionsGlobalCache = {
  directions: [] as any[],
  rendered: false
};


// Component to render directions between markers
const DirectionsRenderer = ({predefinedMarkers, triggerDirections, isDarkTheme}: { 
  predefinedMarkers: any[], 
  triggerDirections: boolean,
  isDarkTheme: boolean 
}) => {
  const routesLibrary = useMapsLibrary("routes");
  const map = useMap();
  const directionsCache = useRef<any[]>([]); // Local cache reference
  
  // Clear previous directions when theme changes
  useEffect(() => {
    // Clear existing directions when theme changes
    directionsGlobalCache.directions.forEach(renderer => {
      if (renderer) renderer.setMap(null);
    });
    directionsGlobalCache.directions = [];
    directionsGlobalCache.rendered = false;
  }, [isDarkTheme]);
  
  useEffect(() => {
    // Use global cache to prevent re-rendering directions
    if (!routesLibrary || !map || !triggerDirections) return;

    // Clear existing directions first
    directionsCache.current.forEach(renderer => {
      if (renderer) renderer.setMap(null);
    });
    directionsCache.current = [];
    
    // Create directions for each pair of consecutive markers
    predefinedMarkers.forEach((_, index) => {
      if (index < predefinedMarkers.length - 1) {
        setTimeout(() => {
          const directionsService = new routesLibrary.DirectionsService();
          const directionsRenderer = new routesLibrary.DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#FF5733", 
              strokeWeight: 4,
            },
            preserveViewport: true,
          });
          
          // Store in both caches
          directionsCache.current.push(directionsRenderer);
          directionsGlobalCache.directions.push(directionsRenderer);

          directionsService.route(
            {
              origin: predefinedMarkers[index],
              destination: predefinedMarkers[index + 1],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === google.maps.DirectionsStatus.OK && response) {
                directionsRenderer.setDirections(response);
                directionsGlobalCache.rendered = true;
              } else {
                console.error("Directions request failed due to " + status);
              }
            }
          );
        }, 500 * (index + 1));
      }
    });
  }, [routesLibrary, map, triggerDirections, isDarkTheme]);
  
  return null;
};

// Main Map Component
const MapComponent = ({ 
  predefinedMarkers,
  hoveredMarker,
  selectedMarker,
  setSelectedMarker,
  infoOpen,
  setInfoOpen,
  
}: { 
  predefinedMarkers: { lat: number; lng: number; name?: string }[];
  hoveredMarker: { lat: number; lng: number; name?: string } | null;
  selectedMarker: { lat: number; lng: number; name?: string } | null;
  setSelectedMarker: any
  infoOpen: boolean | null;
  setInfoOpen: any;
}) => {
  
  const [allMarkersVisible, setAllMarkersVisible] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Default to dark theme
  
  const defaultCenter = predefinedMarkers[0];
  const defaultZoom = 12;
  
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
  
  // Toggle map theme
  const toggleMapTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  
  return (
    <div className="h-full w-full relative">
      {/* Theme toggle button - Moved from right to left */}
      <div className="absolute top-3 left-3 z-10 bg-black/40 backdrop-blur-md rounded-full p-2 shadow-lg">
        <button 
          onClick={toggleMapTheme}
          className={`flex items-center justify-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
            isDarkTheme 
              ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' 
              : 'bg-white text-blue-600 hover:bg-gray-100'
          }`}
          aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkTheme ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <span className="text-sm font-medium">Light</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
              <span className="text-sm font-medium">Dark</span>
            </>
          )}
        </button>
      </div>
      
      <div className="w-full h-full">
        <Map
          mapId={mapId}
          colorScheme={isDarkTheme ? "DARK" : "LIGHT"}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapTypeControl={false}
          disableDefaultUI={false}
          zoomControl={true}
          scrollwheel={true}
          gestureHandling={"cooperative"}
          style={{ width: '100%', height: '100%' }}
        >
          <MarkerManager 
            predefinedMarkers={predefinedMarkers}
            setAllMarkersVisible={setAllMarkersVisible} 
            setInfoOpen={setInfoOpen}
            infoOpen={infoOpen}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            hoveredMarker={hoveredMarker}
            isDarkTheme={isDarkTheme}
          />
          {allMarkersVisible && <DirectionsRenderer 
            predefinedMarkers={predefinedMarkers} 
            triggerDirections={true} 
            isDarkTheme={isDarkTheme} 
          />}
        </Map>
      </div>
    </div>
  );
};

// Component to manage markers and their animations
const MarkerManager = ({ 
  setAllMarkersVisible, 
  setInfoOpen, 
  infoOpen, 
  selectedMarker, 
  setSelectedMarker,
  hoveredMarker,
  predefinedMarkers,
  isDarkTheme
}: {
  setAllMarkersVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoOpen: React.Dispatch<React.SetStateAction<any>>;
  infoOpen: any;
  selectedMarker: any;
  setSelectedMarker: any;
  hoveredMarker: any;
  predefinedMarkers: any[];
  isDarkTheme: boolean;
}) => {
  // console.log("selected",selectedMarker)
  const [visibleMarkerIndices, setVisibleMarkerIndices] = useState<number[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isInfoWindowHoveredRef = useRef(false);
  const map = useMap();
  const animationFrameRef = useRef<number | null>(null);
  const mouseTrackingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomOutTimeoutRef = useRef(null);
  const isTrackingMouseRef = useRef(false);
  const isMouseOverPopupRef = useRef(false);
  const isMouseOverMarkerRef = useRef(false);
  const defaultZoom = 12;
  const clickZoom = 14;
  const zoomDuration = 300; // ms for zoom animation
  const mouseTrackingDelay = 1500; // 1.5 sec delay before tracking mouse position
  const currentZoomRef = useRef(defaultZoom);
  const infoWindowCloseIntentionalRef = useRef(false);
  // Images for carousel
  const popupLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get images from predefined markers data
  const getCurrentImages = () => {
    if (!infoOpen?.photos || !Array.isArray(infoOpen.photos)) {
      return getDefaultImages();
    }
    return infoOpen.photos.map((photo: string) => resizeGoogleImage(photo));
  };

  // Helper function to resize Google images
  const resizeGoogleImage = (url: string): string => {
    if (url.includes('googleusercontent.com') && !url.includes('=s')) {
      return `${url}=s400-c`;
    }
    return url;
  };

  // Default fallback images
  const getDefaultImages = () => [
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTG9hZGluZyBGYWlsZWQ8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2JiYmJiYiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGhvdG9zIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+"
  ];
  // Reset image index when location changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [infoOpen?.placeId]);

  // Effect for watching selected marker changes
  useEffect(() => {
    if (selectedMarker && map) {
      // Smooth zoom animation to the selected marker
      map.panTo(selectedMarker);
      animateZoom(currentZoomRef.current, clickZoom, selectedMarker, zoomDuration);
    }
  }, [selectedMarker, map]);

  // Effect for watching hovered marker changes
  useEffect(() => {
    if (hoveredMarker && map) {
      // Smooth zoom animation to the hovered marker
      map.panTo(hoveredMarker);
      animateZoom(currentZoomRef.current, clickZoom, hoveredMarker, zoomDuration);
    } else if (!hoveredMarker && !selectedMarker && map && isTrackingMouseRef.current && !infoWindowCloseIntentionalRef.current) {
      // Only zoom out if tracking mouse AND not an intentional InfoWindow close
      map.setZoom(defaultZoom);
    }
  }, [hoveredMarker, map, selectedMarker]);
  
  // Animate markers appearing
  useEffect(() => {
    predefinedMarkers.forEach((_, index) => {
      setTimeout(() => {
        setVisibleMarkerIndices(prev => {
          const newIndices = [...prev, index];
          if (newIndices.length === predefinedMarkers.length) {
            setAllMarkersVisible(true);
          }
          return newIndices;
        });
      }, 1000 + index * 200);
    });
  }, [setAllMarkersVisible]);

  // Cleanup timeouts and animation frames on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mouseTrackingTimeoutRef.current) clearTimeout(mouseTrackingTimeoutRef.current);
      if (zoomOutTimeoutRef.current) clearTimeout(zoomOutTimeoutRef.current);
    };
  }, []);

  // Track mouse movement to detect if outside of both marker and popup
  useEffect(() => {
    const trackMouseMovement = () => {
      if (isTrackingMouseRef.current) {
        // If not over marker or popup, trigger zoom out on mouse movement
        if (!isMouseOverMarkerRef.current && !isMouseOverPopupRef.current) {
          handleZoomOut();
          isTrackingMouseRef.current = false;
        }
      }
    };
    document.addEventListener('mousemove', trackMouseMovement);
    return () => {
      document.removeEventListener('mousemove', trackMouseMovement);
    };
  }, []);

  // Handle map click to close info windows if clicking away from markers
  useEffect(() => {
    if (map) {
      const listener = map.addListener("click", (e: any) => {
        // Check if clicking away from markers
        const isClickingMarker = predefinedMarkers.some(
          marker => 
            Math.abs(e.latLng.lat - marker.lat) < 0.0005 && 
            Math.abs(e.latLng.lng - marker.lng) < 0.0005
        );
        if (!isClickingMarker) {
          handleZoomOut();
        }
      });
      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [map]);

  // Smoothly animate zoom level
  const animateZoom = (
    start: AnimateZoomParams["start"],
    end: AnimateZoomParams["end"],
    position: AnimateZoomParams["position"],
    duration: AnimateZoomParams["duration"]
  ): void => {
    const startTime = performance.now();
    const animate = (currentTime: number): void => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      // Easing function for smoother animation
      const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      const newZoom = start + (end - start) * easedProgress;
      currentZoomRef.current = newZoom;
      if (map) {
        map.setZoom(newZoom);
        map.panTo(position);
      }
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        animationFrameRef.current = null;
      }
    };
    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Handle marker click
  const handleMarkerClick = (position: any) => {
    // console.log("ssss",selectedMarker)
    if (selectedMarker === position) {
      // If already selected, deselect it
      handleZoomOut();
    } else {
      // Cancel any existing tracking or timeouts
      if (mouseTrackingTimeoutRef.current) {
        clearTimeout(mouseTrackingTimeoutRef.current);
        mouseTrackingTimeoutRef.current = null;
      }
      if (zoomOutTimeoutRef.current) {
        clearTimeout(zoomOutTimeoutRef.current);
        zoomOutTimeoutRef.current = null;
      }
      isTrackingMouseRef.current = false;
      // Select new marker
      // console.log("selectedMarker",selectedMarker)
      const fullMarkerData=predefinedMarkers.find(marker=>
        marker.lat === position.lat &&
        marker.lng === position.lng &&
        marker.name === position.name
      );
      setSelectedMarker(position);
      setInfoOpen(fullMarkerData || position);
      
      // Smooth zoom animation to the selected marker
      if (map) {
        map.panTo(position);
        animateZoom(currentZoomRef.current, clickZoom, position, zoomDuration);
      }
      // Start a 1.5 second timer before we start tracking mouse movement
      mouseTrackingTimeoutRef.current = setTimeout(() => {
        mouseTrackingTimeoutRef.current = null;
        // Only start tracking mouse if not over marker or popup
        if (!isMouseOverMarkerRef.current && !isMouseOverPopupRef.current) {
          isTrackingMouseRef.current = true;
        }
      }, mouseTrackingDelay); // 1.5 seconds delay
    }
  };

  // Handle zoom out
  const handleZoomOut = () => {
    // Clear any tracking timeouts
    if (mouseTrackingTimeoutRef.current) {
      clearTimeout(mouseTrackingTimeoutRef.current);
      mouseTrackingTimeoutRef.current = null;
    }
    isTrackingMouseRef.current = false;
    isMouseOverPopupRef.current = false;
    isMouseOverMarkerRef.current = false;
    setSelectedMarker(null);
    setInfoOpen(null); 
    
    // Just reset zoom level but don't change position
    if (map) {
      // Don't pan to first marker, just change zoom
      map.setZoom(defaultZoom);
      // Remove this line
      // animateZoom(currentZoomRef.current, defaultZoom, predefinedMarkers[0], zoomDuration);
    }
  };

  // Handle marker mouse enter
  const handleMarkerMouseEnter = () => {
    isMouseOverMarkerRef.current = true;
    isTrackingMouseRef.current = false; // Stop tracking when mouse enters marker
  };

  // Handle marker mouse leave
  const handleMarkerMouseLeave = () => {
    isMouseOverMarkerRef.current = false;
    // If we've passed the 1.5 second delay and not over popup, start tracking mouse
    if (mouseTrackingTimeoutRef.current === null && !isMouseOverPopupRef.current) {
      isTrackingMouseRef.current = true;
    }
  };

// Handle popup mouse enter
// Handle popup mouse enter
const handlePopupMouseEnter = () => {
  isMouseOverPopupRef.current = true;
  isTrackingMouseRef.current = false; // Stop tracking when mouse enters popup
  
  // Clear any existing timeout for popup closing
  if (popupLeaveTimeoutRef.current) {
    clearTimeout(popupLeaveTimeoutRef.current);
    popupLeaveTimeoutRef.current = null;
  }
  
  setTimeout(() => {
    if (isMouseOverPopupRef.current) {
      isInfoWindowHoveredRef.current = true;
    }
  }, 100); // Add a small delay to prevent flickering
};

// Handle popup mouse leave
const handlePopupMouseLeave = () => {
  isMouseOverPopupRef.current = false;

  // Clear any existing timeout
  if (popupLeaveTimeoutRef.current) {
    clearTimeout(popupLeaveTimeoutRef.current);
  }

  // Set a timeout to close the InfoWindow after 4.5 seconds (instead of 1.5)
  popupLeaveTimeoutRef.current = setTimeout(() => {
    if (!isMouseOverPopupRef.current && !isMouseOverMarkerRef.current) {
      // Set flag to indicate this is not a user-initiated close
      infoWindowCloseIntentionalRef.current = true;
      setInfoOpen(null); // Close the InfoWindow
      setSelectedMarker(null); // Deselect the marker
      // Reset the flag after a short delay
      setTimeout(() => {
        infoWindowCloseIntentionalRef.current = false;
        popupLeaveTimeoutRef.current = null;
      }, 100);
    }
  }, 4500); // 4.5 seconds delay (changed from 1500)
};


  // Calculate adjusted position for InfoWindow (directly above marker)
  const getInfoWindowPosition = (position: any) => {
    if (!position) return null;
    // Create a slightly offset position to place the InfoWindow above the marker
    // Adjust the latitude slightly upward to position above the marker
    return {
      lat: position.lat + 0.0005, // Small offset upward
      lng: position.lng
    };
  };

  return (
    <div className="info-win">
      {/* Render visible markers */}
      {predefinedMarkers.map((position, index) => {
        // console.log("positionnn",position)
        // console.log("sdsdsd",selectedMarker)
        return (
          visibleMarkerIndices.includes(index) && (
            <div className=""
            key={index} 
            onMouseEnter={handleMarkerMouseEnter}
            onMouseLeave={handleMarkerMouseLeave}
            >
            <AdvancedMarker
  position={{
    lat: parseFloat(position.lat) || 0,
    lng: parseFloat(position.lng) || 0
  }}
  className="drop-bounce-animation cursor-pointer"
  onClick={() => handleMarkerClick(position)}
>
              <div
                className={`drop-bounce-animation transition-transform duration-300`}
                  >
                <Pin 
                  background={selectedMarker?.lat === position.lat && selectedMarker?.lng === position.lng && selectedMarker?.name === position.name  || hoveredMarker?.lat === position.lat && hoveredMarker?.lng === position.lng && hoveredMarker?.name === position.name ? "#0000FF" : "#FF0000"}
                  borderColor="#000000"
                  glyphColor="#000000"
                  glyph={(index + 1).toString()}
                  scale={selectedMarker?.lat === position.lat && selectedMarker?.lng === position.lng && selectedMarker?.name === position.name  || hoveredMarker?.lat === position.lat && hoveredMarker?.lng === position.lng && hoveredMarker?.name === position.name? 1.5 : 1}
                  />
              </div>
            </AdvancedMarker>
          </div>
        )
        )
      })}

      {/* Info Window - positioned directly above marker */}
      {infoOpen && (
        <InfoWindow 
          position={getInfoWindowPosition(infoOpen)}
          pixelOffset={[0, 130]} // Increase vertical offset to position higher above marker
          // onCloseClick={handleZoomOut}
          disableAutoPan={true} // Prevent automatic panning
          className={isDarkTheme ? "bg-gray-700" : "bg-white"}
        >
         <div 
  className="google-maps-info-window"
  onMouseEnter={handlePopupMouseEnter}
  onMouseLeave={handlePopupMouseLeave}
>
            <div style={{ position: "relative", overflow: "hidden", height: "100px", width: "300px"}}>
              
              {/* Carousel container */}
              {getCurrentImages().map((image:any, index:any) => (
                <img
                  key={`${infoOpen.placeId || infoOpen.name}-${index}`}
                  src={image}
                  alt={`${infoOpen.name || 'Location'} ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "5px 5px 0 0",
                    marginBottom: "0",
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: currentImageIndex === index ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                  }}
                  onError={(e) => {
                    // Fallback to default image if current image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = getDefaultImages()[index % getDefaultImages().length];
                  }}
                />
              ))}

              {/* Image counter
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1} / {getCurrentImages().length}
              </div> */}

{/* Enhanced Carousel Arrows */}
<div className="absolute inset-0 flex items-center justify-between px-2 z-20 pointer-events-none">
  {/* Left Arrow - Enhanced */}
  <button 
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      const images = getCurrentImages();
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      // Force maintain hover state
      isMouseOverPopupRef.current = true;
      isInfoWindowHoveredRef.current = true;
      
      // Clear any pending close timeouts
      if (popupLeaveTimeoutRef.current) {
        clearTimeout(popupLeaveTimeoutRef.current);
        popupLeaveTimeoutRef.current = null;
      }
    }}
    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:bg-black/60 hover:scale-110 pointer-events-auto"
    style={{
      opacity: isMouseOverPopupRef.current ? 0.9 : 0.4,
      backdropFilter: 'blur(2px)',
    }}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
    </svg>
  </button>

  {/* Right Arrow - Enhanced */}
  <button 
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      const images = getCurrentImages();
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      // Force maintain hover state
      isMouseOverPopupRef.current = true;
      isInfoWindowHoveredRef.current = true;
      
      // Clear any pending close timeouts
      if (popupLeaveTimeoutRef.current) {
        clearTimeout(popupLeaveTimeoutRef.current);
        popupLeaveTimeoutRef.current = null;
      }
    }}
    className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:bg-black/60 hover:scale-110 pointer-events-auto"
    style={{
      opacity: isMouseOverPopupRef.current ? 0.9 : 0.4,
      backdropFilter: 'blur(2px)',
    }}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </button>
</div>
            </div>
            
            <div style={{ padding: "8px", marginTop: "0" }}>
              <h3 style={{ 
                fontSize: "16px", 
                fontWeight: "bold", 
                margin: "3px 0",
                color: isDarkTheme ? "#ffffff" : "#333333" 
              }}>
                {infoOpen.name || "Location"}
              </h3>
              
              {/* Star Rating Component */}
              <div className="flex items-center mt-1 mb-2">
                <div className="flex mr-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = infoOpen.rating || 4.5;
                    const isFullStar = star <= Math.floor(rating);
                    const isHalfStar = !isFullStar && star === Math.ceil(rating) && rating % 1 !== 0;
                    
                    return (
                      <div key={star} className="relative">
                        {/* Background star (always gray) */}
                        <svg 
                          className={`w-4 h-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-200'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        
                        {/* Full or half star overlay */}
                        {(isFullStar || isHalfStar) && (
                          <svg 
                            className="w-4 h-4 text-yellow-400 absolute top-0 left-0"
                            fill="currentColor" 
                            viewBox="0 0 20 20" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              clipPath: isHalfStar ? 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' : 'none'
                            }}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className={`text-xs ${isDarkTheme ? 'text-gray-100' : 'text-gray-700'} ml-1`}>
                  {(infoOpen.rating || 4.5).toFixed(1)} 
                </span>
              </div>
              
              {/* Location Type/Category */}
              <div className={`text-xs ${isDarkTheme ? 'text-gray-100' : 'text-gray-600'} mb-1`}>
                {infoOpen.category || "Tourist Attraction"}
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </div>
  );
};

export default MapComponent;