'use client';

import { useState, useEffect, useRef } from 'react';
import { Movement, WorkoutEntry } from '@/types';
import { getMovements } from '@/lib/firestore';
import { useAuth } from '@/context/auth-context';
import { useSettings } from '@/context/settings-context';
import { Plus, RotateCcw, ChevronDown, ChevronUp, Search, X } from 'lucide-react';

interface WorkoutFormProps {
  onLog: (entry: Omit<WorkoutEntry, 'id' | 'createdAt'>) => void;
  lastEntry?: WorkoutEntry;
}

export default function WorkoutForm({ onLog, lastEntry }: WorkoutFormProps) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [movement, setMovement] = useState('');
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(60);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filtered, setFiltered] = useState<Movement[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const moveInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) getMovements(user.uid).then(setMovements);
  }, [user]);

  useEffect(() => {
    if (movement.trim()) {
      const top = movements
        .filter(m => m.name.toLowerCase().includes(movement.toLowerCase()))
        .slice(0, 8);
      setFiltered(top);
      setShowDropdown(top.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [movement, movements]);

  // Handle smart defaults
  useEffect(() => {
    if (lastEntry) {
      setReps(lastEntry.reps);
      setWeight(lastEntry.weight);
    }
  }, [lastEntry]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!movement.trim()) return;
    
    onLog({
      movementName: movement,
      reps,
      weight,
      unit: settings.unit,
      notes
    });

    // Reset but prefill with same values for next set
    setNotes('');
    moveInputRef.current?.focus();
  };

  const selectMovement = (name: string) => {
    setMovement(name);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-4 animate-fade-in mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Movement Autocomplete */}
        <div className="relative">
          <div className="relative flex items-center">
             <Search className="absolute left-4 w-5 h-5 text-text-tertiary" />
             <input
               ref={moveInputRef}
               type="text"
               placeholder="What exercise?"
               value={movement}
               onChange={(e) => setMovement(e.target.value)}
               className="w-full bg-bg-secondary border border-border-color rounded-2xl py-4 pl-12 pr-4 text-lg font-bold placeholder:text-text-tertiary focus:border-accent focus:ring-1 focus:ring-accent outline-none font-outfit"
               onFocus={() => movement.trim() && filtered.length > 0 && setShowDropdown(true)}
             />
             {movement && (
               <button type="button" onClick={() => setMovement('')} className="absolute right-4 text-text-tertiary">
                 <X className="w-5 h-5" />
               </button>
             )}
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 glass-card rounded-2xl border border-border-color overflow-hidden shadow-card-lg animate-modal-in">
              {filtered.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectMovement(m.name)}
                  className="w-full text-left px-5 py-4 border-b border-border-color last:border-0 hover:bg-bg-accent active:bg-accent-active transition-colors font-outfit text-sm font-bold uppercase italic tracking-wide"
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inputs Group */}
        <div className="grid grid-cols-2 gap-4">
           {/* Reps */}
           <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-1 border-border-color">
              <span className="text-[10px] font-black uppercase text-text-tertiary tracking-[0.2em]">Reps</span>
              <div className="flex items-center gap-4">
                 <button type="button" onClick={() => setReps(Math.max(1, reps - 1))} className="w-10 h-10 rounded-xl bg-bg-accent flex items-center justify-center text-accent font-black">-</button>
                 <input 
                   type="number"
                   value={reps}
                   onChange={e => setReps(Number(e.target.value))}
                   className="w-12 text-center text-2xl font-black font-mono focus:outline-none bg-transparent" 
                 />
                 <button type="button" onClick={() => setReps(reps + 1)} className="w-10 h-10 rounded-xl bg-bg-accent flex items-center justify-center text-accent font-black">+</button>
              </div>
           </div>

           {/* Weight */}
           <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-1 border-border-color">
              <span className="text-[10px] font-black uppercase text-text-tertiary tracking-[0.2em]">Weight ({settings.unit})</span>
              <div className="flex items-center gap-4">
                 <button type="button" onClick={() => setWeight(Math.max(0, weight - 2.5))} className="w-10 h-10 rounded-xl bg-bg-accent flex items-center justify-center text-accent font-black">-</button>
                 <input 
                    type="number"
                    step="2.5"
                    value={weight}
                    onChange={e => setWeight(Number(e.target.value))}
                    className="w-16 text-center text-2xl font-black font-mono focus:outline-none bg-transparent whitespace-nowrap" 
                 />
                 <button type="button" onClick={() => setWeight(weight + 2.5)} className="w-10 h-10 rounded-xl bg-bg-accent flex items-center justify-center text-accent font-black">+</button>
              </div>
           </div>
        </div>

        {/* Notes Toggle */}
        <div>
           <button 
             type="button" 
             onClick={() => setShowNotes(!showNotes)} 
             className="text-[10px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-1 hover:text-accent transition-colors mb-2"
           >
              {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              NOTES {notes ? '• ADDED' : ''}
           </button>
           {showNotes && (
             <textarea 
               value={notes}
               onChange={e => setNotes(e.target.value)}
               placeholder="Any performance notes?"
               className="w-full bg-bg-secondary border border-border-color rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-accent min-h-[100px] animate-fade-in"
             />
           )}
        </div>

        {/* Primary Buttons */}
        <div className="space-y-3 pt-2">
           <button 
             type="submit"
             className="w-full bg-accent hover:bg-accent-hover active:scale-95 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-2 shadow-btn transition-all font-outfit"
           >
              <Plus className="w-5 h-5" strokeWidth={3} /> Log Set
           </button>

           {lastEntry && (
              <button 
                type="button"
                onClick={() => {
                   const { id, createdAt, ...payload } = lastEntry;
                   onLog(payload);
                }}
                className="w-full bg-bg-accent hover:bg-bg-accent/80 active:scale-95 text-accent py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] flex items-center justify-center gap-2 border border-accent/20 transition-all font-outfit"
              >
                 <RotateCcw className="w-4 h-4" /> Repeat {lastEntry.movementName} Set
              </button>
           )}
        </div>
      </form>
    </div>
  );
}
