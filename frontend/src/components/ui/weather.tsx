import { useEffect, useState, useMemo } from "react";
import { Cloud, CloudRain, CloudSnow, Droplets, Sun, Wind, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Weather = () => {
  interface WeatherData {
    main: {
      temp: number;
      humidity: number;
      feels_like: number;
    };
    weather: {
      description: string;
      main: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    name: string;
  }  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get URL parameters to determine current itinerary
  const { itineraryNum } = useParams();
  const itineraries = useSelector((state: any) => state.itinerary.itineraries);
  // Function to get the destination city from the current itinerary using useMemo for performance
  const destinationCity = useMemo(() => {
    if (!itineraryNum || !itineraries || itineraries.length === 0) return null;
    
    const itineraryIdx = parseInt(itineraryNum) - 1; 
    const currentItinerary = itineraries[itineraryIdx];
    
    if (currentItinerary && currentItinerary.itinerary && currentItinerary.itinerary.destination) {
      const destination = currentItinerary.itinerary.destination;
      // console.log("Found destination city:", destination);
      return destination;
    }
    
    // console.log("No destination found for itinerary:", itineraryNum);
    return null;
  }, [itineraryNum, itineraries]);
  useEffect(() => {
    const fetchWeather = async () => {
      if (!destinationCity) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const apikey = import.meta.env.VITE_WEATHER_API_KEY;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${destinationCity}&appid=${apikey}&units=metric`
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Weather API error:", response.status, errorText);
          throw new Error(`Failed to fetch weather data: ${response.status}`);
        }
        
        const data = await response.json();
        // console.log("Weather data received for", destinationCity, ":", data);
        setWeather(data);
      } catch (err : any) {
        console.error("Weather fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [destinationCity]);
  // console.log("Itinerary Number:", itineraryNum);
  // console.log("Destination City:", destinationCity);

  // return for no destination city
  if (!destinationCity) {    return (
      <div className="p-4 border rounded-lg border-zinc-800 bg-black text-white text-center">
        <p className="text-blue-400">No destination found for this itinerary</p>
      </div>
    );
  }  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, icon: string) => {
    
    const conditionLower = condition.toLowerCase();
     icon = icon.toLowerCase();
    // OpenWeatherMap main conditions: Clear, Clouds, Rain, Drizzle, Thunderstorm, Snow, Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado
    switch (conditionLower) {
      case 'clear':
        return <Sun className="h-10 w-10 text-yellow-400" />;
      case 'clouds':
        return <Cloud className="h-10 w-10 text-gray-300" />;
      case 'rain':
        return <CloudRain className="h-10 w-10 text-blue-300" />;
      case 'drizzle':
        return <CloudRain className="h-10 w-10 text-blue-300" />;
      case 'thunderstorm':
        return <Zap className="h-10 w-10 text-yellow-300" />;
      case 'snow':
        return <CloudSnow className="h-10 w-10 text-blue-200" />;
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
      case 'sand':
      case 'ash':
        return <Cloud className="h-10 w-10 text-gray-400" />;
      case 'squall':
      case 'tornado':
        return <Wind className="h-10 w-10 text-gray-400" />;
      default:
        // console.log("Unknown weather condition, using default cloud:", conditionLower);
        return <Cloud className="h-10 w-10 text-gray-300" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 border rounded-lg border-zinc-800 bg-black text-white text-center animate-pulse">
        <p className="text-blue-400">Loading weather data...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 border rounded-lg border-zinc-800 bg-black text-red-400 text-center">
        <p>Unable to load weather data</p>
        <p className="text-xs mt-1 text-gray-400">{error}</p>
      </div>
    );
  }

  return (    <div className="p-4 border rounded-lg border-zinc-800 bg-black text-white overflow-hidden">
      <div className="flex justify-between items-center mb-2">        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-bold">
          {destinationCity || "Weather"} Weather
        </h2>
        <span className="text-xs text-zinc-200">Today</span>
      </div>

      {weather && (
        <div className="space-y-3">
          {/* Main temperature and condition */}          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getWeatherIcon(weather.weather[0].main, weather.weather[0].icon)}
              <div className="ml-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{Math.round(weather.main.temp)}°C</div>
                <div className="text-xs text-zinc-400 capitalize">{weather.weather[0].description}</div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <img 
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                alt={weather.weather[0].description}
                className="h-12 w-12"
              />
              <span className="text-xs text-zinc-400">Feels like {Math.round(weather.main.feels_like || weather.main.temp)}°C</span>
            </div>
          </div>
          
          {/* Weather details grid */}
          <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-zinc-800">
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-blue-400" />
              <span className="text-zinc-400">Wind</span>
              <span className="ml-auto">{weather.wind.speed} m/s</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-400" />
              <span className="text-zinc-400">Humidity</span>
              <span className="ml-auto">{weather.main.humidity}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;