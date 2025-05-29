import './App.css'
import { Routes, Route } from "react-router-dom";

import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer';

import Dashboard from "./Pages/Dashboard"
import LogIn from './Pages/LogIn';
import AddRoom from './Pages/AddRoom';
import ListRoom from './Pages/ListRoom';
import AddTransport from './Pages/AddTransport';
import ListTransport from './Pages/ListTransport';
import Profile from './Pages/ProfileInfo';

import { AuthProvider } from './Context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addroom" element={<AddRoom />} />
        <Route path="/listroom" element={<ListRoom />} />
        <Route path="/addtransport" element={<AddTransport />} />
        <Route path="/listtransport" element={<ListTransport />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App