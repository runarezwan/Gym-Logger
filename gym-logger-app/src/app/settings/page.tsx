'use client';

import { useAuth } from '@/context/auth-context';
import { useSettings } from '@/context/settings-context';
import { useTheme } from '@/context/theme-context';
import AuthGuard from '@/components/auth-guard';
import BottomNav from '@/components/bottom-nav';
import { getWorkouts } from '@/lib/firestore';
import { LogOut, Sun, Moon, Laptop, Download, Weight, UserCircle, Activity } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();

  const handleExport = async () => {
    if (!user) return;
    const workouts = await getWorkouts(user.uid);
    let csv = "Date,Movement,Weight,Unit,Reps,Notes\n";
    
    workouts.forEach(w => {
       w.entries.forEach(e => {
          const row = [
             w.date,
             `"${e.movementName}"`,
             e.weight,
             e.unit,
             e.reps,
             `"${e.notes?.replace(/"/g, '""') || ''}"`
          ].join(',');
          csv += row + "\n";
       });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gym-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AuthGuard>
      <main className="min-h-screen px-6 pt-10 pb-48 bg-bg-primary text-text-primary animate-fade-in font-outfit">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
             <Activity className="w-4 h-4 text-accent" />
             <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">Command Center</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white">SYSTEM <span className="text-accent underline decoration-accent-light/10">CONFIG</span></h1>
          <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-black mt-3">Refine your performance parameters.</p>
        </header>

        <section className="space-y-6">
           {/* Profile */}
           <div className="glass-card p-6 rounded-[2.5rem] border-border-color shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-14 h-14 rounded-3xl bg-bg-tertiary flex items-center justify-center text-accent">
                    <UserCircle className="w-8 h-8" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Logged In Athlete</span>
                    <h4 className="text-sm font-black uppercase text-white tracking-widest italic">{user?.email || "Athlete"}</h4>
                 </div>
              </div>
              <button 
                onClick={logout}
                className="w-full py-4 bg-danger text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-danger/20"
              >
                 <LogOut className="w-4 h-4" /> LOG OUT FROM GRID
              </button>
           </div>

           {/* Appearance Grid */}
           <div className="glass-card p-6 rounded-[2.5rem] border-border-color shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-2 mb-4">
                 <Sun className="w-4 h-4 text-accent" />
                 <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Interface Theme</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                 {[
                    { val: 'light', icon: Sun, label: 'LIGHT' },
                    { val: 'dark', icon: Moon, label: 'DARK' },
                    { val: 'system', icon: Laptop, label: 'SYSTEM' }
                 ].map((t) => (
                   <button 
                     key={t.val}
                     onClick={() => setTheme(t.val as any)}
                     className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === t.val ? 'bg-accent text-navy border-accent shadow-btn scale-[1.05]' : 'bg-bg-tertiary/10 text-text-tertiary border-white/5 shadow-inner'}`}
                   >
                      <t.icon className="w-4 h-4" />
                      <span className="text-[8px] font-black uppercase tracking-widest">{t.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* Weight Units */}
           <div className="glass-card p-6 rounded-[2.5rem] border-border-color shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-2 mb-4">
                 <Weight className="w-4 h-4 text-accent" />
                 <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Measurement Metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 {[
                    { val: 'kg', label: 'METRIC (KG)' },
                    { val: 'lbs', label: 'IMPERIAL (LBS)' }
                 ].map((u) => (
                   <button 
                     key={u.val}
                     onClick={() => updateSettings({ unit: u.val as any })}
                     className={`p-5 rounded-xl border font-black uppercase italic tracking-[0.2em] transition-all text-xs ${settings.unit === u.val ? 'bg-accent text-navy border-accent shadow-btn scale-[1.05]' : 'bg-bg-tertiary/10 text-text-tertiary border-white/5 opacity-40 shadow-inner'}`}
                   >
                     {u.label}
                   </button>
                 ))}
              </div>
           </div>

           {/* Data Export */}
           <div className="glass-card p-6 rounded-[2.5rem] border-border-color shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-2 mb-4">
                 <Download className="w-4 h-4 text-accent" />
                 <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Data Management</span>
              </div>
              <p className="text-[9px] text-text-tertiary font-medium mb-6 uppercase tracking-wider leading-relaxed">Extract your historical lifting performance into a raw CSV data file for advanced local analysis.</p>
              <button 
                onClick={handleExport}
                className="w-full py-5 bg-bg-accent text-accent border border-accent/20 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                 <Download className="w-4 h-4" /> EXPORT TO LOCAL STORAGE (.CSV)
              </button>
           </div>
        </section>

        <footer className="mt-16 text-center">
           <div className="w-10 h-1 bg-accent/20 rounded-full mx-auto mb-4" />
           <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em]">Gym Logger • Built with Next.js & Firebase</p>
           <p className="text-[7px] font-bold text-text-tertiary/40 uppercase tracking-[0.2em] mt-2 italic leading-relaxed">All rights performance reserved. Ver: 1.0.4-ELITE</p>
        </footer>

        <BottomNav />
      </main>
    </AuthGuard>
  );
}
