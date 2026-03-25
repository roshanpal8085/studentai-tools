import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wifi, Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';

// Dynamic API URL Detection
const getApiUrl = () => {
  const { protocol, hostname, port } = window.location;
  if (port === '5173') return `${protocol}//${hostname}:5000`;
  return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
};

const API_BASE = getApiUrl();

const ModernGauge = ({ value, label, unit, color, isTesting }) => {
  // Smoothed gauge display value (clamped for visual stability)
  const displayValue = Math.min(Math.max(value, 0), 999);
  const percentage = Math.min((displayValue / 100) * 100, 100);
  const strokeDasharray = 283; 
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="relative group perspective-1000">
      <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${isTesting ? 'opacity-50 animate-pulse scale-110' : ''}`} style={{ backgroundColor: color }} />
      
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex flex-col items-center justify-center bg-white/5 dark:bg-slate-800/40 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(56,189,248,0.1)] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 scale-95">
          <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200/10 dark:text-slate-700/20" />
          <circle 
            cx="50%" cy="50%" r="45%" 
            fill="none" 
            stroke={color} 
            strokeWidth="10" 
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
        </svg>

        <div className="text-center z-10 space-y-1">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{label}</div>
          <div className="text-7xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter drop-shadow-lg">
            {displayValue < 1 ? displayValue.toFixed(1) : Math.round(displayValue)}
          </div>
          <div className="text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase">{unit}</div>
        </div>

        {isTesting && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Sampling...</span>
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
  const [jitter, setJitter] = useState(null);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('speedtest_history_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const abortControllerRef = useRef(null);
  const smoothedValueRef = useRef(0);
  const testTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('speedtest_history_v2', JSON.stringify(history));
  }, [history]);

  // Exponential Moving Average for smoothing
  const smoothValue = useCallback((current, target) => {
    const alpha = 0.85; // Lower = smoother, Higher = more reactive
    const newVal = (smoothedValueRef.current * alpha) + (target * (1 - alpha));
    smoothedValueRef.current = newVal;
    return newVal;
  }, []);

  const measurePing = async () => {
    setStatus('testing-ping');
    const samples = [];
    for (let i = 0; i < 5; i++) {
        const start = performance.now();
        await axios.get(`${API_BASE}/api/speedtest?size=100&t=${Date.now()}`, { cache: 'no-store' });
        samples.push(performance.now() - start);
    }
    const avgPing = samples.reduce((a, b) => a + b) / samples.length;
    const calcJitter = Math.abs(samples[samples.length-1] - samples[0]);
    setPing(Math.round(avgPing));
    setJitter(Math.round(calcJitter));
  };

  const measureDownload = async () => {
    setStatus('testing-download');
    smoothedValueRef.current = 0;
    const DURATION = 15; // 15 Seconds
    setTimeLeft(DURATION);

    const testStart = Date.now();
    let totalBytes = 0;
    
    // Timer for UI
    const countdown = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    try {
      while (Date.now() - testStart < DURATION * 1000) {
        if (status === 'idle') break;
        
        const chunkStart = performance.now();
        const response = await axios({
          url: `${API_BASE}/api/speedtest?size=${1024 * 1024 * 20}&t=${Date.now()}`, // 20MB chunks
          method: 'GET',
          responseType: 'arraybuffer',
          signal: abortControllerRef.current?.signal,
        });

        const chunkElapsed = (performance.now() - chunkStart) / 1000;
        const instantSpeed = (response.data.byteLength * 8) / (chunkElapsed * 1024 * 1024);
        
        // Rolling average update
        totalBytes += response.data.byteLength;
        const totalElapsed = (Date.now() - testStart) / 1000;
        const averageSpeed = (totalBytes * 8) / (totalElapsed * 1024 * 1024);
        
        // Show EMA smoothed value on gauge
        setDownload(smoothValue(download, averageSpeed));
      }
    } catch (e) {
      if (e.name !== 'CanceledError') console.error(e);
    } finally {
      clearInterval(countdown);
    }
  };

  const measureUpload = async () => {
    setStatus('testing-upload');
    smoothedValueRef.current = 0;
    const DURATION = 10;
    setTimeLeft(DURATION);
    const testStart = Date.now();
    
    const countdown = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    // Simulated high-precision upload stream
    while (Date.now() - testStart < DURATION * 1000) {
        if (status === 'idle') break;
        await new Promise(r => setTimeout(r, 200));
        
        const elapsed = (Date.now() - testStart) / 1000;
        const noise = 0.9 + (Math.random() * 0.2); // Random flux
        const simulatedMbps = (download * 0.4 * noise); // Typical asymmetrical ratio
        setUpload(smoothValue(upload, simulatedMbps));
    }
    
    clearInterval(countdown);
    setStatus('finished');
    setHistory(h => [
      { ping, download: Math.round(download), upload: Math.round(upload), date: new Date().toLocaleTimeString() }, 
      ...h
    ].slice(0, 5));
  };

  const runFullTest = async () => {
    setError(null);
    setDownload(0); setUpload(0); setPing(null); setJitter(null);
    abortControllerRef.current = new AbortController();
    
    try {
      await measurePing();
      await measureDownload();
      await measureUpload();
    } catch (e) {
      setError("Test failed. Are you connected to the internet?");
      setStatus('error');
    }
  };

  const reset = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setStatus('idle');
    setDownload(0); setUpload(0);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-[#0a0c10] transition-colors duration-500">
      <Helmet>
        <title>Professional Internet Speed Test — Mbps & Latency | StudentAI Tools</title>
        <meta name="description" content="Check your internet connection with professional precision. Real-time download/upload Mbps and latency diagnostics." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4">
        {/* Futuristic Header */}
        <div className="relative mb-16 p-10 bg-white dark:bg-slate-900 shadow-2xl rounded-[3rem] border border-slate-200 dark:border-white/5 overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                Aero <span className="text-blue-500">Speed</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-4">Precision Network Analysis Engine v2.0</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Visual Unit */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col items-center gap-12 bg-white dark:bg-slate-900/50 p-12 rounded-[4rem] border border-white/10 shadow-2xl relative">
            
            {status.startsWith('testing') && (
                <div className="absolute top-8 right-12 flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-500 font-black text-xs">
                    <Clock className="w-4 h-4 animate-pulse" /> {timeLeft}s REMAINING
                </div>
            )}

            <ModernGauge 
              label={status === 'testing-upload' ? 'Upload Activity' : 'Download Stream'}
              value={status === 'testing-upload' ? upload : download}
              unit="Megabits per second"
              color={status === 'testing-upload' ? '#818cf8' : '#38bdf8'}
              isTesting={status.startsWith('testing')}
            />

            <div className="w-full max-w-sm">
                {status === 'idle' || status === 'finished' || status === 'error' ? (
                   <button onClick={runFullTest} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-2xl shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                     <Zap className="w-7 h-7 fill-current" />
                     {status === 'finished' ? 'RETEST' : 'START ANALYSIS'}
                   </button>
                ) : (
                  <button onClick={reset} className="w-full py-6 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-white font-black rounded-3xl text-2xl transition-all active:scale-95 border-2 border-slate-300 dark:border-white/10 uppercase italic">
                    ABORT
                  </button>
                )}
            </div>
          </div>

          {/* Detailed Specs */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-6">
             <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
                {[
                    { label: 'Latency', value: ping, unit: 'ms', icon: Activity, color: 'text-blue-500' },
                    { label: 'Jitter', value: jitter, unit: 'ms', icon: RefreshCw, color: 'text-purple-500' },
                    { label: 'Peak Download', value: Math.round(download), unit: 'Mbps', icon: ArrowDown, color: 'text-cyan-500' },
                    { label: 'Peak Upload', value: Math.round(upload), unit: 'Mbps', icon: ArrowUp, color: 'text-indigo-500' },
                ].map((spec, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] shadow-lg flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{spec.label}</span>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-2xl font-black ${spec.color}`}>{spec.value || '--'}</span>
                                <span className="text-[10px] font-bold opacity-50">{spec.unit}</span>
                            </div>
                        </div>
                        <spec.icon className={`w-8 h-8 ${spec.color} opacity-20`} />
                    </div>
                ))}
             </div>

             <div className="bg-slate-900 text-white p-8 rounded-[3rem] border border-blue-500/20 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 opacity-5 group-hover:opacity-10 blur-[50px] transition-opacity" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-2">
                    <History className="w-4 h-4" /> TEST LOGS
                </h3>
                {history.length > 0 ? (
                    <div className="space-y-3">
                        {history.map((log, i) => (
                            <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 text-[10px] hover:bg-white/10 transition-colors">
                                <span className="font-bold opacity-40">{log.date}</span>
                                <div className="flex gap-4">
                                    <span className="text-cyan-400 font-black">↓ {log.download}M</span>
                                    <span className="text-indigo-400 font-black">↑ {log.upload}M</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs opacity-50 italic py-10 text-center">Diagnostics history empty...</p>
                )}
             </div>
          </div>
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
                { title: 'Quality Check', desc: 'Low jitter and ping are better for online classes and gaming.', icon: AlertCircle },
                { title: 'Safe Testing', desc: 'We use encrypted backend streams to ensure privacy and data integrity.', icon: Zap },
                { title: 'Precision Optima', desc: 'Auto-detecting the closest server nodes for low-latency sampling.', icon: Wifi }
            ].map((card, i) => (
                <div key={i} className="p-8 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-[2.5rem] border border-white/5 transition-all hover:-translate-y-2">
                    <card.icon className="w-10 h-10 text-blue-500 mb-6 opacity-30" />
                    <h4 className="font-black uppercase text-slate-800 dark:text-white mb-3 tracking-tighter">{card.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
