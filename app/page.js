import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center animate-in">
      <div className="max-w-3xl space-y-8 glass-card p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-accent opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-primary opacity-20 blur-3xl"></div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
          Just URL Shortener
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 relative z-10 max-w-xl mx-auto">
          A premium, lightning-fast link management platform. Create short links, track visits, and organize your digital presence with aesthetic precision.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10 pt-4">
          <Link
            href="/login"
            className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-full font-semibold text-slate-200 glass hover:bg-white/10 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
