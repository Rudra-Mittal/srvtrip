import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import { DayNumPage } from './pages/DayNumPage'
import Features from './components/Features'
// import Form from './pages/FormPage'
import LandingPage from './pages/LandingPage'
import FormPage from './pages/FormPage'
// import Loader from './components/loader'
import { ItineraryPage } from './pages/ItineraryPage'
import VerifyOtpPage from './pages/VerifyOtpPage'
// import { AuthProvider } from './providers/AuthProvider.tsx'

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} /> 
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage/>} />
            <Route path="/day/:daynumber" element={<DayNumPage/>} />
            <Route path="/features" element={<Features/>} />
            <Route path="/form" element={<FormPage/>} />
            <Route path="/itinerary" element={<ItineraryPage/>}/>
            <Route path="/verify-otp" element={<VerifyOtpPage />} /> 
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App