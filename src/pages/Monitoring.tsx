import { useEffect, useState } from 'react';
import { DashLayout } from '@/components/DashLayout';
import { Activity, Cpu, Zap, ShieldCheck, Database, Server, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashButton } from '@/components/DashButton';
import { useToast } from '@/hooks/use-toast';

export default function MonitoringPage() {
  const [cpu, setCpu] = useState(42);
  const [gpu, setGpu] = useState(35);
  const [memory, setMemory] = useState(58);
  const { toast } = useToast();

  const handleReconnect = () => {
    toast({
      title: "Reconnecting...",
      description: "Attempting to re-establish neural link with global clusters.",
    });

    setTimeout(() => {
      toast({
        title: "Link Restored",
        description: "Primary connection to AI nodes is active and stable.",
      });
    }, 1500);
  };

  const handleAudit = () => {
    toast({
      title: "Diagnostic Initialized",
      description: "Verifying subsystem integrity and cluster health...",
    });

    setTimeout(() => {
      toast({
        title: "Audit in Progress",
        description: "Scanning network protocols and encrypted nodes (62%)",
      });
      
      setTimeout(() => {
        toast({
          title: "System Optimized",
          description: "All nodes verified. Security handshake complete.",
        });
      }, 1500);
    }, 1200);
  };

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setCpu(40 + Math.round(15 * Math.sin(tick * 0.3) + 5 * Math.cos(tick * 0.7)));
      setGpu(30 + Math.round(20 * Math.sin(tick * 0.5 + 1)));
      setMemory(55 + Math.round(10 * Math.sin(tick * 0.2 + 2)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'CPU Usage', value: cpu, icon: Cpu, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { label: 'GPU Load', value: gpu, icon: Activity, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'RAM Buffer', value: memory, icon: Database, color: 'text-green-500', bgColor: 'bg-green-50' },
  ];

  return (
    <DashLayout title="System Status">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center text-black">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Core Node Performance</h2>
              <p className="text-sm text-muted-foreground font-medium">Real-time telemetery from our global AI clusters.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Operational
            </div>
            <DashButton 
              variant="secondary" 
              onClick={handleReconnect}
              className="h-9 px-4 text-xs font-bold flex items-center gap-2 border-border"
            >
              <RefreshCw className="h-3 w-3" />
              Reconnect
            </DashButton>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4 group hover:border-accent transition-all">
              <div className="flex items-center justify-between">
                <div className={cn("p-2.5 rounded-xl", s.bgColor)}>
                  <s.icon className={cn("h-5 w-5", s.color)} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Healthy</span>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1 tracking-wider">{s.label}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black font-heading text-black">{s.value}%</span>
                  <span className="text-xs font-bold text-muted-foreground mb-1.5">{s.value > 50 ? 'Active' : 'Idle'}</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-1000", s.value > 80 ? 'bg-red-500' : s.value > 50 ? 'bg-accent' : 'bg-green-500')} 
                  style={{ width: `${s.value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Detailed Monitors */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden h-full">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent-foreground" />
                  <h3 className="font-bold text-sm">Cluster Health Log</h3>
                </div>
                <button className="text-[10px] font-bold text-muted-foreground uppercase hover:text-black">View Logs</button>
              </div>
              <div className="p-6 space-y-6">
                 {[
                   { label: 'Neural Uplink Stable', status: 'Healthy', ping: '12ms', time: 'Just now' },
                   { label: 'API Processing Node 4', status: 'Healthy', ping: '8ms', time: '2m ago' },
                   { label: 'Pricing Cache Rebuild', status: 'Paused', ping: '-', time: '15m ago' },
                   { label: 'Market Data Sync', status: 'Healthy', ping: '144ms', time: '1h ago' },
                 ].map((log, i) => (
                   <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0 group">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-2 w-2 rounded-full", log.status === 'Healthy' ? 'bg-green-500' : 'bg-orange-500')} />
                        <div>
                          <p className="text-sm font-bold text-black group-hover:text-accent-foreground transition-colors">{log.label}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{log.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-black">{log.status}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{log.ping}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Security Overview */}
          <div className="lg:col-span-4 max-h-[460px]">
            <div className="bg-black text-white p-8 rounded-2xl shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Security & Integrity</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-3xl font-bold font-heading mb-1">99.9%</p>
                    <p className="text-[11px] font-bold text-accent uppercase tracking-widest">Global Uptime</p>
                  </div>
                  
                  <div className="h-px bg-white/10" />
                  
                  <p className="text-sm text-white/60 leading-relaxed italic">
                    All transactions and neural calls are encrypted via AES-256 protocols and verified by the decentralised audit node.
                  </p>
                </div>
              </div>

              <DashButton 
                onClick={handleAudit}
                className="h-11 w-full bg-accent text-black hover:bg-white font-bold text-xs uppercase transition-all border-none mt-8"
              >
                Run Diagnostic Audit
              </DashButton>
            </div>
          </div>
        </div>

      </div>
    </DashLayout>
  );
}


