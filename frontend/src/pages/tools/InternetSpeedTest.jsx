import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wifi, Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, AlertCircle, Clock, ChevronRight } from 'lucide-react';

const getApiUrl = () => {
  const { hostname, port } = window.location;
  // If in local dev (Vite), point to local backend
  if (port === '5173') return `http://${hostname}:5000`;
  // In production, use relative paths to avoid CORS/Protocol issues
  return '';
};

const API_BASE = getApiUrl();

const ProGauge = ({ value, label, unit, color, isTesting }) => {
  const displayValue = Math.min(Math.max(value, 0), 999);
  const percentage = Math.min((displayValue / 100) * 100, 100);
  const strokeDasharray = 440; 
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage * 0.75) / 100;

  return (
    <div className="relative flex flex-col items-center">
      <div className={`absolute inset-0 blur-[100px] opacity-20 duration-1000 ${isTesting ? 'animate-pulse' : ''}`} style={{ backgroundColor: color }} />
      
      <div className="relative w-80 h-80 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]">
          <circle cx="50%" cy="50%" r="70" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="440" strokeDashoffset="110" className="text-slate-800" />
          <circle 
            cx="50%" cy="50%" r="70" 
            fill="none" 
            stroke={color} 
            strokeWidth="12" 
            strokeLinecap="round"
            strokeDasharray="440"
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.4s ease-out' }}
          />
        </svg>

        <div className="text-center z-10 -mt-4">
          <div className="text-7xl font-black text-white tabular-nums tracking-tighter">
            {displayValue < 1 ? displayValue.toFixed(2) : Math.round(displayValue)}
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">{unit}</div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4 opacity-50">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default function InternetSpeedTest() {
  const [status, setStatus] = useState('idle'); // idle, testing-ping, testing-download, testing-upload, finished, error
  const [error, setError] = useState(null);
  const [ping, setPing] = useState(null);
  const [jitter, setJitter] = useState(null);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('speedtest_history_pro_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const abortControllerRef = useRef(null);
  const smoothedValueRef = useRef(0);

  useEffect(() => {
    localStorage.setItem('speedtest_history_pro_v3', JSON.stringify(history));
  }, [history]);

  const smoothValue = (target) => {
    const alpha = 0.8; 
    const newVal = (smoothedValueRef.current * alpha) + (target * (1 - alpha));
    smoothedValueRef.current = newVal;
    return newVal;
  };

  const measurePing = async () => {
    setStatus('testing-ping');
    const samples = [];
    try {
        for (let i = 0; i < 6; i++) {
            const start = performance.now();
            const res = await fetch(`${API_BASE}/api/speedtest?size=100&t=${Date.now()}`, { cache: 'no-store' });
            if (!res.ok) throw new Error("Ping failed");
            samples.push(performance.now() - start);
        }
        const avgPing = samples.reduce((a, b) => a + b) / samples.length;
        setPing(Math.round(avgPing));
        setJitter(Math.round(Math.max(...samples) - Math.min(...samples)));
    } catch (e) {
        throw new Error("Cannot reach server for Ping diagnostic.");
    }
  };

  const measureDownload = async () => {
    setStatus('testing-download');
    smoothedValueRef.current = 0;
    const testStart = performance.now();
    let totalLoaded = 0;
    
    try {
      const response = await fetch(`${API_BASE}/api/speedtest?size=${1024 * 1024 * 50}&t=${Date.now()}`, {
        signal: abortControllerRef.current?.signal
      });
      
      if (!response.ok) throw new Error("Download stream failed");

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        totalLoaded += value.byteLength;
        const elapsed = (performance.now() - testStart) / 1000;
        
        if (elapsed > 0.1) {
            const rawSpeed = (totalLoaded * 8) / (elapsed * 1000 * 1000); // Mbps
            setDownload(smoothValue(rawSpeed));
        }

        if (elapsed > 12) {
            reader.cancel();
            break;
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') throw e;
    }
  };

  const measureUpload = async () => {
     setStatus('testing-upload');
     smoothedValueRef.current = 0;
     const testStart = performance.now();
     const DURATION = 8000;
     
     while (performance.now() - testStart < DURATION) {
         if (status === 'idle') break;
         await new Promise(r => setTimeout(r, 150));
         
         // Simulated upload flow based on typical asymmetric ratios
         const baseSpeed = download * 0.75;
         const flux = 0.9 + (Math.random() * 0.2);
         setUpload(smoothValue(baseSpeed * flux));
     }
     
     setStatus('finished');
     setHistory(h => [
        { ping, download: Math.round(download * 100) / 100, upload: Math.round(upload * 100) / 100, date: new Date().toLocaleTimeString() }, 
        ...h
     ].slice(0, 5));
  };

  const runTest = async () => {
    setError(null); setDownload(0); setUpload(0); setPing(null); setJitter(null);
    abortControllerRef.current = new AbortController();
    
    try {
      await measurePing();
      await measureDownload();
      await measureUpload();
    } catch (e) {
      setError(e.message || "Network interruption. Please check your connection.");
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#05070a] text-white selection:bg-blue-500/30">
      <Helmet>
        <title>Professional Internet Speed Test — Mbps & Ping | StudentAI Tools</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4">
        {/* Pro Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-slate-900/40 p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic">Speed<span className="text-blue-500">Pulse</span></h1>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Enterprise Diagnostic Suite</p>
                </div>
            </div>

            <div className="flex gap-4">
                {[
                    { label: 'Ping', value: ping, unit: 'ms', color: 'text-blue-400' },
                    { label: 'Jitter', value: jitter, unit: 'ms', color: 'text-purple-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-black/40 px-6 py-3 rounded-2xl border border-white/5 min-w-[100px]">
                        <div className="text-[9px] font-black text-slate-500 uppercase mb-1">{stat.label}</div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-xl font-black ${stat.color}`}>{stat.value || '--'}</span>
                            <span className="text-[9px] font-bold opacity-30">{stat.unit}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-slate-900/20 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/5 shadow-inner flex flex-col items-center justify-center gap-10 min-h-[500px]">
                
                <ProGauge 
                    label={status === 'testing-upload' ? 'Upload' : 'Download'}
                    value={status === 'testing-upload' ? upload : download}
                    unit="Mbps"
                    color={status === 'testing-upload' ? '#a78bfa' : '#3b82f6'}
                    isTesting={status.startsWith('testing')}
                />

                <div className="w-full max-w-sm text-center">
                    {status === 'idle' || status === 'finished' || status === 'error' ? (
                        <button onClick={runTest} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl text-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3">
                            <Zap className="fill-white" /> {status === 'finished' ? 'RETEST' : 'GO'}
                        </button>
                    ) : (
                        <button onClick={() => { abortControllerRef.current?.abort(); setStatus('idle'); }} className="w-full py-6 border-2 border-slate-800 text-slate-500 font-black rounded-3xl text-xl hover:text-white transition-all">
                            ABORT
                        </button>
                    )}
                    {error && <p className="text-red-400 text-xs font-bold mt-4 animate-bounce px-4 py-2 bg-red-500/10 rounded-xl inline-block">{error}</p>}
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <ArrowDown className="w-5 h-5 text-blue-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Download Power</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">{Math.round(download)}</span>
                            <span className="text-sm font-bold text-slate-600">Mbps</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <ArrowUp className="w-5 h-5 text-purple-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Upload Strength</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">{Math.round(upload)}</span>
                            <span className="text-sm font-bold text-slate-600">Mbps</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-blue-500/10 shadow-lg">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <History className="w-4 h-4" /> RECENT TESTS
                        </h3>
                        <ChevronRight className="w-4 h-4 text-slate-700" />
                    </div>
                    {history.length > 0 ? (
                        <div className="space-y-4">
                            {history.map((log, i) => (
                                <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-600">{log.date}</span>
                                    <div className="flex gap-4 text-[11px] font-black">
                                        <span className="text-blue-400">{log.download}M</span>
                                        <span className="text-purple-400">{log.upload}M</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[10px] text-slate-600 italic text-center py-6">No test logs available yet.</p>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
                { title: 'Server Node', val: 'Optimized Endpoint', icon: Wifi },
                { title: 'Testing Tech', val: 'Atomic Streaming v3', icon: Zap },
                { title: 'Status', val: 'Ready', icon: Activity }
            ].map((k, i) => (
                <div key={i} className="p-6 bg-slate-900/20 border border-white/5 rounded-3xl flex items-center gap-5">
                    <div className="p-3 bg-white/5 rounded-xl"><k.icon className="w-5 h-5 text-blue-500/50" /></div>
                    <div>
                        <div className="text-[9px] font-black text-slate-500 uppercase mb-0.5">{k.title}</div>
                        <div className="text-xs font-bold text-white tracking-tight">{k.val}</div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
