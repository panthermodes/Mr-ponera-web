import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Calendar, Clock, Star, Lock, ExternalLink, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DailyFixedOdd = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDailyFixedSlips();
  }, []);

  const fetchDailyFixedSlips = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/slips/daily-fixed/');
      setSlips(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        setError('VIP access required. Please upgrade your account.');
      } else {
        setError('Failed to load Daily Fixed Odd slips. Please try again later.');
      }
      console.error('Error fetching Daily Fixed Odd slips:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOpenBookingLink = async (slipId) => {
    try {
      window.open(`/api/slips/open-link/${slipId}/`, '_blank');
    } catch (error) {
      console.error('Error opening booking link:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading Daily Fixed Odd content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-text-secondary mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchDailyFixedSlips}
            className="btn-gold mr-4"
          >
            Try Again
          </button>
          <a
            href="/payment-upload"
            className="btn-dark"
          >
            Upgrade to VIP
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* VIP Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 gold-text mr-2" />
            <h1 className="text-4xl font-bold gold-text">DAILY SURE FIXED ODD</h1>
            <Zap className="h-8 w-8 gold-text ml-2" />
          </div>
          <p className="text-text-secondary text-lg">
            Daily fixed odds with guaranteed high returns - VIP Exclusive
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 gold-gradient rounded-full text-dark-bg font-semibold">
            <Crown className="h-4 w-4 mr-2" />
            VIP Member
          </div>
        </div>

        {/* VIP Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="dark-card rounded-lg p-6 text-center">
            <div className="text-2xl font-bold gold-text">{slips.length}</div>
            <div className="text-text-secondary text-sm">Daily Fixed Slips</div>
          </div>
          <div className="dark-card rounded-lg p-6 text-center">
            <div className="text-2xl font-bold gold-text">95%</div>
            <div className="text-text-secondary text-sm">Success Rate</div>
          </div>
          <div className="dark-card rounded-lg p-6 text-center">
            <div className="text-2xl font-bold gold-text">Daily</div>
            <div className="text-text-secondary text-sm">New Slips</div>
          </div>
          <div className="dark-card rounded-lg p-6 text-center">
            <div className="text-2xl font-bold gold-text">
              {user?.vip_expiry_date ? new Date(user.vip_expiry_date).toLocaleDateString() : 'Lifetime'}
            </div>
            <div className="text-text-secondary text-sm">VIP Until</div>
          </div>
        </div>

        {/* VIP Slips Grid */}
        {slips.length === 0 ? (
          <div className="dark-card rounded-lg p-12 text-center">
            <Zap className="h-16 w-16 gold-text mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Daily Fixed Odd Slips Available</h3>
            <p className="text-text-secondary">
              Check back later for new premium betting slips.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slips.map((slip) => (
              <div key={slip.id} className="dark-card rounded-lg overflow-hidden hover:scale-105 transition-transform border-2 border-gold">
                {/* VIP Header */}
                <div className="gold-gradient p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-bg font-semibold">DAILY SURE FIXED ODD</span>
                    <Zap className="h-5 w-5 text-dark-bg" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {slip.title}
                  </h3>
                  
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    {slip.content}
                  </p>

                  {/* VIP Badge */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="inline-flex items-center px-3 py-1 gold-gradient rounded-full text-dark-bg text-sm font-semibold">
                      <Crown className="h-3 w-3 mr-1" />
                      VIP EXCLUSIVE
                    </div>
                  </div>

                  {/* Image */}
                  {slip.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={slip.image}
                        alt={slip.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Booking Code */}
                  {slip.booking_code && (
                    <div className="mb-4 bg-dark-bg rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary text-sm">Booking Code:</span>
                        <span className="text-gold font-mono font-semibold">{slip.booking_code}</span>
                      </div>
                    </div>
                  )}

                  {/* Booking Link Button */}
                  {slip.booking_link && (
                    <button
                      onClick={() => handleOpenBookingLink(slip.id)}
                      className="w-full btn-gold mb-4 flex items-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Game
                    </button>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(slip.created_at)}
                    </div>
                    <div className="flex items-center text-gold">
                      <Clock className="h-4 w-4 mr-1" />
                      Active
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional VIP Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold gold-text text-center mb-8">More VIP Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/vip-dashboard"
              className="dark-card rounded-lg p-6 hover:scale-105 transition-transform block"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Sure Draw VIP</h3>
                <Crown className="h-6 w-6 gold-text" />
              </div>
              <p className="text-text-secondary mb-4">
                Premium draw betting slips with high accuracy
              </p>
              <div className="text-gold font-semibold">Access VIP Content →</div>
            </a>

            <a
              href="/ht-draw"
              className="dark-card rounded-lg p-6 hover:scale-105 transition-transform block"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Half Time Draw VIP</h3>
                <Crown className="h-6 w-6 gold-text" />
              </div>
              <p className="text-text-secondary mb-4">
                Specialized half-time draw predictions with premium accuracy
              </p>
              <div className="text-gold font-semibold">Access VIP Content →</div>
            </a>

            <a
              href="/htft-draw"
              className="dark-card rounded-lg p-6 hover:scale-105 transition-transform block"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">HT/FT Draw VIP</h3>
                <Crown className="h-6 w-6 gold-text" />
              </div>
              <p className="text-text-secondary mb-4">
                Half-time/Full-time draw combinations for maximum returns
              </p>
              <div className="text-gold font-semibold">Access VIP Content →</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyFixedOdd;
