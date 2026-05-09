'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface PlateCalculatorProps {
  targetWeight: number;
  onClose: () => void;
}

export default function PlateCalculator({ targetWeight, onClose }: PlateCalculatorProps) {
  const BAR_WEIGHT = 20; // Standard barbell
  const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
  
  const calculatePlates = (target: number) => {
    let remaining = (target - BAR_WEIGHT) / 2;
    const result: Record<number, number> = {};
    
    if (remaining <= 0) return result;
    
    for (const plate of PLATES) {
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        result[plate] = count;
        remaining -= count * plate;
      }
    }
    return result;
  };

  const platesNeeded = calculatePlates(targetWeight);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-black overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white">
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="text-center mb-8">
           <span className="text-[10px] font-black text-neon-blue uppercase tracking-[0.2em]">Plate Calculator</span>
           <h3 className="text-3xl font-black font-outfit text-white uppercase italic mt-1">{targetWeight} KG</h3>
           <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-2">(20KG Bar + Plates / Side)</p>
        </div>

        <div className="space-y-4">
           {Object.keys(platesNeeded).length === 0 ? (
             <div className="py-10 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/5">
                <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Only the bar needed</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-2">
                {Object.entries(platesNeeded).sort((a,b) => Number(b[0]) - Number(a[1])).map(([weight, count]) => (
                   <div key={weight} className="flex items-center justify-between p-4 glass-card rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${Number(weight) >= 20 ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-neon-blue/10 border-neon-blue text-neon-blue'}`}>
                            {weight}
                         </div>
                         <span className="text-sm font-black text-white italic uppercase">{weight} KG Plate</span>
                      </div>
                      <span className="text-xl font-black font-mono text-white">x {count}</span>
                   </div>
                ))}
             </div>
           )}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 py-4 bg-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all font-outfit"
        >
          DISMISS CALCULATOR
        </button>
      </div>
    </div>
  );
}
