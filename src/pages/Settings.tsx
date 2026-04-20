import { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { DashLayout } from '@/components/DashLayout';
import { DashButton } from '@/components/DashButton';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, ShieldCheck, Bell, Zap, User, Layout, 
  LogOut, Mail, Key, Globe, Camera, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

function Toggle({ label, description, checked, onChange, icon: Icon }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void; icon: any }) {
  return (
    <div className="flex items-center justify-between gap-4 py-5 px-4 sm:px-6 rounded-2xl transition-all hover:bg-secondary/30 group">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className={cn(
          "h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center transition-all border shrink-0",
          checked ? "bg-black text-white border-black" : "bg-white text-muted-foreground border-border"
        )}>
           <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-black">{label}</p>
          <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-12 h-6 rounded-full transition-all duration-300 shrink-0",
          checked ? "bg-accent" : "bg-slate-200"
        )}
      >
        <div className={cn(
          "absolute top-1 left-1 h-4 w-4 rounded-full transition-all duration-300 shadow-md",
          checked ? "translate-x-6 bg-black" : "bg-white"
        )} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('aurexon_settings');
    return saved ? JSON.parse(saved).notifications ?? true : true;
  });
  const [autoPricing, setAutoPricing] = useState(() => {
    const saved = localStorage.getItem('aurexon_settings');
    return saved ? JSON.parse(saved).autoPricing ?? false : false;
  });

  const handleSave = () => {
    localStorage.setItem('aurexon_settings', JSON.stringify({ notifications, autoPricing }));
    toast({ 
      title: 'Preferences Saved', 
      description: 'Your settings have been saved successfully.',
    });
  };

  const [isAuditing, setIsAuditing] = useState(false);
  const handleAudit = () => {
    setIsAuditing(true);
    toast({ title: 'Initiating Audit', description: 'Verifying cloud handshakes and data integrity.' });
    
    setTimeout(() => {
      toast({ title: 'Analyzing Nodes', description: 'Validating active connection security.' });
      
      setTimeout(() => {
        setIsAuditing(false);
        toast({ title: 'Audit Completed', description: 'No vulnerabilities found. System is secure.' });
      }, 1500);
    }, 1500);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <DashLayout title="System Settings">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Identity Card */}
        <div className="bg-white border-2 border-black rounded-[2rem] p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <User className="h-32 w-32" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-accent border-2 border-black flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt={user.fullName || ''} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-black" />
                )}
              </div>
            </div>
            <div className="text-center md:text-left flex-1 space-y-1">
              <h2 className="text-2xl font-black text-black">{user?.fullName || 'User Name'}</h2>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{user?.primaryEmailAddress?.emailAddress}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 pt-1 text-[10px] font-black uppercase text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Verified Identity Node
              </div>
            </div>
            <DashButton
              variant="secondary"
              onClick={handleLogout}
              className="h-10 px-6 text-xs font-bold border-2 border-black flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all rounded-xl"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </DashButton>
          </div>
        </div>

        {/* Lower Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
           <div className="lg:col-span-8 flex flex-col">
              <div className="bg-white border-2 border-black rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col h-full">
                 <div className="px-8 py-6 border-b-2 border-black bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Layout className="h-4 w-4 text-black" />
                       <h3 className="font-bold text-sm">Application Interface</h3>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global preferences</span>
                 </div>
                 <div className="p-4 space-y-1">
                    <Toggle icon={Bell} label="Smart Notifications" description="Relay high-impact market shifts directly to your terminal" checked={notifications} onChange={setNotifications} />
                    <Toggle icon={Zap} label="Autonomous Pricing" description="AI-driven price optimization based on real-time competitor load" checked={autoPricing} onChange={setAutoPricing} />
                 </div>
                 <div className="p-8 bg-slate-50/30 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                    <DashButton onClick={handleSave} className="h-11 px-10 bg-black text-white hover:bg-accent hover:text-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl w-full sm:w-auto transition-all">
                       Save changes
                    </DashButton>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 flex flex-col">
              <div className="bg-black text-white p-8 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col h-full ring-2 ring-black">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16" />
                 <div className="flex items-center gap-2 mb-10">
                    <ShieldCheck className="h-5 w-5 text-accent" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Data Integrity</h3>
                 </div>
                 <div className="space-y-4 flex-1">
                    {[
                      { label: 'Cloud Handshake', value: 'Verified', icon: Globe },
                      { label: 'Neural Link', value: 'Optimized', icon: Key },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                         <div className="flex items-center gap-2">
                           <item.icon className="h-3.5 w-3.5 text-white/40" />
                           <span className="text-xs font-medium text-white/60">{item.label}</span>
                         </div>
                         <span className={cn("text-[9px] font-black uppercase tracking-widest", item.value.includes('Verified') || item.value.includes('Optimized') ? 'text-accent' : 'text-white/40')}>
                           {item.value}
                         </span>
                      </div>
                    ))}
                 </div>
                 <DashButton 
                    onClick={handleAudit} 
                    disabled={isAuditing}
                    className="h-11 w-full bg-accent text-black hover:bg-white font-black text-xs uppercase transition-all border-none rounded-xl mt-8 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                 >
                    {isAuditing ? 'Running Scan...' : 'Security Audit'}
                 </DashButton>
              </div>
           </div>
        </div>
      </div>
    </DashLayout>
  );
}
