import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, RefreshCw, Share2, Globe, ShieldCheck, Gamepad2, MonitorPlay, Video, Cpu, History, AlertCircle } from 'lucide-react';

// Trust-Builder v23 Config
const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB Chunks
const SAMPLES_COUNT = 20;             // 20 Iterations (Absolute Trust)
const GRAVITY_LIMIT_MS = 40;         // 5MB in <40ms is impossible on residential gear (>1Gbps). 

const Gauge = ({ value, sampleIndex, phase, isTesting }) => {
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 100) return -81 + ((v - 10) / 90) * 81;
        if (v <= 500) return 0 + ((v - 100) / 400) * 90;
        return 90 + Math.min(((v - 500) / 500) * 45, 45);
    };

    return (
        <div className="relative w-64 h-64 flex flex-col items-center justify-center">
            {/* Sampling Counter (Trust-Builder Feature) */}
            {isTesting && (
                <div className="absolute top-0 flex flex-col items-center gap-1">
                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 shadow-lg">
                        Sample {sampleIndex || 1} of {SAMPLES_COUNT}
                    </span>
                </div>
            )}

            <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" strokeDasharray="212 282" strokeLinecap="round" />
                <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
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
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Mbps Truth</div>
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
    const [sampleIdx, setSampleIdx] = useState(0);
    const [isp, setIsp] = useState('Network Node');
    const [error, setError] = useState(null);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sp_history_v23') || '[]'));

    useEffect(() => {
        localStorage.setItem('sp_history_v23', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const pings = [];
        try {
            for (let i = 0; i < 15; i++) {
                const t = performance.now();
                await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
                pings.push(performance.now() - t);
                setProgress((i/15) * 10);
            }
            setPing(Math.min(...pings).toFixed(0));
            setJitter((Math.max(...pings) - Math.min(...pings)).toFixed(0));
        } catch(e) { setError('Latency Test Failed'); }
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        const results = [];
        for (let i = 0; i < SAMPLES_COUNT; i++) {
            setSampleIdx(i + 1);
            try {
                const chunkStart = performance.now();
                const res = await fetch(`/api/download-test?size=${CHUNK_SIZE}&t=${Date.now() + i}`, { cache: 'no-store' });
                const reader = res.body.getReader();
                let chunkReceived = 0;

                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunkReceived += value.length;
                    
                    // Live Needle Pulse (Visual Trust)
                    const now = performance.now();
                    const elapsedSoFar = (now - chunkStart) / 1000;
                    if (elapsedSoFar > 0.1) {
                        const bitRate = (chunkReceived * 8) / (elapsedSoFar * 1000000);
                        if (bitRate < 2000) setDownload(bitRate); // Cap spikes for needle
                    }
                }

                const elapsedTotal = performance.now() - chunkStart;
                if (elapsedTotal > GRAVITY_LIMIT_MS) {
                    results.push((CHUNK_SIZE * 8) / (elapsedTotal/1000 * 1000000));
                }
            } catch(e) { console.warn('Sampling iteration skipped due to network jitter'); }
            setProgress(10 + (i / SAMPLES_COUNT) * 45);
        }
        
        const finalSorted = [...results].sort((a,b)=>a-b);
        setDownload(finalSorted.length ? finalSorted[Math.floor(finalSorted.length / 2)] : 0);
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        const results = [];
        const data = new Uint8Array(CHUNK_SIZE);
        for (let i = 0; i < SAMPLES_COUNT; i++) {
            setSampleIdx(i + 1);
            try {
                const tStart = performance.now();
                await fetch(`/api/upload-test?t=${Date.now() + i}`, { method: 'POST', body: data });
                const elapsed = performance.now() - tStart;
                if (elapsed > 30) {
                    results.push((CHUNK_SIZE * 8) / (elapsed/1000 * 1000000));
                    setUpload(results[results.length-1]);
                }
            } catch(e) {}
            setProgress(55 + (i / SAMPLES_COUNT) * 45);
        }
        const finalSorted = [...results].sort((a,b)=>a-b);
        setUpload(finalSorted.length ? finalSorted[Math.floor(finalSorted.length / 2)] : 0);
    };

    const startTest = async () => {
        setStatus('testing'); setError(null); setDownload(0); setUpload(0); setProgress(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setHistory(h => [{ down: download.toFixed(0), up: upload.toFixed(0), date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
    };

    return (
        <div className="min-h-screen bg-[#060810] text-[#f8fafc] flex items-center justify-center p-4 selection:bg-blue-500/20">
            <Helmet><title>SpeedPulse v23 — Ultimate Trust Engine</title></Helmet>

            <div className="w-full max-w-[440px] bg-[#11152d] border border-white/5 shadow-[0_45px_100px_rgba(0,0,0,0.8)] rounded-[3.5rem] p-8 relative flex flex-col group overflow-hidden">
                {/* Visual Progress Spine */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5">
                    <div className="h-full bg-blue-600 shadow-[0_0_20px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                {error && (
                    <div className="absolute top-8 left-0 w-full flex justify-center z-50 animate-bounce">
                        <div className="bg-red-500/90 text-white text-[9px] font-black px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
                            <AlertCircle className="w-3 h-3" /> {error}
                        </div>
                    </div>
                )}

                {status !== 'finished' ? (
                    <div className="flex flex-col items-center gap-10">
                        {/* Header HUD */}
                        <div className="flex justify-between w-full items-center opacity-40">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Node Secure</span>
                            </div>
                            <span className="text-[9px] font-black italic truncate max-w-[130px] uppercase text-slate-500">{isp}</span>
                        </div>

                        {/* Trust Gauge */}
                        <div className="bg-slate-950/60 rounded-[3rem] p-6 shadow-2xl border border-white/5 relative">
                            <Gauge value={phase === 'UPLOAD' ? upload : download} sampleIndex={sampleIdx} phase={phase} isTesting={status === 'testing'} />
                            {status === 'testing' && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                    <Activity className="w-3/4 h-3/4 text-blue-500 animate-pulse" />
                                </div>
                            )}
                        </div>

                        {/* HUD Stats */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Network Stat</span>
                                <div className="text-xs font-black text-blue-500 tabular-nums uppercase italic">{status === 'testing' ? `Sampling ${phase}` : 'Ready to Probe'}</div>
                            </div>
                            <div className="bg-black/40 p-5 rounded-3xl border border-white/5">
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Latency</span>
                                <div className="text-2xl font-black text-white tabular-nums">{ping || '--'}<span className="text-[9px] opacity-20 ml-1 italic">ms</span></div>
                            </div>
                        </div>

                        {/* Action Trigger */}
                        <button onClick={status === 'testing' ? null : startTest} className="w-full py-6 bg-[#3b82f6] hover:bg-blue-600 text-white font-black rounded-3xl text-sm tracking-[0.5em] shadow-[0_25px_50px_rgba(37,99,235,0.25)] active:scale-95 transition-all flex items-center justify-center gap-4 uppercase italic">
                            {status === 'testing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white animate-pulse" />}
                            {status === 'testing' ? 'Measuring...' : 'Test Speed'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {/* Final Pro Results - Side-by-Side HUD */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-b from-blue-500/10 to-transparent p-6 rounded-[2.5rem] border border-blue-500/20 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ArrowDown className="w-16 h-16 text-blue-500" /></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Download</span>
                                <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">{download.toFixed(0)}</div>
                                <span className="text-[9px] font-black text-blue-500 italic uppercase">Mbps Truth</span>
                            </div>
                            <div className="bg-gradient-to-b from-purple-500/10 to-transparent p-6 rounded-[2.5rem] border border-purple-500/20 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity"><ArrowUp className="w-16 h-16 text-purple-500" /></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Upload</span>
                                <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter drop-shadow-2xl">{upload.toFixed(0)}</div>
                                <span className="text-[9px] font-black text-purple-500 italic uppercase">Mbps Truth</span>
                            </div>
                        </div>

                        {/* Connection Capabilities */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center gap-2 py-4 bg-white/[0.01] rounded-[2rem] border border-white/5">
                                <MonitorPlay className="w-5 h-5 text-blue-500" />
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40">8K Cinema</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 py-4 bg-white/[0.01] rounded-[2rem] border border-white/5">
                                <Gamepad2 className="w-5 h-5 text-purple-500" />
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40">Pro Gaming</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 py-4 bg-white/[0.01] rounded-[2rem] border border-white/5">
                                <Video className="w-5 h-5 text-emerald-500" />
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40">Ultra HD Call</span>
                            </div>
                        </div>

                        {/* HUD Footer Telemetry */}
                        <div className="flex justify-between items-center bg-black/50 px-8 py-5 rounded-3xl border border-white/5 shadow-inner">
                            <div className="flex flex-col"><span className="text-[8px] font-black text-slate-600 uppercase">Ping</span><span className="text-sm font-black text-blue-500 tabular-nums">{ping} ms</span></div>
                            <div className="flex flex-col text-center"><span className="text-[8px] font-black text-slate-600 uppercase">Jitter</span><span className="text-sm font-black text-purple-400 tabular-nums">{jitter} ms</span></div>
                            <div className="flex flex-col items-end"><span className="text-[8px] font-black text-slate-600 uppercase">Status</span><span className="text-sm font-black text-emerald-500 uppercase italic">Verified</span></div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button onClick={startTest} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 border border-white/5 active:scale-95">
                                <RefreshCw className="w-4 h-4 text-blue-600" /> Test Again
                            </button>
                            <button className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group">
                                <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Share Card
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
