'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useSettings } from '@/context/settings-context';
import AuthGuard from '@/components/auth-guard';
import BottomNav from '@/components/bottom-nav';
import WorkoutForm from '@/components/workout-form';
import WorkoutList from '@/components/workout-list';
import UndoToast from '@/components/undo-toast';
import { 
  getTodayWorkout, 
  createWorkout, 
  addWorkoutEntry, 
  updateWorkoutEntry, 
  removeWorkoutEntry,
  finishWorkout,
  getPRs
} from '@/lib/firestore';
import { Workout, WorkoutEntry } from '@/types';
import { Check, Dumbbell, Activity, Trophy, Play, TrendingUp, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();
  
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [undoAction, setUndoAction] = useState<{ message: string; action: () => void } | null>(null);
  const [finishConfirm, setFinishConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [recordCount, setRecordCount] = useState(0);

  const fetchWorkout = useCallback(async () => {
    if (!user) return;
    const w = await getTodayWorkout(user.uid);
    setActiveWorkout(w);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWorkout();
    if (user) {
       getPRs(user.uid).then(prs => setRecordCount(Object.keys(prs).length));
    }
  }, [fetchWorkout, user]);

  const handleLogSet = async (entryData: Omit<WorkoutEntry, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    let workoutId = activeWorkout?.id;
    if (!workoutId) {
      workoutId = await createWorkout(user.uid);
    }

    const newEntry = await addWorkoutEntry(user.uid, workoutId, entryData);
    
    // Optimistic / Local update
    setActiveWorkout(prev => {
      const entries = prev ? [...prev.entries, newEntry] : [newEntry];
      return {
        id: workoutId!,
        date: new Date().toISOString().split('T')[0],
        entries,
        createdAt: prev?.createdAt || Date.now(),
        completed: false
      };
    });
  };

  const handleUpdateSet = async (id: string, updates: Partial<WorkoutEntry>) => {
    if (!user || !activeWorkout) return;
    await updateWorkoutEntry(user.uid, activeWorkout.id, id, updates);
    setActiveWorkout({
      ...activeWorkout,
      entries: activeWorkout.entries.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  };

  const handleDeleteSet = async (id: string) => {
    if (!user || !activeWorkout) return;
    await removeWorkoutEntry(user.uid, activeWorkout.id, id);
    setActiveWorkout({
      ...activeWorkout,
      entries: activeWorkout.entries.filter(e => e.id !== id)
    });
  };

  const handleDeleteMovement = async (name: string) => {
    if (!user || !activeWorkout) return;
    const originalEntries = activeWorkout.entries;
    const toDelete = activeWorkout.entries.filter(e => e.movementName === name);
    
    // Local update
    setActiveWorkout({
      ...activeWorkout,
      entries: activeWorkout.entries.filter(e => e.movementName !== name)
    });

    setUndoAction({
       message: `Deleted ${name} (${toDelete.length} sets)`,
       action: () => {
          setActiveWorkout({ ...activeWorkout, entries: originalEntries });
          setUndoAction(null);
       }
    });

    // Background sync (delayed)
    setTimeout(async () => {
       // if undoAction still exists and matches this message, we didn't undo
       if (undoAction?.message.includes(name)) {
         for (const entry of toDelete) {
           await removeWorkoutEntry(user.uid!, activeWorkout.id, entry.id);
         }
       }
    }, 5000);
  };

  const handleFinish = async () => {
    if (!finishConfirm) {
       setFinishConfirm(true);
       setTimeout(() => setFinishConfirm(false), 3000);
       return;
    }

    if (!user || !activeWorkout) return;
    await finishWorkout(user.uid, activeWorkout.id);
    setShowSuccess(true);
    setTimeout(() => {
       setActiveWorkout(null);
       setShowSuccess(false);
       setFinishConfirm(false);
    }, 2000);
  };

  const totalVolume = activeWorkout?.entries.reduce((sum, e) => sum + (e.weight * e.reps), 0) || 0;
  const lastLogged = activeWorkout?.entries[activeWorkout.entries.length - 1];

  return (
    <AuthGuard>
      <main className="min-h-screen px-6 pt-10 pb-48 bg-bg-primary text-text-primary animate-fade-in relative">
        <header className="flex items-center justify-between mb-10">
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black tracking-[0.2em] text-text-tertiary uppercase leading-none italic">Elite Tracker</span>
              <h1 className="text-4xl font-black font-outfit uppercase italic leading-none tracking-tighter">
                Today&apos;s <span className="text-accent underline decoration-accent-light/30">LIFT</span>
              </h1>
           </div>
           <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black uppercase text-accent leading-none">{recordCount} Records</span>
                 <div className="flex items-center gap-1 mt-1">
                    <Trophy className="w-3 h-3 text-accent fill-accent shadow-glow-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                 </div>
              </div>
           </div>
        </header>

        <section className="space-y-10">
           {/* Form Section */}
           <div className="glass-card p-6 rounded-[2.5rem] border border-border-color shadow-card relative overflow-hidden bg-bg-secondary/50">
              <div className="absolute top-0 right-0 p-4">
                 <Activity className="w-5 h-5 text-accent/20" />
              </div>
              <WorkoutForm onLog={handleLogSet} lastEntry={lastLogged} />
           </div>

           {/* List Section */}
           <div>
              <div className="flex items-center justify-between px-2 mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-1 bg-accent rounded-full" />
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] italic text-text-primary">LOGGED PERFORMANCE</span>
                 </div>
                 {activeWorkout && activeWorkout.entries.length > 0 && (
                   <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                      <TrendingUp className="w-3 h-3 text-accent" />
                      <span className="text-[10px] font-mono font-black text-accent">{totalVolume} KG</span>
                   </div>
                 )}
              </div>

              {!activeWorkout || activeWorkout.entries.length === 0 ? (
                 <div className="text-center py-24 glass-card rounded-[3rem] border-2 border-dashed border-border-color bg-transparent">
                    <Dumbbell className="w-16 h-16 text-text-tertiary/20 mx-auto mb-6" strokeWidth={1} />
                    <h4 className="text-text-tertiary text-[10px] font-black uppercase tracking-[0.2em]">Start your session</h4>
                    <p className="text-text-tertiary/60 text-[10px] font-bold mt-2 uppercase">Log your first set above to begin tracking.</p>
                 </div>
              ) : (
                 <div className="space-y-8">
                    <WorkoutList 
                      entries={activeWorkout.entries}
                      onUpdate={handleUpdateSet}
                      onDelete={handleDeleteSet}
                      onDeleteMovement={handleDeleteMovement}
                      onDuplicate={handleLogSet}
                    />

                    {/* Finish Button Fixed-ish */}
                    <div className="fixed bottom-32 left-6 right-6">
                       <button 
                         onClick={handleFinish}
                         className={`w-full py-6 rounded-[2rem] font-black uppercase italic tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-card-lg transition-all active:scale-95 border-2 ${finishConfirm ? 'bg-success text-navy border-success shadow-success/20' : 'bg-navy text-white border-white/5'}`}
                       >
                          {finishConfirm ? (
                             <>TAP AGAIN TO CONFIRM</>
                          ) : (
                             <><Check strokeWidth={4} className="w-5 h-5 text-accent" /> FINISH SESSION</>
                          )}
                       </button>
                    </div>
                 </div>
              )}
           </div>
        </section>

        <BottomNav />

        {undoAction && (
           <UndoToast 
              message={undoAction.message} 
              onUndo={undoAction.action} 
              onDismiss={() => setUndoAction(null)} 
           />
        )}

        {showSuccess && (
          <div className="fixed inset-0 z-[300] bg-navy/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-modal-in">
             <div className="w-24 h-24 rounded-full bg-success flex items-center justify-center text-navy shadow-[0_0_50px_rgba(52,211,153,0.3)] mb-8">
                <Check className="w-12 h-12" strokeWidth={4} />
             </div>
             <h2 className="text-4xl font-black font-outfit uppercase italic text-white tracking-widest leading-none mb-4">SESSION COMPLETE</h2>
             <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                   <span className="text-white text-2xl font-black font-mono">{activeWorkout?.entries.length}</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase">Sets</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col items-center">
                   <span className="text-accent text-2xl font-black font-mono">{totalVolume}</span>
                   <span className="text-[10px] font-black text-slate-500 uppercase">KG Volume</span>
                </div>
             </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
