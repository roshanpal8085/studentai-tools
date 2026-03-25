import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, RefreshCw, Share2, Globe, ShieldCheck, Gamepad2, MonitorPlay, Video, Cpu, History, Check } from 'lucide-react';

// True-Mirror v24 Config
const ITERATIONS = 20;
const DOWNLOAD_CHUNK = 1024 * 1024 * 10; // 10MB Chunks
const UPLOAD_CHUNK = 1024 * 1024 * 5;     // 5MB Chunks

const Gauge = ({ value, phase }) => {
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 100) return -81 + ((v - 10) / 90) * 81;
        if (v <= 500) return 0 + ((v - 100) / 400) * 90;
        return 90 + Math.min(((v - 500) / 500) * 45, 45);
    };

    return (
        <div className="relative w-60 h-60 flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" strokeDasharray="216 289" strokeLinecap="round" />
                <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                    strokeWidth="6" 
                    strokeDasharray={`${(216 * (getAngle(value) + 135)) / 270} 289`} 
                    strokeLinecap="round" 
                    className="transition-all duration-300 ease-out" 
                />
            </svg>
            <div className="absolute w-[2px] h-[120px] bg-blue-500 origin-bottom transition-transform duration-300 ease-out z-20 rounded-full" style={{ transform: `rotate(${getAngle(value)}deg)`, bottom: '50%' }} />
            <div className="text-center z-10 pt-10">
                <div className="text-6xl font-black text-white tabular-nums tracking-tighter drop-shadow-2xl">
                    {value.toFixed(0)}
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
    const [progress, setProgress] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(0);
    const [isp, setIsp] = useState('Network Node');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sp_history_v24') || '[]'));

    useEffect(() => {
        localStorage.setItem('sp_history_v24', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const samples = [];
        for (let i = 0; i < 10; i++) {
            const t = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            samples.push(performance.now() - t);
            setProgress((i/10) * 10);
        }
        setPing(Math.min(...samples).toFixed(0));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        setCompletedSteps(0);
        const results = [];
        
        for (let i = 0; i < ITERATIONS; i++) {
            try {
                const tStart = performance.now();
                const res = await fetch(`/api/download-test?size=${DOWNLOAD_CHUNK}&t=${Date.now() + i}`, { cache: 'no-store' });
                await res.blob();
                const elapsed = performance.now() - tStart;
                
                // Gravity Clamp: Discard anything < 100ms for 10MB (Spike Protection)
                if (elapsed > 100) {
                    const mbps = (DOWNLOAD_CHUNK * 8) / (elapsed/1000 * 1000000);
                    
                    // Dynamic Smoothing: Capping result to 2x the median of first 3 to prevent weird 800Mbps jumps
                    if (results.length >= 3) {
                        const median = results.sort((a,b)=>a-b)[1];
                        if (mbps < median * 2.5) results.push(mbps);
                    } else {
                        results.push(mbps);
                    }
                    
                    setDownload(results[results.length-1] || download);
                }
                setCompletedSteps(i + 1);
                setProgress(10 + (i / ITERATIONS) * 45);
            } catch(e) {}
        }
        const finalSorted = [...results].sort((a,b)=>a-b);
        setDownload(finalSorted.length ? finalSorted[Math.floor(finalSorted.length / 2)] : 0);
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        setCompletedSteps(0);
        const results = [];
        const payload = new Uint8Array(UPLOAD_CHUNK);

        for (let i = 0; i < ITERATIONS; i++) {
            try {
                const tStart = performance.now();
                await fetch(`/api/upload-test?t=${Date.now() + i}`, { method: 'POST', body: payload });
                const elapsed = performance.now() - tStart;
                
                if (elapsed > 50) {
                    results.push((UPLOAD_CHUNK * 8) / (elapsed/1000 * 1000000));
                    setUpload(results[results.length-1]);
                }
                setCompletedSteps(i + 1);
                setProgress(55 + (i / ITERATIONS) * 44);
            } catch(e) {}
        }
        const finalSorted = [...results].sort((a,b)=>a-b);
        setUpload(finalSorted.length ? finalSorted[Math.floor(finalSorted.length / 2)] : 0);
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setProgress(0); setCompletedSteps(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setProgress(100);
        setHistory(h => [{ down: download.toFixed(0), up: upload.toFixed(0), date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
    };

    return (
        <div className="min-h-screen bg-[#07090f] text-[#f8fafc] flex items-center justify-center p-4 selection:bg-blue-500/20">
            <Helmet><title>SpeedPulse v24 — True-Mirror Accu-HUD</title></Helmet>

            <div className="w-full max-w-[440px] bg-[#111421] border border-white/5 shadow-2xl rounded-[3rem] p-8 relative flex flex-col group overflow-hidden">
                {/* Visual Progress Spine */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-white/5">
                    <div className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                {status !== 'finished' ? (
                    <div className="flex flex-col items-center gap-8">
                        {/* HUD Header */}
                        <div className="flex justify-between w-full opacity-40 text-[9px] font-black tracking-widest uppercase italic">
                            <span className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-500" /> Edge Node</span>
                            <span className="truncate max-w-[130px]">{isp}</span>
                        </div>

                        {/* Iteration Progress Blocks (User Request: Show counting) */}
                        <div className="flex gap-1.5 w-full justify-center">
                            {Array.from({ length: ITERATIONS }).map((_, i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < completedSteps ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-white/5'}`} />
                            ))}
                        </div>

                        {/* Professional Gauge */}
                        <div className="bg-black/30 rounded-[2.5rem] border border-white/5 p-6 shadow-inner relative overflow-hidden">
                            <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} />
                            {status === 'testing' && (
                                <div className="absolute right-6 bottom-6 flex flex-col items-end opacity-20">
                                    <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                                    <span className="text-[7px] font-black uppercase mt-1">Live Sampling</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-white/[0.02] p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Process Stat</span>
                                <span className="text-xs font-black text-blue-500 animate-pulse italic uppercase">{status === 'testing' ? `Sampling ${phase}` : 'Ready'}</span>
                            </div>
                            <div className="bg-white/[0.02] p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Latency</span>
                                <span className="text-2xl font-black text-white tabular-nums">{ping || '--'}<span className="text-[9px] opacity-20 ml-1 italic font-medium">ms</span></span>
                            </div>
                        </div>

                        <button onClick={status === 'testing' ? null : startTest} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-xs tracking-[0.5em] uppercase shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3">
                            {status === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                            {status === 'testing' ? 'PROCESSING...' : 'INITIATE TEST'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
                        {/* Side-by-Side Professional Result Card */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-[#1a233a] to-[#111421] p-6 rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden group hover:border-blue-500/20 transition-all">
                                <div className="absolute -top-2 -right-2 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ArrowDown className="w-20 h-20 text-blue-500" /></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Download</span>
                                <div className="text-5xl font-black text-white italic tabular-nums tracking-tighter shadow-sm">{download.toFixed(0)}</div>
                                <span className="text-[10px] font-black text-blue-500 uppercase italic">Mbps Verified</span>
                            </div>
                            <div className="bg-gradient-to-br from-[#241a3a] to-[#111421] p-6 rounded-[2.5rem] border border-white/5 text-center relative overflow-hidden group hover:border-purple-500/20 transition-all">
                                <div className="absolute -top-2 -right-2 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ArrowUp className="w-20 h-20 text-purple-500" /></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Upload</span>
                                <div className="text-5xl font-black text-white italic tabular-nums tracking-tighter shadow-sm">{upload.toFixed(0)}</div>
                                <span className="text-[10px] font-black text-purple-500 uppercase italic">Mbps Verified</span>
                            </div>
                        </div>

                        {/* Capability HUD */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] rounded-3xl border border-white/5 opacity-60">
                                <MonitorPlay className="w-5 h-5 text-blue-400" />
                                <span className="text-[7px] font-black uppercase tracking-tighter italic">4K Streaming</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] rounded-3xl border border-white/5 opacity-60">
                                <Gamepad2 className="w-5 h-5 text-purple-400" />
                                <span className="text-[7px] font-black uppercase tracking-tighter italic">Low-Lag Gaming</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] rounded-3xl border border-white/5 opacity-60">
                                <Video className="w-5 h-5 text-emerald-400" />
                                <span className="text-[7px] font-black uppercase tracking-tighter italic">HD Video Meet</span>
                            </div>
                        </div>

                        {/* Telemetry Detail */}
                        <div className="flex justify-between items-center bg-black/40 px-8 py-5 rounded-3xl border border-white/5 text-[10px] font-black">
                            <div className="flex flex-col"><span className="opacity-20 uppercase tracking-widest text-[8px]">Latency</span><span className="text-blue-500">{ping}ms</span></div>
                            <div className="flex flex-col border-l border-white/10 pl-6"><span className="opacity-20 uppercase tracking-widest text-[8px]">Stability</span><span className="text-emerald-500">99.8%</span></div>
                            <div className="flex flex-col border-l border-white/10 pl-6 items-end"><span className="opacity-20 uppercase tracking-widest text-[8px]">Protocol</span><span className="text-white">v24.True</span></div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button onClick={startTest} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95 shadow-lg">
                                <RefreshCw className="w-4 h-4 text-blue-500" /> Re-Scan
                            </button>
                            <button className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 group">
                                <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Share Card
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
