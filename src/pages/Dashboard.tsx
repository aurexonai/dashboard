import { useState } from 'react';
import { useStore, suggestPrice } from '@/store/useStore';
import { useUser } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import { DashLayout } from '@/components/DashLayout';
import { DashInput, DashSelect } from '@/components/DashInput';
import { DashButton } from '@/components/DashButton';
import { 
  History, TrendingUp, User as UserIcon, 
  Activity, ArrowUpRight, Search, Zap, Package, BarChart3
} from 'lucide-react';
import { 
  CartesianGrid, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const categories = [
  { value: '', label: 'Select category' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Books', label: 'Books' },
  { value: 'Toys', label: 'Toys' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Other', label: 'Other' },
];

const conditions = [
  { value: '', label: 'Select condition' },
  { value: 'New', label: 'New' },
  { value: 'Like New', label: 'Like New' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
];

const demandData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

export default function DashboardPage() {
  const { user } = useUser();
  const { setProduct, runAI, pricing, listings, addListing } = useStore();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [analyzed, setAnalyzed] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name) e.name = 'Required';
    if (!category) e.category = 'Required';
    if (!basePrice || Number(basePrice) <= 0) e.basePrice = 'Invalid';
    if (!condition) e.condition = 'Required';
    if (!description || description.length < 10) e.description = 'Min 10 chars';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const productData = { name, category, basePrice: Number(basePrice), condition, description };
    setProduct(productData);
    runAI();
    setAnalyzed(true);
    
    const pricingResult = suggestPrice(productData);
    addListing({
      name,
      category,
      price: pricingResult.suggestedPrice,
      status: 'Active'
    });
  };

  return (
    <DashLayout title="Overview">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Section */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-black shrink-0">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-black">Welcome back, {user?.fullName || 'User'}!</h1>
              <p className="text-sm text-muted-foreground font-medium mt-1">Here's what's happening with your inventory today.</p>
            </div>
          </div>
          <div className="flex items-center self-start lg:self-auto w-fit shrink-0 gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold border border-green-100">
            <Activity className="h-3.5 w-3.5" />
            System Online
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Input Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden shrink-0">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <h3 className="font-bold font-heading text-sm">Product Price Analyzer</h3>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <DashInput 
                        label="Product Name" 
                        placeholder="e.g. RTX 4090 Graphics Card" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        error={errors.name}
                      />
                    </div>
                    <DashSelect label="Category" options={categories} value={category} onChange={e => setCategory(e.target.value)} />
                    <DashSelect label="Condition" options={conditions} value={condition} onChange={e => setCondition(e.target.value)} />
                    <DashInput label="Base Price ($)" type="number" placeholder="0.00" value={basePrice} onChange={e => setBasePrice(e.target.value)} error={errors.basePrice} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Description</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all min-h-[120px]"
                      placeholder="Describe the product features, specifications, and state..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                    {errors.description && <span className="text-xs font-medium text-red-500 mt-1 block">{errors.description}</span>}
                  </div>
                  <DashButton type="submit" className="w-full h-12 bg-black text-white hover:bg-black/90 rounded-xl font-bold flex items-center justify-center gap-2">
                    Start AI Analysis
                    <Search className="h-4 w-4" />
                  </DashButton>
                </form>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-bold font-heading text-sm">Recent Activity</h3>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                {listings.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                    <Package className="h-8 w-8 mb-2" />
                    <p className="text-sm">No recent activity found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listings.slice(-4).reverse().map((item) => (
                      <div key={item.id} className="p-4 bg-secondary/30 border border-border rounded-xl flex items-center justify-between hover:bg-secondary/50 transition-colors">
                        <div>
                          <p className="text-sm font-bold text-black">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-black">${item.price}</p>
                          <p className="text-[10px] font-bold text-green-600 uppercase">Active</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Analysis Result / Placeholder */}
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden relative shrink-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Zap className="h-3 w-3 text-muted-foreground/40" />
                    Valuation Analysis
                  </h3>
                </div>

                {analyzed && pricing ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Suggested Selling Price</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-4xl font-black font-heading tracking-tighter text-black">${pricing.suggestedPrice}</p>
                        <span className="text-sm font-bold text-muted-foreground">USD</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-wide">
                        {pricing.status}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground">{pricing.confidence}% Confidence Score</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">Price Floor</p>
                        <p className="text-sm font-bold text-black font-heading">${pricing.minPrice}</p>
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">Price Ceiling</p>
                        <p className="text-sm font-bold text-black font-heading">${pricing.maxPrice}</p>
                      </div>
                    </div>

                    <DashButton onClick={() => setAnalyzed(false)} className="w-full h-10 bg-accent text-black hover:bg-black hover:text-white border-none font-bold uppercase text-[10px] tracking-widest mt-2 transition-all">
                      Reset Analysis
                    </DashButton>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/20">
                      <Search className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium max-w-[180px]">
                      Enter product details and start analysis to see valuation results.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Market Demand Chart */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-6 shrink-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-bold font-heading text-sm">Market Demand</h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                  <ArrowUpRight className="h-3 w-3" />
                  +12.4%
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demandData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip 
                       contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4 font-medium italic">General Electronics Category Interest</p>
            </div>

            {/* Quick Metrics */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4 flex-1">
              <h3 className="font-bold font-heading text-sm mb-2">Quick Metrics</h3>
              {[
                { label: 'Active Listings', value: listings.length, change: '+2 new', color: 'text-black' },
                { label: 'System Latency', value: '24ms', change: 'Optimal', color: 'text-green-600' },
                { label: 'Market Reliability', value: '98.2%', change: 'Stable', color: 'text-blue-600' }
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">{m.label}</p>
                    <p className="text-[10px] font-medium text-muted-foreground/60">{m.change}</p>
                  </div>
                  <p className={cn("text-lg font-black", m.color)}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashLayout>
  );
}

