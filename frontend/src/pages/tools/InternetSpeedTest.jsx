import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, AlertCircle, Share2, Copy, CheckCircle2, User, MapPin } from 'lucide-react';

// Configuration
const DOWNLOAD_SIZE = 1024 * 1024 * 10; // 10MB
const UPLOAD_SIZE = 1024 * 1024 * 5;    // 5MB

// Non-Linear Scale Mapping (Matches Speedtest.net)
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
    const strokeDasharray = 188.5;
    const percentage = (angle + 135) / 270;

    return (
        <div className="relative flex flex-col items-center">
            <div className={`absolute inset-0 blur-[80px] rounded-full opacity-10 duration-1000 ${isTesting ? 'animate-pulse' : ''}`} style={{ backgroundColor: phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6' }} />
            
            <div className="relative w-72 h-72 flex items-center justify-center scale-90 sm:scale-100">
                <svg className="absolute inset-0 w-full h-full transform rotate-[135deg]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="6" strokeDasharray="188.5" strokeDashoffset="47.1" strokeLinecap="round" />
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
                </svg>

                <div 
                    className="absolute w-1 h-32 bg-gradient-to-t from-white to-transparent origin-bottom transition-transform duration-300 ease-out rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    style={{ transform: `rotate(${angle}deg)`, bottom: '50%' }}
                />

                <div className="text-center z-10 pt-12">
                    <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
                        {value.toFixed(2)}
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Mbps</div>
                </div>
            </div>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); // idle, testing, finished, error
    const [phase, setPhase] = useState(''); // PING, DOWNLOAD, UPLOAD
    const [progress, setProgress] = useState(0);
    const [ping, setPing] = useState(null);
    const [jitter, setJitter] = useState(null);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [ipInfo, setIpInfo] = useState({ isp: 'Detecting...', city: 'Bhopal' });
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('st_history_v11') || '[]'));
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        localStorage.setItem('st_history_v11', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(data => {
            setIpInfo({ isp: data.org, city: data.city });
        }).catch(() => {});
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const samples = [];
        for (let i = 0; i < 5; i++) {
            const start = performance.now();
            await fetch('/api/ping?cache=' + Date.now(), { cache: 'no-store' });
            samples.push(performance.now() - start);
        }
        const avgPing = samples.reduce((a, b) => a + b) / samples.length;
        setPing(avgPing.toFixed(2));
        setJitter((Math.max(...samples) - Math.min(...samples)).toFixed(2));
    };

    const runDownload = () => {
        return new Promise((resolve, reject) => {
            setPhase('DOWNLOAD');
            const start = performance.now();
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/api/download-test?size=${DOWNLOAD_SIZE}&t=${Date.now()}`, true);
            xhr.responseType = 'blob';
            xhr.setRequestHeader('Cache-Control', 'no-cache');

            xhr.onprogress = (e) => {
                const now = performance.now();
                const elapsed = (now - start) / 1000;
                if (elapsed > 0) {
                    const mbps = (e.loaded * 8) / (elapsed * 1000000);
                    setDownload(mbps);
                    setProgress(10 + (e.loaded / DOWNLOAD_SIZE) * 40);
                }
            };

            xhr.onload = () => {
                const totalTime = (performance.now() - start) / 1000;
                const finalMbps = (DOWNLOAD_SIZE * 8) / (totalTime * 1000000);
                setDownload(finalMbps);
                resolve();
            };
            xhr.onerror = () => reject('Download Failed');
            xhr.send();
        });
    };

    const runUpload = () => {
        return new Promise((resolve, reject) => {
            setPhase('UPLOAD');
            const data = new Uint8Array(UPLOAD_SIZE);
            const start = performance.now();
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `/api/upload-test?t=${Date.now()}`, true);
            
            xhr.upload.onprogress = (e) => {
                const now = performance.now();
                const elapsed = (now - start) / 1000;
                if (elapsed > 0) {
                    const mbps = (e.loaded * 8) / (elapsed * 1000000);
                    setUpload(mbps);
                    setProgress(50 + (e.loaded / UPLOAD_SIZE) * 50);
                }
            };

            xhr.onload = () => {
                const totalTime = (performance.now() - start) / 1000;
                const finalMbps = (UPLOAD_SIZE * 8) / (totalTime * 1000000);
                setUpload(finalMbps);
                resolve();
            };
            xhr.onerror = () => reject('Upload Failed');
            xhr.send(data);
        });
    };

    const startTest = async () => {
        setStatus('testing'); setProgress(0); setDownload(0); setUpload(0); setPing(null);
        try {
            await runPing();
            await runDownload();
            await runUpload();
            setStatus('finished');
            setHistory(h => [{ ping, down: download.toFixed(2), up: upload.toFixed(2), date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
        } catch (e) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-[#05070a] text-white selection:bg-blue-500/30">
            <Helmet>
                <title>Free Internet Speed Test – Check Download, Upload & Ping Online</title>
                <meta name="description" content="Test your internet speed instantly. Accurate download, upload and ping diagnostics." />
            </Helmet>

            <div className="max-w-4xl mx-auto px-4">
                {/* Compact Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
                    
                    <div className="flex gap-8 sm:gap-12 z-10 w-full md:w-auto justify-around sm:justify-start">
                        <div className="text-center sm:text-left">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1"><ArrowDown className="w-3 h-3 text-blue-500" /> DOWNLOAD</div>
                            <div className="text-3xl font-black text-white tabular-nums">{download > 0 ? download.toFixed(2) : '--'} <span className="text-xs opacity-30">Mbps</span></div>
                        </div>
                        <div className="text-center sm:text-left">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1"><ArrowUp className="w-3 h-3 text-purple-500" /> UPLOAD</div>
                            <div className="text-3xl font-black text-white tabular-nums">{upload > 0 ? upload.toFixed(2) : '--'} <span className="text-xs opacity-30">Mbps</span></div>
                        </div>
                    </div>

                    <div className="flex gap-6 z-10 bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
                        <div className="text-center border-r border-white/5 pr-6">
                            <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Ping</div>
                            <div className="text-lg font-bold tabular-nums">{ping || '--'} <span className="text-[9px] opacity-30">ms</span></div>
                        </div>
                        <div className="text-center">
                            <div className="text-[9px] font-black text-purple-400 uppercase mb-1">Jitter</div>
                            <div className="text-lg font-bold tabular-nums">{jitter || '--'} <span className="text-[9px] opacity-30">ms</span></div>
                        </div>
                    </div>
                </div>

                {/* Compact Testing Core */}
                <div className="bg-slate-900/40 backdrop-blur-3xl p-8 sm:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                        <div className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>

                    <Gauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={status === 'testing'} />

                    <div className="w-full text-center">
                        {status === 'idle' || status === 'finished' || status === 'error' ? (
                            <button onClick={startTest} className="group w-48 h-48 sm:w-56 sm:h-56 border-4 border-blue-600 rounded-full flex flex-col items-center justify-center hover:bg-blue-600 transition-all duration-300 active:scale-95 shadow-2xl shadow-blue-500/10 mx-auto">
                                <span className="text-4xl font-black italic uppercase tracking-tighter group-hover:scale-110 transition-transform">{status === 'finished' ? 'RETEST' : 'GO'}</span>
                                <div className="text-[9px] font-bold text-blue-400 group-hover:text-white mt-1 uppercase tracking-widest">StudentAI Engine</div>
                            </button>
                        ) : (
                            <div className="space-y-3 animate-pulse">
                                <Activity className="w-10 h-10 text-blue-500 mx-auto animate-spin" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{phase} DIAGNOSTICS...</p>
                            </div>
                        )}
                    </div>

                    <div className="w-full flex justify-between items-center px-6 py-4 bg-black/40 rounded-3xl border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-3"><User className="w-4 h-4 text-blue-400" /><span>{ipInfo.isp}</span></div>
                        <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-purple-400" /><span>{ipInfo.city}</span></div>
                    </div>
                </div>

                {/* Analysis History */}
                <div className="mt-8 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6 opacity-60">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><History className="w-4 h-4" /> ANALYSIS HISTORY</h3>
                        <button onClick={() => { navigator.clipboard.writeText(`My Speed: ⬇️ ${download.toFixed(2)} ⬆️ ${upload.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="hover:bg-white/5 p-2 rounded-lg transition-colors">
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                        </button>
                    </div>
                    <div className="space-y-3">
                        {history.length > 0 ? history.map((log, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                                <span className="text-[10px] font-black text-slate-600">{log.date}</span>
                                <div className="flex gap-6 text-xs font-black">
                                    <span className="text-blue-500/80">↓ {log.down}</span>
                                    <span className="text-purple-500/80">↑ {log.up}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-[10px] text-slate-700 italic text-center py-4">No records found. Start a test to begin analysis.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
