import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import { DayNumPage } from './pages/DayNumPage'
import Features from './components/Features'
import Form from './pages/FormPage'
import LandingPage from './pages/LandingPage'
import FormPage from './pages/FormPage'
import Loader from './components/loader'


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
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
