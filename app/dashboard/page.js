'use client';

import { useState, useEffect } from 'react';
import {
  Link as LinkIcon,
  TrendingUp,
  MousePointerClick,
  Zap,
  Send,
  Copy,
  BarChart2,
  Trash2,
  ChevronDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockData = [
  { name: 'Mon', clicks: 40 },
  { name: 'Tue', clicks: 30 },
  { name: 'Wed', clicks: 55 },
  { name: 'Thu', clicks: 45 },
  { name: 'Fri', clicks: 70 },
  { name: 'Sat', clicks: 65 },
  { name: 'Sun', clicks: 85 },
];

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [host, setHost] = useState('localhost:3000');
  const [userName, setUserName] = useState('User');

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/urls');
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error(err);
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
    if (!confirm('Are you sure you want to delete this URL?')) return;
    try {
      const res = await fetch('/api/urls', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchLinks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic stats calculation
  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, curr) => acc + (curr.visitHistory?.length || 0), 0);
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const todayClicks = links.reduce((acc, curr) => acc + (curr.visitHistory?.filter(v => v.timestamp > oneDayAgo).length || 0), 0);
  const activeLinks = links.filter(l => (l.visitHistory?.length || 0) > 0).length;

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Left Column (Main Dashboard) */}
      <div className="flex-1 space-y-8">
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
                placeholder="Enter a long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-slate-500 text-sm"
              />
              <button
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all disabled:opacity-50"
              >
                <Send size={16} /> Shorten
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-3 ml-2 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center text-[8px]">i</span>
              Example: https://vercel.com
            </p>
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-[#120C29] rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h3 className="text-lg font-bold">Your Links</h3>
            <div className="flex gap-4">
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

          <table className="w-full text-left text-sm text-slate-300">
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
              {links.map((link, index) => {
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
                        <Copy
                          size={12}
                          className="cursor-pointer hover:text-white"
                          onClick={() => {
                            navigator.clipboard.writeText(shortUrlWithProtocol);
                            alert('Copied short URL to clipboard!');
                          }}
                        />
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
                          onClick={() => handleDelete(link._id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-4 border-t border-white/5 flex justify-center gap-1">
            <button className="px-3 py-1 text-xs text-slate-500">&lt; Prev</button>
            <button className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">1</button>
            <button className="w-6 h-6 rounded-full text-slate-400 hover:bg-white/10 text-xs flex items-center justify-center">2</button>
            <button className="w-6 h-6 rounded-full text-slate-400 hover:bg-white/10 text-xs flex items-center justify-center">3</button>
            <button className="px-3 py-1 text-xs text-white">Next &gt;</button>
          </div>
        </div>
      </div>

      {/* Right Column (Sidebar Stats) */}
      <div className="w-full xl:w-[320px] shrink-0 space-y-6">
        {/* Clicks Overview */}
        <div className="bg-[#120C29] p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm">Clicks Overview</h3>
            <button className="text-xs bg-[#080514] px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1">
              This Week <ChevronDown size={12} />
            </button>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18113B', border: '1px solid #ffffff10', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#a855f7' }}
                />
                <Line type="monotone" dataKey="clicks" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#18113B', stroke: '#a855f7', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Links */}
        <div className="bg-[#120C29] p-6 rounded-2xl border border-white/5">
          <h3 className="font-bold text-sm mb-4">Top Links</h3>
          <div className="space-y-4">
            <TopLinkItem icon="G" color="bg-red-500" path="linkify.app/abc123" clicks="342" />
            <TopLinkItem icon="Git" color="bg-slate-700" path="linkify.app/xyz789" clicks="287" />
            <TopLinkItem icon="YT" color="bg-red-600" path="linkify.app/youtube" clicks="156" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#120C29] p-6 rounded-2xl border border-white/5">
          <h3 className="font-bold text-sm mb-4">Recent Activity</h3>
          <div className="space-y-5">
            <ActivityItem icon={<MousePointerClick size={12} />} color="bg-blue-500" text="Someone visited" link="linkify.app/abc123" time="2 min ago" />
            <ActivityItem icon={<LinkIcon size={12} />} color="bg-purple-500" text="New link created" link="linkify.app/twitter" time="15 min ago" />
            <ActivityItem icon={<MousePointerClick size={12} />} color="bg-orange-500" text="Someone visited" link="linkify.app/vercel" time="25 min ago" />
          </div>
        </div>
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
      <p className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'} font-medium flex items-center gap-1`}>
        {subtitle.split(' ')[0]} <span className="text-slate-500 font-normal">{subtitle.split(' ').slice(1).join(' ')}</span>
      </p>
    </div>
  );
}

function TopLinkItem({ icon, color, path, clicks }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>
          {icon}
        </div>
        <p className="text-xs font-medium text-slate-300 group-hover:text-purple-400 transition-colors">{path}</p>
      </div>
      <div className="text-xs font-bold">{clicks} <span className="text-slate-500 font-normal ml-0.5">clicks</span></div>
    </div>
  );
}

function ActivityItem({ icon, color, text, link, time }) {
  return (
    <div className="flex gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color} bg-opacity-20 text-${color.split('-')[1]}-400`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-300">{text} <br /> <span className="text-purple-400">{link}</span></p>
      </div>
      <div className="text-[10px] text-slate-500 shrink-0">{time}</div>
    </div>
  );
}
