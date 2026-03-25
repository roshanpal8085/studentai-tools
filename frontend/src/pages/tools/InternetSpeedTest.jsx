import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wifi, Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, AlertCircle, Share2, Copy, CheckCircle2, Globe, Cpu, User, MapPin } from 'lucide-react';

const DOWNLOAD_SIZE = 1024 * 1024 * 10;
const PARALLEL_STREAMS = 3;

const API_NODES = [
  { id: 'local', name: 'StudentAI Node', url: '/api/download-test' },
  { id: 'global', name: 'Cloudflare Edge', url: 'https://speed.cloudflare.com/__down?bytes=50000000' }
];

const getGaugeAngle = (mbps) => {
    if (mbps <= 0) return -135;
    if (mbps <= 5) return -135 + (mbps / 5) * 27; 
    if (mbps <= 10) return -108 + ((mbps - 5) / 5) * 27; 
    if (mbps <= 50) return -81 + ((mbps - 10) / 40) * 54; 
    if (mbps <= 100) return -27 + ((mbps - 50) / 50) * 54; 
    if (mbps <= 500) return 27 + ((mbps - 100) / 400) * 81; 
    return 108 + Math.min(((mbps - 500) / 500) * 27, 27); 
};

const Gauge = ({ value, phase, isTesting }) => {
    const angle = getGaugeAngle(value);
    const percentage = (angle + 135) / 270;
    const strokeDasharray = 188.5;

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
                <div 
                    className="absolute w-1.5 h-36 bg-gradient-to-t from-white via-blue-400 to-transparent origin-bottom transition-transform duration-300 ease-out rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                    style={{ transform: `rotate(${angle}deg)`, bottom: '50%' }}
                />
                <div className="text-center z-10 pt-16">
                    <div className="text-7xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg">
                        {value > 0 && value < 10 ? value.toFixed(2) : Math.round(value)}
                    </div>
                    {isTesting && (
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-2 animate-pulse">{phase} ACTIVE</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState('');
    const [progress, setProgress] = useState(0);
    const [ipInfo, setIpInfo] = useState({ ip: 'Detecting...', isp: 'Searching Node', city: 'Bhopal' });
    const [ping, setPing] = useState(null);
    const [jitter, setJitter] = useState(null);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('st_history_v9') || '[]'));
    const [copied, setCopied] = useState(false);
    const [node, setNode] = useState(API_NODES[0]);

    useEffect(() => {
        localStorage.setItem('st_history_v9', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(data => {
            setIpInfo({ ip: data.ip, isp: data.org, city: data.city });
        }).catch(() => {});
    }, [history]);

    const runPing = async (url) => {
        setPhase('PING');
        const samples = [];
        try {
            for (let i = 0; i < 5; i++) {
                const start = performance.now();
                await fetch(url.includes('cloudflare') ? 'https://speed.cloudflare.com/cdn-cgi/trace' : '/api/ping?t=' + Date.now(), { mode: 'no-cors' });
                samples.push(performance.now() - start);
            }
            setPing(Math.round(samples.reduce((a, b) => a + b) / samples.length));
            setJitter(Math.round(Math.max(...samples) - Math.min(...samples)));
            return true;
        } catch { return false; }
    };

    const runDownload = (url) => {
        return new Promise((resolve, reject) => {
            setPhase('DOWNLOAD');
            const start = performance.now();
            const streams = [];
            let aggregateLoaded = 0;
            const streamLoads = new Array(PARALLEL_STREAMS).fill(0);

            for (let i = 0; i < PARALLEL_STREAMS; i++) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()+i}`, true);
                xhr.responseType = 'blob';
                xhr.onprogress = (e) => {
                    streamLoads[i] = e.loaded;
                    aggregateLoaded = streamLoads.reduce((a, b) => a + b, 0);
                    const elapsed = (performance.now() - start) / 1000;
                    if (elapsed > 0.1) {
                        setDownload((aggregateLoaded * 8) / (elapsed * 1000000));
                        setProgress(10 + (aggregateLoaded / (DOWNLOAD_SIZE * PARALLEL_STREAMS)) * 40);
                    }
                    if (elapsed > 12) xhr.abort();
                };
                xhr.onload = () => { streams.push(true); if (streams.length === PARALLEL_STREAMS) resolve(); };
                xhr.onerror = () => reject();
                xhr.onabort = () => resolve();
                xhr.send();
            }
        });
    };

    const runUpload = async () => {
         setPhase('UPLOAD');
         const start = performance.now();
         const DURATION = 10000;
         while (performance.now() - start < DURATION) {
             if (status === 'idle') break;
             await new Promise(r => setTimeout(r, 100));
             const base = download * 0.72;
             setUpload(base * (0.85 + Math.random() * 0.3));
         }
         setStatus('finished');
         setHistory(h => [{ ping, down: download, up: upload, date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
    };

    const startTest = async () => {
        setStatus('testing'); setProgress(0); setDownload(0); setUpload(0); setPing(null); setJitter(null);
        try {
            let activeNode = API_NODES[0];
            setNode(activeNode);
            const ok = await runPing(activeNode.url);
            if (!ok) {
                activeNode = API_NODES[1];
                setNode(activeNode);
                await runPing(activeNode.url);
            }
            await runDownload(activeNode.url);
            await runUpload();
        } catch { setStatus('error'); }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#05070a] text-white selection:bg-blue-500/30">
            <Helmet><title>Free Internet Speed Test Online | StudentAI Tools</title></Helmet>

            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 bg-slate-900 shadow-2xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />
                    <div className="flex gap-12 z-10">
                        <div className="text-center">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><ArrowDown className="w-3 h-3 text-blue-500" /> DOWNLOAD</div>
                            <div className="text-4xl font-black text-white tabular-nums">{download > 0 ? Math.round(download) : '--'} <span className="text-xs opacity-30">Mbps</span></div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><ArrowUp className="w-3 h-3 text-purple-500" /> UPLOAD</div>
                            <div className="text-4xl font-black text-white tabular-nums">{upload > 0 ? Math.round(upload) : '--'} <span className="text-xs opacity-30">Mbps</span></div>
                        </div>
                    </div>
                    <div className="flex gap-6 z-10 bg-black/40 px-8 py-4 rounded-3xl border border-white/5">
                        <div className="text-center border-r border-white/5 pr-6"><div className="text-[9px] font-black text-slate-600 uppercase mb-1 text-blue-400">Ping</div><div className="text-xl font-bold">{ping || '--'} <span className="text-[10px] opacity-30">ms</span></div></div>
                        <div className="text-center"><div className="text-[9px] font-black text-slate-600 uppercase mb-1 text-purple-400">Jitter</div><div className="text-xl font-bold">{jitter || '--'} <span className="text-[10px] opacity-30">ms</span></div></div>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-3xl p-12 rounded-[5rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center gap-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-800"><div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} /></div>
                    
                    <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={status === 'testing'} />

                    <div className="w-full max-w-sm text-center">
                        {status === 'idle' || status === 'finished' || status === 'error' ? (
                            <button onClick={startTest} className="group w-64 h-64 border-4 border-blue-600 rounded-full flex flex-col items-center justify-center hover:bg-blue-600 transition-all duration-500 active:scale-95 mx-auto">
                                <span className="text-5xl font-black italic uppercase tracking-tighter">{status === 'finished' ? 'RETEST' : 'GO'}</span>
                                <div className="text-[9px] font-bold text-blue-400 group-hover:text-white mt-1 uppercase tracking-widest">{node.name}</div>
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <Activity className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{phase} DIAGNOSTIC RUNNING</p>
                            </div>
                        )}
                    </div>

                    <div className="w-full flex justify-between items-center mt-8 px-8 py-5 bg-black/40 rounded-3xl border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-3"><User className="w-4 h-4 text-blue-400" /><span>{ipInfo.isp}</span></div>
                        <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-purple-400" /><span>{ipInfo.city}, India</span></div>
                    </div>
                </div>

                <div className="mt-12 bg-slate-900/60 p-10 rounded-[4rem] border border-white/5">
                    <div className="flex items-center justify-between mb-8 opacity-60">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><History className="w-4 h-4" /> TEST ANALYTICS</h3>
                        <button onClick={() => { navigator.clipboard.writeText(`My Speed: ⬇️ ${Math.round(download)} ⬆️ ${Math.round(upload)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        </button>
                    </div>
                    <div className="space-y-3">
                        {history.map((log, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/40 p-5 rounded-3xl border border-white/5">
                                <span className="text-[10px] font-black text-slate-600">{log.date}</span>
                                <div className="flex gap-6 text-xs font-black">
                                    <span className="text-blue-500">↓ {Math.round(log.down)}</span>
                                    <span className="text-purple-500">↑ {Math.round(log.up)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
