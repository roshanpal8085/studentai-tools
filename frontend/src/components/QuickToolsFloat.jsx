import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, X, FilePlus, FileText, Wifi, ShieldCheck, Gamepad2 } from 'lucide-react';

const QUICK_TOOLS = [
  { label: 'PDF Merge', path: '/free-pdf-tools', icon: FilePlus, color: 'bg-rose-500' },
  { label: 'Resume AI', path: '/ai-resume-generator', icon: FileText, color: 'bg-indigo-500' },
  { label: 'Speed Test', path: '/tools/internet-speed-test', icon: Wifi, color: 'bg-sky-500' },
  { label: 'Grammar', path: '/tools/grammar-checker', icon: ShieldCheck, color: 'bg-emerald-500' },
  { label: 'Games', path: '/free-games', icon: Gamepad2, color: 'bg-purple-500' },
];

export default function QuickToolsFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Menu */}
      <div className={`flex flex-col gap-2 transition-all duration-300 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {QUICK_TOOLS.map((tool, i) => (
          <Link
            key={tool.path}
            to={tool.path}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-105 transition-all group"
            style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
          >
            <div className={`w-7 h-7 rounded-lg ${tool.color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
              <tool.icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{tool.label}</span>
          </Link>
        ))}
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/50 active:scale-95
          ${open
            ? 'bg-slate-700 dark:bg-slate-600 shadow-slate-500/30'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/40'
          }`}
      >
        {open ? (
          <><X className="w-4 h-4" /> Close</>
        ) : (
          <><Zap className="w-4 h-4 animate-pulse" /> Quick Tools</>
        )}
      </button>
    </div>
  );
}
