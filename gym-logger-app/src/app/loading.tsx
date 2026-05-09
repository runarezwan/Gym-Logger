export default function Loading() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 text-center animate-fade-in">
       <div className="relative">
          <div className="w-20 h-20 border-4 border-neon-blue/10 rounded-full" />
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-neon-blue rounded-full animate-spin" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-neon-blue rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse" />
       </div>
       <h2 className="text-3xl font-black font-outfit uppercase italic text-white tracking-widest mt-10">CALIBRATING</h2>
       <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-3">Establishing Neural Link with Grid...</p>
    </div>
  );
}
