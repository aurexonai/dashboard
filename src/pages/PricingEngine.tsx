import { useStore } from '@/store/useStore';
import { DashLayout } from '@/components/DashLayout';
import { DollarSign, TrendingUp, Target, Zap, ShieldCheck, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashButton } from '@/components/DashButton';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function PricingEnginePage() {
  const { pricing, applySuggestedPrice } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleApply = () => {
    if (pricing) {
      applySuggestedPrice(pricing.suggestedPrice);
      toast({
        title: "Prices Updated",
        description: `Successfully applied $${pricing.suggestedPrice} to all listings in your inventory.`,
      });
    }
  };

  if (!pricing) {
    return (
      <DashLayout title="Price Analysis">
        <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
            <DollarSign className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-black mb-3">No Pricing Data Available</h2>
          <p className="text-sm text-muted-foreground mb-8">Please analyze a product on the main dashboard first to see detailed pricing insights here.</p>
          <DashButton onClick={() => window.location.href = '/'} className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold">Go to Dashboard</DashButton>
        </div>
      </DashLayout>
    );
  }

  const statusColors: Record<string, string> = {
    Optimal: 'bg-green-50 text-green-700 border-green-100',
    Overpriced: 'bg-red-50 text-red-700 border-red-100',
    Underpriced: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  };

  return (
    <DashLayout title="Pricing Analysis">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Main Price Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-6 flex-1">
              <div>
                <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase border tracking-wider', statusColors[pricing.status])}>
                  {pricing.status} Market Value
                </span>
                <h2 className="text-sm font-semibold text-muted-foreground mt-4 uppercase tracking-widest">Recommended Selling Price</h2>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black font-heading tracking-tight text-black">${pricing.suggestedPrice}</span>
                  <span className="text-sm font-bold text-muted-foreground">USD</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-bold text-black">{pricing.confidence}% Confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                  <span className="text-sm font-bold text-black">High Demand Area</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-row lg:flex-col gap-4">
              <div className="flex-1 p-5 bg-secondary/30 rounded-2xl border border-border min-w-[140px]">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Price Floor</p>
                <p className="text-xl font-bold text-black">${pricing.minPrice}</p>
              </div>
              <div className="flex-1 p-5 bg-secondary/30 rounded-2xl border border-border min-w-[140px]">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Price Ceiling</p>
                <p className="text-xl font-bold text-black">${pricing.maxPrice}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/20 p-4 border-t border-border flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Info className="h-4 w-4" />
              This price is calculated based on current market trends and historical data.
            </div>
            <DashButton onClick={handleApply} className="h-10 px-6 bg-accent text-black hover:bg-black hover:text-white border-none text-xs font-bold transition-all flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Apply to All Listings
            </DashButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm">Market Trend</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Recent data shows a <span className="text-green-600 font-bold">12% increase</span> in interest for this category over the last 30 days.</p>
          </div>

          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm">Competitive Edge</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Your suggested price is <span className="text-blue-600 font-bold">$42 lower</span> than the average competitor listing.</p>
          </div>

          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center text-black">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm">Sale Velocity</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Estimated time to sell at this price point is <span className="text-black font-bold">3-5 days</span> with standard promotion.</p>
          </div>
        </div>

        <div className="bg-black text-white p-8 rounded-2xl shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6 lg:col-span-3">
          <div>
            <h3 className="text-xl font-bold font-heading mb-2">Ready to list this item?</h3>
            <p className="text-sm text-white/60">Our AI has everything ready. Just one click to go live on the marketplace.</p>
          </div>
          <DashButton 
            onClick={() => navigate('/listings')}
            className="h-12 px-8 bg-accent text-black hover:bg-white font-bold flex items-center gap-2 group border-none shadow-sm transition-all"
          >
            Create Listing Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </DashButton>
        </div>
      </div>
    </DashLayout>
  );
}


