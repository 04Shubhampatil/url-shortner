'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Link as LinkIcon,
  LogOut
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [userName, setUserName] = useState('User');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUserName(data.name);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-[#080514] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col justify-between hidden md:flex animate-in">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
              <LinkIcon size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">Linkify</span>
          </div>

          <nav className="px-4 space-y-2 mt-4">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 py-4 border-b border-white/5 shrink-0">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
              <LinkIcon size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">Linkify</span>
          </div>
          <div className="hidden md:block"></div>

          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5">
              <span className="sr-only">Toggle theme</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            </button>
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 border-2 border-[#080514]"></div>
                <span className="text-sm font-medium hidden sm:block">{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg text-xs font-semibold border border-red-500/20 transition-all"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <Link
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
          ? 'bg-[#18113B] text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(107,33,168,0.2)]'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
