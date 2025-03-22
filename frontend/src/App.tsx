import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import { DayNumPage } from './pages/DayNumPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage/>} />
          <Route path="/day/:daynumber" element={<DayNumPage/>} />
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
