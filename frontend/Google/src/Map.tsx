import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import "./index.css";

// Predefined marker locations with names
const predefinedMarkers = [
  { lat: 31.0857947, lng: 77.0661085, name: "Shimla" },
  { lat: 31.1008914, lng: 77.1763562, name: "The Ridge" },
  { lat: 31.1040341, lng: 77.1755249, name: "Mall Road" },
  { lat: 31.1009306, lng: 77.1763075, name: "Christ Church" },
  { lat: 31.1013414, lng: 77.1835041, name: "Jakhu Temple" },
  { lat: 31.1034073, lng: 77.1508082, name: "Viceregal Lodge" },
];

// Component to render directions between markers
const DirectionsRenderer = ({ triggerDirections }: { triggerDirections: boolean }) => {
  const routesLibrary = useMapsLibrary("routes");
  const map = useMap();
  console.log("map",map)
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
const MapComponent = () => {
  const [infoOpen, setInfoOpen] = useState(null);
  const [allMarkersVisible, setAllMarkersVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  
  const defaultZoom = 12;
  const defaultCenter = predefinedMarkers[0];
  
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
  
  // Show error if API key or Map ID is missing
  if (!apiKey || !mapId) {
    return <div>Error: Missing Google API Key or Map ID</div>;
  }

  return (
    <div className="h-screen w-full">
      {/* Map Container - now takes full width */}
      <div className="w-full h-1/2">
        <APIProvider apiKey={apiKey} version="beta">
          <Map
            mapId={mapId}
            // defaultZoom={defaultZoom}
            defaultCenter={defaultCenter}
            mapTypeControl={false}
            disableDefaultUI={false}
            zoomControl={true}
            scrollwheel={true}
            gestureHandling={"cooperative"}
            style={{ width: '100%', height: '100%' }}
          >
            <MarkerManager 
              setAllMarkersVisible={setAllMarkersVisible} 
              setInfoOpen={setInfoOpen}
              infoOpen={infoOpen}
              selectedMarker={selectedMarker}
              setSelectedMarker={setSelectedMarker}
              hoveredMarker={hoveredMarker}
            />
            {allMarkersVisible && <DirectionsRenderer triggerDirections={true} />}
          </Map>
        </APIProvider>
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
  hoveredMarker
}: {
  setAllMarkersVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoOpen: React.Dispatch<React.SetStateAction<any>>;
  infoOpen: any;
  selectedMarker: any;
  setSelectedMarker: React.Dispatch<React.SetStateAction<any>>;
  hoveredMarker: any;
}) => {
  const [visibleMarkers, setVisibleMarkers] = useState<{ lat: number; lng: number; name?: string }[]>([]);
  const map = useMap();
  const animationFrameRef = useRef<number | null>(null);
  const mouseTrackingTimeoutRef = useRef<number | null>(null);
  const zoomOutTimeoutRef = useRef(null);
  const isTrackingMouseRef = useRef(false);
  const isMouseOverPopupRef = useRef(false);
  const isMouseOverMarkerRef = useRef(false);
  const defaultZoom = 12;
  // const defaultCenter = predefinedMarkers[0];
  const clickZoom = 14;
  const zoomDuration = 300; // ms for zoom animation
  const mouseTrackingDelay = 1500; // 1.5 sec delay before tracking mouse position
  const currentZoomRef = useRef(defaultZoom);
  
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
    predefinedMarkers.forEach((marker, index) => {
      setTimeout(() => {
        setVisibleMarkers(prev => {
          const newMarkers = [...prev, marker];
          if (newMarkers.length === predefinedMarkers.length) {
            setAllMarkersVisible(true);
          }
          return newMarkers;
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
    const trackMouseMovement = (e: any) => {
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
  interface AnimateZoomParams {
    start: number;
    end: number;
    position: google.maps.LatLngLiteral;
    duration: number;
  }
  
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
      setSelectedMarker(position);
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
  };

  // Handle popup mouse leave
  const handlePopupMouseLeave = () => {
    isMouseOverPopupRef.current = false;
    // If we've passed the 1.5 second delay, start tracking mouse
    // This ensures we don't zoom out immediately, but wait for actual mouse movement
    if (mouseTrackingTimeoutRef.current === null) { // Timer has completed
      isTrackingMouseRef.current = true;
    }
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
      {predefinedMarkers.map((position, index) => 
        visibleMarkers.includes(position) && (
          <div  className=""
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
                className={`drop-bounce-animation transition-transform duration-300 ${
                  selectedMarker === position || hoveredMarker === position ? "scale-124" : "scale-100"
                }`}
              >
                <Pin 
                  background={selectedMarker === position || hoveredMarker === position ? "#0000FF" : "#FF0000"}
                  borderColor="#FFFFFF"
                  glyphColor="#FFFFFF"
                  glyph={(index + 1).toString()}
                  scale={selectedMarker === position || hoveredMarker === position ? 1.5 : 1}
                />
              </div>
            </AdvancedMarker>
          </div>
        )
      )}

      {/* Info Window - positioned directly above marker */}
      {infoOpen && (
        <InfoWindow 
          position={getInfoWindowPosition(infoOpen)}
          pixelOffset={[0, 160]} // Increase vertical offset to position higher above marker
          onCloseClick={handleZoomOut}
          disableAutoPan={true} // Prevent automatic panning
          className=""
        >
          <div 
            className="custom-infowindow"
            onMouseEnter={handlePopupMouseEnter}
            onMouseLeave={handlePopupMouseLeave}
          >
            <img
              src="./pexels-pixabay-533769.jpg"
              alt="Location"
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "5px 5px 0 0",
                marginBottom: "0"
              }}
            />
            <div style={{ padding: "8px", marginTop: "0" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "3px 0" }}>
                {infoOpen.name || "Location"}
              </h3>
              <p style={{ fontSize: "14px", color: "#333", margin: "3px 0" }}>
                🌍 Lat: {infoOpen.lat.toFixed(6)}
              </p>
              <p style={{ fontSize: "14px", color: "#333", margin: "3px 0" }}>
                📏 Lng: {infoOpen.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </InfoWindow>
      )}
    </div>
  );
};

export default MapComponent;