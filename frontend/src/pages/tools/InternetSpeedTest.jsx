import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wifi, Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, AlertCircle, Share2, Copy, CheckCircle2, Globe, Cpu, User, MapPin } from 'lucide-react';

// Configuration
const DOWNLOAD_SIZE = 1024 * 1024 * 15; // 15MB per stream
const UPLOAD_SIZE = 1024 * 1024 * 5;    // 5MB per stream
const PARALLEL_STREAMS = 4;            // Speedtest.net uses "Multi" connections

// Non-Linear Scale Mapping (Matches Speedtest.net)
const getGaugeAngle = (mbps) => {
    if (mbps <= 0) return -135;
    if (mbps <= 5) return -135 + (mbps / 5) * 27; // 0-5
    if (mbps <= 10) return -108 + ((mbps - 5) / 5) * 27; // 5-10
    if (mbps <= 50) return -81 + ((mbps - 10) / 40) * 54; // 10-50 (Median)
    if (mbps <= 100) return -27 + ((mbps - 50) / 50) * 54; // 50-100
    if (mbps <= 500) return 27 + ((mbps - 100) / 400) * 81; // 100-500
    return 108 + Math.min(((mbps - 500) / 500) * 27, 27); // 500-1000
};

const Gauge = ({ value, phase, isTesting }) => {
    const angle = getGaugeAngle(value);
    const strokeDasharray = 188.5; // 2 * PI * 30 (approx for r=30)
    // Map angle to dash offset for the 270 degree arc
    const percentage = (angle + 135) / 270;
    const dashOffset = strokeDasharray - (strokeDasharray * percentage * 0.75); // 0.75 for 270/360

    return (
        <div className="relative flex flex-col items-center">
            <div className={`absolute inset-0 blur-[120px] rounded-full opacity-20 duration-1000 ${isTesting ? 'animate-pulse' : ''}`} style={{ backgroundColor: phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6' }} />
            
            <div className="relative w-80 h-80 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-[225deg]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="188.5" strokeDashoffset="47.1" className="text-slate-800/50" strokeLinecap="round" />
                    <circle 
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                        strokeWidth="7" 
                        strokeDasharray="188.5" 
                        strokeDashoffset={188.5 - (188.5 * percentage * 0.75)} 
                        className="transition-all duration-300 ease-out"
                        strokeLinecap="round" 
                    />
                    
                    {/* Ticks */}
                    {[0, 5, 10, 50, 100, 250, 500, 750, 1000].map(tick => {
                        const a = getGaugeAngle(tick);
                        const r = 32;
                        const x = 50 + r * Math.cos((a - 90) * (Math.PI / 180));
                        const y = 50 + r * Math.sin((a - 90) * (Math.PI / 180));
                        return (
                            <text key={tick} x={x} y={y} fill="currentColor" fontSize="3" className="text-slate-500 font-bold" textAnchor="middle" transform={`rotate(${a + 225} ${x} ${y})`}>
                                {tick}
                            </text>
                        );
                    })}
                </svg>

                {/* Needle */}
                <div 
                    className="absolute w-1.5 h-36 bg-gradient-to-t from-white via-blue-400 to-transparent origin-bottom transition-transform duration-300 ease-out rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                    style={{ transform: `rotate(${angle}deg)`, bottom: '50%' }}
                />

                {/* Digital Display */}
                <div className="text-center z-10 pt-16">
                    <div className="text-7xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg">
                        {value > 0 && value < 10 ? value.toFixed(2) : Math.round(value)}
                    </div>
                    {isTesting && (
                        <div className="flex flex-col items-center mt-2">
                             <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">{phase === 'UPLOAD' ? '↑' : '↓'} Mbps</div>
                             <div className="w-12 h-0.5 bg-blue-500/20 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-blue-500 animate-[progress_2s_infinite]" style={{ width: '40%' }} />
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); // idle, testing, finished, error
    const [phase, setPhase] = useState(''); // PING, DOWNLOAD, UPLOAD
    const [progress, setProgress] = useState(0);
    const [ipInfo, setIpInfo] = useState({ ip: 'Detecting...', isp: 'Airtel', city: 'Bhopal' });
    const [ping, setPing] = useState(null);
    const [jitter, setJitter] = useState(null);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('st_history_v8') || '[]'));
    const [copied, setCopied] = useState(false);

    const abortControllers = useRef([]);

    useEffect(() => {
        // Simple IP detection
        fetch('https://ipapi.co/json/').then(r => r.json()).then(data => {
            setIpInfo({ ip: data.ip, isp: data.org, city: data.city });
        }).catch(() => {});
    }, []);

    const runPing = async () => {
        setPhase('PING');
        const samples = [];
        for (let i = 0; i < 8; i++) {
            const start = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            samples.push(performance.now() - start);
        }
        setPing(Math.round(samples.reduce((a, b) => a + b) / samples.length));
        setJitter(Math.round(Math.max(...samples) - Math.min(...samples)));
    };

    const runMultiStreamTest = (type) => {
        return new Promise((resolve, reject) => {
            setPhase(type);
            const testStart = performance.now();
            const streams = [];
            const loadedPerStream = new Array(PARALLEL_STREAMS).fill(0);
            
            for (let i = 0; i < PARALLEL_STREAMS; i++) {
                const xhr = new XMLHttpRequest();
                const controller = new AbortController();
                abortControllers.current.push({ xhr, controller });
                
                if (type === 'DOWNLOAD') {
                    xhr.open('GET', `/api/download-test?size=${DOWNLOAD_SIZE}&t=${Date.now() + i}`, true);
                    xhr.responseType = 'blob';
                } else {
                    xhr.open('POST', `/api/upload-test?t=${Date.now() + i}`, true);
                }

                xhr.onprogress = (e) => {
                    loadedPerStream[i] = e.loaded;
                    const totalLoaded = loadedPerStream.reduce((a, b) => a + b, 0);
                    const elapsed = (performance.now() - testStart) / 1000;
                    if (elapsed > 0.1) {
                        const mbps = (totalLoaded * 8) / (elapsed * 1000000);
                        if (type === 'DOWNLOAD') setDownload(mbps);
                        else setUpload(mbps);
                        setProgress(type === 'DOWNLOAD' ? 10 + (totalLoaded / (DOWNLOAD_SIZE * PARALLEL_STREAMS)) * 40 : 60 + (totalLoaded / (UPLOAD_SIZE * PARALLEL_STREAMS)) * 40);
                    }
                };

                if (type === 'UPLOAD') xhr.upload.onprogress = xhr.onprogress;

                xhr.onload = () => {
                    streams.push(true);
                    if (streams.length === PARALLEL_STREAMS) resolve();
                };
                xhr.onerror = () => reject(`${type} Stream Failed`);
                
                if (type === 'DOWNLOAD') xhr.send();
                else xhr.send(new Uint8Array(UPLOAD_SIZE));
            }
        });
    };

    const startTest = async () => {
        setStatus('testing'); setProgress(0); setDownload(0); setUpload(0); setPing(null); setJitter(null);
        try {
            await runPing();
            await runMultiStreamTest('DOWNLOAD');
            await runMultiStreamTest('UPLOAD');
            setStatus('finished');
            setHistory(h => [{ ping: ping, down: download, up: upload, date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
        } catch (e) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#05070a] text-white selection:bg-blue-500/30">
            <Helmet>
                <title>Free Internet Speed Test – Check Download, Upload & Ping Online</title>
            </Helmet>

            <div className="max-w-5xl mx-auto px-4">
                {/* Result Bar (Pro Layout) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 bg-slate-900 shadow-2xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />
                    
                    <div className="flex gap-12 z-10">
                        <div className="text-center group">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-blue-400 transition-colors">
                                <ArrowDown className="w-3 h-3" /> DOWNLOAD <span className="text-[8px] opacity-40">Mbps</span>
                            </div>
                            <div className="text-4xl font-black text-white tabular-nums drop-shadow-lg transition-transform group-hover:scale-110">{download > 0 ? download.toFixed(2) : '--'}</div>
                        </div>
                        <div className="text-center group">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-purple-400 transition-colors">
                                <ArrowUp className="w-3 h-3" /> UPLOAD <span className="text-[8px] opacity-40">Mbps</span>
                            </div>
                            <div className="text-4xl font-black text-white tabular-nums drop-shadow-lg transition-transform group-hover:scale-110">{upload > 0 ? upload.toFixed(2) : '--'}</div>
                        </div>
                    </div>

                    <div className="flex gap-6 z-10 bg-black/40 px-8 py-4 rounded-3xl border border-white/5">
                        <div className="text-center border-r border-white/5 pr-6">
                            <div className="text-[9px] font-black text-slate-600 uppercase mb-1">Ping <span className="text-[7px] opacity-40">ms</span></div>
                            <div className="text-xl font-bold text-blue-400">{ping || '--'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[9px] font-black text-slate-600 uppercase mb-1">Jitter <span className="text-[7px] opacity-40">ms</span></div>
                            <div className="text-xl font-bold text-purple-400">{jitter || '--'}</div>
                        </div>
                    </div>
                </div>

                {/* Main Gauge Stage */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-[60px] p-12 rounded-[4rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center gap-12 min-h-[550px] relative">
                        
                        {/* Status Icons */}
                        <div className="flex gap-6 opacity-30 group-hover:opacity-100 transition-opacity">
                            <History className="w-5 h-5 text-blue-500" />
                            <Cpu className="w-5 h-5 text-green-500" />
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <Globe className="w-5 h-5 text-purple-500" />
                        </div>

                        <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={status === 'testing'} />

                        <div className="w-full max-w-sm text-center">
                            {status === 'idle' || status === 'finished' || status === 'error' ? (
                                <button onClick={startTest} className="group w-64 h-64 bg-transparent border-4 border-blue-600 rounded-full flex flex-col items-center justify-center hover:bg-blue-600 transition-all duration-500 shadow-[0_0_50px_rgba(37,99,235,0.2)] active:scale-95 mx-auto">
                                    <span className="text-4xl font-black italic uppercase tracking-tighter group-hover:scale-125 transition-transform">{status === 'finished' ? 'RETEST' : 'GO'}</span>
                                    <div className="text-[9px] font-bold text-blue-400 group-hover:text-white mt-1 uppercase tracking-[0.3em]">StudentAI Node</div>
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-center gap-1">
                                        {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-6 bg-blue-500 rounded-full animate-[loading_1.5s_infinite]" style={{ animationDelay: `${i*0.1}s` }} />)}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{phase} SEQUENCE ACTIVE</p>
                                </div>
                            )}
                        </div>

                        {/* Provider Info Footer */}
                        <div className="w-full flex justify-between items-center mt-8 px-8 py-5 bg-black/40 rounded-3xl border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-blue-500" />
                                <div>{ipInfo.isp} <span className="opacity-30 ml-2">{ipInfo.ip}</span></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-purple-500" />
                                <div>{ipInfo.city} <span className="opacity-30 ml-2">India</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        {/* Ads Sidebar */}
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] text-center shadow-xl">
                            <div className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] mb-8">Sponsored</div>
                            <div className="h-48 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-slate-800 text-xs font-bold italic">
                                AdSense Unit 1
                            </div>
                        </div>

                        {/* History or Provider Pulse */}
                        <div className="bg-slate-900/60 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> RATE YOUR PROVIDER
                            </h3>
                            <div className="flex justify-center gap-2 mb-8 scale-125">
                                {[1,2,3,4,5].map(i => <div key={i} className="w-6 h-6 border-2 border-slate-800 rounded-full hover:bg-yellow-500 hover:border-yellow-500 cursor-pointer transition-colors" />)}
                            </div>
                            <p className="text-[9px] text-slate-600 text-center leading-relaxed italic">Your rating is anonymous and helps other users in Bhopal select the best ISP.</p>
                        </div>
                    </div>
                </div>

                {/* Site Footer Ads */}
                <div className="mt-12 p-10 bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[4rem] text-center">
                    <p className="text-[8px] font-black text-slate-800 uppercase tracking-[0.5em] mb-4">Diagnostic Ad Space</p>
                    <div className="h-24 flex items-center justify-center text-slate-900 font-black italic">AdSense Unit 2</div>
                </div>
            </div>
        </div>
    );
}
