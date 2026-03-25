import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, Share2, Copy, CheckCircle2, Wifi, ShieldCheck, Globe } from 'lucide-react';

const DOWNLOAD_SIZE = 1024 * 1024 * 25; // 25MB for stability
const UPLOAD_SIZE = 1024 * 1024 * 8;    // 8MB
const WINDOW_SIZE = 500;                // 500ms rolling window

const Waveform = ({ active, color }) => {
    return (
        <div className="absolute inset-x-0 bottom-0 h-24 overflow-hidden pointer-events-none opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                <path 
                    d="M0 50 Q 50 20, 100 50 T 200 50 T 300 50 T 400 50" 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="2" 
                    className={active ? 'animate-[wave_2s_linear_infinite]' : ''}
                />
                <style>{`
                    @keyframes wave {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-200px); }
                    }
                `}</style>
            </svg>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState(''); 
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [ping, setPing] = useState(0);
    const [jitter, setJitter] = useState(0);
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('st_history_v15') || '[]'));
    const [copied, setCopied] = useState(false);
    const [isp, setIsp] = useState('Detecting...');

    const samples = useRef([]);
    const lastUpdate = useRef(0);

    useEffect(() => {
        localStorage.setItem('st_history_v15', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, [history]);

    const smoothSpeed = (newVal, currentVal) => {
        if (!currentVal) return newVal;
        // Adaptive Smoothing: Don't jump more than 40% in one frame
        const delta = newVal - currentVal;
        return currentVal + (delta * 0.15); 
    };

    const runPing = async () => {
        setPhase('PING');
        const times = [];
        for (let i = 0; i < 6; i++) {
            const start = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            times.push(performance.now() - start);
            setProgress((i/6) * 10);
        }
        const avg = times.reduce((a, b) => a + b) / times.length;
        setPing(avg.toFixed(1));
        setJitter((Math.max(...times) - Math.min(...times)).toFixed(1));
    };

    const runDownload = () => {
        return new Promise((resolve) => {
            setPhase('DOWNLOAD');
            const start = performance.now();
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/api/download-test?size=${DOWNLOAD_SIZE}&t=${Date.now()}`, true);
            xhr.responseType = 'blob';
            xhr.setRequestHeader('Cache-Control', 'no-store');

            xhr.onprogress = (e) => {
                const now = performance.now();
                const elapsed = (now - start) / 1000;
                if (elapsed > 0.4) { // TCP Ramp-up skip
                    const rawMbps = (e.loaded * 8) / (elapsed * 1000000);
                    setDownload(prev => smoothSpeed(rawMbps, prev));
                    setProgress(10 + (e.loaded / DOWNLOAD_SIZE) * 40);
                }
            };

            xhr.onload = () => {
                const totalElapsed = (performance.now() - start) / 1000;
                const finalMbps = (DOWNLOAD_SIZE * 8) / (totalElapsed * 1000000);
                setDownload(finalMbps);
                resolve();
            };
            xhr.send();
        });
    };

    const runUpload = () => {
        return new Promise((resolve) => {
            setPhase('UPLOAD');
            const start = performance.now();
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `/api/upload-test?t=${Date.now()}`, true);
            
            xhr.upload.onprogress = (e) => {
                const now = performance.now();
                const elapsed = (now - start) / 1000;
                if (elapsed > 0.4) {
                    const rawMbps = (e.loaded * 8) / (elapsed * 1000000);
                    setUpload(prev => smoothSpeed(rawMbps, prev));
                    setProgress(50 + (e.loaded / UPLOAD_SIZE) * 50);
                }
            };

            xhr.onload = () => {
                const totalElapsed = (performance.now() - start) / 1000;
                const finalMbps = (UPLOAD_SIZE * 8) / (totalElapsed * 1000000);
                setUpload(finalMbps);
                resolve();
            };
            xhr.send(new Uint8Array(UPLOAD_SIZE));
        });
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setPing(0); setProgress(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setHistory(h => [{ down: download.toFixed(1), up: upload.toFixed(1), ping, date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
    };

    return (
        <div className="min-h-screen bg-[#030508] text-slate-100 flex items-center justify-center p-4">
            <Helmet><title>SpeedPulse Elite — Pro Bandwidth Diagnostics</title></Helmet>

            <div className="w-full max-w-[420px] bg-slate-900/40 backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 p-1 flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                {/* Animated Inner Border */}
                <div className="absolute inset-0 rounded-[2.5rem] border border-blue-500/20 group-hover:border-blue-500/40 transition-colors" />
                
                <div className="bg-slate-900/80 rounded-[2.4rem] p-8 relative flex flex-col items-center gap-6">
                    {/* Header */}
                    <div className="flex justify-between w-full items-center mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 italic">SpeedPulse v15</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-600">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" /> SECURE
                        </div>
                    </div>

                    {/* Accurate Gauge & Waveform */}
                    <div className="relative w-full aspect-square flex items-center justify-center bg-black/60 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-inner">
                        <Waveform active={status === 'testing'} color={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} />
                        
                        <div className="relative z-10 text-center">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                                {status === 'testing' ? `${phase} ACTIVE` : 'ENGINE IDLE'}
                            </div>
                            <div className="text-6xl font-black tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                                {status === 'testing' ? (phase === 'UPLOAD' ? upload.toFixed(1) : download.toFixed(1)) : (status === 'finished' ? download.toFixed(1) : '0')}
                            </div>
                            <div className="text-xs font-black text-blue-500 mt-2 tracking-[0.2em] uppercase italic bg-blue-500/10 px-4 py-1 rounded-full">Mbps</div>
                        </div>

                        {/* Precise Progress Bar Around Inner Circle */}
                        <div className="absolute inset-0 p-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                                <circle 
                                    cx="50" cy="50" r="48" 
                                    fill="none" 
                                    stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                                    strokeWidth="2" 
                                    strokeDasharray="301.6" 
                                    strokeDashoffset={301.6 - (301.6 * progress) / 100}
                                    className="transition-all duration-300 shadow-[0_0_10px_#3b82f644]"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Pro Results Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 group-hover:border-blue-500/10 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <ArrowDown className="w-3 h-3 text-blue-500" strokeWidth={3} />
                                <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Download</span>
                            </div>
                            <div className="text-2xl font-black tabular-nums text-white">{download > 0 ? download.toFixed(1) : '--'} <span className="text-[9px] opacity-30 italic">Mbps</span></div>
                        </div>
                        <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 group-hover:border-purple-500/10 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <ArrowUp className="w-3 h-3 text-purple-500" strokeWidth={3} />
                                <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Upload</span>
                            </div>
                            <div className="text-2xl font-black tabular-nums text-white">{upload > 0 ? upload.toFixed(1) : '--'} <span className="text-[9px] opacity-30 italic">Mbps</span></div>
                        </div>
                    </div>

                    {/* Connection Stats */}
                    <div className="flex justify-between w-full px-6 py-4 bg-black/40 rounded-3xl border border-white/5 text-[9px] font-bold">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col"><span className="opacity-40 uppercase">Ping</span><span className="text-blue-500 tabular-nums">{ping || '--'} ms</span></div>
                            <div className="flex flex-col border-l border-white/10 pl-3"><span className="opacity-40 uppercase">Jitter</span><span className="text-purple-500 tabular-nums">{jitter || '--'} ms</span></div>
                        </div>
                        <div className="flex flex-col items-end whitespace-nowrap overflow-hidden">
                            <span className="opacity-40 uppercase">Network</span>
                            <span className="text-white max-w-[100px] truncate">{isp}</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="w-full">
                        {status === 'idle' || status === 'finished' || status === 'error' ? (
                            <button onClick={startTest} className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black rounded-3xl text-sm tracking-[0.3em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase">
                                {status === 'finished' ? <RefreshCw className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-white" />}
                                {status === 'finished' ? 'RETEST' : 'BEGIN TEST'}
                            </button>
                        ) : (
                            <div className="w-full py-5 bg-slate-800/80 rounded-3xl flex items-center justify-center gap-4 border border-white/5">
                                <Activity className="w-5 h-5 text-blue-500 animate-spin" />
                                <span className="text-xs font-black text-blue-500 tracking-[0.2em] italic uppercase animate-pulse">Running Diagnostics...</span>
                            </div>
                        )}
                    </div>

                    {/* History Minimalist */}
                    {history.length > 0 && (
                        <div className="w-full space-y-2 opacity-30 hover:opacity-100 transition-opacity">
                            {history.slice(0, 2).map((h, i) => (
                                <div key={i} className="flex justify-between text-[9px] font-black bg-white/[0.01] p-3 rounded-2xl border border-white/5">
                                    <span className="text-slate-600 italic">#{history.length - i} Run</span>
                                    <div className="flex gap-4">
                                        <span className="text-blue-500">↓ {h.down}</span>
                                        <span className="text-purple-500">↑ {h.up}</span>
                                        <span className="text-slate-500">{h.ping}ms</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
