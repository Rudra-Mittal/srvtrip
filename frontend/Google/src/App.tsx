import React, { useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, MapMouseEvent } from "@vis.gl/react-google-maps";

const App: React.FC = () => {
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);

  const handleMapClick = (event: MapMouseEvent) => {
    if (!event.detail.latLng) return;
    setMarkers((prev) => [...prev, { lat: event.detail.latLng.lat, lng: event.detail.latLng.lng }]);
  };

  const handleMarkerDrag = (index: number, lat: number, lng: number) => {
    setMarkers((prev) =>
      prev.map((marker, i) => (i === index ? { lat, lng } : marker))
    );
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <div className="h-screen w-full">
        <Map
          mapId={import.meta.env.VITE_GOOGLE_MAP_ID}  // ✅ Add Map ID here
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
                if (ev.detail.latLng) {
                  handleMarkerDrag(index, ev.detail.latLng.lat, ev.detail.latLng.lng);
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
