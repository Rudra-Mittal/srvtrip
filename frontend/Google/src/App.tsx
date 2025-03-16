import React, { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, MapMouseEvent } from "@vis.gl/react-google-maps";

const App: React.FC = () => {
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);

  const handleMapClick = (event: MapMouseEvent) => {
    const latLng = event.detail?.latLng;
    if (!latLng) return; // Ensure latLng is valid before accessing its properties

    setMarkers((prev) => [...prev, { lat: latLng.lat, lng: latLng.lng }]);
  };

  const handleMarkerDrag = (index: number, lat: number, lng: number) => {
    setMarkers((prev) =>
      prev.map((marker, i) => (i === index ? { lat, lng } : marker))
    );
  };

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  if (!apiKey || !mapId) {
    return <div>Error: Missing Google API Key or Map ID</div>;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-screen w-full">
        <Map
          mapId={mapId}
          defaultZoom={5}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
          onClick={handleMapClick}
        >
          {markers.map((marker, index) => (
            <AdvancedMarker
              key={index}
              position={marker}
              draggable
              onDragEnd={(ev) => {
                const latLng = ev.latLng;
                if (latLng) {
                  handleMarkerDrag(index, latLng.lat(), latLng.lng());
                }
              }}
            >
              <Pin background={"red"} borderColor={"black"} glyphColor={"white"} />
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default App;
