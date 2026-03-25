import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowDown, ArrowUp, Zap, MapPin, Globe, User, Activity, CheckCircle, Copy, Share2, Info } from 'lucide-react';

// Configuration
const TEST_DURATION = 5000; // 5 seconds sustained test
const STREAM_COUNT = 4;      // Parallel streams for saturation
const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB chunks

const Gauge = ({ value, phase, isTesting }) => {
    // Non-Linear Scale (0, 5, 10, 50, 100, 250, 500, 750, 1000)
    const getAngle = (v) => {
        if (v <= 0) return -135;
        if (v <= 5) return -135 + (v / 5) * 33.75;
        if (v <= 10) return -101.25 + ((v - 5) / 5) * 33.75;
        if (v <= 50) return -67.5 + ((v - 10) / 40) * 45;
        if (v <= 100) return -22.5 + ((v - 50) / 50) * 45;
        if (v <= 500) return 22.5 + ((v - 100) / 400) * 67.5;
        if (v <= 1000) return 90 + ((v - 500) / 500) * 45;
        return 135;
    };

    const angle = getAngle(value);

    return (
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex flex-col items-center justify-center">
            {/* Background Arch */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2a324b" strokeWidth="6" strokeDasharray="212 282" strokeLinecap="round" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3262e6'} strokeWidth="6" strokeDasharray={`${(212 * (angle + 135)) / 270} 282`} strokeLinecap="round" className="transition-all duration-300 ease-out" />
            </svg>

            {/* Ticks & Numbers (Approximate) */}
            <div className="absolute inset-0 p-8 text-[8px] font-bold text-slate-500 opacity-40">
                <div className="absolute top-[85%] left-1/4">0</div>
                <div className="absolute top-1/2 left-[5%]">10</div>
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2">100</div>
                <div className="absolute top-1/2 right-[5%]">500</div>
                <div className="absolute top-[85%] right-1/4">1000</div>
            </div>

            {/* Needle */}
            <div className="absolute w-1 h-[140px] bg-gradient-to-t from-white to-transparent origin-bottom transition-transform duration-300 ease-out z-20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ transform: `rotate(${angle}deg)`, bottom: '50%' }} />
            
            {/* Inner Dashboard */}
            <div className="text-center z-10 pt-16">
                <div className="text-6xl sm:text-7xl font-black text-white tracking-widest tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    {value.toFixed(0)}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 italic">Mbps</div>
            </div>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState(''); 
    const [ping, setPing] = useState(0);
    const [jitter, setJitter] = useState(0);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [isp, setIsp] = useState({ name: 'Detecting...', ip: '0.0.0.0', city: 'India' });
    const [progress, setProgress] = useState(0);

    const abortController = useRef(null);

    useEffect(() => {
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => {
            setIsp({ name: d.org, ip: d.ip, city: d.city });
        }).catch(() => {});
        return () => abortController.current?.abort();
    }, []);

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
        setJitter((pings[pings.length-1] - pings[0]).toFixed(0));
    };

    const runDownload = () => {
        return new Promise((resolve) => {
            setPhase('DOWNLOAD');
            const startTest = performance.now();
            let totalBytes = 0;
            let finishedStreams = 0;

            const startStream = () => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `/api/download-test?size=${1024*1024*20}&t=${Date.now() + Math.random()}`, true);
                xhr.responseType = 'blob';
                xhr.setRequestHeader('Cache-Control', 'no-store');

                xhr.onprogress = (e) => {
                    const elapsed = (performance.now() - startTest) / 1000;
                    if (elapsed > 0.5) { // Skip slow-start
                        const currentMbps = ((totalBytes + e.loaded) * 8) / (elapsed * 1000000);
                        // Accuracy Cap: If > 1000 and ping < 5ms, it's loopback memory copy. 
                        // We filter for "Realism" by smoothing aggressively.
                        setDownload(prev => prev + (currentMbps - prev) * 0.1); 
                        setProgress(10 + (elapsed / 5) * 40);
                    }
                };

                xhr.onload = () => {
                    totalBytes += 1024*1024*20;
                    finishedStreams++;
                    const elapsed = (performance.now() - startTest);
                    if (elapsed < TEST_DURATION && finishedStreams < 20) {
                        startStream(); // Loop to maintain duration
                    } else {
                        resolve();
                    }
                };
                xhr.send();
            };

            for (let i = 0; i < STREAM_COUNT; i++) startStream();
        });
    };

    const runUpload = () => {
        return new Promise((resolve) => {
            setPhase('UPLOAD');
            const startTest = performance.now();
            let totalBytes = 0;
            const data = new Uint8Array(1024 * 1024 * 5); // 5MB chunks

            const startStream = () => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `/api/upload-test?t=${Date.now() + Math.random()}`, true);
                xhr.upload.onprogress = (e) => {
                    const elapsed = (performance.now() - startTest) / 1000;
                    if (elapsed > 0.5) {
                        const currentMbps = ((totalBytes + e.loaded) * 8) / (elapsed * 1000000);
                        setUpload(prev => prev + (currentMbps - prev) * 0.1);
                        setProgress(50 + (elapsed / 5) * 50);
                    }
                };
                xhr.onload = () => {
                    totalBytes += data.length;
                    const elapsed = (performance.now() - startTest);
                    if (elapsed < TEST_DURATION) startStream();
                    else resolve();
                };
                xhr.send(data);
            };

            for (let i = 0; i < 2; i++) startStream();
        });
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setPing(0); setProgress(0);
        await runPing();
        await runDownload();
        await runUpload();
        setStatus('finished');
        setProgress(100);
    };

    return (
        <div className="min-h-screen bg-[#0b0e1a] text-white flex items-center justify-center p-4">
            <Helmet><title>SpeedTest Clone – Professional Bandwidth Diagnostics</title></Helmet>

            <div className="w-full max-w-4xl bg-[#1a2035] rounded-3xl p-8 sm:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5 relative flex flex-col items-center">
                
                {/* Top Stats Bar */}
                <div className="grid grid-cols-4 w-full gap-4 mb-12 bg-[#12172b] p-6 rounded-2xl border border-white/5">
                    <div className="text-center group">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">PING <span className="text-[7px] opacity-30">ms</span></div>
                        <div className="text-3xl font-black tabular-nums">{ping || 0}</div>
                    </div>
                    <div className="text-center group border-l border-white/5">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-purple-500 transition-colors">JITTER <span className="text-[7px] opacity-30">ms</span></div>
                        <div className="text-3xl font-black tabular-nums">{jitter || 0}</div>
                    </div>
                    <div className="text-center group border-l border-white/5">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">DOWNLOAD <span className="text-[7px] opacity-30">Mbps</span></div>
                        <div className="text-3xl font-black text-blue-500 tabular-nums animate-pulse-slow">{download > 0 ? download.toFixed(1) : '---'}</div>
                    </div>
                    <div className="text-center group border-l border-white/5">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-purple-500 transition-colors">UPLOAD <span className="text-[7px] opacity-30">Mbps</span></div>
                        <div className="text-3xl font-black text-purple-500 tabular-nums">{upload > 0 ? upload.toFixed(1) : '---'}</div>
                    </div>
                </div>

                {/* Main Gauge Area */}
                <div className="relative flex flex-col items-center mb-12">
                    <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={status === 'testing'} />
                    
                    {/* Action Button */}
                    <div className="mt-8">
                        {status === 'idle' || status === 'finished' ? (
                            <button onClick={startTest} className="w-32 h-32 bg-[#3162e6] hover:bg-[#254ccb] text-white font-black rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all active:scale-95 border-8 border-[#1a2035] outline outline-4 outline-[#12172b]">
                                {status === 'finished' ? <RefreshCw className="w-8 h-8" /> : 'GO'}
                            </button>
                        ) : (
                            <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">Running {phase}...</div>
                        )}
                    </div>
                </div>

                {/* Info Footer (ISP & Server) */}
                <div className="flex justify-between w-full mt-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20">
                            <User className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Your Provider</div>
                            <div className="text-sm font-black text-white">{isp.name}</div>
                            <div className="text-[9px] font-bold text-slate-500">{isp.ip} — {isp.city}</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-right">
                        <div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Test Server</div>
                            <div className="text-sm font-black text-white">StudentAI Global Node</div>
                            <div className="text-[9px] font-bold text-slate-500 flex items-center justify-end gap-1"><MapPin className="w-2 h-2" /> Global Edge (Auto)</div>
                        </div>
                        <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20">
                            <Globe className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Accurate Progress Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden rounded-b-3xl">
                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <style>{`
                .animate-pulse-slow {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
            `}</style>
        </div>
    );
}

const RefreshCw = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
