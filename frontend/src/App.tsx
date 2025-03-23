import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import { DayNumPage } from './pages/DayNumPage'
import Middle from './components/middlepage'
import Loader from './pages/loader'
import Features from './components/Features'
import LandingPage from './pages/LandingPage'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
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
