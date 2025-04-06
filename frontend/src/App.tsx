import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import { DayNumPage } from './pages/DayNumPage'
import Features from './components/Features'
import LandingPage from './pages/LandingPage'
import FormPage from './pages/FormPage'
import { ItineraryPage } from './pages/ItineraryPage'
import { ProtectedRoute } from './components/ProtectedRoutes/ProtectedRoute'


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
            <ProtectedRoute>
              <DayNumPage/>
             </ProtectedRoute>
          } />
          <Route path="/form" element={
            <ProtectedRoute>
              <FormPage/>
             </ProtectedRoute>
          } />
          <Route path="/itinerary" element={
             <ProtectedRoute>
              <ItineraryPage/>
             </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App