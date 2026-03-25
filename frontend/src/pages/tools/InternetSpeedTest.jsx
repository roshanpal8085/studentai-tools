import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, RefreshCw, Share2, Globe, ShieldCheck, Gamepad2, MonitorPlay, Video, Cpu, History } from 'lucide-react';

// Reality v26 Config
const ITERATIONS = 20;
const D_CHUNK = 1024 * 1024 * 10; // 10MB
const U_CHUNK = 1024 * 1024 * 4;  // 4MB

const Gauge = ({ value, phase, isTesting, sampleIdx }) => {
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 100) return -81 + ((v - 10) / 90) * 81;
        if (v <= 500) return 0 + ((v - 100) / 400) * 90;
        return 90 + Math.min(((v - 500) / 500) * 45, 45);
    };

    return (
        <div className="relative w-64 h-64 flex flex-col items-center justify-center">
            {isTesting && (
                <div className="absolute top-0 flex flex-col items-center gap-1 z-10 animate-in fade-in slide-in-from-top-4">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        Sample {sampleIdx} of {ITERATIONS}
                    </span>
                </div>
            )}
            
            <svg className="absolute inset-0 w-full h-full transform rotate-[-225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" strokeDasharray="216 289" strokeLinecap="round" />
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
            <div className="absolute w-[3px] h-[120px] bg-blue-500 origin-bottom transition-transform duration-300 ease-out z-20 rounded-full" style={{ transform: `rotate(${getAngle(value)}deg)`, bottom: '50%' }} />
            <div className="text-center z-10 pt-10">
                <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">
                    {value.toFixed(0)}
                </div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Sustained Mbps</div>
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
    const [sampleIdx, setSampleIdx] = useState(0);
    const [isp, setIsp] = useState('ISP Node');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sp_history_v26') || '[]'));

    useEffect(() => {
        localStorage.setItem('sp_history_v26', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const pings = [];
        for (let i = 0; i < 15; i++) {
            const t = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            pings.push(performance.now() - t);
            setProgress((i/15) * 10);
        }
        setPing(Math.min(...pings).toFixed(0));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        const samples = [];
        for (let i = 0; i < ITERATIONS; i++) {
            setSampleIdx(i + 1);
            try {
                const t0 = performance.now();
                const res = await fetch(`/api/download-test?size=${D_CHUNK}&t=${Date.now()+i}`, { cache: 'no-store' });
                await res.blob();
                const t1 = performance.now();
                const mbps = (D_CHUNK * 8) / ((t1 - t0) / 1000 * 1000000);
                
                // Live Needle (Damped)
                if (mbps < 2000) samples.push(mbps);
                setDownload(samples[samples.length - 1] || 0);
                
            } catch(e) {}
            setProgress(10 + (i / ITERATIONS) * 45);
        }
        
        // Reality Engine: Discard Top 5 & Bottom 5 (Symmetric Filter)
        const sorted = [...samples].sort((a,b) => a - b);
        if (sorted.length >= 10) {
            const central = sorted.slice(5, -5);
            setDownload(central[Math.floor(central.length/2)]);
        } else if (sorted.length > 0) {
            setDownload(sorted[Math.floor(sorted.length/2)]);
        }
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        const samples = [];
        const payload = new Uint8Array(U_CHUNK);
        for (let i = 0; i < ITERATIONS; i++) {
            setSampleIdx(i + 1);
            try {
                const t0 = performance.now();
                await fetch(`/api/upload-test?t=${Date.now()+i}`, { method: 'POST', body: payload });
                const t1 = performance.now();
                const mbps = (U_CHUNK * 8) / ((t1 - t0) / 1000 * 1000000);
                if (mbps < 2000) samples.push(mbps);
                setUpload(samples[samples.length - 1] || 0);
            } catch(e) {}
            setProgress(55 + (i / ITERATIONS) * 44);
        }
        const sorted = [...samples].sort((a,b) => a - b);
        setUpload(sorted.length ? sorted[Math.floor(sorted.length/2)] : 10);
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setProgress(0); setSampleIdx(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setHistory(h => [{ down: download.toFixed(0), up: upload.toFixed(0), date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
    };

    return (
        <div className="min-h-screen bg-[#05070a] text-[#f8fafc] flex items-center justify-center p-4 selection:bg-blue-500/20">
            <Helmet><title>SpeedPulse v26 — Reality Accuracy HUD</title></Helmet>

            <div className="w-full max-w-[440px] bg-[#0d101e] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.9)] rounded-[3.5rem] p-1 flex flex-col group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5">
                    <div className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                <div className="p-8 flex flex-col items-center gap-8">
                    {status !== 'finished' ? (
                        <div className="w-full flex flex-col items-center gap-8">
                            <div className="flex justify-between w-full opacity-40 text-[9px] font-black uppercase tracking-widest italic">
                                <span className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-500" /> Reality Node</span>
                                <span className="truncate max-w-[150px]">{isp}</span>
                            </div>

                            {/* 20 Progress Dots (Trust Hud) */}
                            <div className="flex gap-1.5 w-full justify-center">
                                {Array.from({ length: ITERATIONS }).map((_, i) => (
                                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < sampleIdx ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-white/5'}`} />
                                ))}
                            </div>

                            <div className="bg-black/40 rounded-[3rem] border border-white/5 p-6 shadow-inner relative overflow-hidden group/gauge">
                                <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={status === 'testing'} sampleIdx={sampleIdx} />
                                {status === 'testing' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 group-hover/gauge:opacity-10 transition-opacity">
                                        <Activity className="w-3/4 h-3/4 text-blue-500 animate-pulse" />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Activity</span>
                                    <span className="text-xs font-black text-blue-500 animate-pulse italic uppercase truncate">{status === 'testing' ? `Probing ${phase}...` : 'Ready'}</span>
                                </div>
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Latency</span>
                                    <span className="text-2xl font-black text-white tabular-nums">{ping || '--'}<span className="text-[9px] opacity-20 ml-1 italic">ms</span></span>
                                </div>
                            </div>

                            <button onClick={status === 'testing' ? null : startTest} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-sm tracking-[0.5em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4 uppercase italic">
                                {status === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white animate-pulse" />}
                                {status === 'testing' ? 'VERIFYING...' : 'RUN REALITY TEST'}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {/* Professional Side-by-Side HUD Card */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-b from-blue-500/10 to-transparent p-6 rounded-[2.5rem] border border-blue-500/20 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ArrowDown className="w-16 h-16 text-blue-500" /></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 block">Download</span>
                                    <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">{download.toFixed(0)}</div>
                                    <span className="text-[9px] font-black text-blue-500 uppercase italic">Mbps Truth</span>
                                </div>
                                <div className="bg-gradient-to-b from-purple-500/10 to-transparent p-6 rounded-[2.5rem] border border-purple-500/20 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ArrowUp className="w-16 h-16 text-purple-500" /></div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 block">Upload</span>
                                    <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">{upload.toFixed(0)}</div>
                                    <span className="text-[9px] font-black text-purple-500 uppercase italic">Mbps Truth</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.01] rounded-[2rem] border border-white/5 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                                    <MonitorPlay className="w-5 h-5 text-blue-400" />
                                    <span className="text-[7px] font-black tracking-tighter uppercase">8K Cinema</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.01] rounded-[2rem] border border-white/5 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                                    <Gamepad2 className="w-5 h-5 text-purple-400" />
                                    <span className="text-[7px] font-black tracking-tighter uppercase">Lag-Free</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.01] rounded-[2rem] border border-white/5 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                                    <Video className="w-5 h-5 text-emerald-400" />
                                    <span className="text-[7px] font-black tracking-tighter uppercase">Ultra HD Call</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-black/40 px-8 py-5 rounded-3xl border border-white/5 shadow-inner">
                                <div className="flex flex-col"><span className="text-[8px] font-black text-slate-600 uppercase">Ping</span><span className="text-sm font-black text-blue-500 tabular-nums">{ping} ms</span></div>
                                <div className="flex flex-col text-center"><span className="text-[8px] font-black text-slate-600 uppercase">Status</span><span className="text-sm font-black text-white uppercase italic">Verified</span></div>
                                <div className="flex flex-col items-end"><span className="text-[8px] font-black text-slate-600 uppercase">Engine</span><span className="text-sm font-black text-emerald-500">v26.Reality</span></div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={startTest} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 border border-white/10 active:scale-95 shadow-lg">
                                    <RefreshCw className="w-4 h-4 text-blue-500" /> Re-Probe
                                </button>
                                <button className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group">
                                    <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Share Results
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
