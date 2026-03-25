import { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, RefreshCw, Share2, Copy, CheckCircle2, ShieldCheck, Globe, Cpu, Server, History, Wifi, MonitorPlay, Gamepad2, Video } from 'lucide-react';

const TEST_DURATION = 8000; // 8 seconds sustained test
const CHUNK_SIZE = 1024 * 1024 * 4; // 4MB

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
            <div className="absolute w-[2px] h-[130px] bg-blue-500 origin-bottom transition-transform duration-300 ease-out z-20 rounded-full" style={{ transform: `rotate(${getAngle(value)}deg)`, bottom: '50%' }} />
            <div className="text-center z-10 pt-12">
                <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
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
    const [isp, setIsp] = useState('Detecting ISP...');
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sp_history_v20') || '[]'));
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        localStorage.setItem('sp_history_v20', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, [history]);

    const getRating = (d) => {
        if (d > 500) return { label: 'Legendary', color: 'text-yellow-400' };
        if (d > 100) return { label: 'Elite Fiber', color: 'text-blue-400' };
        if (d > 30) return { label: 'Pro Standard', color: 'text-emerald-400' };
        return { label: 'Entry Level', color: 'text-slate-400' };
    };

    const runPing = async () => {
        setPhase('PING');
        const pings = [];
        for (let i = 0; i < 8; i++) {
            const start = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            pings.push(performance.now() - start);
            setProgress((i/8) * 10);
        }
        setPing(Math.min(...pings).toFixed(0));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        const start = performance.now();
        const samples = [];
        let totalBytes = 0;

        while(performance.now() - start < TEST_DURATION) {
            const batchStart = performance.now();
            const res = await fetch(`/api/download-test?size=${CHUNK_SIZE}&t=${Date.now()}`, { cache: 'no-store' });
            await res.blob();
            const batchElapsed = (performance.now() - batchStart) / 1000;
            totalBytes += CHUNK_SIZE;
            
            const currentMbps = (CHUNK_SIZE * 8) / (batchElapsed * 1000000);
            samples.push(currentMbps);
            
            // Outlier Filtering: Last 5 median
            const recent = [...samples].slice(-5).sort((a,b)=>a-b);
            setDownload(recent[Math.floor(recent.length/2)]);
            setProgress(10 + ((performance.now()-start)/TEST_DURATION) * 45);
        }
        const finalSorted = [...samples].sort((a,b)=>a-b);
        setDownload(finalSorted[Math.floor(finalSorted.length/2)]);
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        const start = performance.now();
        const samples = [];
        const data = new Uint8Array(CHUNK_SIZE);

        while(performance.now() - start < (TEST_DURATION/2)) {
            const batchStart = performance.now();
            await fetch(`/api/upload-test?t=${Date.now()}`, { method: 'POST', body: data });
            const batchElapsed = (performance.now() - batchStart) / 1000;
            samples.push((CHUNK_SIZE * 8) / (batchElapsed * 1000000));
            setUpload(samples[samples.length-1]);
            setProgress(55 + ((performance.now()-start)/(TEST_DURATION/2)) * 45);
        }
        const finalSorted = [...samples].sort((a,b)=>a-b);
        setUpload(finalSorted[Math.floor(finalSorted.length/2)]);
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setProgress(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setHistory(h => [{ down: download.toFixed(1), up: upload.toFixed(1), ping, date: new Date().toLocaleTimeString() }, ...h].slice(0, 5));
    };

    const copyResult = () => {
        const text = `SpeedTest Results: ↓${download.toFixed(1)} Mbps | ↑${upload.toFixed(1)} Mbps | ⌛${ping}ms\nTested via StudentAI SpeedPulse`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#070912] text-slate-100 flex items-center justify-center p-4">
            <Helmet><title>SpeedPulse Engagement — Pro Results HUD</title></Helmet>

            <div className="w-full max-w-[420px] bg-[#121626] border border-white/5 rounded-[3rem] p-8 relative flex flex-col shadow-2xl overflow-hidden group">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <div className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                {status !== 'finished' ? (
                    <div className="flex flex-col items-center gap-8">
                        {/* Gauge Interface */}
                        <div className="flex justify-between w-full opacity-40 text-[9px] font-black tracking-widest uppercase">
                            <div className="flex items-center gap-2"><Globe className="w-3 h-3" /> Node v20</div>
                            <div className="flex items-center gap-2 font-black italic">{isp}</div>
                        </div>

                        <div className="relative p-6 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner">
                            <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} />
                            {status === 'testing' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                    <Activity className="w-1/2 h-1/2 text-blue-500 animate-pulse" />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="text-center p-5 bg-black/20 rounded-3xl border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Ping</span>
                                <span className="text-2xl font-black tabular-nums">{ping || '--'} <span className="text-[9px] opacity-20 italic">ms</span></span>
                            </div>
                            <div className="text-center p-5 bg-black/20 rounded-3xl border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Status</span>
                                <span className="text-[10px] uppercase font-black text-blue-500 animate-pulse italic">{status === 'testing' ? `${phase} Active` : 'Engine Idle'}</span>
                            </div>
                        </div>

                        <button onClick={status === 'testing' ? null : startTest} className={`w-full py-6 rounded-3xl font-black tracking-[0.4em] transition-all flex items-center justify-center gap-3 active:scale-95 ${status === 'testing' ? 'bg-slate-800 text-slate-500' : 'bg-[#3b82f6] hover:bg-blue-600 text-white shadow-lg'}`}>
                            {status === 'testing' ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                            {status === 'testing' ? 'RUNNING...' : 'BEGIN TEST'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 animate-in fade-in zoom-in duration-500">
                        {/* Result View */}
                        <div className="text-center">
                            <div className={`text-[11px] font-black uppercase tracking-[0.5em] mb-2 ${getRating(download).color}`}>Success: {getRating(download).label}</div>
                            <div className="text-6xl font-black text-white italic tabular-nums tracking-tighter mb-1">{download.toFixed(1)}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sustained Mbps Down</div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                                <MonitorPlay className="w-4 h-4 text-blue-400" />
                                <span className="text-[8px] font-black opacity-40">8K Video</span>
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            </div>
                            <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                                <Gamepad2 className="w-4 h-4 text-purple-400" />
                                <span className="text-[8px] font-black opacity-40">Pro Gaming</span>
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            </div>
                            <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                                <Video className="w-4 h-4 text-emerald-400" />
                                <span className="text-[8px] font-black opacity-40">HD Calls</span>
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            </div>
                        </div>

                        <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold opacity-40">Upload Speed</span>
                                <span className="font-black text-purple-400">{upload.toFixed(1)} Mbps</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold opacity-40">Latency (Ping)</span>
                                <span className="font-black text-blue-400">{ping} ms</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={startTest} className="flex-1 py-5 bg-[#3b82f6] hover:bg-blue-600 font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2">
                                <RefreshCw className="w-3.5 h-3.5" /> Retest
                            </button>
                            <button onClick={copyResult} className="flex-1 py-5 bg-white/5 hover:bg-white/10 font-black rounded-3xl text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2">
                                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                                {copied ? 'Copied' : 'Share'}
                            </button>
                        </div>

                        {history.length > 0 && (
                            <div className="mt-2 space-y-2">
                                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Past Sessions</div>
                                {history.slice(0, 2).map((h, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5 text-[10px]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="font-black text-white">{h.down}</span>
                                        </div>
                                        <span className="opacity-20 font-bold italic">{h.date}</span>
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
