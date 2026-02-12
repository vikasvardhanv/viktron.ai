import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Globe, Shield, CreditCard } from 'lucide-react';

interface PricingPageProps {
  platformName: string;
  agentCount: number;
  onSelectPlan?: (plan: string, price: number) => void;
  onBack?: () => void;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  badge?: string;
  badgeColor?: string;
  description: string;
  features: string[];
  revenueShare: number;
  agentLimit: number;
  highlighted?: boolean;
}

const PRICING_PLANS: Plan[] = [
  {
    id: 'light',
    name: 'Light',
    price: 19,
    period: 'month',
    badge: 'PERFECT START',
    badgeColor: 'from-cyan-500 to-emerald-500',
    description: 'Get started with AI automation',
    features: ['1 custom agent', '20% revenue share', 'Basic analytics', 'Email support'],
    revenueShare: 20,
    agentLimit: 1,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    period: 'month',
    badge: 'MOST POPULAR',
    badgeColor: 'from-emerald-500 to-teal-500',
    description: 'Perfect for growing businesses',
    features: ['20 custom agents', '50% revenue share', 'Advanced analytics', 'Priority support'],
    revenueShare: 50,
    agentLimit: 20,
    highlighted: true,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 199,
    period: 'month',
    badge: 'BEST VALUE',
    badgeColor: 'from-blue-500 to-cyan-500',
    description: 'For scaling operations',
    features: ['100 custom agents', 'Custom domains', '60% revenue share', 'Dedicated support'],
    revenueShare: 60,
    agentLimit: 100,
  },
  {
    id: 'business',
    name: 'Business',
    price: 899,
    period: 'month',
    badge: 'HIGHEST ROI',
    badgeColor: 'from-orange-500 to-red-500',
    description: 'Enterprise scale automation',
    features: ['Unlimited agents', 'White-label platform', '80% revenue share', '24/7 dedicated support'],
    revenueShare: 80,
    agentLimit: 999,
  },
];

export const PricingPage: React.FC<PricingPageProps> = ({
  platformName,
  agentCount,
  onSelectPlan,
  onBack,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('starter');
  const [paymentStep, setPaymentStep] = useState<'plan-selection' | 'payment'>('plan-selection');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    fullName: '',
    email: '',
    country: 'United States',
  });

  const currentPlan = PRICING_PLANS.find((p) => p.id === selectedPlan);
  const potentialEarnings = agentCount * 1000; // Simplified calculation

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleProceedToPayment = () => {
    setPaymentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPlan) {
      onSelectPlan?.(currentPlan.name, currentPlan.price);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-emerald-950/50 to-cyan-950/50 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Choose Your Plan</h1>
            <p className="text-gray-400 text-sm mt-1">Select the plan that matches your business goals</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {paymentStep === 'plan-selection' ? (
            <motion.div
              key="plans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Toggle - Monthly/Yearly */}
              <div className="flex justify-center items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" defaultChecked className="w-4 h-4" />
                  <span className="text-sm font-medium">Monthly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Yearly <span className="text-emerald-400 ml-1">(Save up to 61%)</span>
                  </span>
                </label>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {PRICING_PLANS.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`relative p-6 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedPlan === plan.id
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-950/40 to-cyan-950/40'
                        : 'border-gray-700 bg-gray-900/50 hover:border-emerald-500/50'
                    } ${plan.highlighted ? 'md:ring-2 md:ring-emerald-500/50 md:scale-105' : ''}`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${plan.badgeColor}`}>
                        {plan.badge}
                      </div>
                    )}

                    {/* Checkmark */}
                    {selectedPlan === plan.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Plan Details */}
                    <div className="mt-4 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                      </div>

                      <div>
                        <div className="text-3xl font-bold text-white">
                          ${plan.price}
                          <span className="text-sm text-gray-400 font-normal ml-2">/month</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 border-t border-gray-700 pt-4">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Revenue Share */}
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <p className="text-xs text-emerald-300 font-semibold">REVENUE SHARE</p>
                        <p className="text-lg font-bold text-emerald-300 mt-1">{plan.revenueShare}%</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-950/30 border border-blue-800/50 rounded-lg flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-300">
                    All plans include unlimited AI usage, custom branding and 14-day money-back guarantee.
                  </p>
                </div>
              </div>

              {/* Earnings Calculator */}
              <div className="p-6 bg-gradient-to-br from-emerald-950/30 to-cyan-950/30 border border-emerald-800/50 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-300">📈 See Your Potential Earnings</h3>
                    <p className="text-sm text-gray-400 mt-1">Estimate your earnings at different pricing tiers</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Price per seat:</label>
                    <div className="flex items-center gap-2">
                      <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm">
                        <option>$35/mo</option>
                        <option>$50/mo</option>
                        <option>$100/mo</option>
                      </select>
                      <p className="text-sm text-gray-400">Estimate your earnings at different pricing tiers</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Number of Customers</label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      defaultValue="10"
                      className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1</span>
                      <span>50</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToPayment}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all"
              >
                Continue to Payment
              </motion.button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>256-bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>Stripe Powered</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-purple-500" />
                  <span>GDPR Ready</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Payment Form */
            <motion.div
              key="payment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Payment Form */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Secure Payment Information</h2>
                    <p className="text-gray-400 text-sm">Enterprise-grade security powered by Stripe.</p>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Coupon Code */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Coupon code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Please enter a coupon code"
                          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                        <button type="button" className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-all">
                          Apply Coupon
                        </button>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Card number</label>
                      <input
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Expiry and CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Expiration date</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Security code</label>
                        <input
                          type="text"
                          placeholder="CVC"
                          value={formData.cvc}
                          onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Full name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Country or region</label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all"
                    >
                      Start Building my platform
                    </motion.button>
                  </form>

                  {/* Guarantee */}
                  <div className="p-4 bg-yellow-950/30 border border-yellow-800/50 rounded-lg flex items-start gap-3">
                    <span className="text-xl">🛡️</span>
                    <p className="text-sm text-yellow-300">
                      Protected by our 14-day money-back guarantee.
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 h-fit sticky top-24">
                  <h3 className="text-lg font-bold mb-4">Order Summary</h3>

                  <div className="space-y-3 border-b border-gray-700 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{currentPlan?.name} Plan</span>
                      <span className="font-bold">${currentPlan?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{agentCount} Agents</span>
                      <span className="font-bold text-emerald-400">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Total</span>
                    <span className="text-emerald-400">${currentPlan?.price}</span>
                  </div>

                  {/* Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>PCI Compliant Secure</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      <span>Stripe Powered Trusted</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <span>GDPR Ready Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
