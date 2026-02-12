import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/layout/Layout';
import { 
  Bot, Play, Pause, Brain, Cpu, BarChart3,
  Database, Upload, CheckCircle, AlertCircle, 
  Zap, RefreshCw, Settings, LineChart, Target,
  TrendingUp, Clock, Layers, ArrowRight
} from 'lucide-react';

interface TrainingStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed';
  progress: number;
  details?: string;
}

interface ModelMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
}

const industryTemplates = [
  { id: 'retail', name: 'Retail', desc: 'Product recommendations, inventory predictions' },
  { id: 'healthcare', name: 'Healthcare', desc: 'Patient triage, appointment optimization' },
  { id: 'finance', name: 'Finance', desc: 'Fraud detection, credit scoring' },
  { id: 'marketing', name: 'Marketing', desc: 'Lead scoring, campaign optimization' },
];

export const CustomModelDemo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(industryTemplates[0]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [steps, setSteps] = useState<TrainingStep[]>([
    { id: 'data', name: 'Data Preparation', status: 'pending', progress: 0 },
    { id: 'feature', name: 'Feature Engineering', status: 'pending', progress: 0 },
    { id: 'training', name: 'Model Training', status: 'pending', progress: 0 },
    { id: 'validation', name: 'Validation', status: 'pending', progress: 0 },
    { id: 'deployment', name: 'Deployment', status: 'pending', progress: 0 },
  ]);
  const [metrics, setMetrics] = useState<ModelMetric[]>([
    { name: 'Accuracy', value: 0, target: 95, unit: '%' },
    { name: 'Precision', value: 0, target: 92, unit: '%' },
    { name: 'Recall', value: 0, target: 88, unit: '%' },
    { name: 'F1 Score', value: 0, target: 90, unit: '%' },
  ]);
  const [lossHistory, setLossHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!isTraining) return;

    const stepDurations = [1500, 2000, 4000, 1500, 1000];
    let totalTime = 0;
    const timers: NodeJS.Timeout[] = [];

    steps.forEach((step, index) => {
      // Start step
      timers.push(setTimeout(() => {
        setSteps(prev => prev.map((s, i) => 
          i === index ? { ...s, status: 'running' as const } : s
        ));
      }, totalTime));

      // Progress updates during step
      const progressInterval = stepDurations[index] / 10;
      for (let p = 1; p <= 10; p++) {
        timers.push(setTimeout(() => {
          setSteps(prev => prev.map((s, i) => 
            i === index ? { ...s, progress: p * 10 } : s
          ));
          
          // Update epoch during training step
          if (index === 2) {
            setEpoch(Math.floor(p * 5));
            // Add to loss history
            const loss = 2.5 * Math.exp(-p * 0.3) + 0.1 + Math.random() * 0.1;
            setLossHistory(prev => [...prev, loss]);
          }
        }, totalTime + progressInterval * p));
      }

      // Complete step
      totalTime += stepDurations[index];
      timers.push(setTimeout(() => {
        setSteps(prev => prev.map((s, i) => 
          i === index ? { ...s, status: 'completed' as const, progress: 100 } : s
        ));
        
        // Update metrics progressively
        if (index >= 2) {
          setMetrics(prev => prev.map(m => ({
            ...m,
            value: Math.min(m.target, m.value + (m.target * 0.3) + Math.random() * 10)
          })));
        }
      }, totalTime));
    });

    // Complete training
    timers.push(setTimeout(() => {
      setIsTraining(false);
      setTrainingComplete(true);
      setMetrics([
        { name: 'Accuracy', value: 96.4, target: 95, unit: '%' },
        { name: 'Precision', value: 94.2, target: 92, unit: '%' },
        { name: 'Recall', value: 91.8, target: 88, unit: '%' },
        { name: 'F1 Score', value: 93.0, target: 90, unit: '%' },
      ]);
    }, totalTime + 500));

    return () => timers.forEach(clearTimeout);
  }, [isTraining]);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingComplete(false);
    setEpoch(0);
    setLossHistory([]);
    setSteps(steps.map(s => ({ ...s, status: 'pending' as const, progress: 0 })));
    setMetrics(metrics.map(m => ({ ...m, value: 0 })));
  };

  const resetDemo = () => {
    setIsTraining(false);
    setTrainingComplete(false);
    setEpoch(0);
    setLossHistory([]);
    setSteps(steps.map(s => ({ ...s, status: 'pending' as const, progress: 0 })));
    setMetrics(metrics.map(m => ({ ...m, value: 0 })));
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6"
            >
              <Brain className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-amber-300">Custom AI Model Training Demo</span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Custom Model Training
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Train AI models tailored to your specific business data and use cases. 
              Watch the training process in real-time.
            </p>
          </div>

          {/* Template Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {industryTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => !isTraining && setSelectedTemplate(template)}
                disabled={isTraining}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedTemplate.id === template.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Training Pipeline */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-2">Training Pipeline</h3>
              <p className="text-sm text-white/40 mb-6">{selectedTemplate.desc}</p>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all ${
                      step.status === 'running'
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : step.status === 'completed'
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {step.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : step.status === 'running' ? (
                          <RefreshCw className="h-4 w-4 text-amber-400 animate-spin" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-white/20" />
                        )}
                        <span className={`text-sm font-medium ${
                          step.status === 'running' ? 'text-amber-300' :
                          step.status === 'completed' ? 'text-emerald-300' : 'text-white/60'
                        }`}>
                          {step.name}
                        </span>
                      </div>
                      <span className="text-xs text-white/40">{step.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${
                          step.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${step.progress}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Training Stats */}
              {(isTraining || trainingComplete) && (
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-amber-400">{epoch}</p>
                      <p className="text-xs text-white/40">Epochs</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-400">
                        {lossHistory.length > 0 ? lossHistory[lossHistory.length - 1].toFixed(3) : '---'}
                      </p>
                      <p className="text-xs text-white/40">Loss</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="mt-6">
                <button
                  onClick={trainingComplete ? resetDemo : startTraining}
                  disabled={isTraining}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isTraining 
                      ? 'bg-amber-500/20 text-amber-400'
                      : trainingComplete
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400'
                  }`}
                >
                  {isTraining ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Training in Progress...
                    </>
                  ) : trainingComplete ? (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Train Another Model
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Training
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Metrics Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-panel rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Model Performance</h3>
                {trainingComplete && (
                  <span className="flex items-center gap-1 text-sm text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    Training Complete
                  </span>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {metrics.map((metric) => (
                  <div 
                    key={metric.name}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">{metric.name}</span>
                      <span className={`text-sm font-mono ${
                        metric.value >= metric.target ? 'text-emerald-400' : 'text-white/40'
                      }`}>
                        Target: {metric.target}{metric.unit}
                      </span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-white">
                        {metric.value.toFixed(1)}
                      </span>
                      <span className="text-lg text-white/40 mb-1">{metric.unit}</span>
                      {metric.value >= metric.target && (
                        <TrendingUp className="h-5 w-5 text-emerald-400 mb-1 ml-auto" />
                      )}
                    </div>
                    <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${
                          metric.value >= metric.target ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (metric.value / 100) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Loss Chart */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/60">Training Loss</span>
                  <LineChart className="h-4 w-4 text-white/40" />
                </div>
                <div className="h-32 flex items-end gap-1">
                  {lossHistory.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                      Loss curve will appear during training
                    </div>
                  ) : (
                    lossHistory.map((loss, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(100, (loss / 3) * 100)}%` }}
                        className="flex-1 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t opacity-80"
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Model Info */}
              {trainingComplete && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/20">
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-emerald-300 mb-1">Model Ready for Deployment</h4>
                      <p className="text-sm text-white/60 mb-3">
                        Your custom {selectedTemplate.name.toLowerCase()} model has been trained and validated. 
                        All performance targets exceeded.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white/60">
                          Model ID: hsm_{selectedTemplate.id}_v1
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white/60">
                          50 Epochs
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white/60">
                          Ready for API
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-4 gap-4 mt-8">
            {[
              { icon: <Database className="h-5 w-5" />, title: 'Your Data', desc: 'Train on proprietary datasets' },
              { icon: <Layers className="h-5 w-5" />, title: 'Transfer Learning', desc: 'Fine-tune existing models' },
              { icon: <Target className="h-5 w-5" />, title: 'Auto-Optimization', desc: 'Hyperparameter tuning' },
              { icon: <Zap className="h-5 w-5" />, title: 'Fast Deployment', desc: 'One-click API deployment' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
              >
                <div className="inline-flex p-2 rounded-lg bg-amber-500/20 text-amber-400 mb-2">
                  {feature.icon}
                </div>
                <h4 className="font-medium text-white text-sm">{feature.title}</h4>
                <p className="text-xs text-white/40 mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-white/40 mb-4">Ready to train models on your data?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/demos')}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                ← Back to Demos
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold transition-all"
              >
                Start Training Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
