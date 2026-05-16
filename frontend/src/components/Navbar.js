import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Lock, CreditCard, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 gold-text" />
            <span className="text-xl font-bold gold-text">MR PONERA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-text-primary hover:text-gold transition-colors">
              Home
            </Link>
            <Link to="/free-odds" className="text-text-primary hover:text-gold transition-colors">
              Free Odds
            </Link>
            {isAuthenticated && user?.role === 'vip' && (
              <>
                <Link to="/vip-dashboard" className="text-text-primary hover:text-gold transition-colors">
                  VIP Dashboard
                </Link>
                <Link to="/ht-draw" className="text-text-primary hover:text-gold transition-colors">
                  HT Draw
                </Link>
                <Link to="/htft-draw" className="text-text-primary hover:text-gold transition-colors">
                  HT/FT Draw
                </Link>
                <Link to="/daily-fixed-odd" className="text-text-primary hover:text-gold transition-colors">
                  Daily Fixed Odd
                </Link>
              </>
            )}
            {isAuthenticated && user?.role !== 'admin' && (
              <Link to="/payment-upload" className="text-text-primary hover:text-gold transition-colors">
                <CreditCard className="h-5 w-5 inline mr-1" />
                Upgrade
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="text-text-primary hover:text-gold transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-text-secondary">
                  {user?.username}
                  {user?.role === 'vip' && (
                    <span className="ml-2 px-2 py-1 text-xs gold-gradient rounded-full text-dark-bg font-semibold">
                      VIP
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-text-secondary hover:text-gold transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-dark">
                  Login
                </Link>
                <Link to="/register" className="btn-gold">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-primary hover:text-gold"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-card border-t border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-text-primary hover:text-gold hover:bg-dark-border rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/free-odds"
              className="block px-3 py-2 text-text-primary hover:text-gold hover:bg-dark-border rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Free Odds
            </Link>
            {isAuthenticated && user?.role === 'vip' && (
              <>
                <Link
                  to="/vip-dashboard"
                  className="block px-3 py-2 text-text-primary hover:text-gold hover:bg-dark-border rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  VIP Dashboard
                </Link>
                <Link
                  to="/ht-draw"
                  className="block px-3 py-2 text-text-primary hover:text-gold hover:bg-dark-border rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  HT Draw
                </Link>
                <Link
                  to="/htft-draw"
                  className="block px-3 py-2 text-text-primary hover:text-gold hover:bg-dark-border rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  HT/FT Draw
                </Link>
                <Link
                  to="/daily-fixed-odd"
                  className="block px-3 py-2 text-text-primary hover:text-gold hover:bg-dark-border rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Daily Fixed Odd
                </Link>
              </>
            )}
            {isAuthenticated && user?.role !== 'admin' && (
              <Link
                to="/payment-upload"
                className="block px-3 py-2 text-text-primary hover:text-gold hover:bg-dark-border rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Upgrade to VIP
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className="block px-3 py-2 text-text-primary hover:text-gold hover:bg-dark-border rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <div className="border-t border-dark-border pt-4">
                <div className="px-3 py-2 text-text-secondary">
                  {user?.username}
                  {user?.role === 'vip' && (
                    <span className="ml-2 px-2 py-1 text-xs gold-gradient rounded-full text-dark-bg font-semibold">
                      VIP
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-text-secondary hover:text-gold hover:bg-dark-border rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-dark-border pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 btn-dark text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 btn-gold text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
