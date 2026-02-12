import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Check } from 'lucide-react';
import { FORGE_INDUSTRY_CATEGORIES, getAllNiches } from '../constants/forgeNiches';
import type { Niche, IndustryCategory } from '../constants/forgeNiches';

// Conversation flow steps
enum ConversationStep {
  GREETING = 'greeting',
  SECTOR_SELECTION = 'sector_selection',
  TARGET_AUDIENCE = 'target_audience',
  AUTOMATION_TYPE = 'automation_type',
  GENERATING = 'generating',
  PLATFORM_READY = 'platform_ready',
  SHOW_NICHES = 'show_niches',
  AGENT_SELECTION = 'agent_selection',
  SHOW_AGENTS = 'show_agents',
  CONTACT_TRAINING = 'contact_training',
  PAYMENT = 'payment',
}

// Target audience options
const TARGET_AUDIENCES = [
  'Small Businesses',
  'Enterprise Companies',
  'Marketing Agencies',
  'E-commerce Stores',
  'Consultants & Freelancers',
  'SaaS Companies',
];

// Automation types
const AUTOMATION_TYPES = [
  'Customer Support',
  'Marketing & Content',
  'Sales & Lead Gen',
  'Operations & Workflow',
  'Data & Analytics',
  'All-in-One Solution',
];

// Pre-built agent templates
interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const PRESET_AGENTS: Agent[] = [
  {
    id: 'voice',
    name: 'Voice Agent',
    description: 'AI-powered voice calls, phone support, and conversational automation',
    type: 'Voice Agent',
    emoji: '🎙️',
    color: 'from-purple-400 to-pink-400',
    bgColor: 'from-purple-950/40 to-pink-950/40',
  },
  {
    id: 'chat',
    name: 'Chat Agent',
    description: 'Real-time text chat, customer support, and engagement automation',
    type: 'Chat Agent',
    emoji: '💬',
    color: 'from-blue-400 to-cyan-400',
    bgColor: 'from-blue-950/40 to-cyan-950/40',
  },
];

interface Message {
  id: string;
  sender: 'forge' | 'user';
  text: string;
  timestamp: Date;
  options?: string[];
  showNicheList?: boolean;
  showCategoryList?: boolean;
  showPlatformDetails?: boolean;
  platformDetails?: PlatformConfig;
  showAgentSelection?: boolean;
  showGeneratedAgents?: Agent[];
  showContactForm?: boolean;
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
  logoEmoji?: string;
}

interface HypeyPlatformBuilderProps {
  onPlatformGenerated?: (config: PlatformConfig) => void;
}

export const HypeyPlatformBuilder: React.FC<HypeyPlatformBuilderProps> = ({
  onPlatformGenerated,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>(ConversationStep.GREETING);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({});
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    addForgeMessage(
      "Hey there! 👋\n\nI'm FORGE, your AI platform builder.\n\nI can automatically create your custom platform with AI agents!\n\nWhat's your industry or expertise?",
      {
        showCategoryList: true,
      }
    );
  }, []);

  // Add a message from FORGE
  const addForgeMessage = (
    text: string,
    options?: { options?: string[]; showNicheList?: boolean; showCategoryList?: boolean }
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

  // Add a message from user
  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };

  // Handle option click
  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    processUserResponse(option);
  };

  // Process user response based on current step
  const processUserResponse = (response: string) => {
    switch (currentStep) {
      case ConversationStep.GREETING:
      case ConversationStep.SECTOR_SELECTION:
        handleSectorSelection(response);
        break;
      case ConversationStep.TARGET_AUDIENCE:
        handleTargetAudienceSelection(response);
        break;
      case ConversationStep.AUTOMATION_TYPE:
        handleAutomationTypeSelection(response);
        break;
      case ConversationStep.SHOW_NICHES:
        handleSectorSelection(response);
        break;
      case ConversationStep.AGENT_SELECTION:
        if (response.includes('Create agents') || response.includes('agents')) {
          handleAgentCreation();
        }
        break;
      case ConversationStep.CONTACT_TRAINING:
        if (response.includes('Schedule Training')) {
          handleTrainingSchedule();
        }
        break;
      default:
        break;
    }
  };

  // Handle training schedule
  const handleTrainingSchedule = () => {
    addUserMessage('Schedule Training');
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      addForgeMessage(
        `✅ Training Request Submitted!\n\nPerfect! We've received your training request. Here's what happens next:\n\n1️⃣ Our team will review your ${selectedAgents.map(a => a.name).join(' and ')}\n2️⃣ You'll receive a call/email within 24 hours\n3️⃣ We'll schedule your personalized training session\n4️⃣ After training, you're ready to start selling!\n\n🚀 While you wait, would you like to choose your subscription plan?`,
        { options: ['Yes, show me pricing', 'I\'ll wait for the call'] }
      );
      setCurrentStep(ConversationStep.SHOW_AGENTS);
    }, 1500);
  };

  // Handle agent creation
  const handleAgentCreation = () => {
    if (selectedAgents.length === 0) {
      addForgeMessage('Please select at least one agent to create!', { options: [] });
      return;
    }

    addUserMessage(`Create ${selectedAgents.length} agent${selectedAgents.length > 1 ? 's' : ''}`);
    addForgeMessage(`Perfect! 🚀 I'm creating your ${selectedAgents.length === 2 ? 'Voice and Chat agents' : selectedAgents.find(a => a.id === 'voice') ? 'Voice Agent' : 'Chat Agent'} right now!`);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);

        const message: Message = {
          id: (Date.now() + 100).toString(),
          sender: 'forge',
          text: `✅ Agents Created Successfully!\n\nYour ${selectedAgents.map(a => a.name).join(' and ')} ${selectedAgents.length > 1 ? 'are' : 'is'} now ready!`,
          timestamp: new Date(),
          showGeneratedAgents: selectedAgents,
        };
        setMessages((prev) => [...prev, message]);

        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            
            const trainingMessage: Message = {
              id: (Date.now() + 200).toString(),
              sender: 'forge',
              text: `🎓 Next Step: Agent Training\n\nBefore you can start selling, we need to train your AI agents with your specific business knowledge, tone, and processes.\n\nOur team will:\n✅ Customize your agents for your industry\n✅ Train them with your knowledge base\n✅ Set up your workflows and automations\n✅ Test everything to perfection\n\nThis usually takes 24-48 hours.\n\nLet's schedule your training session!`,
              timestamp: new Date(),
              showContactForm: true,
            };
            setMessages((prev) => [...prev, trainingMessage]);
            setCurrentStep(ConversationStep.CONTACT_TRAINING);
          }, 800);
        }, 2000);
      }, 800);
    }, 1500);
  };

  // Handle sector/niche selection
  const handleSectorSelection = (sector: string) => {
    setPlatformConfig((prev) => ({ ...prev, sector }));

    // Check if user wants to see all niches
    if (
      sector.toLowerCase().includes('list') ||
      sector.toLowerCase().includes('niche') ||
      sector.toLowerCase().includes('all')
    ) {
      addForgeMessage(
        "I appreciate your interest, but here's the thing - there are literally THOUSANDS of niches where AI platforms are crushing it right now!\n\nInstead of overwhelming you with a massive list, let me help you find YOUR perfect fit. Here are some quick questions to narrow it down:\n\nWhat gets YOU excited? Think about:\n• Your professional background\n• Industries you understand well\n• Problems you love solving\n• Communities you're already part of\n\nOR if you want some inspiration, here are the hottest categories right now:",
        { showCategoryList: true }
      );
      setCurrentStep(ConversationStep.SHOW_NICHES);
      return;
    }

    const emoji = getRandomEmoji();
    addForgeMessage(
      `${emoji} ${sector} - that's HOT right now! 🔥\n\nThe demand for automation solutions is absolutely exploding. I love it!\n\nLet me understand your vision a bit better - who are you helping with AI automation?`,
      { options: TARGET_AUDIENCES }
    );
    setCurrentStep(ConversationStep.TARGET_AUDIENCE);
  };

  // Handle target audience selection
  const handleTargetAudienceSelection = (audience: string) => {
    setPlatformConfig((prev) => ({ ...prev, targetAudience: audience }));

    const responses = {
      'Small Businesses':
        "Perfect! Small businesses NEED this - they're drowning in repetitive tasks but can't afford big enterprise solutions. You're solving a real pain point! 💪",
      'Enterprise Companies':
        "Excellent choice! Enterprise companies have complex workflows and massive scale - huge opportunity for AI automation! 🎯",
      'Marketing Agencies':
        'YES! Marketing agencies are automation-hungry - they need to scale their services while maintaining quality! 🚀',
      'E-commerce Stores':
        'Perfect timing! E-commerce is exploding and automation is ESSENTIAL for scaling operations! 💰',
      'Consultants & Freelancers':
        'Great niche! Consultants need to maximize their time - automation lets them serve more clients without burning out! ⚡',
      'SaaS Companies':
        "Smart choice! SaaS companies live and breathe automation - they'll totally get the value! 🎨",
    };

    addForgeMessage(
      (responses[audience as keyof typeof responses] || responses['Small Businesses']) +
        '\n\nWhat kind of automation are you focusing on for them?',
      { options: AUTOMATION_TYPES }
    );
    setCurrentStep(ConversationStep.AUTOMATION_TYPE);
  };

  // Handle automation type selection
  const handleAutomationTypeSelection = (automationType: string) => {
    setPlatformConfig((prev) => ({ ...prev, automationType }));

    addForgeMessage(
      `Perfect! ${automationType} is a critical automation need! 💡\n\nI have a clear picture now. Creating your AI platform...`,
      { options: [] }
    );

    setCurrentStep(ConversationStep.GENERATING);
    setTimeout(() => generatePlatform(), 1500);
  };

  // Generate platform configuration
  const generatePlatform = () => {
    const config = generatePlatformConfig(platformConfig);
    setPlatformConfig(config);

    // Step 1: Show logo and branding info
    const message1: Message = {
      id: Date.now().toString(),
      sender: 'forge',
      text: `✨ Logo and info generated!`,
      timestamp: new Date(),
      showPlatformDetails: true,
      platformDetails: config,
    };
    setMessages((prev) => [...prev, message1]);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Step 2: Show pricing
        const message2: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'forge',
          text: `💰 Custom price generated:\n\nBased on your business profile, I suggest you charge:\n\n$${config.pricing}/seat/month\n\n(You can change this price later in platform settings)`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, message2]);

        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            // Step 3: Show landing page preview
            const message3: Message = {
              id: (Date.now() + 2).toString(),
              sender: 'forge',
              text: `🎉 Landing page generated!\n\nYour ${config.platformName} platform is ready! Your complete landing page with logo, branding, and pricing has been created.`,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, message3]);

            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setIsTyping(false);
                // Step 4: Agent selection
                const message4: Message = {
                  id: (Date.now() + 3).toString(),
                  sender: 'forge',
                  text: `🤖 Now let's build your specialized AI agents!\n\nSelect which agents you want to create for your ${config.platformName} platform:`,
                  timestamp: new Date(),
                  showAgentSelection: true,
                };
                setMessages((prev) => [...prev, message4]);
                setCurrentStep(ConversationStep.AGENT_SELECTION);
                onPlatformGenerated?.(config);
              }, 800);
            }, 2000);
          }, 800);
        }, 2000);
      }, 800);
    }, 2000);
  };

  // Helper functions
  const getRandomEmoji = () => {
    const emojis = ['✨', '🚀', '💡', '⚡', '🎯', '💪', '🔥'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const generatePlatformConfig = (userConfig: PlatformConfig): PlatformConfig => {
    const sector = userConfig.sector || 'AI Automation';
    const audience = userConfig.targetAudience || 'Small Businesses';
    const automationType = userConfig.automationType || 'All-in-One Solution';

    // Generate platform name
    const platformName = generatePlatformName(sector, automationType);

    // Generate subdomain
    const subdomain = platformName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 99);

    // Generate tagline
    const tagline = generateTagline(automationType, audience);

    // Generate description
    const description = `${automationType} AI automation platform helping ${audience.toLowerCase()} streamline operations, marketing, sales, and support`;

    // Generate color
    const colors = ['#0B0BA8', '#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Generate pricing based on audience
    const pricing = generatePricing(audience);

    return {
      ...userConfig,
      platformName,
      subdomain: `${subdomain}.viktron.ai`,
      tagline,
      description,
      color,
      pricing,
      logo: '🤖', // Emoji logo for simplicity
    };
  };

  const generatePlatformName = (sector: string, automationType: string): string => {
    const prefixes = ['Automate', 'Smart', 'AI', 'Swift', 'Flow', 'Pro', 'Rapid'];
    const suffixes = ['AI', 'Flow', 'Hub', 'Pro', 'Suite', 'Works', 'Genius'];

    if (automationType === 'All-in-One Solution') {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      return `${prefix}${suffix}`;
    }

    // Use automation type as inspiration
    const typeWord = automationType.split(' ')[0]; // e.g., "Customer" from "Customer Support"
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${typeWord}${suffix}`;
  };

  const generateTagline = (automationType: string, audience: string): string => {
    const taglines = {
      'Customer Support': 'Support That Never Sleeps',
      'Marketing & Content': 'Marketing on Autopilot',
      'Sales & Lead Gen': 'Close Deals While You Sleep',
      'Operations & Workflow': 'Streamline Your Operations',
      'Data & Analytics': 'Data-Driven Decisions Made Easy',
      'All-in-One Solution': 'Your Business, Fully Automated',
    };

    return taglines[automationType as keyof typeof taglines] || 'Your Business, Fully Automated';
  };

  const generatePricing = (audience: string): number => {
    const pricingMap = {
      'Small Businesses': 9.99,
      'Enterprise Companies': 49.99,
      'Marketing Agencies': 29.99,
      'E-commerce Stores': 19.99,
      'Consultants & Freelancers': 14.99,
      'SaaS Companies': 39.99,
    };

    return pricingMap[audience as keyof typeof pricingMap] || 9.99;
  };

  // Generate logo emoji based on sector
  const generateLogoEmoji = (sector: string): string => {
    const emojiMap: { [key: string]: string } = {
      'Business Services': '💼',
      'Health & Wellness': '🏥',
      'Education': '📚',
      'Professional Services': '⚖️',
      'E-commerce & Retail': '🛍️',
      'Creative Services': '🎨',
      'Tech & SaaS': '💻',
      'Marketing': '📢',
      'Finance': '💰',
      'Real Estate': '🏠',
    };
    return emojiMap[sector] || '🚀';
  };

// Platform Details Display Component
const PlatformDetailsDisplay: React.FC<{ platform: PlatformConfig }> = ({ platform }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 mt-6"
    >
      {/* Logo */}
      <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-all">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-4xl shadow-lg flex-shrink-0">
          {platform.logoEmoji || generateLogoEmoji(platform.sector || '')}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Platform Info</p>
          <div className="space-y-1">
            <p className="font-bold text-xl text-white">{platform.platformName}</p>
            <p className="text-sm text-emerald-300">{platform.tagline}</p>
          </div>
        </div>
      </div>

      {/* Platform Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-gradient-to-br from-blue-950/40 to-blue-900/40 rounded-lg border border-blue-800/50 hover:border-blue-600/70 transition-all">
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Platform Name</p>
          <p className="text-sm font-bold text-white mt-2">{platform.platformName}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-950/40 to-purple-900/40 rounded-lg border border-purple-800/50 hover:border-purple-600/70 transition-all">
          <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Subdomain</p>
          <p className="text-sm font-bold text-white mt-2">{platform.subdomain?.split('.')[0]}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-950/40 to-green-900/40 rounded-lg border border-green-800/50 hover:border-green-600/70 transition-all">
          <p className="text-xs text-green-400 font-semibold uppercase tracking-wider">Target Audience</p>
          <p className="text-sm font-bold text-white mt-2">{platform.targetAudience}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-950/40 to-orange-900/40 rounded-lg border border-orange-800/50 hover:border-orange-600/70 transition-all">
          <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Focus</p>
          <p className="text-sm font-bold text-white mt-2">{platform.automationType}</p>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700 hover:border-emerald-500/50 transition-all">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Description</p>
        <p className="text-sm text-gray-300">{platform.description}</p>
      </div>
    </motion.div>
  );
};

  // Toggle agent selection
  const toggleAgentSelection = (agent: Agent) => {
    setSelectedAgents((prev) => {
      const isSelected = prev.find((a) => a.id === agent.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== agent.id);
      } else {
        return [...prev, agent];
      }
    });
  };

  // Handle text input submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleOptionClick(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">
      {/* Left Sidebar - FORGE Avatar */}
      <div className="w-80 bg-gradient-to-b from-gray-900 via-gray-950 to-black border-r border-gray-800 p-8 flex flex-col items-center justify-center sticky top-0">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Small FORGE AI Avatar */}
          <div className="w-40 h-40 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-emerald-400/30">
            <div className="text-6xl">🤖</div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">FORGE</h2>
          <p className="text-gray-300 font-medium text-center">Your intelligent<br />AI assistant.</p>
          
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 inline-block"
          >
            <p className="text-xs text-emerald-300 font-semibold">✨ Ready to create</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950/50 to-cyan-950/50 border-b border-gray-800 p-6 backdrop-blur-sm">
          <h1 className="text-3xl font-bold">Let's create your <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">AI product</span></h1>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.sender === 'forge' ? (
                  <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed text-lg">{message.text}</p>

                    {/* Platform Details Display */}
                    {message.showPlatformDetails && message.platformDetails && (
                      <PlatformDetailsDisplay platform={message.platformDetails} />
                    )}

                    {/* Category List - Clean Grid Layout */}
                    {message.showCategoryList && (
                      <div className="mt-6">
                        <p className="text-sm text-gray-400 mb-4 font-semibold">SELECT YOUR INDUSTRY</p>
                        <div className="grid grid-cols-2 gap-3">
                          {FORGE_INDUSTRY_CATEGORIES.map((category) => (
                            <motion.button
                              key={category.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOptionClick(category.name)}
                              className="group text-left p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-emerald-900/30 hover:to-cyan-900/30 border border-gray-700 hover:border-emerald-500/50 transition-all"
                            >
                              <span className="text-3xl mb-2 block">{category.emoji}</span>
                              <p className="font-semibold text-white text-sm group-hover:text-emerald-300 transition-colors">{category.name}</p>
                              <p className="text-xs text-gray-400 mt-1">{category.description}</p>
                            </motion.button>
                          ))}
                        </div>
                        <button
                          onClick={() => handleOptionClick('Show all niches')}
                          className="w-full mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/50 hover:border-emerald-400/70 transition-all font-semibold text-emerald-300"
                        >
                          📋 Show all niches
                        </button>
                      </div>
                    )}

                    {/* Quick Response Buttons */}
                    {message.options && message.options.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {message.options.map((option, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionClick(option)}
                            className="p-3 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 font-semibold text-sm transition-all border border-emerald-500/50 hover:border-emerald-400/70"
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Agent Selection */}
                    {message.showAgentSelection && (
                      <div className="mt-6 p-6 bg-gradient-to-br from-blue-950/30 to-cyan-950/30 rounded-xl border border-blue-800/50">
                        <p className="text-blue-300 font-semibold mb-2 text-lg">🤖 Choose Your AI Agents</p>
                        <p className="text-gray-400 text-sm mb-4">Select the agents you want for your platform. You can choose both!</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {PRESET_AGENTS.map((agent) => (
                            <motion.button
                              key={agent.id}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => toggleAgentSelection(agent)}
                              className={`p-5 rounded-xl transition-all border-2 text-left ${
                                selectedAgents.find((a) => a.id === agent.id)
                                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-950/50 to-cyan-950/50'
                                  : 'border-gray-700 bg-gray-800/50 hover:border-emerald-500/50 hover:bg-gray-700/50'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl`}>
                                    {agent.emoji}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <input
                                      type="checkbox"
                                      checked={!!selectedAgents.find((a) => a.id === agent.id)}
                                      readOnly
                                      className="w-4 h-4 cursor-pointer accent-emerald-500"
                                    />
                                    <p className="font-bold text-white">{agent.name}</p>
                                  </div>
                                  <p className="text-xs text-gray-400 leading-relaxed">{agent.description}</p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleOptionClick('Create agents')}
                          className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={selectedAgents.length === 0}
                        >
                          {selectedAgents.length > 0 ? `Create ${selectedAgents.length === 2 ? 'Both Agents' : selectedAgents[0].name}` : 'Select at least one agent'}
                        </motion.button>
                      </div>
                    )}

                    {/* Agent Cards Display */}
                    {message.showGeneratedAgents && message.showGeneratedAgents.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {message.showGeneratedAgents.map((agent) => (
                          <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-5 rounded-xl bg-gradient-to-br ${agent.bgColor} border-2 border-gray-700 hover:border-emerald-500/50 transition-all`}
                          >
                            <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-3xl mb-3`}>
                              {agent.emoji}
                            </div>
                            <p className="font-bold text-white text-lg mb-1">{agent.name}</p>
                            <p className="text-xs text-gray-400 mb-3 leading-relaxed">{agent.description}</p>
                            <div className="flex items-center gap-2">
                              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                                {agent.type}
                              </div>
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-xs text-emerald-400">Active</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Contact/Training Form */}
                    {message.showContactForm && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-6 bg-gradient-to-br from-purple-950/30 to-pink-950/30 rounded-xl border border-purple-800/50"
                      >
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-bold text-purple-300 mb-2">📞 Schedule Your Training</h3>
                            <p className="text-sm text-gray-400">Fill in your details and we'll contact you within 24 hours to schedule your agent training.</p>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">Your Name</label>
                              <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                              <input
                                type="email"
                                placeholder="john@company.com"
                                className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                              <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">Preferred Time</label>
                              <select className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                                <option>Morning (9AM - 12PM)</option>
                                <option>Afternoon (12PM - 5PM)</option>
                                <option>Evening (5PM - 8PM)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">Additional Notes (Optional)</label>
                              <textarea
                                rows={3}
                                placeholder="Any specific requirements or questions..."
                                className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                              />
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionClick('Schedule Training')}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                          >
                            🎓 Schedule My Training Session
                          </motion.button>

                          <div className="flex items-start gap-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                            <span className="text-lg">⏱️</span>
                            <div className="flex-1">
                              <p className="text-xs text-purple-300">
                                <strong>What happens next?</strong> Our team will review your platform and agents, then contact you to schedule a personalized training session. Training typically takes 1-2 hours and includes full setup support.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg p-4 inline-block border border-emerald-500/50 max-w-xs"
                  >
                    <p className="text-gray-100 font-medium">{message.text}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 bg-gray-900/50 border-t border-gray-800 backdrop-blur-sm flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 focus:border-emerald-500 focus:outline-none text-white placeholder-gray-400"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};
