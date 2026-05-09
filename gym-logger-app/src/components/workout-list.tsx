'use client';

import { WorkoutEntry } from '@/types';
import { Trash2, Copy, Pencil, Check, X } from 'lucide-react';
import { useState } from 'react';

interface WorkoutListProps {
  entries: WorkoutEntry[];
  onUpdate: (id: string, updates: Partial<WorkoutEntry>) => void;
  onDelete: (id: string) => void;
  onDeleteMovement: (name: string) => void;
  onDuplicate: (entry: WorkoutEntry) => void;
}

export default function WorkoutList({ entries, onUpdate, onDelete, onDeleteMovement, onDuplicate }: WorkoutListProps) {
  // Group by movementName
  const groups = entries.reduce((acc, entry) => {
    if (!acc[entry.movementName]) acc[entry.movementName] = [];
    acc[entry.movementName].push(entry);
    return acc;
  }, {} as Record<string, WorkoutEntry[]>);

  return (
    <div className="space-y-12 pb-32 animate-fade-in">
      {Object.entries(groups).map(([name, group]) => (
        <div key={name} className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none mb-1">
                 {group.length} SETS TOTAL
              </span>
              <h3 className="text-xl font-black font-outfit uppercase italic leading-none text-white tracking-tighter">
                {name}
              </h3>
            </div>
            <button 
               onClick={() => onDeleteMovement(name)}
               className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger active:scale-90 transition-transform"
            >
               <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
             {group.map((entry, idx) => (
               <SetRow 
                 key={entry.id} 
                 entry={entry} 
                 idx={idx} 
                 onUpdate={onUpdate} 
                 onDelete={onDelete}
                 onDuplicate={onDuplicate}
               />
             ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SetRow({ entry, idx, onUpdate, onDelete, onDuplicate }: { 
  entry: WorkoutEntry; 
  idx: number; 
  onUpdate: (id: string, updates: Partial<WorkoutEntry>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (entry: WorkoutEntry) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [reps, setReps] = useState(entry.reps);
  const [weight, setWeight] = useState(entry.weight);

  const handleSave = () => {
     onUpdate(entry.id, { reps, weight });
     setIsEditing(false);
  };

  return (
    <div className="glass-card p-5 rounded-[2rem] border-border-color flex items-center justify-between gap-4 group hover:border-accent/40 transition-all shadow-card">
       <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center text-[10px] font-black italic text-accent font-outfit">
             {idx + 1}
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-3 animate-fade-in">
               <input 
                 type="number" 
                 className="w-14 bg-bg-accent border border-accent/30 rounded-lg py-2 text-center text-lg font-black font-mono focus:outline-none"
                 value={reps}
                 onChange={e => setReps(Number(e.target.value))}
                 autoFocus
               />
               <span className="text-[10px] font-black text-text-tertiary">×</span>
               <input 
                 type="number" 
                 step="2.5"
                 className="w-16 bg-bg-accent border border-accent/30 rounded-lg py-2 text-center text-lg font-black font-mono focus:outline-none"
                 value={weight}
                 onChange={e => setWeight(Number(e.target.value))}
               />
               <div className="flex gap-1 ml-2">
                  <button onClick={handleSave} className="w-8 h-8 rounded-lg bg-success text-navy flex items-center justify-center"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setIsEditing(false)} className="w-8 h-8 rounded-lg bg-bg-tertiary text-text-secondary flex items-center justify-center"><X className="w-4 h-4" /></button>
               </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-3 text-left"
            >
               <span className="text-2xl font-black font-mono leading-none tracking-tighter">
                  {entry.reps} <span className="text-[10px] font-bold text-text-tertiary uppercase">Reps</span>
               </span>
               <div className="w-1 h-1 rounded-full bg-accent/20" />
               <span className="text-2xl font-black font-mono leading-none tracking-tighter text-accent">
                  {entry.weight} <span className="text-[10px] font-bold text-accent/60 uppercase">{entry.unit}</span>
               </span>
            </button>
          )}
       </div>

       {!isEditing && (
         <div className="flex items-center gap-2">
            <button 
              onClick={() => onDuplicate(entry)}
              className="w-8 h-8 rounded-xl bg-bg-accent/50 text-accent flex items-center justify-center hover:bg-accent hover:text-white active:scale-90 transition-all opacity-0 group-hover:opacity-100"
            >
               <Copy className="w-4 h-4" />
            </button>
            <button 
               onClick={() => onDelete(entry.id)}
               className="w-8 h-8 rounded-xl bg-danger/5 text-danger flex items-center justify-center hover:bg-danger hover:text-white active:scale-90 transition-all opacity-0 group-hover:opacity-100"
            >
               <Trash2 className="w-4 h-4" />
            </button>
         </div>
       )}
    </div>
  );
}
