import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

// Public Components
import Navbar from "./Components/User/Navbar";
import Footer from "./Components/User/Footer";


// Admin Components
import AdminNavbar from "./Components//Admin/AdminNavbar";
import AdminFooter from "./Components/Admin/AdminFooter"


// Public Pages
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/ProfileInfo";


// User Pages
import Home from "./Pages/User/Home";
import Saved from "./Pages/User/Saved";
import About from "./Pages/User/About";
import Contact from "./Pages/User/Contact";
import Transport from "./Pages/User/Transport";
import TransportDetails from "./Pages/User/TransportDetails";
import Accommodation from "./Pages/User/Accommodation";
import RoomDetails from "./Pages/User/RoomDetails";
import Booking from "./Pages/User/Booking";


// Admin Pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminOwner from "./Pages/Admin/AdminOwner";
import AdminOwnerProperties from "./Pages/Admin/AdminOwnerProperties";
import AdminRoom from "./Pages/Admin/AdminRooms";
import AdminTransport from "./Pages/Admin/AdminTransport";


// Context Providers
import { AuthProvider } from "./Context/AuthContext";
import { BookingProvider } from "./Context/BookingContext";
import ProtectedRoute from "./Components/Common/ProtectedRoute";
import AdminRoute from "./Components/Common/AdminRoute";

function AppContent() {
  const { isAdmin } = useAuth();

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <Navbar />}

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



        {/* User Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user']}>
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



        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/owner" element={
          <AdminRoute>
            <AdminOwner />
          </AdminRoute>
        } />
        <Route path="/admin/ownerProperties" element={
          <AdminRoute>
            <AdminOwnerProperties />
          </AdminRoute>
        } />
        <Route path="/admin/room" element={
          <AdminRoute>
            <AdminRoom />
          </AdminRoute>
        } />
        <Route path="/admin/transport" element={
          <AdminRoute>
            <AdminTransport />
          </AdminRoute>
        } />
        <Route path="/admin/profile" element={
          <AdminRoute>
            <Profile />
          </AdminRoute>
        } />


        {/* Redirects */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdmin && <Footer />}
      {isAdmin && <AdminFooter />}
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