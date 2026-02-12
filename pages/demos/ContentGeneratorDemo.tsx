import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/layout/Layout';
import { 
  Bot, Send, Sparkles, Wand2, Copy, Check, Download,
  FileText, Mail, MessageSquare, Hash, Globe, Zap,
  RefreshCw, Settings, ChevronRight
} from 'lucide-react';

type ContentType = 'social' | 'email' | 'blog' | 'ad' | 'product';

interface GeneratedContent {
  id: string;
  type: ContentType;
  content: string;
  timestamp: Date;
}

const contentTypes = [
  { id: 'social' as ContentType, name: 'Social Post', icon: <Hash className="h-4 w-4" />, placeholder: 'Product launch, holiday sale, company milestone...' },
  { id: 'email' as ContentType, name: 'Email Copy', icon: <Mail className="h-4 w-4" />, placeholder: 'Welcome email, promo campaign, newsletter...' },
  { id: 'blog' as ContentType, name: 'Blog Intro', icon: <FileText className="h-4 w-4" />, placeholder: 'AI trends, how-to guides, industry insights...' },
  { id: 'ad' as ContentType, name: 'Ad Copy', icon: <Globe className="h-4 w-4" />, placeholder: 'Google ad, Facebook ad, LinkedIn sponsored...' },
  { id: 'product' as ContentType, name: 'Product Desc', icon: <Zap className="h-4 w-4" />, placeholder: 'New product, feature update, service offering...' },
];

const sampleOutputs: Record<ContentType, string[]> = {
  social: [
    "🚀 Big news! We just launched something incredible that's going to change the game.\n\nAfter months of hard work, our team has built an AI solution that:\n✨ Saves you 10+ hours per week\n💡 Automates your repetitive tasks\n🎯 Delivers results 3x faster\n\nReady to level up? Link in bio 👆\n\n#AI #Innovation #Automation #TechStartup",
    "The future isn't coming. It's already here. 🤖\n\nBusinesses using AI are seeing:\n📈 40% increase in productivity\n💰 60% reduction in costs\n⚡ 5x faster decision making\n\nDon't get left behind. DM us to learn how we can transform your operations.\n\n#ArtificialIntelligence #BusinessGrowth",
  ],
  email: [
    "Subject: You're invited: Exclusive AI demo 🎉\n\nHi [First Name],\n\nI wanted to personally reach out because I noticed you've been exploring AI solutions for your business.\n\nWe've helped 200+ companies just like yours automate their workflows and cut costs by an average of 40%.\n\nWould you be open to a quick 15-minute call this week? I'd love to show you exactly how we can help.\n\nBest,\n[Your Name]\n\nP.S. - Reply 'DEMO' for instant access to our interactive platform tour.",
    "Subject: Quick question about [Company Name]\n\nHi [First Name],\n\nI've been following [Company Name]'s growth and I'm impressed with what you're building.\n\nI'm curious - are you currently using any AI automation tools? We've been helping similar companies save 15+ hours per week on repetitive tasks.\n\nWorth a conversation?\n\nCheers,\n[Your Name]",
  ],
  blog: [
    "# How AI is Revolutionizing Small Business Operations in 2025\n\nIn today's fast-paced business environment, staying competitive means embracing technology that works for you, not against you. Artificial Intelligence has evolved from a buzzword to a business necessity, and small businesses are finally reaping the benefits.\n\n## The New Reality of AI\n\nGone are the days when AI was exclusive to tech giants with deep pockets. Today's AI tools are accessible, affordable, and incredibly powerful...",
    "# 5 AI Automation Strategies That Actually Work\n\nLet's cut through the noise. You've heard the AI hype, but what actually delivers results?\n\nAfter working with hundreds of businesses, we've identified the automation strategies that consistently outperform. Here's what separates the winners from the also-rans...",
  ],
  ad: [
    "🎯 Headline: Cut Your Workload in Half with AI\n\n📝 Primary Text:\nTired of repetitive tasks eating up your day? Our AI automation platform handles the busy work so you can focus on what matters.\n\n✅ 24/7 customer support automation\n✅ Instant lead qualification\n✅ Smart scheduling & reminders\n\n🔗 CTA: Start Free Trial\n\n💡 Audience: Business owners, 25-55, interested in productivity tools",
    "🎯 Headline: Your Competitors Are Using AI. Are You?\n\n📝 Primary Text:\n87% of businesses report that AI gives them a competitive advantage. Don't get left behind.\n\nOur platform deploys in 48 hours. No coding required.\n\n🔗 CTA: Book Demo\n\n💡 Audience: C-suite executives, startup founders, operations managers",
  ],
  product: [
    "**AI Customer Support Agent**\n\nTransform your customer service with our intelligent AI agent that never sleeps.\n\n🔹 Handles 80% of queries automatically\n🔹 Learns from every interaction\n🔹 Seamless human handoff when needed\n🔹 Multilingual support (50+ languages)\n🔹 Integrates with your existing tools\n\nPricing: Starting at $299/month\nSetup: 48-hour deployment\nROI: 300% average return",
    "**Workflow Automation Suite**\n\nThe end-to-end platform that connects your entire tech stack and automates complex workflows.\n\n🔹 500+ app integrations\n🔹 Visual workflow builder\n🔹 AI-powered decision making\n🔹 Real-time analytics dashboard\n🔹 Enterprise-grade security\n\nPerfect for teams of 10-500 looking to scale operations without scaling headcount.",
  ],
};

export const ContentGeneratorDemo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ContentType>('social');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedContent(null);

    // Simulate AI generation with typing effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    const outputs = sampleOutputs[selectedType];
    const randomOutput = outputs[Math.floor(Math.random() * outputs.length)];
    
    const newContent: GeneratedContent = {
      id: Date.now().toString(),
      type: selectedType,
      content: randomOutput,
      timestamp: new Date(),
    };

    setGeneratedContent(newContent);
    setHistory(prev => [newContent, ...prev].slice(0, 5));
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    await navigator.clipboard.writeText(generatedContent.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerate = () => {
    generateContent();
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 mb-6"
            >
              <Wand2 className="h-4 w-4 text-pink-400" />
              <span className="text-sm text-pink-300">AI Content Generator Demo</span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              AI Content Creation
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Generate professional marketing copy, social posts, emails, and more 
              with our AI content engine.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6">Create Content</h3>
              
              {/* Content Type Selector */}
              <div className="mb-6">
                <label className="text-sm text-white/40 mb-2 block">Content Type</label>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedType === type.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {type.icon}
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="text-sm text-white/40 mb-2 block">Describe what you need</label>
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={contentTypes.find(t => t.id === selectedType)?.placeholder}
                  rows={4}
                  className="w-full bg-white/5 text-white placeholder-white/20 rounded-xl p-4 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateContent}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Content
                  </>
                )}
              </button>

              {/* Quick Prompts */}
              <div className="mt-6">
                <p className="text-xs text-white/30 mb-2">Quick prompts:</p>
                <div className="flex flex-wrap gap-2">
                  {['New product launch', 'Holiday promotion', 'Company milestone'].map((quick) => (
                    <button
                      key={quick}
                      onClick={() => setPrompt(quick)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {quick}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Output Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Generated Content</h3>
                {generatedContent && (
                  <div className="flex gap-2">
                    <button
                      onClick={regenerate}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      title="Copy"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>

              <div className="min-h-[300px] bg-white/5 rounded-xl p-4 border border-white/10">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full py-16"
                    >
                      <div className="relative">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center animate-pulse">
                          <Bot className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <p className="mt-4 text-white/60">AI is crafting your content...</p>
                    </motion.div>
                  ) : generatedContent ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="whitespace-pre-wrap text-white/80 leading-relaxed"
                    >
                      {generatedContent.content}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full py-16 text-center"
                    >
                      <MessageSquare className="h-12 w-12 text-white/10 mb-4" />
                      <p className="text-white/30">Your AI-generated content will appear here</p>
                      <p className="text-sm text-white/20 mt-2">Enter a prompt and click Generate</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs text-white/30 mb-2">Recent generations:</p>
                  <div className="space-y-2">
                    {history.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setGeneratedContent(item)}
                        className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/40">{contentTypes.find(t => t.id === item.type)?.name}</span>
                          <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40 transition-colors" />
                        </div>
                        <p className="text-sm text-white/60 truncate mt-1">{item.content.substring(0, 60)}...</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-white/40 mb-4">Ready to scale your content creation?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/demos')}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                ← Back to Demos
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold transition-all"
              >
                Get Full Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
