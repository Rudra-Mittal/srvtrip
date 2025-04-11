import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
          const itineraries= localStorage.getItem("itineraries");
          console.log(itineraries)
          if(!itineraries){
            console.log("tyao")
            fetch("http://localhost:4000/api/itineraries", {
              method: "GET",
              headers: {
                "Content-Type": "application/json", 
              },
              credentials: "include",
          }).then(async (response) => {
            console.log("response")
            const data = await response.json();
            dispatch(setItineraries(data.itineraries));
            dispatch(setPlaces(data.placesData));
          }).catch((err)=>{
            console.log(err)
          })
          }
          setLoading(false);
          console.log(user)
          dispatch(loginUser(user));
      }
     });
      
    },[]);
    
    if (loading) {
        return (
        <div className='flex justify-center items-center h-screen'>
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-150"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-300"></div>
            </div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">
              Loading...
            </p>
          </div>
        </div>
      );
    }
    
    return children;
  };