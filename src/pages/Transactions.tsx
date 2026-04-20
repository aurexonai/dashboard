import { useStore } from '@/store/useStore';
import { DashLayout } from '@/components/DashLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Receipt, TrendingUp, Percent, Activity, Zap, ArrowUpRight, Download, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashButton } from '@/components/DashButton';
import { useToast } from '@/hooks/use-toast';

const txVolume = [
  { day: 'MON', volume: 12 },
  { day: 'TUE', volume: 18 },
  { day: 'WED', volume: 15 },
  { day: 'THU', volume: 22 },
  { day: 'FRI', volume: 28 },
  { day: 'SAT', volume: 35 },
  { day: 'SUN', volume: 30 },
];

export default function TransactionsPage() {
  const { pricing } = useStore();
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exporting Market Analytics...",
      description: "Compiling sale activity and liquidity metrics.",
    });

    setTimeout(() => {
      const header = `AurexonAI Market Analytics Report\nGenerated on: ${new Date().toLocaleString()}\n\n`;
      const stats = `Liquidity Score: 8.4/10\nVolume Trend: +8% this week\nLatency: 0.4s\n\n`;
      const volHeader = `Sale Activity (Last 7 Days):\n--------------------------\n`;
      const volLines = txVolume.map(v => `${v.day}: ${v.volume} total sales`).join('\n');
      
      const blob = new Blob([header + stats + volHeader + volLines], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Market_Analytics_Export_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your analytics report has been saved to your device.",
      });
    }, 1200);
  };

  const profitEstimate = pricing ? Math.round(pricing.suggestedPrice * 0.12 * 100) / 100 : 0;
  const sellProb = pricing ? (pricing.status === 'Optimal' ? 87 : pricing.status === 'Underpriced' ? 94 : 62) : 0;

  return (
    <DashLayout title="Market Analytics">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Quick Insights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { label: 'Est. Profit', value: pricing ? `$${profitEstimate}` : '—', icon: CreditCard, color: 'text-accent-foreground', bgColor: 'bg-accent/20', sub: '+12% margin' },
             { label: 'Sale Prob.', value: pricing ? `${sellProb}%` : '—', icon: Percent, color: 'text-blue-600', bgColor: 'bg-blue-50', sub: 'High confidence' },
             { label: 'Volume', value: '160', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50', sub: '+8% this week' },
             { label: 'Latency', value: '0.4s', icon: Zap, color: 'text-purple-600', bgColor: 'bg-purple-50', sub: 'Instant sync' },
           ].map((stat, i) => (
             <div key={i} className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:border-accent transition-colors">
                <div className="flex items-center justify-between mb-4">
                   <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                   </div>
                   <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-30" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-xl font-black text-black">{stat.value}</h3>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{stat.sub}</span>
                </div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* Volume Chart Area */}
           <div className="lg:col-span-8">
              <div className="bg-white border border-border p-8 rounded-2xl shadow-sm h-full">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                       <Activity className="h-4 w-4 text-muted-foreground" />
                       <h3 className="font-bold text-sm">Sale Activity (7 Days)</h3>
                    </div>
                    <div className="flex gap-1.5">
                       <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                       <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    </div>
                 </div>

                 <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={txVolume}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis 
                         dataKey="day" 
                         fontSize={11} 
                         tickLine={false} 
                         axisLine={false} 
                         tick={{fill: '#64748b', fontWeight: '500'}} 
                         dy={10}
                       />
                       <YAxis 
                         fontSize={11} 
                         tickLine={false} 
                         axisLine={false} 
                         tick={{fill: '#64748b', fontWeight: '500'}}
                       />
                       <Tooltip 
                         cursor={{fill: '#f8fafc'}}
                         contentStyle={{ 
                           backgroundColor: '#fff', 
                           border: 'none', 
                           borderRadius: '12px', 
                           fontSize: '12px',
                           boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                         }} 
                       />
                       <Bar 
                         dataKey="volume" 
                         fill="hsl(var(--accent))" 
                         radius={[6, 6, 0, 0]} 
                         barSize={32}
                       />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              </div>
           </div>

           {/* Market Intel Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm h-full flex flex-col justify-between">
                 <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Market Intel</h4>
                    <div className="space-y-6">
                       <div className="p-5 bg-secondary/30 border border-border rounded-xl">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Liquidity Score</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-black">8.4</span>
                            <span className="text-xs font-bold text-muted-foreground">/ 10</span>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                              Volume analysis indicates <span className="text-black font-bold">Strong Demand</span> for your product category this weekend.
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
                              Est. sell-through time: <span className="text-black font-bold underline decoration-accent decoration-2">24 - 48 Hours</span>
                            </p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8">
                    <DashButton 
                        onClick={handleExport}
                        className="w-full h-11 bg-black text-white hover:bg-black/90 font-bold flex items-center justify-center gap-2"
                     >
                       <Download className="h-4 w-4" />
                       Report Export
                    </DashButton>
                    <p className="text-[9px] text-center text-muted-foreground mt-3 font-medium uppercase">Last update: 2 mins ago</p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </DashLayout>
  );
}


