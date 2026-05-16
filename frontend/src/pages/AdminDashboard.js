import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Users, CreditCard, Settings, Plus, Edit, Trash2, CheckCircle, XCircle, Eye, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [slips, setSlips] = useState([]);
  const [payments, setPayments] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSlip, setShowCreateSlip] = useState(false);
  const [showCreateSocialLink, setShowCreateSocialLink] = useState(false);
  const [editingSlip, setEditingSlip] = useState(null);
  const [editingSocialLink, setEditingSocialLink] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'free',
    description: '',
    image: null,
    is_active: true,
  });
  const [socialLinkForm, setSocialLinkForm] = useState({
    platform: '',
    url: '',
    is_active: true,
  });

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'slips') fetchSlips();
    if (activeTab === 'payments') fetchPayments();
    if (activeTab === 'social') fetchSocialLinks();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const [paymentStats] = await Promise.all([
        axios.get('/api/payments/stats/'),
      ]);
      setStats(paymentStats.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // This would need to be implemented in the backend
      console.log('Fetching users...');
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchSlips = async () => {
    try {
      const response = await axios.get('/api/slips/all/');
      setSlips(response.data);
    } catch (error) {
      console.error('Error fetching slips:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments/pending/');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get('/api/auth/social-links/');
      setSocialLinks(response.data);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const handleCreateSocialLink = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/social-links/', socialLinkForm);
      setShowCreateSocialLink(false);
      setSocialLinkForm({ platform: '', url: '', is_active: true });
      fetchSocialLinks();
    } catch (error) {
      console.error('Error creating social link:', error);
    }
  };

  const handleUpdateSocialLink = async (id) => {
    try {
      await axios.put(`/api/auth/social-links/${id}/`, socialLinkForm);
      setEditingSocialLink(null);
      setSocialLinkForm({ platform: '', url: '', is_active: true });
      fetchSocialLinks();
    } catch (error) {
      console.error('Error updating social link:', error);
    }
  };

  const handleDeleteSocialLink = async (id) => {
    try {
      await axios.delete(`/api/auth/social-links/${id}/`);
      fetchSocialLinks();
    } catch (error) {
      console.error('Error deleting social link:', error);
    }
  };

  const handleCreateSlip = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('is_active', formData.is_active);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await axios.post('/api/slips/create/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowCreateSlip(false);
      setFormData({
        title: '',
        category: 'free',
        description: '',
        image: null,
        is_active: true,
      });
      fetchSlips();
    } catch (error) {
      console.error('Error creating slip:', error);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      await axios.post(`/api/payments/approve/${paymentId}/`);
      fetchPayments();
      fetchStats();
    } catch (error) {
      console.error('Error approving payment:', error);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    try {
      await axios.post(`/api/payments/reject/${paymentId}/`);
      fetchPayments();
      fetchStats();
    } catch (error) {
      console.error('Error rejecting payment:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gold-text mb-2">Admin Dashboard</h1>
          <p className="text-text-secondary">Manage MR PONERA platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-dark-border">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'slips', label: 'Slips', icon: Trophy },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'social', label: 'Social Links', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gold text-gold'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="dark-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-gold" />
                <span className="text-2xl font-bold text-text-primary">--</span>
              </div>
              <h3 className="text-text-secondary">Total Users</h3>
            </div>
            <div className="dark-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="h-8 w-8 text-gold" />
                <span className="text-2xl font-bold text-text-primary">{slips.length}</span>
              </div>
              <h3 className="text-text-secondary">Total Slips</h3>
            </div>
            <div className="dark-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="h-8 w-8 text-gold" />
                <span className="text-2xl font-bold text-text-primary">{stats.pending_payments || 0}</span>
              </div>
              <h3 className="text-text-secondary">Pending Payments</h3>
            </div>
            <div className="dark-card rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-gold" />
                <span className="text-2xl font-bold text-text-primary">
                  TSh {stats.total_revenue || 0}
                </span>
              </div>
              <h3 className="text-text-secondary">Total Revenue</h3>
            </div>
          </div>
        )}

        {/* Slips Tab */}
        {activeTab === 'slips' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Manage Slips</h2>
              <button
                onClick={() => setShowCreateSlip(true)}
                className="btn-gold flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Slip
              </button>
            </div>

            {showCreateSlip && (
              <div className="dark-card rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-4">Create New Slip</h3>
                <form onSubmit={handleCreateSlip} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="free">FREE ODDS</option>
                      <option value="vip">SURE DRAW VIP</option>
                      <option value="ht">HALF TIME DRAW VIP</option>
                      <option value="htft">HT/FT DRAW VIP</option>
                      <option value="daily_fixed">DAILY SURE FIXED ODD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                      rows="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button type="submit" className="btn-gold">Create Slip</button>
                    <button
                      type="button"
                      onClick={() => setShowCreateSlip(false)}
                      className="btn-dark"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {slips.map((slip) => (
                <div key={slip.id} className="dark-card rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{slip.title}</h3>
                      <p className="text-text-secondary text-sm">{slip.category} • {formatDate(slip.created_at)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Pending Payments</h2>
            <div className="grid gap-4">
              {payments.map((payment) => (
                <div key={payment.id} className="dark-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{payment.user_email}</h3>
                      <p className="text-text-secondary">{payment.network} • TSh {payment.amount}</p>
                      <p className="text-text-secondary text-sm">Transaction ID: {payment.transaction_id}</p>
                      {payment.membership_type_display && (
                        <p className="text-gold text-sm">{payment.membership_type_display}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprovePayment(payment.id)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <CheckCircle className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleRejectPayment(payment.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <XCircle className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  {payment.screenshot && (
                    <div className="mt-4">
                      <img
                        src={payment.screenshot}
                        alt="Payment screenshot"
                        className="h-32 object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Manage Social Links</h2>
              <button
                onClick={() => setShowCreateSocialLink(true)}
                className="btn-gold flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Social Link
              </button>
            </div>

            {(showCreateSocialLink || editingSocialLink) && (
              <div className="dark-card rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  {editingSocialLink ? 'Edit Social Link' : 'Add New Social Link'}
                </h3>
                <form onSubmit={editingSocialLink ? (e) => { e.preventDefault(); handleUpdateSocialLink(editingSocialLink.id); } : handleCreateSocialLink} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Platform</label>
                    <input
                      type="text"
                      value={socialLinkForm.platform}
                      onChange={(e) => setSocialLinkForm({...socialLinkForm, platform: e.target.value})}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="e.g., Telegram, WhatsApp"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">URL</label>
                    <input
                      type="url"
                      value={socialLinkForm.url}
                      onChange={(e) => setSocialLinkForm({...socialLinkForm, url: e.target.value})}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={socialLinkForm.is_active}
                      onChange={(e) => setSocialLinkForm({...socialLinkForm, is_active: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="is_active" className="text-sm text-text-primary">Active</label>
                  </div>
                  <div className="flex space-x-4">
                    <button type="submit" className="btn-gold">
                      {editingSocialLink ? 'Update' : 'Add'} Social Link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateSocialLink(false);
                        setEditingSocialLink(null);
                        setSocialLinkForm({ platform: '', url: '', is_active: true });
                      }}
                      className="btn-dark"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {socialLinks.map((link) => (
                <div key={link.id} className="dark-card rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{link.platform}</h3>
                      <p className="text-text-secondary text-sm">{link.url}</p>
                      <span className={`text-xs px-2 py-1 rounded ${link.is_active ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {link.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingSocialLink(link);
                          setSocialLinkForm({ platform: link.platform, url: link.url, is_active: link.is_active });
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSocialLink(link.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
