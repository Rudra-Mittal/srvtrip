import { APIProvider } from "@vis.gl/react-google-maps";
import MapComponent from "./Map";

function App() {
  const predefinedMarkers = [
    { lat: 31.0857947, lng: 77.0661085 },
    { lat: 31.1008914, lng: 77.1763562 },
    { lat: 31.1040341, lng: 77.1755249 },
    { lat: 31.1009306, lng: 77.1763075 },
    { lat: 31.1013414, lng: 77.1835041 },
    { lat: 31.1034073, lng: 77.1508082 },
  ];
  
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
  
  if (!apiKey) {
    return <div>Error: Missing Google API Key</div>;
  }

  return (
    <div className="flex w-full absolute inset-0">
      <div className="w-1/2">
        srv 
      </div>
      <div className="w-1/2  ">
        <APIProvider apiKey={apiKey} version="beta">
          <MapComponent />
        </APIProvider>
      </div>
    </div>
  );
}

export default App;
