'use client';

import { useState, useEffect } from 'react';
import {
  Link as LinkIcon,
  TrendingUp,
  MousePointerClick,
  Zap,
  Send,
  Copy,
  Check,
  BarChart2,
  Trash2,
  ChevronDown,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linksLoading, setLinksLoading] = useState(true);
  const [host, setHost] = useState('localhost:3000');
  const [userName, setUserName] = useState('User');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLinks = async () => {
    setLinksLoading(true);
    try {
      const res = await fetch('/api/urls');
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLinksLoading(false);
    }
  };

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

  useEffect(() => {
    fetchLinks();
    fetchUser();
    if (typeof window !== 'undefined') {
      setHost(window.location.host);
    }
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setUrl('');
        fetchLinks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res = await fetch('/api/urls', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchLinks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, curr) => acc + (curr.visitHistory?.length || 0), 0);
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const todayClicks = links.reduce((acc, curr) => acc + (curr.visitHistory?.filter(v => v.timestamp > oneDayAgo).length || 0), 0);
  const activeLinks = links.filter(l => (l.visitHistory?.length || 0) > 0).length;

  return (
    <div className="space-y-8">
      {/* Delete Confirm Popover Backdrop */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
          onClick={() => !deleting && setDeleteConfirmId(null)}
        >
          <div
            className="bg-[#18113B] border border-red-500/20 rounded-2xl p-6 w-[340px] shadow-2xl z-50 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Delete Short URL?</h3>
                <p className="text-slate-400 text-xs mt-0.5">This action cannot be undone.</p>
              </div>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="ml-auto text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold mb-1">Hello, {userName}! 👋</h1>
        <p className="text-slate-400 text-sm">Here's what's happening with your links today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Links" value={totalLinks.toString()} subtitle="All-time links" icon={<LinkIcon size={18} className="text-purple-400" />} />
        <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} subtitle="All-time clicks" icon={<TrendingUp size={18} className="text-emerald-400" />} />
        <StatCard title="Today Clicks" value={todayClicks.toString()} subtitle="Past 24 hours" icon={<MousePointerClick size={18} className="text-orange-400" />} />
        <StatCard title="Active Links" value={activeLinks.toString()} subtitle="Links with clicks" icon={<Zap size={18} className="text-blue-400" />} />
      </div>

      {/* Shorten Box */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1E114D] to-[#120C29] p-8 rounded-2xl border border-purple-500/20 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/30 blur-[80px] rounded-full"></div>
        <div className="relative z-10">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
            <LinkIcon className="text-purple-400" /> Shorten a long URL
          </h2>
          <form onSubmit={handleShorten} className="flex gap-2 p-1.5 bg-[#080514]/50 border border-white/10 rounded-xl backdrop-blur-md">
            <div className="flex items-center pl-4 pr-2 text-slate-500">
              <LinkIcon size={18} />
            </div>
            <input
              type="url"
              required
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-slate-500 text-sm"
            />
            <button
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all disabled:opacity-70 min-w-[110px] justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Shortening...
                </>
              ) : (
                <>
                  <Send size={16} /> Shorten
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-[#120C29] rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-white/5">
          <h3 className="text-lg font-bold">Your Links</h3>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <input type="text" placeholder="Search links..." className="pl-9 pr-4 py-2 bg-[#080514] border border-white/5 rounded-lg text-xs focus:outline-none focus:border-purple-500/50" />
              <div className="absolute left-3 top-2.5 text-slate-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#080514] border border-white/5 rounded-lg text-xs font-medium">
              All <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
            <thead className="bg-[#080514]/50 border-b border-white/5 text-xs text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4 font-medium">Original URL</th>
                <th className="px-6 py-4 font-medium">Short URL</th>
                <th className="px-6 py-4 font-medium text-center">Clicks</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {linksLoading ? (
                // Skeleton Loader Rows
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 shrink-0"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-3 bg-white/10 rounded w-3/4"></div>
                          <div className="h-2 bg-white/5 rounded w-1/2"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-purple-500/10 rounded-lg w-36"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-3 bg-white/10 rounded w-8 mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 bg-white/10 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <div className="w-7 h-7 rounded bg-white/5"></div>
                        <div className="w-7 h-7 rounded bg-red-500/10"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <LinkIcon size={22} className="text-purple-400" />
                      </div>
                      <p className="text-slate-400 text-sm">No links yet. Shorten your first URL above!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                links.map((link, index) => {
                  const domain = link.redirectURL.replace('https://', '').replace('http://', '').split('/')[0];
                  const cleanCreated = new Date(link.createdAt).toLocaleString();
                  const shortUrl = `${host}/${link.shortId}`;
                  const shortUrlWithProtocol = `${typeof window !== 'undefined' ? window.location.protocol : 'http:'}//${shortUrl}`;
                  return (
                    <tr key={link._id || index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                            {domain.charAt(0).toUpperCase()}
                          </div>
                          <div className="truncate max-w-[200px]">
                            <p className="font-medium text-white truncate">{link.redirectURL}</p>
                            <p className="text-xs text-slate-500 truncate">{domain}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-lg w-max border border-purple-500/20 text-xs">
                          <a
                            href={shortUrlWithProtocol}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline cursor-pointer font-medium"
                          >
                            {shortUrl}
                          </a>
                          <div className="relative flex items-center">
                            {copiedId === link._id ? (
                              <Check size={12} className="text-emerald-400" />
                            ) : (
                              <Copy
                                size={12}
                                className="cursor-pointer hover:text-white transition-colors"
                                onClick={() => {
                                  navigator.clipboard.writeText(shortUrlWithProtocol);
                                  setCopiedId(link._id);
                                  setTimeout(() => setCopiedId(null), 2000);
                                }}
                              />
                            )}
                            {copiedId === link._id && (
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                Copied!
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-emerald-600"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white">
                          {link.visitHistory?.length || 0}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {cleanCreated.split(',')[0]}<br />
                        <span className="text-slate-500">{cleanCreated.split(',')[1] || ''}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-slate-400 hover:text-white transition-colors">
                            <BarChart2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(link._id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!linksLoading && links.length > 0 && (
          <div className="p-4 border-t border-white/5 flex justify-center gap-1">
            <button className="px-3 py-1 text-xs text-slate-500">&lt; Prev</button>
            <button className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">1</button>
            <button className="w-6 h-6 rounded-full text-slate-400 hover:bg-white/10 text-xs flex items-center justify-center">2</button>
            <button className="w-6 h-6 rounded-full text-slate-400 hover:bg-white/10 text-xs flex items-center justify-center">3</button>
            <button className="px-3 py-1 text-xs text-white">Next &gt;</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  const isPositive = subtitle.includes('↑');
  return (
    <div className="bg-[#120C29] p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5 group-hover:bg-purple-500/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-slate-400 text-xs font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <p className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-slate-500'} font-medium`}>
        {subtitle}
      </p>
    </div>
  );
}
