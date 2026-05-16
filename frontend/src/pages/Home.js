import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Lock, Star, TrendingUp, Shield, Crown } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Trophy className="h-16 w-16 gold-text mx-auto mb-4" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gold-text">MR PONERA</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8">
              Premium Draw Betting Slips Platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/free-odds" className="btn-gold text-lg px-8 py-4">
                View Free Odds
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn-dark text-lg px-8 py-4">
                  Join Now
                </Link>
              )}
              {isAuthenticated && user?.role !== 'vip' && (
                <Link to="/payment-upload" className="btn-dark text-lg px-8 py-4">
                  <Crown className="inline mr-2 h-5 w-5" />
                  Upgrade to VIP
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gold-text">
            Our Premium Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Free Odds */}
            <div className="dark-card rounded-lg p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-dark-bg" />
              </div>
              <h3 className="text-xl font-semibold mb-2 gold-text">FREE ODDS</h3>
              <p className="text-text-secondary mb-4">
                Access free draw betting slips with no payment required
              </p>
              <Link to="/free-odds" className="btn-dark w-full">
                View Slips
              </Link>
            </div>

            {/* VIP Sure Draw */}
            <div className="dark-card rounded-lg p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-dark-bg" />
              </div>
              <h3 className="text-xl font-semibold mb-2 gold-text">SURE DRAW VIP</h3>
              <p className="text-text-secondary mb-2">
                Premium draw slips with high accuracy
              </p>
              <p className="text-gold font-bold mb-4">TSh 40,000/month</p>
              {isAuthenticated && user?.role === 'vip' ? (
                <Link to="/vip-dashboard" className="btn-gold w-full">
                  Access VIP
                </Link>
              ) : (
                <Link to="/payment-upload" className="btn-dark w-full">
                  Upgrade to VIP
                </Link>
              )}
            </div>

            {/* Half Time Draw */}
            <div className="dark-card rounded-lg p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-dark-bg" />
              </div>
              <h3 className="text-xl font-semibold mb-2 gold-text">HALF TIME DRAW VIP</h3>
              <p className="text-text-secondary mb-2">
                Specialized half-time draw predictions
              </p>
              <p className="text-gold font-bold mb-4">TSh 25,000/month</p>
              {isAuthenticated && user?.role === 'vip' ? (
                <Link to="/ht-draw" className="btn-gold w-full">
                  Access VIP
                </Link>
              ) : (
                <Link to="/payment-upload" className="btn-dark w-full">
                  Upgrade to VIP
                </Link>
              )}
            </div>

            {/* HT/FT Draw */}
            <div className="dark-card rounded-lg p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-dark-bg" />
              </div>
              <h3 className="text-xl font-semibold mb-2 gold-text">HT/FT DRAW VIP</h3>
              <p className="text-text-secondary mb-2">
                Half-time/Full-time draw combinations
              </p>
              <p className="text-gold font-bold mb-4">TSh 60,000/month</p>
              {isAuthenticated && user?.role === 'vip' ? (
                <Link to="/htft-draw" className="btn-gold w-full">
                  Access VIP
                </Link>
              ) : (
                <Link to="/payment-upload" className="btn-dark w-full">
                  Upgrade to VIP
                </Link>
              )}
            </div>
          </div>

          {/* Daily Sure Fixed Odd */}
          <div className="mt-8">
            <div className="dark-card rounded-lg p-6 text-center hover:scale-105 transition-transform max-w-md mx-auto border-2 border-gold">
              <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-dark-bg" />
              </div>
              <h3 className="text-xl font-semibold mb-2 gold-text">DAILY SURE FIXED ODD</h3>
              <p className="text-text-secondary mb-2">
                Daily fixed odds with guaranteed high returns
              </p>
              <p className="text-gold font-bold mb-4">TSh 20,000/month</p>
              {isAuthenticated && user?.role === 'vip' ? (
                <Link to="/daily-fixed-odd" className="btn-gold w-full">
                  Access VIP
                </Link>
              ) : (
                <Link to="/payment-upload" className="btn-dark w-full">
                  Upgrade to VIP
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-dark-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 gold-text">About MR PONERA</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-8">
            MR PONERA is your trusted platform for draw betting slips. We specialize in providing 
            high-quality draw predictions across different categories. Our free odds give you a taste 
            of our expertise, while our VIP categories offer premium insights for serious bettors.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold gold-text mb-2">1000+</div>
              <div className="text-text-secondary">Successful Slips</div>
            </div>
            <div>
              <div className="text-3xl font-bold gold-text mb-2">500+</div>
              <div className="text-text-secondary">VIP Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold gold-text mb-2">85%</div>
              <div className="text-text-secondary">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 gold-text">Ready to Start Winning?</h2>
          <p className="text-text-secondary text-lg mb-8">
            Join thousands of successful bettors who trust MR PONERA for their draw betting needs.
          </p>
          {!isAuthenticated ? (
            <Link to="/register" className="btn-gold text-lg px-8 py-4">
              Get Started Now
            </Link>
          ) : user?.role !== 'vip' ? (
            <Link to="/payment-upload" className="btn-gold text-lg px-8 py-4">
              <Crown className="inline mr-2 h-5 w-5" />
              Upgrade to VIP Today
            </Link>
          ) : (
            <Link to="/vip-dashboard" className="btn-gold text-lg px-8 py-4">
              Access VIP Dashboard
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
