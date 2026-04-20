import { useStore } from '@/store/useStore';
import { DashLayout } from '@/components/DashLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, ArrowUpRight, Globe, Info, Download } from 'lucide-react';
import { DashButton } from '@/components/DashButton';
import { useToast } from '@/hooks/use-toast';

export default function MarketTrendsPage() {
  const trends = useStore(s => s.trends);
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Generating Report...",
      description: "Your market analytics report is being prepared for download.",
    });

    setTimeout(() => {
      // Create a blob with the report content
      const reportHeader = `AurexonAI Market Trends Report\nGenerated on: ${new Date().toLocaleString()}\n\n`;
      const trendLines = trends.map(t => `${t.day}: Demand Score ${t.demand}`).join('\n');
      const blob = new Blob([reportHeader + trendLines], { type: 'text/plain' });
      
      // Create a download link and click it
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Market_Trends_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "The Market Trends report has been downloaded as a text file.",
      });
    }, 1200);
  };

  if (!trends.length) {
    return (
      <DashLayout title="Market Trends">
        <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
            <TrendingUp className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-black mb-3">No Market Data Available</h2>
          <p className="text-sm text-muted-foreground mb-8">Run a marketplace scan on the dashboard to populate live market trends and demand data.</p>
          <DashButton onClick={() => window.location.href = '/'} className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold">Initiate Scan</DashButton>
        </div>
      </DashLayout>
    );
  }

  const peak = trends.reduce((a, b) => a.demand > b.demand ? a : b);

  return (
    <DashLayout title="Market Trends">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent-foreground" />
                  <h3 className="font-bold text-sm">Demand Velocity (7 Days)</h3>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold border border-green-100 uppercase">
                  <ArrowUpRight className="h-3 w-3" />
                  Positive Trend
                </div>
              </div>

              <div className="p-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends}>
                      <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
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
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: 'none', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="demand" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorTrend)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-secondary/20 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" />
                Data is updated every 15 minutes based on global marketplace activity.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-border p-5 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Category Health</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Stable Growth</span>
                  <span className="text-sm font-bold text-green-600">+4.2%</span>
                </div>
              </div>
              <div className="bg-white border border-border p-5 rounded-2xl shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Market Liquidity</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Moderate</span>
                  <span className="text-sm font-bold text-blue-600">68/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Insights */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-bold text-sm">Market Insights</h3>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                  <p className="text-[10px] font-bold text-accent-foreground uppercase tracking-widest mb-1">Peak Demand Day</p>
                  <p className="text-xl font-black text-black">{peak.day}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-1">Activity Score: {peak.demand}/1000</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Market volume is currently concentrated in the <span className="font-bold text-black text-[11px]">Mid-Range</span> pricing sector.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Seller competition has decreased by <span className="font-bold text-black text-[11px]">8%</span> this week, favoring new listings.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <DashButton 
                    onClick={handleDownload}
                    className="w-full h-11 bg-black text-white hover:bg-black/90 font-bold flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </DashButton>
                </div>
              </div>
            </div>

            <div className="bg-secondary/30 p-6 rounded-2xl border border-dashed border-border text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-widest">Recommended Action</p>
              <h4 className="text-sm font-bold mb-2">Boost Listing Exposure</h4>
              <p className="text-[11px] text-muted-foreground">The current demand curve favors high-visibility items in your category.</p>
            </div>
          </div>

        </div>
      </div>
    </DashLayout>
  );
}


