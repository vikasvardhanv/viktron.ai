import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Mic, MessageSquare, AlertCircle } from 'lucide-react';

interface WhiteLabelBuilderProps {
  config: {
    domain: string;
    voiceAgent: string;
    chatAgent: string;
  };
  onConfigChange: (updates: Partial<WhiteLabelBuilderProps['config']>) => void;
}

// Voice agents available
const VOICE_AGENTS = [
  { id: 'restaurant', name: 'Restaurant Assistant', icon: '🍽️', description: 'For restaurants and food businesses' },
  { id: 'clinic', name: 'Clinic Assistant', icon: '🏥', description: 'For healthcare and medical practices' },
  { id: 'salon', name: 'Salon Assistant', icon: '✨', description: 'For salons and beauty services' },
  { id: 'realEstate', name: 'Real Estate Assistant', icon: '🏠', description: 'For real estate and property services' },
  { id: 'construction', name: 'Construction Assistant', icon: '🏗️', description: 'For construction and contracting' },
  { id: 'dealership', name: 'Dealership Assistant', icon: '🚗', description: 'For automotive dealerships' },
  { id: 'legal', name: 'Legal Assistant', icon: '⚖️', description: 'For law firms and legal services' },
  { id: 'education', name: 'Education Assistant', icon: '📚', description: 'For educational institutions' },
  { id: 'ecommerce', name: 'E-commerce Assistant', icon: '🛍️', description: 'For online retail businesses' },
  { id: 'recruitment', name: 'Recruitment Assistant', icon: '👔', description: 'For hiring and recruitment' },
  { id: 'generic', name: 'Generic AI Agent', icon: '🤖', description: 'For general purpose use' },
];

// Chat agents available
const CHAT_AGENTS = [
  { id: 'customer_support', name: 'Customer Support', icon: '💬', description: 'Handle customer inquiries and support' },
  { id: 'appointment_scheduling', name: 'Appointment Scheduling', icon: '📅', description: 'Schedule and manage appointments' },
  { id: 'lead_generation', name: 'Lead Generation', icon: '🎯', description: 'Qualify leads and collect information' },
  { id: 'product_info', name: 'Product Information', icon: '📦', description: 'Provide product details and specs' },
  { id: 'sales_assistant', name: 'Sales Assistant', icon: '💼', description: 'Drive sales and handle objections' },
  { id: 'custom', name: 'Custom Assistant', icon: '✨', description: 'Fully customizable for your needs' },
];

export const WhiteLabelBuilder: React.FC<WhiteLabelBuilderProps> = ({ config, onConfigChange }) => {
  const [domainError, setDomainError] = useState<string | null>(null);

  const validateDomain = (value: string) => {
    if (!value) {
      setDomainError(null);
      return;
    }

    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
    const customDomainRegex = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

    if (!domainRegex.test(value) && !customDomainRegex.test(value)) {
      setDomainError('Please enter a valid domain (e.g., example.com or mycompany)');
    } else {
      setDomainError(null);
    }
  };

  const handleDomainChange = (value: string) => {
    onConfigChange({ domain: value });
    validateDomain(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Domain Input */}
      <div className="glass-panel rounded-xl p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-sky-400" />
          <label className="text-lg font-semibold text-white">Your Domain</label>
        </div>
        <input
          type="text"
          placeholder="example.com"
          value={config.domain}
          onChange={(e) => handleDomainChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg bg-gray-800 border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            domainError ? 'border-red-500/50' : 'border-white/10'
          } text-white placeholder-gray-500`}
        />
        {domainError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {domainError}
          </motion.div>
        )}
        <p className="text-white/40 text-sm mt-2">This will be displayed as the brand on your white-label agents</p>
      </div>

      {/* Voice Agent Selection */}
      <div className="glass-panel rounded-xl p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Mic className="w-5 h-5 text-sky-400" />
          <label className="text-lg font-semibold text-white">Select Voice Agent</label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VOICE_AGENTS.map((agent) => (
            <motion.button
              key={agent.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onConfigChange({ voiceAgent: agent.id })}
              className={`p-4 rounded-lg text-left transition-all ${
                config.voiceAgent === agent.id
                  ? 'bg-sky-500/20 border-sky-500/50 border-2'
                  : 'bg-gray-800 border border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{agent.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{agent.name}</p>
                  <p className="text-xs text-white/60 line-clamp-1">{agent.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Agent Selection */}
      <div className="glass-panel rounded-xl p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-5 h-5 text-sky-400" />
          <label className="text-lg font-semibold text-white">Select Chat Agent</label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHAT_AGENTS.map((agent) => (
            <motion.button
              key={agent.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onConfigChange({ chatAgent: agent.id })}
              className={`p-4 rounded-lg text-left transition-all ${
                config.chatAgent === agent.id
                  ? 'bg-sky-500/20 border-sky-500/50 border-2'
                  : 'bg-gray-800 border border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{agent.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{agent.name}</p>
                  <p className="text-xs text-white/60 line-clamp-1">{agent.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="glass-panel rounded-lg p-4 border border-white/10 bg-blue-500/10 border-blue-500/20">
        <p className="text-sm text-white/70">
          💡 <span className="font-semibold">Tip:</span> You can change these agents at any time. Your white-label solution will update automatically.
        </p>
      </div>
    </motion.div>
  );
};
