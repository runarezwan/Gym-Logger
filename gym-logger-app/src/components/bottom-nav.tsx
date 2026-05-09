'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ClipboardList, Dumbbell, BarChart2, Settings } from 'lucide-react';

const TABS = [
  { label: 'Workout', icon: Activity, href: '/' },
  { label: 'Templates', icon: ClipboardList, href: '/templates' },
  { label: 'Movements', icon: Dumbbell, href: '/movements' },
  { label: 'History', icon: BarChart2, href: '/history' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-lg glass-nav border-t border-border shadow-card-lg relative flex items-center justify-around h-16 rounded-t-[2.5rem]">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link 
              key={tab.href} 
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300 relative ${isActive ? 'text-accent drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] scale-105' : 'text-text-tertiary hover:text-accent/70'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[9px] font-black uppercase tracking-[0.15em] font-outfit">
                {tab.label}
              </span>
              
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent animate-fade-in" />
              )}
              
              <div className="absolute inset-0 active:scale-90 transition-transform" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
