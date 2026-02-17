import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Briefcase, BookOpen, ArrowRight } from 'lucide-react';

interface AboutPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ABOUT_LINKS = [
  {
    icon: Users,
    label: 'About',
    desc: 'Our mission, team, and the AgentIRL story.',
    path: '/about',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    icon: Briefcase,
    label: 'Careers',
    desc: 'Join us and help build the future of AI agents.',
    path: '/careers',
    bg: 'bg-purple-50',
    color: 'text-purple-600',
  },
  {
    icon: BookOpen,
    label: 'Blog & Resources',
    desc: 'Guides, case studies, and AI agent insights.',
    path: '/blog',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
  },
];

export const AboutPopup: React.FC<AboutPopupProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          onMouseLeave={onClose}
          className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-xl shadow-xl border border-slate-200 z-[61] overflow-hidden"
        >
          <div className="py-2">
            {ABOUT_LINKS.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors block">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-500 leading-tight line-clamp-1">
                    {item.desc}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
