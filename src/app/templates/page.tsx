'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import AuthGuard from '@/components/auth-guard';
import BottomNav from '@/components/bottom-nav';
import { 
  getTemplates, 
  getTodayWorkout, 
  createTemplate, 
  addEntriesToWorkout, 
  createWorkout, 
  deleteTemplate,
  reorderTemplates
} from '@/lib/firestore';
import { Template, Workout, TemplateEntry } from '@/types';
import { ClipboardList, Plus, Play, Trash2, ChevronUp, ChevronDown, Check, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [savingTemplate, setSavingTemplate] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([getTemplates(user.uid), getTodayWorkout(user.uid)])
        .then(([ts, today]) => {
          setTemplates(ts);
          setTodayWorkout(today);
        });
    }
  }, [user]);

  const handleLoad = async (t: Template) => {
    if (!user) return;
    setLoadingId(t.id);
    
    let workoutId = todayWorkout?.id;
    if (!workoutId) {
      workoutId = await createWorkout(user.uid);
    }

    const entries: WorkoutEntry[] = t.entries.map(e => ({
       id: Math.random().toString(36).substr(2, 9),
       movementName: e.movementName,
       reps: e.reps,
       weight: e.weight,
       unit: e.unit,
       notes: '',
       createdAt: Date.now()
    }));

    await addEntriesToWorkout(user.uid, workoutId, entries);
    
    setLoadingId(null);
    setSuccessId(t.id);
    
    setTimeout(() => {
       setSuccessId(null);
       router.push('/');
    }, 1200);
  };

  const handleSaveAsTemplate = async () => {
     if (!user || !todayWorkout || todayWorkout.entries.length === 0) return;
     setSavingTemplate(true);
     const name = prompt("Name your blueprint:");
     if (!name) {
       setSavingTemplate(false);
       return;
     }

     const entries: TemplateEntry[] = todayWorkout.entries.map(e => ({
        movementName: e.movementName,
        reps: e.reps,
        weight: e.weight,
        unit: e.unit
     }));

     await createTemplate(user.uid, name, entries);
     const updated = await getTemplates(user.uid);
     setTemplates(updated);
     setSavingTemplate(false);
  };

  const handleDelete = async (id: string) => {
     if (!user) return;
     await deleteTemplate(user.uid, id);
     setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleReorder = async (idx: number, dir: 'up' | 'down') => {
     if (!user) return;
     const next = [...templates];
     const target = dir === 'up' ? idx - 1 : idx + 1;
     if (target < 0 || target >= next.length) return;
     
     const [removed] = next.splice(idx, 1);
     next.splice(target, 0, removed);
     
     // Optimistic
     setTemplates(next);
     
     // Sync
     const updates = next.map((t, i) => ({ id: t.id, order: i }));
     await reorderTemplates(user.uid, updates);
  };

  return (
    <AuthGuard>
      <main className="min-h-screen px-6 pt-10 pb-48 bg-bg-primary text-text-primary animate-fade-in font-outfit">
        <header className="mb-10 flex items-end justify-between">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">Routine Blueprints</span>
             </div>
             <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white tracking-widest leading-none">THE <span className="text-accent underline decoration-accent-light/10">STENCIL</span></h1>
             <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-black mt-3">{templates.length} Routines Saved.</p>
          </div>
          
          {todayWorkout && todayWorkout.entries.length > 0 && (
             <button 
               onClick={handleSaveAsTemplate}
               disabled={savingTemplate}
               className="bg-accent/10 border border-accent/30 text-accent p-4 rounded-3xl active:scale-95 transition-all animate-fade-in"
             >
                <Save className={`w-5 h-5 ${savingTemplate ? 'animate-spin' : ''}`} />
             </button>
          )}
        </header>

        <section className="space-y-4">
           {templates.length === 0 ? (
              <div className="text-center py-24 glass-card rounded-[3rem] border-2 border-dashed border-border-color">
                 <Plus className="w-12 h-12 text-text-tertiary mx-auto mb-6 opacity-20" strokeWidth={1} />
                 <p className="text-text-tertiary text-[10px] font-black uppercase tracking-widest">No blueprints found.</p>
              </div>
           ) : (
              <div className="space-y-4">
                 {templates.sort((a, b) => a.order - b.order).map((t, i) => (
                    <div 
                      key={t.id} 
                      className="glass-card p-6 rounded-[2.5rem] border border-border-color shadow-card hover:border-accent/40 transition-all flex items-center justify-between group overflow-hidden"
                    >
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{t.entries.length} Exercises Integrated</span>
                          <h4 className="text-lg font-black uppercase text-white italic tracking-tighter">{t.name}</h4>
                          <div className="flex gap-1 mt-3">
                             {t.entries.slice(0, 2).map((e, idx) => (
                               <span key={idx} className="px-2 py-0.5 bg-bg-tertiary/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-text-tertiary italic">
                                  {e.movementName}
                               </span>
                             ))}
                             {t.entries.length > 2 && <span className="text-[8px] font-black text-slate-700 opacity-40 ml-1">+ {t.entries.length - 2} MORE</span>}
                          </div>
                       </div>

                       <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleReorder(i, 'up')} className="p-1 hover:text-accent transition-colors"><ChevronUp className="w-4 h-4" /></button>
                             <button onClick={() => handleReorder(i, 'down')} className="p-1 hover:text-accent transition-colors"><ChevronDown className="w-4 h-4" /></button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => handleDelete(t.id)}
                               className="w-10 h-10 rounded-xl bg-danger/5 text-danger flex items-center justify-center active:scale-95 hover:bg-danger/10 transition-all shadow-xl shadow-danger/5"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => handleLoad(t)}
                               disabled={loadingId === t.id || successId === t.id}
                               className={`h-14 min-w-[3.5rem] rounded-2xl flex items-center justify-center font-black uppercase italic tracking-widest text-[10px] transition-all active:scale-95 shadow-xl ${successId === t.id ? 'bg-success text-navy' : 'bg-accent text-white shadow-accent/20'}`}
                             >
                                {loadingId === t.id ? (
                                   <Loader2 className="w-5 h-5 animate-spin" />
                                ) : successId === t.id ? (
                                   <div className="flex items-center gap-1"><Check strokeWidth={4} className="w-4 h-4" /> LOADED</div>
                                ) : (
                                   <Play className="w-5 h-5 fill-white" />
                                )}
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </section>

        <BottomNav />
      </main>
    </AuthGuard>
  );
}
