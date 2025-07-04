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
import Transport from "./Pages/Transport";
import TransportDetails from "./Pages/TransportDetails";
import Accommodation from "./Pages/Accommodation";
import RoomDetails from "./Pages/RoomDetails";
import ForgotPassword from "./Pages/ForgotPassword";
import Booking from "./Pages/Booking";
import NotFound from "./Pages/NotFound";

import { AuthProvider } from "./Context/AuthContext";
import { BookingProvider } from "./Context/BookingContext";
import ProtectedRoute from "./Context/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/transport/:id" element={<TransportDetails />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/room/:id" element={<RoomDetails />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />       
          <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
          <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;