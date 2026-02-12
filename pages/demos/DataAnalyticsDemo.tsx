import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/layout/Layout';
import { 
  Brain, Sparkles, TrendingUp, BarChart3, PieChart, 
  LineChart, ArrowRight, RefreshCw, Zap, AlertTriangle,
  CheckCircle2, Clock, Target, DollarSign, Users
} from 'lucide-react';

interface Prediction {
  metric: string;
  current: number;
  predicted: number;
  change: number;
  confidence: number;
  insight: string;
}

interface Anomaly {
  id: string;
  type: 'warning' | 'critical' | 'opportunity';
  title: string;
  description: string;
  action: string;
}

const sampleDatasets = [
  { id: 'sales', name: 'Sales Data', icon: <DollarSign className="h-4 w-4" /> },
  { id: 'customers', name: 'Customer Behavior', icon: <Users className="h-4 w-4" /> },
  { id: 'operations', name: 'Operations', icon: <BarChart3 className="h-4 w-4" /> },
];

export const DataAnalyticsDemo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = useState('sales');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const analysisSteps = [
    'Ingesting data streams...',
    'Preprocessing & cleaning...',
    'Running ML models...',
    'Detecting patterns...',
    'Generating predictions...',
    'Identifying anomalies...',
    'Creating insights...',
  ];

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setPredictions([]);
    setAnomalies([]);

    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i);
      await new Promise(resolve => setTimeout(resolve, 700));
    }

    // Generate predictions based on dataset
    const newPredictions: Prediction[] = selectedDataset === 'sales' ? [
      { metric: 'Monthly Revenue', current: 125000, predicted: 148500, change: 18.8, confidence: 94, insight: 'Strong upward trend detected based on seasonal patterns' },
      { metric: 'Conversion Rate', current: 3.2, predicted: 4.1, change: 28.1, confidence: 87, insight: 'Recent marketing changes showing positive impact' },
      { metric: 'Avg Order Value', current: 89, predicted: 102, change: 14.6, confidence: 91, insight: 'Upselling strategy driving higher cart values' },
      { metric: 'Customer LTV', current: 420, predicted: 485, change: 15.5, confidence: 89, insight: 'Improved retention boosting lifetime value' },
    ] : selectedDataset === 'customers' ? [
      { metric: 'Active Users', current: 12500, predicted: 15800, change: 26.4, confidence: 92, insight: 'Viral coefficient increasing acquisition' },
      { metric: 'Churn Rate', current: 5.2, predicted: 3.8, change: -26.9, confidence: 88, insight: 'New features reducing customer attrition' },
      { metric: 'NPS Score', current: 42, predicted: 56, change: 33.3, confidence: 85, insight: 'Customer satisfaction trending upward' },
      { metric: 'Session Duration', current: 4.5, predicted: 6.2, change: 37.8, confidence: 90, insight: 'UI improvements increasing engagement' },
    ] : [
      { metric: 'Efficiency Score', current: 78, predicted: 89, change: 14.1, confidence: 93, insight: 'Automation reducing bottlenecks' },
      { metric: 'Processing Time', current: 24, predicted: 18, change: -25.0, confidence: 91, insight: 'Workflow optimizations taking effect' },
      { metric: 'Error Rate', current: 2.1, predicted: 0.8, change: -61.9, confidence: 86, insight: 'AI validation catching issues earlier' },
      { metric: 'Resource Util.', current: 67, predicted: 82, change: 22.4, confidence: 88, insight: 'Better scheduling improving capacity' },
    ];

    const newAnomalies: Anomaly[] = [
      { id: '1', type: 'opportunity', title: 'Growth Opportunity Detected', description: 'Segment A showing 3x higher engagement than baseline', action: 'Double down on marketing' },
      { id: '2', type: 'warning', title: 'Unusual Pattern', description: 'Weekend traffic 40% below expected range', action: 'Investigate campaigns' },
      { id: '3', type: 'critical', title: 'Threshold Alert', description: 'Cart abandonment spike in checkout flow', action: 'Review UX immediately' },
    ];

    setPredictions(newPredictions);
    setAnomalies(newAnomalies);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  // Simple chart animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (canvas.height / 10) * i);
        ctx.lineTo(canvas.width, (canvas.height / 10) * i);
        ctx.stroke();
      }

      // Draw animated line chart
      ctx.strokeStyle = isAnalyzing ? '#38bdf8' : analysisComplete ? '#10b981' : '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 5) {
        const y = canvas.height / 2 + 
          Math.sin((x + time) * 0.02) * 30 +
          Math.sin((x + time) * 0.05) * 20 +
          (analysisComplete ? Math.sin((x + time) * 0.01) * 40 - 20 : 0);
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw prediction zone if complete
      if (analysisComplete) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.fillRect(canvas.width * 0.7, 0, canvas.width * 0.3, canvas.height);
        
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.7, 0);
        ctx.lineTo(canvas.width * 0.7, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      time += 2;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isAnalyzing, analysisComplete]);

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6"
            >
              <Brain className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">Predictive Analytics Demo</span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              AI-Powered Data Analytics
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Watch our AI analyze your data in real-time, detect patterns, 
              and generate actionable predictions.
            </p>
          </div>

          {/* Dataset Selector */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {sampleDatasets.map((dataset) => (
              <button
                key={dataset.id}
                onClick={() => {
                  setSelectedDataset(dataset.id);
                  setAnalysisComplete(false);
                  setPredictions([]);
                  setAnomalies([]);
                }}
                disabled={isAnalyzing}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDataset === dataset.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50'
                }`}
              >
                {dataset.icon}
                {dataset.name}
              </button>
            ))}
          </div>

          {/* Live Chart */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-3xl p-6 mb-8 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Live Data Stream</h3>
                <p className="text-sm text-white/40">Real-time analysis visualization</p>
              </div>
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Run AI Analysis
                  </>
                )}
              </button>
            </div>
            
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={200}
              className="w-full h-48 rounded-xl bg-white/5"
            />

            {/* Analysis Steps */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-6 left-6 right-6 glass-panel rounded-xl p-4 border border-sky-500/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-sky-400 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{analysisSteps[analysisStep]}</p>
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-sky-500"
                          initial={{ width: '0%' }}
                          animate={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {analysisComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Predictions */}
                <div className="glass-panel rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">AI Predictions (30 Days)</h3>
                      <p className="text-sm text-white/40">Machine learning powered forecasts</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {predictions.map((pred, i) => (
                      <motion.div
                        key={pred.metric}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 rounded-2xl p-5 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm text-white/40">{pred.metric}</p>
                            <p className="text-2xl font-bold text-white">
                              {typeof pred.predicted === 'number' && pred.predicted >= 1000 
                                ? `${(pred.predicted / 1000).toFixed(1)}K` 
                                : pred.predicted.toLocaleString()}
                              {pred.metric.includes('%') || pred.metric.includes('Rate') || pred.metric.includes('Score') ? '%' : ''}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            pred.change > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {pred.change > 0 ? '+' : ''}{pred.change}%
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-3 w-3 text-sky-400" />
                          <span className="text-xs text-white/40">Confidence: {pred.confidence}%</span>
                        </div>
                        <p className="text-sm text-white/60">{pred.insight}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Anomalies */}
                <div className="glass-panel rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Anomalies & Opportunities</h3>
                      <p className="text-sm text-white/40">AI-detected patterns requiring attention</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {anomalies.map((anomaly, i) => (
                      <motion.div
                        key={anomaly.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.4 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border ${
                          anomaly.type === 'critical' ? 'bg-rose-500/10 border-rose-500/30' :
                          anomaly.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                          'bg-emerald-500/10 border-emerald-500/30'
                        }`}
                      >
                        {anomaly.type === 'critical' ? (
                          <AlertTriangle className="h-5 w-5 text-rose-400" />
                        ) : anomaly.type === 'warning' ? (
                          <Clock className="h-5 w-5 text-amber-400" />
                        ) : (
                          <Sparkles className="h-5 w-5 text-emerald-400" />
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{anomaly.title}</p>
                          <p className="text-sm text-white/60">{anomaly.description}</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors">
                          {anomaly.action}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-white/40 mb-4">Ready to unlock insights from your data?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/demos')}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                ← Back to Demos
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-all"
              >
                Get Custom Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
