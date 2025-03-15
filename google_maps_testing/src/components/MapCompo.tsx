import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";

// Google Maps API Key (Replace with your own)
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

// Hardcoded Places (With Lat/Lng)
const places = [
  {
    name: "Mansa Devi Temple",
    lat: 29.9620,
    lng: 78.1689,
    photo: "https://via.placeholder.com/200",
    rating: 4.8,
    reviews: 2300,
  },
  {
    name: "Har Ki Pauri",
    lat: 29.9479,
    lng: 78.1642,
    photo: "https://via.placeholder.com/200",
    rating: 4.9,
    reviews: 5000,
  },
  {
    name: "Chandi Devi Temple",
    lat: 29.9415,
    lng: 78.1790,
    photo: "https://via.placeholder.com/200",
    rating: 4.7,
    reviews: 1800,
  },
  {
    name: "Shantikunj Ashram",
    lat: 29.9110,
    lng: 78.1472,
    photo: "https://via.placeholder.com/200",
    rating: 4.6,
    reviews: 1200,
  },
  {
    name: "Daksheshwar Mahadev Temple",
    lat: 29.9292,
    lng: 78.1397,
    photo: "https://via.placeholder.com/200",
    rating: 4.8,
    reviews: 1500,
  },
];

// 🌍 Dark Mode Map Styling
// const darkTheme = [
//   { elementType: "geometry", stylers: [{ color: "#1D2C4D" }] },
//   { elementType: "labels.text.fill", stylers: [{ color: "#FFFFFF" }] },
//   { featureType: "water", stylers: [{ color: "#17263C" }] },
// ];

const MapComponent: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<typeof places[0] | null>(null);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "600px" }}
        center={{ lat: places[0].lat, lng: places[0].lng }}
        zoom={12}
        options={{ disableDefaultUI: false }}
      >
        {/*  Markers with Number Labels */}
        {places.map((place, index) => (
          <Marker
            key={index}
            position={{ lat: place.lat, lng: place.lng }}
            label={{
              text: `${index + 1}`,
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {/*  Route Path Between Places */}
        <Polyline
          path={places.map((place) => ({ lat: place.lat, lng: place.lng }))}
          options={{
            strokeColor: "#FF5733", // Customize Line Color
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />

        {/* Info Window on Marker Click */}
        {selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div style={{ textAlign: "center", maxWidth: "200px" }}>
              <h3>{selectedPlace.name}</h3>
              <img
                src={selectedPlace.photo}
                alt={selectedPlace.name}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <p>⭐ {selectedPlace.rating} ({selectedPlace.reviews} reviews)</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
