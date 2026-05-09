'use client';

import { useState, useEffect } from 'react';
import { Movement, Category } from '@/types';
import { getMovements, addCustomMovement } from '@/lib/firestore';
import { useAuth } from '@/context/auth-context';
import { Search, ChevronRight, X, Plus } from 'lucide-react';

interface MovementPickerProps {
  onSelect: (movement: Movement) => void;
  onClose: () => void;
}

const CATEGORIES: Category[] = ['Legs', 'Back', 'Chest', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'];

export default function MovementPicker({ onSelect, onClose }: MovementPickerProps) {
  const { user } = useAuth();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (user) {
      getMovements(user.uid).then(setMovements);
    }
  }, [user]);

  const filteredMovements = movements.filter(m => {
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateCustom = async () => {
    if (!user || !newName || activeCategory === 'All') return;
    const category = activeCategory as Category;
    const id = await addCustomMovement(user.uid, {
      name: newName,
      category,
      isCustom: true
    });
    const newMovement: Movement = {
      id,
      name: newName,
      category,
      isCustom: true
    };
    onSelect(newMovement);
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-[100] animate-in slide-in-from-bottom duration-300">
      <div className="absolute inset-0 bg-navy/90 backdrop-blur-xl" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 glass-card rounded-t-[3rem] px-6 pt-10 pb-20 flex flex-col space-y-6 max-h-[90vh] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tighter text-white font-outfit italic">CHOOSE <span className="text-neon-blue">MOVEMENT</span></h2>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl tap-feedback border border-white/5"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        {isCreating ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
             <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Exercise Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Weighted Pull-ups"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xl font-bold focus:outline-none focus:border-electric-purple/50 transition-all font-inter"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Select Category</label>
                <div className="flex flex-wrap gap-2">
                   {CATEGORIES.map(cat => (
                     <button 
                       key={cat}
                       onClick={() => setActiveCategory(cat)}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-electric-purple border-electric-purple text-white shadow-lg shadow-electric-purple/20' : 'bg-white/5 border-white/10 text-slate-500'}`}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
             </div>
             <div className="flex gap-4 pt-4">
                <button onClick={() => setIsCreating(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/5">Cancel</button>
                <button 
                  onClick={handleCreateCustom}
                  disabled={!newName || activeCategory === 'All'}
                  className="flex-[2] py-4 rounded-2xl bg-neon-blue text-navy text-[10px] font-black uppercase tracking-widest shadow-xl shadow-neon-blue/20 disabled:opacity-30 transition-all"
                >
                   Create & Select
                </button>
             </div>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-neon-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Search 100+ exercises..."
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-neon-blue/30 transition-all font-inter text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories Scroller */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
              <button 
                onClick={() => setActiveCategory('All')}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-300 border ${activeCategory === 'All' ? 'bg-neon-blue border-neon-blue text-navy shadow-lg shadow-neon-blue/20' : 'bg-white/5 border-white/10 text-slate-500'}`}
              >
                ALL
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border ${activeCategory === cat ? 'bg-electric-purple border-electric-purple text-white shadow-lg shadow-electric-purple/20' : 'bg-white/5 border-white/10 text-slate-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List of Movements */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              {filteredMovements.map(m => (
                <button 
                  key={m.id} 
                  onClick={() => onSelect(m)}
                  className="w-full glass-card p-5 rounded-2xl flex items-center justify-between group active:scale-95 transition-all border border-white/5 hover:border-white/10"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-neon-blue font-black text-xl font-outfit italic">{m.name.charAt(0)}</div>
                    <div>
                      <h4 className="text-white font-black font-outfit text-base uppercase italic leading-none">{m.name}</h4>
                      <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black mt-2">{m.category}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-neon-blue transition-colors" />
                  </div>
                </button>
              ))}
              
              <button 
                onClick={() => setIsCreating(true)}
                className="w-full py-8 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-electric-purple hover:border-electric-purple/20 transition-all group"
              >
                <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Custom Exercise</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
