'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Link as LinkIcon } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#080514] text-white">
      {/* Illustration Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#18113B] via-[#080514] to-[#080514]"></div>
        
        {/* Abstract glowing shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(147,51,234,0.3)] rotate-12">
            <LinkIcon size={48} className="text-white -rotate-12" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white/90">Linkify your world.</h2>
          <p className="text-slate-400 mt-2">Manage all your links in one place.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center">
              <LinkIcon size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">Linkify</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create Account ✨</h1>
          <p className="text-slate-400 mb-8 text-sm">Join and start shortening URLs</p>

          <div className="flex p-1 bg-[#120C29] border border-white/5 rounded-xl mb-8">
            <Link href="/login" className="flex-1 text-center py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
              Login
            </Link>
            <Link href="/register" className="flex-1 text-center py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-semibold shadow-lg shadow-purple-500/20">
              Register
            </Link>
          </div>
          
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400 ml-1">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#120C29] border border-white/5 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-sm text-white placeholder-slate-600 transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#120C29] border border-white/5 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-sm text-white placeholder-slate-600 transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#120C29] border border-white/5 rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-sm text-white placeholder-slate-600 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <span className="ml-1">→</span>}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
