import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowDown, ArrowUp, Zap, Globe, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

// True-Sense Config
const CHUNK_SIZE = 1024 * 1024 * 2; // 2MB Chunks
const CHUNK_COUNT = 25;              // 50MB total

const Gauge = ({ value, phase, isTesting }) => {
    // 0 to 1000 Mbps mapping to -135deg to 135deg
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 100) return -81 + ((v - 10) / 90) * 81;
        if (v <= 500) return 0 + ((v - 100) / 400) * 90;
        return 90 + Math.min(((v - 500) / 500) * 45, 45);
    };

    return (
        <div className="relative w-full aspect-square flex flex-col items-center justify-center max-h-[300px]">
            {/* Minimal SVG Gauge - No heavy filters */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeDasharray="207 276" strokeLinecap="round" />
                <circle 
                    cx="50" cy="50" r="44" 
                    fill="none" 
                    stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                    strokeWidth="5" 
                    strokeDasharray={`${(207 * (getAngle(value) + 135)) / 270} 276`} 
                    strokeLinecap="round" 
                    className="transition-all duration-300 ease-out" 
                />
            </svg>

            {/* High-Speed Needle */}
            <div className="absolute w-[3px] h-[120px] bg-blue-500 origin-bottom transition-transform duration-300 ease-out z-20 rounded-full" style={{ transform: `rotate(${getAngle(value)}deg)`, bottom: '50%' }} />
            
            <div className="text-center z-10 pt-10">
                <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
                    {value.toFixed(0)}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic italic">Mbps</div>
            </div>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState(''); 
    const [ping, setPing] = useState(0);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isp, setIsp] = useState('Detecting...');

    useEffect(() => {
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, []);

    const runPing = async () => {
        setPhase('PING');
        const samples = [];
        for (let i = 0; i < 6; i++) {
            const t = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            samples.push(performance.now() - t);
            setProgress((i/6) * 10);
        }
        setPing(Math.min(...samples).toFixed(0));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        const results = [];
        for (let i = 0; i < CHUNK_COUNT; i++) {
            const start = performance.now();
            const res = await fetch(`/api/download-test?size=${CHUNK_SIZE}&t=${Date.now() + i}`, { cache: 'no-store' });
            await res.blob();
            const elapsed = (performance.now() - start) / 1000;
            const mbps = (CHUNK_SIZE * 8) / (elapsed * 1000000);
            
            results.push(mbps);
            // Real-time needle from median of last 3
            const recent = results.slice(-3);
            setDownload(recent.reduce((a,b)=>a+b)/recent.length);
            setProgress(10 + (i / CHUNK_COUNT) * 45);
        }
        // Result: True Median (ignores the 5000Mbps spikes)
        const sorted = [...results].sort((a,b) => a-b);
        setDownload(sorted[Math.floor(sorted.length/2)]);
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        const results = [];
        const data = new Uint8Array(CHUNK_SIZE);
        for (let i = 0; i < 15; i++) {
            const start = performance.now();
            await fetch(`/api/upload-test?t=${Date.now() + i}`, { method: 'POST', body: data });
            const elapsed = (performance.now() - start) / 1000;
            results.push((CHUNK_SIZE * 8) / (elapsed * 1000000));
            setUpload(results[results.length-1]);
            setProgress(55 + (i / 15) * 45);
        }
        const sorted = [...results].sort((a,b) => a-b);
        setUpload(sorted[Math.floor(sorted.length/2)]);
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setProgress(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setProgress(100);
    };

    return (
        <div className="min-h-screen max-h-screen bg-[#05060a] text-white flex items-center justify-center p-4 overflow-hidden">
            <Helmet><title>SpeedPulse True-Sense Diagnostics</title></Helmet>

            <div className="w-full max-w-[420px] max-h-[90vh] flex flex-col bg-[#10121a] border border-white/5 shadow-2xl rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden">
                
                {/* Modern Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex border-l-2 border-blue-500 pl-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Node</span>
                            <span className="text-xs font-bold text-white truncate max-w-[150px]">{isp}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" /> Encrypted
                    </div>
                </div>

                {/* Main Gauge Area - Flexible Height */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-0 bg-black/30 rounded-[2.5rem] border border-white/5 p-4 mb-6 shadow-inner relative">
                    <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={status === 'testing'} />
                    {status === 'testing' && (
                        <div className="absolute right-6 top-6 flex flex-col items-end opacity-20">
                            <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase mt-1">Live Sense</span>
                        </div>
                    )}
                </div>

                {/* Result Matrix */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <ArrowDown className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Download</span>
                        </div>
                        <div className="text-2xl font-black tabular-nums">{download > 0 ? download.toFixed(1) : '--'} <span className="text-[8px] opacity-10">Mbps</span></div>
                    </div>
                    <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <ArrowUp className="w-3 h-3 text-purple-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload</span>
                        </div>
                        <div className="text-2xl font-black tabular-nums">{upload > 0 ? upload.toFixed(1) : '--'} <span className="text-[8px] opacity-10">Mbps</span></div>
                    </div>
                </div>

                {/* Footer HUD */}
                <div className="flex justify-between items-center mb-6 px-4 py-3 bg-black/40 rounded-2xl border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-600 uppercase">Ping</span>
                        <span className="text-sm font-black text-blue-500 tabular-nums">{ping || '--'} ms</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Globe className="w-4 h-4 text-slate-700 mb-0.5" />
                        <span className="text-[8px] font-black uppercase opacity-20">Global Node</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-600 uppercase">Server</span>
                        <span className="text-xs font-black text-white">Edge v19</span>
                    </div>
                </div>

                {/* Trigger */}
                <div className="relative">
                    {status === 'idle' || status === 'finished' ? (
                        <button onClick={startTest} className="w-full py-5 bg-[#3162e6] hover:bg-[#254ccb] text-white font-black rounded-3xl text-sm tracking-[0.4em] uppercase shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                            {status === 'finished' ? <RefreshCw className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-white" />}
                            {status === 'finished' ? 'RETEST' : 'BEGIN TEST'}
                        </button>
                    ) : (
                        <div className="w-full py-5 bg-slate-800 rounded-3xl flex items-center justify-center gap-4 overflow-hidden relative">
                            <div className="absolute left-0 top-0 h-full bg-blue-600/20 transition-all duration-300" style={{ width: `${progress}%` }} />
                            <span className="relative z-10 text-[10px] font-black text-blue-400 tracking-[0.4em] uppercase italic animate-pulse">Running {phase}...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
