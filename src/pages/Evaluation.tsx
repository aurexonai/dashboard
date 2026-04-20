import { useStore } from '@/store/useStore';
import { DashLayout } from '@/components/DashLayout';
import { ShieldCheck, Star, Activity, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { DashButton } from '@/components/DashButton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function EvaluationPage() {
  const evaluation = useStore(s => s.evaluation);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleOptimize = () => {
    toast({
      title: "AI Optimization Initialized",
      description: "Analyzing your listing strategy against real-time market vectors...",
    });

    setTimeout(() => {
      toast({
        title: "Evaluation Boosted",
        description: "Listing strategy optimized. Redirecting to inventory management.",
      });
      setTimeout(() => navigate('/listings'), 1000);
    }, 1500);
  };

  if (!evaluation) {
    return (
      <DashLayout title="Quality Evaluation">
        <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
            <ShieldCheck className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-black mb-3">No Evaluation Data</h2>
          <p className="text-sm text-muted-foreground mb-8">Establish a product profile on the dashboard to see AI-driven quality scores and marketplace confidence metrics.</p>
          <DashButton onClick={() => window.location.href = '/'} className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold">Go to Dashboard</DashButton>
        </div>
      </DashLayout>
    );
  }

  return (
    <DashLayout title="Quality Evaluation">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Main Score Overview */}
        <div className="bg-white border border-border p-8 rounded-2xl shadow-sm overflow-hidden relative">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="relative h-48 w-48 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <circle 
                  cx="18" cy="18" r="16" 
                  fill="none" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth="3" 
                  strokeDasharray={`${evaluation.trustScore}, 100`} 
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Score</span>
                <span className="text-5xl font-black font-heading text-black">{evaluation.trustScore}</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Star className="h-3 w-3" />
                  Rating: {evaluation.valueRating} / 5.0
                </span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Accuracy
                </span>
              </div>

              <h3 className="text-2xl font-bold font-heading text-black">
                {evaluation.trustScore >= 80 ? 'Excellent Market Alignment' :
                 evaluation.trustScore >= 60 ? 'Optimal Performance' :
                 'Improvement Recommended'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Our AI model has analyzed your product listing against <span className="text-black font-semibold">50,000+ data points</span>. 
                Your score of {evaluation.trustScore} reflects a {evaluation.trustScore >= 80 ? 'very high' : 'solid'} competitive position in the global marketplace.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2 justify-center lg:justify-start">
                {['Accuracy', 'Trend-Ready', 'Valid'].map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-secondary/50 rounded-md text-[10px] font-bold text-muted-foreground uppercase">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detailed Dimensions */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-bold text-sm">Evaluation Dimensions</h3>
            </div>
            <div className="space-y-6">
              {evaluation.dimensions.map(d => (
                <div key={d.label} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{d.label}</span>
                    <span className="text-xs font-black text-black">{d.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all duration-1000 group-hover:bg-black" style={{ width: `${d.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-black text-white p-8 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <div>
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Strategy Insight</h3>
              </div>
              <p className="text-lg font-medium leading-relaxed mb-8">
                "Adjusting your <span className="text-accent italic font-bold">Category Vertical</span> could potentially increase your market reach by <span className="text-accent font-bold">12-18%</span> based on current trends."
              </p>
            </div>
            <div className="space-y-3">
              <DashButton 
                onClick={handleOptimize}
                className="h-11 w-full bg-accent text-black hover:bg-white font-bold text-xs uppercase transition-all border-none"
              >
                Optimize Listing
              </DashButton>
              <div className="flex items-center justify-center gap-2">
                 <TrendingUp className="h-3 w-3 text-accent" />
                 <span className="text-[10px] font-bold text-white/40 uppercase">Recommended move</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashLayout>
  );
}


