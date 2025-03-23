import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";
import MapComponent from "./Map";

function ParentMap() {
  // Predefined markers with names
  const predefinedMarkers = [
    { lat: 48.858093, lng: 2.294694, name: "Eiffel Tower" },
    { lat: 48.854179, lng: 2.332503, name: "Café de Flore" },
    { lat: 48.8606,   lng: 2.3376, name: "Louvre Museum" },
    { lat: 48.8566, lng:  2.3522, name: "Seine River" },
  ];
  
  const [hoveredMarker, setHoveredMarker] = useState<Marker | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [infoOpen, setInfoOpen] = useState<boolean  | null>(null);
  const apiKey = "AIzaSyBZbm53yrsueed4OWNR4hv_ZCg6aUrzoP0";
 
  
  if (!apiKey) {
    return <div>Error: Missing Google API Key</div>;
  }

  // Handle hover on text listing
  interface Marker {
    lat: number;
    lng: number;
    name: string;
  }

  const handleListingHover = (marker: any): void => {
    setHoveredMarker(marker);
    setInfoOpen(marker);
  };

  // Handle click on text listing
  const handleListingClick = (marker : Marker): void => {
    setSelectedMarker(marker === selectedMarker ? null : marker);
  };

  // Handle mouse leave from text listing
  const handleListingLeave = () => {
    setHoveredMarker(null);
    setInfoOpen(null);
  };

  return (
    <div className="flex w-full absolute inset-0">
      {/* Left side - Listings */}
      <div className="w-1/2 p-6 overflow-y-auto bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Places in Shimla</h2>
        <div className="space-y-4">
          {predefinedMarkers.map((marker, index) => (
            <div 
              key={index}
              className={`
                p-4 rounded-lg cursor-pointer transition-all duration-300
                ${(hoveredMarker === marker || selectedMarker === marker) ? 
                  'bg-blue-100 shadow-md transform scale-105' : 
                  'bg-white shadow hover:shadow-md'
                }
              `}
              onMouseEnter={() => handleListingHover(marker)}
              onMouseLeave={handleListingLeave}
              onClick={() => handleListingClick(marker)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold mr-3">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{marker.name}</h3>
                  <p className="text-sm text-gray-500">
                    {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right side - Map */}
      <div className="w-1/2 h-1/2">
        <APIProvider apiKey={apiKey} version="beta">
          <MapComponent 
            predefinedMarkers={predefinedMarkers}
            hoveredMarker={hoveredMarker}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            infoOpen={infoOpen}
            setInfoOpen={setInfoOpen}
          />
        </APIProvider>
      </div>
    </div>
  );
}

export default ParentMap;