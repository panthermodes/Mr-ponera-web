import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Star, Calendar, ExternalLink, Lock } from 'lucide-react';
import axios from 'axios';

const FreeOdds = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFreeSlips();
  }, []);

  const fetchFreeSlips = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/slips/free/');
      setSlips(response.data);
    } catch (error) {
      setError('Failed to load free odds. Please try again later.');
      console.error('Error fetching free slips:', error);
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
          <p className="mt-4 text-text-secondary">Loading free odds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchFreeSlips}
            className="btn-gold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 gold-text mr-2" />
            <h1 className="text-4xl font-bold gold-text">FREE ODDS</h1>
            <Star className="h-8 w-8 gold-text ml-2" />
          </div>
          <p className="text-text-secondary text-lg">
            Access our free draw betting slips - No payment required
          </p>
        </div>

        {/* Stats Bar */}
        <div className="dark-card rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold gold-text">{slips.length}</div>
              <div className="text-text-secondary text-sm">Total Slips</div>
            </div>
            <div>
              <div className="text-2xl font-bold gold-text">85%</div>
              <div className="text-text-secondary text-sm">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold gold-text">24/7</div>
              <div className="text-text-secondary text-sm">Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold gold-text">FREE</div>
              <div className="text-text-secondary text-sm">Cost</div>
            </div>
          </div>
        </div>

        {/* Slips Grid */}
        {slips.length === 0 ? (
          <div className="dark-card rounded-lg p-12 text-center">
            <Trophy className="h-16 w-16 gold-text mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Free Slips Available</h3>
            <p className="text-text-secondary">
              Check back later for new free betting slips, or upgrade to VIP for premium content.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slips.map((slip) => (
              <div key={slip.id} className="dark-card rounded-lg overflow-hidden hover:scale-105 transition-transform">
                {/* Header */}
                <div className="bg-gradient-to-r from-gold to-gold-dark p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-bg font-semibold">FREE ODDS</span>
                    <Star className="h-5 w-5 text-dark-bg" />
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
                  {slip.booking_link ? (
                    <button
                      onClick={() => handleOpenBookingLink(slip.id)}
                      className="w-full btn-gold mb-4 flex items-center justify-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Game
                    </button>
                  ) : slip.visibility === 'vip' && (
                    <div className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 mb-4 flex items-center justify-center text-text-secondary">
                      <Lock className="h-4 w-4 mr-2" />
                      <span className="text-sm">VIP Only</span>
                    </div>
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

        {/* Upgrade CTA */}
        <div className="mt-12 text-center">
          <div className="dark-card rounded-lg p-8">
            <h3 className="text-2xl font-bold gold-text mb-4">Want More Premium Content?</h3>
            <p className="text-text-secondary mb-6">
              Upgrade to VIP to access our premium draw slips with higher accuracy rates
            </p>
            <a
              href="/payment-upload"
              className="btn-gold text-lg px-8 py-4 inline-block"
            >
              Upgrade to VIP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeOdds;
