import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, RefreshCw, Share2, Globe, ShieldCheck, Gamepad2, MonitorPlay, Video, Cpu, History } from 'lucide-react';

// Infinity v25 Config
const TEST_DURATION = 6000; // 6 seconds
const IGNORE_PHASE = 1200;   // Discard first 1.2s (Anti-Spike)

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
                <div className="text-6xl font-black text-white tabular-nums tracking-tighter drop-shadow-2xl">
                    {value.toFixed(0)}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic italic">Mbps Truth</div>
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
    const [stepCount, setStepCount] = useState(0);
    const [isp, setIsp] = useState('ISP Node');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sp_history_v25') || '[]'));

    useEffect(() => {
        localStorage.setItem('sp_history_v25', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const samples = [];
        for (let i = 0; i < 15; i++) {
            const t = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            samples.push(performance.now() - t);
            setProgress((i/15) * 10);
        }
        setPing(Math.min(...samples).toFixed(0));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        const start = performance.now();
        let bytesAcc = 0;
        let samplesAcc = [];
        let bytesSinceIgno = 0;
        let timeSinceIgno = 0;

        while (performance.now() - start < TEST_DURATION) {
            const itStart = performance.now();
            const res = await fetch(`/api/download-test?size=${1024*1024*8}&t=${Date.now() + Math.random()}`, { cache: 'no-store' });
            const reader = res.body.getReader();
            
            while(true) {
                const {done, value} = await reader.read();
                if (done) break;
                bytesAcc += value.length;
                const now = performance.now();
                const totalElapsed = now - start;
                
                if (totalElapsed > IGNORE_PHASE) {
                    bytesSinceIgno += value.length;
                    timeSinceIgno = (now - (start + IGNORE_PHASE)) / 1000;
                    const mbps = (bytesSinceIgno * 8) / (timeSinceIgno * 1000000);
                    if (mbps < 2500) setDownload(mbps); // Safeguard
                }
                
                setStepCount(Math.min(20, Math.floor((totalElapsed / TEST_DURATION) * 20)));
                setProgress(10 + (totalElapsed / TEST_DURATION) * 45);
                if (totalElapsed > TEST_DURATION) break;
            }
        }
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        const start = performance.now();
        let bytesAcc = 0;
        const payload = new Uint8Array(1024 * 1024 * 4); // 4MB Chunks

        while (performance.now() - start < TEST_DURATION/1.5) {
            const chunkStart = performance.now();
            await fetch(`/api/upload-test?t=${Date.now() + Math.random()}`, { method: 'POST', body: payload });
            const now = performance.now();
            bytesAcc += payload.length;
            const totalElapsed = (now - start);
            
            if (totalElapsed > IGNORE_PHASE) {
                const mbps = (bytesAcc * 8) / (totalElapsed / 1000 * 1000000);
                if (mbps < 2500) setUpload(mbps);
            }
            
            setStepCount(Math.min(20, Math.floor((totalElapsed / (TEST_DURATION/1.5)) * 20)));
            setProgress(55 + (totalElapsed / (TEST_DURATION/1.5)) * 44);
        }
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setProgress(0); setStepCount(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setProgress(100);
        setHistory(h => [{ down: download.toFixed(0), up: upload.toFixed(0), date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
    };

    return (
        <div className="min-h-screen bg-[#04050a] text-white flex items-center justify-center p-4 selection:bg-blue-500/20">
            <Helmet><title>SpeedPulse v25 — Infinity Edge Precision</title></Helmet>

            <div className="w-full max-w-[440px] bg-[#0c0e18] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.9)] rounded-[3rem] p-1 flex flex-col group overflow-hidden">
                <div className="absolute top-0 left-0 h-[3px] bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />

                <div className="p-8 flex flex-col items-center relative overflow-hidden">
                    {status !== 'finished' ? (
                        <div className="w-full flex flex-col items-center gap-8">
                            <div className="flex justify-between w-full opacity-30 text-[9px] font-black uppercase tracking-widest italic">
                                <span className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-500" /> Active Probe</span>
                                <span className="truncate max-w-[150px]">{isp}</span>
                            </div>

                            {/* 20 Progress Steps (Trust Hud) */}
                            <div className="grid grid-cols-20 gap-1 w-full max-w-[300px]">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < stepCount ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-white/5'}`} />
                                ))}
                            </div>

                            <div className="bg-black/30 rounded-[2.5rem] border border-white/5 p-6 shadow-inner relative overflow-hidden">
                                <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} />
                                {status === 'testing' && progress > 10 && (
                                    <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 animate-pulse">
                                        <Activity className="w-3 h-3 text-blue-400" />
                                        <span className="text-[7px] font-black text-blue-400 tracking-[0.3em] uppercase">Sustaining...</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="bg-white/[0.01] p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Telemetry</span>
                                    <span className="text-xs font-black text-blue-500 animate-pulse italic uppercase">{status === 'testing' ? `${phase} Stage` : 'Standby'}</span>
                                </div>
                                <div className="bg-white/[0.01] p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Latency</span>
                                    <span className="text-2xl font-black text-white tabular-nums">{ping || '--'} <span className="text-[9px] opacity-20 italic font-medium">ms</span></span>
                                </div>
                            </div>

                            <button onClick={status === 'testing' ? null : startTest} className={`w-full py-6 rounded-3xl font-black text-xs tracking-[0.5em] uppercase transition-all flex items-center justify-center gap-4 ${status === 'testing' ? 'bg-slate-900 border border-white/5 text-slate-700' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40'}`}>
                                {status === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                                {status === 'testing' ? 'PROCESSING...' : 'INITIATE PROBE'}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col gap-6 animate-in fade-in zoom-in duration-700">
                            {/* Pro Result Header */}
                            <div className="text-center group">
                                <span className="text-[10px] font-black uppercase text-blue-500/50 tracking-[0.5em] mb-2 block animate-pulse italic italic">Analysis Verified</span>
                            </div>

                            {/* Side-by-Side Results (Pro Standard) */}
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="bg-gradient-to-br from-[#121a2e] to-black/40 p-6 rounded-[2.5rem] border border-blue-500/10 text-center relative overflow-hidden group hover:border-blue-500/30 transition-all">
                                    <div className="absolute top-2 right-2 opacity-5"><ArrowDown className="w-12 h-12 text-blue-500" /></div>
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Download</span>
                                    <div className="text-5xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-xl">{download.toFixed(0)}</div>
                                    <span className="text-[10px] font-black text-blue-500 italic mt-1 block">Mbps Truth</span>
                                </div>
                                <div className="bg-gradient-to-br from-[#20122e] to-black/40 p-6 rounded-[2.5rem] border border-purple-500/10 text-center relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                    <div className="absolute top-2 right-2 opacity-5"><ArrowUp className="w-12 h-12 text-purple-500" /></div>
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Upload</span>
                                    <div className="text-5xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-xl">{upload.toFixed(0)}</div>
                                    <span className="text-[10px] font-black text-purple-500 italic mt-1 block">Mbps Truth</span>
                                </div>
                            </div>

                            {/* Capability Matrix */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.01] rounded-3xl border border-white/5 opacity-50 transition-opacity hover:opacity-100">
                                    <MonitorPlay className="w-5 h-5 text-blue-400" />
                                    <span className="text-[7px] font-black uppercase tracking-tighter opacity-40">8K CINEMA</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.01] rounded-3xl border border-white/5 opacity-50 transition-opacity hover:opacity-100">
                                    <Gamepad2 className="w-5 h-5 text-purple-400" />
                                    <span className="text-[7px] font-black uppercase tracking-tighter opacity-40">PRO GAMING</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-white/[0.01] rounded-3xl border border-white/5 opacity-50 transition-opacity hover:opacity-100">
                                    <Video className="w-5 h-5 text-emerald-400" />
                                    <span className="text-[7px] font-black uppercase tracking-tighter opacity-40">4K MEET</span>
                                </div>
                            </div>

                            {/* Metadata Footer */}
                            <div className="flex justify-between items-center bg-black/40 px-8 py-5 rounded-[2rem] border border-white/5 text-[9px] font-black">
                                <div className="flex flex-col"><span className="opacity-20 uppercase tracking-widest">Ping</span><span className="text-blue-500 text-xs">{ping}ms</span></div>
                                <div className="flex flex-col border-l border-white/10 pl-6"><span className="opacity-20 uppercase tracking-widest">Status</span><span className="text-emerald-500 text-xs">Edge v25</span></div>
                                <div className="flex flex-col border-l border-white/10 pl-6 items-end truncate max-w-[120px]"><span className="opacity-20 uppercase tracking-widest">ISP</span><span className="text-white truncate">{isp}</span></div>
                            </div>

                            {/* Actions & History UI */}
                            <div className="flex gap-4">
                                <button onClick={startTest} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-white/10">
                                    <RefreshCw className="w-3.5 h-3.5" /> Re-Scan
                                </button>
                                <button className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xl group">
                                    <Share2 className="w-3.5 h-3.5" /> Share Card
                                </button>
                            </div>

                            {history.length > 0 && (
                                <div className="space-y-1 opacity-20 px-2 mt-2">
                                    {history.map((h, i) => (
                                        <div key={i} className="flex justify-between items-center text-[8px] font-bold border-b border-white/5 pb-1">
                                            <span>HISTORICAL NODE #{history.length - i}</span>
                                            <div className="flex gap-4">
                                                <span className="text-blue-500">↓ {h.down}</span>
                                                <span className="text-purple-500">↑ {h.up}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
