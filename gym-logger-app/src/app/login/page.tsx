'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertCircle, LogIn, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const { user, login, loginRedirect } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
         await loginRedirect();
      } else {
         setError(err.message || "Failed to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-6 font-outfit overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-accent/20 blur-[120px] animate-pulse" />
         <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-electric-purple/10 blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-sm glass-card p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative z-10 flex flex-col items-center text-center backdrop-blur-3xl animate-modal-in">
        <div className="w-20 h-20 rounded-[2.5rem] bg-accent/10 flex items-center justify-center mb-8 shadow-inner shadow-accent/20">
           <LogIn className="w-10 h-10 text-accent" />
        </div>
        
        <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter mb-4">GYM <span className="text-accent underline decoration-accent-light/10">LOGGER</span></h1>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose mb-12">AUTHENTICATE YOUR PERFORMANCE IDENTITY.</p>

        {error && (
          <div className="w-full p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-fade-in">
             <AlertCircle className="w-5 h-5 text-red-500" />
             <span className="text-[10px] font-black text-red-500 uppercase text-left">{error}</span>
          </div>
        )}

        <div className="w-full space-y-4">
           <button 
             onClick={handleLogin}
             disabled={loading}
             className="w-full py-6 bg-accent hover:bg-accent-hover text-white rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] shadow-btn active:scale-95 transition-all text-xs flex items-center justify-center gap-4 group"
           >
              {loading ? (
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                 <>
                   {/* Inline Google SVG */}
                   <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                     <path
                       fill="currentColor"
                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                     />
                     <path
                       fill="currentColor"
                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                     />
                     <path
                       fill="currentColor"
                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                     />
                     <path
                       fill="currentColor"
                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                     />
                   </svg>
                   SIGN IN WITH GOOGLE
                   <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                 </>
              )}
           </button>
           
           <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest mt-12 italic">Your data is synced securely using Google Auth Protocol v4-Elite.</p>
        </div>
      </div>
    </main>
  );
}
