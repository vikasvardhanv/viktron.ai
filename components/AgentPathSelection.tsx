import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, ShoppingCart, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AgentPathSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentPathSelection: React.FC<AgentPathSelectionProps> = ({ isOpen, onClose }) => {
  const paths = [
    {
      icon: Zap,
      title: 'Self-Service',
      description: 'Deploy your own AI agents with our intuitive setup wizard. Best for technical teams ready to build immediately.',
      action: 'Start Self-Service',
      link: '/onboarding',
      color: 'blue'
    },
    {
      icon: ShoppingCart,
      title: 'Rentals',
      description: 'Rent pre-built AI agents by the hour. Perfect for trials, testing, or scaling without long-term commitment.',
      action: 'Browse Rentals',
      link: '/rent',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Enterprise',
      description: 'Talk to our team. Custom deployment, integrations, and dedicated support for enterprise customers.',
      action: 'Contact Sales',
      link: '/contact',
      color: 'indigo'
    },
    {
      icon: BookOpen,
      title: 'Learn More',
      description: 'Explore documentation, case studies, and demos to understand how Viktron AI can solve your challenges.',
      action: 'View Resources',
      link: '/use-cases',
      color: 'emerald'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Choose Your Path</h2>
                  <p className="text-sm text-slate-600 mt-1">Select how you'd like to get started with Viktron AI</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paths.map((path, idx) => {
                    const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
                      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
                      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
                      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
                      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
                    };
                    const colors = colorMap[path.color] || colorMap.blue;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`rounded-xl border ${colors.border} ${colors.bg} p-6 hover:shadow-md transition-shadow cursor-pointer group`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <path.icon className={`w-5 h-5 ${colors.text}`} />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2">{path.title}</h3>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{path.description}</p>

                        <Link
                          to={path.link}
                          onClick={onClose}
                          className={`inline-flex items-center gap-2 text-sm font-semibold ${colors.text} hover:opacity-75 transition-opacity`}
                        >
                          {path.action} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 p-6 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Not sure which path?</span> Chat with our team at{' '}
                    <a href="mailto:hello@viktron.ai" className="text-blue-600 hover:underline">
                      hello@viktron.ai
                    </a>
                    {' '}or call{' '}
                    <a href="tel:+1-555-VIKTRON" className="text-blue-600 hover:underline">
                      +1-555-VIKTRON
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
