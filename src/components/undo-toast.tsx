'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export default function UndoToast({ message, onUndo, onDismiss, duration = 5000 }: UndoToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const remaining = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration, onDismiss]);

  return (
    <div className="fixed bottom-32 left-6 right-6 z-[200] animate-modal-in">
       <div className="glass-card p-4 rounded-3xl border border-accent/20 bg-accent/10 backdrop-blur-2xl flex items-center justify-between gap-4 overflow-hidden shadow-card-lg">
          <div className="flex flex-col gap-1 items-start">
             <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">ACTION PERFORMED</span>
             <p className="text-sm font-bold text-slate-300 font-outfit uppercase italic">{message}</p>
          </div>
          
          <button 
            onClick={onUndo}
            className="px-6 py-3 bg-neon-blue rounded-2xl text-navy font-black uppercase text-[10px] italic flex items-center gap-2 active:scale-95 transition-all shadow-xl shadow-neon-blue/20"
          >
             <RotateCcw className="w-3.5 h-3.5" /> Undo
          </button>

          {/* Progress bar at the bottom */}
          <div className="absolute bottom-0 left-0 h-1 bg-neon-blue transition-all" style={{ width: `${progress}%` }} />
       </div>
    </div>
  );
}
