import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home"
import Footer from './Components/Footer/Footer';
import LogIn from './Pages/LogIn';
import SignUp from './Pages/SignUp';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App