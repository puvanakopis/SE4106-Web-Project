import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home"
import Footer from './Components/Footer/Footer';

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
      <Route path="/" element={<Home />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App