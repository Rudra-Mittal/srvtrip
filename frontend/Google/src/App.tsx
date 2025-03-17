import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";
import "./index.css"; // Ensure animation styles are included

const MapComponent: React.FC = () => {
  const [infoOpen, setInfoOpen] = useState<number | null>(null);
  const [visibleMarkers, setVisibleMarkers] = useState<{ lat: number; lng: number }[]>([]);

  const predefinedMarkers = [
    { lat: 28.6139, lng: 77.2090 }, // India Gate
    { lat: 28.5245, lng: 77.1855 }, // Qutub Minar
    { lat: 28.6562, lng: 77.2410 }, // Red Fort
    { lat: 28.5535, lng: 77.2588 }, // Lotus Temple
    { lat: 28.5921, lng: 77.0460 }, // Akshardham Temple
  ];

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  // Sequentially show markers with delay
  useEffect(() => {
    predefinedMarkers.forEach((marker, index) => {
      setTimeout(() => {
        setVisibleMarkers((prev) => [...prev, marker]);
      }, 2000 + index * 500); // First marker at 2s, then each after 500ms
    });
  }, []);

  if (!apiKey || !mapId) {
    return <div>Error: Missing Google API Key or Map ID</div>;
  }

  return (
    <APIProvider apiKey={apiKey} version="beta">
      <div className="h-screen w-full">
        <Map mapId={mapId} defaultZoom={10} defaultCenter={{ lat: 28.6139, lng: 77.2090 }}>
          {visibleMarkers.map((position, index) => (
            <AdvancedMarker key={index} position={position} onClick={() => setInfoOpen(index)} className="drop-bounce-animation">
              <div className="drop-bounce-animation">
                <Pin background={"#FF0000"} borderColor={"#FFFFFF"} glyphColor={"#000000"} />
              </div>
            </AdvancedMarker>
          ))}

          {infoOpen !== null && (
            <InfoWindow position={predefinedMarkers[infoOpen]} onCloseClick={() => setInfoOpen(null)}>
              <div>
                <h3>Advanced Marker</h3>
                <p>Latitude: {predefinedMarkers[infoOpen].lat}</p>
                <p>Longitude: {predefinedMarkers[infoOpen].lng}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapComponent;
