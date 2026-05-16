import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FreeOdds from './pages/FreeOdds';
import VIPDashboard from './pages/VIPDashboard';
import HTDraw from './pages/HTDraw';
import HTFTDraw from './pages/HTFTDraw';
import DailyFixedOdd from './pages/DailyFixedOdd';
import PaymentUpload from './pages/PaymentUpload';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg text-text-primary">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/free-odds" element={<FreeOdds />} />
              <Route 
                path="/vip-dashboard" 
                element={
                  <ProtectedRoute requiredTier="vip">
                    <VIPDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ht-draw" 
                element={
                  <ProtectedRoute requiredTier="ht">
                    <HTDraw />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/htft-draw"
                element={
                  <ProtectedRoute requiredTier="htft">
                    <HTFTDraw />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/daily-fixed-odd"
                element={
                  <ProtectedRoute requiredTier="daily_fixed">
                    <DailyFixedOdd />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-upload"
                element={
                  <ProtectedRoute>
                    <PaymentUpload />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
