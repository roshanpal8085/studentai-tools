import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, RefreshCw, Share2, Globe, ShieldCheck, Gamepad2, MonitorPlay, Video, Cpu, History } from 'lucide-react';

// Atomic v22 Config
const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB Atomic Chunks
const SAMPLES_COUNT = 15;            // total 150MB transfer
const GRAVITY_LIMIT_MS = 80;        // 10MB in <80ms is impossible on Fiber (>1Gbps). Treat as local spike.

const Gauge = ({ value, isStabilizing, phase }) => {
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 100) return -81 + ((v - 10) / 90) * 81;
        if (v <= 500) return 0 + ((v - 100) / 400) * 90;
        return 90 + Math.min(((v - 500) / 500) * 45, 45);
    };

    return (
        <div className="relative w-64 h-64 flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" strokeDasharray="212 282" strokeLinecap="round" />
                <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke={phase === 'UPLOAD' ? '#8b5cf6' : '#3b82f6'} 
                    strokeWidth="6" 
                    strokeDasharray={`${(212 * (getAngle(value) + 135)) / 270} 282`} 
                    strokeLinecap="round" 
                    className="transition-all duration-300 ease-out" 
                />
            </svg>
            <div className="absolute w-[3px] h-[130px] bg-blue-500 origin-bottom transition-transform duration-300 ease-out z-20 rounded-full" style={{ transform: `rotate(${getAngle(value)}deg)`, bottom: '50%' }} />
            <div className="text-center z-10 pt-12">
                <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
                    {value.toFixed(0)}
                    {isStabilizing && <span className="text-blue-500 animate-pulse">...</span>}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Mbps Accuracy</div>
            </div>
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
    const [isp, setIsp] = useState('ISP Node');
    const [isStabilizing, setIsStabilizing] = useState(false);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sp_history_v22') || '[]'));

    useEffect(() => {
        localStorage.setItem('sp_history_v22', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const times = [];
        for (let i = 0; i < 10; i++) {
            const t = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            times.push(performance.now() - t);
            setProgress((i/10) * 10);
        }
        setPing(Math.min(...times).toFixed(0));
        setJitter((Math.max(...times) - Math.min(...times)).toFixed(0));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        const results = [];
        setIsStabilizing(true);

        for (let i = 0; i < SAMPLES_COUNT; i++) {
            const tStart = performance.now();
            const res = await fetch(`/api/download-test?size=${CHUNK_SIZE}&t=${Date.now() + i}`, { cache: 'no-store' });
            await res.blob();
            const tEnd = performance.now();
            const elapsed = (tEnd - tStart);

            // Gravity Filter: If 10MB is faster than 80ms, it's a RAM/Loopback spike.
            if (elapsed > GRAVITY_LIMIT_MS) {
                const mbps = (CHUNK_SIZE * 8) / (elapsed/1000 * 1000000);
                results.push(mbps);
                if (results.length > 2) setIsStabilizing(false);
                
                // Real-time animation (Median of last 3 valid samples)
                const last3 = results.slice(-3);
                setDownload(last3.reduce((a,b)=>a+b)/last3.length);
            }
            setProgress(10 + (i / SAMPLES_COUNT) * 45);
        }
        
        const finalSorted = [...results].sort((a,b)=>a-b);
        setDownload(finalSorted[Math.floor(finalSorted.length / 2)]);
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        const results = [];
        const payload = new Uint8Array(1024 * 1024 * 5); // 5MB Upload Chunks

        for (let i = 0; i < 10; i++) {
            const tStart = performance.now();
            await fetch(`/api/upload-test?t=${Date.now() + i}`, { method: 'POST', body: payload });
            const elapsed = (performance.now() - tStart);
            
            if (elapsed > 50) { // Same gravity for upload (smaller chunk)
                results.push((payload.length * 8) / (elapsed/1000 * 1000000));
                setUpload(results[results.length-1]);
            }
            setProgress(55 + (i / 10) * 45);
        }
        const finalSorted = [...results].sort((a,b)=>a-b);
        setUpload(finalSorted[Math.floor(finalSorted.length / 2)]);
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setProgress(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setHistory(h => [{ down: download.toFixed(0), up: upload.toFixed(0), ping, date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
    };

    return (
        <div className="min-h-screen bg-[#060810] text-[#f8fafc] flex items-center justify-center p-4 selection:bg-blue-500/20">
            <Helmet><title>SpeedPulse v22 — Atomic Accuracy HUD</title></Helmet>

            <div className="w-full max-w-[440px] bg-[#101426] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-[3rem] p-8 relative flex flex-col group overflow-hidden">
                <div className="absolute top-0 left-0 h-1 w-full bg-white/5">
                    <div className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                {status !== 'finished' ? (
                    <div className="flex flex-col items-center gap-10">
                        <div className="flex justify-between w-full opacity-40 text-[9px] font-black tracking-widest uppercase italic">
                            <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-500" /> Edge Region 01</div>
                            <span className="truncate max-w-[150px]">{isp}</span>
                        </div>

                        <div className="bg-black/40 rounded-[2.5rem] border border-white/5 p-6 shadow-2xl relative">
                            <Gauge value={phase === 'UPLOAD' ? upload : download} isStabilizing={isStabilizing} phase={phase} />
                            {isStabilizing && (
                                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/20 animate-pulse">
                                    <Activity className="w-3 h-3 text-blue-400" />
                                    <span className="text-[8px] font-black text-blue-400 tracking-widest uppercase">Calibrating</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-black/20 p-5 rounded-3xl border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Status</span>
                                <span className="text-xs font-black text-blue-500 animate-pulse italic uppercase truncate">{status === 'testing' ? `Testing ${phase}` : 'Connected'}</span>
                            </div>
                            <div className="bg-black/20 p-5 rounded-3xl border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Latency</span>
                                <span className="text-2xl font-black tabular-nums">{ping || '--'} <span className="text-[9px] opacity-20 italic">ms</span></span>
                            </div>
                        </div>

                        <button onClick={status === 'testing' ? null : startTest} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-sm tracking-[0.4em] uppercase shadow-[0_20px_40px_rgba(37,99,235,0.2)] active:scale-95 transition-all flex items-center justify-center gap-4">
                            {status === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white animate-bounce" />}
                            {status === 'testing' ? 'PROCESSING...' : 'INITIALIZE'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 animate-in fade-in zoom-in duration-500">
                        {/* Final Pro HUD View */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-b from-blue-500/10 to-transparent p-6 rounded-[2.5rem] border border-blue-500/20 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><ArrowDown className="w-12 h-12 text-blue-500" /></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 block">Download</span>
                                <div className="text-5xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-lg">{download.toFixed(0)}</div>
                                <span className="text-[9px] font-black text-blue-500 italic mt-1 block">Sustained Mbps</span>
                            </div>
                            <div className="bg-gradient-to-b from-purple-500/10 to-transparent p-6 rounded-[2.5rem] border border-purple-500/20 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><ArrowUp className="w-12 h-12 text-purple-500" /></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 block">Upload</span>
                                <div className="text-5xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-lg">{upload.toFixed(0)}</div>
                                <span className="text-[9px] font-black text-purple-500 italic mt-1 block">Sustained Mbps</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] rounded-3xl border border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                                <MonitorPlay className="w-5 h-5 text-blue-400" />
                                <span className="text-[8px] font-black uppercase tracking-tighter">4K STREAM</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] rounded-3xl border border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                                <Gamepad2 className="w-5 h-5 text-purple-400" />
                                <span className="text-[8px] font-black uppercase tracking-tighter">LAG-FREE</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] rounded-3xl border border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                                <Video className="w-5 h-5 text-emerald-400" />
                                <span className="text-[8px] font-black uppercase tracking-tighter">HD CALLS</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-black/40 px-8 py-5 rounded-[2rem] border border-white/5">
                            <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase">Ping</span><span className="text-sm font-black text-blue-400 tabular-nums">{ping} ms</span></div>
                            <div className="flex flex-col text-center"><span className="text-[8px] font-black text-slate-500 uppercase">Jitter</span><span className="text-sm font-black text-purple-400 tabular-nums">{jitter} ms</span></div>
                            <div className="flex flex-col items-end"><span className="text-[8px] font-black text-slate-500 uppercase">Engine</span><span className="text-sm font-black text-white">v22.Atomic</span></div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={startTest} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 border border-white/5">
                                <RefreshCw className="w-4 h-4 text-blue-500" /> Try Again
                            </button>
                            <button className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-lg group">
                                <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Share
                            </button>
                        </div>

                        {history.length > 0 && (
                            <div className="space-y-2 opacity-50 hover:opacity-100 transition-opacity px-2">
                                {history.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center text-[9px] font-black text-slate-500 italic pb-2 border-b border-white/5">
                                        <span>#{history.length - i} TEST RUN</span>
                                        <div className="flex gap-4 tracking-tighter">
                                            <span className="text-blue-500">↓ {h.down} MBPS</span>
                                            <span className="text-purple-500">↑ {h.up} MBPS</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
