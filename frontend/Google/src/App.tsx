import React, { useState, useEffect } from "react";
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

const predefinedMarkers = [
  { lat: 31.0857947, lng: 77.0661085 },
  { lat: 31.1008914, lng: 77.1763562 },
  { lat: 31.1040341, lng: 77.1755249 },
  { lat: 31.1009306, lng: 77.1763075 },
  { lat: 31.1013414, lng: 77.1835041 },
  { lat: 31.1034073, lng: 77.1508082 },
];

const DirectionsRendererComponent: React.FC<{ triggerDirections: boolean }> = ({ triggerDirections }) => {
  const [directionsRenderers, setDirectionsRenderers] = useState<google.maps.DirectionsRenderer[]>([]);
  const routesLibrary = useMapsLibrary("routes");
  const map = useMap();

  useEffect(() => {
    if (!routesLibrary || !map || !triggerDirections) return;

    const newDirectionsRenderers: google.maps.DirectionsRenderer[] = [];

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

          newDirectionsRenderers.push(directionsRenderer);

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

          setDirectionsRenderers([...newDirectionsRenderers]);
        }, 500 + index * 500);
      }
    });
  }, [routesLibrary, map, triggerDirections]);

  return null;
};

const MapComponent: React.FC = () => {
  const [infoOpen, setInfoOpen] = useState<{ lat: number; lng: number } | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<{ lat: number; lng: number }[]>([]);
  const [allMarkersVisible, setAllMarkersVisible] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  useEffect(() => {
    predefinedMarkers.forEach((marker, index) => {
      setTimeout(() => {
        setVisibleMarkers((prev) => {
          const newMarkers = [...prev, marker];
          if (newMarkers.length === predefinedMarkers.length) {
            setAllMarkersVisible(true);
          }
          return newMarkers;
        });
      }, 1000 + index * 200);
    });
  }, []);

  if (!apiKey || !mapId) {
    return <div>Error: Missing Google API Key or Map ID</div>;
  }

  return (
    <APIProvider apiKey={apiKey} version="beta">
      <div className="h-screen w-full">
        <Map mapId={mapId} defaultZoom={12} defaultCenter={predefinedMarkers[0]}>
          {predefinedMarkers.map((position, index) => (
            visibleMarkers.includes(position) && (
              <AdvancedMarker
                key={index}
                position={position}
                className="drop-bounce-animation"
                onClick={() => {
                  setInfoOpen(position);
                }}
              >
                <div className="drop-bounce-animation">
                  <Pin 
                    background={"#FF0000"} 
                    borderColor={"#FFFFFF"}
                    glyphColor={"#FFFFFF"} 
                    glyph={(index + 1).toString()} 
                  />
                </div>
              </AdvancedMarker>
            )
          ))}

          {infoOpen && (
            <InfoWindow position={infoOpen} disableAutoPan={true}>
              <div className="info-window">
                <h3 className="text-lg font-bold text-gray-800">📍 Marker {predefinedMarkers.findIndex(marker => marker.lat === infoOpen.lat && marker.lng === infoOpen.lng) + 1}</h3>
                <p className="text-sm text-gray-600">🌍 Lat: {infoOpen.lat.toFixed(6)}</p>
                <p className="text-sm text-gray-600">📏 Lng: {infoOpen.lng.toFixed(6)}</p>
              </div>
            </InfoWindow>
          )}
          {allMarkersVisible && <DirectionsRendererComponent triggerDirections={allMarkersVisible} />}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapComponent;
