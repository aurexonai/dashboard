import { useStore } from '@/store/useStore';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { cn } from '@/lib/utils';

interface DashLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function DashLayout({ title, children }: DashLayoutProps) {
  const sidebarOpen = useStore(s => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-bg-section">
      <AppSidebar />
      <AppHeader title={title} />
      <main
        className={cn(
          'pt-20 pb-8 px-4 sm:px-6 lg:px-8 transition-all duration-300',
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        )}
      >
        {children}
      </main>
    </div>
  );
}
