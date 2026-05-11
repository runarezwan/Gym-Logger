'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { seedDefaultMovements, getTemplates, createTemplate } from '@/lib/firestore';
import { Database, Check, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { TemplateEntry } from '@/types';

export default function SeedPage() {
  const { user } = useAuth();
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSeedMovements = async () => {
    if (!user) return;
    setLoadingMovements(true);
    await seedDefaultMovements(user.uid);
    setLoadingMovements(false);
    setSuccess('movements');
    setTimeout(() => setSuccess(null), 2000);
  };

  const handleSeedTemplates = async () => {
    if (!user) return;
    setLoadingTemplates(true);
    
    // Check if any templates exist
    const current = await getTemplates(user.uid);
    if (current.length > 0) {
      alert("System already initialized with templates.");
      setLoadingTemplates(false);
      return;
    }

    const majesticA: TemplateEntry[] = [
      { movementName: 'Squat', reps: 5, weight: 100, unit: 'kg' },
      { movementName: 'Bench Press', reps: 5, weight: 80, unit: 'kg' },
      { movementName: 'Barbell Row', reps: 5, weight: 70, unit: 'kg' }
    ];
    const majesticB: TemplateEntry[] = [
      { movementName: 'Deadlift', reps: 5, weight: 120, unit: 'kg' },
      { movementName: 'Overhead Press', reps: 5, weight: 50, unit: 'kg' },
      { movementName: 'Pull-Up', reps: 8, weight: 0, unit: 'kg' }
    ];
    
    await createTemplate(user.uid, "Majestic Full Body A", majesticA);
    await createTemplate(user.uid, "Majestic Full Body B", majesticB);
    
    setLoadingTemplates(false);
    setSuccess('templates');
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <main className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-6 font-outfit">
      <div className="w-full max-w-sm glass-card p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-[2.5rem] bg-accent/10 flex items-center justify-center mb-8">
           <Database className="w-10 h-10 text-accent" />
        </div>
        
        <h1 className="text-3xl font-black uppercase italic leading-none tracking-tighter mb-4">SYSTEM <span className="text-accent underline decoration-accent-light/10">SEED</span></h1>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose mb-12">INITIALIZE YOUR ARCHIVE INFRASTRUCTURE.</p>

        <div className="w-full space-y-4">
           <button 
             onClick={handleSeedMovements}
             disabled={loadingMovements}
             className={`w-full py-6 rounded-[2rem] font-black uppercase italic tracking-[0.2em] shadow-btn active:scale-95 transition-all text-xs flex items-center justify-center gap-4 ${success === 'movements' ? 'bg-success text-navy' : 'bg-accent text-white shadow-accent/20'}`}
           >
              {loadingMovements ? <Loader2 className="w-5 h-5 animate-spin" /> : 
               success === 'movements' ? <Check className="w-5 h-5" strokeWidth={4} /> : 
               <><Sparkles className="w-4 h-4" /> SEED MOTHER LIBRARY</>}
           </button>

           <button 
             onClick={handleSeedTemplates}
             disabled={loadingTemplates}
             className={`w-full py-6 rounded-[2rem] font-black uppercase italic tracking-[0.2em] shadow-btn active:scale-95 transition-all text-xs flex items-center justify-center gap-4 ${success === 'templates' ? 'bg-success text-navy' : 'bg-accent text-white shadow-accent/20'}`}
           >
              {loadingTemplates ? <Loader2 className="w-5 h-5 animate-spin" /> : 
               success === 'templates' ? <Check className="w-5 h-5" strokeWidth={4} /> : 
               <><Sparkles className="w-4 h-4" /> SEED BLUEPRINTS</>}
           </button>
        </div>

        <div className="mt-12 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-start gap-3">
           <AlertTriangle className="w-12 h-12 text-yellow-500 shrink-0" />
           <p className="text-[8px] font-black text-yellow-500 uppercase tracking-widest text-left leading-relaxed italic">Warning: Seeding is idempotent but final. Avoid multiple manual triggers unless system resets are required.</p>
        </div>
      </div>
    </main>
  );
}
