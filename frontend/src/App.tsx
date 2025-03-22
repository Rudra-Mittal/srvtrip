import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import Middle from './components/middlepage'
import { Globe } from './ui/globe'
import { GlobeDemo } from './components/globeDemo'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage/>} />
          <Route path="/middle" element= {<Middle/>}/>
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
