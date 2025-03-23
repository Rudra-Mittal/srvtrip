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

// Component to render directions between markers
const DirectionsRenderer = ({predefinedMarkers,triggerDirections }: { predefinedMarkers: any[],triggerDirections: boolean }) => {
  const routesLibrary = useMapsLibrary("routes");
  const map = useMap();
  // console.log("map",map)
  useEffect(() => {
    if (!routesLibrary || !map || !triggerDirections) return;

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

          directionsService.route(
            {
              origin: predefinedMarkers[index],
              destination: predefinedMarkers[index + 1],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === google.maps.DirectionsStatus.OK && response) {
                directionsRenderer.setDirections(response);
              } else {
                console.error("Directions request failed due to " + status);
              }
            }
          );
        }, 500 * (index + 1));
      }
    });
  }, [routesLibrary, map, triggerDirections]);
  
  return null;
};
// Main Map Component
const MapComponent = ({ 
  predefinedMarkers,
  hoveredMarker,
  selectedMarker,
  setSelectedMarker,
  infoOpen,
  setInfoOpen
}: { 
  predefinedMarkers: { lat: number; lng: number; name?: string }[];
  hoveredMarker: { lat: number; lng: number; name?: string } | null;
  selectedMarker: { lat: number; lng: number; name?: string } | null;
  setSelectedMarker: any
  infoOpen: boolean | null;
  setInfoOpen: any;
}) => {
  
  const [allMarkersVisible, setAllMarkersVisible] = useState(false);
  
  const defaultCenter = predefinedMarkers[0];
  const defaultZoom = 12;
  
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
  
  return (
    <div className="h-full w-full">
      <div className="w-full h-full">
        <Map
          mapId={mapId}
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
          />
          {allMarkersVisible && <DirectionsRenderer predefinedMarkers={predefinedMarkers} triggerDirections={true} />}
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
  predefinedMarkers
}: {
  setAllMarkersVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoOpen: React.Dispatch<React.SetStateAction<any>>;
  infoOpen: any;
  selectedMarker: any;
  setSelectedMarker: any;
  hoveredMarker: any;
  predefinedMarkers: any[];
}) => {
  console.log("selected",selectedMarker)
  const [visibleMarkerIndices, setVisibleMarkerIndices] = useState<number[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInfoWindowHovered, setIsInfoWindowHovered] = useState(false);
  const map = useMap();
  const animationFrameRef = useRef<number | null>(null);
  const mouseTrackingTimeoutRef = useRef<number | null>(null);
  const zoomOutTimeoutRef = useRef(null);
  const isTrackingMouseRef = useRef(false);
  const isMouseOverPopupRef = useRef(false);
  const isMouseOverMarkerRef = useRef(false);
  const defaultZoom = 12;
  const clickZoom = 14;
  const zoomDuration = 300; // ms for zoom animation
  const mouseTrackingDelay = 1500; // 1.5 sec delay before tracking mouse position
  const currentZoomRef = useRef(defaultZoom);
  
  // Images for carousel
  const carouselImages = [
  "michael-fousert-3G1e6AxFcMA-unsplash.jpg"
    // Add more images as needed
  ];
  
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
    } else if (!hoveredMarker && !selectedMarker && map) {
      // Zoom out if no marker is hovered or selected
      animateZoom(currentZoomRef.current, defaultZoom, predefinedMarkers[0], zoomDuration);
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
    console.log("ssss",selectedMarker)
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
      console.log("selectedMarker",selectedMarker)
      setSelectedMarker(position);
      console.log("selectedMarkersdsdr",selectedMarker)
      console.log("position",position)
      setInfoOpen(position);
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
    // Smoothly zoom out to default view
    if (map) {
      animateZoom(currentZoomRef.current, defaultZoom, predefinedMarkers[0], zoomDuration);
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
  const handlePopupMouseEnter = () => {
    isMouseOverPopupRef.current = true;
    isTrackingMouseRef.current = false; // Stop tracking when mouse enters popup
    setIsInfoWindowHovered(true);
  };

  // Handle popup mouse leave
  const handlePopupMouseLeave = () => {
    isMouseOverPopupRef.current = false;
    setIsInfoWindowHovered(false);
    // If we've passed the 1.5 second delay, start tracking mouse
    // This ensures we don't zoom out immediately, but wait for actual mouse movement
    if (mouseTrackingTimeoutRef.current === null) { // Timer has completed
      isTrackingMouseRef.current = true;
    }
  };

  // Handle next image in carousel
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  // Handle previous image in carousel
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
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
        console.log("positionnn",position)
        console.log("sdsdsd",selectedMarker)
        return (
          visibleMarkerIndices.includes(index) && (
            <div className=""
            key={index} 
            onMouseEnter={handleMarkerMouseEnter}
            onMouseLeave={handleMarkerMouseLeave}
            >
            <AdvancedMarker
              position={position}
              className="drop-bounce-animation cursor-pointer"
              onClick={() => handleMarkerClick(position)}
              >
              <div
                className={`drop-bounce-animation transition-transform duration-300`}
                  >
                <Pin 
                  background={selectedMarker?.lat === position.lat && selectedMarker?.lng === position.lng && selectedMarker?.name === position.name  || hoveredMarker?.lat === position.lat && hoveredMarker?.lng === position.lng && hoveredMarker?.name === position.name ? "#0000FF" : "#FF0000"}
                  borderColor="#FFFFFF"
                  glyphColor="#FFFFFF"
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
     {/* Info Window - positioned directly above marker */}
{infoOpen && (
  <InfoWindow 
    position={getInfoWindowPosition(infoOpen)}
    pixelOffset={[0, 100]} // Increase vertical offset to position higher above marker
    onCloseClick={handleZoomOut}
    disableAutoPan={true} // Prevent automatic panning
    className=""
  >
    <div 
      className="custom-infowindow"
      onMouseEnter={handlePopupMouseEnter}
      onMouseLeave={handlePopupMouseLeave}
    >
      <div style={{ position: "relative" ,  overflow: "hidden" , height: "100px"}}>
        {/* Carousel container */}
        {carouselImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Location ${index + 1}`}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "5px 5px 0 0",
              marginBottom: "0",
              position: 'absolute', // Make images absolute positioned
              top: 0,
              left: 0,
              opacity: currentImageIndex === index ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          />
        ))}
        
        {/* Left arrow */}
        <div
          onClick={handlePrevImage}
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            opacity: isInfoWindowHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            zIndex: 10
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>←</span>
        </div>
        
        {/* Right arrow */}
        <div
          onClick={handleNextImage}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            opacity: isInfoWindowHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            zIndex: 10
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>→</span>
        </div>
      </div>
      
      <div style={{ padding: "8px", marginTop: "0" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "3px 0" }}>
          {infoOpen.name || "Location"}
        </h3>
        
        {/* Star Rating Component */}
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
            className="w-4 h-4 text-gray-300"
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
  <span className="text-xs text-gray-600 ml-1">
    {(infoOpen.rating || 4.5).toFixed(1)} 
  </span>
</div>
        
        {/* Location Type/Category */}
        <div className="text-xs text-gray-500 mb-1">
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