import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const AGENT_STATES = [
  { emoji: '🤖', name: 'idle', message: 'Hi! I\'m Viki!' },
  { emoji: '🔍', name: 'searching', message: 'Searching...' },
  { emoji: '💭', name: 'thinking', message: 'Hmmm...' },
  { emoji: '⚡', name: 'excited', message: 'Found it!' },
  { emoji: '😊', name: 'happy', message: 'Nice to meet you!' },
  { emoji: '🚀', name: 'speedy', message: 'Fast!' },
  { emoji: '🎯', name: 'focused', message: 'Gotcha!' },
  { emoji: '✨', name: 'magic', message: 'Magic!' },
];

const PARTICLES = ['💫', '⭐', '✨', '🔮', '🪄', '💎'];

export const MouseAgent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentState, setCurrentState] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  const particleIdRef = useRef(0);
  const trailIdRef = useRef(0);
  const lastMoveTime = useRef(Date.now());
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 15, stiffness: 150, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 15, stiffness: 150, mass: 0.5 });

  const rotate = useTransform(springX, [-100, 100], [-15, 15]);
  const tilt = useTransform(springY, [-100, 100], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const newX = e.clientX;
      const newY = e.clientY;
      
      const vx = newX - lastPosRef.current.x;
      const vy = newY - lastPosRef.current.y;
      velocityRef.current = { x: vx, y: vy };
      lastPosRef.current = { x: newX, y: newY };

      mouseX.set(newX - 24);
      mouseY.set(newY - 24);

      const now = Date.now();
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (now - lastMoveTime.current > 100) {
        if (speed > 15) {
          setCurrentState(5);
        } else if (speed > 8) {
          setCurrentState(6);
        } else {
          setCurrentState(0);
        }
        lastMoveTime.current = now;
      }

      if (Math.random() < 0.3 && speed > 5) {
        const newParticle = {
          id: particleIdRef.current++,
          x: newX + (Math.random() - 0.5) * 40,
          y: newY + (Math.random() - 0.5) * 40,
          emoji: PARTICLES[Math.floor(Math.random() * PARTICLES.length)],
        };
        setParticles(prev => [...prev.slice(-8), newParticle]);
      }

      if (Math.random() < 0.2 && speed > 3) {
        setTrail(prev => [...prev.slice(-12), { id: trailIdRef.current++, x: newX, y: newY }]);
      }
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      setTimeout(() => setShowMessage(true), 500);
    };

    const handleMouseLeave = () => {
      setShowMessage(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  const state = AGENT_STATES[currentState];

  return (
    <>
      {/* Trail effect */}
      {trail.map((point) => (
        <motion.div
          key={point.id}
          initial={{ opacity: 0.4, scale: 0.5 }}
          animate={{ opacity: 0, scale: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none fixed z-[9999]"
          style={{ left: point.x, top: point.y }}
        >
          <div className="w-2 h-2 rounded-full bg-blue-400/50 blur-sm" />
        </motion.div>
      ))}

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 0, scale: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none fixed text-lg z-[9999]"
          style={{ left: particle.x, top: particle.y }}
        >
          {particle.emoji}
        </motion.div>
      ))}

      {/* Main Agent */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: springX,
          top: springY,
          rotate,
          scaleX: useTransform(rotate, [-15, 15], [1, 1]),
        }}
      >
        {/* Agent Body */}
        <motion.div
          animate={{ 
            y: [0, -4, 0],
            scale: currentState === 5 ? 1.2 : 1,
          }}
          transition={{
            y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
            scale: { duration: 0.2 }
          }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 rounded-full blur-xl animate-pulse" />
          
          {/* Agent Container */}
          <div className="relative w-12 h-12">
            {/* Robot Face */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-600 overflow-hidden">
              {/* Screen */}
              <div className="absolute inset-1 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 rounded-lg">
                {/* Eyes */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-3">
                  <motion.div
                    animate={{
                      scaleY: currentState === 2 ? 0.3 : 1,
                    }}
                    className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  />
                  <motion.div
                    animate={{
                      scaleY: currentState === 2 ? 0.3 : 1,
                    }}
                    className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  />
                </div>
                
                {/* Mouth */}
                <motion.div
                  animate={{
                    height: currentState === 2 ? 2 : 4,
                    borderRadius: currentState === 4 ? ['50%', '50%', '50%'] : '2px',
                  }}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-cyan-400/80"
                  style={{ width: 12 }}
                />
              </div>
              
              {/* Antenna */}
              <motion.div
                animate={{ rotate: velocityRef.current.x > 5 ? 20 : velocityRef.current.x < -5 ? -20 : 0 }}
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-600"
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              </motion.div>
            </div>

            {/* Floating emoji overlay */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-6 -right-2 text-xl"
            >
              {state.emoji}
            </motion.div>
          </div>

          {/* Message Bubble */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 10 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full shadow-lg border border-slate-600">
                  {state.message}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 border-r border-b border-slate-600" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Speed lines when moving fast */}
        {currentState === 5 && (
          <div className="absolute top-1/2 -left-8 -translate-y-1/2 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: [0, 1, 0], x: -20 }}
                transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.1 }}
                className="w-6 h-0.5 bg-cyan-400/60 rounded-full"
              />
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
