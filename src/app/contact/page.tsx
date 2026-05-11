import { Mail, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 pt-24 pb-32 bg-navy text-white font-outfit overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-electric-purple/5 blur-[120px]" />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
             <MessageSquare className="w-5 h-5 text-accent" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Communication Channel</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-6">
            DIRECT <span className="text-accent underline decoration-accent-light/10">LINK</span>
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
            Establish connection for intel or support.
          </p>
        </header>

        <div className="glass-card p-10 md:p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl shadow-card-lg animate-modal-in">
          <form className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="email" className="text-[10px] font-black uppercase text-accent tracking-widest ml-1">TRANSMISSION SOURCE</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  id="email" 
                  placeholder="IDENTIFIER@DOMAIN.COM"
                  className="w-full bg-bg-secondary/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs font-black uppercase italic tracking-[0.2em] focus:outline-none focus:border-accent transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="message" className="text-[10px] font-black uppercase text-accent tracking-widest ml-1">ENCODED MESSAGE</label>
              <textarea 
                id="message" 
                rows={5}
                placeholder="REPORT FEEDBACK OR TECHNICAL DISCREPANCIES..."
                className="w-full bg-bg-secondary/50 border border-white/5 rounded-3xl p-6 text-xs font-black uppercase italic tracking-[0.2em] focus:outline-none focus:border-accent transition-all placeholder:text-slate-700 min-h-[160px] leading-relaxed"
              ></textarea>
            </div>

            <button 
              type="button"
              className="w-full bg-accent text-white py-6 rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] shadow-btn active:scale-95 transition-all text-xs flex items-center justify-center gap-4 group hover:bg-accent-hover"
            >
              INITIATE UPLOAD
              <Send className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </form>
        </div>

        <p className="text-center text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] mt-12">
          Encrypted tunnel established via Protocol-V4.
        </p>
      </div>
    </main>
  );
}
