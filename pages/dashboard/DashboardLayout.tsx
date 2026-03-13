import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, GitBranch, Radio, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const C = {
  bg: '#09090f', sidebar: '#0f0f17', border: '#1e1e2e',
  accent: '#0ea5e9', purple: '#a855f7', muted: '#6b7280',
};

const navItems = [
  { to: '/dashboard', label: 'Agent Monitor', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/workflow', label: 'Workflow Builder', icon: GitBranch, exact: false },
  { to: '/dashboard/channels', label: 'Channel Setup', icon: Radio, exact: false },
];

interface Props { children: React.ReactNode; teamName?: string; }

export const DashboardLayout: React.FC<Props> = ({ children, teamName }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: C.bg }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 w-60 border-r"
        style={{ background: C.sidebar, borderColor: C.border }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: C.border }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#0ea5e9,#a855f7)' }}
          >V</div>
          <div>
            <div className="text-white font-semibold text-sm">Viktron</div>
            {teamName && <div className="text-xs truncate" style={{ color: C.muted }}>{teamName}</div>}
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to} to={to} end={exact}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group"
              style={({ isActive }) => ({
                background: isActive ? 'rgba(14,165,233,0.12)' : 'transparent',
                color: isActive ? C.accent : C.muted,
              })}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={13} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t space-y-2" style={{ borderColor: C.border }}>
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#a855f7,#0ea5e9)' }}
              >
                {user.fullName?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">{user.fullName}</div>
                <div className="text-xs truncate" style={{ color: C.muted }}>{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full hover:text-red-400 transition-colors"
            style={{ color: C.muted }}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
