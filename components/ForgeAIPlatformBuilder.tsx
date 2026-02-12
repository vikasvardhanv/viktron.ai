import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isGeminiConfigured, GeminiForgeService } from '../services/forgeGeminiService';
import { FORGE_INDUSTRY_CATEGORIES } from '../constants/forgeNiches';

interface Message {
  id: string;
  sender: 'forge' | 'user';
  text: string;
  timestamp: Date;
  showCategoryList?: boolean;
}

interface PlatformConfig {
  sector?: string;
  targetAudience?: string;
  automationType?: string;
  platformName?: string;
  subdomain?: string;
  tagline?: string;
  description?: string;
  color?: string;
  pricing?: number;
  logo?: string;
}

interface ForgeAIPlatformBuilderProps {
  onPlatformGenerated?: (config: PlatformConfig) => void;
}

export const ForgeAIPlatformBuilder: React.FC<ForgeAIPlatformBuilderProps> = ({
  onPlatformGenerated,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [forgeService, setForgeService] = useState<GeminiForgeService | null>(null);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({});
  const [conversationComplete, setConversationComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiConfigured = isGeminiConfigured();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Gemini service and conversation
  useEffect(() => {
    if (geminiConfigured) {
      try {
        const service = new GeminiForgeService();
        setForgeService(service);
        
        // Add initial greeting
        addForgeMessage(
          "Hey there! 👋\n\nI'm Forge, your AI platform builder.\n\nI can automatically create your white-label platform!\n\nWhat's your sector or expertise?",
          { showCategoryList: true }
        );
      } catch (error) {
        console.error('Failed to initialize Forge:', error);
        addForgeMessage(
          "Hey there! 👋\n\nI'm Forge, but I'm having trouble connecting to my AI engine right now. Don't worry - I can still help you! Let's get started.\n\nWhat's your sector or expertise?",
          { showCategoryList: true }
        );
      }
    } else {
      addForgeMessage(
        "Hey there! 👋\n\nI'm Forge, your AI platform builder.\n\nI can automatically create your white-label platform!\n\nWhat's your sector or expertise?",
        { showCategoryList: true }
      );
    }
  }, []);

  // Add message from Forge
  const addForgeMessage = (
    text: string,
    options?: { showCategoryList?: boolean }
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const message: Message = {
        id: Date.now().toString(),
        sender: 'forge',
        text,
        timestamp: new Date(),
        ...options,
      };
      setMessages((prev) => [...prev, message]);
    }, 800);
  };

  // Add message from user
  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  // Handle user message
  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    addUserMessage(userMessage);
    setInputValue('');

    // Check if conversation seems complete
    if (checkIfReadyToGenerate(userMessage)) {
      handleGeneratePlatform();
      return;
    }

    // Get AI response
    if (forgeService && geminiConfigured) {
      setIsTyping(true);
      try {
        const response = await forgeService.sendMessage(userMessage);
        setIsTyping(false);
        addForgeMessage(response);
      } catch (error) {
        setIsTyping(false);
        addForgeMessage(
          "Oops! I had a little hiccup there. Could you repeat that? 🤔"
        );
      }
    } else {
      // Fallback to simple responses
      provideFallbackResponse(userMessage);
    }
  };

  // Check if we have enough info to generate platform
  const checkIfReadyToGenerate = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    // Trigger generation if user says they're ready or mentions specific completion phrases
    const triggerPhrases = [
      'ready',
      'generate',
      'create platform',
      "let's go",
      'sounds good',
      'perfect',
      'i like it',
      'yes please',
    ];

    return triggerPhrases.some(phrase => lowerMessage.includes(phrase)) && 
           messages.length > 6; // Ensure we've had some conversation
  };

  // Generate platform from conversation
  const handleGeneratePlatform = () => {
    setConversationComplete(true);
    
    addForgeMessage(
      "Perfect! I've got everything I need! 🎯\n\nLet me create your AI automation platform!\n\nStarting with your logo and branding..."
    );

    setTimeout(() => {
      const config = generatePlatformFromConversation();
      setPlatformConfig(config);

      addForgeMessage(
        `✨ Logo and info generated:\n\n🎨 Logo for ${config.platformName}\n\n📝 Platform Name: ${config.platformName}\n🌐 Platform Subdomain: ${config.subdomain}\n💬 Platform Tagline: ${config.tagline}\n📋 Platform Description: ${config.description}\n🎨 Platform Color: ${config.color}`
      );

      setTimeout(() => {
        addForgeMessage(
          `Perfect! Logo created. Setting your pricing...\n\n💰 Custom price generated:\n\nBased on your business profile, I suggest:\n\n$${config.pricing}/seat/month\n\n(You can change this price later in the platform settings)`
        );

        setTimeout(() => {
          addForgeMessage(
            `🎉 Your ${config.platformName} platform is ready!\n\nI've created your complete landing page with logo, branding, and pricing at $${config.pricing}/seat!\n\nClick "Preview Landing Page" to see it, or contact us to set everything up! 🚀`
          );
          onPlatformGenerated?.(config);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  // Generate platform config from conversation
  const generatePlatformFromConversation = (): PlatformConfig => {
    let extractedDetails = platformConfig;

    // Try to extract details from AI conversation
    if (forgeService) {
      const aiExtracted = forgeService.extractPlatformDetails();
      extractedDetails = { ...extractedDetails, ...aiExtracted };
    }

    // Extract from conversation history manually as fallback
    const conversationText = messages
      .map(m => m.text)
      .join(' ')
      .toLowerCase();

    if (!extractedDetails.sector) {
      FORGE_INDUSTRY_CATEGORIES.forEach(cat => {
        if (conversationText.includes(cat.name.toLowerCase())) {
          extractedDetails.sector = cat.name;
        }
      });
    }

    if (!extractedDetails.targetAudience) {
      const audiences = ['small business', 'enterprise', 'marketing', 'e-commerce', 'consultant', 'saas'];
      for (const aud of audiences) {
        if (conversationText.includes(aud)) {
          extractedDetails.targetAudience = aud;
          break;
        }
      }
    }

    // Generate platform details
    const sector = extractedDetails.sector || 'AI Automation';
    const audience = extractedDetails.targetAudience || 'small business';
    const automationType = extractedDetails.automationType || 'All-in-One Solution';

    const platformName = generatePlatformName(sector);
    const subdomain = platformName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 99);
    const tagline = generateTagline(automationType);
    const description = `AI automation platform helping ${audience} streamline operations`;
    const colors = ['#0B0BA8', '#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const pricing = generatePricing(audience);

    return {
      ...extractedDetails,
      platformName,
      subdomain: `${subdomain}.viktron.ai`,
      tagline,
      description,
      color,
      pricing,
      logo: '🤖',
    };
  };

  // Helper: Generate platform name
  const generatePlatformName = (sector: string): string => {
    const prefixes = ['Automate', 'Smart', 'AI', 'Swift', 'Flow', 'Pro', 'Rapid'];
    const suffixes = ['AI', 'Flow', 'Hub', 'Pro', 'Suite', 'Works', 'Genius'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix}${suffix}`;
  };

  // Helper: Generate tagline
  const generateTagline = (automationType: string): string => {
    const taglines: Record<string, string> = {
      'customer support': 'Support That Never Sleeps',
      'marketing': 'Marketing on Autopilot',
      'sales': 'Close Deals While You Sleep',
      'operations': 'Streamline Your Operations',
      'data': 'Data-Driven Decisions Made Easy',
      'all-in-one': 'Your Business, Fully Automated',
    };

    for (const [key, value] of Object.entries(taglines)) {
      if (automationType.toLowerCase().includes(key)) {
        return value;
      }
    }

    return 'Your Business, Fully Automated';
  };

  // Helper: Generate pricing
  const generatePricing = (audience: string): number => {
    const pricingMap: Record<string, number> = {
      'small business': 9.99,
      'enterprise': 49.99,
      'marketing': 29.99,
      'e-commerce': 19.99,
      'consultant': 14.99,
      'saas': 39.99,
    };

    for (const [key, value] of Object.entries(pricingMap)) {
      if (audience.toLowerCase().includes(key)) {
        return value;
      }
    }

    return 9.99;
  };

  // Fallback response when Gemini is not available
  const provideFallbackResponse = (userMessage: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerMessage = userMessage.toLowerCase();
      
      if (messages.length < 3) {
        addForgeMessage(
          "That sounds interesting! 🚀\n\nNow, who are you helping with this? (e.g., small businesses, enterprises, agencies)"
        );
      } else if (messages.length < 5) {
        addForgeMessage(
          "Perfect choice! 💪\n\nWhat type of automation are you focusing on? (e.g., customer support, marketing, all-in-one)"
        );
      } else {
        handleGeneratePlatform();
      }
    }, 1000);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !conversationComplete) {
      handleSendMessage(inputValue.trim());
    }
  };

  // Handle category click
  const handleCategoryClick = (categoryName: string) => {
    handleSendMessage(categoryName);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-3xl">⚒️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Forge
              {geminiConfigured && (
                <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  AI Powered
                </span>
              )}
            </h2>
            <p className="text-white/60 text-sm">Build your AI platform in minutes.</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!geminiConfigured && messages.length === 0 && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Gemini AI not configured</p>
              <p className="text-xs mt-1">Add VITE_GEMINI_API_KEY to your .env file for intelligent conversations!</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-white border border-white/10'
                } rounded-2xl px-6 py-4 shadow-lg`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>

                {/* Show category list */}
                {message.showCategoryList && (
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {FORGE_INDUSTRY_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.name)}
                        className="text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-emerald-500/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.emoji}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-white">{category.name}</p>
                            <p className="text-xs text-white/60">{category.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800 text-white border border-white/10 rounded-2xl px-6 py-4">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-gray-900/80 backdrop-blur-sm border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={conversationComplete}
            className="flex-1 px-6 py-4 rounded-full bg-gray-800 border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white placeholder-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || conversationComplete}
            className="px-6 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </form>
        <p className="text-white/40 text-xs text-center mt-4">
          {conversationComplete 
            ? "Platform generated! Preview your landing page or contact us to set it up."
            : "Don't worry about getting it perfect now - you can fully customize your platform after creation."}
        </p>
      </div>
    </div>
  );
};
