import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useClerk } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, DollarSign, TrendingUp, ShieldCheck, GitCompare,
  Activity, Receipt, Lightbulb, List, Settings, LogOut, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pricing-engine', label: 'Pricing Engine', icon: DollarSign },
  { path: '/market-trends', label: 'Market Trends', icon: TrendingUp },
  { path: '/evaluation', label: 'Evaluation', icon: ShieldCheck },
  { path: '/comparison', label: 'Comparison', icon: GitCompare },
  { path: '/monitoring', label: 'Monitoring', icon: Activity },
  { path: '/transactions', label: 'Transactions', icon: Receipt },
  { path: '/insights', label: 'Insights', icon: Lightbulb },
  { path: '/listings', label: 'Listings', icon: List },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useStore();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 md:hidden transition-opacity',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={toggleSidebar}
      />

      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r border-border z-50 flex flex-col transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-20',
          'max-md:w-64',
          !sidebarOpen && 'max-md:-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center px-4 h-24 border-b border-border shrink-0">
          <img 
            src="/Logo.svg" 
            alt="AurexonAI Logo" 
            className={cn("h-20 w-auto object-contain transition-all duration-300", !sidebarOpen && 'md:-translate-x-10 md:opacity-0 md:w-0')}
          />
          {/* Mobile close */}
          <button onClick={toggleSidebar} className="ml-auto md:hidden text-muted-foreground hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768 && sidebarOpen) {
                    toggleSidebar();
                  }
                }}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-accent text-black font-semibold'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-black'
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", active ? "text-black" : "text-muted-foreground group-hover:text-black")} />
                <span className={cn('transition-all duration-300 whitespace-nowrap', !sidebarOpen && 'md:opacity-0 md:w-0')}>
                  {item.label}
                </span>
                
                {/* Tooltip for collapsed */}
                {!sidebarOpen && (
                  <span className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none hidden md:block z-50 shadow-xl border border-white/10">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 w-full transition-colors group"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn('transition-all duration-300', !sidebarOpen && 'md:opacity-0 md:w-0')}>Logout</span>
          </button>
        </div>

        {/* Collapse toggle - desktop only */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm hover:shadow-md transition-all z-[60]"
        >
          {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
      </aside>
    </>
  );
}


