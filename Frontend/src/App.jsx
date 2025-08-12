import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

// Context Providers
import { AuthProvider, AuthContext } from "./Context/AuthContext";
import { BookingProvider } from "./Context/BookingContext";
import ProtectedRoute from "./Context/ProtectedRoute";

//Public Components
import Navbar from "./Components/User/Navbar";
import Footer from "./Components/User/Footer";

//Admin Components
import AdminNavbar from "./Components/Admin/AdminNavbar";
import AdminFooter from "./Components/Admin/AdminFooter";

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
import RoomDetails from "./Pages/User/RoomDetails";
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
  const { isAdmin } = useContext(AuthContext);

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/vehicle/:id" element={<TransportDetails />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/room/:id" element={<RoomDetails />} />

        {/* User Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/saved" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Saved />
          </ProtectedRoute>
        } />
        <Route path="/booking" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Booking />
          </ProtectedRoute>
        } />


        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminNotFound />
          </ProtectedRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/owner" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOwner />
          </ProtectedRoute>
        } />
        <Route path="/admin/ownerProperties" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOwnerProperties />
          </ProtectedRoute>
        } />
        <Route path="/admin/room" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRoom />
          </ProtectedRoute>
        } />
        <Route path="/admin/transport" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminTransport />
          </ProtectedRoute>
        } />


        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {
        isAdmin ? <AdminFooter /> : <Footer />}
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