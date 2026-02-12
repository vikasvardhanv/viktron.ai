import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, Clock, User, Mail, Phone, Loader2,
  CheckCircle, AlertCircle, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Send
} from 'lucide-react';
import {
  scheduleAppointment,
  getAvailableSlots,
  getMinDate,
  getMaxDate,
  formatTime12Hour,
  formatDateForDisplay,
  formatDate,
  SchedulingResponse
} from '../services/schedulingService';
import { useAuth } from '../context/AuthContext';
import { sendSMS } from '../services/twilioService';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillName?: string;
  prefillEmail?: string;
  source?: string;
}

type ModalStep = 'calendar' | 'time' | 'details' | 'loading' | 'success' | 'error';

export const SchedulingModal: React.FC<SchedulingModalProps> = ({
  isOpen,
  onClose,
  prefillName = '',
  prefillEmail = '',
  source = 'website'
}) => {
  const { isAuthenticated, setShowAuthModal } = useAuth();
  const [step, setStep] = useState<ModalStep>('calendar');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const getFirstOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);
  const [currentMonth, setCurrentMonth] = useState(getFirstOfMonth());
  // Cache: { [date: string]: string[] }
  const slotsCache = useRef<{ [date: string]: string[] }>({});
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [formData, setFormData] = useState({
    name: prefillName,
    email: prefillEmail,
    phone: '',
  });
  const [response, setResponse] = useState<SchedulingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication when modal opens
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      setShowAuthModal(true);
      onClose();
    }
  }, [isOpen, isAuthenticated, setShowAuthModal, onClose]);

  // Prefetch all available slots for the visible month with throttling
  useEffect(() => {
    // DISABLED: Prefetching was causing 429 rate limit errors
    // Instead, we load slots on-demand when user selects a date
    // This prevents hammering the Modal API with simultaneous requests
  }, [currentMonth]);

  // Load available slots from cache when date is selected
  useEffect(() => {
    if (selectedDate) {
      setIsLoadingSlots(true);
      setAvailableSlots([]);
      // Use cache if available, otherwise fetch
      const cached = slotsCache.current[selectedDate];
      if (cached) {
        setAvailableSlots(cached);
        setStep('time');
        setIsLoadingSlots(false);
      } else {
        getAvailableSlots(selectedDate)
          .then(slots => {
            slotsCache.current[selectedDate] = slots;
            setAvailableSlots(slots);
            setStep('time');
          })
          .finally(() => setIsLoadingSlots(false));
      }
    }
  }, [selectedDate]);

  // Reset form and cache when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('calendar');
      setSelectedDate('');
      setSelectedTime('');
      setCurrentMonth(getFirstOfMonth());
      setFormData({
        name: prefillName,
        email: prefillEmail,
        phone: '',
      });
      setResponse(null);
      setError(null);
      setIsLoadingSlots(false);
      slotsCache.current = {}; // Clear cache on open
    }
  }, [isOpen, prefillName, prefillEmail]);

  // Calendar helpers
  const minDate = new Date(getMinDate());
  const maxDate = new Date(getMaxDate());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay, year, month };
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date < minDate || date > maxDate;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(date) && !isWeekend(date)) {
      setSelectedDate(formatDate(date));
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      // Always set to the 1st of the month to avoid skipping months
      const base = new Date(prev.getFullYear(), prev.getMonth(), 1);
      if (direction === 'prev') {
        base.setMonth(base.getMonth() - 1);
      } else {
        base.setMonth(base.getMonth() + 1);
      }
      return base;
    });
  };

  const canNavigatePrev = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  };

  const canNavigateNext = () => {
    // Always use the first day of the current month for navigation math
    const baseMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const nextMonth = new Date(baseMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const year = nextMonth.getFullYear();
    const month = nextMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let found = false;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date >= minDate && date <= maxDate) {
        found = true;
        break;
      }
    }
    // Debug log
    console.log('[canNavigateNext]', {
      currentMonth: currentMonth.toISOString(),
      nextMonth: nextMonth.toISOString(),
      minDate: minDate.toISOString(),
      maxDate: maxDate.toISOString(),
      found
    });
    return found;
  };

  const handleDateTimeNext = () => {
    if (selectedDate && selectedTime) {
      setStep('details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setError(null);

    try {
      const result = await scheduleAppointment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        date: selectedDate,
        time: selectedTime,
        service: 'AI Consultation',
        duration: 60,
        send_email: true,
        send_sms: !!formData.phone,
      });

      if (result.success) {
        // Send SMS notification if phone provided
        if (formData.phone) {
          const smsMessage = `Hi ${formData.name}, your consultation with Viktron.ai is scheduled for ${formatDateForDisplay(selectedDate)} at ${formatTime12Hour(selectedTime)}. We'll call you at this number. Reply STOP to unsubscribe.`;
          await sendSMS({
            to: formData.phone,
            message: smsMessage,
          });
        }

        setResponse(result);
        setStep('success');
      } else {
        setError(result.error || 'Failed to schedule appointment');
        setStep('error');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('calendar');
    onClose();
  };

  if (!isOpen || !isAuthenticated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-sky-500/20 to-purple-500/20 border-b border-white/10 sticky top-0 z-10">
            <button
              onClick={handleClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <img 
                src="/viktron-icon.svg" 
                alt="Viktron.ai" 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-contain"
              />
              <div>
                <h2 className="text-xl font-bold text-white">Book Consultation</h2>
                <p className="text-sm text-white/50">Schedule a call with our AI experts</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Calendar Step */}
            {step === 'calendar' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Timezone Notice */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    All times are in CST (Central Standard Time)
                  </p>
                </div>

                {/* Calendar Header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth('prev')}
                    disabled={!canNavigatePrev()}
                    style={{ visibility: 'visible' }}
                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>
                  <h3 className="text-lg font-semibold text-white">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => navigateMonth('next')}
                    disabled={!canNavigateNext()}
                    style={{ visibility: 'visible' }}
                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-white/50 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const { daysInMonth, startingDay, year, month } = getDaysInMonth(currentMonth);
                      const days = [];

                      // Empty cells for days before the first of the month
                      for (let i = 0; i < startingDay; i++) {
                        days.push(<div key={`empty-${i}`} className="aspect-square" />);
                      }

                      // Days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day);
                        const dateStr = formatDate(date);
                        const disabled = isDateDisabled(date) || isWeekend(date);
                        const isSelected = selectedDate === dateStr;
                        const isToday = formatDate(new Date()) === dateStr;

                        days.push(
                          <button
                            key={day}
                            onClick={() => handleDateSelect(day)}
                            disabled={disabled}
                            className={`
                              aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center
                              ${disabled 
                                ? 'text-white/20 cursor-not-allowed' 
                                : isSelected
                                  ? 'bg-sky-500 text-white'
                                  : isToday
                                    ? 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
                                    : 'text-white hover:bg-white/10'
                              }
                            `}
                          >
                            {day}
                          </button>
                        );
                      }

                      return days;
                    })()}
                  </div>
                </div>

                {/* Loading indicator */}
                {isLoadingSlots && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-3 py-4"
                  >
                    <Loader2 className="h-5 w-5 text-sky-400 animate-spin" />
                    <span className="text-white/60 text-sm">Loading available times...</span>
                  </motion.div>
                )}

                <p className="text-xs text-white/40 text-center">
                  Weekends are unavailable • Select a weekday to view times
                </p>
              </motion.div>
            )}

            {/* Time Selection Step */}
            {step === 'time' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <button
                  onClick={() => {
                    setStep('calendar');
                    setSelectedDate('');
                    setSelectedTime('');
                  }}
                  className="text-sm text-white/50 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to calendar
                </button>

                {/* Selected Date Display */}
                <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-sky-400">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {formatDateForDisplay(selectedDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-sky-400" />
                    Select Time (CST)
                  </label>

                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center gap-3 py-8">
                      <Loader2 className="h-6 w-6 text-sky-400 animate-spin" />
                      <span className="text-white/60">Loading available times...</span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                      <p className="text-white/60">No available slots for this date.</p>
                      <button
                        onClick={() => {
                          setStep('calendar');
                          setSelectedDate('');
                        }}
                        className="mt-3 text-sky-400 hover:text-sky-300 text-sm"
                      >
                        Choose another date
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 px-2 sm:px-3 rounded-lg text-sm font-medium transition-all ${
                            selectedTime === slot
                              ? 'bg-sky-500 text-white ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0f172a]'
                              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          {formatTime12Hour(slot)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleDateTimeNext}
                  disabled={!selectedTime}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-white/30 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {/* Details Step */}
            {step === 'details' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <button
                  onClick={() => setStep('time')}
                  className="text-sm text-white/50 hover:text-white mb-4 flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {/* Selected Date/Time Display */}
                <div className="mb-6 p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-sky-400">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateForDisplay(selectedDate, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sky-400">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime12Hour(selectedTime)} CST</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-sky-400" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-sky-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-sky-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        let value = e.target.value;
                        // Auto-prepend +1 if user starts typing a number
                        if (value && !value.startsWith('+')) {
                          value = '+1' + value.replace(/^\+?1?/, '');
                        }
                        setFormData({ ...formData, phone: value });
                      }}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Confirm Booking
                  </button>
                </form>
              </motion.div>
            )}

            {/* Loading Step */}
            {step === 'loading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <Loader2 className="h-12 w-12 text-sky-400 animate-spin mx-auto mb-4" />
                <p className="text-white/70">Scheduling your appointment...</p>
                <p className="text-sm text-white/40 mt-2">Creating calendar event and Zoom meeting</p>
              </motion.div>
            )}

            {/* Success Step */}
            {step === 'success' && response && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">You're All Set!</h3>
                <p className="text-white/60 mb-4">
                  Your consultation has been scheduled.
                </p>

                {/* Appointment Details */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="h-4 w-4 text-sky-400" />
                      <span>{formatDateForDisplay(selectedDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Clock className="h-4 w-4 text-sky-400" />
                      <span>{formatTime12Hour(selectedTime)} CST</span>
                    </div>
                    {response.confirmations?.zoom?.join_url && (
                      <div className="pt-2 border-t border-white/10 mt-2">
                        <a
                          href={response.confirmations.zoom.join_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:text-sky-300 underline text-sm"
                        >
                          Join Zoom Meeting
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-white/40 mb-6">
                  Check your email for confirmation and calendar invite.
                </p>

                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}

            {/* Error Step */}
            {step === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Scheduling Failed</h3>
                <p className="text-white/60 mb-4">
                  {error || 'Something went wrong. Please try again.'}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setStep('details')}
                    className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SchedulingModal;
