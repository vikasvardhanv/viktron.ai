import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, Cpu, BarChart3, Sparkles, ArrowRight
} from 'lucide-react';

interface ServicesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_CATEGORIES = [
  {
    title: 'Agent',
    description: 'Deploy autonomous AI agents for sales, support, content & operations.',
    icon: Users,
    color: 'blue',
    link: '/onboarding',
  },
  {
    title: 'AgentIRL',
    description: 'Enterprise infrastructure for orchestration, monitoring & scaling.',
    icon: Cpu,
    color: 'indigo',
    link: '/services/agentirl',
  },
  {
    title: 'Analytics + Consulting',
    description: 'Track performance and optimize your AI-powered business.',
    icon: BarChart3,
    color: 'emerald',
    link: 'https://analytics.viktron.ai',
    external: true,
  },
  {
    title: 'Rentals',
    description: 'Rent pre-built AI agents by the hour—no setup required.',
    icon: Sparkles,
    color: 'purple',
    link: '/rent',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', hover: 'hover:text-blue-700' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', hover: 'hover:text-indigo-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', hover: 'hover:text-emerald-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', hover: 'hover:text-purple-700' },
};

export const ServicesPopup: React.FC<ServicesPopupProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          onMouseLeave={onClose}
          className="absolute top-full left-0 mt-2 w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[61] overflow-hidden"
        >
          <div className="p-4 space-y-2">
            {SERVICE_CATEGORIES.map((category, idx) => {
              const colors = colorMap[category.color];
              const LinkComponent = category.external ? 'a' : Link;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {category.external ? (
                    <a
                      href={category.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className={`flex items-start gap-4 p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all group cursor-pointer`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <category.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-bold text-slate-900 ${colors.hover} transition-colors`}>
                          {category.title}
                        </div>
                        <div className="text-xs text-slate-600 leading-snug mt-0.5">
                          {category.description}
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${colors.text} shrink-0 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100`} />
                    </a>
                  ) : (
                    <Link
                      to={category.link}
                      onClick={onClose}
                      className={`flex items-start gap-4 p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all group`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <category.icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-bold text-slate-900 ${colors.hover} transition-colors`}>
                          {category.title}
                        </div>
                        <div className="text-xs text-slate-600 leading-snug mt-0.5">
                          {category.description}
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${colors.text} shrink-0 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100`} />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-50">
            <Link
              to="/services"
              onClick={onClose}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All Services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { SERVICE_CATEGORIES };
