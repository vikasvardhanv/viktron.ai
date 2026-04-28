import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Calendar } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { BrandIcon } from '../constants';
import { SchedulingModal } from './SchedulingModal';
import { useAnalytics } from '../utils/analytics';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const sanitizeAssistantText = (text: string) => {
  return text
    .replace(/\*\*/g, '')
    .replace(/[`*_>#]/g, '')
    .replace(/^\s*[-•]\s+/gm, '')
    .replace(/[•]/g, '')
    .replace(/\r/g, '')
    .replace(/[^\x20-\x7E\n]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Map routes to persona-specific system instructions
const personaForPath = (path: string): string => {
  const map: Record<string, string> = {
    '/demos/restaurant': 'You are a Restaurant AI assistant. Help with menu inquiries, reservations, delivery, catering, and feedback. Use plain text. Offer actions like booking a table or placing an order demo.',
    '/demos/clinic': 'You are a Clinic AI assistant. Help with appointments, insurance info, services, and patient FAQs. Use plain text. Suggest booking an appointment when appropriate.',
    '/demos/salon': 'You are a Salon AI assistant. Help with services, pricing, stylists, and booking. Use plain text. Offer to schedule a visit.',
    '/demos/dealership': 'You are a Dealership AI assistant. Help with inventory, test drives, financing, and trade-ins. Use plain text. Offer to book a test drive.',
    '/demos/construction': 'You are a Construction AI assistant. Help with quotes, project timelines, services, and compliance. Use plain text. Offer to schedule a consultation.',
    '/demos/real_estate': 'You are a Real Estate AI assistant. Help with listings, tours, mortgage pre-approval, and neighborhoods. Use plain text. Offer to book a showing.',
    '/demos/legal': 'You are a Legal AI assistant. Help with practice areas, consultations, and intake. Use plain text. Offer to book a consultation.',
    '/demos/ecommerce': 'You are an Ecommerce AI assistant. Help with products, orders, shipping, returns, and support. Use plain text. Offer help with checkout.',
    '/demos/education': 'You are an Education AI assistant. Help with courses, enrollment, schedules, and admissions. Use plain text. Offer to schedule a call.',
    '/demos/recruitment': 'You are a Recruitment AI assistant. Help with job listings, applications, interviews, and scheduling. Use plain text. Offer to book an interview.',
    '/demos/whatsapp': 'You are a Messaging AI assistant. Explain WhatsApp bot capabilities, templates, and flows. Use plain text. Offer to set up a demo conversation.',
    '/demos/voice': 'You are a Voice AI assistant. Explain phone agent capabilities, call flows, and integrations. Use plain text. Offer to book a demo call.',
    '/demos/business-plan': 'You are a Business Planning AI assistant. Help generate outlines, market insights, and financial assumptions. Use plain text. Offer to share a sample plan.',
    '/demos/lead-gen': 'You are a Lead Generation AI assistant. Help with finding, qualifying, and outreach. Use plain text. Offer to start a lead search.',
    '/demos/workflow-automation': 'You are a Workflow Automation assistant. Help with process mapping, integrations, and triggers. Use plain text. Offer to design a sample workflow.',
    '/demos/data-analytics': 'You are a Data Analytics assistant. Help with dashboards, KPIs, data sources, and forecasting. Use plain text. Offer to create a KPI plan.',
    '/demos/content-generator': 'You are a Content AI assistant. Help with posts, emails, and landing copy. Use plain text. Offer to generate a sample.',
    '/demos/agent-orchestration': 'You are a Multi-Agent Orchestration assistant. Explain agent roles, coordination, and tools. Use plain text. Offer to simulate a task.',
    '/demos/custom-model': 'You are a Custom Model assistant. Explain data, training, evals, and deployment. Use plain text. Offer to scope a model.',
  };
  // Exact match, or best-effort startsWith for nested routes
  const entry = Object.entries(map).find(([p]) => path === p || path.startsWith(p));
  if (entry) return entry[1];
  
  // Default Viktron assistant with deep project intelligence
  return `You are the Viktron AI Intelligent Assistant (V2.2). You represent Viktron AI, an elite enterprise agent orchestration platform. 

CORE MISSION:
We empower organizations by deploying autonomous multi-agent systems that handle complex business workflows with judgment, coordination, and governance. We transition businesses from static pipelines to resilient agentic workforces.

HOW OUR AGENTS COORDINATE (The Viktron Hierarchy):
We use a sophisticated orchestration pattern inspired by AutoGen and CrewAI:
- CEO Agent: Strategic planning, mission definition, and high-level delegation.
- PM Agent: Task decomposition, progress tracking, and strict quality gates. It validates output before any mission progresses.
- Developer Agent: Autonomous execution using tools (File, Shell, Browser, Code).
- QA Agent: Discovery and execution of validation tests to ensure zero-defect deployments.

TECHNICAL EDGE:
- Multi-Framework Integration: We actively combine LangChain, CrewAI, AutoGen, and MCP (Model Context Protocol).
- 3-Tier Memory (Google ADK): Temp (turn-based), Session (task-based), and Permanent (historical learning). Agents improve with every interaction.
- Trust Fabric: Institutional-grade security with Identity Verification, Delegation Tokens (task-scoped), and Policy Gateway controls.
- 3,000+ Integrations: We connect to Salesforce, SAP, Oracle, GitHub, Slack, Microsoft Teams, and more.
- Sub-50ms Latency: High-performance orchestration layer.

INTERACTION GUIDELINES:
- Be professional, authoritative, and highly intelligent.
- Explain our architecture (FastAPI, React 19, Celery, pgvector) if asked.
- Always offer to "open the booking calendar" if the user wants to talk to an expert or deploy a system.
- Use plain text only. No markdown symbols like ** or #. No bold text.

If asked about pricing, mention it is transparent and scales with your deployment needs. If asked about "AgentIRL", explain it is our middleware layer that provides durable workflow state and auto-recovery.`;
};

// Detect if message indicates booking intent
const hasBookingIntent = (text: string) => {
  const bookingKeywords = [
    'book', 'schedule', 'consultation', 'meeting', 'call', 'appointment',
    'talk to someone', 'speak with', 'get in touch', 'contact', 'demo',
    'calendly', 'available', 'free time', 'slot', 'set up a call', 'onboard'
  ];
  const lowerText = text.toLowerCase();
  return bookingKeywords.some(keyword => lowerText.includes(keyword));
};

export const GlobalChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingButton, setShowBookingButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (isOpen) {
      trackEvent('chatbot_opened', { path: window.location.pathname });
    }
  }, [isOpen]);

  const handleBookConsultation = () => {
    trackEvent('chatbot_booking_triggered');
    setIsSchedulingOpen(true);
    const bookingMessage: Message = {
      id: Date.now().toString(),
      text: "I've opened the booking calendar for you. Select a date and time that works best, and we'll set up your consultation with Zoom meeting and calendar invite!",
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, bookingMessage]);
    setShowBookingButton(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    trackEvent('chatbot_message_sent', { 
      length: userMessage.text.length,
      path: window.location.pathname
    });

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key missing");
      }

      const client = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });

      const contents = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      contents.push({
        role: 'user',
        parts: [{ text: userMessage.text }]
      });

      const response = await client.models.generateContent({
        model: "gemini-1.5-flash",
        contents: contents,
        config: {
          systemInstruction: {
            parts: [{ text: personaForPath(window.location.pathname) }] 
          }
        }
      });

      const text = sanitizeAssistantText(response.text || '');

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: text || "I am currently processing your request. Could you please provide a bit more detail?",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (hasBookingIntent(userMessage.text) || hasBookingIntent(text)) {
        setShowBookingButton(true);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      
      let errorResponse = "I am having trouble connecting to the server right now. Please try again in a few moments.";
      
      if (error.message?.includes('503') || error.message?.includes('high demand')) {
        errorResponse = "I am currently navigating a high-demand period in our orchestration layer. While I recalibrate, you can reach our human team directly at info@viktron.ai or try again in a few moments. We appreciate your patience as we scale our intelligence.";
      } else if (error.message?.includes('429')) {
        errorResponse = "Our rate-limiting gateway has paused our conversation briefly. Please wait a moment while I reset my connection parameters, or contact info@viktron.ai for urgent inquiries.";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: sanitizeAssistantText(errorResponse),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Scheduling Modal */}
      <SchedulingModal
        isOpen={isSchedulingOpen}
        onClose={() => setIsSchedulingOpen(false)}
        source="chatbot"
      />

      {/* Wandering Walking Agent */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ 
            opacity: 1, 
            x: [0, -150, 150, -50, 0],
          }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            },
            opacity: { duration: 1 }
          }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-12 z-[60] cursor-pointer group flex flex-col items-center"
        >
          {/* Agent Label */}
          <div className="mb-2 px-2 py-0.5 bg-black/80 border border-primary/30 rounded font-mono text-[8px] text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
            AGENT_ACTIVE
          </div>

          <div className="relative">
            {/* Notification Pulse */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />

            {/* Walking Person SVG */}
            <div className="w-10 h-16 relative">
              {/* Head */}
              <motion.div 
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-4 h-4 bg-primary rounded-sm mx-auto mb-1 border border-black shadow-[0_0_10px_rgba(204,255,0,0.3)]" 
              />
              {/* Body */}
              <div className="w-6 h-7 bg-zinc-800 border border-white/10 rounded-sm mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10" />
                <div className="w-full h-[1px] bg-primary/20 mt-2" />
              </div>
              {/* Legs Container */}
              <div className="flex justify-center gap-1 -mt-1">
                {/* Left Leg */}
                <motion.div 
                  animate={{ 
                    rotate: [15, -15, 15],
                    y: [0, -1, 0]
                  }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-4 bg-zinc-700 rounded-full origin-top" 
                />
                {/* Right Leg */}
                <motion.div 
                  animate={{ 
                    rotate: [-15, 15, -15],
                    y: [0, -1, 0]
                  }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-4 bg-zinc-700 rounded-full origin-top" 
                />
              </div>
              {/* Shadow underneath */}
              <motion.div 
                animate={{ scaleX: [0.8, 1.2, 0.8] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-8 h-1 bg-black/40 rounded-full mx-auto mt-1 blur-[1px]" 
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Close Button (only when open) */}
      {isOpen && (
        <motion.button
          onClick={() => setIsOpen(false)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-8 right-8 z-[60] bg-zinc-900 border border-white/10 text-white p-4 rounded-full shadow-2xl hover:text-primary transition-colors"
        >
          <X className="h-6 w-6" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[90vw] sm:w-[450px] h-[650px] max-h-[85vh] flex flex-col bg-[#050505] border border-white/5 rounded-none shadow-2xl shadow-primary/5 overflow-hidden"
          >
            <div className="scan-line opacity-10" />
            
            {/* Header */}
            <div className="p-6 bg-[#080808] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 obsidian-inset flex items-center justify-center border border-white/5 text-primary">
                  <BrandIcon className="h-6 w-6 text-glow" />
                </div>
                <div>
                  <h3 className="font-bold text-white uppercase tracking-tighter text-sm">Viktron Agent // V2.2</h3>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">System_Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleBookConsultation}
                className="btn-obsidian !px-4 !py-2 !text-[9px]"
              >
                <Calendar className="h-3 w-3" />
                Schedule_Call
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-5 text-[11px] leading-relaxed font-mono uppercase tracking-widest border transition-all ${
                      msg.sender === 'user'
                        ? 'bg-primary text-black border-primary font-bold'
                        : 'obsidian-panel border-white/5 text-zinc-400'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[8px] mt-2 block opacity-40 ${msg.sender === 'user' ? 'text-black' : 'text-zinc-600'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="obsidian-inset border border-white/5 p-4 flex items-center gap-3">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-600">Processing_Input...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Booking Button */}
            <AnimatePresence>
              {showBookingButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-6 py-4 bg-[#080808] border-t border-white/5"
                >
                  <button
                    onClick={handleBookConsultation}
                    className="btn-acid w-full !py-4 flex items-center justify-center gap-3"
                  >
                    <Calendar className="h-4 w-4" />
                    Book_Deployment_Meeting
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-6 bg-[#080808] border-t border-white/5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="COMMAND > INPUT_QUERY"
                  className="flex-1 obsidian-inset border border-white/5 px-5 py-4 text-[10px] font-mono uppercase tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:border-primary/30 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="btn-acid !p-4 disabled:opacity-30 disabled:grayscale transition-all"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
