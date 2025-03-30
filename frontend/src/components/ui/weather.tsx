import { useEffect, useState } from "react";
import { Cloud, CloudRain, Droplets, Sun, Wind } from "lucide-react";

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

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=0b4553d9fc262fa90a1baf7e2ef43e75&units=metric`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-10 w-10 text-yellow-400" />;
      case 'clouds':
        return <Cloud className="h-10 w-10 text-gray-300" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-10 w-10 text-blue-300" />;
      default:
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
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg border-zinc-800 bg-black text-white overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-bold">Paris Weather</h2>
        <span className="text-xs text-zinc-200">Today</span>
      </div>

      {weather && (
        <div className="space-y-3">
          {/* Main temperature and condition */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getWeatherIcon(weather.weather[0].main)}
              <div className="ml-3">
                <div className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</div>
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