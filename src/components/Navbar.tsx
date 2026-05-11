"use client";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black italic tracking-tighter uppercase">
          Gym <span className="text-accent">Logger</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/movements" className="text-xs font-black uppercase tracking-widest hover:text-accent transition-colors">Movements</Link>
          <Link href="/history" className="text-xs font-black uppercase tracking-widest hover:text-accent transition-colors">History</Link>
          <Link href="/settings" className="text-xs font-black uppercase tracking-widest hover:text-accent transition-colors">Settings</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="bg-accent text-white px-6 py-2.5 rounded-full font-black uppercase italic text-xs hover:bg-accent-hover transition shadow-btn">
            Login
          </Link>

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
