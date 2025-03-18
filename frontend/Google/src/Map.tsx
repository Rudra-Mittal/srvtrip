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

// Predefined marker locations
const predefinedMarkers = [
  { lat: 31.0857947, lng: 77.0661085 },
  { lat: 31.1008914, lng: 77.1763562 },
  { lat: 31.1040341, lng: 77.1755249 },
  { lat: 31.1009306, lng: 77.1763075 },
  { lat: 31.1013414, lng: 77.1835041 },
  { lat: 31.1034073, lng: 77.1508082 },
];

// Component to render directions between markers
const DirectionsRenderer = ({ triggerDirections }) => {
  const routesLibrary = useMapsLibrary("routes");
  const map = useMap();

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
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [allMarkersVisible, setAllMarkersVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  
  const defaultZoom = 12;
  const defaultCenter = predefinedMarkers[0];
  
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
  
  // Show error if API key or Map ID is missing
  if (!apiKey || !mapId) {
    return <div>Error: Missing Google API Key or Map ID</div>;
  }

  return (
    <APIProvider apiKey={apiKey} version="beta">
      <div className="h-screen w-[100vw]">
        <Map
          mapId={mapId}
          defaultZoom={defaultZoom}
          defaultCenter={defaultCenter}
          mapTypeControl={false}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            scrollwheel: true,
            gestureHandling: "cooperative"
          }}
        >
          <MarkerManager 
            setAllMarkersVisible={setAllMarkersVisible} 
            setInfoOpen={setInfoOpen}
            infoOpen={infoOpen}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          />
          {allMarkersVisible && <DirectionsRenderer triggerDirections={true} />}
        </Map>
      </div>
    </APIProvider>
  );
};

// Component to manage markers and their animations
const MarkerManager = ({ 
  setAllMarkersVisible, 
  setInfoOpen, 
  infoOpen, 
  selectedMarker, 
  setSelectedMarker,
}) => {
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const map = useMap();
  const animationFrameRef = useRef(null);
  const mouseTrackingTimeoutRef = useRef(null);
  const zoomOutTimeoutRef = useRef(null);
  const isTrackingMouseRef = useRef(false);
  const isMouseOverPopupRef = useRef(false);
  const isMouseOverMarkerRef = useRef(false);
  
  const defaultZoom = 12;
  const clickZoom = 14;
  const zoomDuration = 300; // ms for zoom animation
  const mouseTrackingDelay = 2000; // ms before starting to track mouse position
  const currentZoomRef = useRef(defaultZoom);
  
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
    const trackMouseMovement = (e) => {
      if (isTrackingMouseRef.current) {
        // If not over marker or popup, trigger zoom out
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
      const listener = map.addListener("click", (e) => {
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
  const animateZoom = (start, end, position, duration) => {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smoother animation
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
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

  // Start mouse tracking after delay
  const startMouseTracking = () => {
    // Clear any existing timeout
    if (mouseTrackingTimeoutRef.current) {
      clearTimeout(mouseTrackingTimeoutRef.current);
    }
    
    // Set timeout to start tracking mouse after delay
    mouseTrackingTimeoutRef.current = setTimeout(() => {
      isTrackingMouseRef.current = true;
    }, mouseTrackingDelay);
  };

  // Handle marker click
  const handleMarkerClick = (position) => {
    if (selectedMarker === position) {
      // If already selected, deselect it
      handleZoomOut();
    } else {
      // Cancel any existing tracking
      if (mouseTrackingTimeoutRef.current) {
        clearTimeout(mouseTrackingTimeoutRef.current);
      }
      if (zoomOutTimeoutRef.current) {
        clearTimeout(zoomOutTimeoutRef.current);
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
      
      // Start tracking mouse after delay
      startMouseTracking();
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
  };

  // Handle marker mouse leave
  const handleMarkerMouseLeave = () => {
    isMouseOverMarkerRef.current = false;
  };

  // Handle popup mouse enter
  const handlePopupMouseEnter = () => {
    isMouseOverPopupRef.current = true;
  };

  // Handle popup mouse leave
  const handlePopupMouseLeave = () => {
    isMouseOverPopupRef.current = false;
    
    // Small delay to allow for mouse movement between popup and marker
    setTimeout(() => {
      if (!isMouseOverMarkerRef.current && isTrackingMouseRef.current) {
        handleZoomOut();
      }
    }, 1600);
  };

  return (
    <>
      {/* Render visible markers */}
      {predefinedMarkers.map((position, index) => 
        visibleMarkers.includes(position) && (
          <div 
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
                  selectedMarker === position ? "scale-125" : "scale-100"
                }`}
              >
                <Pin 
                  background={selectedMarker === position ? "#0000FF" : "#FF0000"}
                  borderColor="#FFFFFF"
                  glyphColor="#FFFFFF"
                  glyph={(index + 1).toString()}
                  scale={selectedMarker === position ? 1.2 : 1}
                />
              </div>
            </AdvancedMarker>
          </div>
        )
      )}

      {/* Info Window - positioned directly above marker */}
      {infoOpen && (
        <InfoWindow 
          position={infoOpen} 
          pixelOffset={[0, -5]} // Minimal offset for close positioning
          onCloseClick={handleZoomOut}
          options={{
            disableAutoPan: true, // Prevent automatic panning
          }}
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
    </>
  );
};

export default MapComponent;