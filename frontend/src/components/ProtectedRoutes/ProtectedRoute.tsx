import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { auth } from "@/api/auth";
import {useNavigate} from "react-router-dom";
import { setItineraries } from "@/store/slices/itinerarySlice";
import { setPlaces } from "@/store/slices/placeSlice";


// Simple protected route helper function that handles its own loading state
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
     auth().then((user)=>{
      if(user.error){
        setLoading(true);
        navigate("/signin", { replace: true });
      }
      else{
          // const itineraries= localStorage.getItem("itineraries");
          // console.log(itineraries)
          const itineraries= useSelector((state: any)=>state.itinerary.itineraries); // Initialize as null or an empty array if needed
          if(!itineraries){
            // console.log("tyao")
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/itineraries`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json", 
              },
              credentials: "include",
          }).then(async (response) => {
            // console.log("response")
            const data = await response.json();
            dispatch(setItineraries(data.itineraries));
            dispatch(setPlaces(data.placesData));
          }).catch((err)=>{
            console.log(err)
          })
          }
          setLoading(false);
          // console.log(user)
          dispatch(loginUser(user));
      }
     });
      
    },[]);
    
    if (loading) {
        return (
          <div className='flex justify-center items-center h-screen bg-gradient-to-br from-black to-gray-900/95'>
            <div className="flex flex-col items-center relative">
              {/* Ambient glow background */}
              <div className="absolute -inset-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              
              {/* Circular futuristic loader */}
              <div className="relative w-16 h-16 mb-8">
                {/* Outer spinning ring */}
                <div className="absolute inset-0 rounded-full border-2 border-t-blue-400 border-r-indigo-400 border-b-purple-500 border-l-lavender-400 animate-spin" style={{animationDuration: '2s'}}></div>
                
                {/* Inner spinning ring - opposite direction */}
                <div className="absolute inset-2 rounded-full border-2 border-t-lavender-400 border-r-purple-500 border-b-indigo-400 border-l-blue-400 animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
                
                {/* Center glow */}
                <div className="absolute inset-0 m-auto w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-md"></div>
                <div className="absolute inset-0 m-auto w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Text with gradient */}
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold text-xl mb-4">
                Loading...
              </p>
              
              {/* Three dots in blue, dark blue, and lavender */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-400 animate-bounce shadow-md shadow-blue-400/50" style={{animationDuration: '0.6s'}}></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce shadow-md shadow-blue-700/50" style={{animationDuration: '0.6s', animationDelay: '0.2s'}}></div>
                <div className="w-4 h-4 rounded-full bg-purple-400 animate-bounce shadow-md shadow-purple-400/50" style={{animationDuration: '0.6s', animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        );
    }

    return children;
  };