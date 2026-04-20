import { useStore } from '@/store/useStore';
import { DashLayout } from '@/components/DashLayout';
import { Lightbulb, Zap, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import { DashButton } from '@/components/DashButton';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function InsightsPage() {
  const insights = useStore(s => s.insights);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleApplyStrategy = (title: string) => {
    toast({
      title: "Applying Strategy...",
      description: `Synchronizing your inventory with the ${title} directive.`,
    });

    setTimeout(() => {
      toast({
        title: "Strategy Active",
        description: "Listing parameters updated. Redirecting to inventory.",
      });
      setTimeout(() => navigate('/listings'), 1000);
    }, 1500);
  };

  if (!insights.length) {
    return (
      <DashLayout title="Market Insights">
        <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
            <Lightbulb className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-black mb-3">No Strategic Insights</h2>
          <p className="text-sm text-muted-foreground mb-8">Run a marketplace analysis on the dashboard to unlock data-driven strategies and AI-powered product recommendations.</p>
          <DashButton onClick={() => window.location.href = '/'} className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold">Start Analysis</DashButton>
        </div>
      </DashLayout>
    );
  }

  return (
    <DashLayout title="Market Insights">
       <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center text-black">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">Actionable Intelligence</h2>
            <p className="text-sm text-muted-foreground font-medium">Curated strategies based on real-time marketplace shifts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {insights.map((insight, i) => (
             <div key={i} className="bg-white border border-border p-8 rounded-2xl shadow-sm hover:border-accent transition-all group relative overflow-hidden flex flex-col">
                <div className="flex items-start justify-between mb-8">
                   <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-2xl group-hover:bg-accent transition-colors">
                      {insight.icon}
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Insight 0{i+1}</span>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <Zap className="h-3 w-3 text-accent" />
                        <span className="text-[10px] font-bold text-black uppercase">High Impact</span>
                      </div>
                   </div>
                </div>

                <h3 className="text-xl font-bold text-black mb-4">{insight.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-10 flex-1">
                  {insight.description}
                </p>

                <div className="pt-6 border-t border-border mt-auto flex items-center justify-between">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">AI Recommendation</span>
                   <DashButton 
                      onClick={() => handleApplyStrategy(insight.title)}
                      variant="ghost" 
                      className="h-9 px-3 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 group-hover:bg-black group-hover:text-white transition-all rounded-lg"
                   >
                      Apply Strategy <ArrowRight className="h-3.5 w-3.5" />
                   </DashButton>
                </div>
             </div>
           ))}
        </div>
      </div>
    </DashLayout>
  );
}


