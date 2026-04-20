import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Menu, User, Bell, Search, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
}

const searchItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/pricing-engine', label: 'Pricing Engine' },
  { path: '/market-trends', label: 'Market Trends' },
  { path: '/evaluation', label: 'Evaluation' },
  { path: '/comparison', label: 'Comparison' },
  { path: '/monitoring', label: 'Monitoring' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/insights', label: 'Insights' },
  { path: '/listings', label: 'Listings' },
  { path: '/settings', label: 'Settings' },
];

const recentNotifications = [
  { id: 1, text: "High market shift detected in Tech", time: "2 min ago", unread: true },
  { id: 2, text: "Pricing Engine optimized 14 listings", time: "1 hr ago", unread: false },
  { id: 3, text: "New comparison report available", time: "4 hr ago", unread: false },
];

export function AppHeader({ title }: HeaderProps) {
  const { sidebarOpen, toggleSidebar } = useStore();
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = searchItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-border z-30 flex items-center justify-between px-4 sm:px-6 transition-all duration-300',
        sidebarOpen ? 'md:left-64' : 'md:left-20',
        'left-0'
      )}
    >
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden text-muted-foreground hover:text-black p-2">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold font-heading text-black">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div ref={searchRef} className="hidden sm:flex relative items-center gap-3 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl group w-48 lg:w-72 focus-within:w-56 lg:focus-within:w-80 focus-within:bg-white focus-within:border-black focus-within:shadow-lg focus-within:shadow-black/5 transition-all duration-300">
           <Search className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-black transition-colors" />
           <input 
             type="text" 
             placeholder="Search pages..." 
             value={searchQuery}
             onChange={(e) => {
               setSearchQuery(e.target.value);
               setShowResults(true);
             }}
             onFocus={() => setShowResults(true)}
             className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[13px] font-medium placeholder:text-muted-foreground/60 w-full p-0 shadow-none ring-0" 
           />
           <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[9px] font-bold text-muted-foreground group-focus-within:hidden">
              <span className="text-[10px]">⌘</span>K
           </div>
           
           {/* Search Results Dropdown */}
           {showResults && searchQuery && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border shadow-2xl rounded-xl overflow-hidden py-2 z-50">
               {filteredItems.length > 0 ? (
                 <div className="flex flex-col">
                   <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pages</div>
                   {filteredItems.map((item) => (
                     <button
                       key={item.path}
                       onClick={() => handleSelect(item.path)}
                       className="w-full text-left px-4 py-2 hover:bg-accent hover:text-black font-semibold text-sm transition-colors text-muted-foreground flex items-center justify-between group/item"
                     >
                       <span>{item.label}</span>
                       <span className="text-[10px] font-bold text-black opacity-0 group-hover/item:opacity-100 transition-opacity">GO</span>
                     </button>
                   ))}
                 </div>
               ) : (
                 <div className="px-4 py-4 text-sm text-muted-foreground font-medium text-center">
                   No pages found for "{searchQuery}"
                 </div>
               )}
             </div>
           )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 border-l border-border pl-2 sm:pl-4 relative">
           
           <div ref={notifRef}>
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className={cn(
                 "relative p-2 transition-colors rounded-lg",
                 showNotifications ? "bg-secondary/50 text-black" : "text-muted-foreground hover:text-black hover:bg-secondary/50"
               )}
             >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
             </button>
             
             {showNotifications && (
               <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white border border-border shadow-2xl rounded-2xl overflow-hidden py-2 z-50">
                 <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                   <h4 className="font-bold text-sm text-black">Notifications</h4>
                   <span className="text-[10px] font-bold text-accent-foreground bg-accent/20 px-2 py-0.5 rounded-full uppercase tracking-widest">1 New</span>
                 </div>
                 <div className="flex flex-col">
                   {recentNotifications.map(notif => (
                     <div key={notif.id} className={cn("px-4 py-3 border-b border-border/50 hover:bg-slate-50 cursor-pointer transition-colors", notif.unread ? "bg-blue-50/30" : "")}>
                       <div className="flex items-start gap-3">
                         <div className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", notif.unread ? "bg-red-500" : "bg-transparent")} />
                         <div>
                           <p className={cn("text-xs leading-relaxed", notif.unread ? "font-bold text-black" : "font-medium text-muted-foreground")}>{notif.text}</p>
                           <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-wider">{notif.time}</p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>
           
           <div ref={profileRef} className="relative z-50">
             <div onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 cursor-pointer group p-1.5 px-2 hover:bg-slate-50 rounded-xl transition-all">
               <div className="text-right hidden lg:block">
                 <p className="text-xs font-bold text-black leading-none">{user?.fullName || 'User Name'}</p>
                 <div className="flex items-center gap-1 justify-end mt-1">
                   <div className="h-1 w-1 rounded-full bg-green-500" />
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Admin</p>
                 </div>
               </div>
               <div className="h-9 w-9 rounded-xl bg-black flex items-center justify-center overflow-hidden text-white shadow-sm group-hover:bg-accent group-hover:text-black transition-all">
                 {user?.imageUrl ? (
                   <img src={user.imageUrl} alt={user.fullName || ''} className="h-full w-full object-cover" />
                 ) : (
                   <User className="h-4 w-4" />
                 )}
               </div>
             </div>
             
             {showProfile && (
               <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-border shadow-2xl rounded-2xl overflow-hidden py-1 z-50">
                 <div className="px-4 py-3 border-b border-border">
                   <p className="text-sm font-bold text-black truncate">{user?.fullName || 'User Name'}</p>
                   <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5 truncate">{user?.primaryEmailAddress?.emailAddress || 'admin@aurexon.ai'}</p>
                 </div>
                 <div className="py-1">
                   <button onClick={() => { setShowProfile(false); navigate('/settings'); }} className="w-full flex flex-row items-center gap-3 px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-black transition-colors group/item relative">
                     <Settings className="h-4 w-4 group-hover/item:rotate-90 transition-transform text-black shrink-0" />
                     <span className="flex-1 text-left">Account Settings</span>
                   </button>
                   <button onClick={() => { setShowProfile(false); handleLogout(); }} className="w-full flex-row flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors shrink-0">
                     <LogOut className="h-4 w-4" />
                     <span className="flex-1 text-left">Log Out</span>
                   </button>
                 </div>
               </div>
             )}
           </div>
        </div>
      </div>
    </header>
  );
}
