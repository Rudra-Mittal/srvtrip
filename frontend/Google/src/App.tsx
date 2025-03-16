import React, { useState } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow , Pin } from "@vis.gl/react-google-maps";

const MapComponent: React.FC = () => {
  const [infoOpen, setInfoOpen] = useState<number | null>(null);

  const predefinedMarkers = [
    { lat: -33.8688, lng: 151.2093 }, // Sydney
    { lat: 40.712776, lng: -74.005974 }, // New York
  ];

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  if (!apiKey || !mapId) {
    return <div>Error: Missing Google API Key or Map ID</div>;
  }

  return (
    <APIProvider apiKey={apiKey} version="beta">
      <div className="h-screen w-full">
        <Map
          mapId={mapId}
          defaultZoom={5}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        >
          {predefinedMarkers.map((position, index) => (
            <AdvancedMarker
              key={index}
              position={position}
              onClick={() => setInfoOpen(index)}
            >
              {/* Custom marker content */}
              <Pin background={"#FF0000"} borderColor={"#FFFFFF"} glyphColor={"#000000"} />
            </AdvancedMarker>
          ))}

          {infoOpen !== null && (
            <InfoWindow
              position={predefinedMarkers[infoOpen]}
              onCloseClick={() => setInfoOpen(null)}
            >
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