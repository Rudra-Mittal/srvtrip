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
import HistoryPage from './pages/historyPage'
import { Navbar } from "@/components/Navbar"
import { AuthRoute } from './components/ProtectedRoutes/AuthRoute'
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      {/* Toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.5)',
          },
        }}
      />
      
      <BrowserRouter>
        <AuthRoute>
          <Navbar />
        </AuthRoute>
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage/>} />
          <Route path="/features" element={<Features/>} />
          
          {/* Protected Routes */}
          <Route path="itinerary/:itineraryNum/day/:dayNum" element={
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
              <HistoryPage/>
             </ProtectedRoute>
          } />
          <Route path='/itinerary/:itineraryNum' element={
            <ProtectedRoute>
              <ItineraryPage/>
            </ProtectedRoute>
          } >
          </Route>
        <Route path='*' element={<div>No page exists</div>}>

        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App