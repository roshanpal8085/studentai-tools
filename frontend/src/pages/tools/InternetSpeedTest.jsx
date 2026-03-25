import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Activity, ArrowDown, ArrowUp, History, RefreshCw, AlertCircle, Share2, Copy, CheckCircle2, User, MapPin } from 'lucide-react';

const DOWNLOAD_SIZE = 1024 * 1024 * 30; // 30MB total
const PARALLEL_STREAMS = 3;             // Multi-connection for saturation

const getGaugeAngle = (mbps) => {
    if (mbps <= 0) return -135;
    if (mbps <= 10) return -135 + (mbps / 10) * 54; 
    if (mbps <= 50) return -81 + ((mbps - 10) / 40) * 54; 
    if (mbps <= 100) return -27 + ((mbps - 50) / 50) * 54; 
    if (mbps <= 500) return 27 + ((mbps - 100) / 400) * 81; 
    return 108 + Math.min(((mbps - 500) / 500) * 27, 27); 
};

const CompactGauge = ({ value, phase, isTesting }) => {
    const angle = getGaugeAngle(value);
    const strokeDasharray = 157; // 2 * PI * 25 (r=25)
    const percentage = (angle + 135) / 270;

    return (
        <div className="relative flex flex-col items-center">
            <div className={`absolute inset-0 blur-[60px] rounded-full opacity-10 duration-1000 ${isTesting ? 'animate-pulse' : ''}`} style={{ backgroundColor: phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6' }} />
            
            <div className="relative w-56 h-56 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform rotate-[135deg]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" strokeDasharray="188.5" strokeDashoffset="47.1" strokeLinecap="round" />
                    <circle 
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        stroke={phase === 'UPLOAD' ? '#a78bfa' : '#3b82f6'} 
                        strokeWidth="10" 
                        strokeDasharray="188.5" 
                        strokeDashoffset={188.5 - (188.5 * percentage * 0.75)} 
                        className="transition-all duration-300 ease-out"
                        strokeLinecap="round" 
                    />
                </svg>

                <div 
                    className="absolute w-1 h-24 bg-gradient-to-t from-white to-transparent origin-bottom transition-transform duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ transform: `rotate(${angle}deg)`, bottom: '50%' }}
                />

                <div className="text-center z-10 pt-4">
                    <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                        {value > 0 ? value.toFixed(1) : 'GO'}
                    </div>
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Mbps</div>
                </div>
            </div>
        </div>
    );
};

export default function InternetSpeedTest() {
    const [status, setStatus] = useState('idle'); 
    const [phase, setPhase] = useState(''); 
    const [ping, setPing] = useState(null);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [ipInfo, setIpInfo] = useState({ isp: 'Detecting...', city: 'Bhopal' });
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('st_history_v12') || '[]'));
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        localStorage.setItem('st_history_v12', JSON.stringify(history));
        fetch('https://ipapi.co/json/').then(r => r.json()).then(data => {
            setIpInfo({ isp: data.org, city: data.city });
        }).catch(() => {});
    }, [history]);

    const runPing = async () => {
        setPhase('PING');
        const samples = [];
        for (let i = 0; i < 5; i++) {
            const start = performance.now();
            await fetch('/api/ping?t=' + Date.now(), { cache: 'no-store' });
            samples.push(performance.now() - start);
        }
        setPing((samples.reduce((a, b) => a + b) / samples.length).toFixed(1));
    };

    const runDownload = () => {
        return new Promise((resolve, reject) => {
            setPhase('DOWNLOAD');
            const start = performance.now();
            const streams = [];
            const streamLoads = new Array(PARALLEL_STREAMS).fill(0);
            
            for (let i = 0; i < PARALLEL_STREAMS; i++) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `/api/download-test?size=${DOWNLOAD_SIZE / PARALLEL_STREAMS}&t=${Date.now() + i}`, true);
                xhr.responseType = 'blob';

                xhr.onprogress = (e) => {
                    const elapsed = (performance.now() - start) / 1000;
                    if (elapsed > 0.3) { // Ignore TCP slow-start (first 300ms)
                        streamLoads[i] = e.loaded;
                        const totalLoaded = streamLoads.reduce((a, b) => a + b, 0);
                        const currentMbps = (totalLoaded * 8) / (elapsed * 1000000);
                        setDownload(currentMbps);
                    }
                };
                xhr.onload = () => { streams.push(true); if (streams.length === PARALLEL_STREAMS) resolve(); };
                xhr.onerror = () => reject();
                xhr.send();
            }
        });
    };

    const runUpload = () => {
        return new Promise((resolve, reject) => {
            setPhase('UPLOAD');
            const start = performance.now();
            const dataSize = 1024 * 1024 * 5;
            const streams = [];
            
            for (let i = 0; i < 2; i++) { // Dual stream upload
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `/api/upload-test?t=${Date.now() + i}`, true);
                xhr.upload.onprogress = (e) => {
                    const elapsed = (performance.now() - start) / 1000;
                    if (elapsed > 0.3) {
                        const mbps = (e.loaded * 8) / (elapsed * 1000000);
                        setUpload(mbps);
                    }
                };
                xhr.onload = () => { streams.push(true); if (streams.length === 2) resolve(); };
                xhr.send(new Uint8Array(dataSize));
            }
        });
    };

    const startTest = async () => {
        setStatus('testing'); setDownload(0); setUpload(0); setPing(null);
        try {
            await runPing();
            await runDownload();
            await runUpload();
            setStatus('finished');
            setHistory(h => [{ ping, down: download.toFixed(1), up: upload.toFixed(1), date: new Date().toLocaleTimeString() }, ...h].slice(0, 3));
        } catch { setStatus('error'); }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#05070a] text-white selection:bg-blue-500/30">
            <Helmet><title>SpeedPulse Compact — Ultra Accurate Speed Test</title></Helmet>

            <div className="max-w-3xl mx-auto px-4">
                {/* Header Compact Mode */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-slate-900 shadow-2xl p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                    
                    <div className="flex gap-8 z-10 w-full sm:w-auto justify-around">
                        <div className="text-center group">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">DOWNLOAD</div>
                            <div className="text-2xl font-black text-white tabular-nums drop-shadow-lg">{download > 0 ? download.toFixed(1) : '--'}</div>
                        </div>
                        <div className="text-center group">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-purple-400 transition-colors">UPLOAD</div>
                            <div className="text-2xl font-black text-white tabular-nums drop-shadow-lg">{upload > 0 ? upload.toFixed(1) : '--'}</div>
                        </div>
                    </div>

                    <div className="flex gap-4 z-10 bg-black/40 px-6 py-3 rounded-2xl border border-white/5 w-full sm:w-auto justify-center">
                        <div className="text-center border-r border-white/5 pr-4">
                            <div className="text-[8px] font-black text-slate-600 uppercase mb-0.5">Ping</div>
                            <div className="text-lg font-bold text-blue-400">{ping || '--'} <span className="text-[8px] opacity-30 italic">ms</span></div>
                        </div>
                        <div className="text-center">
                            <div className="text-[8px] font-black text-slate-600 uppercase mb-0.5">ISP</div>
                            <div className="text-[10px] font-black text-white max-w-[80px] truncate">{ipInfo.isp}</div>
                        </div>
                    </div>
                </div>

                {/* Gauge Area Compact */}
                <div className="bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-800" />
                    
                    <CompactGauge value={phase === 'UPLOAD' ? upload : download} phase={phase} isTesting={status === 'testing'} />

                    <div className="w-full text-center z-10">
                        {status === 'idle' || status === 'finished' || status === 'error' ? (
                            <button onClick={startTest} className="w-40 h-40 bg-transparent border-4 border-blue-600 rounded-full flex flex-col items-center justify-center hover:bg-blue-600 transition-all duration-500 shadow-[0_0_30px_rgba(37,99,235,0.2)] active:scale-95 mx-auto relative group">
                                <span className="text-3xl font-black italic uppercase tracking-tighter group-hover:scale-110 transition-transform">GO</span>
                                {status === 'finished' && <span className="absolute -bottom-4 bg-blue-600 text-[8px] px-3 py-1 rounded-full font-black animate-bounce shadow-xl">DONE</span>}
                            </button>
                        ) : (
                            <div className="flex flex-col items-center animate-pulse">
                                <Activity className="w-8 h-8 text-blue-500 mb-2 animate-spin" />
                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{phase} SEQUENCE</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer History Small */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-slate-900 border border-white/5 p-6 rounded-[2.5rem] shadow-xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><History className="w-3 h-3" /> RECENT RUNS</h3>
                            <button onClick={() => { navigator.clipboard.writeText(`⬇️ ${download.toFixed(1)} ⬆️ ${upload.toFixed(1)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-slate-600" />}
                            </button>
                        </div>
                        <div className="space-y-2">
                            {history.length > 0 ? history.map((log, i) => (
                                <div key={i} className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-white/5 text-[9px] font-black">
                                    <span className="text-slate-600 italic">{log.date}</span>
                                    <div className="flex gap-4">
                                        <span className="text-blue-500">↓ {log.down}</span>
                                        <span className="text-purple-500">↑ {log.up}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-[9px] text-slate-800 text-center py-4 italic">No sessions recorded.</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:w-48 bg-slate-900 border border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-center gap-4 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl"><User className="w-3 h-3 text-blue-400" /></div>
                            <div className="text-[8px] font-black text-slate-500 uppercase">Provider<div className="text-white text-[9px] truncate max-w-[80px]">{ipInfo.isp}</div></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-xl"><MapPin className="w-3 h-3 text-purple-400" /></div>
                            <div className="text-[8px] font-black text-slate-500 uppercase">Location<div className="text-white text-[9px] truncate max-w-[80px]">{ipInfo.city}</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
