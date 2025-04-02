import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import { DayNumPage } from './pages/DayNumPage'
import Features from './components/Features'
// import Form from './pages/FormPage'
import LandingPage from './pages/LandingPage'
import FormPage from './pages/FormPage'
// import Loader from './components/loader'
import { ItineraryPage } from './pages/ItineraryPage'
// import VerifyOtpPage from './pages/VerifyOtpPage'
import { useEffect, useState } from 'react'
// import { AuthProvider } from './providers/AuthProvider.tsx'

// Simple protected route helper function that handles its own loading state
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/auth/user", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        setUser(data.userId || null);
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

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

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage/>} />
          <Route path="/features" element={<Features/>} />
          
          {/* Protected Routes */}
          <Route path="/day/:daynumber" element={
            // <ProtectedRoute>
              <DayNumPage/>
            // </ProtectedRoute>
          } />
          <Route path="/form" element={
            // <ProtectedRoute>
              <FormPage/>
            // </ProtectedRoute>
          } />
          <Route path="/itinerary" element={
            // <ProtectedRoute>
              <ItineraryPage/>
            // </ProtectedRoute>
          } />
          {/* <Route path="/verify-otp" element={<VerifyOtpPage />} />  */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App