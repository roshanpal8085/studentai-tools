import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, RefreshCw, Share2, Globe, ShieldCheck, Gamepad2, MonitorPlay, Video, History } from 'lucide-react';

// True-Link Configuration
const PHASE_DURATION = 5000; // 5 seconds per test phase
const STREAM_COUNT = 3;       // Parallel streams for saturation

const Gauge = ({ value, phase }) => {
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 50) return -81 + ((v - 10) / 40) * 54;
        if (v <= 100) return -27 + ((v - 50) / 50) * 54;
        if (v <= 500) return 27 + ((v - 100) / 400) * 81;
        return 108 + Math.min(((v - 500) / 500) * 27, 27);
    };

    return (
        <div className="relative w-64 h-64 flex flex-col items-center justify-center pointer-events-none">
            {/* Minimal SVG Gauge */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="6" strokeDasharray="216 289" strokeLinecap="round" />
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
            
            {/* Dynamic Needle */}
            <div className="absolute w-[2px] h-[120px] bg-blue-500 origin-bottom transition-transform duration-300 ease-out z-20 rounded-full" style={{ transform: `rotate(${getAngle(value)}deg)`, bottom: '50%' }} />
            
            <div className="text-center z-10 pt-12">
                <div className="text-6xl font-black text-white tabular-nums tracking-tighter drop-shadow-2xl">
                    {value.toFixed(0)}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Mbps</div>
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
    const [isp, setIsp] = useState('Detecting ISP...');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sp_history_v21') || '[]'));

    const bytesReceived = useRef(0);
    const slidingWindow = useRef([]);

    useEffect(() => {
        localStorage.setItem('sp_history_v21', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const pings = [];
        for (let i = 0; i < 10; i++) {
            const start = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            pings.push(performance.now() - start);
            setProgress((i/10) * 10);
        }
        setPing(Math.min(...pings).toFixed(0));
        setJitter((Math.max(...pings) - Math.min(...pings)).toFixed(0));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        bytesReceived.current = 0;
        slidingWindow.current = [];
        const testStart = performance.now();
        
        const stream = async () => {
            while (performance.now() - testStart < PHASE_DURATION) {
                const res = await fetch(`/api/download-test?size=${1024*1024*8}&t=${Date.now() + Math.random()}`, { cache: 'no-store' });
                const reader = res.body.getReader();
                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    bytesReceived.current += value.length;
                    
                    const now = performance.now();
                    const elapsed = (now - testStart) / 1000;
                    
                    // Sliding Window (1s) for Needle Accuracy
                    slidingWindow.current.push({ t: now, bytes: bytesReceived.current });
                    const oneSecAgo = now - 1000;
                    slidingWindow.current = slidingWindow.current.filter(s => s.t > oneSecAgo);
                    
                    if (slidingWindow.current.length > 2) {
                        const first = slidingWindow.current[0];
                        const last = slidingWindow.current[slidingWindow.current.length - 1];
                        const bits = (last.bytes - first.bytes) * 8;
                        const time = (last.t - first.t) / 1000;
                        setDownload(Math.max(0, bits / (time * 1000000)));
                    }
                    setProgress(10 + (elapsed / 5) * 45);
                    if (now - testStart > PHASE_DURATION) break;
                }
            }
        };

        await Promise.all([stream(), stream()]);
        const finalElapsed = (performance.now() - testStart) / 1000;
        setDownload((bytesReceived.current * 8) / (finalElapsed * 1000000));
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        const testStart = performance.now();
        let totalUploaded = 0;
        const data = new Uint8Array(1024 * 1024 * 4); // 4MB

        while (performance.now() - testStart < PHASE_DURATION) {
            const startChunk = performance.now();
            await fetch(`/api/upload-test?t=${Date.now() + Math.random()}`, { method: 'POST', body: data });
            totalUploaded += data.length;
            const now = performance.now();
            const elapsed = (now - testStart) / 1000;
            setUpload((totalUploaded * 8) / (elapsed * 1000000));
            setProgress(55 + (elapsed / 5) * 45);
        }
        const finalElapsed = (performance.now() - testStart) / 1000;
        setUpload((totalUploaded * 8) / (finalElapsed * 1000000));
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
        <div className="min-h-screen bg-[#05070a] text-slate-100 flex items-center justify-center p-4 selection:bg-blue-500/20">
            <Helmet><title>SpeedPulse True-Link Accuracy Diagnostics</title></Helmet>

            <div className="w-full max-w-[440px] bg-[#0c0e18] border border-white/5 rounded-[3rem] p-1 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative flex flex-col group overflow-hidden">
                {/* Glowing Progress Border */}
                <div className="absolute inset-0 rounded-[3rem] border border-blue-500/10 pointer-events-none" />
                <div className="absolute top-0 left-0 h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />

                <div className="p-8 flex flex-col items-center">
                    {status !== 'finished' ? (
                        <div className="w-full flex flex-col items-center gap-8">
                            <div className="flex justify-between w-full opacity-30 text-[9px] font-black uppercase tracking-widest italic">
                                <span>Engine v21</span>
                                <span className="truncate max-w-[150px]">{isp}</span>
                            </div>

                            <div className="bg-black/30 rounded-[2.5rem] border border-white/5 p-4 shadow-inner relative">
                                <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} />
                                {status === 'testing' && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                        <Activity className="w-1/2 h-1/2 text-blue-500 animate-pulse" />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full h-[100px]">
                                <div className="bg-white/[0.01] p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Status</span>
                                    <span className="text-xs font-black text-blue-500 animate-pulse italic uppercase">{status === 'testing' ? `${phase} Mode` : 'Ready'}</span>
                                </div>
                                <div className="bg-white/[0.01] p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Latency</span>
                                    <span className="text-2xl font-black tabular-nums">{ping || '--'} <span className="text-[9px] opacity-20 italic">ms</span></span>
                                </div>
                            </div>

                            <button onClick={status === 'testing' ? null : startTest} className={`w-full py-6 rounded-3xl font-black text-xs tracking-[0.5em] uppercase transition-all flex items-center justify-center gap-3 ${status === 'testing' ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_20px_40px_rgba(59,130,246,0.3)]'}`}>
                                {status === 'testing' ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                                {status === 'testing' ? 'Testing...' : 'Initiate Test'}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Side-by-Side Results (Requested) */}
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="bg-black/40 p-6 rounded-[2.5rem] border border-blue-500/20 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10"><ArrowDown className="w-8 h-8 text-blue-500" /></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Download</span>
                                    <div className="text-5xl font-black text-white italic tabular-nums tracking-tighter">{download.toFixed(0)}</div>
                                    <span className="text-[10px] font-black text-blue-500 uppercase italic">Mbps</span>
                                </div>
                                <div className="bg-black/40 p-6 rounded-[2.5rem] border border-purple-500/20 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10"><ArrowUp className="w-8 h-8 text-purple-500" /></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Upload</span>
                                    <div className="text-5xl font-black text-white italic tabular-nums tracking-tighter">{upload.toFixed(0)}</div>
                                    <span className="text-[10px] font-black text-purple-500 uppercase italic">Mbps</span>
                                </div>
                            </div>

                            {/* Pro Capability Badges */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] rounded-2xl border border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                                    <MonitorPlay className="w-4 h-4 text-blue-400" />
                                    <span className="text-[8px] font-black uppercase">4K / 8K</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] rounded-2xl border border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                                    <Gamepad2 className="w-4 h-4 text-purple-400" />
                                    <span className="text-[8px] font-black uppercase">Gaming</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] rounded-2xl border border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                                    <Video className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[8px] font-black uppercase">Meeting</span>
                                </div>
                            </div>

                            {/* Detailed Telemetry Bar */}
                            <div className="flex justify-between items-center bg-black/40 px-6 py-4 rounded-3xl border border-white/5 text-[10px] font-black">
                                <div className="flex flex-col"><span className="opacity-20 uppercase">Ping</span><span className="text-blue-500">{ping}ms</span></div>
                                <div className="flex flex-col pl-4 border-l border-white/10"><span className="opacity-20 uppercase">Jitter</span><span className="text-purple-500">{jitter}ms</span></div>
                                <div className="flex flex-col items-end pl-4 border-l border-white/10 truncate"><span className="opacity-20 uppercase">Provider</span><span className="text-white truncate">{isp}</span></div>
                            </div>

                            {/* Actions & History */}
                            <div className="flex gap-3">
                                <button onClick={startTest} className="flex-1 py-5 bg-white/5 hover:bg-white/10 font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-white/10">
                                    <RefreshCw className="w-3.5 h-3.5" /> Retest
                                </button>
                                <button className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg">
                                    <Share2 className="w-3.5 h-3.5" /> Share
                                </button>
                            </div>

                            {history.length > 0 && (
                                <div className="space-y-1 opacity-40 hover:opacity-100 transition-opacity">
                                    {history.slice(0, 2).map((h, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5 text-[9px] font-bold">
                                            <span className="text-slate-500 italic">#{history.length - i} Run</span>
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
                    )}
                </div>
            </div>
        </div>
    );
}
