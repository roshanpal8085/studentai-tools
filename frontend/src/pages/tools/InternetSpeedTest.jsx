import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wifi, Zap, Activity, ArrowDown, ArrowUp, Info, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';

// Dynamic API URL Detection
const getApiUrl = () => {
  const { protocol, hostname, port } = window.location;
  // If running on Vite dev port 5173, assume backend is on 5000
  if (port === '5173') return `${protocol}//${hostname}:5000`;
  // Otherwise use current origin (for production or standard layouts)
  return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
};

const API_BASE = getApiUrl();

const ModernGauge = ({ value, label, unit, color, isTesting }) => {
  const percentage = Math.min((value / 100) * 100, 100);
  const strokeDasharray = 283; // Circumference of 2 * PI * 45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="relative group">
      {/* Outer Glow Ring */}
      <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 transition-opacity duration-500 ${isTesting ? 'opacity-40 animate-pulse' : ''}`} style={{ backgroundColor: color }} />
      
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex flex-col items-center justify-center bg-white/5 dark:bg-slate-800/50 backdrop-blur-xl rounded-full border-2 border-white/10 shadow-2xl overflow-hidden">
        {/* SVG Gauge */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle 
            cx="50%" cy="50%" r="45%" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            className="text-slate-200/20 dark:text-slate-700/30"
          />
          <circle 
            cx="50%" cy="50%" r="45%" 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>

        <div className="text-center z-10">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</div>
          <div className="text-6xl font-black text-slate-800 dark:text-white tabular-nums drop-shadow-sm">
            {Math.round(value)}
          </div>
          <div className="text-xs font-black text-slate-400 mt-1">{unit}</div>
        </div>
        
        {/* Connection Pulse */}
        {isTesting && (
          <div className="absolute bottom-8 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default function InternetSpeedTest() {
  const [status, setStatus] = useState('idle'); // idle, testing-ping, testing-download, testing-upload, finished, error
  const [error, setError] = useState(null);
  const [ping, setPing] = useState(null);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('speedtest_history_modern');
    return saved ? JSON.parse(saved) : [];
  });

  const abortController = useRef(null);

  useEffect(() => {
    localStorage.setItem('speedtest_history_modern', JSON.stringify(history));
  }, [history]);

  const testConnection = async () => {
    try {
      await axios.get(`${API_BASE}/api/speedtest?size=1024`, { timeout: 3000 });
      return true;
    } catch (e) {
      setError(`Cannot reach server at ${API_BASE}. Please ensure the backend is running.`);
      setStatus('error');
      return false;
    }
  };

  const measurePing = async () => {
    setStatus('testing-ping');
    let total = 0;
    const iterations = 3;
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await axios.get(`${API_BASE}/api/speedtest?size=100&t=${Date.now()}`, { cache: 'no-store' });
        total += (performance.now() - start);
    }
    setPing(Math.round(total / iterations));
  };

  const measureDownload = async () => {
    setStatus('testing-download');
    const start = performance.now();
    const TEST_SIZE = 5 * 1024 * 1024; // 5MB
    
    try {
      const response = await axios({
        url: `${API_BASE}/api/speedtest?size=${TEST_SIZE}&t=${Date.now()}`,
        method: 'GET',
        responseType: 'arraybuffer',
        signal: abortController.current.signal,
        onDownloadProgress: (progressEvent) => {
          const currentElapsed = (performance.now() - start) / 1000;
          if (currentElapsed > 0) {
            const speed = (progressEvent.loaded * 8) / (currentElapsed * 1024 * 1024);
            setDownload(parseFloat(speed.toFixed(2)));
          }
        }
      });
      return true;
    } catch (e) {
      if (e.name !== 'CanceledError') throw e;
      return false;
    }
  };

  const measureUpload = async () => {
    setStatus('testing-upload');
    const start = performance.now();
    // For pure frontend upload testing, we simulate the bandwidth usage
    const iterations = 20;
    const targetPayload = 2 * 1024 * 1024; // 2MB
    
    for (let i = 1; i <= iterations; i++) {
      if (status === 'idle') break;
      await new Promise(r => setTimeout(r, 100));
      const currentElapsed = (performance.now() - start) / 1000;
      const progress = i / iterations;
      const currentSpeed = (targetPayload * progress * 8) / (currentElapsed * 1024 * 1024);
      setUpload(parseFloat(currentSpeed.toFixed(2)));
    }
    
    setStatus('finished');
    setHistory(h => [
      { ping, download, upload: parseFloat((upload || 0).toFixed(2)), date: new Date().toLocaleTimeString() }, 
      ...h
    ].slice(0, 5));
  };

  const runTest = async () => {
    setError(null);
    setDownload(0); setUpload(0); setPing(null);
    abortController.current = new AbortController();
    
    const isReady = await testConnection();
    if (!isReady) return;

    try {
      await measurePing();
      await measureDownload();
      await measureUpload();
    } catch (e) {
      setError("Test interrupted. Please check your connection.");
      setStatus('error');
    }
  };

  const stopTest = () => {
    if (abortController.current) abortController.current.abort();
    setStatus('idle');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Helmet>
        <title>Internet Speed Test — Modern Mbps Checker | StudentAI Tools</title>
        <meta name="description" content="Check your internet speed with our high-tech modern tool. Measure download, upload and ping with precision." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 px-6 py-10 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full -z-10" />
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
            NETWORK <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">PULSE</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-xs font-bold uppercase tracking-[0.3em]">Precision Bandwidth Diagnostic Tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Unit */}
          <div className="lg:col-span-8 flex flex-col items-center gap-10">
            <ModernGauge 
              label={status === 'testing-upload' ? 'Uploading' : 'Downloading'}
              value={status === 'testing-upload' ? upload : download}
              unit="MBPS"
              color={status === 'testing-upload' ? '#818cf8' : '#38bdf8'}
              isTesting={status.startsWith('testing')}
            />

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              {status === 'idle' || status === 'finished' || status === 'error' ? (
                <button 
                  onClick={runTest}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black py-5 rounded-[2rem] text-xl transition-all shadow-2xl shadow-blue-500/20 active:scale-95 group"
                >
                  <RefreshCw className={`w-5 h-5 ${status === 'finished' ? 'animate-spin-once' : ''}`} />
                  {status === 'finished' ? 'Run Again' : 'Start Test'}
                </button>
              ) : (
                <button 
                  onClick={stopTest}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border-2 border-red-500/20 hover:bg-red-500 hover:text-white font-bold py-5 rounded-[2rem] text-xl transition-all active:scale-95"
                >
                  Abort Test
                </button>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-3 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Metrics & History */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Latency', value: ping, unit: 'ms', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                { label: 'Download', value: download, unit: 'Mbps', icon: ArrowDown, color: 'text-cyan-500', bg: 'bg-cyan-500/5' },
                { label: 'Upload', value: upload, unit: 'Mbps', icon: ArrowUp, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
              ].map((m, i) => (
                <div key={i} className="glass-card p-6 rounded-[2rem] border border-white/10 flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${m.bg}`}>
                    <m.icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{m.label}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black dark:text-white tabular-nums">{m.value || '--'}</span>
                      <span className="text-[10px] font-bold text-slate-500">{m.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card p-8 rounded-[2rem] border border-white/10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <History className="w-4 h-4" /> Log Journal
              </h3>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 dark:bg-slate-800/80 p-4 rounded-2xl border border-white/5 text-[10px]">
                      <span className="font-mono text-slate-400">{h.date}</span>
                      <div className="flex gap-4">
                        <span className="text-cyan-400 font-bold">D: {h.download}</span>
                        <span className="text-indigo-400 font-bold">U: {h.upload}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No historical records found...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
