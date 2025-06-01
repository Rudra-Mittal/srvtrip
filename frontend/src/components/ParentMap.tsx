import { APIProvider } from "@vis.gl/react-google-maps";
import { useEffect, useState, useMemo, useCallback } from "react";
import MapComponent from "./Map";
import { useSelector } from "react-redux";
import React from "react";

interface Marker {
  lat: number;
  lng: number;
  name: string;
  placeId: string;
  photos?: string[];
  rating?: number;
  category?: string;
}

function ParentMap({ dayNum, itineraryNum }: { dayNum: string, itineraryNum: string }) {
  const activePlaceId = useSelector((state: any) => state.place.activePlaceId);
  const placesData = useSelector((state: any) => state.place.places);
  
  const currentDay = useMemo(() => dayNum ? parseInt(dayNum) - 1 : 0, [dayNum]);
  const itineraryId = useMemo(() => itineraryNum ? parseInt(itineraryNum) - 1 : 0, [itineraryNum]);
  
  const [predefinedMarkers, setPredefinedMarkers] = useState<Marker[]>([]);
  const [hoveredMarker, setHoveredMarker] = useState<Marker | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [infoOpen, setInfoOpen] = useState<boolean | null>(null);

  // Memoize markers calculation with stable reference
  const markers = useMemo(() => {
    if (!placesData || !placesData[itineraryId] || !placesData[itineraryId][currentDay]) {
      return [];
    }

    const newMarkers: Marker[] = [];
    const dayPlaces = placesData[itineraryId][currentDay];
    
    if (Array.isArray(dayPlaces)) {
      dayPlaces.forEach((place) => {
        if (place && place.location && place.displayName) {
          newMarkers.push({
            lat: place.location.latitude,
            lng: place.location.longitude,
            name: place.displayName,
            placeId: place.id,
            photos: place.photos || [],
            rating: place.rating,
            category: place.types?.[0] || "Tourist Attraction",
          });
        }
      });
    }
    return newMarkers;
  }, [placesData, itineraryId, currentDay]);

  // Update markers only when the actual data changes (not when activePlaceId changes)
  useEffect(() => {
    // Use a more sophisticated comparison to prevent unnecessary updates
    const markersChanged = markers.length !== predefinedMarkers.length || 
                          markers.some((marker, index) => 
                            !predefinedMarkers[index] || 
                            marker.placeId !== predefinedMarkers[index].placeId ||
                            marker.lat !== predefinedMarkers[index].lat ||
                            marker.lng !== predefinedMarkers[index].lng
                          );
    
    if (markersChanged) {
      setPredefinedMarkers(markers);
    }
  }, [markers]); // Remove predefinedMarkers from dependency to prevent circular updates

  // Optimize active place effect - only update selection, not markers
  useEffect(() => {
    if (activePlaceId && predefinedMarkers.length > 0) {
      const activeMarker = predefinedMarkers.find(marker => marker.placeId === activePlaceId);
      if (activeMarker) {
        // Only update if it's actually different
        if (!selectedMarker || selectedMarker.placeId !== activeMarker.placeId) {
          setSelectedMarker(activeMarker);
          setInfoOpen(activeMarker);
        }
      }
    }
  }, [activePlaceId, predefinedMarkers]); // Remove selectedMarker from dependency

  const closeInfoWindow = useCallback(() => {
    setSelectedMarker(null);
    setInfoOpen(null);
    setHoveredMarker(null);
  }, []);

  // Optimize outside click handler
  useEffect(() => {
    if (!selectedMarker) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickedOnPlaceButton = target.closest('[data-place-id]') !== null;
      const clickedOnMap = target.closest('.info-win') !== null;
      const clickedOnInfoWindow = target.closest('.google-maps-info-window') !== null || 
                                  target.closest('.gm-style-iw') !== null;
      
      if (!clickedOnPlaceButton && !clickedOnMap && !clickedOnInfoWindow) {
        closeInfoWindow();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [selectedMarker, closeInfoWindow]);

  // Auto-close timer with proper cleanup
  useEffect(() => {
    if (!selectedMarker || !infoOpen) return;

    const timer = setTimeout(() => {
      closeInfoWindow();
    }, 5000);

    return () => clearTimeout(timer);
  }, [selectedMarker, infoOpen, closeInfoWindow]);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    return <div>Error: Missing Google API Key</div>;
  }

  // Optimize map props with more stable references
  const mapProps = useMemo(() => ({
    predefinedMarkers,
    hoveredMarker,
    selectedMarker,
    setSelectedMarker,
    infoOpen,
    setInfoOpen,
  }), [predefinedMarkers, hoveredMarker, selectedMarker, infoOpen]);

  return (
    <div className="flex w-full absolute inset-0">
      <div className="w-full h-[35rem]">
        <APIProvider apiKey={apiKey} version="beta">
          <MemoizedMapComponent {...mapProps} />
        </APIProvider>
      </div>
    </div>
  );
}

// Enhance MemoizedMapComponent comparison
const MemoizedMapComponent = React.memo(MapComponent, (prevProps, nextProps) => {
  // More sophisticated comparison
  const markersEqual = prevProps.predefinedMarkers.length === nextProps.predefinedMarkers.length &&
                      prevProps.predefinedMarkers.every((marker, index) => {
                        const nextMarker = nextProps.predefinedMarkers[index];
                        return nextMarker && 
                               marker.placeId === nextMarker.placeId &&
                               marker.lat === nextMarker.lat &&
                               marker.lng === nextMarker.lng;
                      });
  
  return (
    markersEqual &&
    prevProps.hoveredMarker === nextProps.hoveredMarker &&
    prevProps.selectedMarker === nextProps.selectedMarker &&
    prevProps.infoOpen === nextProps.infoOpen
  );
});

export default React.memo(ParentMap);