import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import { DayNumPage } from './pages/DayNumPage'
import Middle from './components/middlepage'
import { Globe } from './components/ui/globe'
import { GlobeDemo } from './components/globeDemo'
import Loader from './components/Loader'
import Features from './components/Features'
// import Features2 from './components/Features2'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loader />} /> 
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage/>} />
          <Route path="/day/:daynumber" element={<DayNumPage/>} />
          <Route path="/middle" element= {<Middle/>}/>
          <Route path="/loader" element={<Loader/>} />
          <Route path="/features" element={<Features/>} />
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
