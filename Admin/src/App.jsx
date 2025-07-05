import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';

import Dashboard from './Pages/Dashboard';
import LogIn from './Pages/LogIn';
import Room from './Pages/Rooms';
import Owner from './Pages/Owner';
import AddTransport from './Pages/Transport';
import Profile from './Pages/ProfileInfo';
import ForgotPassword from "./Pages/ForgotPassword";


import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        <Route
          path="/"
          element={
            // <PrivateRoute>
              <Dashboard />
            // </PrivateRoute>
          }
        />
        <Route path="/profile"
          element={
            // <PrivateRoute>
              <Profile />
            // </PrivateRoute>
          }
        />
        <Route
          path="/room"
          element={
            // <PrivateRoute>
              <Room />
            // </PrivateRoute>
          }
        />
        <Route
          path="/owner"
          element={
             // <PrivateRoute>
              <Owner />
            // </PrivateRoute>
          }
        />
        <Route
          path="/transport"
          element={
            // <PrivateRoute>
              <AddTransport />
            // </PrivateRoute>
          }
        />

      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
