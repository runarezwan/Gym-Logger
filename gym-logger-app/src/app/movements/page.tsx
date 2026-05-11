'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import AuthGuard from '@/components/auth-guard';
import BottomNav from '@/components/bottom-nav';
import { getMovements, addCustomMovement, deleteMovement } from '@/lib/firestore';
import { Movement, Category } from '@/types';
import { Plus, Search, Trash2, Tag, ChevronDown, Activity, X } from 'lucide-react';

const CATEGORIES: Category[] = ['Legs', 'Back', 'Chest', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'];

export default function MovementsPage() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<Category>('Legs');

  useEffect(() => {
    if (user) getMovements(user.uid).then(setMovements);
  }, [user]);

  const handleAdd = async () => {
    if (!user || !newName.trim()) return;
    const m = { name: newName, category: newCat, isCustom: true };
    const id = await addCustomMovement(user.uid, m);
    setMovements([...movements, { id, ...m }]);
    setNewName('');
    setShowAdd(false);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteMovement(user.uid, id);
    setMovements(prev => prev.filter(m => m.id !== id));
  };

  const filtered = movements.filter(m => {
    const matchesFilter = filter === 'All' || m.category === filter;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AuthGuard>
      <main className="min-h-screen px-6 pt-10 pb-48 bg-bg-primary text-text-primary animate-fade-in">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
             <Activity className="w-4 h-4 text-accent" />
             <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Exercise Library</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter font-outfit uppercase italic leading-none">THE <span className="text-accent underline decoration-accent-light/30">GALLERY</span></h1>
          <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-black mt-3">{movements.length} Movements Available.</p>
        </header>

        <section className="space-y-8">
           {/* Search & Filter */}
           <div className="space-y-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   placeholder="Search library..."
                   className="w-full bg-bg-secondary border border-border-color rounded-2xl py-4 pl-10 pr-4 text-xs font-black uppercase italic tracking-widest focus:outline-none focus:border-accent shadow-card"
                 />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                 {['All', ...CATEGORIES].map((c) => (
                   <button 
                     key={c} 
                     onClick={() => setFilter(c as Category | 'All')}
                     className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === c ? 'bg-accent text-white shadow-btn' : 'bg-bg-tertiary text-text-secondary hover:text-accent'}`}
                   >
                     {c}
                   </button>
                 ))}
              </div>
           </div>

           {/* List */}
           <div className="grid grid-cols-1 gap-3">
              {filtered.map(m => (
                <div key={m.id} className="glass-card p-5 rounded-[2rem] border-border-color flex items-center justify-between group h-16 animate-modal-in">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent">
                         <Tag className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none mb-1">{m.category}</span>
                         <h4 className="text-sm font-black font-outfit uppercase italic leading-none text-white tracking-tight">{m.name}</h4>
                      </div>
                   </div>
                   <button 
                     onClick={() => handleDelete(m.id)}
                     className="w-8 h-8 rounded-lg text-danger opacity-0 group-hover:opacity-100 hover:bg-danger/10 transition-all flex items-center justify-center active:scale-90"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              ))}
           </div>
        </section>

        {/* Add Fabrication Button */}
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2">
           <button 
             onClick={() => setShowAdd(true)}
             className="bg-navy text-white px-10 py-5 rounded-[2.5rem] border border-white/5 font-black uppercase tracking-widest italic text-xs shadow-card-lg active:scale-95 transition-all flex items-center gap-3 drop-shadow-[0_0_15px_rgba(59,130,246,0.15)] group"
           >
              <div className="w-6 h-6 rounded-lg bg-accent text-navy flex items-center justify-center group-hover:rotate-90 transition-transform"><Plus strokeWidth={4} className="w-4 h-4" /></div>
              ADD NEW MOVEMENT
           </button>
        </div>

        {/* Add Modal Placeholder (actually a slide-up panel) */}
        {showAdd && (
          <div className="fixed inset-0 z-[200] bg-navy/80 backdrop-blur-xl animate-fade-in flex items-end px-6 pb-6">
             <div className="w-full max-w-lg mx-auto glass-card rounded-[3rem] border border-accent/20 p-8 space-y-8 animate-modal-in shadow-card-lg relative bg-navy/90">
                <button onClick={() => setShowAdd(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col gap-1 items-center text-center">
                   <div className="w-14 h-14 rounded-3xl bg-accent text-navy flex items-center justify-center mb-4"><Activity className="w-8 h-8" /></div>
                   <h2 className="text-3xl font-black font-outfit uppercase italic text-white tracking-tighter">NEW ARCHETYPE</h2>
                   <p className="text-[10px] text-text-tertiary uppercase font-black tracking-widest">Add a custom exercise to your library.</p>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-accent tracking-widest ml-1">MOVEMENT NAME</label>
                      <input 
                        type="text" 
                        value={newName} onChange={e => setNewName(e.target.value)}
                        placeholder="e.g. Weighted Pull-Ups"
                        className="w-full bg-bg-secondary/50 border border-border-color rounded-2xl p-5 text-lg font-black uppercase italic tracking-widest focus:outline-none focus:border-accent text-white"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-accent tracking-widest ml-1">TARGET CATEGORY</label>
                      <div className="grid grid-cols-2 gap-3">
                         {CATEGORIES.map(c => (
                           <button 
                             key={c}
                             onClick={() => setNewCat(c)}
                             className={`p-4 rounded-xl border font-black uppercase italic text-[10px] tracking-widest transition-all ${newCat === c ? 'bg-accent text-navy border-accent shadow-btn scale-[1.02]' : 'bg-bg-tertiary/10 text-text-tertiary border-white/5'}`}
                           >
                             {c}
                           </button>
                         ))}
                      </div>
                   </div>

                   <button 
                     onClick={handleAdd}
                     className="w-full bg-accent text-white py-6 rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] shadow-btn active:scale-95 transition-all text-sm mt-4"
                   >
                     CREATE MOVEMENT
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
