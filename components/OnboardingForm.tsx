import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { OnboardingRequest } from '../services/onboardingService';
import { Button } from './ui/Button';

interface OnboardingFormProps {
  onSubmit: (data: OnboardingRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const [formData, setFormData] = useState<OnboardingRequest>({
    tier: 'growth',
    company_name: '',
    company_size: '1-10',
    industry: '',
    contact_name: '',
    contact_email: '',
    use_cases: [],
  });

  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  const useCaseOptions = [
    { id: 'sales_automation', label: 'Sales Automation' },
    { id: 'customer_support', label: 'Customer Support' },
    { id: 'content_creation', label: 'Content Creation' },
    { id: 'lead_generation', label: 'Lead Generation' },
    { id: 'workflow_automation', label: 'Workflow Automation' },
    { id: 'data_analysis', label: 'Data Analysis' },
  ];

  const tierOptions = [
    { id: 'starter', label: 'Starter', desc: '1 AI Agent' },
    { id: 'growth', label: 'Growth', desc: '4 AI Agents' },
    { id: 'enterprise', label: 'Enterprise', desc: 'Full Team + Custom' },
    { id: 'custom', label: 'Custom', desc: 'Bespoke Solution' },
  ];

  const companySizeOptions = [
    { id: '1-10', label: '1-10 employees' },
    { id: '11-50', label: '11-50 employees' },
    { id: '51-200', label: '51-200 employees' },
    { id: '200-500', label: '200-500 employees' },
    { id: '500+', label: '500+ employees' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleUseCase = (useCase: string) => {
    const updated = selectedUseCases.includes(useCase)
      ? selectedUseCases.filter(u => u !== useCase)
      : [...selectedUseCases, useCase];
    setSelectedUseCases(updated);
    setFormData(prev => ({ ...prev, use_cases: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}

      {/* Tier Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-900">Plan Tier</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {tierOptions.map(tier => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, tier: tier.id as any }))}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.tier === tier.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-blue-200'
              }`}
            >
              <div className="font-medium text-slate-900">{tier.label}</div>
              <div className="text-sm text-slate-500">{tier.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Company Info */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-900">Company Information</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Company Name *</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Acme Corporation"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Industry *</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              required
              placeholder="e.g., SaaS, Healthcare, Finance"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Company Size *</label>
            <select
              name="company_size"
              value={formData.company_size}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 outline-none transition-colors"
            >
              {companySizeOptions.map(size => (
                <option key={size.id} value={size.id}>{size.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-900">Contact Information</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Full Name *</label>
            <input
              type="text"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleInputChange}
              required
              placeholder="Your full name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Email *</label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              required
              placeholder="you@company.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-900">What will your AI agents handle?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {useCaseOptions.map(useCase => (
            <button
              key={useCase.id}
              type="button"
              onClick={() => toggleUseCase(useCase.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left font-medium text-sm ${
                selectedUseCases.includes(useCase.id)
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedUseCases.includes(useCase.id)
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-slate-300'
                }`}>
                  {selectedUseCases.includes(useCase.id) && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                {useCase.label}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">Select at least one use case</p>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !selectedUseCases.length}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Provisioning Agents...
            </>
          ) : (
            <>
              Provision AI Agents
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-xs text-slate-500">This usually takes 30-60 seconds</p>
      </div>
    </form>
  );
};
