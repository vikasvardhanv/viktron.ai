import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, Download, Share2, Volume2, MessageSquare } from 'lucide-react';
import { BrandLogo } from '../../constants';

interface WhiteLabelPreviewProps {
  config: {
    domain: string;
    voiceAgent: string;
    chatAgent: string;
  };
  onBack: () => void;
}

export const WhiteLabelPreview: React.FC<WhiteLabelPreviewProps> = ({ config, onBack }) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'chat'>('voice');
  const [copied, setCopied] = useState(false);
  const previewUrl = `https://${config.domain}/ai`;
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAgentName = (agentId: string, type: 'voice' | 'chat') => {
    if (type === 'voice') {
      const agents: Record<string, string> = {
        restaurant: 'Restaurant Assistant',
        clinic: 'Clinic Assistant',
        salon: 'Salon Assistant',
        realEstate: 'Real Estate Assistant',
        construction: 'Construction Assistant',
        dealership: 'Dealership Assistant',
        legal: 'Legal Assistant',
        education: 'Education Assistant',
        ecommerce: 'E-commerce Assistant',
        recruitment: 'Recruitment Assistant',
        generic: 'Generic AI Agent',
      };
      return agents[agentId] || 'AI Voice Agent';
    } else {
      const agents: Record<string, string> = {
        customer_support: 'Customer Support',
        appointment_scheduling: 'Appointment Scheduling',
        lead_generation: 'Lead Generation',
        product_info: 'Product Information',
        sales_assistant: 'Sales Assistant',
        custom: 'Custom Assistant',
      };
      return agents[agentId] || 'AI Chat Agent';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Configuration
        </motion.button>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyUrl}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/20 border border-sky-500/50 text-sky-400 hover:bg-sky-500/30 transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy URL'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
        </div>
      </div>

      {/* Preview Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Browser Frame Header */}
        <div className="bg-gray-800/80 border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-2 rounded-lg bg-gray-700/50 border border-white/10 text-sm text-white/70">
                {previewUrl}
              </div>
            </div>
          </div>
        </div>

        {/* White Label Preview Content */}
        <div className="min-h-[600px] bg-gradient-to-br from-gray-900 via-gray-800/50 to-gray-900 p-8">
          {/* Header with domain branding */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-block mb-4"
            >
              <BrandLogo className="h-12 w-12 mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 capitalize">{config.domain}</h1>
            <p className="text-white/60">AI-Powered Customer Experience</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/10">
            {(['voice', 'chat'] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-semibold transition-colors relative capitalize ${
                  activeTab === tab ? 'text-sky-400' : 'text-white/60 hover:text-white/80'
                }`}
              >
                {tab === 'voice' ? (
                  <Volume2 className="w-5 h-5 inline-block mr-2" />
                ) : (
                  <MessageSquare className="w-5 h-5 inline-block mr-2" />
                )}
                {tab} Agent
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'voice' ? (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <VoiceAgentPreview agentName={getAgentName(config.voiceAgent, 'voice')} domain={config.domain} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ChatAgentPreview agentName={getAgentName(config.chatAgent, 'chat')} domain={config.domain} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <Volume2 className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-white">Voice Agent</h3>
          </div>
          <p className="text-white/60">{getAgentName(config.voiceAgent, 'voice')}</p>
          <p className="text-xs text-white/40 mt-2">AI-powered voice communication for your customers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-white">Chat Agent</h3>
          </div>
          <p className="text-white/60">{getAgentName(config.chatAgent, 'chat')}</p>
          <p className="text-xs text-white/40 mt-2">Real-time chat support for seamless interactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-panel rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <Download className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-white">Ready to Deploy</h3>
          </div>
          <p className="text-white/60">One-click deployment</p>
          <p className="text-xs text-white/40 mt-2">Get your white-label solution live instantly</p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-lg border border-white/20 text-white font-semibold hover:border-white/40 transition-colors"
        >
          Back to Configuration
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:shadow-lg hover:shadow-sky-500/50 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Deploy White Label
        </motion.button>
      </div>

      <div ref={chatEndRef} />
    </motion.div>
  );
};

// Voice Agent Preview Component
const VoiceAgentPreview: React.FC<{ agentName: string; domain: string }> = ({ agentName, domain }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="glass-panel rounded-2xl p-8 border border-white/10 text-center">
        <div className="mb-6">
          <div className="inline-block">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center animate-pulse">
                <Volume2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-sky-400 animate-ping" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{agentName}</h2>
        <p className="text-white/60 mb-6">Ready to take calls for {domain}</p>

        <div className="space-y-3">
          <button className="w-full py-3 px-6 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5" />
            Start Voice Call
          </button>
          <button className="w-full py-3 px-6 rounded-lg border border-white/20 text-white font-semibold hover:border-white/40 transition-colors">
            View Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-lg p-4 border border-white/10 text-center">
          <p className="text-white/60 text-sm mb-2">Response Time</p>
          <p className="text-xl font-bold text-sky-400">{"<1s"}</p>
        </div>
        <div className="glass-panel rounded-lg p-4 border border-white/10 text-center">
          <p className="text-white/60 text-sm mb-2">Uptime</p>
          <p className="text-xl font-bold text-sky-400">99.9%</p>
        </div>
      </div>
    </motion.div>
  );
};

// Chat Agent Preview Component
const ChatAgentPreview: React.FC<{ agentName: string; domain: string }> = ({ agentName, domain }) => {
  const [messages] = useState([
    { sender: 'bot', text: `Hello! I'm the ${agentName} for ${domain}. How can I help you today?` },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="glass-panel rounded-2xl p-6 border border-white/10 min-h-[300px] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 space-y-4 mb-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/50">
                <BrandLogo className="w-4 h-4" />
              </div>
              <div className="glass-panel rounded-lg px-4 py-2 max-w-xs">
                <p className="text-white text-sm">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            disabled
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700/50 border border-white/10 text-white placeholder-white/40 text-sm disabled:opacity-50"
          />
          <button
            disabled
            className="px-4 py-2 rounded-lg bg-sky-500/20 border border-sky-500/50 text-sky-400 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-lg p-4 border border-white/10 text-center">
          <p className="text-white/60 text-xs mb-2">Type</p>
          <p className="font-bold text-sky-400 text-sm">{agentName}</p>
        </div>
        <div className="glass-panel rounded-lg p-4 border border-white/10 text-center">
          <p className="text-white/60 text-xs mb-2">Status</p>
          <p className="font-bold text-green-400 text-sm">Active</p>
        </div>
        <div className="glass-panel rounded-lg p-4 border border-white/10 text-center">
          <p className="text-white/60 text-xs mb-2">Domain</p>
          <p className="font-bold text-sky-400 text-sm capitalize">{domain}</p>
        </div>
      </div>
    </motion.div>
  );
};
