import { useStore } from '@/store/useStore';
import { DashLayout } from '@/components/DashLayout';
import { GitCompare, TrendingUp, Star, ShieldCheck, Zap, Info, BarChart3, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashButton } from '@/components/DashButton';
import { useToast } from '@/hooks/use-toast';

const mockCompetitors = [
  { name: 'MarketPro X500', price: 289.99, condition: 'New', rating: 4.2 },
  { name: 'ValueTech Essential', price: 245.00, condition: 'Like New', rating: 3.9 },
  { name: 'PrimeSell Ultra', price: 310.50, condition: 'New', rating: 4.5 },
  { name: 'BudgetKing Standard', price: 199.99, condition: 'Good', rating: 3.6 },
  { name: 'EliteMarket Pro', price: 335.00, condition: 'New', rating: 4.7 },
];

export default function ComparisonPage() {
  const { pricing, product } = useStore();
  const { toast } = useToast();

  const handleDownload = () => {
    if (!pricing || !product) return;

    toast({
      title: "Generating Comparison Report...",
      description: "Compiling market analysis and competitor data.",
    });

    setTimeout(() => {
      const header = `AurexonAI Price Comparison Report\nGenerated on: ${new Date().toLocaleString()}\n\n`;
      const prodInfo = `Product: ${product.name}\nYour Price: $${pricing.suggestedPrice}\nCondition: ${product.condition}\n\n`;
      const compHeader = `Competitor Listings:\n-------------------\n`;
      const compLines = mockCompetitors.map(c => `${c.name}: $${c.price} (${c.condition}, Rating: ${c.rating}/5)`).join('\n');
      
      const blob = new Blob([header + prodInfo + compHeader + compLines], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Comparison_Report_${product.name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "Competitor comparison analysis has been saved.",
      });
    }, 1200);
  };

  if (!pricing || !product) {
    return (
      <DashLayout title="Price Comparison">
        <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
            <GitCompare className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-black mb-3">No Comparisons Yet</h2>
          <p className="text-sm text-muted-foreground mb-8">Establish a product baseline on the dashboard to see how your pricing stacks up against the competition.</p>
          <DashButton onClick={() => window.location.href = '/'} className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold">Get Started</DashButton>
        </div>
      </DashLayout>
    );
  }

  return (
    <DashLayout title="Price Comparison">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Marketplace Snapshot */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-secondary/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-accent-foreground" />
              <h3 className="font-bold text-sm">Competitive Snapshot</h3>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Live data feed active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Entity</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Condition</th>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right lg:text-left">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* User Product Row */}
                <tr className="bg-accent/10">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-black text-accent flex items-center justify-center text-[10px] font-black">YOU</div>
                      <div>
                        <p className="text-sm font-bold text-black">{product.name}</p>
                        <p className="text-[10px] font-bold text-accent-foreground uppercase leading-none mt-1 italic">Your Analysis</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-base font-black text-black">${pricing.suggestedPrice}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-border text-[10px] font-bold text-black uppercase">{product.condition}</span>
                  </td>
                  <td className="py-4 px-6 text-right lg:text-left">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-bold text-muted-foreground">Analysing</span>
                    </div>
                  </td>
                </tr>

                {/* Competitor Rows */}
                {mockCompetitors.map((c, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">MKT</div>
                        <p className="text-sm font-medium text-black/80">{c.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className={cn('text-sm font-bold', c.price > pricing.suggestedPrice ? 'text-black/60' : 'text-accent-foreground')}>
                        ${c.price}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{c.condition}</span>
                    </td>
                    <td className="py-4 px-6 text-right lg:text-left">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 border border-yellow-100 rounded-md w-fit">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold text-yellow-700">{c.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-secondary/5 border-t border-border flex items-center gap-2 text-[11px] text-muted-foreground italic">
            <Info className="h-3.5 w-3.5" />
            Comparison data is aggregated from major online retail platforms.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black text-white p-8 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 transition-opacity group-hover:opacity-40">
              <Zap className="h-10 w-10 text-accent" />
            </div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Market Positioning</h4>
            <p className="text-lg font-medium leading-relaxed">
              Your price is <span className="text-accent font-bold">12.4% below</span> the peak market value, positioning you for a fast sale while maintaining healthy margins.
            </p>
          </div>

          <div className="bg-white border border-border p-8 rounded-2xl shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Market Average</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-black">$286.40</span>
                <span className="text-xs font-bold text-green-600">Active</span>
              </div>
            </div>
            <DashButton 
              onClick={handleDownload}
              className="h-11 px-6 bg-accent text-black hover:bg-black hover:text-white border-none font-bold text-xs uppercase transition-all shrink-0 flex items-center gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              Download Full Report
            </DashButton>
          </div>
        </div>

      </div>
    </DashLayout>
  );
}


