import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { sendSMS, formatPhoneNumber, isValidPhoneNumber } from '../services/twilioService';
import { useAuth } from '../context/AuthContext';

export type SendSMSModalStatus = 'idle' | 'sending' | 'success' | 'error';

type SendSMSModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipientPhone?: string;
  onSuccess?: (messageId?: string) => void;
};

export const SendSMSModal: React.FC<SendSMSModalProps> = ({
  isOpen,
  onClose,
  recipientPhone = '',
  onSuccess,
}) => {
  const { isAuthenticated, setShowAuthModal } = useAuth();
  const [status, setStatus] = useState<SendSMSModalStatus>('idle');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState(recipientPhone);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check authentication when modal opens
  React.useEffect(() => {
    if (isOpen && !isAuthenticated) {
      // Redirect to login
      setShowAuthModal(true);
      onClose();
    }
  }, [isOpen, isAuthenticated, setShowAuthModal, onClose]);

  const handleSendSMS = async () => {
    setError('');
    setSuccessMessage('');

    // Validation
    if (!phone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    if (message.length > 160) {
      setError('Message is too long (max 160 characters)');
      return;
    }

    setStatus('sending');

    try {
      const formattedPhone = formatPhoneNumber(phone);
      const response = await sendSMS({
        to: formattedPhone,
        message: message,
      });

      if (response.success) {
        setStatus('success');
        setSuccessMessage(`SMS sent successfully to ${phone}`);
        setMessage('');
        setPhone(recipientPhone);
        onSuccess?.(response.messageId);

        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
        setError(response.error || 'Failed to send SMS');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (!isOpen || !isAuthenticated) return null;

  const title =
    status === 'sending'
      ? 'Sending SMS…'
      : status === 'success'
      ? 'SMS Sent!'
      : status === 'error'
      ? 'SMS Failed'
      : 'Send SMS';

  const icon =
    status === 'sending' ? (
      <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
    ) : status === 'success' ? (
      <CheckCircle className="h-8 w-8 text-emerald-400" />
    ) : status === 'error' ? (
      <AlertCircle className="h-8 w-8 text-red-400" />
    ) : (
      <Send className="h-8 w-8 text-sky-400" />
    );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={status === 'sending' || status === 'success' ? undefined : onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="p-8" tilt={false}>
            <button
              onClick={onClose}
              disabled={status === 'sending' || status === 'success'}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {status === 'idle' || status === 'sending' || status === 'error' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                    {icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{title}</h3>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError('');
                    }}
                    disabled={status === 'sending'}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-white/80">
                      Message
                    </label>
                    <span className="text-xs text-white/50">
                      {message.length}/160
                    </span>
                  </div>
                  <textarea
                    placeholder="Type your message (max 160 characters)"
                    value={message}
                    onChange={(e) => {
                      const text = e.target.value.slice(0, 160);
                      setMessage(text);
                      setError('');
                    }}
                    disabled={status === 'sending'}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Send Button */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={onClose}
                    disabled={status === 'sending'}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendSMS}
                    disabled={status === 'sending' || !phone || !message}
                    className="flex-1"
                    icon={status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send SMS'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                  {icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/60 mb-6">
                  {status === 'success'
                    ? successMessage
                    : 'There was an error sending your SMS. Please try again.'}
                </p>

                <Button
                  onClick={onClose}
                  variant="secondary"
                  className="w-full"
                >
                  {status === 'success' ? 'Close' : 'Try Again'}
                </Button>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
