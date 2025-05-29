import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import Home from "./Pages/Home";
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import Profile from "./Pages/ProfileInfo";
import Saved from "./Pages/Saved";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Accommodation from "./Pages/Accommodation";
import RoomDetails from "./Pages/RoomDetails";

import { AuthProvider } from "./Context/AuthContext";


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/room/:id" element={<RoomDetails />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
