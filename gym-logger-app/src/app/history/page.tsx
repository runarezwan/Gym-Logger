'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import AuthGuard from '@/components/auth-guard';
import BottomNav from '@/components/bottom-nav';
import { getWorkouts, removeWorkout, removeWorkoutEntry, updateWorkoutEntry, getPRs } from '@/lib/firestore';
import { Workout, WorkoutEntry } from '@/types';
import { Calendar, ChevronDown, ChevronRight, Clock, Trophy, Trash2, CalendarDays, TrendingUp, X } from 'lucide-react';
import WorkoutList from '@/components/workout-list';

export default function HistoryPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [prs, setPrs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name?: string } | null>(null);

  useEffect(() => {
    if (user) {
      Promise.all([
        getWorkouts(user.uid),
        getPRs(user.uid)
      ]).then(([ws, p]) => {
        setWorkouts(ws);
        setPrs(p);
        setLoading(false);
      });
    }
  }, [user]);

  const groupWorkoutsByWeek = (ws: Workout[]) => {
    const groups: Record<string, Workout[]> = {};
    ws.forEach(w => {
       const d = new Date(w.date);
       // Sunday-start week
       const diff = d.getDate() - d.getDay();
       const start = new Date(d.setDate(diff)).toISOString().split('T')[0];
       if (!groups[start]) groups[start] = [];
       groups[start].push(w);
    });
    return groups;
  };

  const workoutWeeks = groupWorkoutsByWeek(workouts);

  const getWeekLabel = (dateStr: string) => {
     const start = new Date(dateStr);
     const end = new Date(start);
     end.setDate(end.getDate() + 6);
     
     const f = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
     return `WEEK OF ${f(start)} — ${f(end)}`;
  };

  const getDayLabel = (dateStr: string) => {
     const d = new Date(dateStr);
     const today = new Date().toISOString().split('T')[0];
     const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
     
     if (dateStr === today) return "TODAY";
     if (dateStr === yesterday) return "YESTERDAY";
     return d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  };

  const handleDeleteWorkout = async (id: string) => {
     if (!user) return;
     await removeWorkout(user.uid, id);
     setWorkouts(prev => prev.filter(w => w.id !== id));
     setDeleteConfirm(null);
  };

  return (
    <AuthGuard>
      <main className="min-h-screen pt-12 pb-48 px-6 bg-bg-primary text-text-primary animate-fade-in font-outfit">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
             <CalendarDays className="w-4 h-4 text-accent" />
             <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">Performance Archive</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white">RECALL <span className="text-accent underline decoration-accent-light/10">ARCHIVE</span></h1>
          <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-black mt-3">Relive your previous victories.</p>
        </header>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-48 glass-card rounded-[2.5rem] border border-border-color bg-bg-secondary/50" />)}
          </div>
        ) : Object.keys(workoutWeeks).length === 0 ? (
          <div className="text-center py-24 glass-card rounded-[3rem] border-2 border-dashed border-border-color">
            <Calendar className="w-12 h-12 text-text-tertiary mx-auto mb-6 opacity-20" strokeWidth={1} />
            <p className="text-text-tertiary text-[10px] font-black uppercase tracking-widest leading-loose">No history detected.<br/>Push yourself and log a session.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(workoutWeeks).map(([week, ws]) => (
              <div key={week} className="space-y-6">
                 <h2 className="text-[12px] font-black text-accent uppercase tracking-[0.3em] pl-2 border-l-2 border-accent/20 animate-fade-in">{getWeekLabel(week)}</h2>
                 
                 <div className="space-y-4">
                    {ws.map(w => (
                      <div 
                        key={w.id} 
                        className={`glass-card rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${expandedId === w.id ? 'border-accent/40 bg-bg-secondary shadow-card-hover' : 'border-border-color bg-bg-secondary/50'}`}
                      >
                         <div className="flex items-center">
                            <button 
                              onClick={() => setExpandedId(expandedId === w.id ? null : w.id)}
                              className="flex-1 p-6 text-left flex items-start justify-between"
                            >
                               <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-[8px] font-black tracking-[0.2em] text-text-tertiary uppercase leading-none">
                                     <Clock className="w-3 h-3 text-accent" />
                                     <span>{getDayLabel(w.date)} • {new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                  </div>
                                  <h4 className="text-white font-black text-xl uppercase italic leading-none tracking-tight">{w.entries.length} EXERCISES LOGGED</h4>
                                  
                                  <div className="flex items-center gap-2 mt-4">
                                     <div className="flex items-center gap-1 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
                                        <TrendingUp className="w-2.5 h-2.5 text-accent" />
                                        <span className="text-[10px] font-black font-mono text-accent">{w.entries.reduce((sum, e) => sum + (e.weight * e.reps), 0).toLocaleString()} <span className="text-[8px] opacity-40">KG</span></span>
                                     </div>
                                     <div className="flex -space-x-2">
                                        {Array.from(new Set(w.entries.map(e => e.movementName))).slice(0, 3).map((name) => (
                                           <div key={name} className="w-6 h-6 rounded-full bg-navy border border-white/10 flex items-center justify-center text-[7px] font-black text-white uppercase shadow-sm" title={name}>
                                              {name.charAt(0)}
                                           </div>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-card ${expandedId === w.id ? 'bg-accent text-white scale-110' : 'bg-bg-tertiary/10 text-text-tertiary opacity-40 hover:opacity-100'}`}>
                                  {expandedId === w.id ? <ChevronDown strokeWidth={4} className="w-5 h-5" /> : <ChevronRight strokeWidth={4} className="w-5 h-5" />}
                               </div>
                            </button>
                            <button 
                               onClick={() => setDeleteConfirm({ id: w.id })}
                               className="p-6 text-danger opacity-0 group-hover:opacity-100 hover:scale-110 transition-all active:scale-90"
                            >
                               <Trash2 className="w-5 h-5" />
                            </button>
                         </div>

                         {expandedId === w.id && (
                           <div className="px-6 pb-8 space-y-6 animate-slide-up">
                              <div className="h-px bg-border-color/50" />
                              <WorkoutList 
                                 entries={w.entries}
                                 onUpdate={(id, up) => updateWorkoutEntry(user!.uid, w.id, id, up)}
                                 onDelete={(id) => removeWorkoutEntry(user!.uid, w.id, id)}
                                 onDeleteMovement={(name) => {}} // Simple delete for history
                                 onDuplicate={(entry) => {}} // No duplicate in history needed or same as home
                              />
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
              </div>
            ))}
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-[300] bg-navy/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in">
             <div className="w-full max-w-sm glass-card p-10 rounded-[3rem] border border-danger/30 animate-modal-in shadow-card-lg relative">
                 <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-danger/10 text-danger flex items-center justify-center mb-6">
                       <Trash2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black uppercase italic leading-none tracking-tighter text-white mb-3">ERASE RECORD?</h2>
                    <p className="text-[10px] text-text-tertiary uppercase font-black tracking-widest leading-relaxed">THIS ACTION IS IRREVERSIBLE. THE DATA WILL BE PURGED FROM THE ARCHIVE FOREVER.</p>
                 </div>

                 <div className="flex flex-col gap-3 mt-10">
                    <button 
                       onClick={() => handleDeleteWorkout(deleteConfirm.id)}
                       className="w-full py-5 bg-danger text-white rounded-[2rem] font-black uppercase italic tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-danger/20"
                    >
                       DELETE PERMANENTLY
                    </button>
                    <button 
                       onClick={() => setDeleteConfirm(null)}
                       className="w-full py-5 bg-bg-tertiary/10 text-text-tertiary rounded-[2rem] font-black uppercase italic tracking-widest text-xs active:scale-95 transition-all border border-white/5"
                    >
                       ABORT MISSION
                    </button>
                 </div>
             </div>
          </div>
        )}

        <BottomNav />
      </main>
    </AuthGuard>
  );
}
