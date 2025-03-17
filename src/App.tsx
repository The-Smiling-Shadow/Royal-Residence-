import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Hotels } from './pages/Hotels';
import { HotelDetails } from './pages/HotelDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { Auth } from './pages/Auth';
import { Booking } from './pages/Booking';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/booking/:roomId" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App