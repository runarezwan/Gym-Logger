import { Activity, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 pt-24 pb-32 bg-navy text-white font-outfit overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-electric-purple/5 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
             <Activity className="w-5 h-5 text-accent" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-6">
            THE <span className="text-accent underline decoration-accent-light/10">PROTOCOL</span>
          </h1>
          <p className="text-sm text-slate-400 uppercase tracking-widest font-bold max-w-xl mx-auto leading-relaxed">
            Gym Logger is not just an application. It is a precision instrument designed for the elite athlete.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Mission Critical</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our protocol is simple: Remove every friction point between you and your progress. We provide the fastest, most reliable way to log sets and reps while offering deep insights into your performance metrics.
            </p>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-electric-purple/10 flex items-center justify-center text-electric-purple">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Zero Compromise</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Built for serious lifters, Gym Logger meticulously tracks your journey without the clutter of social distractions or data harvesting. Your performance data is your edge.
            </p>
          </div>
        </div>

        <footer className="text-center">
          <div className="w-12 h-1 bg-accent/20 rounded-full mx-auto mb-6" />
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Proprietary Training Software v1.0.4-ELITE</p>
        </footer>
      </div>
    </main>
  );
}
