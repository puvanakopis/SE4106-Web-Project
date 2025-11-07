import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Providers
import { AuthProvider, AuthContext } from "./Context/AuthContext";
import { BookingProvider } from "./Context/BookingContext";

// Public Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

// Public Pages
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/ProfileInfo";

// User Pages
import About from "./Pages/User/About";
import Accommodation from "./Pages/User/Accommodation";
import Booking from "./Pages/User/Booking";
import Contact from "./Pages/User/Contact";
import Home from "./Pages/User/Home";
import AccommodationDetails from "./Pages/User/AccommodationDetails";
import Saved from "./Pages/User/Saved";
import Transport from "./Pages/User/Transport";
import TransportDetails from "./Pages/User/TransportDetails";

// Admin Pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminOwner from "./Pages/Admin/AdminOwner";
import AdminOwnerProperties from "./Pages/Admin/AdminOwnerProperties";
import AdminRoom from "./Pages/Admin/AdminRooms";
import AdminTransport from "./Pages/Admin/AdminTransport";
import AdminNotFound from './Pages/Admin/AdminNotFound';

function AppContent() {
  const { isAdmin, isUser } = useContext(AuthContext);

  return (
    <>
      <Navbar />

      {/* Routes */}
      <Routes>
        {isUser && (
          <>
            {/* Public Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/booking" element={<Booking />} />
          </>
        )}


        {isAdmin && (
          <>
            {/* Admin Routes */}
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/owner" element={<AdminOwner />} />
            <Route path="/ownerProperties" element={<AdminOwnerProperties />} />
            <Route path="/room" element={<AdminRoom />} />
            <Route path="/transport" element={<AdminTransport />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/*" element={<AdminNotFound />} />
          </>
        )}

        <Route path="/" element={<Home />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/vehicle/:id" element={<TransportDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/room/:id" element={<AccommodationDetails />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer */}
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;