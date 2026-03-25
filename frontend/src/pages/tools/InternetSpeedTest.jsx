import { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, Share2, Copy, CheckCircle2, ShieldCheck, Globe, Cpu, Server } from 'lucide-react';

// Configuration
const DOWNLOAD_SIZE = 1024 * 1024 * 50; // 50MB
const MIN_TEST_DURATION = 6000;         // 6 seconds for plateau detection
const SAMPLE_RATE = 100;                // 100ms sample interval

const Sparkline = ({ data, color, active }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data, 10);
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ');
    
    return (
        <div className="absolute inset-x-0 bottom-0 h-12 opacity-30 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline fill="none" stroke={color} strokeWidth="2" points={points} className={active ? 'transition-all duration-300' : ''} />
            </svg>
        </div>
    );
};

const Gauge = ({ value, phase, isTesting }) => {
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 10) return -135 + (v / 10) * 54;
        if (v <= 50) return -81 + ((v - 10) / 40) * 54;
        if (v <= 100) return -27 + ((v - 50) / 50) * 54;
        if (v <= 500) return 27 + ((v - 100) / 400) * 81;
        return 108 + Math.min(((v - 500) / 500) * 27, 27);
    };
    const angle = getAngle(value);

    return (
        <div className="relative w-64 h-64 flex flex-col items-center justify-center">
            {/* Lidar Scan Effect */}
            <div className={`absolute inset-0 rounded-full border border-blue-500/10 ${isTesting ? 'animate-ping' : ''}`} />
            
            <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="8" strokeDasharray="216 289" strokeLinecap="round" />
                <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                    strokeWidth="8" 
                    strokeDasharray={`${(216 * (angle + 135)) / 270} 289`} 
                    strokeLinecap="round" 
                    className="transition-all duration-300 ease-out shadow-[0_0_20px_#3b82f6]" 
                />
            </svg>

            {/* Physics Needle */}
            <div className="absolute w-1 h-[120px] bg-gradient-to-t from-white via-blue-500 to-transparent origin-bottom transition-transform duration-300 ease-out z-20 rounded-full shadow-[0_0_15px_#3b82f6]" style={{ transform: `rotate(${angle}deg)`, bottom: '50%' }} />
            
            <div className="text-center z-10 pt-12">
                <div className="text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-2xl">
                    {value.toFixed(1)}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 italic shadow-lg">Mbps</div>
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
    const [graphData, setGraphData] = useState([]);
    const [isp, setIsp] = useState('Direct Fiber');
    const [progress, setProgress] = useState(0);

    const historyRef = useRef([]);

    useEffect(() => {
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => setIsp(d.org)).catch(() => {});
    }, []);

    const filterOutliers = (data) => {
        if (data.length < 10) return data[data.length - 1];
        const sorted = [...data].sort((a, b) => a - b);
        const l = Math.floor(sorted.length * 0.2);
        const h = Math.floor(sorted.length * 0.8);
        const filtered = sorted.slice(l, h);
        return filtered.reduce((a, b) => a + b) / filtered.length;
    };

    const runPing = async () => {
        setPhase('PING');
        const times = [];
        for (let i = 0; i < 10; i++) {
            const start = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            times.push(performance.now() - start);
            setProgress((i/10) * 10);
        }
        setPing(Math.min(...times).toFixed(1));
        setJitter((Math.max(...times) - Math.min(...times)).toFixed(1));
    };

    const runDownload = async () => {
        setPhase('DOWNLOAD');
        setGraphData([]);
        const start = performance.now();
        const response = await fetch(`/api/download-test?size=${DOWNLOAD_SIZE}&t=${Date.now()}`, { cache: 'no-store' });
        const reader = response.body.getReader();
        let received = 0;
        let samples = [];

        while(true) {
            const {done, value} = await reader.read();
            if (done) break;
            received += value.length;
            const now = performance.now();
            const elapsed = (now - start) / 1000;

            if (elapsed > 0.5) { // Skip TCP slow-start
                const mbps = (received * 8) / (elapsed * 1000000);
                samples.push(mbps);
                const filtered = filterOutliers(samples);
                setDownload(filtered);
                setGraphData(prev => [...prev.slice(-40), filtered]);
                setProgress(10 + Math.min((elapsed / 6) * 40, 40));
                
                // Adaptive Stop: If stable for 1.5s after 6s
                if (elapsed > 6 && samples.length > 30) {
                    const last10 = samples.slice(-10);
                    const variance = Math.max(...last10) - Math.min(...last10);
                    if (variance < 2) break; 
                }
            }
        }
    };

    const runUpload = async () => {
        setPhase('UPLOAD');
        setGraphData([]);
        const start = performance.now();
        const data = new Uint8Array(1024 * 1024 * 12); // 12MB
        await fetch(`/api/upload-test?t=${Date.now()}`, { method: 'POST', body: data });
        const elapsed = (performance.now() - start) / 1000;
        const finalMbps = (data.length * 8) / (elapsed * 1000000);
        setUpload(finalMbps);
        setProgress(100);
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setProgress(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
    };

    return (
        <div className="min-h-screen bg-[#04060b] text-slate-100 flex items-center justify-center p-4 selection:bg-blue-500/20">
            <Helmet><title>SpeedPulse v18 — Absolute Final Pro Diagnostics</title></Helmet>

            <div className="w-full max-w-[440px] bg-slate-900/40 backdrop-blur-[60px] rounded-[3rem] p-8 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] relative flex flex-col items-center gap-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
                    <div className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                {/* Header HUD */}
                <div className="flex justify-between w-full items-center">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black tracking-[0.4em] uppercase opacity-40">Direct Fiber Link</span>
                        <div className="flex items-center gap-2 mt-1">
                            <Server className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] font-black text-white">{isp}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                        <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
                        <span className="text-[9px] font-black text-blue-400 tracking-widest uppercase">Live Telemetry</span>
                    </div>
                </div>

                {/* Cyber-Pro Gauge */}
                <div className="relative w-full aspect-square flex flex-col items-center justify-center bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner overflow-hidden">
                    <Sparkline data={graphData} color={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} active={status === 'testing'} />
                    <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={status === 'testing'} />
                    
                    <div className="absolute top-8 right-8 flex flex-col items-end opacity-40">
                        <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Protocol</div>
                        <div className="text-[10px] font-black text-white italic tracking-tighter">STREAM_v18</div>
                    </div>
                </div>

                {/* Stats Matrix */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-slate-950/60 p-5 rounded-[2rem] border border-white/5 flex flex-col justify-between group hover:border-blue-500/20 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-xl"><ArrowDown className="w-3.5 h-3.5 text-blue-500" /></div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Down</span>
                        </div>
                        <div className="text-3xl font-black text-white tabular-nums">{download > 0 ? download.toFixed(1) : '--'} <span className="text-[8px] opacity-20 italic font-medium">Mbps</span></div>
                    </div>
                    <div className="bg-slate-950/60 p-5 rounded-[2rem] border border-white/5 flex flex-col justify-between group hover:border-purple-500/20 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-xl"><ArrowUp className="w-3.5 h-3.5 text-purple-500" /></div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Up</span>
                        </div>
                        <div className="text-3xl font-black text-white tabular-nums">{upload > 0 ? upload.toFixed(1) : '--'} <span className="text-[8px] opacity-20 italic font-medium">Mbps</span></div>
                    </div>
                </div>

                {/* Latency HUD */}
                <div className="w-full grid grid-cols-3 bg-black/40 rounded-3xl border border-white/5 p-4 divide-x divide-white/5">
                    <div className="text-center px-2">
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-0.5">Latency</div>
                        <div className="text-lg font-black text-blue-400">{ping || '--'}<span className="text-[8px] opacity-20 ml-1 italic">ms</span></div>
                    </div>
                    <div className="text-center px-2">
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-0.5">Jitter</div>
                        <div className="text-lg font-black text-purple-400">{jitter || '--'}<span className="text-[8px] opacity-20 ml-1 italic">ms</span></div>
                    </div>
                    <div className="text-center px-2 flex flex-col items-center justify-center">
                        <Globe className="w-3.5 h-3.5 text-slate-600 mb-0.5" />
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter opacity-70">Region 01</span>
                    </div>
                </div>

                {/* Action Trigger */}
                <div className="w-full pt-2">
                    {status === 'idle' || status === 'finished' ? (
                        <button onClick={startTest} className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black rounded-3xl text-sm tracking-[0.4em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase italic">
                            {status === 'finished' ? 'Analyze Again' : 'Initiate Test'}
                        </button>
                    ) : (
                        <div className="w-full py-5 bg-slate-900 border border-blue-500/20 rounded-3xl flex items-center justify-center gap-4">
                            <div className="flex gap-1.5">
                                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
                            </div>
                            <span className="text-[10px] font-black text-blue-400 tracking-[0.4em] uppercase italic">Sampling {phase}...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
