import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Briefcase, BookOpen, ArrowRight, Bot } from 'lucide-react';

interface AboutPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ABOUT_LINKS = [
  {
    icon: Users,
    label: 'Mission',
    desc: 'The Viktron story and our infrastructure goals.',
    path: '/about',
  },
  {
    icon: Bot,
    label: 'Rent an Agent',
    desc: 'Browse and deploy our specialized digital workforce.',
    path: '/rent',
  },
  {
    icon: Briefcase,
    label: 'Careers',
    desc: 'Join the infrastructure revolution.',
    path: '/careers',
  },
  {
    icon: BookOpen,
    label: 'Blog',
    desc: 'Intelligence reports and engineering logs.',
    path: '/blog',
  },
];

export const AboutPopup: React.FC<AboutPopupProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-full left-0 mt-4 w-[280px] obsidian-panel p-2 z-[100] bg-[#080808]/95 backdrop-blur-xl"
        >
          <div className="space-y-1">
            {ABOUT_LINKS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                >
                  <div className="w-8 h-8 obsidian-inset flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono font-bold text-white uppercase tracking-widest group-hover:text-primary transition-colors">
                      {item.label}
                    </div>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight mt-0.5 line-clamp-1">
                      {item.desc}
                    </div>
                  </div>
                  <ArrowRight size={12} className="text-zinc-800 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
