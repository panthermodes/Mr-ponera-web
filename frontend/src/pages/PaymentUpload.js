import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Upload, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const PaymentUpload = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    transaction_id: '',
    phone_number: '',
    network: 'mpesa',
    membership_type: 'vip',
    amount: '40000',
    screenshot: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const networks = [
    { value: 'mpesa', label: 'M-Pesa', color: 'text-green-500' },
    { value: 'tigo', label: 'Tigo Pesa', color: 'text-blue-500' },
    { value: 'airtel', label: 'Airtel Money', color: 'text-red-500' },
    { value: 'halopesa', label: 'HaloPesa', color: 'text-purple-500' },
  ];

  const membershipTypes = [
    { value: 'vip', label: 'Sure Draw VIP', price: 40000, description: 'Premium draw betting slips with high accuracy' },
    { value: 'ht', label: 'Half Time Draw VIP', price: 25000, description: 'Specialized half-time draw predictions' },
    { value: 'htft', label: 'HT/FT Draw VIP', price: 60000, description: 'Half-time/Full-time draw combinations' },
    { value: 'daily_fixed', label: 'Daily Sure Fixed Odd', price: 20000, description: 'Daily fixed odds with guaranteed high returns' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-update amount when membership type changes
      if (name === 'membership_type') {
        const selectedMembership = membershipTypes.find(m => m.value === value);
        if (selectedMembership) {
          updated.amount = selectedMembership.price.toString();
        }
      }
      return updated;
    });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        screenshot: file
      }));
      setPreviewImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('transaction_id', formData.transaction_id);
    data.append('phone_number', formData.phone_number);
    data.append('network', formData.network);
    data.append('membership_type', formData.membership_type);
    data.append('amount', formData.amount);
    data.append('screenshot', formData.screenshot);

    try {
      const response = await axios.post('/api/payments/upload/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setFormData({
        transaction_id: '',
        phone_number: '',
        network: 'mpesa',
        membership_type: 'vip',
        amount: '40000',
        screenshot: null,
      });
      setPreviewImage(null);
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (errorData.transaction_id) {
          setError('Transaction ID already exists');
        } else if (errorData.screenshot) {
          setError(errorData.screenshot[0]);
        } else {
          setError('Payment upload failed. Please check your details and try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="dark-card rounded-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-4">Payment Submitted!</h2>
            <p className="text-text-secondary mb-6">
              Your payment proof has been submitted successfully. Our admin team will review it within 24 hours.
            </p>
            <p className="text-text-secondary mb-6">
              You will receive VIP access once your payment is approved.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="btn-gold w-full"
            >
              Submit Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CreditCard className="h-12 w-12 gold-text mx-auto mb-4" />
          <h1 className="text-3xl font-bold gold-text mb-2">Upgrade to VIP</h1>
          <p className="text-text-secondary">
            Submit your payment proof to unlock premium content
          </p>
        </div>

        {/* M-Pesa Payment Numbers */}
        <div className="dark-card rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold gold-text mb-4">M-Pesa Payment Numbers</h3>
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-semibold">0757691729</p>
                  <p className="text-text-secondary text-sm">joseph joshua</p>
                </div>
                <Smartphone className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-semibold">0790820849</p>
                  <p className="text-text-secondary text-sm">Nicholas mwakikato</p>
                </div>
                <Smartphone className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
          <p className="text-text-secondary text-sm mt-4 text-center">
            Send the selected amount to either number above and upload the payment screenshot
          </p>
        </div>

        {/* Pricing Info */}
        <div className="dark-card rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold gold-text mb-4">VIP Membership Options</h3>
          <div className="space-y-4">
            {membershipTypes.map((membership) => (
              <div
                key={membership.value}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.membership_type === membership.value
                    ? 'border-gold bg-gold/10'
                    : 'border-dark-border hover:border-gold/50'
                }`}
                onClick={() => handleChange({ target: { name: 'membership_type', value: membership.value } })}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-text-primary">{membership.label}</h4>
                  <span className="text-xl font-bold gold-text">TSh {membership.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-text-secondary">{membership.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-dark-border">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Selected Price:</span>
              <span className="text-2xl font-bold gold-text">TSh {parseInt(formData.amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="dark-card rounded-lg p-8">
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Network Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Select Payment Network
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {networks.map((network) => (
                  <label
                    key={network.value}
                    className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.network === network.value
                        ? 'border-gold bg-gold/10'
                        : 'border-dark-border hover:border-gold/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="network"
                      value={network.value}
                      checked={formData.network === network.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Smartphone className={`h-6 w-6 ${network.color} mr-2`} />
                    <span className="text-sm font-medium">{network.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transaction ID */}
            <div>
              <label htmlFor="transaction_id" className="block text-sm font-medium text-text-primary mb-2">
                Transaction ID
              </label>
              <input
                type="text"
                id="transaction_id"
                name="transaction_id"
                value={formData.transaction_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter transaction ID"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-text-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-text-primary mb-2">
                Amount (TSh)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="40000"
                min="1"
                required
                readOnly
              />
              <p className="text-xs text-text-secondary mt-1">Amount auto-filled based on selected membership type</p>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Payment Screenshot
              </label>
              <div className="border-2 border-dashed border-dark-border rounded-lg p-6 text-center hover:border-gold transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="screenshot"
                />
                <label htmlFor="screenshot" className="cursor-pointer">
                  {previewImage ? (
                    <div>
                      <img
                        src={previewImage}
                        alt="Payment screenshot"
                        className="mx-auto h-48 object-contain mb-4"
                      />
                      <p className="text-sm text-text-secondary">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                      <p className="text-text-primary mb-2">
                        Click to upload payment screenshot
                      </p>
                      <p className="text-sm text-text-secondary">
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.screenshot}
              className="w-full btn-gold text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Payment Proof'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentUpload;
