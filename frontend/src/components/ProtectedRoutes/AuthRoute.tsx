import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { auth } from "@/api/auth";
// import {useNavigate} from "react-router-dom";


// Simple protected route helper function that handles its own loading state
export const AuthRoute = ({ children }: { children: React.ReactNode }) => {

    // const navigate=useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
     auth().then((user)=>{
      if(!user.error){
        dispatch(loginUser(user));
      }
     });
      
    },[]);
    
    // if (loading) {
    //     return (
    //     <div className='flex justify-center items-center h-screen'>
    //       <div className="flex flex-col items-center">
    //         <div className="flex space-x-2 mb-4">
    //           <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
    //           <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-150"></div>
    //           <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-300"></div>
    //         </div>
    //         <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">
    //           Loading...
    //         </p>
    //       </div>
    //     </div>
    //   );
    // }
    
    return children;
  };