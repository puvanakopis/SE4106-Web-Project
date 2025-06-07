import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';

import Dashboard from './Pages/Dashboard';
import LogIn from './Pages/LogIn';
import AddRoom from './Pages/AddRoom';
import ListRoom from './Pages/ListRoom';
import AddTransport from './Pages/AddTransport';
import ListTransport from './Pages/ListTransport';
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
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/addroom"
          element={
            <PrivateRoute>
              <AddRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/listroom"
          element={
            <PrivateRoute>
              <ListRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/addtransport"
          element={
            <PrivateRoute>
              <AddTransport />
            </PrivateRoute>
          }
        />
        <Route
          path="/listtransport"
          element={
            <PrivateRoute>
              <ListTransport />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
